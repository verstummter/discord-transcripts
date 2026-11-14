/**
 * Example: Standalone transcript from raw data (no discord.js needed)
 *
 * Run with: bun run examples/standalone-raw-data.ts
 * Output:   transcript-output.html
 */

import { writeFileSync } from "fs";
import {
  generateTranscriptHtml,
  DiscordChannelType,
  DiscordMessageType,
  type TranscriptData,
  type TranscriptOptions,
} from "@getoeteter/discord-transcripts";

// ─── Build transcript data ───

const data: TranscriptData = {
  guild: {
    id: "123456789",
    name: "My Server",
    icon: null,
  },
  channel: {
    id: "987654321",
    name: "general",
    type: DiscordChannelType.GuildText,
    topic: "Welcome to the server!",
  },
  roles: {
    "111": { id: "111", name: "Admin", color: 0xe74c3c, position: 10 },
    "222": { id: "222", name: "Moderator", color: 0x2ecc71, position: 5 },
    "333": { id: "333", name: "Member", color: 0x3498db, position: 1 },
  },
  channels: {
    "987654321": { id: "987654321", name: "general", type: DiscordChannelType.GuildText },
    "987654322": { id: "987654322", name: "off-topic", type: DiscordChannelType.GuildText },
    "987654323": { id: "987654323", name: "Voice Chat", type: DiscordChannelType.GuildVoice },
  },
  memberRoles: {
    "100": ["111"],        // Alice → Admin
    "200": ["222", "333"], // Bob → Moderator + Member
    "300": ["333"],        // Charlie → Member
  },
  messages: [
    // ─── Regular message ───
    {
      id: "1",
      type: DiscordMessageType.Default,
      content: "Hey everyone! Welcome to the server 🎉",
      author: { id: "100", username: "Alice", avatar: null, bot: false },
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    // ─── Reply ───
    {
      id: "2",
      type: DiscordMessageType.Reply,
      content: "Thanks Alice! Glad to be here.",
      author: { id: "200", username: "Bob", avatar: null, bot: false },
      timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
      messageReference: { messageId: "1" },
      referencedMessage: {
        id: "1",
        type: DiscordMessageType.Default,
        content: "Hey everyone! Welcome to the server 🎉",
        author: { id: "100", username: "Alice", avatar: null },
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
    },
    // ─── Markdown formatting ───
    {
      id: "3",
      type: DiscordMessageType.Default,
      content: [
        "Here\'s some **bold**, *italic*, __underline__, ~~strikethrough~~, and ||spoiler|| text.",
        "",
        "A code snippet: `console.log('hello')`",
        "",
        "```js",
        "function greet(name) {",
        "  return `Hello, ${name}!`;",
        "}",
        "```",
        "",
        "> This is a block quote",
        "",
        "- Item one",
        "- Item two",
        "- Item three",
      ].join("\n"),
      author: { id: "300", username: "Charlie", avatar: null, bot: false },
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    // ─── Mentions ───
    {
      id: "4",
      type: DiscordMessageType.Default,
      content: "Hey <@100> and <@200>, check out <#987654322>! Also <@&222> should see this.",
      author: { id: "300", username: "Charlie", avatar: null },
      timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
      mentions: [
        { id: "100", username: "Alice" },
        { id: "200", username: "Bob" },
      ],
    },
    // ─── Message with embed ───
    {
      id: "5",
      type: DiscordMessageType.Default,
      content: "Check out this cool embed:",
      author: { id: "100", username: "Alice", avatar: null },
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      embeds: [
        {
          title: "Discord Transcript Generator",
          description: "Generate beautiful HTML transcripts from Discord channel data.",
          url: "https://example.com",
          color: 0x5865f2,
          author: { name: "Alice", iconUrl: undefined },
          fields: [
            { name: "Language", value: "TypeScript", inline: true },
            { name: "License", value: "UNLICENSED", inline: true },
            { name: "Features", value: "Themes, embeds, reactions, components, threads" },
          ],
          footer: { text: "Made with ♥" },
          timestamp: new Date().toISOString(),
        },
      ],
    },
    // ─── Message with attachment ───
    {
      id: "6",
      type: DiscordMessageType.Default,
      content: "Here\'s a screenshot:",
      author: { id: "200", username: "Bob", avatar: null },
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      attachments: [
        {
          id: "att1",
          filename: "screenshot.png",
          contentType: "image/png",
          size: 245760,
          url: "https://cdn.discordapp.com/attachments/example/screenshot.png",
          width: 1920,
          height: 1080,
        },
      ],
    },
    // ─── Message with reactions ───
    {
      id: "7",
      type: DiscordMessageType.Default,
      content: "Who wants pizza tonight? 🍕",
      author: { id: "100", username: "Alice", avatar: null },
      timestamp: new Date(Date.now() - 900000).toISOString(),
      reactions: [
        { emoji: { name: "👍", id: null }, count: 5 },
        { emoji: { name: "🍕", id: null }, count: 3 },
        { emoji: { name: "❤️", id: null }, count: 2 },
      ],
    },
    // ─── Bot message with components (V1 buttons) ───
    {
      id: "8",
      type: DiscordMessageType.Default,
      content: "Click a button to pick your role:",
      author: { id: "400", username: "RoleBot", avatar: null, bot: true },
      timestamp: new Date(Date.now() - 600000).toISOString(),
      components: [
        {
          type: 1, // ActionRow
          components: [
            { type: 2, style: 1, label: "Member", customId: "role_member" },
            { type: 2, style: 3, label: "Gamer", customId: "role_gamer" },
            { type: 2, style: 4, label: "Artist", customId: "role_artist" },
            { type: 2, style: 5, label: "Website", url: "https://example.com" },
          ],
        },
      ],
    },
    // ─── Pinned message ───
    {
      id: "9",
      type: DiscordMessageType.ChannelPinnedMessage,
      content: "",
      author: { id: "100", username: "Alice", avatar: null },
      timestamp: new Date(Date.now() - 300000).toISOString(),
      pinned: true,
    },
    // ─── Edited message ───
    {
      id: "10",
      type: DiscordMessageType.Default,
      content: "This message was edited after posting.",
      author: { id: "300", username: "Charlie", avatar: null },
      timestamp: new Date(Date.now() - 120000).toISOString(),
      editedTimestamp: new Date(Date.now() - 60000).toISOString(),
    },
  ],
};

// ─── Generate transcript ───

const options: TranscriptOptions = {
  theme: "dark",
  showReactions: true,
  showAvatars: true,
  showTimestamps: true,
  showRoleColors: true,
  showEmbeds: true,
  showAttachments: true,
  showHeader: true,
  dateFormat: "both",
  pageTitle: "General – My Server",
};

const html = generateTranscriptHtml(data, options);

writeFileSync("transcript-output.html", html);
console.log(`Transcript written to transcript-output.html (${(html.length / 1024).toFixed(1)} KB)`);
