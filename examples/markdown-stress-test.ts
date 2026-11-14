/**
 * Example: Comprehensive feature stress test (no discord.js needed)
 *
 * Exercises every rendering feature the transcript generator supports:
 * all markdown, every message type, all embed variants, all attachment types,
 * all V1+V2 components, stickers, reactions, threads, mentions, timestamps, etc.
 *
 * Run with: bun run examples/markdown-stress-test.ts
 * Output:   stress-test-output.html
 */

import { writeFileSync } from "fs";
import {
  generateTranscriptHtml,
  DiscordChannelType,
  DiscordMessageType,
  type TranscriptData,
  type DiscordMessage,
} from "@getoeteter/discord-transcripts";

const user = { id: "1", username: "TestUser", globalName: "Test User", avatar: null, bot: false };
const user2 = { id: "3", username: "JaneDoe", globalName: "Jane", avatar: null, bot: false };
const bot = { id: "2", username: "TestBot", avatar: null, bot: true };
const webhook = { id: "4", username: "GitHub", avatar: null, bot: true };
let msgId = 0;
const ts = () => new Date(Date.now() - (200 - msgId) * 60000).toISOString();
const msg = (content: string, extra: Partial<DiscordMessage> = {}): DiscordMessage => ({
  id: String(++msgId),
  type: DiscordMessageType.Default,
  content,
  author: user,
  timestamp: ts(),
  ...extra,
});

const now = Math.floor(Date.now() / 1000);

const data: TranscriptData = {
  guild: { id: "1", name: "Test Server", icon: "https://cdn.discordapp.com/embed/avatars/0.png" },
  channel: {
    id: "1",
    name: "stress-test",
    type: DiscordChannelType.GuildText,
    topic: "Comprehensive feature stress test - every rendering path exercised",
  },
  roles: {
    "10": { id: "10", name: "Admin", color: 0xff0000, position: 10 },
    "20": { id: "20", name: "Moderator", color: 0x2ecc71, position: 5 },
    "30": { id: "30", name: "Member", color: 0x3498db, position: 1 },
  },
  channels: {
    "1": { id: "1", name: "stress-test", type: DiscordChannelType.GuildText },
    "2": { id: "2", name: "announcements", type: DiscordChannelType.GuildAnnouncement },
    "3": { id: "3", name: "Voice Lounge", type: DiscordChannelType.GuildVoice },
    "4": { id: "4", name: "Stage Events", type: DiscordChannelType.GuildStageVoice },
  },
  memberRoles: {
    "1": ["10"],       // TestUser → Admin (red)
    "3": ["20", "30"], // JaneDoe → Moderator + Member (green)
  },
  messages: [
    // ════════════════════════════════════════════
    // SECTION 1: MARKDOWN / TEXT FORMATTING
    // ════════════════════════════════════════════

    // Inline formatting
    msg("**bold** *italic* __underline__ ~~strikethrough~~ ||spoiler|| `inline code`"),
    msg("**__*~~combined formatting~~*__**"),
    msg("***bold italic*** __*underline italic*__"),

    // Block quotes
    msg("> Single line quote"),
    msg("> Multi-line quote\n> continues here\n> and here"),
    msg("Text before\n> Quote in the middle\nText after"),
    msg(">>> Multi-paragraph block quote\nThis entire block\nis quoted"),

    // Headers
    msg("# Heading 1\n## Heading 2\n### Heading 3"),

    // Lists
    msg("- Item A\n- Item B\n- Item C"),
    msg("Text before list\n- First\n- Second\nText after list"),

    // Code blocks
    msg("```\nPlain code block\nwith multiple lines\n```"),
    msg("```js\nconst x = 42;\nconsole.log(x);\n```"),
    msg("```python\ndef hello():\n    print(\"world\")\n```"),
    msg("```\n```"), // Empty code block

    // Links
    msg("Auto-linked: https://example.com and http://example.org/path?q=1&b=2"),
    msg("[Masked link](https://example.com)"),

    // @everyone and @here
    msg("Hey @everyone, important announcement! Also @here for those online."),

    // ════════════════════════════════════════════
    // SECTION 2: MENTIONS
    // ════════════════════════════════════════════

    msg("User mention: <@1> Nick format: <@!3> Role: <@&10> Channel: <#2> Voice: <#3>", {
      mentions: [
        { id: "1", username: "TestUser" },
        { id: "3", username: "JaneDoe" },
      ],
    }),

    // ════════════════════════════════════════════
    // SECTION 3: TIMESTAMPS (all formats)
    // ════════════════════════════════════════════

    msg([
      `Short time: <t:${now}:t>`,
      `Long time: <t:${now}:T>`,
      `Short date: <t:${now}:d>`,
      `Long date: <t:${now}:D>`,
      `Short date/time: <t:${now}:f>`,
      `Long date/time: <t:${now}:F>`,
      `Relative: <t:${now}:R>`,
    ].join("\n")),

    // ════════════════════════════════════════════
    // SECTION 4: EMOJI
    // ════════════════════════════════════════════

    msg("Unicode: 🎉🔥💀👍❤️🤣😭🥺✨💯"),
    msg("Custom static: <:pepe:123456> Animated: <a:dance:789012>"),

    // ════════════════════════════════════════════
    // SECTION 5: REPLIES
    // ════════════════════════════════════════════

    // Reply with referenced message
    msg("This is a reply to the first message", {
      type: DiscordMessageType.Reply,
      messageReference: { messageId: "1" },
      referencedMessage: {
        id: "1",
        type: DiscordMessageType.Default,
        content: "**bold** *italic* __underline__ ~~strikethrough~~ ||spoiler|| `inline code`",
        author: user,
        timestamp: ts(),
      },
    }),

    // Reply with deleted reference (messageReference exists but referencedMessage is null)
    msg("Reply to a deleted message", {
      type: DiscordMessageType.Reply,
      messageReference: { messageId: "999999" },
      referencedMessage: null,
    }),

    // ════════════════════════════════════════════
    // SECTION 6: MESSAGE VARIANTS
    // ════════════════════════════════════════════

    // Edited message
    msg("This was edited after posting", { editedTimestamp: new Date().toISOString() }),

    // Pinned message
    msg("This message is pinned and important!", { pinned: true }),

    // globalName display (user2 has globalName "Jane")
    msg("Message from user with globalName", { author: user2 }),

    // Webhook message (shows WEBHOOK badge)
    msg("New commit pushed to `main`: fix: resolve emoji rendering issue", {
      author: webhook,
      webhookId: "wh_123",
    }),

    // ChatInputCommand (slash command)
    msg("Here are your server stats:", { type: DiscordMessageType.ChatInputCommand, author: bot }),

    // ════════════════════════════════════════════
    // SECTION 7: SYSTEM MESSAGES
    // ════════════════════════════════════════════

    msg("", { type: DiscordMessageType.UserJoin }),
    msg("", { type: DiscordMessageType.GuildBoost }),
    msg("", { type: DiscordMessageType.GuildBoostTier1 }),
    msg("", { type: DiscordMessageType.GuildBoostTier2 }),
    msg("", { type: DiscordMessageType.GuildBoostTier3 }),
    msg("", { type: DiscordMessageType.ChannelPinnedMessage }),
    msg("", { type: DiscordMessageType.RecipientAdd }),
    msg("", { type: DiscordMessageType.RecipientRemove }),
    msg("", { type: DiscordMessageType.Call }),
    msg("new-channel-name", { type: DiscordMessageType.ChannelNameChange }),
    msg("", { type: DiscordMessageType.ChannelIconChange }),
    msg("#updates", { type: DiscordMessageType.ChannelFollowAdd }),
    msg("", { type: DiscordMessageType.StageStart }),
    msg("", { type: DiscordMessageType.StageEnd }),
    msg("", { type: DiscordMessageType.StageSpeaker }),
    msg("AMA with the devs", { type: DiscordMessageType.StageTopic }),

    // ════════════════════════════════════════════
    // SECTION 8: REACTIONS
    // ════════════════════════════════════════════

    msg("React to this message!", {
      reactions: [
        { emoji: { name: "👍", id: null }, count: 12 },
        { emoji: { name: "🔥", id: null }, count: 7 },
        { emoji: { name: "pepe", id: "123456" }, count: 3 },
        { emoji: { name: "animated_dance", id: "789012", animated: true }, count: 1 },
      ],
    }),

    // ════════════════════════════════════════════
    // SECTION 9: EMBEDS - ALL VARIANTS
    // ════════════════════════════════════════════

    // Rich embed with every field
    msg("Full rich embed:", {
      embeds: [
        {
          title: "Rich Embed Title (clickable)",
          url: "https://example.com",
          description: "Has **markdown** in description with `code`, [links](https://example.com), and ||spoilers||",
          color: 0x5865f2,
          author: {
            name: "Author Name",
            url: "https://example.com/author",
            iconUrl: "https://cdn.discordapp.com/embed/avatars/0.png",
          },
          thumbnail: { url: "https://cdn.discordapp.com/embed/avatars/1.png" },
          image: { url: "https://cdn.discordapp.com/embed/avatars/2.png" },
          fields: [
            { name: "Inline 1", value: "Value one", inline: true },
            { name: "Inline 2", value: "Value two", inline: true },
            { name: "Inline 3", value: "Value three", inline: true },
            { name: "Full Width Field", value: "This field spans the entire embed width" },
          ],
          footer: {
            text: "Footer text",
            iconUrl: "https://cdn.discordapp.com/embed/avatars/3.png",
          },
          timestamp: new Date().toISOString(),
        },
      ],
    }),

    // Minimal embed
    msg("Minimal embed:", {
      embeds: [
        {
          title: "Just a Title",
          description: "Just a description",
          color: 0xe74c3c,
        },
      ],
    }),

    // Image-only embed (e.g. direct image URL pasted)
    msg("Image embed (direct URL):", {
      embeds: [
        {
          type: "image",
          thumbnail: { url: "https://cdn.discordapp.com/embed/avatars/4.png", width: 300, height: 300 },
        },
      ],
    }),

    // GIFV embed (Tenor/Giphy)
    msg("GIF embed (Tenor-style):", {
      embeds: [
        {
          type: "gifv",
          thumbnail: { url: "https://cdn.discordapp.com/embed/avatars/0.png" },
          video: {
            url: "https://media.tenor.com/example.mp4",
            proxyUrl: "https://media.tenor.com/example.mp4",
            width: 320,
            height: 240,
          },
        },
      ],
    }),

    // Embed with video (YouTube-style)
    msg("Video embed:", {
      embeds: [
        {
          title: "Cool Video Title",
          description: "A video embed with a preview.",
          color: 0xff0000,
          video: { url: "https://www.youtube.com/embed/example", width: 560, height: 315 },
          thumbnail: { url: "https://cdn.discordapp.com/embed/avatars/2.png", width: 480, height: 360 },
          author: { name: "YouTube", url: "https://youtube.com" },
        },
      ],
    }),

    // Multiple embeds on one message
    msg("Multiple embeds:", {
      embeds: [
        { title: "Embed A", description: "First", color: 0x5865f2 },
        { title: "Embed B", description: "Second", color: 0x2ecc71 },
        { title: "Embed C", description: "Third", color: 0xf0b232 },
      ],
    }),

    // ════════════════════════════════════════════
    // SECTION 10: ATTACHMENTS — ALL TYPES
    // ════════════════════════════════════════════

    // Image with description
    msg("Image with alt text:", {
      attachments: [
        {
          id: "a1",
          filename: "photo.jpg",
          description: "A beautiful sunset over the mountains",
          contentType: "image/jpeg",
          size: 524288,
          url: "https://cdn.discordapp.com/embed/avatars/2.png",
          width: 800,
          height: 600,
        },
      ],
    }),

    // Spoiler image
    msg("Spoiler image:", {
      attachments: [
        {
          id: "a2",
          filename: "SPOILER_secret.png",
          contentType: "image/png",
          size: 102400,
          url: "https://cdn.discordapp.com/embed/avatars/3.png",
          width: 400,
          height: 400,
          spoiler: true,
        },
      ],
    }),

    // Video attachment
    msg("Video attachment:", {
      attachments: [
        {
          id: "a3",
          filename: "clip.mp4",
          contentType: "video/mp4",
          size: 5242880,
          url: "https://example.com/clip.mp4",
          width: 1280,
          height: 720,
        },
      ],
    }),

    // Audio attachment
    msg("Audio attachment:", {
      attachments: [
        {
          id: "a4",
          filename: "recording.ogg",
          contentType: "audio/ogg",
          size: 1048576,
          url: "https://example.com/recording.ogg",
        },
      ],
    }),

    // Voice message (Discord-style UI — should NOT duplicate as full HTML audio player)
    msg("", {
      voiceMessage: {
        duration: 7.3,
        waveform: Buffer.from([20, 40, 80, 120, 180, 200, 150, 100, 60, 40, 80, 140, 200, 220, 180, 120, 80, 60, 40, 30, 50, 90, 130, 170, 190, 160, 110, 70, 50, 40, 30, 25]).toString("base64"),
      },
      attachments: [
        {
          id: "vm1",
          filename: "voice-message.ogg",
          contentType: "audio/ogg",
          size: 51200,
          url: "https://example.com/voice-message.ogg",
        },
      ],
    }),

    // Generic file
    msg("File attachment:", {
      attachments: [
        {
          id: "a5",
          filename: "report.pdf",
          contentType: "application/pdf",
          size: 2097152,
          url: "https://example.com/report.pdf",
        },
      ],
    }),

    // ════════════════════════════════════════════
    // SECTION 11: STICKERS
    // ════════════════════════════════════════════

    // Sticker with URL
    msg("", {
      stickers: [
        {
          id: "s1",
          name: "Wumpus Wave",
          formatType: 1,
          url: "https://cdn.discordapp.com/embed/avatars/4.png",
        },
      ],
    }),

    // Sticker without URL (placeholder)
    msg("", {
      stickers: [
        {
          id: "s2",
          name: "Cool Sticker",
          formatType: 1,
        },
      ],
    }),

    // ════════════════════════════════════════════
    // SECTION 12: V1 COMPONENTS
    // ════════════════════════════════════════════

    // All button styles
    msg("V1 button styles:", {
      author: bot,
      components: [
        {
          type: 1,
          components: [
            { type: 2, style: 1, label: "Primary" },
            { type: 2, style: 2, label: "Secondary" },
            { type: 2, style: 3, label: "Success" },
            { type: 2, style: 4, label: "Danger" },
            { type: 2, style: 5, label: "Link", url: "https://example.com" },
          ],
        },
        {
          type: 1,
          components: [
            { type: 2, style: 1, label: "Unicode Emoji", emoji: { name: "🎉", id: null } },
            { type: 2, style: 1, label: "Custom Emoji", emoji: { name: "pepe", id: "123456" } },
            { type: 2, style: 2, label: "Disabled", disabled: true },
          ],
        },
      ],
    }),

    // Select menu
    msg("V1 select menu:", {
      author: bot,
      components: [
        {
          type: 1,
          components: [
            { type: 3, label: "Pick a color", customId: "color_select" },
          ],
        },
        {
          type: 1,
          components: [
            { type: 5, label: "Select a user", customId: "user_select" },
          ],
        },
        {
          type: 1,
          components: [
            { type: 6, label: "Select a role", customId: "role_select" },
          ],
        },
        {
          type: 1,
          components: [
            { type: 8, label: "Select a channel", customId: "channel_select" },
          ],
        },
      ],
    }),

    // ════════════════════════════════════════════
    // SECTION 13: V2 COMPONENTS
    // ════════════════════════════════════════════

    // Container with text, separator, section with thumbnail, media gallery
    msg("", {
      author: bot,
      components: [
        {
          type: 17, // Container
          accentColor: 0x5865f2,
          components: [
            { type: 10, content: "**Welcome!** This is a V2 container with accent color." },
            { type: 14, spacing: 1, divider: true }, // Separator small + divider
            {
              type: 9, // Section
              components: [
                { type: 10, content: "Section with a thumbnail accessory →" },
              ],
              accessory: {
                type: 11,
                media: { url: "https://cdn.discordapp.com/embed/avatars/4.png" },
              },
            },
            { type: 14, spacing: 2, divider: false }, // Large spacer no divider
            {
              type: 12, // MediaGallery — multiple items
              items: [
                { media: { url: "https://cdn.discordapp.com/embed/avatars/0.png" }, description: "Avatar 1" },
                { media: { url: "https://cdn.discordapp.com/embed/avatars/1.png" }, description: "Avatar 2" },
                { media: { url: "https://cdn.discordapp.com/embed/avatars/2.png" }, description: "Avatar 3" },
              ],
            },
          ],
        },
      ],
    }),

    // Standalone thumbnail (type 11)
    msg("", {
      author: bot,
      components: [
        {
          type: 11, // Thumbnail standalone
          media: { url: "https://cdn.discordapp.com/embed/avatars/3.png" },
          description: "Standalone thumbnail component",
        },
      ],
    }),

    // Single-item media gallery
    msg("", {
      author: bot,
      components: [
        {
          type: 12,
          items: [
            { media: { url: "https://cdn.discordapp.com/embed/avatars/1.png" }, description: "Single gallery item" },
          ],
        },
      ],
    }),

    // Media gallery with spoiler item
    msg("", {
      author: bot,
      components: [
        {
          type: 12,
          items: [
            { media: { url: "https://cdn.discordapp.com/embed/avatars/0.png" }, description: "Normal" },
            { media: { url: "https://cdn.discordapp.com/embed/avatars/1.png" }, description: "Spoiler!", spoiler: true },
          ],
        },
      ],
    }),

    // File component (type 13)
    msg("", {
      author: bot,
      components: [
        {
          type: 13,
          file: { url: "https://example.com/document.pdf", contentType: "application/pdf" },
        },
      ],
    }),

    // Label (type 18)
    msg("", {
      author: bot,
      components: [
        {
          type: 17,
          components: [
            { type: 18, content: "This is a V2 label component" },
            { type: 10, content: "With text display below it" },
          ],
        },
      ],
    }),

    // Container with spoiler
    msg("", {
      author: bot,
      components: [
        {
          type: 17,
          spoiler: true,
          accentColor: 0xe74c3c,
          components: [
            { type: 10, content: "This container is marked as a spoiler! 🙈" },
          ],
        },
      ],
    }),

    // ════════════════════════════════════════════
    // SECTION 14: THREADS
    // ════════════════════════════════════════════

    msg("Message that started a thread", {
      thread: { id: "t1", name: "Discussion Thread", messageCount: 42 },
    }),

    // ════════════════════════════════════════════
    // SECTION 15: EDGE CASES
    // ════════════════════════════════════════════

    // Long content (2000 chars)
    msg("A".repeat(2000)),

    // Message grouping (same author, close timestamps)
    msg("First grouped message"),
    msg("Second grouped message (should merge)"),
    msg("Third grouped message"),

    // Short message after long
    msg("Short after long"),

    // ─── embedMedia: message with mixed media for data URI resolution ───
    msg("Embedded media test: image attachment + custom emoji <:fire:999888777>", {
      attachments: [
        { id: "emb1", filename: "embedded.png", size: 100, url: "https://example.com/embedded.png", contentType: "image/png", width: 200, height: 200 },
      ],
      embeds: [{
        type: "rich",
        title: "Embed title with emoji <:fire:999888777>",
        description: "Embed description with custom emoji <:fire:999888777> should render as data URI",
        author: { name: "Author with <:fire:999888777> emoji", iconUrl: "https://example.com/author-icon.png" },
        thumbnail: { url: "https://example.com/thumb.png", width: 80, height: 80 },
        footer: { text: "Footer with emoji <:fire:999888777>", iconUrl: "https://example.com/footer-icon.png" },
        image: { url: "https://example.com/embed-img.png", width: 300, height: 200 },
        fields: [
          { name: "Field with emoji", value: "Value has <:fire:999888777> emoji too", inline: false },
        ],
      }],
      reactions: [
        { emoji: { id: "999888777", name: "fire", animated: false }, count: 3 },
      ],
    }),
  ],
};

// ─── Generate with dark theme (all features on) ───

const html = generateTranscriptHtml(data, {
  theme: "dark",
  showReactions: true,
  showAvatars: true,
  showTimestamps: true,
  showRoleColors: true,
  showEmbeds: true,
  showAttachments: true,
  showHeader: true,
  showThreads: true,
  dateFormat: "both",
  pageTitle: "Stress Test – Test Server",
  compact: false,
  customCss: "/* custom CSS injection test */ .discord-transcript { --test: 1; }",
  faviconUrl: "https://cdn.discordapp.com/embed/avatars/0.png",
});

writeFileSync("stress-test-output.html", html);
console.log(`Dark theme transcript: stress-test-output.html (${(html.length / 1024).toFixed(1)} KB, ${data.messages.length} messages)`);

// ─── Generate compact + light theme variant ───

const htmlLight = generateTranscriptHtml(data, {
  theme: "light",
  showReactions: true,
  showAvatars: true,
  showTimestamps: true,
  showRoleColors: true,
  showEmbeds: true,
  showAttachments: true,
  showHeader: true,
  showThreads: true,
  dateFormat: "absolute",
  compact: true,
  pageTitle: "Stress Test (Light + Compact)",
  fontFamily: "'Segoe UI', sans-serif",
  maxImageWidth: 300,
});

writeFileSync("stress-test-light.html", htmlLight);
console.log(`Light/compact transcript: stress-test-light.html (${(htmlLight.length / 1024).toFixed(1)} KB)`);

// ─── Generate variant with simulated embedMedia (data URI resolution) ───

// Simulate a resolved media map (in real usage, resolveMediaUrls() produces this)
const fakeDataUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
const resolvedMedia = new Map<string, string>([
  ["https://example.com/embedded.png", fakeDataUri],
  ["https://example.com/author-icon.png", fakeDataUri],
  ["https://example.com/thumb.png", fakeDataUri],
  ["https://example.com/footer-icon.png", fakeDataUri],
  ["https://example.com/embed-img.png", fakeDataUri],
  ["https://cdn.discordapp.com/emojis/999888777.webp?size=48&quality=lossless", fakeDataUri],
  ["https://cdn.discordapp.com/embed/avatars/0.png", fakeDataUri],
]);

const htmlEmbed = generateTranscriptHtml(data, {
  theme: "dark",
  showReactions: true,
  showAvatars: true,
  showEmbeds: true,
  showAttachments: true,
  showHeader: true,
  _resolvedMedia: resolvedMedia,
});

// Verify data URIs appear in the output
const dataUriCount = (htmlEmbed.match(/data:image\/png;base64,/g) || []).length;
console.log(`Embedded media transcript: ${dataUriCount} data URIs resolved (expected ≥7)`);
writeFileSync("stress-test-embedded.html", htmlEmbed);
console.log(`Embedded media transcript: stress-test-embedded.html (${(htmlEmbed.length / 1024).toFixed(1)} KB)`);

