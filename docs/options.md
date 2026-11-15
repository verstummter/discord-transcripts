---
sidebar_position: 3
sidebar_label: Options
title: Options Reference
description: All configuration options for transcript generation - display, features, and customization.
---

# Options Reference

Everything here is optional. These work with both `createTranscript()` and `generateTranscriptHtml()` unless noted otherwise.

## Fetch Options

:::info
These options only apply to `createTranscript()`.
:::

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `limit` | `number` | `100` | Number of messages to fetch (max: 5000) |
| `before` | `string` | - | Fetch messages before this message ID |
| `after` | `string` | - | Fetch messages after this message ID |
| `filename` | `string` | auto | Custom filename for the output |
| `returnBuffer` | `boolean` | - | Return as Buffer |
| `resolveRoles` | `boolean` | `true` | Resolve member roles for colored usernames |

## Display Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `theme` | `"dark" \| "light"` | `"dark"` | Color theme |
| `compact` | `boolean` | `false` | Compact message layout |
| `dateFormat` | `"relative" \| "absolute" \| "both"` | `"absolute"` | Timestamp format |
| `maxImageWidth` | `number` | `400` | Maximum image width in pixels |
| `showReactions` | `boolean` | `true` | Show message reactions |
| `showAvatars` | `boolean` | `true` | Show user avatars |
| `showTimestamps` | `boolean` | `true` | Show message timestamps |
| `showRoleColors` | `boolean` | `true` | Color usernames by role |
| `showEmbeds` | `boolean` | `true` | Render embeds |
| `showAttachments` | `boolean` | `true` | Render attachments |
| `showThreads` | `boolean` | `true` | Show thread indicators |
| `showHeader` | `boolean` | `true` | Show channel header |
| `locale` | `string` | `"en-US"` | Locale for dates, times and numbers ([BCP 47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument) tag, e.g. `"de-DE"`) |
| `timeZone` | `string` | system zone | IANA time zone for all timestamps, e.g. `"Europe/Berlin"` or `"UTC"` |

### Locale and time zone

By default, dates are formatted in US English using the time zone of the machine that generates the transcript. A bot hosted in one region will therefore stamp messages with that region's clock. Set both options to control what readers see:

```typescript
const html = generateTranscriptHtml(data, {
  locale: "en-GB",
  timeZone: "Europe/London",
});
```

`timeZone` also decides where day separators fall and how the "Activity by Hour" chart is bucketed. An unrecognised locale or time zone falls back to the default instead of throwing. Relative times ("3 hours ago") and interface labels stay in English.

## Feature Toggles

All of these are **off by default**. Turn on the ones you want.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableSearch` | `boolean` | `false` | Add [message search bar](./features/ui-features#message-search) |
| `enableDateNav` | `boolean` | `false` | Add [jump-to-date navigation](./features/ui-features#jump-to-date-navigation) |
| `enableThemeToggle` | `boolean` | `false` | Add a [light/dark toggle button](./features/ui-features#theme-toggle) |
| `showUserStats` | `boolean` | `false` | Show [user statistics](./features/ui-features#user-statistics) section |
| `enableCopyButton` | `boolean` | `false` | Show [copy button](./features/ui-features#copy-message-button) on hover |
| `collapsibleEmbeds` | `boolean` | `false` | Make [embeds collapsible](./features/ui-features#collapsible-embeds) |
| `enableLightbox` | `boolean` | `false` | Click [images to view full-size](./features/ui-features#image-lightbox) |
| `expandThreads` | `boolean` | `false` | Show [expandable thread messages](./features/discord-features#thread-expansion) |
| `embedMedia` | `boolean` | `false` | [Embed all media](./features/advanced#embed-media) as base64 data URIs for offline/permanent transcripts |
| `includeJson` | `boolean` | `false` | Embed [raw JSON data](./features/advanced#json-export) in output |
| `messagesPerPage` | `number` | - | Enable [pagination](./features/advanced#pagination) (messages per page) |

## Customization

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `customCss` | `string` | - | Additional CSS to inject |
| `fontFamily` | `string` | - | Override font family |
| `pageTitle` | `string` | auto | Custom page `<title>` |
| `faviconUrl` | `string` | - | Custom favicon URL |
| `customRenderers` | `Record<number, Function>` | - | [Custom component renderers](./features/advanced#custom-component-renderers) |

### Custom CSS Example

```typescript
const html = generateTranscriptHtml(data, {
  customCss: `
    .discord-dark {
      --dc-bg-primary: #1a1a2e;
      --dc-accent-primary: #e94560;
    }
  `,
});
```

### Custom Font Example

```typescript
const html = generateTranscriptHtml(data, {
  fontFamily: "'Fira Code', monospace",
});
```

## All Options at a Glance

```typescript
const html = generateTranscriptHtml(data, {
  // Display
  theme: "dark",
  compact: false,
  dateFormat: "absolute",
  maxImageWidth: 400,
  showReactions: true,
  showAvatars: true,
  showTimestamps: true,
  showRoleColors: true,
  showEmbeds: true,
  showAttachments: true,
  showThreads: true,
  showHeader: true,
  locale: "en-US",
  timeZone: undefined, // the generating machine's zone

  // Feature toggles
  enableSearch: false,
  enableThemeToggle: false,
  enableDateNav: false,
  showUserStats: false,
  enableCopyButton: false,
  collapsibleEmbeds: false,
  enableLightbox: false,
  expandThreads: false,
  embedMedia: false,
  includeJson: false,
  messagesPerPage: undefined,

  // Customization
  customCss: undefined,
  fontFamily: undefined,
  pageTitle: undefined,
  faviconUrl: undefined,
  customRenderers: undefined,
});
```
