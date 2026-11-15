import sanitizeHtml from "sanitize-html";
import type { DiscordChannel, DiscordRole } from "../types/discord.js";

/**
 * Parses Discord markdown content into safe HTML.
 * Handles bold, italic, underline, strikethrough, code, spoilers,
 * block quotes, headers, lists, and mentions.
 */

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "strong", "em", "u", "s", "code", "pre", "br", "span",
    "div", "blockquote", "h1", "h2", "h3", "ul", "ol", "li", "a",
    "img",
  ],
  allowedAttributes: {
    span: ["class", "data-*", "style"],
    div: ["class", "data-*"],
    a: ["href", "class", "target", "rel"],
    code: ["class"],
    pre: ["class"],
    img: ["src", "alt", "class", "width", "height", "loading"],
    blockquote: ["class"],
    ul: ["class"],
    li: ["class"],
  },
  allowedStyles: {
    span: {
      'color': [/^#[0-9a-fA-F]{6}$/],
      'background-color': [/^rgba\(\d{1,3},\d{1,3},\d{1,3},[\d.]+\)$/],
    },
  },
  allowedSchemes: ["https", "http"],
  allowedSchemesByTag: {
    img: ["https", "http", "data"],
  },
};

/** Escape HTML special characters */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ─── Lightweight syntax highlighter (zero dependencies) ───

type TokenRule = [cls: string, pattern: RegExp];

const COMMON_NUMBER: TokenRule = ["hljs-number", /\b(?:0[xXbBoO][\da-fA-F_]+|\d[\d_]*(?:\.[\d_]*)?(?:[eE][+-]?\d+)?)\b/];
const COMMON_STRING: TokenRule = ["hljs-string", /(?:"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|`(?:\\[\s\S]|[^`\\])*`)/];
const COMMON_STRING_NO_TEMPLATE: TokenRule = ["hljs-string", /(?:"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*')/];
const COMMON_BOOL: TokenRule = ["hljs-literal", /\b(?:true|false|null|undefined|nil|None|True|False)\b/];

function buildLang(rules: TokenRule[]): RegExp {
  return new RegExp(rules.map(([, r]) => `(${r.source})`).join("|"), "gm");
}

const LANG_RULES: Record<string, { pattern: RegExp; classes: string[] }> = {};

function defLang(names: string[], rules: TokenRule[]) {
  const pattern = buildLang(rules);
  const classes = rules.map(([c]) => c);
  for (const n of names) LANG_RULES[n] = { pattern, classes };
}

// JavaScript / TypeScript
defLang(["js", "javascript", "ts", "typescript", "jsx", "tsx"], [
  ["hljs-comment", /\/\/[^\n]*|\/\*[\s\S]*?\*\//],
  COMMON_STRING,
  ["hljs-keyword", /\b(?:async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|if|implements|import|in|instanceof|interface|let|new|of|return|static|super|switch|this|throw|try|type|typeof|var|void|while|with|yield|as|is|keyof|readonly|declare|abstract|namespace|module|satisfies|infer)\b/],
  ["hljs-built_in", /\b(?:console|window|document|Math|JSON|Promise|Array|Object|String|Number|Boolean|Map|Set|RegExp|Error|Date|parseInt|parseFloat|setTimeout|setInterval|fetch|require)\b/],
  COMMON_BOOL,
  COMMON_NUMBER,
  ["hljs-function", /\b[a-zA-Z_$][\w$]*(?=\s*\()/],
  ["hljs-property", /(?<=\.)\b[a-zA-Z_$][\w$]*\b/],
]);

// Python
defLang(["python", "py"], [
  ["hljs-comment", /#[^\n]*/],
  ["hljs-string", /(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|f"(?:\\[\s\S]|[^"\\])*"|f'(?:\\[\s\S]|[^'\\])*')/],
  ["hljs-keyword", /\b(?:and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield|match|case)\b/],
  ["hljs-built_in", /\b(?:print|len|range|type|int|str|float|list|dict|set|tuple|bool|input|open|super|isinstance|enumerate|zip|map|filter|sorted|min|max|sum|abs|round|any|all|next|iter|repr|hash|id|getattr|setattr|hasattr)\b/],
  COMMON_BOOL,
  ["hljs-decorator", /@\w+/],
  COMMON_NUMBER,
  ["hljs-function", /\b[a-zA-Z_]\w*(?=\s*\()/],
]);

// CSS / SCSS
defLang(["css", "scss", "less"], [
  ["hljs-comment", /\/\*[\s\S]*?\*\//],
  COMMON_STRING_NO_TEMPLATE,
  ["hljs-keyword", /@(?:import|media|keyframes|font-face|supports|layer|property|charset|namespace)\b/],
  ["hljs-selector", /(?:^|\s)[.#][\w-]+|(?:^|\s)\w+(?=\s*\{)/],
  ["hljs-attr", /[\w-]+(?=\s*:)/],
  COMMON_NUMBER,
  ["hljs-built_in", /\b(?:rgb|rgba|hsl|hsla|calc|var|clamp|min|max|env|url)\b/],
]);

// HTML / XML
defLang(["html", "xml", "svg", "htm"], [
  ["hljs-comment", /&lt;!--[\s\S]*?--&gt;/],
  COMMON_STRING_NO_TEMPLATE,
  ["hljs-tag", /&lt;\/?[\w-]+|\/?\s*&gt;/],
  ["hljs-attr", /\b[\w-]+(?=\s*=)/],
]);

// JSON
defLang(["json", "jsonc"], [
  ["hljs-comment", /\/\/[^\n]*|\/\*[\s\S]*?\*\//],
  ["hljs-attr", /"(?:\\[\s\S]|[^"\\])*"(?=\s*:)/],
  ["hljs-string", /"(?:\\[\s\S]|[^"\\])*"/],
  COMMON_BOOL,
  ["hljs-literal", /\bnull\b/],
  COMMON_NUMBER,
]);

// Bash / Shell
defLang(["bash", "sh", "shell", "zsh", "fish"], [
  ["hljs-comment", /#[^\n]*/],
  COMMON_STRING,
  ["hljs-keyword", /\b(?:if|then|else|elif|fi|for|while|until|do|done|case|esac|in|function|return|local|export|source|alias|unalias|set|unset|declare|readonly|typeset|trap|exec|eval|exit|break|continue|shift|select|coproc|time)\b/],
  ["hljs-built_in", /\b(?:echo|printf|cd|pwd|ls|cat|grep|find|sed|awk|sort|uniq|wc|head|tail|xargs|curl|wget|chmod|chown|mkdir|rmdir|rm|cp|mv|ln|tar|gzip|gunzip|zip|unzip|ssh|scp|git|docker|npm|yarn|bun|pnpm|node|python|pip|sudo|apt|brew|pacman|dnf|yum)\b/],
  ["hljs-variable", /\$\{?[\w]+\}?/],
  COMMON_NUMBER,
]);

// Rust
defLang(["rust", "rs"], [
  ["hljs-comment", /\/\/[^\n]*|\/\*[\s\S]*?\*\//],
  COMMON_STRING_NO_TEMPLATE,
  ["hljs-keyword", /\b(?:as|async|await|break|const|continue|crate|dyn|else|enum|extern|fn|for|if|impl|in|let|loop|match|mod|move|mut|pub|ref|return|self|Self|static|struct|super|trait|type|union|unsafe|use|where|while|yield|abstract|become|box|do|final|macro|override|priv|try|typeof|unsized|virtual)\b/],
  ["hljs-built_in", /\b(?:bool|char|f32|f64|i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|str|String|Vec|Option|Result|Box|Rc|Arc|Cell|RefCell|HashMap|HashSet|BTreeMap|BTreeSet|println|eprintln|format|panic|assert|todo|unimplemented|dbg|vec)\b/],
  COMMON_BOOL,
  COMMON_NUMBER,
  ["hljs-function", /\b[a-zA-Z_]\w*(?=\s*[(<])/],
  ["hljs-macro", /\b\w+!/],
]);

// Go
defLang(["go", "golang"], [
  ["hljs-comment", /\/\/[^\n]*|\/\*[\s\S]*?\*\//],
  COMMON_STRING_NO_TEMPLATE,
  ["hljs-keyword", /\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go|goto|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/],
  ["hljs-built_in", /\b(?:bool|byte|complex64|complex128|error|float32|float64|int|int8|int16|int32|int64|rune|string|uint|uint8|uint16|uint32|uint64|uintptr|append|cap|close|copy|delete|imag|len|make|new|panic|print|println|real|recover|nil|iota)\b/],
  COMMON_BOOL,
  COMMON_NUMBER,
  ["hljs-function", /\b[a-zA-Z_]\w*(?=\s*\()/],
]);

// Java / C# / Kotlin
defLang(["java", "csharp", "cs", "kotlin", "kt"], [
  ["hljs-comment", /\/\/[^\n]*|\/\*[\s\S]*?\*\//],
  COMMON_STRING_NO_TEMPLATE,
  ["hljs-keyword", /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while|var|val|fun|when|object|companion|data|sealed|suspend|inline|override|open|internal|lateinit|async|await|yield|get|set|virtual|using|namespace|struct|delegate|event|where|select|from|is|as|in|out|ref|params|record|init|required)\b/],
  ["hljs-built_in", /\b(?:System|String|Integer|Boolean|Double|Float|List|Map|Set|ArrayList|HashMap|HashSet|Arrays|Collections|Math|Object|Thread|Exception|RuntimeException|IOException|Comparable|Iterable|Stream|Optional|Console|StringBuilder|Regex)\b/],
  COMMON_BOOL,
  COMMON_NUMBER,
  ["hljs-function", /\b[a-zA-Z_]\w*(?=\s*[(<])/],
]);

// C / C++
defLang(["c", "cpp", "c++", "h", "hpp", "cc", "cxx"], [
  ["hljs-comment", /\/\/[^\n]*|\/\*[\s\S]*?\*\//],
  ["hljs-meta", /#\s*\w+[^\n]*/],
  COMMON_STRING_NO_TEMPLATE,
  ["hljs-keyword", /\b(?:auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|restrict|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while|class|namespace|template|typename|using|public|private|protected|virtual|override|new|delete|this|throw|try|catch|const_cast|dynamic_cast|reinterpret_cast|static_cast|nullptr|constexpr|decltype|noexcept|thread_local|alignas|alignof|static_assert|concept|requires|co_await|co_return|co_yield|export|import|module)\b/],
  ["hljs-built_in", /\b(?:printf|scanf|malloc|free|calloc|realloc|sizeof|strlen|strcpy|strcat|strcmp|memcpy|memset|fopen|fclose|fprintf|fscanf|cout|cin|endl|string|vector|map|set|pair|queue|stack|array|shared_ptr|unique_ptr|make_shared|make_unique|std|size_t)\b/],
  COMMON_BOOL,
  COMMON_NUMBER,
  ["hljs-function", /\b[a-zA-Z_]\w*(?=\s*\()/],
]);

// SQL
defLang(["sql", "mysql", "postgresql", "sqlite", "plsql"], [
  ["hljs-comment", /--[^\n]*|\/\*[\s\S]*?\*\//],
  COMMON_STRING_NO_TEMPLATE,
  ["hljs-keyword", /\b(?:SELECT|FROM|WHERE|INSERT|INTO|UPDATE|DELETE|CREATE|ALTER|DROP|TABLE|INDEX|VIEW|JOIN|INNER|LEFT|RIGHT|OUTER|FULL|CROSS|ON|AND|OR|NOT|IN|EXISTS|BETWEEN|LIKE|IS|NULL|AS|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|UNION|ALL|DISTINCT|SET|VALUES|PRIMARY|KEY|FOREIGN|REFERENCES|CASCADE|CONSTRAINT|DEFAULT|CHECK|UNIQUE|AUTO_INCREMENT|SERIAL|IF|THEN|ELSE|END|CASE|WHEN|BEGIN|COMMIT|ROLLBACK|TRANSACTION|WITH|RECURSIVE|GRANT|REVOKE|TRIGGER|PROCEDURE|FUNCTION|RETURNS|DECLARE|CURSOR|FETCH|EXECUTE|PREPARE|EXPLAIN|ANALYZE|TEMPORARY|TRUNCATE|REPLACE|UPSERT|MERGE|PIVOT|UNPIVOT|TOP|ROWNUM|OVER|PARTITION|WINDOW|RANK|DENSE_RANK|ROW_NUMBER|LEAD|LAG|COALESCE|COUNT|SUM|AVG|MIN|MAX|CAST|CONVERT|CONCAT|SUBSTRING|TRIM|UPPER|LOWER|LENGTH|ROUND|FLOOR|CEIL|ABS|NOW|CURRENT_TIMESTAMP|DATE|TIME|DATETIME|TIMESTAMP|INT|INTEGER|VARCHAR|TEXT|BOOLEAN|FLOAT|DOUBLE|DECIMAL|NUMERIC|BLOB|CHAR|BIGINT|SMALLINT)\b/i],
  COMMON_NUMBER,
]);

// YAML / TOML
defLang(["yaml", "yml", "toml"], [
  ["hljs-comment", /#[^\n]*/],
  COMMON_STRING_NO_TEMPLATE,
  ["hljs-attr", /^[\w][\w.-]*(?=\s*[:=])/m],
  COMMON_BOOL,
  COMMON_NUMBER,
]);

// Markdown
defLang(["md", "markdown"], [
  ["hljs-section", /^#{1,6}\s+.+$/m],
  ["hljs-strong", /\*\*[^*]+\*\*/],
  ["hljs-emphasis", /\*[^*]+\*/],
  ["hljs-code", /`[^`]+`/],
  ["hljs-link", /\[.*?\]\(.*?\)/],
  ["hljs-bullet", /^[\s]*[*+-]\s/m],
]);

// Diff
defLang(["diff", "patch"], [
  ["hljs-addition", /^\+[^\n]*/m],
  ["hljs-deletion", /^-[^\n]*/m],
  ["hljs-meta", /^@@[^\n]*@@/m],
  ["hljs-comment", /^(?:---|[+]{3})[^\n]*/m],
]);

// Ruby
defLang(["ruby", "rb"], [
  ["hljs-comment", /#[^\n]*/],
  COMMON_STRING,
  ["hljs-keyword", /\b(?:alias|and|begin|break|case|class|def|defined\?|do|else|elsif|end|ensure|for|if|in|module|next|not|or|redo|rescue|retry|return|self|super|then|undef|unless|until|when|while|yield|require|include|extend|attr_accessor|attr_reader|attr_writer|raise|puts|print|p|lambda|proc)\b/],
  ["hljs-built_in", /\b(?:Array|Hash|String|Integer|Float|Symbol|Regexp|Range|IO|File|Dir|Struct|Proc|Method|Kernel|Object|Class|Module|Enumerable|Comparable|Numeric|NilClass|TrueClass|FalseClass)\b/],
  COMMON_BOOL,
  ["hljs-variable", /(?:@{1,2}|\$)\w+/],
  ["hljs-symbol", /:\w+/],
  COMMON_NUMBER,
]);

// PHP
defLang(["php"], [
  ["hljs-comment", /\/\/[^\n]*|#[^\n]*|\/\*[\s\S]*?\*\//],
  COMMON_STRING,
  ["hljs-keyword", /\b(?:abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|final|finally|fn|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|match|namespace|new|or|print|private|protected|public|readonly|require|require_once|return|static|switch|throw|trait|try|unset|use|var|while|xor|yield|from|enum)\b/],
  ["hljs-variable", /\$\w+/],
  COMMON_BOOL,
  COMMON_NUMBER,
  ["hljs-function", /\b[a-zA-Z_]\w*(?=\s*\()/],
]);

/** Apply syntax highlighting to escaped HTML code. Returns HTML with <span> wrappers. */
function highlightCode(code: string, lang: string): string {
  const rules = LANG_RULES[lang.toLowerCase()];
  if (!rules) return code;

  const { pattern, classes } = rules;
  // Reset lastIndex for global regex
  pattern.lastIndex = 0;

  const parts: string[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(code)) !== null) {
    // Avoid infinite loops on zero-length matches
    if (match[0].length === 0) { pattern.lastIndex++; continue; }

    // Push text before match
    if (match.index > lastIndex) {
      parts.push(code.slice(lastIndex, match.index));
    }

    // Find which capture group matched
    for (let i = 1; i < match.length; i++) {
      if (match[i] !== undefined) {
        parts.push(`<span class="${classes[i - 1]}">${match[i]}</span>`);
        break;
      }
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < code.length) {
    parts.push(code.slice(lastIndex));
  }

  return parts.join("");
}

/** Parse Discord markdown to HTML */
export function parseDiscordMarkdown(
  content: string,
  roles?: Record<string, DiscordRole>,
  channels?: Record<string, DiscordChannel>,
  mentions?: Array<{ id: string; username: string }>,
  mediaMap?: Map<string, string>,
): string {
  if (!content) return "";

  // Private-use characters delimit protected tokens below; never accept them from input
  let html = escapeHtml(content.replace(/[\uE000\uE001]/g, ""));

  // Tokenize code blocks, inline code and links to protect them from markdown processing
  const codeTokens: string[] = [];
  const protect = (fragment: string): string => {
    const i = codeTokens.length;
    codeTokens.push(fragment);
    return `\uE000${i}\uE001`;
  };
  const linkOpen = (href: string) =>
    `<a href="${href}" class="discord-link" target="_blank" rel="noopener noreferrer">`;
  html = html.replace(
    /```(\w+\n)?([\s\S]*?)```/g,
    (_match, langLine: string | undefined, code: string) => {
      const lang = langLine?.trim();
      // Strip leading newline when there's no language identifier
      const cleanCode = !langLine && code.startsWith("\n") ? code.slice(1) : code;
      const highlighted = lang ? highlightCode(cleanCode, lang) : cleanCode;
      const langClass = lang ? ` class="language-${escapeHtml(lang)}"` : "";
      const i = codeTokens.length;
      codeTokens.push(`<pre class="discord-code-block"><code${langClass}>${highlighted}</code></pre>`);
      return `\uE000${i}\uE001`;
    },
  );

  html = html.replace(
    /`([^`\n]+)`/g,
    (_match, code: string) => {
      const i = codeTokens.length;
      codeTokens.push(`<code class="discord-inline-code">${code}</code>`);
      return `\uE000${i}\uE001`;
    },
  );

  // Links are tokenized before any emphasis runs, so characters such as _ * ~ inside
  // a URL are never treated as formatting.

  // Masked links [text](url) - the label keeps its formatting, the tags are protected
  html = html.replace(
    /\[([^\]]+)\]\((&lt;)?((https?:\/\/)[^\s)]+?)(&gt;)?\)/g,
    (_match, text: string, _lt: string | undefined, url: string) => {
      const label = /^https?:\/\//.test(text) ? protect(text) : text;
      return `${protect(linkOpen(url))}${label}${protect("</a>")}`;
    },
  );

  // Embed-suppressed links <url>
  html = html.replace(
    /&lt;(https?:\/\/(?:(?!&lt;|&gt;|&quot;)[^\s\uE000])+)&gt;/g,
    (_match, url: string) => protect(`${linkOpen(url)}${url}</a>`),
  );

  // Bare URLs - trailing punctuation and unbalanced closing parens stay outside the link
  html = html.replace(
    /https?:\/\/(?:(?!&lt;|&gt;|&quot;)[^\s\uE000])+/g,
    (match) => {
      let url = match;
      for (;;) {
        const trimmed = url.replace(/(?:[.,;:!?]|&#039;)+$/, "");
        const next = trimmed.endsWith(")") && trimmed.split(")").length > trimmed.split("(").length
          ? trimmed.slice(0, -1)
          : trimmed;
        if (next === url) break;
        url = next;
      }
      if (!/^https?:\/\/./.test(url)) return match;
      return protect(`${linkOpen(url)}${url}</a>`) + match.slice(url.length);
    },
  );

  // Headers (# ## ###) - must be at start of line
  html = html.replace(/^### (.+)$/gm, '<h3 class="discord-header">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="discord-header">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="discord-header">$1</h1>');

  // Block quotes (> or >>>) 
  html = html.replace(
    /^&gt;&gt;&gt; ([\s\S]+)$/gm,
    '<blockquote class="discord-blockquote">$1</blockquote>',
  );
  html = html.replace(
    /^&gt; (.+)$/gm,
    '<blockquote class="discord-blockquote">$1</blockquote>',
  );

  // Unordered lists - wrap consecutive items in <ul>
  html = html.replace(
    /(^- .+$(?:\n^- .+$)*)/gm,
    (block) => {
      const items = block.split("\n").map(line => line.replace(/^- (.+)$/, '<li class="discord-list-item">$1</li>')).join("");
      return `<ul class="discord-list">${items}</ul>`;
    },
  );

  // Bold italic (***text***)
  html = html.replace(
    /\*\*\*(.+?)\*\*\*/g,
    "<strong><em>$1</em></strong>",
  );

  // Bold (**text**)
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Underline (__text__) - must come before single-underscore italic
  html = html.replace(/__(.+?)__/g, "<u>$1</u>");

  // Italic (*text* or _text_)
  html = html.replace(/\*(?!\s)(.+?)(?<!\s)\*/g, "<em>$1</em>");
  html = html.replace(/(?<!\w)_(.+?)_(?!\w)/g, "<em>$1</em>");

  // Strikethrough (~~text~~)
  html = html.replace(/~~(.+?)~~/g, "<s>$1</s>");

  // Spoilers (||text||)
  html = html.replace(
    /\|\|(.+?)\|\|/g,
    '<span class="discord-spoiler" data-spoiler="true">$1</span>',
  );

  // User mentions <@userId> or <@!userId>
  html = html.replace(/&lt;@!?(\d+)&gt;/g, (_match, userId: string) => {
    const user = mentions?.find((m) => m.id === userId);
    const name = user?.username ?? "Unknown User";
    return `<span class="discord-mention" data-mention-type="user" data-mention-id="${escapeHtml(userId)}">@${escapeHtml(name)}</span>`;
  });

  // Role mentions <@&roleId>
  html = html.replace(/&lt;@&amp;(\d+)&gt;/g, (_match, roleId: string) => {
    const role = roles?.[roleId];
    const name = role?.name ?? "Unknown Role";
    let style = "";
    if (role?.color) {
      const hex = role.color.toString(16).padStart(6, "0");
      const r = (role.color >> 16) & 0xFF;
      const g = (role.color >> 8) & 0xFF;
      const b = role.color & 0xFF;
      style = ` style="color:#${hex};background-color:rgba(${r},${g},${b},0.1)"`;
    }
    return `<span class="discord-mention discord-role-mention" data-mention-type="role" data-mention-id="${escapeHtml(roleId)}"${style}>@${escapeHtml(name)}</span>`;
  });

  // Channel mentions <#channelId>
  html = html.replace(/&lt;#(\d+)&gt;/g, (_match, channelId: string) => {
    const channel = channels?.[channelId];
    const name = channel?.name ?? "unknown-channel";
    return `<span class="discord-mention" data-mention-type="channel" data-mention-id="${escapeHtml(channelId)}">#${escapeHtml(name)}</span>`;
  });

  // @everyone and @here
  html = html.replace(
    /(?<![\w.])@(everyone|here)\b/g,
    '<span class="discord-mention discord-mention-everyone">@$1</span>',
  );

  // Custom emojis <:name:id> or <a:name:id>
  html = html.replace(
    /&lt;(a?):(\w+):(\d+)&gt;/g,
    (_match, animated: string, name: string, id: string) => {
      const ext = animated ? "gif" : "webp";
      const url = `https://cdn.discordapp.com/emojis/${id}.${ext}?size=48&quality=lossless`;
      const resolved = mediaMap?.get(url) ?? url;
      return `<img src="${escapeHtml(resolved)}" alt=":${escapeHtml(name)}:" class="discord-custom-emoji" width="22" height="22" loading="lazy" />`;
    },
  );

  // Timestamps <t:timestamp:format>
  html = html.replace(
    /&lt;t:(\d+)(?::([tTdDfFR]))?&gt;/g,
    (_match, timestamp: string, format: string) => {
      const date = new Date(parseInt(timestamp) * 1000);
      const formatted = formatDiscordTimestamp(date, format || "f");
      return `<span class="discord-timestamp">${escapeHtml(formatted)}</span>`;
    },
  );

  // Line breaks
  html = html.replace(/\n/g, "<br />");

  // Restore code tokens
  if (codeTokens.length > 0) {
    html = html.replace(/\uE000(\d+)\uE001/g, (_, i) => codeTokens[parseInt(i)]);
  }

  return sanitizeHtml(html, SANITIZE_OPTIONS);
}

/** Format a Discord timestamp with the given format flag */
function formatDiscordTimestamp(date: Date, format: string): string {
  switch (format) {
    case "t": // Short time: 16:20
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    case "T": // Long time: 16:20:30
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    case "d": // Short date: 20/04/2021
      return date.toLocaleDateString("en-US");
    case "D": // Long date: 20 April 2021
      return date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
    case "f": // Short date/time: 20 April 2021 16:20
      return date.toLocaleString("en-US", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
    case "F": // Long date/time: Tuesday, 20 April 2021 16:20
      return date.toLocaleString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
    case "R": // Relative time
      return formatRelativeTime(date);
    default:
      return date.toLocaleString("en-US");
  }
}

/** Produce a human-readable relative time */
function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const absDiff = Math.abs(diff);
  const isPast = diff > 0;

  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  let unit: string;
  let value: number;

  if (years > 0) { unit = "year"; value = years; }
  else if (months > 0) { unit = "month"; value = months; }
  else if (days > 0) { unit = "day"; value = days; }
  else if (hours > 0) { unit = "hour"; value = hours; }
  else if (minutes > 0) { unit = "minute"; value = minutes; }
  else { unit = "second"; value = seconds; }

  const plural = value !== 1 ? "s" : "";
  return isPast ? `${value} ${unit}${plural} ago` : `in ${value} ${unit}${plural}`;
}

/** Format a message timestamp for display */
export function formatMessageTimestamp(
  isoString: string,
  format: "relative" | "absolute" | "both" = "absolute",
): string {
  const date = new Date(isoString);
  const absolute = date.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  switch (format) {
    case "relative":
      return formatRelativeTime(date);
    case "both":
      return `${absolute} (${formatRelativeTime(date)})`;
    case "absolute":
    default:
      return absolute;
  }
}

/** Get a Discord CDN avatar URL for a user */
export function getAvatarUrl(userId: string, avatarHash?: string | null, discriminator?: string): string {
  if (avatarHash) {
    if (avatarHash.startsWith("https://") || avatarHash.startsWith("http://")) return avatarHash;
    if (avatarHash.startsWith("data:")) return avatarHash;
    const ext = avatarHash.startsWith("a_") ? "gif" : "webp";
    return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${ext}?size=128`;
  }
  // Default avatar: legacy accounts use the discriminator, accounts on the new
  // username system (discriminator "0" or absent) use the user ID
  const legacy = discriminator ? parseInt(discriminator, 10) : 0;
  let index: number | bigint = 0;
  if (legacy > 0) {
    index = legacy % 5;
  } else if (/^\d+$/.test(userId)) {
    index = (BigInt(userId) >> BigInt(22)) % BigInt(6);
  }
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}

/** Convert a Discord color integer to a CSS hex color */
export function colorIntToHex(color: number): string {
  return `#${color.toString(16).padStart(6, "0")}`;
}

/** Get size label for a file size in bytes */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/** Check if a file is an image by content type */
export function isImageAttachment(contentType?: string | null): boolean {
  return !!contentType?.startsWith("image/");
}

/** Check if a file is a video by content type */
export function isVideoAttachment(contentType?: string | null): boolean {
  return !!contentType?.startsWith("video/");
}

/** Check if a file is audio by content type */
export function isAudioAttachment(contentType?: string | null): boolean {
  return !!contentType?.startsWith("audio/");
}
