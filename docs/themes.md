---
sidebar_position: 6
sidebar_label: Themes
title: Themes & Styling
description: Dark and light themes, CSS custom properties, and custom styling.
---

# Themes & Styling

## Built-in Themes

There are two themes you can pick from:

| Theme | Class | Description |
|-------|-------|-------------|
| `"dark"` | `.discord-dark` | Discord dark theme (default) |
| `"light"` | `.discord-light` | Discord light theme |

```typescript
const html = generateTranscriptHtml(data, { theme: "dark" });
const html = generateTranscriptHtml(data, { theme: "light" });
```

## CSS Custom Properties

Both themes use CSS custom properties prefixed with `--dc-`. You can override any of them with `customCss`:

```typescript
const html = generateTranscriptHtml(data, {
  customCss: `
    .discord-dark {
      --dc-bg-primary: #1a1a2e;
      --dc-bg-secondary: #16213e;
      --dc-accent-primary: #e94560;
      --dc-text-normal: #eee;
    }
  `,
});
```

### Key CSS Variables

| Variable | Dark Default | Light Default | Used For |
|----------|-------------|---------------|----------|
| `--dc-bg-primary` | `#313338` | `#ffffff` | Main background |
| `--dc-bg-secondary` | `#2b2d31` | `#f2f3f5` | Secondary background |
| `--dc-bg-tertiary` | `#1e1f22` | `#e3e5e8` | Tertiary background |
| `--dc-text-normal` | `#dbdee1` | `#313338` | Main text |
| `--dc-text-muted` | `#949ba4` | `#5c6470` | Muted/secondary text |
| `--dc-text-link` | `#00a8fc` | `#006ce7` | Links |
| `--dc-accent-primary` | `#5865f2` | `#5865f2` | Accent color |
| `--dc-bg-message-hover` | `#2e3035` | `#f2f3f5` | Message hover |

## Custom Font

Swap out the default font:

```typescript
const html = generateTranscriptHtml(data, {
  fontFamily: "'Fira Code', monospace",
});
```

:::note
Since transcripts are self-contained HTML with no external requests, custom fonts must already be available on the viewer's system. If you need a web font, include an `@import` or `@font-face` rule in `customCss`.
:::

## Custom CSS

You can add your own CSS on top:

```typescript
const html = generateTranscriptHtml(data, {
  customCss: `
    /* Hide avatars */
    .discord-message-avatar { display: none; }
    
    /* Custom embed border */
    .discord-embed { border-radius: 8px; }
    
    /* Bigger reactions */
    .discord-reaction { font-size: 1.2em; padding: 6px 10px; }
  `,
});
```

:::caution
The `customCss` value is sanitized to prevent `</style>` tag injection, but you should avoid passing untrusted user input directly.
:::

## Print Styles

There are built-in print styles so the transcript looks good when printed or saved as PDF:
- Hover effects and interactive bits are stripped
- Spacing is adjusted for paper
- Ensures all content is visible (no collapsed sections)
