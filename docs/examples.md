---
sidebar_position: 8
sidebar_label: Examples
title: Examples
description: Complete usage examples for common transcript generation scenarios.
---

# Examples

## Full-Featured Transcript

Turn on all the bells and whistles:

```typescript
import { generateTranscriptHtml } from "@getoeteter/discord-transcripts";

const html = generateTranscriptHtml(data, {
  theme: "dark",
  enableSearch: true,
  enableDateNav: true,
  showUserStats: true,
  enableCopyButton: true,
  collapsibleEmbeds: true,
  enableLightbox: true,
  expandThreads: true,
  includeJson: true,
  pageTitle: "Server Transcript",
});
```

## Minimal Transcript

Stripped-down, compact view:

```typescript
const html = generateTranscriptHtml(data, {
  theme: "light",
  compact: true,
  showHeader: false,
  showReactions: false,
  showAvatars: false,
});
```

## Paginated Large Transcript

If you've got a lot of messages, break them into pages:

```typescript
const html = generateTranscriptHtml(data, {
  messagesPerPage: 50,
  enableSearch: true,
  enableDateNav: true,
});
```

## Discord Bot Integration

Using `createTranscript` with a discord.js bot:

```typescript
import { createTranscript } from "@getoeteter/discord-transcripts";
import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "transcript") return;

  await interaction.deferReply({ ephemeral: true });

  const channel = interaction.channel;
  if (!channel?.isTextBased()) return;

  const result = await createTranscript(channel, {
    limit: 1000,
    theme: "dark",
    enableSearch: true,
    showUserStats: true,
  });

  await interaction.editReply({
    content: `Transcript of #${channel.name} (${result.messageCount} messages)`,
    files: [
      {
        attachment: result.buffer,
        name: result.filename,
      },
    ],
  });
});
```

## Standalone with Raw Data

You can build the transcript data yourself without discord.js:

```typescript
import { generateTranscriptHtml } from "@getoeteter/discord-transcripts";
import type { TranscriptData } from "@getoeteter/discord-transcripts";
import { writeFileSync } from "fs";

const data: TranscriptData = {
  guild: {
    id: "111",
    name: "My Server",
    icon: null,
  },
  channel: {
    id: "222",
    name: "general",
    type: 0,
    topic: "General discussion",
  },
  messages: [
    {
      id: "1",
      type: 0,
      content: "Hello **everyone**! Welcome to the server 🎉",
      author: {
        id: "333",
        username: "admin",
        globalName: "Admin",
        avatar: null,
        bot: false,
      },
      timestamp: "2026-03-01T10:00:00.000Z",
      reactions: [
        { emoji: { id: null, name: "👋" }, count: 5 },
      ],
    },
    {
      id: "2",
      type: 19, // Reply
      content: "Thanks for the welcome!",
      author: {
        id: "444",
        username: "newuser",
        globalName: "New User",
        avatar: null,
      },
      timestamp: "2026-03-01T10:01:00.000Z",
      messageReference: { messageId: "1" },
      referencedMessage: {
        id: "1",
        type: 0,
        content: "Hello **everyone**! Welcome to the server 🎉",
        author: { id: "333", username: "admin" },
        timestamp: "2026-03-01T10:00:00.000Z",
      },
    },
  ],
  roles: {
    "r1": { id: "r1", name: "Admin", color: 0xe74c3c },
    "r2": { id: "r2", name: "Member", color: 0x3498db },
  },
  channels: {
    "222": { id: "222", name: "general", type: 0 },
  },
  memberRoles: {
    "333": ["r1"],
    "444": ["r2"],
  },
};

const html = generateTranscriptHtml(data, {
  theme: "dark",
  enableSearch: true,
});

writeFileSync("transcript.html", html);
console.log("Transcript saved!");
```