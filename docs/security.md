---
sidebar_position: 7
sidebar_label: Security
title: Security
description: How user content is sanitized and secured in generated transcripts.
---

# Security

All user content gets sanitized before it ends up in the HTML output. Here's what happens at each layer.

## Sanitization Layers

### HTML Escaping

All text content goes through `esc()` which escapes `<`, `>`, `&`, `"`, and `'`. This blocks raw HTML injection from message content, usernames, channel names, embed fields, and so on.

### URL Sanitization

All `href` and `src` attributes pass through `sanitizeUrl()`:
- Only `http://` and `https://` schemes are allowed
- `javascript:`, `data:`, `vbscript:`, and other dangerous schemes are blocked
- Invalid URLs are replaced with an empty string

### CSS Injection Protection

The `customCss` and `fontFamily` options pass through `sanitizeCss()`:
- Strips any `</style>` tag breakout attempts
- Prevents escaping the style block to inject arbitrary HTML

### Markdown Sanitization

Parsed Discord markdown goes through [`sanitize-html`](https://www.npmjs.com/package/sanitize-html) with a strict allowlist of:
- Tags: `b`, `i`, `u`, `s`, `em`, `strong`, `code`, `pre`, `span`, `div`, `br`, `blockquote`, `a`, `h1`–`h3`, `ul`, `ol`, `li`, `sub`
- Attributes limited to `class`, `href`, `target`, `rel`, `data-*` where appropriate
- All other tags and attributes are stripped

## External Requests

The generated HTML doesn't phone home or load anything external, except for Discord CDN resources that were part of the original messages:

- User avatars (`cdn.discordapp.com/avatars/...`)
- Custom emoji (`cdn.discordapp.com/emojis/...`)
- Attachments (`cdn.discordapp.com/attachments/...`)
- Stickers (`media.discordapp.net/stickers/...`)
- Guild icons (`cdn.discordapp.com/icons/...`)

No external JS, CSS, fonts, or analytics. Everything is self-contained aside from Discord CDN media.

## Best Practices

:::warning
Never pass untrusted user input directly to `customCss` or `fontFamily` without additional validation. While the sanitizer blocks `</style>` breakout, defense-in-depth is recommended.
:::

- The `customRenderers` option gives you full control over HTML output for specific component types. If you use it, you are responsible for sanitizing any user content in your custom renderer's output.
- All Discord IDs must be numeric strings. The mention regex patterns match `\d+` only.
