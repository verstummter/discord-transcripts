import { describe, expect, test } from "bun:test";
import {
  parseDiscordMarkdown as md,
  getAvatarUrl,
  formatFileSize,
  colorIntToHex,
  formatMessageTimestamp,
} from "../src/index.js";

describe("inline formatting", () => {
  test("bold, italic, underline, strikethrough", () => {
    expect(md("**b** *i* __u__ ~~s~~")).toBe("<strong>b</strong> <em>i</em> <u>u</u> <s>s</s>");
  });

  test("bold italic", () => {
    expect(md("***both***")).toBe("<strong><em>both</em></strong>");
  });

  test("underscore italic does not fire inside snake_case", () => {
    expect(md("snake_case_name and _it_")).toBe("snake_case_name and <em>it</em>");
  });

  test("asterisks surrounded by spaces are not italic", () => {
    expect(md("5 * 3 = 15 and 2 * 2 = 4")).toBe("5 * 3 = 15 and 2 * 2 = 4");
  });

  test("spoiler", () => {
    expect(md("||secret||")).toContain('class="discord-spoiler"');
  });

  test("inline code is not formatted", () => {
    expect(md("`**not bold**`")).toBe('<code class="discord-inline-code">**not bold**</code>');
  });

  test("code block keeps content literal and highlights known languages", () => {
    const out = md("```js\nconst a = 1;\n```");
    expect(out).toContain('<pre class="discord-code-block">');
    expect(out).toContain('class="language-js"');
    expect(out).toContain('<span class="hljs-keyword">const</span>');
    expect(md("```\n**x**\n```")).toContain("**x**");
  });
});

describe("links", () => {
  const a = (href: string, text = href) =>
    `<a href="${href}" class="discord-link" target="_blank" rel="noopener noreferrer">${text}</a>`;

  test("bare URL", () => {
    expect(md("see https://example.com/x ok")).toBe(`see ${a("https://example.com/x")} ok`);
  });

  test("formatting characters inside a URL are left alone", () => {
    const url = "https://example.com/a__b__c/x*y*z/~~q~~";
    expect(md(url)).toBe(a(url));
  });

  test("embed-suppressed <url>", () => {
    expect(md("<https://example.com/x>")).toBe(a("https://example.com/x"));
  });

  test("trailing punctuation stays outside the link", () => {
    expect(md("visit https://example.com/page.")).toBe(`visit ${a("https://example.com/page")}.`);
  });

  test("balanced parentheses are kept, unbalanced are dropped", () => {
    expect(md("(https://en.wikipedia.org/wiki/Foo_(bar))")).toBe(`(${a("https://en.wikipedia.org/wiki/Foo_(bar)")})`);
  });

  test("masked link with formatted label", () => {
    expect(md("[click **here**](https://b.com/a_b_c_)")).toBe(a("https://b.com/a_b_c_", "click <strong>here</strong>"));
  });

  test("masked link whose label is a URL produces one link", () => {
    expect(md("[https://shown.example](https://target.example)")).toBe(a("https://target.example", "https://shown.example"));
  });

  test("query strings keep their ampersands escaped", () => {
    expect(md("http://example.org/path?q=1&b=2")).toBe(a("http://example.org/path?q=1&amp;b=2"));
  });
});

describe("block elements", () => {
  test("headers", () => {
    expect(md("# One")).toBe('<h1 class="discord-header">One</h1>');
    expect(md("### Three")).toBe('<h3 class="discord-header">Three</h3>');
  });

  test("block quote", () => {
    expect(md("> quoted")).toBe('<blockquote class="discord-blockquote">quoted</blockquote>');
  });

  test("bullet lists with - and *", () => {
    const expected = '<ul class="discord-list"><li class="discord-list-item">a</li><li class="discord-list-item">b</li></ul>';
    expect(md("- a\n- b")).toBe(expected);
    expect(md("* a\n* b")).toBe(expected);
  });

  test("numbered list keeps its starting number", () => {
    expect(md("5. five\n6. six")).toBe(
      '<ol class="discord-list discord-list-ordered" start="5"><li class="discord-list-item">five</li><li class="discord-list-item">six</li></ol>',
    );
  });

  test("nested lists follow indentation", () => {
    expect(md("- a\n  - a1\n    - deep\n- b")).toBe(
      '<ul class="discord-list"><li class="discord-list-item">a<ul class="discord-list"><li class="discord-list-item">a1<ul class="discord-list"><li class="discord-list-item">deep</li></ul></li></ul></li><li class="discord-list-item">b</li></ul>',
    );
  });

  test("mixed list types are separate lists", () => {
    const out = md("- bullet\n1. number");
    expect(out).toContain("</ul><ol");
  });

  test("subtext", () => {
    expect(md("-# small **note**")).toBe('<small class="discord-subtext">small <strong>note</strong></small>');
  });

  test("newlines become line breaks", () => {
    expect(md("a\nb")).toBe("a<br />b");
  });
});

describe("mentions and emoji", () => {
  test("user mention resolves the name", () => {
    expect(md("<@123>", undefined, undefined, [{ id: "123", username: "kai" }])).toContain(">@kai</span>");
    expect(md("<@!999>")).toContain(">@Unknown User</span>");
  });

  test("role mention uses the role colour", () => {
    const out = md("<@&5>", { "5": { id: "5", name: "Mods", color: 0xff0000 } });
    expect(out).toContain("@Mods");
    expect(out).toContain("color:#ff0000");
  });

  test("channel mention", () => {
    expect(md("<#7>", undefined, { "7": { id: "7", name: "general", type: 0 } })).toContain(">#general</span>");
  });

  test("@everyone and @here, but not inside an email address", () => {
    expect(md("@everyone")).toContain("discord-mention-everyone");
    expect(md("me@here.com")).toBe("me@here.com");
  });

  test("custom emoji, static and animated", () => {
    expect(md("<:wave:111>")).toContain("https://cdn.discordapp.com/emojis/111.webp");
    expect(md("<a:spin:222>")).toContain("https://cdn.discordapp.com/emojis/222.gif");
  });

  test("timestamps render as text", () => {
    const out = md("<t:1700000000:D>");
    expect(out).toContain('class="discord-timestamp"');
    expect(out).toContain("2023");
  });
});

describe("safety", () => {
  test("HTML in content is escaped", () => {
    const out = md('<script>alert(1)</script><img src=x onerror=alert(1)>');
    expect(out).not.toContain("<script");
    expect(out).not.toContain("<img");
    expect(out).toContain("&lt;script&gt;");
  });

  test("javascript: URLs never become links", () => {
    expect(md("[x](javascript:alert(1))")).not.toContain("<a");
  });

  test("attribute breakout through a URL is not possible", () => {
    const out = md('https://example.com/"onmouseover="alert(1)');
    expect(out).not.toMatch(/<a[^>]*onmouseover/);
    expect(out).toContain('<a href="https://example.com/"');
  });

  test("private-use token characters in input cannot inject markup", () => {
    const out = md("`code` 0 5");
    expect(out.match(/<code/g)?.length).toBe(1);
    expect(out).not.toContain("undefined");
  });

  test("empty input", () => {
    expect(md("")).toBe("");
  });
});

describe("helpers", () => {
  test("getAvatarUrl with a hash, animated hash and direct URL", () => {
    expect(getAvatarUrl("1", "abc")).toBe("https://cdn.discordapp.com/avatars/1/abc.webp?size=128");
    expect(getAvatarUrl("1", "a_abc")).toBe("https://cdn.discordapp.com/avatars/1/a_abc.gif?size=128");
    expect(getAvatarUrl("1", "https://example.com/a.png")).toBe("https://example.com/a.png");
  });

  test("default avatar: legacy discriminator", () => {
    expect(getAvatarUrl("1", null, "7")).toBe("https://cdn.discordapp.com/embed/avatars/2.png");
  });

  test("default avatar: new username system uses the user ID", () => {
    const id = "330867089437753345";
    const expected = Number((BigInt(id) >> BigInt(22)) % BigInt(6));
    expect(getAvatarUrl(id, null, "0")).toBe(`https://cdn.discordapp.com/embed/avatars/${expected}.png`);
    expect(getAvatarUrl(id, null)).toBe(`https://cdn.discordapp.com/embed/avatars/${expected}.png`);
  });

  test("default avatar: non-numeric ID does not throw", () => {
    expect(getAvatarUrl("not-a-number", null)).toBe("https://cdn.discordapp.com/embed/avatars/0.png");
  });

  test("formatFileSize", () => {
    expect(formatFileSize(512)).toBe("512 B");
    expect(formatFileSize(2048)).toBe("2.0 KB");
    expect(formatFileSize(5 * 1024 * 1024)).toBe("5.0 MB");
  });

  test("colorIntToHex pads to six digits", () => {
    expect(colorIntToHex(0x00ff00)).toBe("#00ff00");
    expect(colorIntToHex(255)).toBe("#0000ff");
  });

  test("formatMessageTimestamp modes", () => {
    const iso = new Date(Date.now() - 3 * 3600_000).toISOString();
    expect(formatMessageTimestamp(iso, "relative")).toBe("3 hours ago");
    expect(formatMessageTimestamp(iso, "both")).toContain("(3 hours ago)");
    expect(formatMessageTimestamp(iso)).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });
});
