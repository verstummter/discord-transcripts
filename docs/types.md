---
sidebar_position: 4
sidebar_label: Types
title: Data Types
description: TypeScript interfaces for all transcript data structures - messages, embeds, polls, components, and more.
---

# Data Types

You can import any of these types directly from the package:

```typescript
import type { TranscriptData, DiscordMessage, DiscordPoll } from "@getoeteter/discord-transcripts";
```

## TranscriptData

This is what you pass to `generateTranscriptHtml`:

```typescript
interface TranscriptData {
  guild?: DiscordGuild;
  channel: DiscordChannel;
  messages: DiscordMessage[];
  roles?: Record<string, DiscordRole>;           // For mention coloring
  channels?: Record<string, DiscordChannel>;     // For channel mention names
  memberRoles?: Record<string, string[]>;        // User ID → role IDs
  generatedAt?: string;                          // ISO timestamp
  totalMessages?: number;                        // Override message count display
}
```

### DiscordGuild

```typescript
interface DiscordGuild {
  id: string;
  name: string;
  icon?: string | null;   // CDN hash or full https:// URL
}
```

### DiscordChannel

```typescript
interface DiscordChannel {
  id: string;
  name: string;
  type: number;           // 0 = Text, 2 = Voice, 5 = Announcement, etc.
  topic?: string | null;
}
```

### DiscordRole

```typescript
interface DiscordRole {
  id: string;
  name: string;
  color: number;          // Integer color (0 = no color)
}
```

---

## DiscordMessage

```typescript
interface DiscordMessage {
  id: string;
  type: DiscordMessageType;
  content: string;
  author: DiscordUser;
  timestamp: string;                              // ISO timestamp
  editedTimestamp?: string | null;
  mentions?: DiscordMention[];
  attachments?: DiscordAttachment[];
  embeds?: DiscordEmbed[];
  reactions?: DiscordReaction[];
  pinned?: boolean;
  webhookId?: string | null;
  messageReference?: DiscordMessageReference | null;
  referencedMessage?: DiscordMessage | null;
  thread?: DiscordThread | null;
  components?: DiscordComponent[];
  stickers?: DiscordSticker[];
  poll?: DiscordPoll;
  interaction?: DiscordInteraction;
  voiceMessage?: DiscordVoiceMessage;
  messageSnapshots?: DiscordMessageSnapshot[];    // Forwarded content
}
```

### Message Types

Use the `DiscordMessageType` enum rather than raw numbers. System message types are rendered as a one-line notice; any other type renders as a normal message.

| Value | Name | Description |
|-------|------|-------------|
| `0` | Default | Regular message |
| `1` | RecipientAdd | Recipient added to a group DM |
| `2` | RecipientRemove | Recipient removed from a group DM |
| `3` | Call | Call started |
| `4` | ChannelNameChange | Channel renamed |
| `5` | ChannelIconChange | Channel icon changed |
| `6` | ChannelPinnedMessage | Message pinned |
| `7` | UserJoin | Member joined |
| `8` | GuildBoost | Server boosted |
| `9` | GuildBoostTier1 | Boost reached level 1 |
| `10` | GuildBoostTier2 | Boost reached level 2 |
| `11` | GuildBoostTier3 | Boost reached level 3 |
| `12` | ChannelFollowAdd | Channel follow added |
| `14` | GuildDiscoveryDisqualified | Removed from Server Discovery |
| `15` | GuildDiscoveryRequalified | Relisted in Server Discovery |
| `16` | GuildDiscoveryGracePeriodInitialWarning | Discovery activity warning (1 week) |
| `17` | GuildDiscoveryGracePeriodFinalWarning | Discovery activity warning (3 weeks) |
| `18` | ThreadCreated | Thread started |
| `19` | Reply | Reply to a message |
| `20` | ChatInputCommand | Slash command response |
| `21` | ThreadStarterMessage | First message of a thread |
| `22` | GuildInviteReminder | Invite reminder |
| `23` | ContextMenuCommand | Context menu command response |
| `24` | AutoModerationAction | AutoMod blocked a message |
| `25` | RoleSubscriptionPurchase | Role subscription purchase |
| `26` | InteractionPremiumUpsell | Premium upsell |
| `27` | StageStart | Stage event started |
| `28` | StageEnd | Stage event ended |
| `29` | StageSpeaker | New Stage speaker |
| `31` | StageTopic | Stage topic changed |
| `32` | GuildApplicationPremiumSubscription | App premium subscription |
| `36` | GuildIncidentAlertModeEnabled | Security actions enabled |
| `37` | GuildIncidentAlertModeDisabled | Security actions disabled |
| `38` | GuildIncidentReportRaid | Raid reported |
| `39` | GuildIncidentReportFalseAlarm | False alarm reported |
| `46` | PollResult | Poll closed, with the result |

---

## DiscordUser

```typescript
interface DiscordUser {
  id: string;
  username: string;
  discriminator?: string;
  globalName?: string | null;
  avatar?: string | null;       // CDN hash or full https:// URL
  bot?: boolean;
}
```

:::tip
The `avatar` field accepts either a Discord CDN hash (e.g. `"a_1234abcd"`) or a direct URL (e.g. `"https://cdn.discordapp.com/avatars/..."`). The renderer detects which format is used automatically.
:::

---

## DiscordEmbed

```typescript
interface DiscordEmbed {
  title?: string;
  type?: string;               // "rich", "image", "gifv", "video", "link"
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;              // Integer color (e.g. 0x5865f2)
  footer?: { text: string; iconUrl?: string };
  image?: { url: string; width?: number; height?: number };
  thumbnail?: { url: string; width?: number; height?: number };
  video?: { url?: string; proxyUrl?: string; width?: number; height?: number };
  provider?: { name?: string; url?: string };
  author?: { name: string; url?: string; iconUrl?: string };
  fields?: { name: string; value: string; inline?: boolean }[];
}
```

---

## DiscordAttachment

```typescript
interface DiscordAttachment {
  id: string;
  filename: string;
  description?: string | null;
  contentType?: string | null;   // MIME type
  size: number;                  // Bytes
  url: string;
  width?: number | null;
  height?: number | null;
  spoiler?: boolean;
}
```

How attachments look depends on the content type:
- **Images** (`image/*`) - shown inline with optional spoiler blur
- **Video** (`video/*`) - embedded `<video>` player
- **Audio** (`audio/*`) - embedded `<audio>` player
- **Anything else** - download link with file size

---

## DiscordPoll

```typescript
interface DiscordPoll {
  question: DiscordPollMedia;
  answers: DiscordPollAnswer[];
  allowMultiselect?: boolean;
  expiry?: string;              // ISO timestamp
  isFinalized?: boolean;
}

interface DiscordPollAnswer {
  answerId: number;
  pollMedia: DiscordPollMedia;
  count?: number;               // Vote count
}

interface DiscordPollMedia {
  text?: string;
  emoji?: DiscordEmoji;
}
```

See [Polls feature](./features/discord-features#polls) for rendering details.

---

## DiscordInteraction

```typescript
interface DiscordInteraction {
  name: string;                 // Slash command or context menu name
  user: DiscordUser;            // User who triggered it
}
```

See [Slash Command Context](./features/discord-features#slash-command-context) for rendering details.

---

## DiscordMessageSnapshot

The content of a forwarded message.

```typescript
interface DiscordMessageSnapshot {
  content?: string;
  timestamp?: string;           // ISO timestamp of the original message
  attachments?: DiscordAttachment[];
  embeds?: DiscordEmbed[];
  stickers?: DiscordSticker[];
}
```

See [Forwarded Messages](./features/discord-features#forwarded-messages) for rendering details.

---

## DiscordVoiceMessage

```typescript
interface DiscordVoiceMessage {
  duration: number;             // Seconds
  waveform?: string;            // Base64-encoded waveform data
}
```

See [Voice Messages](./features/discord-features#voice-messages) for rendering details.

---

## DiscordComponent

```typescript
interface DiscordComponent {
  type: number;
  style?: number;               // Button style (1-5)
  label?: string;
  emoji?: DiscordEmoji;
  customId?: string;
  url?: string;
  disabled?: boolean;
  components?: DiscordComponent[];  // Children
  content?: string;             // V2 TextDisplay/Label
  accentColor?: number;         // V2 Container border color
  spoiler?: boolean;
  accessory?: DiscordComponentAccessory;
  items?: DiscordMediaGalleryItem[];
  file?: { url: string; contentType?: string };
  spacing?: number;             // Separator: 1 = small, 2 = large
  divider?: boolean;
  media?: { url: string };
  description?: string;
}
```

### Component Types

**V1 Components:**

| Type | Name | Description |
|------|------|-------------|
| `1` | ActionRow | Container for buttons/selects |
| `2` | Button | Clickable button |
| `3` | StringSelect | Dropdown select menu |
| `5` | UserSelect | User picker |
| `6` | RoleSelect | Role picker |
| `7` | MentionableSelect | Mentionable picker |
| `8` | ChannelSelect | Channel picker |

**V2 Components:**

| Type | Name | Description |
|------|------|-------------|
| `9` | Section | Section with optional accessory |
| `10` | TextDisplay | Rich text display |
| `11` | Thumbnail | Small image |
| `12` | MediaGallery | Image grid |
| `13` | File | File display |
| `14` | Separator | Divider line |
| `17` | Container | Bordered container |
| `18` | Label | Simple text label |

---

## DiscordThread

```typescript
interface DiscordThread {
  id: string;
  name: string;
  messageCount?: number;
  messages?: DiscordMessage[];  // For inline expansion (expandThreads option)
}
```

---

## DiscordReaction

```typescript
interface DiscordReaction {
  emoji: DiscordEmoji;
  count: number;
}

interface DiscordEmoji {
  id?: string | null;      // null/undefined for Unicode emoji
  name: string;            // Unicode char or custom emoji name
  animated?: boolean;
}
```

---

## DiscordSticker

```typescript
interface DiscordSticker {
  id: string;
  name: string;
  formatType: number;      // 1 = PNG, 2 = APNG, 3 = Lottie, 4 = GIF
  url?: string;            // Direct URL to sticker image
}
```

---

## TranscriptOptions

Configuration options passed to `generateTranscriptHtml()` or `createTranscript()`.

```typescript
interface TranscriptOptions {
  theme?: "light" | "dark";
  showReactions?: boolean;
  showAvatars?: boolean;
  showTimestamps?: boolean;
  showRoleColors?: boolean;
  showEmbeds?: boolean;
  showAttachments?: boolean;
  showThreads?: boolean;
  showHeader?: boolean;
  customCss?: string;
  faviconUrl?: string;
  dateFormat?: "relative" | "absolute" | "both";
  maxImageWidth?: number;
  fontFamily?: string;
  compact?: boolean;
  pageTitle?: string;
  locale?: string;
  timeZone?: string;
  enableThemeToggle?: boolean;
  enableSearch?: boolean;
  enableDateNav?: boolean;
  showUserStats?: boolean;
  enableCopyButton?: boolean;
  collapsibleEmbeds?: boolean;
  enableLightbox?: boolean;
  includeJson?: boolean;
  messagesPerPage?: number;
  customRenderers?: Record<number, (component: DiscordComponent) => string>;
  expandThreads?: boolean;
  embedMedia?: boolean;
  /** @internal Populated by resolveMediaUrls(), do not set manually */
  _resolvedMedia?: Map<string, string>;
}
```

See [Options Reference](./options.md) for detailed descriptions of each option.

---

## TranscriptData

Input data structure for `generateTranscriptHtml()`.

```typescript
interface TranscriptData {
  guild?: DiscordGuild;
  channel: DiscordChannel;
  messages: DiscordMessage[];
  roles?: Record<string, DiscordRole>;
  channels?: Record<string, DiscordChannel>;
  memberRoles?: Record<string, string[]>;
  generatedAt?: string;
  totalMessages?: number;
}
```
