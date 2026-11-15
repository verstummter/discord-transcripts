/**
 * Showcase: Generates a polished, realistic-looking transcript for README screenshots/GIFs.
 *
 * Run with: bun run examples/showcase.ts
 * Output:   showcase.html
 */

import { writeFileSync } from "fs";
import {
  generateTranscriptHtml,
  DiscordChannelType,
  DiscordMessageType,
  type TranscriptData,
  type DiscordMessage,
  type DiscordPoll,
  type DiscordUser,
} from "@getoeteter/discord-transcripts";

// ─── Users ───

const geto = { id: "1", username: "getoeteter", globalName: "getoeteter", avatar: "https://cdn.boobs.rip/pfp.png", discriminator: "5", bot: false };
const kai  = { id: "2", username: "kaizen", globalName: "Kai", avatar: null, discriminator: "1", bot: false };
const nova = { id: "3", username: "nova.x", globalName: "Nova", avatar: null, discriminator: "3", bot: false };
const mira = { id: "4", username: "mirabot", avatar: null, discriminator: "9", bot: true };

let id = 0;
const base = new Date("2026-03-15T14:00:00Z").getTime();
const t = (minutes: number) => new Date(base + minutes * 60000).toISOString();
const m = (content: string, author: DiscordUser, minutes: number, extra: Partial<DiscordMessage> = {}): DiscordMessage => ({
  id: String(++id),
  type: DiscordMessageType.Default,
  content,
  author,
  timestamp: t(minutes),
  ...extra,
});

// ─── Data ───

const data: TranscriptData = {
  guild: { id: "1", name: "Nebula Labs", icon: "https://cdn.discordapp.com/embed/avatars/2.png" },
  channel: {
    id: "100",
    name: "dev-chat",
    type: DiscordChannelType.GuildText,
    topic: "General development discussion · Be kind, write tests",
  },
  roles: {
    "200": { id: "200", name: "Core Team", color: 0xf47fff, position: 10 },
    "201": { id: "201", name: "Contributor", color: 0x57f287, position: 5 },
    "202": { id: "202", name: "Member", color: 0x5865f2, position: 1 },
  },
  channels: {
    "100": { id: "100", name: "dev-chat", type: DiscordChannelType.GuildText },
    "101": { id: "101", name: "announcements", type: DiscordChannelType.GuildAnnouncement },
    "102": { id: "102", name: "voice-chat", type: DiscordChannelType.GuildVoice },
  },
  memberRoles: {
    "1": ["200"],
    "2": ["201"],
    "3": ["202"],
    "4": [],
  },
  messages: [
    // ─── Natural conversation start ───
    m("hey everyone! just pushed the new markdown parser 🎉", geto, 0),
    m("it supports **bold**, *italic*, __underline__, ~~strikethrough~~, `inline code`, and ||spoilers|| now", geto, 0.5),

    m("nice! does it handle code blocks too?", kai, 1, {
      type: DiscordMessageType.Reply,
      messageReference: { messageId: "1" },
      referencedMessage: {
        id: "1",
        type: DiscordMessageType.Default,
        content: "hey everyone! just pushed the new markdown parser 🎉",
        author: geto,
        timestamp: t(0),
      },
    }),

    m("yep, full syntax highlighting:\n```js\nconst transcript = await createTranscript(channel, {\n  theme: \"dark\",\n  limit: 500,\n});\n\nconsole.log(`Generated ${transcript.messageCount} messages`);\n```", geto, 2),

    m("that's clean. what about block quotes and lists?", nova, 3),

    m("> Block quotes work perfectly\n\nAnd lists:\n- Embeds with all fields\n- Reactions & components\n- Thread indicators\n- Attachment previews", geto, 4, {
      reactions: [
        { emoji: { name: "🔥", id: null }, count: 4 },
        { emoji: { name: "💯", id: null }, count: 3 },
        { emoji: { name: "👀", id: null }, count: 2 },
      ],
    }),

    // ─── Bot embed ───
    m("", mira, 5, {
      content: "Here's the latest build status:",
      embeds: [
        {
          title: "Build #247 — Passed",
          url: "https://example.com/builds/247",
          description: "All **42 tests** passed in `3.2s`\n\nCommit: `feat: add V2 component rendering`",
          color: 0x57f287,
          author: {
            name: "CI Pipeline",
            iconUrl: "https://cdn.discordapp.com/embed/avatars/4.png",
          },
          fields: [
            { name: "Coverage", value: "94.2%", inline: true },
            { name: "Bundle Size", value: "18.3 KB", inline: true },
            { name: "Duration", value: "3.2s", inline: true },
          ],
          footer: { text: "main • a3f8c21", iconUrl: "https://cdn.discordapp.com/embed/avatars/2.png" },
          timestamp: t(5),
        },
      ],
    }),

    // ─── Mentions & timestamps ───
    m(`nice work <@1>! when's the release? <@&200> should review first\n\ndeadline is <t:${Math.floor(new Date("2026-03-20T18:00:00Z").getTime() / 1000)}:R>`, kai, 7, {
      mentions: [{ id: "1", username: "getoeteter" }],
    }),

    // ─── Image attachment ───
    m("here's a preview of the dark theme output:", nova, 9, {
      attachments: [
        {
          id: "att1",
          filename: "transcript-preview.png",
          contentType: "image/png",
          size: 348160,
          url: "https://cdn.discordapp.com/embed/avatars/2.png",
          width: 800,
          height: 450,
        },
      ],
    }),

    m("looks great! the light theme also works btw", kai, 10),

    // ─── Spoiler ───
    m("||sneak peek of the next feature 👀||", geto, 11),

    // ─── Bot with V1 components ───
    m("New release ready! Pick your notification preference:", mira, 13, {
      components: [
        {
          type: 1,
          components: [
            { type: 2, style: 3, label: "Subscribe", emoji: { name: "🔔", id: null } },
            { type: 2, style: 2, label: "Release Notes Only" },
            { type: 2, style: 4, label: "Unsubscribe" },
            { type: 2, style: 5, label: "View Changelog", url: "https://example.com/changelog" },
          ],
        },
      ],
    }),

    // ─── Slash command context ───
    m("Searching for user `kai`...", mira, 16, {
      type: DiscordMessageType.ChatInputCommand,
      interaction: {
        name: "lookup",
        user: kai,
      },
      embeds: [{
        title: "User Lookup: Kai",
        description: "Account created <t:1640000000:R>",
        color: 0x5865f2,
        fields: [
          { name: "Roles", value: "<@&201>", inline: true },
          { name: "Messages", value: "1,247", inline: true },
        ],
      }],
    }),

    // ─── Thread with expandable messages ───
    m("should we add PDF export? let's discuss in a thread", nova, 17, {
      thread: {
        id: "t1",
        name: "PDF Export Discussion",
        messageCount: 3,
        messages: [
          m("I think PDF would be great for archival", kai, 17.5),
          m("We could use puppeteer to render the HTML to PDF", geto, 18),
          m("Let me prototype it this weekend", nova, 18.5),
        ],
      },
      reactions: [
        { emoji: { name: "👍", id: null }, count: 6 },
        { emoji: { name: "🤔", id: null }, count: 2 },
      ],
    }),

    // ─── Poll ───
    m("", geto, 19, {
      content: "Quick poll for the team:",
      poll: {
        question: { text: "What should we prioritize next?" },
        answers: [
          { answerId: 1, pollMedia: { text: "PDF Export", emoji: { name: "📄", id: null } }, count: 8 },
          { answerId: 2, pollMedia: { text: "Dark/Light Theme Toggle", emoji: { name: "🌙", id: null } }, count: 12 },
          { answerId: 3, pollMedia: { text: "Message Search", emoji: { name: "🔍", id: null } }, count: 5 },
          { answerId: 4, pollMedia: { text: "Mobile Responsive", emoji: { name: "📱", id: null } }, count: 3 },
        ],
        allowMultiselect: false,
        isFinalized: true,
      } satisfies DiscordPoll,
    }),

    // ─── Voice message ───
    m("", nova, 20, {
      content: "",
      voiceMessage: {
        duration: 12,
        waveform: Buffer.from(Array.from({ length: 48 }, () => Math.floor(Math.random() * 200 + 30))).toString("base64"),
      },
      attachments: [{
        id: "voice1",
        filename: "voice-message.ogg",
        contentType: "audio/ogg",
        size: 24576,
        url: "https://example.com/voice.ogg",
      }],
    }),

    // ─── AutoMod message ───
    m("", mira, 21, {
      type: DiscordMessageType.AutoModerationAction,
    }),

    // ─── Embed with rich fields ───
    m("", mira, 17, {
      embeds: [
        {
          title: "📊 Weekly Stats — Nebula Labs",
          description: "Server activity for the past 7 days",
          color: 0x5865f2,
          thumbnail: { url: "https://cdn.discordapp.com/embed/avatars/2.png" },
          fields: [
            { name: "Messages", value: "**2,847**", inline: true },
            { name: "Active Members", value: "**142**", inline: true },
            { name: "New Joins", value: "**38** (+12%)", inline: true },
            { name: "Top Channel", value: "<#100> — 623 messages" },
          ],
          footer: { text: "Updated every Monday" },
          timestamp: t(17),
        },
      ],
    }),

    // ─── V2 Container ───
    m("", mira, 19, {
      components: [
        {
          type: 17,
          accentColor: 0xf47fff,
          components: [
            { type: 10, content: "## 🚀 Release v2.1.0\nNew features and improvements are live!" },
            { type: 14, spacing: 1, divider: true },
            {
              type: 9,
              components: [
                { type: 10, content: "**What's new:**\n- V2 component support\n- Spoiler attachments\n- Thread indicators\n- Compact mode" },
              ],
              accessory: {
                type: 11,
                media: { url: "https://cdn.discordapp.com/embed/avatars/2.png" },
              },
            },
          ],
        },
      ],
    }),

    // ─── Closing messages ───
    m("this is awesome, great work team! 🎊", kai, 20, {
      reactions: [
        { emoji: { name: "❤️", id: null }, count: 5 },
        { emoji: { name: "🎉", id: null }, count: 4 },
        { emoji: { name: "✨", id: null }, count: 3 },
      ],
    }),

    m("thanks everyone 💜 check <#101> for the full announcement", geto, 21),
  ],
};

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
  dateFormat: "absolute",
  pageTitle: "#dev-chat — Nebula Labs",
  enableSearch: true,
  enableThemeToggle: true,
  enableDateNav: true,
  showUserStats: true,
  enableCopyButton: true,
  collapsibleEmbeds: true,
  enableLightbox: true,
  expandThreads: true,
  includeJson: true,
});

writeFileSync("showcase.html", html);
console.log(`Showcase transcript: showcase.html (${(html.length / 1024).toFixed(1)} KB, ${data.messages.length} messages)`);
