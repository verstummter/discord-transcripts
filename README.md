# @getoeteter/discord-transcripts

Generate standalone HTML transcripts from Discord channels. Works with discord.js v14.

The generated HTML files are completely self-contained - no external dependencies, no JavaScript frameworks. Just open the file in a browser.

![Preview](https://i.postimg.cc/0yynRYFb/SSQ9S3p6.gif)

**[Documentation](https://docs.boobs.rip/)** | **[API Reference](https://docs.boobs.rip/docs/api-reference)** | **[Examples](https://docs.boobs.rip/docs/examples)**

## Installation

```bash
npm install @getoeteter/discord-transcripts
# or
bun add @getoeteter/discord-transcripts
```

Requires `discord.js` ^14.0.0 as a peer dependency.

## Quick Start

```typescript
import { createTranscript } from "@getoeteter/discord-transcripts";

// inside a slash command or event handler
const result = await createTranscript(channel, {
  limit: 500,
});

// send as a file attachment
await interaction.editReply({
  files: [{ attachment: result.buffer, name: result.filename }],
});
```

`createTranscript` handles everything - fetching messages, resolving roles and mentions, generating the HTML.

## Options

Pass these as the second argument to `createTranscript`:

```typescript
const result = await createTranscript(channel, {
  limit: 200,           // how many messages to fetch (default: 100, max: 5000)
  before: "message-id", // fetch messages before this ID
  after: "message-id",  // fetch messages after this ID
  theme: "dark",        // "dark" or "light" (default: "dark")
  compact: false,       // compact message layout
  resolveRoles: true,   // resolve member roles for colored usernames

  // toggle specific elements
  showReactions: true,
  showAvatars: true,
  showTimestamps: true,
  showRoleColors: true,
  showEmbeds: true,
  showAttachments: true,
  showThreads: true,
  showHeader: true,

  // formatting
  dateFormat: "absolute", // "relative", "absolute", or "both"
  maxImageWidth: 400,

  // interactive features (all off by default)
  enableSearch: false,      // message search bar
  enableDateNav: false,     // jump-to-date sidebar
  showUserStats: false,     // user statistics section
  enableCopyButton: false,  // copy-message button on hover
  collapsibleEmbeds: false, // click to collapse/expand embeds
  enableLightbox: false,    // click images to view full-size
  expandThreads: false,     // inline thread expansion
  embedMedia: false,        // embed all media as base64 data URIs
  includeJson: false,       // embed raw JSON data in output
  messagesPerPage: undefined, // enable pagination

  // customization
  customCss: "",         // inject additional CSS
  fontFamily: "",        // override the font
  pageTitle: "",         // custom <title> tag
  faviconUrl: "",        // custom favicon
});
```

## Return Value

```typescript
{
  html: string,         // the full HTML document
  buffer: Buffer,       // ready for discord.js file uploads
  filename: string,     // e.g. "transcript-general-2026-03-11.html"
  messageCount: number,
}
```

## Using Without discord.js

If you're pulling messages from a database or another source, you can use `generateTranscriptHtml` directly:

```typescript
import { generateTranscriptHtml } from "@getoeteter/discord-transcripts";
import type { TranscriptData } from "@getoeteter/discord-transcripts";

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
  // optional: pass roles and channels for mention resolution
  roles: {},
  channels: {},
  memberRoles: {},
};

const html = generateTranscriptHtml(data, { theme: "dark" });
```

### Embedding Media

Discord CDN links expire over time. Use `embedMedia` to download all media and embed it as base64 data URIs, making the transcript fully self-contained:

```typescript
// With discord.js - just set the option
const result = await createTranscript(channel, { embedMedia: true });

// Without discord.js - resolve media first
import { generateTranscriptHtml, resolveMediaUrls } from "@getoeteter/discord-transcripts";

const mediaMap = await resolveMediaUrls(data);
const html = generateTranscriptHtml(data, { _resolvedMedia: mediaMap });
```

Check the exported types (`TranscriptData`, `DiscordMessage`, etc.) for the full data shape.

## What's Supported

- Text formatting (bold, italic, underline, strikethrough, spoilers, code blocks, headers, lists, block quotes)
- User/role/channel mentions with proper colors and names
- Custom and unicode emojis
- Discord timestamps (all format types)
- Embeds with fields, images, thumbnails, footers, authors
- GIF embeds (Tenor, Giphy) rendered as inline video
- Image, video, audio, and file attachments
- Reactions with counts
- Replies with context preview
- Threads
- Stickers
- Buttons and select menus
- Components V2 (containers, sections, text displays, media galleries, separators, files, thumbnails)
- System messages (joins, boosts, pins, etc.)
- Message grouping and date separators
- Bot and webhook badges
- Message search, jump-to-date navigation, user statistics
- Image lightbox, collapsible embeds, copy-message button
- Pagination
- Offline/permanent transcripts via base64 media embedding
- Dark and light themes
- Compact mode
- Responsive layout
- Print styles

## Note on Obfuscation

The distributed JavaScript files are minified and obfuscated (variable mangling, string encoding via `String.fromCharCode`). This is intentional source protection, there is no `eval`, no remote code execution, no data collection. The generated HTML transcripts are fully self-contained with no external requests beyond Discord CDN resources for message content (avatars, emoji, attachments), or zero external requests when `embedMedia` is enabled.

## License

Proprietary - all rights reserved.