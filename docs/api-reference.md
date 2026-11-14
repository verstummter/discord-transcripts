---
sidebar_position: 2
sidebar_label: API Reference
title: API Reference
description: Complete API reference for createTranscript and generateTranscriptHtml functions.
---

# API Reference

## `createTranscript(channel, options?)`

Grabs messages from a discord.js `TextChannel` and turns them into an HTML transcript.

**Parameters:**
- `channel` - A discord.js `TextChannel` instance
- `options` - `CreateTranscriptOptions` (optional, see [Options](./options))

**Returns:** `Promise<TranscriptResult>`

```typescript
interface TranscriptResult {
  html: string;        // Full HTML document
  buffer: Buffer;      // Ready for discord.js file uploads
  filename: string;    // e.g. "transcript-general-2026-03-15.html"
  messageCount: number;
}
```

### Usage

```typescript
import { createTranscript } from "@getoeteter/discord-transcripts";

// Basic
const result = await createTranscript(channel);

// With options
const result = await createTranscript(channel, {
  limit: 1000,
  theme: "dark",
  enableSearch: true,
  showUserStats: true,
});

// Send as file
await interaction.editReply({
  files: [{ attachment: result.buffer, name: result.filename }],
});
```

---

## `generateTranscriptHtml(data, options?)`

Takes raw transcript data and gives you back a complete HTML document. Doesn't need discord.js.

**Parameters:**
- `data` - [`TranscriptData`](./types) object
- `options` - `TranscriptOptions` (optional, see [Options](./options))

**Returns:** `string` (complete HTML document)

### Usage

```typescript
import {
  generateTranscriptHtml,
  type TranscriptData,
} from "@getoeteter/discord-transcripts";

const data: TranscriptData = {
  channel: { id: "123", name: "general", type: 0 },
  messages: [/* ... */],
  roles: {},
  channels: {},
  memberRoles: {},
};

const html = generateTranscriptHtml(data, { theme: "dark" });

// Write to file
import { writeFileSync } from "fs";
writeFileSync("transcript.html", html);
```

---

## `resolveMediaUrls(data)`

Downloads all media referenced in transcript data and returns a map of original URLs to base64 data URIs. Use this with `generateTranscriptHtml` for offline/permanent transcripts.

**Parameters:**
- `data` - [`TranscriptData`](./types) object

**Returns:** `Promise<Map<string, string>>` (URL → data URI)

### Usage

```typescript
import {
  generateTranscriptHtml,
  resolveMediaUrls,
  type TranscriptData,
} from "@getoeteter/discord-transcripts";

const data: TranscriptData = { /* ... */ };

// Download all media and embed as data URIs
const mediaMap = await resolveMediaUrls(data);
const html = generateTranscriptHtml(data, {
  theme: "dark",
  _resolvedMedia: mediaMap,
});
```

:::tip
With `createTranscript`, just set `embedMedia: true`, it handles media resolution automatically.
:::

---

## Exports

Here's everything you can import:

```typescript
// Functions
export { createTranscript } from "./lib/discord-adapter";
export { generateTranscriptHtml } from "./lib/generator";
export { resolveMediaUrls } from "./lib/media-resolver";

// Types
export type {
  TranscriptData,
  TranscriptOptions,
  CreateTranscriptOptions,
  DiscordMessage,
  DiscordUser,
  DiscordEmbed,
  DiscordAttachment,
  DiscordComponent,
  DiscordReaction,
  DiscordThread,
  DiscordSticker,
  DiscordPoll,
  DiscordPollAnswer,
  DiscordPollMedia,
  DiscordInteraction,
  DiscordVoiceMessage,
  // ...and more
};
```
