// discord-transcript - npm package entry point

export { createTranscript } from "./lib/discord-adapter.js";
export type { CreateTranscriptOptions, TranscriptResult } from "./lib/discord-adapter.js";
export { generateTranscriptHtml } from "./lib/generator.js";
export { resolveMediaUrls } from "./lib/media-resolver.js";
export { parseDiscordMarkdown, formatMessageTimestamp, getAvatarUrl, colorIntToHex, formatFileSize } from "./lib/markdown.js";
export { DiscordChannelType, DiscordMessageType } from "./types/discord.js";

export type {
  DiscordUser,
  DiscordRole,
  DiscordChannel,
  DiscordGuild,
  DiscordAttachment,
  DiscordEmbed,
  DiscordEmbedField,
  DiscordEmbedAuthor,
  DiscordEmbedFooter,
  DiscordEmbedImage,
  DiscordEmbedThumbnail,
  DiscordEmbedVideo,
  DiscordEmbedProvider,
  DiscordReaction,
  DiscordEmoji,
  DiscordMention,
  DiscordMessageReference,
  DiscordSticker,
  DiscordPollMedia,
  DiscordPollAnswer,
  DiscordPoll,
  DiscordInteraction,
  DiscordVoiceMessage,
  DiscordMessageSnapshot,
  DiscordMessage,
  DiscordThread,
  DiscordComponent,
  DiscordComponentAccessory,
  DiscordMediaGalleryItem,
  DiscordComponentFile,
  TranscriptOptions,
  TranscriptData,
} from "./types/discord.js";
