import { describe, expect, test } from "bun:test";
import { Collection } from "discord.js";
import { createTranscript } from "../src/index.js";

const SNOWFLAKE_BASE = 1000000000000000000n;
const id = (n: number) => String(SNOWFLAKE_BASE + BigInt(n));

interface FakeOptions {
  reference?: { messageId: string; channelId?: string; guildId?: string };
  snapshots?: any[];
  author?: any;
}

/** The smallest object that satisfies what the adapter reads from a discord.js Message */
function fakeMessage(n: number, channel: any, content: string, opts: FakeOptions = {}): any {
  const createdAt = new Date(Date.UTC(2026, 2, 15, 12, n));
  return {
    id: id(n),
    type: 0,
    content,
    author: opts.author ?? { id: id(9000), username: "alice", globalName: "Alice", avatar: null, bot: false, discriminator: "0" },
    createdAt,
    createdTimestamp: createdAt.getTime(),
    editedAt: null,
    pinned: false,
    webhookId: null,
    mentions: { users: new Collection() },
    attachments: new Collection(),
    embeds: [],
    reactions: { cache: new Collection() },
    reference: opts.reference ?? null,
    stickers: new Collection(),
    thread: null,
    components: [],
    flags: { bitfield: 0 },
    messageSnapshots: new Collection((opts.snapshots ?? []).map((s, i) => [String(i), s])),
    channel,
  };
}

/** A fake guild channel whose messages.fetch pages like the Discord API (newest first) */
function fakeChannel(extra: Record<string, unknown> = {}) {
  const store: any[] = [];
  const fetchCalls: any[] = [];
  const channel: any = {
    id: id(1),
    name: "general",
    type: 0,
    topic: "the topic",
    guild: {
      id: id(2),
      name: "Guild",
      icon: null,
      roles: { cache: new Collection([[id(50), { id: id(50), name: "Mod", color: 0xff0000, position: 3 }]]) },
      channels: { cache: new Collection([[id(1), { id: id(1), name: "general", type: 0 }]]) },
      members: {
        fetch: async (userId: string) => {
          if (userId !== id(9000)) throw new Error("Unknown Member");
          return { roles: { cache: new Collection([[id(50), { id: id(50) }]]) } };
        },
      },
    },
    messages: {
      cache: new Collection<string, any>(),
      fetch: async (query: { limit: number; before?: string; after?: string }) => {
        fetchCalls.push(query);
        let pool = [...store];
        if (query.before) pool = pool.filter((m) => BigInt(m.id) < BigInt(query.before!));
        if (query.after) pool = pool.filter((m) => BigInt(m.id) > BigInt(query.after!));
        // Discord returns the newest matches for `before`, the oldest for `after`
        pool.sort((a, b) => (query.after ? a : b).createdTimestamp - (query.after ? b : a).createdTimestamp);
        const page = pool.slice(0, query.limit).sort((a, b) => b.createdTimestamp - a.createdTimestamp);
        return new Collection(page.map((m) => [m.id, m]));
      },
    },
    ...extra,
  };
  const add = (n: number, content: string, opts?: FakeOptions) => {
    const m = fakeMessage(n, channel, content, opts);
    store.push(m);
    channel.messages.cache.set(m.id, m);
    return m;
  };
  return { channel, add, fetchCalls };
}

describe("createTranscript", () => {
  test("returns html, buffer, filename and count in chronological order", async () => {
    const { channel, add } = fakeChannel();
    add(1, "first"); add(2, "second"); add(3, "third");
    const result = await createTranscript(channel);
    expect(result.messageCount).toBe(3);
    expect(result.buffer.toString("utf-8")).toBe(result.html);
    expect(result.filename).toMatch(/^transcript-general-\d{4}-\d{2}-\d{2}\.html$/);
    expect(result.html.indexOf(">first<")).toBeLessThan(result.html.indexOf(">second<"));
    expect(result.html.indexOf(">second<")).toBeLessThan(result.html.indexOf(">third<"));
    expect(result.html).toContain("the topic");
  });

  test("pages through history 100 at a time and honours the limit", async () => {
    const { channel, add, fetchCalls } = fakeChannel();
    for (let n = 1; n <= 250; n++) add(n, `m${n}`);
    const result = await createTranscript(channel, { limit: 230 });
    expect(result.messageCount).toBe(230);
    expect(fetchCalls.map((c) => c.limit)).toEqual([100, 100, 30]);
    // The newest 230 are kept: m21 … m250
    expect(result.html).toContain(">m250<");
    expect(result.html).toContain(">m21<");
    expect(result.html).not.toContain(">m20<");
  });

  test("after fetches forward from a message", async () => {
    const { channel, add } = fakeChannel();
    for (let n = 1; n <= 10; n++) add(n, `m${n}`);
    const result = await createTranscript(channel, { after: id(7) });
    expect(result.messageCount).toBe(3);
    expect(result.html).toContain(">m8<");
    expect(result.html).not.toContain(">m7<");
  });

  test("role colours come from the member's roles; members who left are skipped", async () => {
    const { channel, add } = fakeChannel();
    add(1, "hi");
    add(2, "gone", { author: { id: id(9001), username: "ghost", globalName: null, avatar: null, bot: false, discriminator: "0" } });
    const result = await createTranscript(channel);
    expect(result.html).toContain('style="color:#ff0000">Alice<');
    expect(result.html).toContain(">ghost<");
  });

  test("replies carry one level of the referenced message", async () => {
    const { channel, add } = fakeChannel();
    const a = add(1, "root");
    const b = add(2, "reply one", { reference: { messageId: a.id } });
    add(3, "reply two", { reference: { messageId: b.id } });
    const result = await createTranscript(channel);
    expect(result.html).toContain(`href="#msg-${a.id}"`);
    expect(result.html).toContain(`href="#msg-${b.id}"`);
  });

  test("forwarded messages become snapshots", async () => {
    const { channel, add } = fakeChannel();
    add(1, "", {
      reference: { messageId: id(777), channelId: id(888) },
      snapshots: [{ content: "forwarded body", createdAt: new Date(Date.UTC(2026, 2, 1)), attachments: new Collection(), embeds: [], stickers: new Collection() }],
    });
    const result = await createTranscript(channel);
    expect(result.html).toContain('<div class="discord-forwarded">');
    expect(result.html).toContain("forwarded body");
    expect(result.html).not.toContain("Original message was deleted");
  });

  test("threads and forum posts (no topic property) work", async () => {
    const { channel, add } = fakeChannel({ type: 11, name: "Forum post" });
    delete channel.topic;
    add(1, "starter");
    const result = await createTranscript(channel);
    expect(result.html).toContain("This is the start of the thread.");
    expect(result.html).toContain(">starter<");
  });

  test("custom filename and passthrough of render options", async () => {
    const { channel, add } = fakeChannel();
    add(1, "x");
    const result = await createTranscript(channel, { filename: "custom.html", theme: "light", resolveRoles: false });
    expect(result.filename).toBe("custom.html");
    expect(result.html).toContain("discord-transcript discord-light");
  });
});
