import { describe, expect, test } from "bun:test";
import { generateTranscriptHtml as render, DiscordChannelType, DiscordMessageType } from "../src/index.js";
import { alice, bob, body, count, message, transcript } from "./helpers.js";

describe("document", () => {
  test("is a complete, self-contained HTML document", () => {
    const html = render(transcript([message("hello")]));
    expect(html.startsWith("<!DOCTYPE html>")).toBe(true);
    expect(html).toContain("<title>Test Guild - #general</title>");
    expect(html).not.toMatch(/<script[^>]+src=/);
    expect(html).not.toMatch(/<link[^>]+stylesheet/);
    expect(body(html)).toContain('<div class="discord-message-text">hello</div>');
  });

  test("theme and compact classes", () => {
    expect(body(render(transcript([])))).toContain('class="discord-transcript discord-dark"');
    expect(body(render(transcript([]), { theme: "light", compact: true }))).toContain('class="discord-transcript discord-light discord-compact"');
  });

  test("channel and guild names are escaped", () => {
    const html = render(transcript([], {
      guild: { id: "1", name: "<b>Guild</b>" },
      channel: { id: "2", name: '"><script>alert(1)</script>', type: DiscordChannelType.GuildText },
    }));
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).not.toContain("<b>Guild</b>");
  });

  test("customCss and fontFamily cannot close the style block", () => {
    const attempts = [
      "</style><script>alert(1)</script>",
      "<</style>/style><script>alert(1)</script>",
      "</sty</style>le><script>alert(1)</script>",
      "</STYLE ><script>alert(1)</script>",
      "</style\n><script>alert(1)</script>",
    ];
    for (const css of attempts) {
      for (const html of [render(transcript([]), { customCss: css }), render(transcript([]), { fontFamily: css })]) {
        // The only closing tag is the real one, after the payload, so the payload stays inert CSS text
        expect(html.match(/<\/style/gi)?.length).toBe(1);
        expect(html.search(/<\/style/i)).toBeGreaterThan(html.indexOf("alert(1)"));
      }
    }
  });

  test("ordinary customCss is passed through unchanged", () => {
    const css = ".discord-dark { --dc-accent-primary: #e94560; } a::after { content: \"/\"; }";
    expect(render(transcript([]), { customCss: css })).toContain(css);
  });

  test("includeJson escapes every < in the data block", () => {
    const html = render(transcript([message("</script><!--<script>")]), { includeJson: true });
    const start = html.indexOf('id="discord-transcript-json">') + 'id="discord-transcript-json">'.length;
    const json = html.slice(start, html.indexOf("</script>", start));
    expect(json).not.toContain("<");
    expect(JSON.parse(json).messages[0].content).toBe("</script><!--<script>");
  });
});

describe("top bar", () => {
  test("header shows guild, channel, topic and counts", () => {
    const out = body(render(transcript([message("a"), message("b", { author: bob })])));
    expect(out).toContain('<span class="discord-guild-name">Test Guild</span>');
    expect(out).toContain("<span>general</span>");
    expect(out).toContain("A topic");
    expect(out).toContain("<span>2 messages</span><span>2 participants</span>");
  });

  test("tools are absent by default and present when enabled", () => {
    const plain = body(render(transcript([message("a")])));
    expect(plain).not.toContain("discord-header-tools");

    const full = body(render(transcript([message("a")]), { enableSearch: true, enableDateNav: true, enableThemeToggle: true }));
    expect(full).toContain('id="discord-search-input"');
    expect(full).toContain('id="discord-date-nav-toggle"');
    expect(full).toContain('id="discord-theme-toggle"');
    expect(full).toContain('id="discord-search-empty"');
  });

  test("showHeader: false keeps the tools in a bar of their own", () => {
    const out = body(render(transcript([message("a")]), { showHeader: false, enableSearch: true }));
    expect(out).toContain("discord-channel-header-tools-only");
    expect(out).not.toContain("discord-guild-name");
    expect(body(render(transcript([message("a")]), { showHeader: false }))).not.toContain("discord-channel-header");
  });

  test("thread channels use the thread wording", () => {
    const out = body(render(transcript([], { channel: { id: "2", name: "Bug report", type: DiscordChannelType.PublicThread } })));
    expect(out).toContain('<h2 class="discord-channel-beginning-title">Bug report</h2>');
    expect(out).toContain("This is the start of the thread.");
  });
});

describe("messages", () => {
  test("consecutive messages from one author are grouped", () => {
    const out = body(render(transcript([
      message("one", { timestamp: "2026-03-15T14:00:00.000Z" }),
      message("two", { timestamp: "2026-03-15T14:01:00.000Z" }),
      message("three", { timestamp: "2026-03-15T14:30:00.000Z" }),
      message("four", { timestamp: "2026-03-15T14:31:00.000Z", author: bob }),
    ])));
    expect(count(out, "discord-message-grouped")).toBe(1);
    expect(count(out, 'class="discord-message-avatar"')).toBe(3);
  });

  test("a new day starts a new group and a date separator", () => {
    const out = body(render(transcript([
      message("late", { timestamp: "2026-03-15T23:59:00.000Z" }),
      message("early", { timestamp: "2026-03-16T00:01:00.000Z" }),
    ]), { timeZone: "UTC" }));
    expect(count(out, 'class="discord-date-separator"')).toBe(2);
    expect(count(out, "discord-message-grouped")).toBe(0);
  });

  test("timeZone decides where the day boundary falls", () => {
    const data = transcript([
      message("a", { timestamp: "2026-03-15T23:59:00.000Z" }),
      message("b", { timestamp: "2026-03-16T00:01:00.000Z" }),
    ]);
    // Both timestamps fall on 16 March in Tokyo
    expect(count(body(render(data, { timeZone: "Asia/Tokyo" })), 'class="discord-date-separator"')).toBe(1);
  });

  test("locale and timeZone format dates", () => {
    const out = body(render(transcript([message("a")]), { locale: "de-DE", timeZone: "Europe/Berlin" }));
    expect(out).toContain("Sonntag, 15. März 2026");
    expect(out).toContain("15.03.2026, 15:00");
  });

  test("invalid locale or timeZone falls back instead of throwing", () => {
    expect(() => render(transcript([message("a")]), { locale: "not a locale!", timeZone: "Mars/Olympus" })).not.toThrow();
  });

  test("a render never inherits the previous render's locale", () => {
    render(transcript([message("a")]), { locale: "de-DE", timeZone: "UTC" });
    expect(body(render(transcript([message("a")]), { timeZone: "UTC" }))).toContain("Sunday, March 15, 2026");
  });

  test("author names are escaped and role colours applied", () => {
    const evil = { ...alice, globalName: "<img src=x onerror=alert(1)>" };
    const out = body(render(transcript([message("hi", { author: evil })], {
      roles: { "9": { id: "9", name: "Red", color: 0xff0000, position: 1 } },
      memberRoles: { [alice.id]: ["9"] },
    })));
    expect(out).not.toContain("<img src=x");
    expect(out).toContain('style="color:#ff0000"');
  });

  test("bot and webhook badges", () => {
    const out = body(render(transcript([
      message("a", { author: { ...bob, bot: true } }),
      message("b", { author: { ...alice, bot: true }, webhookId: "5" }),
    ])));
    expect(out).toContain("BOT</span>");
    expect(out).toContain("WEBHOOK</span>");
  });

  test("system messages", () => {
    const out = body(render(transcript([message("", { type: DiscordMessageType.UserJoin })])));
    expect(out).toContain("discord-system-message");
  });

  test("message ids become anchors", () => {
    const m = message("x");
    expect(body(render(transcript([m])))).toContain(`id="msg-${m.id}"`);
  });
});

describe("replies and forwards", () => {
  test("a reply links to its target when the target is in the transcript", () => {
    const original = message("original");
    const reply = message("reply", { author: bob, referencedMessage: original, messageReference: { messageId: original.id } });
    const out = body(render(transcript([original, reply])));
    expect(out).toContain(`<a class="discord-reply-link" href="#msg-${original.id}"`);
    expect(out).toContain('<span class="discord-reply-username">Alice</span>');
  });

  test("a reply to a message outside the transcript is not a link", () => {
    const outside = message("elsewhere");
    const reply = message("reply", { referencedMessage: outside, messageReference: { messageId: outside.id } });
    expect(body(render(transcript([reply])))).not.toContain("discord-reply-link");
  });

  test("a reference without the message shows the deleted notice", () => {
    const out = body(render(transcript([message("reply", { messageReference: { messageId: "1" } })])));
    expect(out).toContain("Original message was deleted");
  });

  test("forwarded messages render their snapshot, not a deleted notice", () => {
    const out = body(render(transcript([message("", {
      messageReference: { messageId: "1" },
      messageSnapshots: [{ content: "**forwarded** text", timestamp: "2026-03-14T10:00:00.000Z" }],
    })])));
    expect(out).toContain('<div class="discord-forwarded">');
    expect(out).toContain("<strong>forwarded</strong> text");
    expect(out).not.toContain("Original message was deleted");
  });
});

describe("rich content", () => {
  test("image, video and file attachments", () => {
    const out = body(render(transcript([message("", {
      attachments: [
        { id: "1", filename: "a.png", size: 10, url: "https://cdn.example/a.png", contentType: "image/png" },
        { id: "2", filename: "b.mp4", size: 10, url: "https://cdn.example/b.mp4", contentType: "video/mp4" },
        { id: "3", filename: "c.zip", size: 2048, url: "https://cdn.example/c.zip", contentType: "application/zip" },
      ]
    })])));
    expect(out).toContain('<img src="https://cdn.example/a.png"');
    expect(out).toContain("<video controls");
    expect(out).toContain("c.zip</a>");
    expect(out).toContain("2.0 KB");
  });

  test("attachment URLs with a dangerous scheme are dropped", () => {
    const out = body(render(transcript([message("", {
      attachments: [
        { id: "3", filename: "c.zip", size: 1, url: "javascript:alert(1)", contentType: "application/zip" },
      ]
    })])));
    expect(out).not.toContain('href="javascript:');
  });

  test("embed with title, fields and colour", () => {
    const out = body(render(transcript([message("", {
      embeds: [{
        title: "Title", description: "**desc**", color: 0x00ff00,
        fields: [{ name: "Field", value: "Value", inline: true }],
      }]
    })])));
    expect(out).toContain("border-left-color:#00ff00");
    expect(out).toContain("<strong>desc</strong>");
    expect(out).toContain("discord-embed-field-inline");
  });

  test("showEmbeds, showAttachments and showReactions switch content off", () => {
    const data = transcript([message("x", {
      embeds: [{ title: "T" }],
      attachments: [{ id: "1", filename: "a.png", size: 1, url: "https://cdn.example/a.png", contentType: "image/png" }],
      reactions: [{ emoji: { name: "👍" }, count: 2 }],
    })]);
    const on = body(render(data));
    expect(on).toContain("discord-embed");
    expect(on).toContain("discord-attachment-img");
    expect(on).toContain("discord-reaction-count");
    const off = body(render(data, { showEmbeds: false, showAttachments: false, showReactions: false }));
    expect(off).not.toContain('class="discord-embed"');
    expect(off).not.toContain("discord-attachment-img");
    expect(off).not.toContain("discord-reaction-count");
  });

  test("poll percentages and winner", () => {
    const out = body(render(transcript([message("", {
      poll: {
        question: { text: "Pick" },
        answers: [
          { answerId: 1, pollMedia: { text: "A" }, count: 3 },
          { answerId: 2, pollMedia: { text: "B" }, count: 1 },
        ],
        isFinalized: true,
      }
    })])));
    expect(out).toContain("75%");
    expect(out).toContain("25%");
    expect(count(out, "discord-poll-answer-winner")).toBe(1);
  });

  test("buttons, and custom renderers inside V2 containers", () => {
    const components = [
      { type: 1, components: [{ type: 2, style: 5, label: "Open", url: "https://example.com" }] },
      { type: 17, components: [{ type: 10, content: "inside" }, { type: 99 }] },
    ];
    const out = body(render(transcript([message("", { components })]), {
      customRenderers: { 99: () => '<div class="custom-thing"></div>' },
    }));
    expect(out).toContain('<a href="https://example.com" class="discord-button discord-button-link"');
    expect(out).toContain('<div class="discord-v2-text-display">inside</div>');
    expect(out).toContain('<div class="custom-thing"></div>');
  });

  test("threads: indicator, and inline expansion when enabled", () => {
    const data = transcript([message("root", { thread: { id: "5", name: "Side topic", messageCount: 1, messages: [message("in thread", { author: bob })] } })]);
    const collapsed = body(render(data));
    expect(collapsed).toContain("Side topic");
    expect(collapsed).not.toContain("in thread");
    expect(body(render(data, { expandThreads: true }))).toContain("in thread");
  });
});

describe("page features", () => {
  test("statistics panel", () => {
    const out = body(render(transcript([message("a"), message("b"), message("c", { author: bob })]), { showUserStats: true, timeZone: "UTC" }));
    expect(out).toContain('<div class="discord-stats-tile-value">3</div><div class="discord-stats-tile-label">Messages</div>');
    expect(out).toContain('<div class="discord-stats-tile-value">2</div><div class="discord-stats-tile-label">Participants</div>');
    expect(out).toContain("2 PM");
    expect(count(out, 'class="discord-stats-row"')).toBe(2);
  });

  test("pagination controls sit between the messages and the footer", () => {
    const out = body(render(transcript([message("a")]), { messagesPerPage: 10 }));
    const nav = out.indexOf('id="discord-pagination"');
    expect(nav).toBeGreaterThan(out.indexOf('class="discord-messages"'));
    expect(nav).toBeLessThan(out.indexOf("discord-transcript-footer"));
    expect(body(render(transcript([message("a")])))).not.toContain("discord-pagination");
  });

  test("embedded media map replaces URLs", () => {
    const url = "https://cdn.example/a.png";
    const out = body(render(
      transcript([message("", { attachments: [{ id: "1", filename: "a.png", size: 1, url, contentType: "image/png" }] })]),
      { _resolvedMedia: new Map([[url, "data:image/png;base64,AAAA"]]) },
    ));
    expect(out).toContain('src="data:image/png;base64,AAAA"');
    expect(out).not.toContain(url);
  });

  test("an empty transcript renders", () => {
    const html = render(transcript([]), { showUserStats: true, enableSearch: true });
    expect(html).toContain("0 messages");
  });
});
