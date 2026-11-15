import {
  DiscordChannelType,
  DiscordMessageType,
  type DiscordMessage,
  type DiscordUser,
  type TranscriptData,
} from "../src/index.js";

export const alice: DiscordUser = { id: "100000000000000001", username: "alice", globalName: "Alice", avatar: null, discriminator: "0" };
export const bob: DiscordUser = { id: "100000000000000002", username: "bob", globalName: null, avatar: null, discriminator: "0" };

let nextId = 1000;

export function message(content: string, extra: Partial<DiscordMessage> = {}): DiscordMessage {
  return {
    id: String(++nextId),
    type: DiscordMessageType.Default,
    content,
    author: alice,
    timestamp: "2026-03-15T14:00:00.000Z",
    ...extra,
  };
}

export function transcript(messages: DiscordMessage[], extra: Partial<TranscriptData> = {}): TranscriptData {
  return {
    guild: { id: "1", name: "Test Guild" },
    channel: { id: "2", name: "general", type: DiscordChannelType.GuildText, topic: "A topic" },
    messages,
    generatedAt: "2026-03-16T00:00:00.000Z",
    ...extra,
  };
}

/** Count non-overlapping occurrences of a substring */
export function count(haystack: string, needle: string): number {
  return haystack.split(needle).length - 1;
}

/** The transcript markup only: everything after the embedded <style> block and before the scripts */
export function body(html: string): string {
  return html.slice(html.indexOf("<body>"), html.lastIndexOf("<script>"));
}
