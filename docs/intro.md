---
sidebar_position: 1
sidebar_label: Getting Started
title: Getting Started
description: Install and set up discord-transcripts to generate self-contained HTML transcripts from Discord channels.
slug: /
---

# Getting Started

This package generates self-contained HTML transcripts from Discord channels. There are two ways to use it:
- **`createTranscript`** - pass in a discord.js channel, it fetches messages and builds the HTML for you
- **`generateTranscriptHtml`** - pass in your own data, no discord.js needed

The output is a single HTML file with everything baked in (CSS, SVG icons, click handlers). The only external requests it makes are to Discord's CDN for avatars, emoji, and attachments.

## Installation

```bash
npm install @getoeteter/discord-transcripts
# or
bun add @getoeteter/discord-transcripts
```

Requires `discord.js` ^14.0.0 as a peer dependency (only needed for `createTranscript`).

## Quick Start

### With discord.js

```typescript
import { createTranscript } from "@getoeteter/discord-transcripts";

const result = await createTranscript(channel, {
  limit: 500,
  theme: "dark",
});

await interaction.editReply({
  files: [{ attachment: result.buffer, name: result.filename }],
});
```

### Without discord.js (Standalone)

```typescript
import {
  generateTranscriptHtml,
  type TranscriptData,
} from "@getoeteter/discord-transcripts";

const data: TranscriptData = {
  channel: { id: "123", name: "general", type: 0 },
  messages: [
    {
      id: "1",
      type: 0,
      content: "Hello **world**!",
      author: { id: "456", username: "someone" },
      timestamp: new Date().toISOString(),
    },
  ],
  roles: {},
  channels: {},
  memberRoles: {},
};

const html = generateTranscriptHtml(data, { theme: "dark" });
```

## Supported Content

### Text Formatting
Bold, italic, underline, strikethrough, spoilers, inline code, code blocks (with syntax highlighting for 24+ languages), headers, lists, block quotes

### Discord Elements
User/role/channel mentions (with colors), custom & unicode emoji, timestamps (all format types), masked links, auto-links

### Message Types
Regular messages, replies, slash commands, context menus, system messages (joins, boosts, pins, stage events, channel changes, AutoMod)

### Rich Content
Embeds (all fields), polls, voice messages, stickers, GIF embeds (Tenor/Giphy), image/video/audio/file attachments, spoiler attachments, reactions

### Components
V1: ActionRow, Buttons (all styles), Select menus  
V2: Container, Section, TextDisplay, Thumbnail, MediaGallery, File, Separator, Label

### Layout
Message grouping (same author within 7 min), date separators, thread indicators, compact mode, responsive design, print styles
