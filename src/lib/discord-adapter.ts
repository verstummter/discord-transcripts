import type {
  GuildTextBasedChannel,
  Message,
  Guild,
  GuildBasedChannel,
  Collection,
} from "discord.js";
import type {
  TranscriptData,
  TranscriptOptions,
  DiscordMessage,
  DiscordComponent,
  DiscordRole,
  DiscordChannel,
  DiscordPoll,
  DiscordInteraction,
  DiscordAttachment,
  DiscordEmbed,
  DiscordSticker,
  DiscordMessageSnapshot,
} from "../types/discord.js";
import { generateTranscriptHtml } from "./generator.js";
import { resolveMediaUrls } from "./media-resolver.js";

export interface CreateTranscriptOptions extends TranscriptOptions {
  /** Number of messages to fetch (default: 100, max: 5000) */
  limit?: number;
  /** Specific message ID to fetch messages before */
  before?: string;
  /** Specific message ID to fetch messages after */
  after?: string;
  /** Return as a Buffer instead of string */
  returnBuffer?: boolean;
  /** Custom filename (used when returnBuffer is true) */
  filename?: string;
  /** Whether to resolve member roles for username coloring (default: true) */
  resolveRoles?: boolean;
}

export interface TranscriptResult {
  html: string;
  buffer: Buffer;
  filename: string;
  messageCount: number;
}

/**
 * Generate an HTML transcript directly from a discord.js guild channel:
 * text and announcement channels, threads and forum posts, and the text
 * chat of voice and stage channels.
 *
 * ```ts
 * const result = await createTranscript(channel, { theme: "dark", limit: 200 });
 * await interaction.editReply({
 *   files: [{ attachment: result.buffer, name: result.filename }],
 * });
 * ```
 */
export async function createTranscript(
  channel: GuildTextBasedChannel,
  options: CreateTranscriptOptions = {},
): Promise<TranscriptResult> {
  const {
    limit = 100,
    before,
    after,
    filename,
    resolveRoles = true,
    embedMedia,
    ...transcriptOptions
  } = options;

  const clampedLimit = Math.min(Math.max(1, limit), 5000);

  // Fetch messages
  const messages = await fetchMessages(channel, clampedLimit, before, after);

  // Build context maps from the guild
  const guild = channel.guild;
  const rolesMap = buildRolesMap(guild);
  const channelsMap = buildChannelsMap(guild);
  const memberRolesMap = resolveRoles
    ? await buildMemberRolesMap(guild, messages)
    : {};

  // Assemble transcript data
  const data: TranscriptData = {
    guild: {
      id: guild.id,
      name: guild.name,
      icon: guild.icon,
    },
    channel: {
      id: channel.id,
      name: channel.name,
      type: channel.type as number as DiscordChannel["type"],
      // Threads and voice channels have no topic
      topic: "topic" in channel ? channel.topic : null,
    },
    messages: messages.map((m) => transformMessage(m)),
    roles: rolesMap,
    channels: channelsMap,
    memberRoles: memberRolesMap,
    generatedAt: new Date().toISOString(),
    totalMessages: messages.length,
  };

  // Resolve media URLs to data URIs when embedMedia is enabled
  if (embedMedia) {
    transcriptOptions._resolvedMedia = await resolveMediaUrls(data);
  }

  const html = generateTranscriptHtml(data, transcriptOptions);
  const buffer = Buffer.from(html, "utf-8");
  const resolvedFilename =
    filename ??
    `transcript-${channel.name}-${new Date().toISOString().split("T")[0]}.html`;

  return {
    html,
    buffer,
    filename: resolvedFilename,
    messageCount: messages.length,
  };
}

// ─── Message Fetching ───

async function fetchMessages(
  channel: GuildTextBasedChannel,
  limit: number,
  before?: string,
  after?: string,
): Promise<Message[]> {
  const messages: Message[] = [];
  let lastId: string | undefined = before;

  if (after) {
    // Fetch forward from a specific message
    let firstId: string | undefined = after;
    while (messages.length < limit) {
      const batch: Collection<string, Message> = await channel.messages.fetch({
        limit: Math.min(100, limit - messages.length),
        ...(firstId ? { after: firstId } : {}),
      });
      if (batch.size === 0) break;
      const sorted: Message[] = [...batch.values()].sort(
        (a, b) => a.createdTimestamp - b.createdTimestamp,
      );
      messages.push(...sorted);
      firstId = sorted[sorted.length - 1]?.id;
    }
    return messages;
  }

  // Fetch backward (default)
  while (messages.length < limit) {
    const batch = await channel.messages.fetch({
      limit: Math.min(100, limit - messages.length),
      ...(lastId ? { before: lastId } : {}),
    });
    if (batch.size === 0) break;
    messages.push(...batch.values());
    lastId = batch.last()?.id;
  }

  return messages.reverse(); // Chronological order
}

// ─── Guild Context Builders ───

function buildRolesMap(guild: Guild): Record<string, DiscordRole> {
  const map: Record<string, DiscordRole> = {};
  guild.roles.cache.forEach((role) => {
    map[role.id] = {
      id: role.id,
      name: role.name,
      color: role.color,
      position: role.position,
    };
  });
  return map;
}

function buildChannelsMap(guild: Guild): Record<string, DiscordChannel> {
  const map: Record<string, DiscordChannel> = {};
  guild.channels.cache.forEach((ch: GuildBasedChannel) => {
    map[ch.id] = {
      id: ch.id,
      name: ch.name,
      type: ch.type as number as DiscordChannel["type"],
    };
  });
  return map;
}

async function buildMemberRolesMap(
  guild: Guild,
  messages: Message[],
): Promise<Record<string, string[]>> {
  const map: Record<string, string[]> = {};
  const authorIds = [...new Set(messages.map((m) => m.author.id))];

  for (const authorId of authorIds) {
    try {
      const member = await guild.members.fetch(authorId);
      map[authorId] = member.roles.cache.map((r) => r.id);
    } catch {
      // Member may have left the server
    }
  }

  return map;
}

// ─── Message Transformer ───

function transformMessage(msg: Message, includeReference = true): DiscordMessage {
  return {
    id: msg.id,
    type: msg.type as number as DiscordMessage["type"],
    content: msg.content,
    author: {
      id: msg.author.id,
      username: msg.author.username,
      globalName: msg.author.globalName,
      avatar: msg.author.avatar,
      bot: msg.author.bot,
      discriminator: msg.author.discriminator,
    },
    timestamp: msg.createdAt.toISOString(),
    editedTimestamp: msg.editedAt?.toISOString() ?? null,
    pinned: msg.pinned,
    webhookId: msg.webhookId,
    mentions: msg.mentions.users.map((u) => ({
      id: u.id,
      username: u.username,
    })),
    attachments: mapAttachments(msg.attachments),
    embeds: mapEmbeds(msg.embeds),
    reactions: msg.reactions.cache.map((r) => ({
      emoji: {
        id: r.emoji.id,
        name: r.emoji.name ?? "❓",
        animated: r.emoji.animated ?? false,
      },
      count: r.count,
    })),
    messageReference: msg.reference
      ? {
        messageId: msg.reference.messageId ?? undefined,
        channelId: msg.reference.channelId ?? undefined,
        guildId: msg.reference.guildId ?? undefined,
      }
      : undefined,
    // Only one level deep: the reply preview never shows the reply's own parent
    referencedMessage:
      includeReference &&
        !hasSnapshots(msg) &&
        msg.reference?.messageId &&
        msg.channel.messages.cache.has(msg.reference.messageId)
        ? transformMessage(
          msg.channel.messages.cache.get(msg.reference.messageId)!,
          false,
        )
        : undefined,
    stickers: mapStickers(msg.stickers),
    thread: msg.thread
      ? {
        id: msg.thread.id,
        name: msg.thread.name,
        messageCount: msg.thread.messageCount ?? undefined,
      }
      : undefined,
    components: msg.components.map((comp) => transformComponent(comp.toJSON())),
    poll: transformPoll(msg),
    interaction: transformInteraction(msg),
    voiceMessage: transformVoiceMessage(msg),
    messageSnapshots: transformSnapshots(msg),
  };
}

function mapAttachments(attachments: Message["attachments"]): DiscordAttachment[] {
  return attachments.map((a) => ({
    id: a.id,
    filename: a.name,
    description: a.description,
    contentType: a.contentType,
    size: a.size,
    url: a.url,
    width: a.width,
    height: a.height,
    spoiler: a.spoiler,
  }));
}

function mapEmbeds(embeds: Message["embeds"]): DiscordEmbed[] {
  return embeds.map((e) => ({
    title: e.title ?? undefined,
    type: e.data.type,
    description: e.description ?? undefined,
    url: e.url ?? undefined,
    timestamp: e.timestamp ?? undefined,
    color: e.color ?? undefined,
    footer: e.footer
      ? { text: e.footer.text, iconUrl: e.footer.iconURL }
      : undefined,
    image: e.image
      ? { url: e.image.url, width: e.image.width, height: e.image.height }
      : undefined,
    thumbnail: e.thumbnail
      ? { url: e.thumbnail.url, width: e.thumbnail.width, height: e.thumbnail.height }
      : undefined,
    video: e.video
      ? { url: e.video.url, proxyUrl: e.video.proxyURL, width: e.video.width, height: e.video.height }
      : undefined,
    provider: e.provider
      ? { name: e.provider.name, url: e.provider.url }
      : undefined,
    author: e.author
      ? { name: e.author.name, url: e.author.url, iconUrl: e.author.iconURL }
      : undefined,
    fields: e.fields.map((f) => ({
      name: f.name,
      value: f.value,
      inline: f.inline,
    })),
  }));
}

function mapStickers(stickers: Message["stickers"]): DiscordSticker[] {
  return stickers.map((s) => ({
    id: s.id,
    name: s.name,
    formatType: s.format,
    url: s.url,
  }));
}

// ─── Forwarded Messages ───

/** `messageSnapshots` exists from discord.js 14.16; older versions simply have none */
function hasSnapshots(msg: Message): boolean {
  return ((msg as any).messageSnapshots?.size ?? 0) > 0;
}

function transformSnapshots(msg: Message): DiscordMessageSnapshot[] | undefined {
  if (!hasSnapshots(msg)) return undefined;
  const snapshots: any[] = [...(msg as any).messageSnapshots.values()];
  return snapshots.map((snap) => ({
    content: snap.content ?? "",
    timestamp: snap.createdAt instanceof Date && !isNaN(snap.createdAt.getTime())
      ? snap.createdAt.toISOString()
      : undefined,
    attachments: snap.attachments ? mapAttachments(snap.attachments) : [],
    embeds: snap.embeds ? mapEmbeds(snap.embeds) : [],
    stickers: snap.stickers ? mapStickers(snap.stickers) : [],
  }));
}

/**
 * Recursively transform a discord.js component JSON into our DiscordComponent shape.
 * Handles both V1 (ActionRow, Button, Select) and V2 (Container, Section, TextDisplay, etc.)
 */
function transformComponent(raw: any): DiscordComponent {
  const result: DiscordComponent = { type: raw.type };

  // V1: ActionRow (1), Button (2), Selects (3-8), TextInput (4)
  if (raw.style !== undefined) result.style = raw.style;
  if (raw.label) result.label = raw.label;
  if (raw.custom_id) result.customId = raw.custom_id;
  if (raw.url) result.url = raw.url;
  if (raw.disabled) result.disabled = raw.disabled;
  if (raw.emoji) {
    result.emoji = {
      id: raw.emoji.id ?? undefined,
      name: raw.emoji.name ?? "",
      animated: raw.emoji.animated ?? false,
    };
  }

  // V2: TextDisplay (10) / Label (18)
  if (raw.content) result.content = raw.content;

  // V2: Container (17) - accent color, spoiler
  if (raw.accent_color !== undefined) result.accentColor = raw.accent_color;
  if (raw.spoiler) result.spoiler = raw.spoiler;

  // V2: Section (9) - accessory (Thumbnail)
  if (raw.accessory) {
    result.accessory = {
      type: raw.accessory.type,
      media: raw.accessory.media,
      description: raw.accessory.description,
      spoiler: raw.accessory.spoiler,
    };
  }

  // V2: MediaGallery (12) - items
  if (raw.items) {
    result.items = raw.items.map((item: any) => ({
      media: item.media,
      description: item.description,
      spoiler: item.spoiler,
    }));
  }

  // V2: File (13) - file reference
  if (raw.file) {
    result.file = {
      url: raw.file.url,
      contentType: raw.file.content_type,
    };
  }

  // V2: Separator (14)
  if (raw.spacing !== undefined) result.spacing = raw.spacing;
  if (raw.divider !== undefined) result.divider = raw.divider;

  // V2: Thumbnail (11) - media + description
  if (raw.media) result.media = { url: raw.media.url };
  if (raw.description) result.description = raw.description;

  // Recurse into children (ActionRow, Container, Section all have .components)
  if (raw.components?.length) {
    result.components = raw.components.map(transformComponent);
  }

  return result;
}

// ─── Poll Transformer ───

function transformPoll(msg: Message): DiscordPoll | undefined {
  const poll = (msg as any).poll;
  if (!poll) return undefined;

  return {
    question: {
      text: poll.question?.text,
      emoji: poll.question?.emoji
        ? { id: poll.question.emoji.id, name: poll.question.emoji.name ?? "", animated: poll.question.emoji.animated ?? false }
        : undefined,
    },
    answers: (poll.answers ?? []).map((a: any) => ({
      answerId: a.answerId ?? a.answer_id ?? 0,
      pollMedia: {
        text: a.pollMedia?.text ?? a.text,
        emoji: a.pollMedia?.emoji ?? a.emoji
          ? { id: (a.pollMedia?.emoji ?? a.emoji)?.id, name: (a.pollMedia?.emoji ?? a.emoji)?.name ?? "", animated: (a.pollMedia?.emoji ?? a.emoji)?.animated ?? false }
          : undefined,
      },
      count: a.count ?? a.voteCount ?? 0,
    })),
    allowMultiselect: poll.allowMultiselect ?? poll.allow_multiselect ?? false,
    expiry: poll.expiry ?? poll.expiresAt ?? undefined,
    isFinalized: poll.resultsFinalized ?? poll.isFinalized ?? false,
  };
}

// ─── Interaction Transformer ───

function transformInteraction(msg: Message): DiscordInteraction | undefined {
  const interaction = (msg as any).interaction ?? (msg as any).interactionMetadata;
  if (!interaction) return undefined;

  const user = interaction.user;
  if (!user) return undefined;

  return {
    name: interaction.commandName ?? interaction.name ?? "unknown",
    user: {
      id: user.id,
      username: user.username,
      globalName: user.globalName ?? null,
      avatar: user.avatar ?? null,
      discriminator: user.discriminator,
      bot: user.bot ?? false,
    },
  };
}

// ─── Voice Message Transformer ───

function transformVoiceMessage(msg: Message): { duration: number; waveform?: string } | undefined {
  // Discord voice messages have flags & 8192 set and an audio attachment with waveform
  const flags = (msg as any).flags?.bitfield ?? (msg as any).flags ?? 0;
  const isVoice = (flags & (1 << 13)) !== 0;
  if (!isVoice) return undefined;

  const audioAtt = msg.attachments.find(a => a.contentType?.startsWith("audio/"));
  if (!audioAtt) return undefined;

  return {
    duration: (audioAtt as any).duration ?? 0,
    waveform: (audioAtt as any).waveform ?? undefined,
  };
}
