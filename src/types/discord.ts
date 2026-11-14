// ─── Core Discord Data Structures ───

export interface DiscordUser {
  id: string;
  username: string;
  discriminator?: string;
  globalName?: string | null;
  avatar?: string | null;
  bot?: boolean;
}

export interface DiscordRole {
  id: string;
  name: string;
  color: number;
  position?: number;
}

export interface DiscordChannel {
  id: string;
  name: string;
  type: DiscordChannelType;
  topic?: string | null;
}

export enum DiscordChannelType {
  GuildText = 0,
  DM = 1,
  GuildVoice = 2,
  GroupDM = 3,
  GuildCategory = 4,
  GuildAnnouncement = 5,
  AnnouncementThread = 10,
  PublicThread = 11,
  PrivateThread = 12,
  GuildStageVoice = 13,
  GuildForum = 15,
  GuildMedia = 16,
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon?: string | null;
}

// ─── Message Types ───

export enum DiscordMessageType {
  Default = 0,
  RecipientAdd = 1,
  RecipientRemove = 2,
  Call = 3,
  ChannelNameChange = 4,
  ChannelIconChange = 5,
  ChannelPinnedMessage = 6,
  UserJoin = 7,
  GuildBoost = 8,
  GuildBoostTier1 = 9,
  GuildBoostTier2 = 10,
  GuildBoostTier3 = 11,
  ChannelFollowAdd = 12,
  GuildDiscoveryDisqualified = 14,
  GuildDiscoveryRequalified = 15,
  Reply = 19,
  ChatInputCommand = 20,
  ThreadStarterMessage = 21,
  GuildInviteReminder = 22,
  ContextMenuCommand = 23,
  AutoModerationAction = 24,
  RoleSubscriptionPurchase = 25,
  InteractionPremiumUpsell = 26,
  StageStart = 27,
  StageEnd = 28,
  StageSpeaker = 29,
  StageTopic = 31,
  GuildApplicationPremiumSubscription = 32,
}

export interface DiscordAttachment {
  id: string;
  filename: string;
  description?: string | null;
  contentType?: string | null;
  size: number;
  url: string;
  width?: number | null;
  height?: number | null;
  spoiler?: boolean;
}

export interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordEmbedAuthor {
  name: string;
  url?: string;
  iconUrl?: string;
}

export interface DiscordEmbedFooter {
  text: string;
  iconUrl?: string;
}

export interface DiscordEmbedImage {
  url: string;
  width?: number;
  height?: number;
}

export interface DiscordEmbedThumbnail {
  url: string;
  width?: number;
  height?: number;
}

export interface DiscordEmbedVideo {
  url?: string;
  proxyUrl?: string;
  width?: number;
  height?: number;
}

export interface DiscordEmbedProvider {
  name?: string;
  url?: string;
}

export interface DiscordEmbed {
  title?: string;
  type?: string;
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;
  footer?: DiscordEmbedFooter;
  image?: DiscordEmbedImage;
  thumbnail?: DiscordEmbedThumbnail;
  video?: DiscordEmbedVideo;
  provider?: DiscordEmbedProvider;
  author?: DiscordEmbedAuthor;
  fields?: DiscordEmbedField[];
}

export interface DiscordReaction {
  emoji: DiscordEmoji;
  count: number;
}

export interface DiscordEmoji {
  id?: string | null;
  name: string;
  animated?: boolean;
}

export interface DiscordMention {
  id: string;
  username: string;
}

export interface DiscordMessageReference {
  messageId?: string;
  channelId?: string;
  guildId?: string;
}

export interface DiscordSticker {
  id: string;
  name: string;
  formatType: number;
  url?: string;
}

// ─── Polls ───

export interface DiscordPollMedia {
  text?: string;
  emoji?: DiscordEmoji;
}

export interface DiscordPollAnswer {
  answerId: number;
  pollMedia: DiscordPollMedia;
  /** Number of votes for this answer */
  count?: number;
}

export interface DiscordPoll {
  question: DiscordPollMedia;
  answers: DiscordPollAnswer[];
  /** Whether users can select multiple answers */
  allowMultiselect?: boolean;
  /** ISO timestamp when the poll expires */
  expiry?: string;
  /** Whether the poll has been finalized */
  isFinalized?: boolean;
}

// ─── Interaction Context ───

export interface DiscordInteraction {
  /** The slash command or context menu name */
  name: string;
  /** The user who triggered the interaction */
  user: DiscordUser;
}

// ─── Voice Message ───

export interface DiscordVoiceMessage {
  /** Duration in seconds */
  duration: number;
  /** Base64-encoded waveform data */
  waveform?: string;
}

export interface DiscordMessage {
  id: string;
  type: DiscordMessageType;
  content: string;
  author: DiscordUser;
  timestamp: string;
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
  /** Poll data (if message contains a poll) */
  poll?: DiscordPoll;
  /** Interaction context for slash commands / context menus */
  interaction?: DiscordInteraction;
  /** Voice message metadata */
  voiceMessage?: DiscordVoiceMessage;
}

export interface DiscordThread {
  id: string;
  name: string;
  messageCount?: number;
  /** Thread messages for inline expansion */
  messages?: DiscordMessage[];
}

export interface DiscordComponent {
  type: number;
  style?: number;
  label?: string;
  emoji?: DiscordEmoji;
  customId?: string;
  url?: string;
  disabled?: boolean;
  components?: DiscordComponent[];
  // V2 Components
  /** Text content for TextDisplay (type 10) and Label (type 18) */
  content?: string;
  /** Accent color for Container (type 17) */
  accentColor?: number;
  /** Whether this component is a spoiler (Container, Thumbnail, File) */
  spoiler?: boolean;
  /** Thumbnail/image accessory for Section (type 9) */
  accessory?: DiscordComponentAccessory;
  /** Media items for MediaGallery (type 12) */
  items?: DiscordMediaGalleryItem[];
  /** File reference for File component (type 13) */
  file?: DiscordComponentFile;
  /** Spacing size for Separator (type 14): 1 = small, 2 = large */
  spacing?: number;
  /** Whether Separator shows a divider line */
  divider?: boolean;
  /** Media reference for Thumbnail (type 11) */
  media?: { url: string };
  /** Description for Thumbnail (type 11) */
  description?: string;
}

export interface DiscordComponentAccessory {
  type: number;
  media?: { url: string };
  description?: string;
  spoiler?: boolean;
}

export interface DiscordMediaGalleryItem {
  media: { url: string };
  description?: string;
  spoiler?: boolean;
}

export interface DiscordComponentFile {
  url: string;
  contentType?: string;
}

// ─── Transcript Configuration ───

export interface TranscriptOptions {
  /** Light or dark theme */
  theme?: "light" | "dark";
  /** Whether to include message reactions */
  showReactions?: boolean;
  /** Whether to show user avatars */
  showAvatars?: boolean;
  /** Whether to show timestamps */
  showTimestamps?: boolean;
  /** Whether to show role colors on usernames */
  showRoleColors?: boolean;
  /** Whether to render embeds */
  showEmbeds?: boolean;
  /** Whether to render attachments */
  showAttachments?: boolean;
  /** Whether to render thread messages inline */
  showThreads?: boolean;
  /** Whether to show the channel header */
  showHeader?: boolean;
  /** Custom CSS to inject */
  customCss?: string;
  /** Custom favicon URL */
  faviconUrl?: string;
  /** Date format string */
  dateFormat?: "relative" | "absolute" | "both";
  /** Maximum image width in pixels */
  maxImageWidth?: number;
  /** Custom font family */
  fontFamily?: string;
  /** Compact mode (less spacing) */
  compact?: boolean;
  /** Page title override */
  pageTitle?: string;
  /** Enable message search bar */
  enableSearch?: boolean;
  /** Enable jump-to-date navigation sidebar */
  enableDateNav?: boolean;
  /** Show user statistics footer (message counts, etc.) */
  showUserStats?: boolean;
  /** Show copy-message button on hover */
  enableCopyButton?: boolean;
  /** Enable collapsible embeds (click to collapse/expand) */
  collapsibleEmbeds?: boolean;
  /** Enable image lightbox (click to view full-size) */
  enableLightbox?: boolean;
  /** Include raw JSON data in output */
  includeJson?: boolean;
  /** Messages per page (enables pagination when set) */
  messagesPerPage?: number;
  /** Custom component renderers (keyed by component type number) */
  customRenderers?: Record<number, (component: DiscordComponent) => string>;
  /** Expand thread messages inline */
  expandThreads?: boolean;
  /** Download and embed all media as base64 data URIs for offline/permanent transcripts */
  embedMedia?: boolean;
  /** @internal Resolved media map (URL → data URI), populated by resolveMediaUrls() */
  _resolvedMedia?: Map<string, string>;
}

export interface TranscriptData {
  guild?: DiscordGuild;
  channel: DiscordChannel;
  messages: DiscordMessage[];
  /** Map of role IDs to role data for mention resolution */
  roles?: Record<string, DiscordRole>;
  /** Map of channel IDs to channel data for mention resolution */
  channels?: Record<string, DiscordChannel>;
  /** Map of user IDs to role IDs for role color display */
  memberRoles?: Record<string, string[]>;
  /** Generation timestamp */
  generatedAt?: string;
  /** Total messages in channel (may differ from messages.length if filtered) */
  totalMessages?: number;
}