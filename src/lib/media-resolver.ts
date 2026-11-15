import type {
  TranscriptData,
  DiscordMessage,
  DiscordEmbed,
  DiscordComponent,
} from "../types/discord.js";
import { getAvatarUrl } from "./markdown.js";

const CONCURRENCY = 10;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB per resource
const MAX_REDIRECTS = 5;

/**
 * Collect all media URLs from transcript data, download them,
 * and return a Map of original URL → base64 data URI.
 *
 * Use with `generateTranscriptHtml`:
 * ```ts
 * const mediaMap = await resolveMediaUrls(data);
 * const html = generateTranscriptHtml(data, { _resolvedMedia: mediaMap });
 * ```
 *
 * Or simply pass `embedMedia: true` to `createTranscript` and it's handled automatically.
 */
export async function resolveMediaUrls(
  data: TranscriptData,
): Promise<Map<string, string>> {
  const urls = new Set<string>();

  // Guild icon
  if (data.guild?.icon) {
    const icon = data.guild.icon;
    if (icon.startsWith("https://") || icon.startsWith("http://")) {
      urls.add(icon);
    } else {
      urls.add(`https://cdn.discordapp.com/icons/${data.guild.id}/${icon}.webp?size=64`);
    }
  }

  for (const msg of data.messages) {
    collectMessageUrls(msg, urls);

    // Thread messages
    if (msg.thread?.messages) {
      for (const threadMsg of msg.thread.messages) {
        collectMessageUrls(threadMsg, urls);
      }
    }
  }

  return downloadAll(urls);
}

function collectMessageUrls(msg: DiscordMessage, urls: Set<string>): void {
  // Author avatar
  urls.add(getAvatarUrl(msg.author.id, msg.author.avatar, msg.author.discriminator));

  // Referenced message avatar
  if (msg.referencedMessage?.author) {
    urls.add(getAvatarUrl(msg.referencedMessage.author.id, msg.referencedMessage.author.avatar, msg.referencedMessage.author.discriminator));
  }

  // Interaction user avatar
  if (msg.interaction?.user) {
    urls.add(getAvatarUrl(msg.interaction.user.id, msg.interaction.user.avatar, msg.interaction.user.discriminator));
  }

  // Attachments
  if (msg.attachments) {
    for (const att of msg.attachments) {
      if (att.url) urls.add(att.url);
    }
  }

  // Embeds
  if (msg.embeds) {
    for (const embed of msg.embeds) {
      collectEmbedUrls(embed, urls);
    }
  }

  // Stickers
  if (msg.stickers) {
    for (const s of msg.stickers) {
      if (s.url) urls.add(s.url);
    }
  }

  // Reactions (custom emojis)
  if (msg.reactions) {
    for (const r of msg.reactions) {
      if (r.emoji.id) {
        const ext = r.emoji.animated ? "gif" : "webp";
        urls.add(`https://cdn.discordapp.com/emojis/${r.emoji.id}.${ext}?size=48&quality=lossless`);
      }
    }
  }

  // Components (button emojis, V2 media)
  if (msg.components) {
    for (const comp of msg.components) {
      collectComponentUrls(comp, urls);
    }
  }

  // Poll emojis
  if (msg.poll) {
    for (const answer of msg.poll.answers) {
      if (answer.pollMedia.emoji?.id) {
        urls.add(`https://cdn.discordapp.com/emojis/${answer.pollMedia.emoji.id}.webp?size=48`);
      }
    }
  }

  // Custom emojis in message content
  collectTextEmojis(msg.content, urls);
}

/** Extract custom emoji CDN URLs from any text that may contain Discord emoji markup */
function collectTextEmojis(text: string | undefined | null, urls: Set<string>): void {
  if (!text) return;
  const emojiPattern = /<(a?):(\w+):(\d+)>/g;
  let match: RegExpExecArray | null;
  while ((match = emojiPattern.exec(text)) !== null) {
    const ext = match[1] ? "gif" : "webp";
    urls.add(`https://cdn.discordapp.com/emojis/${match[3]}.${ext}?size=48&quality=lossless`);
  }
}

function collectEmbedUrls(embed: DiscordEmbed, urls: Set<string>): void {
  if (embed.image?.url) urls.add(embed.image.url);
  if (embed.thumbnail?.url) urls.add(embed.thumbnail.url);
  if (embed.video?.url) urls.add(embed.video.url);
  if (embed.video?.proxyUrl) urls.add(embed.video.proxyUrl);
  if (embed.author?.iconUrl) urls.add(embed.author.iconUrl);
  if (embed.footer?.iconUrl) urls.add(embed.footer.iconUrl);

  // Custom emojis in embed text fields
  collectTextEmojis(embed.description, urls);
  collectTextEmojis(embed.title, urls);
  if (embed.fields) {
    for (const field of embed.fields) {
      collectTextEmojis(field.name, urls);
      collectTextEmojis(field.value, urls);
    }
  }
  collectTextEmojis(embed.author?.name, urls);
  collectTextEmojis(embed.footer?.text, urls);
}

function collectComponentUrls(comp: DiscordComponent, urls: Set<string>): void {
  // Button emojis
  if (comp.emoji?.id) {
    const ext = comp.emoji.animated ? "gif" : "webp";
    urls.add(`https://cdn.discordapp.com/emojis/${comp.emoji.id}.${ext}?size=48&quality=lossless`);
  }

  // V2 section accessory
  if (comp.accessory?.media?.url) {
    urls.add(comp.accessory.media.url);
  }

  // V2 media gallery
  if (comp.items) {
    for (const item of comp.items) {
      if ((item as any).media?.url) urls.add((item as any).media.url);
    }
  }

  // V2 standalone thumbnail
  if (comp.media?.url) {
    urls.add(comp.media.url);
  }

  // V2 file
  if (comp.file?.url) {
    urls.add(comp.file.url);
  }

  // V2 text display emojis
  collectTextEmojis(comp.content, urls);

  // Recurse into child components
  if (comp.components) {
    for (const child of comp.components) {
      collectComponentUrls(child, urls);
    }
  }
}

/** Download all URLs with concurrency limit, return map of URL → data URI */
async function downloadAll(urls: Set<string>): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  const queue = [...urls];
  let idx = 0;

  async function worker(): Promise<void> {
    while (idx < queue.length) {
      const url = queue[idx++];
      const dataUri = await downloadAsDataUri(url);
      if (dataUri) result.set(url, dataUri);
    }
  }

  const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, () => worker());
  await Promise.all(workers);
  return result;
}

const SAFE_CONTENT_TYPES = new Set([
  "image/png", "image/jpeg", "image/gif", "image/webp", "image/avif",
  "audio/ogg", "audio/mpeg", "audio/wav", "audio/webm", "audio/aac", "audio/flac", "audio/mp4",
  "video/mp4", "video/webm", "video/ogg", "video/quicktime",
  "application/ogg",
]);

/** Map URL file extensions to safe MIME types (fallback when server returns unexpected content-type) */
const EXT_TO_MIME: Record<string, string> = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif",
  webp: "image/webp", avif: "image/avif",
  ogg: "audio/ogg", oga: "audio/ogg", mp3: "audio/mpeg", wav: "audio/wav",
  m4a: "audio/mp4", aac: "audio/aac", flac: "audio/flac", opus: "audio/ogg",
  mp4: "video/mp4", webm: "video/webm", mov: "video/quicktime",
};

function mimeFromUrl(url: string): string | undefined {
  try {
    const path = new URL(url).pathname.toLowerCase();
    const dot = path.lastIndexOf(".");
    if (dot < 0) return undefined;
    return EXT_TO_MIME[path.slice(dot + 1)];
  } catch { return undefined; }
}

/** Pattern to match 172.16.0.0 - 172.31.255.255 private range */
const PRIVATE_172 = /^172\.(1[6-9]|2\d|3[01])\./;

/** Validate URL target to prevent SSRF against internal networks */
function isAllowedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
    const host = parsed.hostname.toLowerCase();
    if (host === "localhost" || host.endsWith(".localhost") || host.startsWith("127.") || host === "[::1]" || host === "0.0.0.0" || host === "[::]" ) return false;
    if (host.startsWith("10.") || host.startsWith("192.168.") || host.startsWith("169.254.")) return false;
    if (PRIVATE_172.test(host)) return false;
    if (host.endsWith(".local") || host.endsWith(".internal")) return false;
    // Block IPv6 private ranges: mapped IPv4 (::ffff:), unique local (fc/fd), link-local (fe80)
    if (host.startsWith("[::ffff:")) return false;
    if (/^\[f[cd]/.test(host)) return false;
    if (host.startsWith("[fe80:")) return false;
    return true;
  } catch { return false; }
}

async function downloadAsDataUri(url: string): Promise<string | null> {
  try {
    // Follow redirects by hand so every hop is checked against the SSRF rules
    const signal = AbortSignal.timeout(30_000);
    let current = url;
    let res: Response | undefined;
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      if (!isAllowedUrl(current)) return null;
      res = await fetch(current, {
        headers: { "User-Agent": "discord-transcripts/media-resolver" },
        redirect: "manual",
        signal,
      });
      if (res.status < 300 || res.status >= 400) break;
      const location = res.headers.get("location");
      if (!location || hop === MAX_REDIRECTS) return null;
      current = new URL(location, current).toString();
    }
    if (!res || !res.ok) return null;

    const contentLength = res.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) return null;

    const buffer = await res.arrayBuffer();
    if (buffer.byteLength > MAX_FILE_SIZE) return null;

    const rawType = (res.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
    let contentType: string;
    if (SAFE_CONTENT_TYPES.has(rawType)) {
      contentType = rawType;
    } else {
      // Fallback: derive from URL extension so audio/video still plays in browser
      const extMime = mimeFromUrl(url);
      contentType = extMime && SAFE_CONTENT_TYPES.has(extMime) ? extMime : "application/octet-stream";
    }
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:${contentType};base64,${base64}`;
  } catch {
    return null;
  }
}
