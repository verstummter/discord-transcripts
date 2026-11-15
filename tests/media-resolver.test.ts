import { afterEach, describe, expect, test } from "bun:test";
import { resolveMediaUrls } from "../src/index.js";
import { message, transcript } from "./helpers.js";

const realFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = realFetch; });

type Handler = (url: string) => Response;

/** Replace fetch with a handler and record every URL requested */
function mockFetch(handler: Handler): string[] {
  const calls: string[] = [];
  globalThis.fetch = (async (input: any) => {
    const url = String(input);
    calls.push(url);
    return handler(url);
  }) as typeof fetch;
  return calls;
}

const png = () => new Response(new Uint8Array([1, 2, 3]), { headers: { "content-type": "image/png" } });

function withAttachment(url: string) {
  return transcript([message("", {
    author: { id: "1", username: "u", avatar: "https://cdn.example/avatar.png" },
    attachments: [{ id: "1", filename: "f", size: 1, url, contentType: "image/png" }],
  })]);
}

describe("resolveMediaUrls", () => {
  test("downloads media and returns data URIs", async () => {
    mockFetch(png);
    const map = await resolveMediaUrls(withAttachment("https://cdn.example/a.png"));
    expect(map.get("https://cdn.example/a.png")).toBe("data:image/png;base64,AQID");
    expect(map.get("https://cdn.example/avatar.png")).toBe("data:image/png;base64,AQID");
  });

  test("collects avatars, embeds, reactions, emoji, components and forwards", async () => {
    const calls = mockFetch(png);
    await resolveMediaUrls(transcript([message("hi <:wave:111>", {
      author: { id: "1", username: "u", avatar: "https://cdn.example/avatar.png" },
      embeds: [{ image: { url: "https://cdn.example/embed.png" }, footer: { text: "f", iconUrl: "https://cdn.example/footer.png" } }],
      reactions: [{ emoji: { id: "222", name: "x", animated: true }, count: 1 }],
      components: [{ type: 17, components: [
        { type: 13, file: { url: "https://cdn.example/file.pdf" } },
        { type: 11, media: { url: "https://cdn.example/thumb.png" } },
        { type: 12, items: [{ media: { url: "https://cdn.example/gallery.png" } }] },
      ] }],
      messageSnapshots: [{ content: "", attachments: [{ id: "9", filename: "s", size: 1, url: "https://cdn.example/forwarded.png" }] }],
    })], { guild: { id: "5", name: "g", icon: "abc" } }));

    for (const expected of [
      "https://cdn.example/avatar.png",
      "https://cdn.example/embed.png",
      "https://cdn.example/footer.png",
      "https://cdn.example/file.pdf",
      "https://cdn.example/thumb.png",
      "https://cdn.example/gallery.png",
      "https://cdn.example/forwarded.png",
      "https://cdn.discordapp.com/emojis/111.webp?size=48&quality=lossless",
      "https://cdn.discordapp.com/emojis/222.gif?size=48&quality=lossless",
      "https://cdn.discordapp.com/icons/5/abc.webp?size=64",
    ]) {
      expect(calls).toContain(expected);
    }
  });

  test("never requests internal or non-http addresses", async () => {
    const blocked = [
      "http://localhost/a.png",
      "http://app.localhost/a.png",
      "http://127.0.0.1/a.png",
      "http://127.8.8.8/a.png",
      "http://10.0.0.5/a.png",
      "http://192.168.1.1/a.png",
      "http://172.16.0.1/a.png",
      "http://169.254.169.254/latest/meta-data",
      "http://[::1]/a.png",
      "http://service.internal/a.png",
      "file:///etc/passwd",
    ];
    for (const url of blocked) {
      const calls = mockFetch(png);
      const map = await resolveMediaUrls(withAttachment(url));
      expect(calls).not.toContain(url);
      expect(map.has(url)).toBe(false);
    }
  });

  test("a redirect to an internal address is not followed", async () => {
    const calls = mockFetch((url) =>
      url === "https://cdn.example/a.png"
        ? new Response(null, { status: 302, headers: { location: "http://169.254.169.254/secret" } })
        : png(),
    );
    const map = await resolveMediaUrls(withAttachment("https://cdn.example/a.png"));
    expect(calls).not.toContain("http://169.254.169.254/secret");
    expect(map.has("https://cdn.example/a.png")).toBe(false);
  });

  test("a redirect to a public address is followed and stored under the original URL", async () => {
    mockFetch((url) =>
      url === "https://cdn.example/a.png"
        ? new Response(null, { status: 301, headers: { location: "/moved/a.png" } })
        : png(),
    );
    const map = await resolveMediaUrls(withAttachment("https://cdn.example/a.png"));
    expect(map.get("https://cdn.example/a.png")).toBe("data:image/png;base64,AQID");
  });

  test("redirect loops give up", async () => {
    const calls = mockFetch(() => new Response(null, { status: 302, headers: { location: "https://cdn.example/a.png" } }));
    const map = await resolveMediaUrls(withAttachment("https://cdn.example/a.png"));
    expect(map.has("https://cdn.example/a.png")).toBe(false);
    // Two URLs are resolved (avatar and attachment), each allowed one request plus five redirects
    expect(calls.length).toBeLessThanOrEqual(12);
  });

  test("unsafe content types are never passed through", async () => {
    mockFetch(() => new Response("<script>alert(1)</script>", { headers: { "content-type": "text/html" } }));
    const map = await resolveMediaUrls(withAttachment("https://cdn.example/page"));
    expect(map.get("https://cdn.example/page")?.startsWith("data:application/octet-stream;base64,")).toBe(true);
  });

  test("content type falls back to the file extension", async () => {
    mockFetch(() => new Response(new Uint8Array([1]), { headers: { "content-type": "binary/octet-stream" } }));
    const map = await resolveMediaUrls(withAttachment("https://cdn.example/voice.ogg?x=1"));
    expect(map.get("https://cdn.example/voice.ogg?x=1")?.startsWith("data:audio/ogg;base64,")).toBe(true);
  });

  test("failed downloads are skipped", async () => {
    mockFetch((url) => {
      if (url.endsWith("a.png")) return new Response(null, { status: 404 });
      throw new Error("network down");
    });
    const map = await resolveMediaUrls(withAttachment("https://cdn.example/a.png"));
    expect(map.size).toBe(0);
  });
});
