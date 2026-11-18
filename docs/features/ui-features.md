---
sidebar_position: 2
sidebar_label: UI Features
title: UI Features
description: Search, date navigation, user statistics, copy button, collapsible embeds, and image lightbox.
---

# UI Features

These are interactive elements you can add to your transcripts. They're all off by default - enable the ones you want via [options](../options#feature-toggles).

## Built-in Navigation

These need no options:

- **Reply links** - clicking a reply preview jumps to the original message (when it is part of the transcript) and briefly highlights it
- **Back to top** - a floating button appears once you scroll down
- **Message anchors** - every message has an `id` of `msg-<message id>`, so `transcript.html#msg-123` links straight to it

---

## Message Search

Adds a search box to the sticky top bar. As you type, messages that don't match get hidden.

**Option:** `enableSearch: true`

```typescript
const html = generateTranscriptHtml(data, {
  enableSearch: true,
});
```

- Filters as you type, matching message text, author names, embeds, polls, and file names
- Shows a result count (e.g. "12 results") and a "No results found" state
- Case-insensitive
- Press `/` to focus the search box, `Esc` to clear it

---

## Jump-to-Date Navigation

Adds a "Jump to date" menu to the top bar listing every date in the transcript. Click any date to scroll right to it.

**Option:** `enableDateNav: true`

```typescript
const html = generateTranscriptHtml(data, {
  enableDateNav: true,
});
```

- Dropdown menu in the top bar, showing each unique date
- Clicking a date smooth-scrolls to that section
- Closes on outside click or `Esc`

---

## Theme Toggle

Adds a sun/moon button to the top bar that switches the open transcript between the dark and light themes.

**Option:** `enableThemeToggle: true`

```typescript
const html = generateTranscriptHtml(data, {
  theme: "dark",            // the theme the file opens with
  enableThemeToggle: true,
});
```

- Both themes are always included in the file, so the toggle adds no extra CSS
- The choice applies to the open page only; reloading returns to the `theme` option

---

## User Statistics

Shows a stats section at the bottom with who talked the most and when.

**Option:** `showUserStats: true`

```typescript
const html = generateTranscriptHtml(data, {
  showUserStats: true,
});
```

**What you'll see:**
- **Summary tiles** - total messages, participants, attachments, and the busiest hour
- **Most Active Users** - ranked by message count, with avatars and a bar chart
- **Activity by Hour** - bar chart showing when messages were sent throughout the day

All stats are calculated from the messages in the transcript.

---

## Copy Message Button

Hover over any message with text and a copy button shows up. Click it to copy the message text.

**Option:** `enableCopyButton: true`

```typescript
const html = generateTranscriptHtml(data, {
  enableCopyButton: true,
});
```

- Appears in the top-right corner on hover, on every message including grouped ones, and can be reached with the keyboard
- Copies plain text only (not the HTML/markdown), without the "(edited)" marker
- Quick visual feedback when copied

---

## Collapsible Embeds

Each embed gets a small chevron you can click to collapse or expand it.

**Option:** `collapsibleEmbeds: true`

```typescript
const html = generateTranscriptHtml(data, {
  collapsibleEmbeds: true,
});
```

- A small chevron appears at the top of each embed
- Click it to hide the body (description, fields, images, footer)
- Title and author stay visible when collapsed
- The chevron rotates to show the current state
- Click again to expand

---

## Image Lightbox

Click any image to open it full-size in an overlay.

**Option:** `enableLightbox: true`

```typescript
const html = generateTranscriptHtml(data, {
  enableLightbox: true,
});
```

- Works on attachments, embed images, thumbnails, stickers, and media gallery items
- Dark overlay with the image centered
- "Open original" link to view it in a new tab
- Close with Escape, click the backdrop, or hit the X
- Images keep their aspect ratio

---

## Using Everything Together

You can turn on all of these at once:

```typescript
const html = generateTranscriptHtml(data, {
  enableSearch: true,
  enableThemeToggle: true,
  enableDateNav: true,
  showUserStats: true,
  enableCopyButton: true,
  collapsibleEmbeds: true,
  enableLightbox: true,
});
```
