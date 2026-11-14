/**
 * Post-build obfuscation script.
 * 1. Terser — minify + mangle all variable/function names
 * 2. Custom string encoding — encode remaining string literals as String.fromCharCode
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { minify } from "terser";

const DIST = new URL("../dist", import.meta.url).pathname;

/** Encode a string value to a runtime expression */
function encodeString(str) {
  const codes = [...str].map((c) => c.charCodeAt(0));
  return `String.fromCharCode(${codes.join(",")})`;
}

/** Skip a template literal starting at i (the opening backtick). Returns index after closing backtick. */
function skipTemplate(code, i) {
  let j = i + 1;
  while (j < code.length) {
    if (code[j] === "\\" && j + 1 < code.length) { j += 2; continue; }
    if (code[j] === "$" && code[j + 1] === "{") {
      j = skipTemplateExpr(code, j + 2);
      continue;
    }
    if (code[j] === "`") return j + 1;
    j++;
  }
  return j;
}

/** Skip a template expression starting right after ${. Returns index after the closing }. */
function skipTemplateExpr(code, i) {
  let j = i;
  let braces = 1;
  while (j < code.length && braces > 0) {
    if (code[j] === "\\" && j + 1 < code.length) { j += 2; continue; }
    if (code[j] === "{") { braces++; j++; continue; }
    if (code[j] === "}") { braces--; if (braces === 0) return j + 1; j++; continue; }
    if (code[j] === "`") { j = skipTemplate(code, j); continue; }
    if (code[j] === '"' || code[j] === "'") {
      const q = code[j]; j++;
      while (j < code.length) {
        if (code[j] === "\\") { j += 2; continue; }
        if (code[j] === q) { j++; break; }
        j++;
      }
      continue;
    }
    if (code[j] === "/" && code[j + 1] === "/") {
      const end = code.indexOf("\n", j);
      j = end === -1 ? code.length : end;
      continue;
    }
    if (code[j] === "/" && code[j + 1] === "*") {
      const end = code.indexOf("*/", j + 2);
      j = end === -1 ? code.length : end + 2;
      continue;
    }
    j++;
  }
  return j;
}

/** Tokenize JS and encode string literals, preserving regex, templates, imports, and object keys */
function encodeStrings(code) {
  const tokens = [];
  let i = 0;

  while (i < code.length) {
    // Single-line comment
    if (code[i] === "/" && code[i + 1] === "/") {
      const end = code.indexOf("\n", i);
      i = end === -1 ? code.length : end;
      continue;
    }

    // Multi-line comment
    if (code[i] === "/" && code[i + 1] === "*") {
      const end = code.indexOf("*/", i + 2);
      i = end === -1 ? code.length : end + 2;
      continue;
    }

    // Regex literal
    if (code[i] === "/") {
      const prevNonSpace = code.slice(0, i).replace(/\s+$/, "").slice(-1);
      const regexPrecedes = "=(!&|?:~^%[{};,+-*\n".includes(prevNonSpace) || i === 0;
      if (regexPrecedes && code[i + 1] !== "/" && code[i + 1] !== "*") {
        let j = i + 1;
        let inCharClass = false;
        while (j < code.length) {
          if (code[j] === "\\" && j + 1 < code.length) { j += 2; continue; }
          if (code[j] === "[") { inCharClass = true; j++; continue; }
          if (code[j] === "]") { inCharClass = false; j++; continue; }
          if (code[j] === "/" && !inCharClass) { j++; break; }
          j++;
        }
        while (j < code.length && /[gimsuy]/.test(code[j])) j++;
        tokens.push(code.slice(i, j));
        i = j;
        continue;
      }
    }

    // Template literal — keep as-is
    if (code[i] === "`") {
      const j = skipTemplate(code, i);
      tokens.push(code.slice(i, j));
      i = j;
      continue;
    }

    // String literal
    if (code[i] === '"' || code[i] === "'") {
      const quote = code[i];
      let j = i + 1;
      let str = "";
      while (j < code.length) {
        if (code[j] === "\\") {
          const next = code[j + 1];
          if (next === "n") str += "\n";
          else if (next === "t") str += "\t";
          else if (next === "r") str += "\r";
          else if (next === "\\") str += "\\";
          else if (next === quote) str += quote;
          else if (next === "0") str += "\0";
          else str += next;
          j += 2;
          continue;
        }
        if (code[j] === quote) { j++; break; }
        str += code[j];
        j++;
      }

      const before = code.slice(Math.max(0, i - 20), i);
      const isImport = /(?:from|import)\s*$/.test(before);
      const isRequire = /require\s*\(\s*$/.test(before);
      const after = code.slice(j).trimStart();
      const isObjKey = after.startsWith(":");

      if (isImport || isRequire || str.length <= 2 || isObjKey) {
        tokens.push(code.slice(i, j));
      } else {
        tokens.push(`(${encodeString(str)})`);
      }
      i = j;
      continue;
    }

    tokens.push(code[i]);
    i++;
  }

  return tokens.join("");
}

/** Process a single JS file */
async function obfuscateFile(filePath) {
  let code = await readFile(filePath, "utf-8");

  // Step 1: Terser — minify + mangle variable/function names
  const result = await minify(code, {
    module: true,
    compress: {
      dead_code: true,
      drop_console: false,
      passes: 2,
      booleans_as_integers: true,
      ecma: 2020,
    },
    mangle: {
      toplevel: false,       // keep exports accessible
      properties: false,     // don't mangle property access
    },
    format: {
      comments: false,
      semicolons: true,
      wrap_iife: true,
    },
  });

  if (!result.code) throw new Error(`Terser failed on ${filePath}`);
  code = result.code;

  // Step 2: Encode string literals
  code = encodeStrings(code);

  await writeFile(filePath, code, "utf-8");
}

/** Recursively find all .js files */
async function findJsFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findJsFiles(full)));
    } else if (entry.name.endsWith(".js") && !entry.name.endsWith(".d.ts")) {
      files.push(full);
    }
  }
  return files;
}

const files = await findJsFiles(DIST);
for (const file of files) {
  await obfuscateFile(file);
  console.log(`obfuscated: ${file}`);
}
console.log(`done — ${files.length} files processed`);
