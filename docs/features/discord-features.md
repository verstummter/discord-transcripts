---
sidebar_position: 1
sidebar_label: Discord Features
title: Discord Features
description: Polls, slash commands, voice messages, thread expansion, and AutoMod rendering.
---

# Discord Features

These render Discord-specific content. They show up automatically when the matching data is present in a message - no extra options needed (except thread expansion).

## Polls

Renders Discord polls with vote bars, percentages, emoji, and winner highlighting.

Just include a `poll` field on the message and it shows up automatically.

```typescript
const message = {
  id: "1",
  type: 0,
  content: "",
  author: { id: "123", username: "someone" },
  timestamp: new Date().toISOString(),
  poll: {
    question: { text: "Favorite language?" },
    answers: [
      {
        answerId: 1,
        pollMedia: { text: "TypeScript", emoji: { name: "🔷", id: null } },
        count: 15,
      },
      {
        answerId: 2,
        pollMedia: { text: "Rust", emoji: { name: "🦀", id: null } },
        count: 8,
      },
      {
        answerId: 3,
        pollMedia: { text: "Python", emoji: { name: "🐍", id: null } },
        count: 12,
      },
    ],
    allowMultiselect: false,
    isFinalized: true,
  },
};
```

**How it looks:**
- Each answer gets a progress bar with vote count and percentage
- With `isFinalized: true`, the header says "Final Results" and the winner is highlighted green
- Without that flag, it just says "Poll"
- Emoji show up next to each answer

---

## Slash Command Context

Messages of type `20` (ChatInputCommand) or `23` (ContextMenuCommand) get a "used /command" line above the message, just like in Discord.

Shows up when the message has type 20/23 and an `interaction` field.

```typescript
const message = {
  id: "1",
  type: 20, // ChatInputCommand
  content: "Here are the lookup results...",
  author: { id: "100", username: "bot", bot: true },
  timestamp: new Date().toISOString(),
  interaction: {
    name: "lookup",
    user: {
      id: "200",
      username: "kai",
      globalName: "Kai",
      avatar: null,
    },
  },
};
```

This shows who triggered the command and which one they used (e.g. "Kai used /lookup").

---

## Voice Messages

Shows a waveform visualization with a play button and duration, just like Discord's voice messages.

Shows up when a message has a `voiceMessage` field.

```typescript
const message = {
  id: "1",
  type: 0,
  content: "",
  author: { id: "123", username: "someone" },
  timestamp: new Date().toISOString(),
  voiceMessage: {
    duration: 12,  // seconds
    waveform: Buffer.from(new Uint8Array(256).map(() =>
      Math.floor(Math.random() * 255)
    )).toString("base64"),
  },
  attachments: [
    {
      id: "v1",
      filename: "voice-message.ogg",
      contentType: "audio/ogg",
      size: 24576,
      url: "https://cdn.discordapp.com/attachments/.../voice-message.ogg",
    },
  ],
};
```

**How it works:**
- The waveform data is base64-decoded into visual bars
- Each byte represents one bar's height (0-255)
- If there's no waveform data, a flat default is used
- Duration shows as `m:ss`
- Links to the audio attachment for playback

---

## Thread Expansion

With `expandThreads: true` enabled and thread messages included in the data, a "Show thread" toggle appears below the thread indicator. Click it to see the thread messages right there inline.

:::info
Requires the [`expandThreads`](../options#feature-toggles) option to be enabled.
:::

```typescript
const message = {
  id: "1",
  type: 0,
  content: "Let's discuss this in a thread",
  author: { id: "123", username: "someone" },
  timestamp: new Date().toISOString(),
  thread: {
    id: "t1",
    name: "Discussion Thread",
    messageCount: 2,
    messages: [
      {
        id: "t1-1",
        type: 0,
        content: "First reply in thread",
        author: { id: "456", username: "replier" },
        timestamp: new Date().toISOString(),
      },
      {
        id: "t1-2",
        type: 0,
        content: "Second reply in thread",
        author: { id: "789", username: "another" },
        timestamp: new Date().toISOString(),
      },
    ],
  },
};
```

**How it looks:**
- Thread messages appear inline with a left border
- Toggle says "Show thread (N replies)" / "Hide thread"
- Each reply is fully rendered with avatar, timestamp, and content
- The thread name shows in the indicator bar

---

## AutoMod Messages

AutoMod system messages (type `24`) show up with a shield icon and an "AutoMod" label instead of the normal bot tag.

```typescript
const message = {
  id: "1",
  type: 24,
  content: "",
  author: {
    id: "0",
    username: "AutoMod",
    bot: true,
  },
  timestamp: new Date().toISOString(),
  embeds: [
    {
      description: "⚠️ Message blocked: contains prohibited content",
      color: 0xed4245,
    },
  ],
};
```

Just set the message type to `24` and it renders with the AutoMod styling.
