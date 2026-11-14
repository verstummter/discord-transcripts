---
sidebar_position: 3
sidebar_label: Advanced
title: Advanced Features
description: JSON export, pagination, and custom component renderers.
---

# Advanced Features

## JSON Export

Sticks the raw `TranscriptData` as JSON inside the HTML file so you can extract it later programmatically.

**Option:** `includeJson: true`

```typescript
const html = generateTranscriptHtml(data, {
  includeJson: true,
});
```

The JSON is embedded as a `<script>` tag with type `application/json`:

```html
<script type="application/json" id="discord-transcript-json">
  {"channel":{"id":"123","name":"general",...},"messages":[...]}
</script>
```

### Extracting the data

In a browser:

```javascript
const el = document.getElementById("discord-transcript-json");
const data = JSON.parse(el.textContent);
console.log(data.messages.length);
```

With Node.js (parsing the HTML file):

```javascript
import { readFileSync } from "fs";

const html = readFileSync("transcript.html", "utf-8");
const match = html.match(
  /<script type="application\/json" id="discord-transcript-json">([\s\S]*?)<\/script>/
);
if (match) {
  const data = JSON.parse(match[1]);
  console.log(`${data.messages.length} messages`);
}
```

---

## Pagination

Breaks the transcript into pages with Previous/Next buttons at the bottom.

**Option:** `messagesPerPage: <number>`

```typescript
const html = generateTranscriptHtml(data, {
  messagesPerPage: 50,
});
```

- Splits messages into chunks of the given size
- Shows Previous / Page X of Y / Next at the bottom
- Only the current page is visible
- Works alongside search and other features

:::tip
For very large transcripts (1000+ messages), pagination significantly improves browser performance since only one page of messages is rendered at a time.
:::

### Choosing a page size

| Messages | Recommended `messagesPerPage` |
|----------|-------------------------------|
| < 200 | No pagination needed |
| 200–500 | `100` |
| 500–2000 | `50` |
| 2000+ | `25–50` |

---

## Custom Component Renderers

Let you swap out how specific component types get rendered. Handy if you want custom branding or need to handle a component differently.

**Option:** `customRenderers: Record<number, (component: DiscordComponent) => string>`

```typescript
import { generateTranscriptHtml } from "@getoeteter/discord-transcripts";
import type { DiscordComponent } from "@getoeteter/discord-transcripts";

const html = generateTranscriptHtml(data, {
  customRenderers: {
    // Override button rendering (type 2)
    2: (component: DiscordComponent) => {
      const label = component.label || "Button";
      return `<div class="my-custom-button">${label}</div>`;
    },

    // Override container rendering (type 17)
    17: (component: DiscordComponent) => {
      return `<div class="my-container">${component.content || ""}</div>`;
    },
  },
});
```

### How it works

1. Before rendering a component, we check if you've provided a custom renderer for that type
2. If you have, we call it with the full `DiscordComponent` object
3. Your function needs to return an HTML string
4. Child components are **not** automatically rendered - your custom renderer handles the full output

### Component type reference

| Type | Name | Use case for override |
|------|------|-----------------------|
| `1` | ActionRow | Custom layout |
| `2` | Button | Custom styling or click handlers |
| `3` | StringSelect | Custom dropdown rendering |
| `9` | Section | Custom section layout |
| `10` | TextDisplay | Custom text rendering |
| `12` | MediaGallery | Custom gallery layout |
| `17` | Container | Custom container styling |

:::caution
Custom renderers receive raw component data. You are responsible for sanitizing any user content in your output. Use HTML escaping for any text you render.
:::

## Embed Media

Discord CDN links expire after a while, so images, avatars, and other media in your transcripts can break over time. Enable `embedMedia` to download all media and embed it directly in the HTML as base64 data URIs - the transcript becomes fully self-contained.

**Option:** `embedMedia: true`

### With `createTranscript` (discord.js)

```typescript
const result = await createTranscript(channel, {
  embedMedia: true,
  theme: "dark",
});
```

### With `generateTranscriptHtml` (standalone)

```typescript
import {
  generateTranscriptHtml,
  resolveMediaUrls,
} from "@getoeteter/discord-transcripts";

const mediaMap = await resolveMediaUrls(data);
const html = generateTranscriptHtml(data, {
  _resolvedMedia: mediaMap,
});
```

### What gets embedded

- User avatars and guild icons
- Image, video, and audio attachments
- Embed images, thumbnails, author icons, and footer icons
- Custom emoji in messages, reactions, buttons, and polls
- Stickers
- V2 component media (thumbnails, galleries, files)

### Caveats

- Output files will be **much larger** since all media is base64-encoded (roughly 33% larger than the original files).
- Each resource has a **50 MB** size limit and **30 second** download timeout. Failed downloads gracefully fall back to the original URL.
- Media is downloaded with up to 10 concurrent requests.
