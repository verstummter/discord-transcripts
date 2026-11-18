import type {
  TranscriptData,
  TranscriptOptions,
  DiscordMessage,
  DiscordEmbed,
  DiscordAttachment,
  DiscordReaction,
  DiscordComponent,
  DiscordRole,
  DiscordMessageType,
  DiscordPoll,
  DiscordMessageSnapshot,
  DiscordSticker,
} from "../types/discord.js";
import {
  parseDiscordMarkdown,
  formatMessageTimestamp,
  getAvatarUrl,
  colorIntToHex,
  formatFileSize,
  isImageAttachment,
  isVideoAttachment,
  isAudioAttachment,
  setDateContext,
  formatDate,
  formatNumber,
  dayKey,
  hourOfDay,
  parseInlinePreview,
  isEmojiOnly,
} from "./markdown.js";
import { TRANSCRIPT_CSS } from "./transcript-css.js";

// ─── Inline SVG Icons ───

const ICONS = {
  hash: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z"/></svg>',
  voice: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a1 1 0 0 0-1-1h-.06a1 1 0 0 0-.74.32L5.92 7.53H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2.92l4.28 5.21a1 1 0 0 0 .74.32H11a1 1 0 0 0 1-1V3ZM15.1 20.75c-.58.14-1.1-.33-1.1-.92v-.02c0-.47.31-.85.73-1.01 2.2-.82 3.77-2.95 3.77-5.46 0-2.51-1.58-4.64-3.77-5.46-.42-.16-.73-.54-.73-1.01v-.02c0-.59.52-1.06 1.1-.92A7.5 7.5 0 0 1 20 13.34a7.5 7.5 0 0 1-4.9 7.41ZM14.43 16.54c-.55.2-1.1-.17-1.1-.73 0-.4.26-.73.62-.9A3.48 3.48 0 0 0 15.5 12c0-1.27-.68-2.38-1.55-2.91-.36-.17-.62-.5-.62-.9 0-.56.55-.93 1.1-.73a5.14 5.14 0 0 1 2.57 4.54c0 1.94-1.04 3.63-2.57 4.54Z"/></svg>',
  announce: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 8.26H2V15.2941H3.9V8.26Z"/><path d="M19.1 4V5.12659L4.85 8.26447V18.1176C4.85 18.5496 5.1464 18.9252 5.5701 19.0315L9.3701 19.9727C9.4461 19.992 9.524 20 9.6 20C9.89545 20 10.1776 19.8635 10.3551 19.6106L12.64 16.3727L19.1 17.8735V19H21V4H19.1ZM10.6286 17.5765L7.95 16.9045L8.037 16.5765H10.8914L10.6286 17.5765ZM18.15 16.0247L5.85 13.4541V9.07588L18.15 6.50529V16.0247Z"/></svg>',
  pin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12L12.101 2.10101L10.686 3.51401L12.101 4.92901L7.15 9.87801V11.293L4.322 14.121L5.735 15.535L8.565 12.707H9.979L14.928 7.75701L16.343 9.17201L9.414 16.101L10.828 17.515L17.757 10.586L19.172 12L22 12Z"/><path d="M3.08 21.192L8.15 16.122L7.736 15.707L2.666 20.778L3.08 21.192Z"/></svg>',
  download: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16.293 9.293L17.707 10.707L12 16.414L6.29297 10.707L7.70697 9.293L11 12.586V2H13V12.586L16.293 9.293Z"/><path d="M18 20V18H20V20C20 21.102 19.104 22 18 22H6C4.896 22 4 21.102 4 20V18H6V20H18Z"/></svg>',
  file: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M4 2C4 0.895431 4.89543 0 6 0H14L20 6V22C20 23.1046 19.1046 24 18 24H6C4.89543 24 4 23.1046 4 22V2ZM13 1.5V7H18.5L13 1.5ZM6 2V22H18V8H12V2H6Z"/></svg>',
  thread: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5.43309 21C5.35842 21 5.30189 20.9325 5.31494 20.859L5.99991 17H2.14274C2.06819 17 2.01168 16.9327 2.02453 16.8593L2.33253 15.0993C2.34258 15.0419 2.39244 15 2.45074 15H6.34991L7.73991 7H3.94274C3.86819 7 3.81168 6.93274 3.82453 6.85931L4.13253 5.09931C4.14258 5.04189 4.19244 5 4.25074 5H8.08991L8.85218 0.860131C8.86222 0.802722 8.91208 0.760826 8.97038 0.760826H10.7504C10.825 0.760826 10.8815 0.828324 10.8685 0.901826L10.1399 5H16.1399L16.9022 0.860131C16.9122 0.802722 16.9621 0.760826 17.0204 0.760826H18.8004C18.875 0.760826 18.9315 0.828324 18.9185 0.901826L18.1899 5H22.0474C22.1219 5 22.1784 5.06726 22.1656 5.14069L21.8576 6.90069C21.8475 6.95811 21.7977 7 21.7394 7H17.8399L16.45 15H20.2474C20.3219 15 20.3784 15.0673 20.3656 15.1407L20.0576 16.9007C20.0475 16.9581 19.9977 17 19.9394 17H16.0999L15.3376 21.1399C15.3276 21.1973 15.2777 21.2392 15.2194 21.2392H13.4394C13.3648 21.2392 13.3083 21.1717 13.3213 21.0982L14.0499 17H8.04991L7.28764 21.1399C7.2776 21.1973 7.22774 21.2392 7.16943 21.2392H5.43309ZM8.39991 15H14.3999L15.7899 7H9.78991L8.39991 15Z"/></svg>',
  arrowRight: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M14.707 5.636L13.293 7.05L17.243 11H4V13H17.243L13.293 16.95L14.707 18.364L21.071 12L14.707 5.636Z"/></svg>',
  clip: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6.16667 14.5C6.16667 16.525 7.80833 18.1667 9.83333 18.1667H17.3333C19.9083 18.1667 22 16.075 22 13.5C22 10.925 19.9083 8.83333 17.3333 8.83333H10.5556C8.73056 8.83333 7.27778 10.2861 7.27778 12.1111C7.27778 13.9361 8.73056 15.3889 10.5556 15.3889H16.7778V13.7222H10.5556C9.64722 13.7222 8.94444 13.0194 8.94444 12.1111C8.94444 11.2028 9.64722 10.5 10.5556 10.5H17.3333C18.9917 10.5 20.3333 11.8417 20.3333 13.5C20.3333 15.1583 18.9917 16.5 17.3333 16.5H9.83333C8.725 16.5 7.83333 15.6083 7.83333 14.5C7.83333 13.3917 8.725 12.5 9.83333 12.5H16.7778V10.8333H9.83333C7.80833 10.8333 6.16667 12.475 6.16667 14.5Z"/></svg>',
  botCheck: '<svg width="10" height="10" viewBox="0 0 16 15.2" fill="#fff"><path d="M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z"/></svg>',
  automod: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L3 7v6c0 5.25 3.75 10.18 9 11.25 5.25-1.07 9-6 9-11.25V7l-9-5zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V13H5V8.26l7-3.89V12.99z"/></svg>',
  slashCommand: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14.9 3H9.1L4.1 21H8.1L13.1 3H14.9Z"/></svg>',
  copy: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>',
  poll: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>',
  sun: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM2 13h2a1 1 0 0 0 0-2H2a1 1 0 0 0 0 2zm18 0h2a1 1 0 0 0 0-2h-2a1 1 0 0 0 0 2zM11 2v2a1 1 0 0 0 2 0V2a1 1 0 0 0-2 0zm0 18v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-2 0zM5.99 4.58a1 1 0 0 0-1.41 1.41l1.06 1.06a1 1 0 0 0 1.41-1.41L5.99 4.58zm12.37 12.37a1 1 0 0 0-1.41 1.41l1.06 1.06a1 1 0 0 0 1.41-1.41l-1.06-1.06zm1.06-10.96a1 1 0 0 0-1.41-1.41l-1.06 1.06a1 1 0 0 0 1.41 1.41l1.06-1.06zM7.05 18.36a1 1 0 0 0-1.41-1.41l-1.06 1.06a1 1 0 0 0 1.41 1.41l1.06-1.06z"/></svg>',
  moon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.39 5.39 0 0 1-4.4 2.26 5.4 5.4 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>',
  forward: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z"/></svg>',
  search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
  calendar: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>',
  chevron: '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.42 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.71 6.7a1 1 0 0 0-1.42 0z"/></svg>',
};

// ─── Escape helpers ───

function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Sanitize a URL: only allow http/https schemes and safe data: MIME types */
function sanitizeUrl(url: string): string {
  if (url.startsWith("data:")) {
    if (
      url.startsWith("data:image/") ||
      url.startsWith("data:audio/") ||
      url.startsWith("data:video/") ||
      url.startsWith("data:font/") ||
      url.startsWith("data:application/octet-stream")
    ) return url;
    return "";
  }
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") return url;
  } catch { }
  return "";
}

/** Module-level media map for the current render pass */
let _mediaMap: Map<string, string> | undefined;

/** Resolve a URL through the media map (returns data URI if available, otherwise original) */
function resolveMedia(url: string): string {
  return _mediaMap?.get(url) ?? url;
}

/**
 * Neutralise anything that could close the <style> block.
 * The HTML parser ends a style element at `</style` in any letter case, so a
 * backslash is inserted between `<` and `/`. Inserting rather than deleting
 * means a pass can never assemble a new `</style` out of the leftovers, and in
 * CSS `\/` is just `/`, so legitimate rules are unaffected.
 */
function sanitizeCss(css: string): string {
  return css.replace(/<\/(?=style)/gi, "<\\/");
}

// ─── Options ───

const DEFAULT_OPTIONS: TranscriptOptions = {
  theme: "dark",
  showReactions: true,
  showAvatars: true,
  showTimestamps: true,
  showRoleColors: true,
  showEmbeds: true,
  showAttachments: true,
  showThreads: true,
  showHeader: true,
  dateFormat: "absolute",
  maxImageWidth: 400,
  compact: false,
};

// ─── Main Generator ───

/**
 * Generate a complete standalone HTML document from Discord transcript data.
 * Produces string-based HTML - no React SSR dependency.
 */
export function generateTranscriptHtml(
  data: TranscriptData,
  options?: TranscriptOptions,
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  _mediaMap = opts._resolvedMedia;
  setDateContext(opts.locale, opts.timeZone);
  try {
    return buildDocument(data, opts);
  } finally {
    // Never leak one render's media map or locale into the next
    _mediaMap = undefined;
    setDateContext();
  }
}

function buildDocument(data: TranscriptData, opts: TranscriptOptions): string {
  const channelName = data.channel.name;
  const guildName = data.guild?.name ?? "Discord";
  const title = opts.pageTitle ?? `${guildName} - #${channelName}`;
  const messageCount = data.totalMessages ?? data.messages.length;
  const generatedAt = data.generatedAt ?? new Date().toISOString();
  const themeClass = opts.theme === "light" ? "discord-light" : "discord-dark";
  const compactClass = opts.compact ? " discord-compact" : "";

  const bodyHtml = renderTranscript({ ...data, generatedAt }, opts);

  const fontFamily = opts.fontFamily
    ? sanitizeCss(`body { font-family: ${opts.fontFamily.replace(/[<>&]/g, "")}; }`)
    : "";

  const customCss = opts.customCss ? sanitizeCss(opts.customCss) : "";

  // Pagination
  const paginationScript = opts.messagesPerPage ? buildPaginationScript(opts.messagesPerPage) : "";

  // JSON export
  const jsonBlock = opts.includeJson
    ? `<script type="application/json" id="discord-transcript-json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="Transcript of #${esc(channelName)} - ${messageCount} messages" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="Discord transcript with ${messageCount} messages" />
<meta property="og:type" content="website" />
<meta name="generator" content="discord-transcript" />
<meta name="robots" content="noindex, nofollow" />
${opts.faviconUrl ? `<link rel="icon" href="${esc(sanitizeUrl(opts.faviconUrl))}" />` : ""}
<style>
html { color-scheme: ${opts.theme === "light" ? "light" : "dark"}; }
@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { overflow-x: hidden; background: ${opts.theme === "light" ? "#fff" : "#313338"}; }
${TRANSCRIPT_CSS}
${fontFamily}
${customCss}
</style>
</head>
<body>
<div class="discord-transcript ${themeClass}${compactClass}" id="discord-top">
${bodyHtml}
<a class="discord-to-top" id="discord-to-top" href="#discord-top" aria-label="Back to top" title="Back to top">${ICONS.chevron}</a>
</div>
${opts.enableLightbox ? `<div class="discord-lightbox" id="discord-lightbox"><div class="discord-lightbox-backdrop"></div><img class="discord-lightbox-img" id="discord-lightbox-img" alt="" /><a class="discord-lightbox-link" id="discord-lightbox-link" target="_blank" rel="noopener noreferrer">Open original</a></div>` : ""}
${jsonBlock}
<script>
${buildEmbeddedScript(opts)}
${paginationScript}
</script>
</body>
</html>`;
  return html;
}

// ─── Embedded Script Builder ───

function buildEmbeddedScript(opts: TranscriptOptions): string {
  const parts: string[] = [];

  // Base: spoiler click + emoji fallback + voice message playback (always included)
  parts.push(`document.addEventListener('click',function(e){
var el=e.target.closest('.discord-spoiler');if(el)el.classList.toggle('revealed');
var att=e.target.closest('.discord-spoiler-attachment');if(att)att.classList.toggle('revealed');
var v2s=e.target.closest('.discord-v2-spoiler');if(v2s)v2s.classList.toggle('revealed');
var vp=e.target.closest('.discord-voice-play');
if(vp){var vm=vp.parentElement;var a=vm&&vm.querySelector('audio.discord-voice-audio');
if(a){if(a.paused){document.querySelectorAll('audio.discord-voice-audio').forEach(function(o){if(o!==a){o.pause();var p=o.parentElement&&o.parentElement.querySelector('.discord-voice-play');if(p)p.textContent='\u25B6'}});a.play();vp.textContent='\u25AE\u25AE'}else{a.pause();vp.textContent='\u25B6'}a.onended=function(){vp.textContent='\u25B6'}}}
});
document.addEventListener('error',function(e){
var img=e.target;if(img.tagName==='IMG'&&img.src.indexOf('/emojis/')!==-1&&img.src.indexOf('.gif')!==-1)img.src=img.src.replace('.gif','.webp');
},true);
(function(){var tt=document.getElementById('discord-to-top');if(!tt)return;
function u(){tt.classList.toggle('visible',(window.pageYOffset||document.documentElement.scrollTop)>600)}
window.addEventListener('scroll',u,{passive:true});u()})();`);

  // Light/dark theme toggle
  if (opts.enableThemeToggle) {
    parts.push(`(function(){
var btn=document.getElementById('discord-theme-toggle'),root=document.querySelector('.discord-transcript');
if(!btn||!root)return;
btn.addEventListener('click',function(){
var light=!root.classList.contains('discord-light');
root.classList.toggle('discord-light',light);root.classList.toggle('discord-dark',!light);
document.documentElement.style.colorScheme=light?'light':'dark';
document.body.style.background=light?'#fff':'#313338';
});
})();`);
  }

  // Collapsible embeds
  if (opts.collapsibleEmbeds) {
    parts.push(`document.addEventListener('click',function(e){
var tog=e.target.closest('.discord-embed-collapse');
if(tog){var embed=tog.closest('.discord-embed');if(embed)embed.classList.toggle('collapsed')}
});`);
  }

  // Copy message button
  if (opts.enableCopyButton) {
    parts.push(`document.addEventListener('click',function(e){
var btn=e.target.closest('.discord-copy-btn');
if(btn){var msg=btn.closest('.discord-message');var text=msg.querySelector(':scope > .discord-message-body .discord-message-text');
if(text&&!btn.dataset.busy){var icon=btn.innerHTML;var c=text.cloneNode(true);c.querySelectorAll('.discord-message-edited').forEach(function(x){x.remove()});
navigator.clipboard.writeText((c.textContent||'').trim()).then(function(){btn.dataset.busy='1';btn.textContent='\u2713';setTimeout(function(){btn.innerHTML=icon;delete btn.dataset.busy},1500)})}}
});`);
  }

  // Image lightbox
  if (opts.enableLightbox) {
    parts.push(`(function(){
var lb=document.getElementById('discord-lightbox'),lbi=document.getElementById('discord-lightbox-img'),lbl=document.getElementById('discord-lightbox-link');
if(!lb)return;
document.addEventListener('click',function(e){
var img=e.target.closest('.discord-attachment-img,.discord-embed-image-img,.discord-v2-media-img,.discord-sticker-img');
if(img&&img.tagName==='IMG'){e.preventDefault();lbi.src=img.src;lbl.href=img.src;lb.classList.add('active')}
var bd=e.target.closest('.discord-lightbox-backdrop');if(bd)lb.classList.remove('active');
});
document.addEventListener('keydown',function(e){if(e.key==='Escape')lb.classList.remove('active')});
})();`);
  }

  // Message search
  if (opts.enableSearch) {
    parts.push(`(function(){
var inp=document.getElementById('discord-search-input'),cnt=document.getElementById('discord-search-count'),empty=document.getElementById('discord-search-empty'),bar=document.getElementById('discord-search');
if(!inp)return;var t;
var SEL='.discord-message-username,.discord-message-text,.discord-system-message-content,.discord-embed,.discord-poll,.discord-v2-container,.discord-attachment-file,.discord-forwarded';
function run(){
var q=inp.value.toLowerCase().trim(),msgs=document.querySelectorAll('.discord-message');
var n=0;msgs.forEach(function(m){
if(!q){m.classList.remove('discord-search-hidden','discord-search-highlight');return}
var txt='';m.querySelectorAll(SEL).forEach(function(el){txt+=' '+(el.textContent||'')});
if(txt.toLowerCase().indexOf(q)!==-1){m.classList.remove('discord-search-hidden');m.classList.add('discord-search-highlight');n++}
else{m.classList.add('discord-search-hidden');m.classList.remove('discord-search-highlight')}
});
document.querySelectorAll('.discord-messages > .discord-date-separator').forEach(function(sep){
var any=false,el=sep.nextElementSibling;
while(el&&!el.classList.contains('discord-date-separator')){if(el.classList.contains('discord-message')&&!el.classList.contains('discord-search-hidden')){any=true;break}el=el.nextElementSibling}
sep.classList.toggle('discord-search-hidden',!!q&&!any)});
cnt.textContent=q?(n+(n===1?' result':' results')):'';
if(bar)bar.classList.toggle('has-query',!!q);
if(empty)empty.style.display=(q&&n===0)?'block':'none';
document.dispatchEvent(new Event('discord-search'));
}
inp.addEventListener('input',function(){clearTimeout(t);t=setTimeout(run,200)});
document.addEventListener('keydown',function(e){
if(e.key==='Escape'&&document.activeElement===inp){inp.value='';run();inp.blur();return}
var a=document.activeElement,tag=a&&a.tagName;
if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&tag!=='INPUT'&&tag!=='TEXTAREA'){e.preventDefault();inp.focus();inp.select()}
});
})();`);
  }

  // Date navigation
  if (opts.enableDateNav) {
    parts.push(`(function(){
var list=document.getElementById('discord-date-nav-list'),tog=document.getElementById('discord-date-nav-toggle');
if(!list||!tog)return;
var seps=document.querySelectorAll('.discord-date-separator');
seps.forEach(function(s){var txt=s.querySelector('.discord-date-separator-text');
if(txt){var a=document.createElement('div');a.className='discord-date-nav-item';a.textContent=txt.textContent;
a.addEventListener('click',function(){close();document.dispatchEvent(new CustomEvent('discord-reveal',{detail:s}));s.scrollIntoView({behavior:'smooth',block:'start'})});list.appendChild(a)}
});
function close(){list.classList.remove('open');tog.classList.remove('open');tog.setAttribute('aria-expanded','false')}
tog.addEventListener('click',function(){var o=list.classList.toggle('open');tog.classList.toggle('open',o);tog.setAttribute('aria-expanded',o?'true':'false')});
document.addEventListener('click',function(e){if(!e.target.closest('#discord-date-nav'))close()});
document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
})();`);
  }

  // Thread expansion toggle
  if (opts.expandThreads) {
    parts.push(`document.addEventListener('click',function(e){
var tog=e.target.closest('.discord-thread-expand-toggle');
if(tog){var cont=tog.closest('.discord-thread-expand');if(cont){cont.classList.toggle('expanded');
var sp=tog.querySelector('span');if(sp)sp.textContent=cont.classList.contains('expanded')?'Hide thread':'Show thread'}}
});`);
  }

  return parts.join("\n");
}

function buildPaginationScript(perPage: number): string {
  return `(function(){
var msgs=document.querySelectorAll('.discord-messages > .discord-message, .discord-messages > .discord-date-separator');
var pp=${perPage},page=0,total=Math.ceil(msgs.length/pp);
var nav=document.getElementById('discord-pagination');if(!nav||total<=1)return;
function searching(){return !!document.querySelector('.discord-search-bar.has-query')}
function show(){
if(searching()){msgs.forEach(function(m){m.style.display=''});nav.style.display='none';return}
nav.style.display='';
msgs.forEach(function(m,i){m.style.display=(i>=page*pp&&i<(page+1)*pp)?'':'none'});render()}
function go(d){page+=d;show();window.scrollTo(0,0)}
function render(){nav.innerHTML='';
var prev=document.createElement('button');prev.className='discord-page-btn';prev.textContent='\u25C0 Prev';prev.disabled=page===0;prev.onclick=function(){go(-1)};nav.appendChild(prev);
var sp=document.createElement('span');sp.className='discord-page-info';sp.textContent='Page '+(page+1)+' of '+total;nav.appendChild(sp);
var next=document.createElement('button');next.className='discord-page-btn';next.textContent='Next \u25B6';next.disabled=page>=total-1;next.onclick=function(){go(1)};nav.appendChild(next)}
function reveal(el){if(!el||searching())return;
for(var i=0;i<msgs.length;i++){if(msgs[i]===el||msgs[i].contains(el)){var p=Math.floor(i/pp);if(p!==page){page=p;show()}return}}}
function fromHash(){if(location.hash.indexOf('#msg-')!==0)return;var el=document.getElementById(location.hash.slice(1));if(el){reveal(el);el.scrollIntoView({block:'start'})}}
document.addEventListener('discord-search',show);
document.addEventListener('discord-reveal',function(e){reveal(e.detail)});
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="#msg-"]');if(a)reveal(document.getElementById(a.getAttribute('href').slice(1)))},true);
window.addEventListener('hashchange',fromHash);
show();fromHash()})();`;
}

// ─── Transcript Body ───

function renderTranscript(data: TranscriptData, opts: TranscriptOptions): string {
  const parts: string[] = [];

  // Build a global mentions map from all message authors so any <@userId> can resolve
  const globalMentions: Array<{ id: string; username: string }> = [];
  const seenIds = new Set<string>();
  for (const msg of data.messages) {
    if (!seenIds.has(msg.author.id)) {
      seenIds.add(msg.author.id);
      globalMentions.push({ id: msg.author.id, username: msg.author.globalName || msg.author.username });
    }
    if (msg.mentions) {
      for (const m of msg.mentions) {
        if (!seenIds.has(m.id)) {
          seenIds.add(m.id);
          globalMentions.push({ id: m.id, username: m.username });
        }
      }
    }
  }
  // Attach to data so renderMessage can access it
  (data as any)._globalMentions = globalMentions;
  // IDs of messages present in this transcript, so replies can link to their target
  (data as any)._messageIds = new Set(data.messages.map((m) => m.id));

  const tools = renderTools(opts);
  if (opts.showHeader !== false) {
    parts.push(renderHeader(data, tools, seenAuthors(data.messages)));
  } else if (tools) {
    parts.push(`<div class="discord-channel-header discord-channel-header-tools-only"><div class="discord-channel-header-inner">${tools}</div></div>`);
  }

  parts.push(`<div class="discord-messages">`);
  parts.push(renderChannelBeginning(data.channel));

  const groups = groupMessages(data.messages);
  for (let gi = 0; gi < groups.length; gi++) {
    const group = groups[gi];
    if (gi === 0 || !isSameDay(group[0].timestamp, groups[gi - 1][0].timestamp)) {
      const date = new Date(group[0].timestamp);
      parts.push(`<div class="discord-date-separator">
<div class="discord-date-separator-line"></div>
<span class="discord-date-separator-text">${esc(formatDate(date, { weekday: "long", year: "numeric", month: "long", day: "numeric" }, "date"))}</span>
<div class="discord-date-separator-line"></div>
</div>`);
    }
    for (let mi = 0; mi < group.length; mi++) {
      parts.push(renderMessage(group[mi], opts, data, mi === 0));
    }
  }

  parts.push(`</div>`);

  if (opts.messagesPerPage) {
    parts.push(`<div class="discord-pagination" id="discord-pagination"></div>`);
  }

  if (opts.enableSearch) {
    parts.push(`<div class="discord-search-empty" id="discord-search-empty"><div class="discord-search-empty-icon">${ICONS.search}</div><div class="discord-search-empty-title">No results found</div><div>No messages match your search.</div></div>`);
  }

  // User statistics
  if (opts.showUserStats) {
    parts.push(renderUserStats(data));
  }

  const genDate = data.generatedAt
    ? ` on ${esc(formatDate(new Date(data.generatedAt)))}`
    : "";
  parts.push(
    `<div class="discord-transcript-footer"><p>Transcript generated${genDate} &bull; ${data.totalMessages ?? data.messages.length} messages</p></div>`,
  );

  return parts.join("\n");
}

// ─── Header ───

function seenAuthors(messages: DiscordMessage[]): number {
  return new Set(messages.map((m) => m.author.id)).size;
}

/** Search box + jump-to-date menu, shown in the top bar */
function renderTools(opts: TranscriptOptions): string {
  const search = opts.enableSearch
    ? `<label class="discord-search-bar" id="discord-search"><span class="discord-search-icon">${ICONS.search}</span><input type="text" class="discord-search-input" placeholder="Search messages" aria-label="Search messages" id="discord-search-input" autocomplete="off" spellcheck="false" /><span class="discord-search-count" id="discord-search-count"></span><kbd class="discord-search-kbd">/</kbd></label>`
    : "";
  const dateNav = opts.enableDateNav
    ? `<div class="discord-date-nav" id="discord-date-nav"><button type="button" class="discord-date-nav-toggle" id="discord-date-nav-toggle" aria-haspopup="true" aria-expanded="false">${ICONS.calendar}<span>Jump to date</span><span class="discord-date-nav-chevron">${ICONS.chevron}</span></button><div class="discord-date-nav-list" id="discord-date-nav-list"></div></div>`
    : "";
  const themeToggle = opts.enableThemeToggle
    ? `<button type="button" class="discord-theme-toggle" id="discord-theme-toggle" aria-label="Toggle light or dark theme" title="Toggle theme"><span class="discord-theme-icon-sun">${ICONS.sun}</span><span class="discord-theme-icon-moon">${ICONS.moon}</span></button>`
    : "";
  if (!search && !dateNav && !themeToggle) return "";
  return `<div class="discord-header-tools">${search}${dateNav}${themeToggle}</div>`;
}

function renderHeader(data: TranscriptData, tools: string, participants: number): string {
  const { channel, guild } = data;
  const messageCount = data.totalMessages ?? data.messages.length;
  const guildIcon = guild?.icon
    ? `<img src="${esc(resolveMedia(guild.icon.startsWith("https://") || guild.icon.startsWith("http://") ? guild.icon : `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=64`))}" alt="" class="discord-guild-icon" loading="lazy" />`
    : "";
  const guildName = guild?.name
    ? `<span class="discord-guild-name">${esc(guild.name)}</span><span class="discord-header-sep">${ICONS.chevron}</span>`
    : "";
  const channelIcon = getChannelIconHtml(channel.type);
  const topic = channel.topic
    ? `<div class="discord-channel-topic" title="${esc(channel.topic)}">${esc(channel.topic)}</div>`
    : "";
  const genAt = data.generatedAt
    ? `<span>${esc(formatDate(new Date(data.generatedAt), { month: "short", day: "numeric", year: "numeric" }, "date"))}</span>`
    : "";
  const people = participants > 0
    ? `<span>${participants} ${participants === 1 ? "participant" : "participants"}</span>`
    : "";

  return `<div class="discord-channel-header">
<div class="discord-channel-header-inner">
<div class="discord-channel-header-top">
${guildIcon}
${guildName}
<div class="discord-channel-name">${channelIcon}<span>${esc(channel.name)}</span></div>
${topic}
</div>
${tools}
<div class="discord-transcript-meta"><span>${messageCount} ${messageCount === 1 ? "message" : "messages"}</span>${people}${genAt}</div>
</div>
</div>`;
}

function getChannelIconHtml(type: number): string {
  if (type === 2 || type === 13) return `<span class="discord-channel-icon">${ICONS.voice}</span>`;
  if (type === 5) return `<span class="discord-channel-icon">${ICONS.announce}</span>`;
  if (isThreadType(type)) return `<span class="discord-channel-icon">${ICONS.thread}</span>`;
  return `<span class="discord-channel-icon">${ICONS.hash}</span>`;
}

function getChannelBeginningIcon(type: number): string {
  if (type === 2 || type === 13) return ICONS.voice;
  if (type === 5) return ICONS.announce;
  if (isThreadType(type)) return ICONS.thread;
  return ICONS.hash;
}

/** Announcement, public and private threads (forum posts are public threads) */
function isThreadType(type: number): boolean {
  return type === 10 || type === 11 || type === 12;
}

// ─── Channel Beginning ───

function renderChannelBeginning(channel: TranscriptData["channel"]): string {
  const icon = getChannelBeginningIcon(channel.type);
  const topic = channel.topic
    ? `<p class="discord-channel-beginning-topic">${esc(channel.topic)}</p>`
    : "";
  return `<div class="discord-channel-beginning">
<div class="discord-channel-beginning-icon">${icon}</div>
<h2 class="discord-channel-beginning-title">${isThreadType(channel.type) ? esc(channel.name) : `Welcome to #${esc(channel.name)}!`}</h2>
${topic}
<p class="discord-channel-beginning-subtitle">${isThreadType(channel.type) ? "This is the start of the thread." : `This is the start of the #${esc(channel.name)} channel.`}</p>
</div>`;
}

// ─── Message ───

function renderMessage(
  message: DiscordMessage,
  opts: TranscriptOptions,
  data: TranscriptData,
  isGroupStart: boolean,
): string {
  const system = getSystemMessageText(message);
  if (system) {
    const author = system.withAuthor
      ? `<span class="discord-system-message-author">${esc(message.author.globalName || message.author.username)}</span> `
      : "";
    return `<div class="discord-message discord-system-message" id="msg-${esc(message.id)}">
<div class="discord-system-message-icon">${ICONS.arrowRight}</div>
<div class="discord-system-message-content">
${author}${system.html}
<span class="discord-message-timestamp">${esc(formatMessageTimestamp(message.timestamp, opts.dateFormat))}</span>
</div>
</div>`;
  }

  const parts: string[] = [];
  const userColor = getUserColor(data.memberRoles?.[message.author.id], data.roles);
  const pinnedClass = message.pinned ? " discord-message-pinned" : "";
  const groupedClass = !isGroupStart ? " discord-message-grouped" : "";
  const edited = message.editedTimestamp
    ? `<span class="discord-message-edited" title="Edited: ${esc(formatDate(new Date(message.editedTimestamp)))}">(edited)</span>`
    : "";

  parts.push(
    `<div class="discord-message${pinnedClass}${groupedClass}" id="msg-${esc(message.id)}">`,
  );

  // Hover button on every message that has text, not only the first of a group
  if (opts.enableCopyButton && message.content) {
    parts.push(`<button type="button" class="discord-copy-btn" title="Copy message" aria-label="Copy message">${ICONS.copy}</button>`);
  }

  // Slash command / interaction context
  if (message.interaction && isGroupStart) {
    const intUser = message.interaction.user;
    const intAvatar = opts.showAvatars !== false
      ? `<img src="${esc(resolveMedia(getAvatarUrl(intUser.id, intUser.avatar, intUser.discriminator)))}" alt="" class="discord-reply-avatar" width="16" height="16" loading="lazy" />`
      : "";
    parts.push(`<div class="discord-interaction-context">
${intAvatar}
<span class="discord-interaction-user">${esc(intUser.globalName || intUser.username)}</span>
<span class="discord-interaction-label"> used </span>
<span class="discord-interaction-command">${ICONS.slashCommand}${esc(message.interaction.name)}</span>
</div>`);
  }

  // Reply context
  if (message.referencedMessage) {
    const ref = message.referencedMessage;
    const refAvatar =
      opts.showAvatars !== false
        ? `<img src="${esc(resolveMedia(getAvatarUrl(ref.author.id, ref.author.avatar, ref.author.discriminator)))}" alt="" class="discord-reply-avatar" width="16" height="16" loading="lazy" />`
        : "";
    const refContent = ref.content
      ? parseInlinePreview(ref.content, data.roles, data.channels, (data as any)._globalMentions, _mediaMap)
      : `<em>Click to see attachment</em>`;
    // Link to the original message when it is part of this transcript
    const canJump = !!ref.id && (data as any)._messageIds?.has(ref.id);
    const jumpOpen = canJump ? `<a class="discord-reply-link" href="#msg-${esc(ref.id)}" title="Jump to message">` : "";
    const jumpClose = canJump ? `</a>` : "";
    parts.push(`<div class="discord-reply-context">
<div class="discord-reply-bar"></div>
${refAvatar}
${jumpOpen}<span class="discord-reply-username">${esc(ref.author.globalName || ref.author.username)}</span>
<span class="discord-reply-content">${refContent}</span>${jumpClose}
</div>`);
  } else if (message.messageReference && !message.messageSnapshots?.length) {
    parts.push(`<div class="discord-reply-context">
<span class="discord-reply-content discord-reply-deleted">Original message was deleted</span>
</div>`);
  }

  parts.push(`<div class="discord-message-body">`);

  // Avatar
  if (isGroupStart && opts.showAvatars !== false) {
    const avatarUrl = resolveMedia(getAvatarUrl(
      message.author.id,
      message.author.avatar,
      message.author.discriminator,
    ));
    parts.push(`<div class="discord-message-avatar-container">
<img src="${esc(avatarUrl)}" alt="${esc(message.author.username)}'s avatar" class="discord-message-avatar" width="40" height="40" loading="lazy" />
</div>`);
  }

  // Gutter for grouped
  if (!isGroupStart) {
    const shortTime = formatDate(new Date(message.timestamp), { hour: "2-digit", minute: "2-digit" }, "time");
    parts.push(
      `<div class="discord-message-gutter"><span class="discord-message-timestamp-short">${esc(shortTime)}</span></div>`,
    );
  }

  parts.push(`<div class="discord-message-content-wrapper">`);

  // Header
  if (isGroupStart) {
    const nameStyle =
      opts.showRoleColors !== false && userColor
        ? ` style="color:${userColor}"`
        : "";
    const displayName = message.author.globalName || message.author.username;
    const botBadge = message.author.bot
      ? `<span class="discord-bot-badge">${message.webhookId ? "" : `<span class="discord-bot-badge-icon">${ICONS.botCheck}</span>`}${message.webhookId ? "WEBHOOK" : "BOT"}</span>`
      : "";
    const pinIcon = message.pinned
      ? `<span class="discord-pin-icon">${ICONS.pin}</span>`
      : "";
    const timestamp =
      opts.showTimestamps !== false
        ? `<span class="discord-message-timestamp">${esc(formatMessageTimestamp(message.timestamp, opts.dateFormat))}</span>`
        : "";
    // Without text the (edited) marker has nowhere else to go
    const headerEdited = !message.content ? edited : "";

    parts.push(`<div class="discord-message-header">
<span class="discord-message-username"${nameStyle}>${esc(displayName)}</span>
${botBadge}${pinIcon}${timestamp}${headerEdited}
</div>`);
  }

  // Merge per-message mentions with global mentions
  const allMentions = (data as any)._globalMentions ?? message.mentions ?? [];

  // Content
  if (message.content) {
    const parsedContent = parseDiscordMarkdown(
      message.content,
      data.roles,
      data.channels,
      allMentions,
      _mediaMap,
    );
    // Like Discord, (edited) follows the text, and emoji-only messages are shown large
    const jumboClass = isEmojiOnly(message.content) ? " discord-jumbo" : "";
    const editedInline = edited ? ` ${edited}` : "";
    parts.push(`<div class="discord-message-text${jumboClass}">${parsedContent}${editedInline}</div>`);
  }

  // Forwarded messages
  if (message.messageSnapshots?.length) {
    for (const snapshot of message.messageSnapshots) {
      parts.push(renderForwarded(snapshot, opts, data, allMentions));
    }
  }

  // Stickers
  if (message.stickers?.length) {
    parts.push(`<div class="discord-stickers">${message.stickers.map(renderSticker).join("")}</div>`);
  }

  // Voice message
  if (message.voiceMessage) {
    parts.push(renderVoiceMessage(message));
  }

  // Attachments (skip audio attachments already rendered as voice message)
  if (opts.showAttachments !== false && message.attachments?.length) {
    const atts = message.voiceMessage
      ? message.attachments.filter(a => !a.contentType?.startsWith("audio/"))
      : message.attachments;
    if (atts.length) {
      parts.push(`<div class="discord-attachments">`);
      for (const att of atts) {
        parts.push(renderAttachment(att, opts.maxImageWidth));
      }
      parts.push(`</div>`);
    }
  }

  // Embeds
  if (opts.showEmbeds !== false && message.embeds?.length) {
    parts.push(`<div class="discord-embeds">`);
    for (const embed of message.embeds) {
      parts.push(renderEmbed(embed, { roles: data.roles, channels: data.channels, mentions: allMentions }, opts.collapsibleEmbeds));
    }
    parts.push(`</div>`);
  }

  // Components
  if (message.components?.length) {
    parts.push(renderComponents(message.components, { roles: data.roles, channels: data.channels, mentions: allMentions }, opts.customRenderers));
  }

  // Poll
  if (message.poll) {
    parts.push(renderPoll(message.poll));
  }

  // Reactions
  if (opts.showReactions !== false && message.reactions?.length) {
    parts.push(renderReactions(message.reactions));
  }

  // Thread
  if (opts.showThreads !== false && message.thread) {
    const threadCount =
      message.thread.messageCount !== undefined
        ? `<span class="discord-thread-count">${message.thread.messageCount} messages</span>`
        : "";
    parts.push(`<div class="discord-thread-indicator">
<span class="discord-thread-icon">${ICONS.thread}</span>
<div class="discord-thread-name">${esc(message.thread.name)}</div>
${threadCount}
</div>`);

    // Thread expansion
    if (opts.expandThreads && message.thread.messages?.length) {
      parts.push(`<div class="discord-thread-expand">
<div class="discord-thread-expand-toggle">${ICONS.chevron} <span>Show thread</span></div>
<div class="discord-thread-expand-content">`);
      for (const threadMsg of message.thread.messages) {
        parts.push(renderMessage(threadMsg, opts, data, true));
      }
      parts.push(`</div></div>`);
    }
  }

  parts.push(`</div></div></div>`);
  return parts.join("\n");
}

// ─── Sticker ───

/** Lottie stickers (format 3) are JSON animations, so they get a labelled placeholder */
function renderSticker(sticker: DiscordSticker): string {
  if (sticker.url && sticker.formatType !== 3) {
    return `<div class="discord-sticker"><img src="${esc(resolveMedia(sticker.url))}" alt="${esc(sticker.name)}" class="discord-sticker-img" width="160" height="160" loading="lazy" /></div>`;
  }
  return `<div class="discord-sticker"><div class="discord-sticker-placeholder" title="Sticker">${esc(sticker.name)}</div></div>`;
}

// ─── Forwarded Message ───

function renderForwarded(
  snapshot: DiscordMessageSnapshot,
  opts: TranscriptOptions,
  data: TranscriptData,
  mentions: Array<{ id: string; username: string }>,
): string {
  const parts: string[] = [];
  parts.push(`<div class="discord-forwarded">
<div class="discord-forwarded-label">${ICONS.forward}<span>Forwarded</span></div>`);

  if (snapshot.content) {
    parts.push(`<div class="discord-message-text">${parseDiscordMarkdown(snapshot.content, data.roles, data.channels, mentions, _mediaMap)}</div>`);
  }

  if (snapshot.stickers?.length) {
    parts.push(`<div class="discord-stickers">${snapshot.stickers.map(renderSticker).join("")}</div>`);
  }

  if (opts.showAttachments !== false && snapshot.attachments?.length) {
    parts.push(`<div class="discord-attachments">`);
    for (const att of snapshot.attachments) parts.push(renderAttachment(att, opts.maxImageWidth));
    parts.push(`</div>`);
  }

  if (opts.showEmbeds !== false && snapshot.embeds?.length) {
    parts.push(`<div class="discord-embeds">`);
    for (const embed of snapshot.embeds) {
      parts.push(renderEmbed(embed, { roles: data.roles, channels: data.channels, mentions }, opts.collapsibleEmbeds));
    }
    parts.push(`</div>`);
  }

  if (snapshot.timestamp && opts.showTimestamps !== false) {
    parts.push(`<div class="discord-forwarded-footer">${esc(formatMessageTimestamp(snapshot.timestamp, opts.dateFormat))}</div>`);
  }

  parts.push(`</div>`);
  return parts.join("\n");
}

// ─── Embed ───

function renderEmbed(embed: DiscordEmbed, ctx?: { roles?: Record<string, DiscordRole>; channels?: Record<string, { id: string; name: string }>; mentions?: Array<{ id: string; username: string }> }, collapsible?: boolean): string {
  // GIF embeds (Tenor, Giphy, etc.) - render as inline autoplay video
  if (embed.type === "gifv" && (embed.video?.url || embed.thumbnail?.url)) {
    const videoUrl = embed.video?.proxyUrl || embed.video?.url;
    const thumbUrl = embed.thumbnail?.url;
    const maxW = embed.video?.width ? Math.min(embed.video.width, 400) : 400;
    if (videoUrl) {
      return `<div class="discord-attachment discord-attachment-image">
<video autoplay loop muted playsinline class="discord-attachment-img" style="max-width:${maxW}px" ${thumbUrl ? `poster="${esc(resolveMedia(thumbUrl))}"` : ""}>
<source src="${esc(resolveMedia(videoUrl))}" type="video/mp4" />
</video></div>`;
    }
    if (thumbUrl) {
      return `<div class="discord-attachment discord-attachment-image">
<img src="${esc(resolveMedia(thumbUrl))}" alt="" class="discord-attachment-img" loading="lazy" style="max-width:${maxW}px" /></div>`;
    }
  }

  // Image-only embeds (direct image URL pasted) - render as standalone image
  if (embed.type === "image" && embed.thumbnail?.url && !embed.title && !embed.description && !embed.fields?.length) {
    const maxW = embed.thumbnail.width ? Math.min(embed.thumbnail.width, 400) : 400;
    return `<div class="discord-attachment discord-attachment-image">
<img src="${esc(resolveMedia(embed.thumbnail.url))}" alt="" class="discord-attachment-img" loading="lazy" style="max-width:${maxW}px" /></div>`;
  }

  const borderColor = embed.color ? colorIntToHex(embed.color) : "var(--dc-border-subtle)";
  const parts: string[] = [];
  parts.push(
    `<div class="discord-embed" style="border-left-color:${borderColor}">`,
  );

  if (collapsible) {
    parts.push(`<span class="discord-embed-collapse" title="Collapse embed">${ICONS.chevron}</span>`);
  }

  if (embed.author) {
    const icon = embed.author.iconUrl
      ? `<img src="${esc(resolveMedia(embed.author.iconUrl))}" alt="" class="discord-embed-author-icon" width="24" height="24" loading="lazy" />`
      : "";
    const authorParsed = parseDiscordMarkdown(embed.author.name, ctx?.roles, ctx?.channels as any, ctx?.mentions, _mediaMap);
    const name = embed.author.url
      ? `<a href="${esc(sanitizeUrl(embed.author.url))}" class="discord-embed-author-name discord-link" target="_blank" rel="noopener noreferrer">${authorParsed}</a>`
      : `<span class="discord-embed-author-name">${authorParsed}</span>`;
    parts.push(`<div class="discord-embed-author">${icon}${name}</div>`);
  }

  if (embed.title) {
    const titleParsed = parseDiscordMarkdown(embed.title, ctx?.roles, ctx?.channels as any, ctx?.mentions, _mediaMap);
    const titleContent = embed.url
      ? `<a href="${esc(sanitizeUrl(embed.url))}" class="discord-link" target="_blank" rel="noopener noreferrer">${titleParsed}</a>`
      : titleParsed;
    parts.push(`<div class="discord-embed-title">${titleContent}</div>`);
  }

  if (embed.description) {
    parts.push(
      `<div class="discord-embed-description">${parseDiscordMarkdown(embed.description, ctx?.roles, ctx?.channels as any, ctx?.mentions, _mediaMap)}</div>`,
    );
  }

  if (embed.fields?.length) {
    parts.push(`<div class="discord-embed-fields">`);
    for (const field of embed.fields) {
      const inlineClass = field.inline ? " discord-embed-field-inline" : "";
      parts.push(`<div class="discord-embed-field${inlineClass}">
<div class="discord-embed-field-name">${esc(field.name)}</div>
<div class="discord-embed-field-value">${parseDiscordMarkdown(field.value, ctx?.roles, ctx?.channels as any, ctx?.mentions, _mediaMap)}</div>
</div>`);
    }
    parts.push(`</div>`);
  }

  if (embed.image) {
    const maxW = embed.image.width ? Math.min(embed.image.width, 400) : 400;
    parts.push(
      `<div class="discord-embed-image"><img src="${esc(resolveMedia(embed.image.url))}" alt="" class="discord-embed-image-img" loading="lazy" style="max-width:${maxW}px" /></div>`,
    );
  }

  // Discord proxies direct video files; players such as YouTube only offer an embed page
  const videoSrc = embed.video?.proxyUrl
    || (embed.video?.url && /\.(?:mp4|webm|mov|m4v|ogv)(?:[?#]|$)/i.test(embed.video.url) ? embed.video.url : undefined);
  const externalVideo = !!embed.video?.url && !videoSrc;

  if (embed.thumbnail && !embed.video?.url) {
    parts.push(
      `<div class="discord-embed-thumbnail"><img src="${esc(resolveMedia(embed.thumbnail.url))}" alt="" class="discord-embed-thumbnail-img" loading="lazy" /></div>`,
    );
  }

  if (videoSrc) {
    const vMaxW = embed.video!.width ? Math.min(embed.video!.width, 400) : 400;
    const posterAttr = embed.thumbnail?.url ? ` poster="${esc(resolveMedia(embed.thumbnail.url))}"` : "";
    parts.push(
      `<div class="discord-embed-video"><video controls preload="metadata" class="discord-embed-image-img" style="max-width:${vMaxW}px;border-radius:4px"${posterAttr}><source src="${esc(resolveMedia(videoSrc))}" type="video/mp4" /></video></div>`,
    );
  } else if (externalVideo && embed.thumbnail?.url) {
    const href = sanitizeUrl(embed.url || embed.video?.url || "");
    const img = `<img src="${esc(resolveMedia(embed.thumbnail.url))}" alt="" class="discord-embed-image-img" loading="lazy" style="max-width:400px" /><span class="discord-embed-play" aria-hidden="true">\u25B6</span>`;
    parts.push(href
      ? `<div class="discord-embed-video discord-embed-video-external"><a href="${esc(href)}" target="_blank" rel="noopener noreferrer" title="Play">${img}</a></div>`
      : `<div class="discord-embed-video discord-embed-video-external">${img}</div>`);
  }

  if (embed.footer) {
    const icon = embed.footer.iconUrl
      ? `<img src="${esc(resolveMedia(embed.footer.iconUrl))}" alt="" class="discord-embed-footer-icon" width="20" height="20" loading="lazy" />`
      : "";
    const ts = embed.timestamp
      ? `<span class="discord-embed-footer-separator"> &bull; ${esc(formatDate(new Date(embed.timestamp)))}</span>`
      : "";
    const footerParsed = parseDiscordMarkdown(embed.footer.text, ctx?.roles, ctx?.channels as any, ctx?.mentions, _mediaMap);
    parts.push(
      `<div class="discord-embed-footer">${icon}<span class="discord-embed-footer-text">${footerParsed}</span>${ts}</div>`,
    );
  }

  parts.push(`</div>`);
  return parts.join("\n");
}

// ─── Attachment ───

function renderAttachment(att: DiscordAttachment, maxWidth = 400): string {
  const isSpoiler = att.spoiler || att.filename.startsWith("SPOILER_");

  if (isImageAttachment(att.contentType)) {
    const maxW = att.width ? Math.min(att.width, maxWidth) : maxWidth;
    const alt = esc(att.description || att.filename);
    const altLine = att.description
      ? `<div class="discord-attachment-alt">${esc(att.description)}</div>`
      : "";
    if (isSpoiler) {
      return `<div class="discord-attachment discord-attachment-image"><div class="discord-spoiler-attachment" style="max-width:${maxW}px"><div class="discord-spoiler-overlay"><span>Spoiler</span></div><img src="${esc(resolveMedia(att.url))}" alt="${alt}" class="discord-attachment-img" loading="lazy" /></div>${altLine}</div>`;
    }
    return `<div class="discord-attachment discord-attachment-image">
<a href="${esc(sanitizeUrl(resolveMedia(att.url)))}" target="_blank" rel="noopener noreferrer">
<img src="${esc(resolveMedia(att.url))}" alt="${alt}" class="discord-attachment-img" loading="lazy" style="max-width:${maxW}px" />
</a>${altLine}</div>`;
  }

  if (isVideoAttachment(att.contentType)) {
    return `<div class="discord-attachment discord-attachment-video">
<video controls preload="metadata" class="discord-attachment-video-player" style="max-width:${maxWidth}px">
<source src="${esc(resolveMedia(att.url))}" type="${esc(att.contentType || "video/mp4")}" />
</video></div>`;
  }

  if (isAudioAttachment(att.contentType)) {
    return `<div class="discord-attachment discord-attachment-audio">
<div class="discord-attachment-audio-container">
<div class="discord-attachment-file-name">${esc(att.filename)}</div>
<audio controls preload="metadata" class="discord-attachment-audio-player">
<source src="${esc(resolveMedia(att.url))}" type="${esc(att.contentType || "audio/ogg")}" />
</audio>
<div class="discord-attachment-file-size">${esc(formatFileSize(att.size))}</div>
</div></div>`;
  }

  return `<div class="discord-attachment discord-attachment-file">
<div class="discord-attachment-file-container">
<span class="discord-attachment-file-icon">${ICONS.file}</span>
<div class="discord-attachment-file-info">
<a href="${esc(sanitizeUrl(resolveMedia(att.url)))}" class="discord-link discord-attachment-file-name" target="_blank" rel="noopener noreferrer">${esc(att.filename)}</a>
<div class="discord-attachment-file-size">${esc(formatFileSize(att.size))}</div>
</div>
<a href="${esc(sanitizeUrl(resolveMedia(att.url)))}" class="discord-attachment-download" target="_blank" rel="noopener noreferrer" aria-label="Download ${esc(att.filename)}">${ICONS.download}</a>
</div></div>`;
}

// ─── Reactions ───

function renderReactions(reactions: DiscordReaction[]): string {
  const items = reactions.map((r) => {
    let emojiHtml: string;
    if (r.emoji.id) {
      const ext = r.emoji.animated ? "gif" : "webp";
      const url = `https://cdn.discordapp.com/emojis/${r.emoji.id}.${ext}?size=48&quality=lossless`;
      emojiHtml = `<img src="${esc(resolveMedia(url))}" alt=":${esc(r.emoji.name)}:" class="discord-reaction-emoji-custom" width="18" height="18" loading="lazy" />`;
    } else {
      emojiHtml = `<span class="discord-reaction-emoji-unicode">${esc(r.emoji.name)}</span>`;
    }
    return `<div class="discord-reaction">${emojiHtml}<span class="discord-reaction-count">${r.count}</span></div>`;
  });
  return `<div class="discord-reactions">${items.join("")}</div>`;
}

// ─── Components ───

function renderComponents(
  components: DiscordComponent[],
  context?: { roles?: Record<string, DiscordRole>; channels?: Record<string, { id: string; name: string }>; mentions?: Array<{ id: string; username: string }> },
  customRenderers?: Record<number, (component: DiscordComponent) => string>,
): string {
  return components.map((c) => {
    if (customRenderers?.[c.type]) return customRenderers[c.type](c);
    return renderSingleComponent(c, context, customRenderers);
  }).join("");
}

function renderSingleComponent(
  c: DiscordComponent,
  ctx?: { roles?: Record<string, DiscordRole>; channels?: Record<string, { id: string; name: string }>; mentions?: Array<{ id: string; username: string }> },
  customRenderers?: Record<number, (component: DiscordComponent) => string>,
): string {
  switch (c.type) {
    // V1: ActionRow
    case 1:
      return renderActionRow(c);

    // V1: Button
    case 2:
      return renderButton(c);

    // V1: Select menus (3-8)
    case 3: case 4: case 5: case 6: case 7: case 8:
      return `<div class="discord-select"><span class="discord-select-placeholder">${esc(c.label || "Make a selection")}</span></div>`;

    // V2: Section (9)
    case 9:
      return renderSection(c, ctx, customRenderers);

    // V2: TextDisplay (10)
    case 10:
      return renderTextDisplay(c, ctx);

    // V2: Thumbnail (11) - standalone (not as accessory)
    case 11:
      return renderThumbnail(c);

    // V2: MediaGallery (12)
    case 12:
      return renderMediaGallery(c);

    // V2: File (13)
    case 13:
      return renderFileComponent(c);

    // V2: Separator (14)
    case 14:
      return renderSeparator(c);

    // V2: Container (17)
    case 17:
      return renderContainer(c, ctx, customRenderers);

    // V2: Label (18)
    case 18:
      return `<div class="discord-v2-label">${esc(c.content ?? "")}</div>`;

    default:
      return "";
  }
}

function renderActionRow(row: DiscordComponent): string {
  const items = (row.components ?? []).map((c) => {
    if (c.type === 2) return renderButton(c);
    if (c.type >= 3 && c.type <= 8) {
      return `<div class="discord-select"><span class="discord-select-placeholder">${esc(c.label || "Make a selection")}</span></div>`;
    }
    return "";
  });
  return `<div class="discord-component-row">${items.join("")}</div>`;
}

function renderButton(c: DiscordComponent): string {
  const styleClass = getButtonStyleClass(c.style);
  const disabledClass = c.disabled ? " discord-button-disabled" : "";
  const emoji = c.emoji
    ? c.emoji.id
      ? (() => {
        const ext = c.emoji!.animated ? "gif" : "webp";
        return `<img src="${esc(resolveMedia(`https://cdn.discordapp.com/emojis/${c.emoji!.id}.${ext}?size=48&quality=lossless`))}" alt=":${esc(c.emoji!.name)}:" class="discord-button-emoji" width="18" height="18" loading="lazy" />`;
      })()
      : `<span class="discord-button-emoji">${esc(c.emoji.name)}</span>`
    : "";
  const label = c.label ? esc(c.label) : "";
  if (c.url) {
    return `<a href="${esc(sanitizeUrl(c.url))}" class="discord-button ${styleClass}" target="_blank" rel="noopener noreferrer">${emoji}${label}</a>`;
  }
  return `<span class="discord-button ${styleClass}${disabledClass}">${emoji}${label}</span>`;
}

function renderContainer(
  c: DiscordComponent,
  ctx?: { roles?: Record<string, DiscordRole>; channels?: Record<string, { id: string; name: string }>; mentions?: Array<{ id: string; username: string }> },
  customRenderers?: Record<number, (component: DiscordComponent) => string>,
): string {
  const accentStyle = c.accentColor ? ` style="border-left: 3px solid ${colorIntToHex(c.accentColor)}"` : "";
  const spoilerClass = c.spoiler ? " discord-v2-spoiler" : "";
  const spoilerOverlay = c.spoiler ? `<div class="discord-spoiler-overlay"><span>Spoiler</span></div>` : "";
  const children = renderComponents(c.components ?? [], ctx, customRenderers);
  return `<div class="discord-v2-container${spoilerClass}"${accentStyle}>${spoilerOverlay}${children}</div>`;
}

function renderSection(
  c: DiscordComponent,
  ctx?: { roles?: Record<string, DiscordRole>; channels?: Record<string, { id: string; name: string }>; mentions?: Array<{ id: string; username: string }> },
  customRenderers?: Record<number, (component: DiscordComponent) => string>,
): string {
  const textParts = renderComponents(c.components ?? [], ctx, customRenderers);
  const accessory = c.accessory?.media?.url
    ? `<div class="discord-v2-section-accessory"><img src="${esc(resolveMedia(c.accessory.media.url))}" alt="${esc(c.accessory.description ?? "")}" class="discord-v2-thumbnail-img" loading="lazy" /></div>`
    : "";
  return `<div class="discord-v2-section">${textParts}${accessory}</div>`;
}

function renderTextDisplay(
  c: DiscordComponent,
  ctx?: { roles?: Record<string, DiscordRole>; channels?: Record<string, { id: string; name: string }>; mentions?: Array<{ id: string; username: string }> },
): string {
  const parsed = parseDiscordMarkdown(
    c.content ?? "",
    ctx?.roles,
    ctx?.channels as Record<string, { id: string; name: string; type: number }> | undefined,
    ctx?.mentions,
    _mediaMap,
  );
  return `<div class="discord-v2-text-display">${parsed}</div>`;
}

function renderThumbnail(c: DiscordComponent): string {
  if (!c.media?.url) return "";
  const desc = c.description ?? "";
  return `<div class="discord-v2-thumbnail"><img src="${esc(resolveMedia(c.media.url))}" alt="${esc(desc)}" class="discord-v2-thumbnail-img" loading="lazy" /></div>`;
}

function renderMediaGallery(c: DiscordComponent): string {
  const items = (c.items ?? []).map((item) => {
    const spoilerClass = item.spoiler ? " discord-v2-spoiler" : "";
    const spoilerOverlay = item.spoiler ? `<div class="discord-spoiler-overlay"><span>Spoiler</span></div>` : "";
    const desc = item.description ? ` alt="${esc(item.description)}"` : ' alt=""';
    return `<div class="discord-v2-media-item${spoilerClass}">${spoilerOverlay}<img src="${esc(resolveMedia(item.media.url))}"${desc} class="discord-v2-media-img" loading="lazy" /></div>`;
  });
  const countClass = (c.items?.length ?? 0) === 1 ? " discord-v2-media-gallery-single" : "";
  return `<div class="discord-v2-media-gallery${countClass}">${items.join("")}</div>`;
}

function renderFileComponent(c: DiscordComponent): string {
  if (!c.file) return "";
  const url = c.file.url;
  const filename = url.startsWith("attachment://") ? url.slice(13) : url.split("/").pop() ?? "file";
  return `<div class="discord-v2-file"><div class="discord-v2-file-icon">${ICONS.clip}</div><div class="discord-v2-file-info"><a href="${esc(sanitizeUrl(resolveMedia(url)))}" class="discord-v2-file-name discord-link" target="_blank" rel="noopener noreferrer">${esc(filename)}</a></div></div>`;
}

function renderSeparator(c: DiscordComponent): string {
  const largeClass = c.spacing === 2 ? " discord-v2-separator-large" : "";
  const dividerClass = c.divider !== false ? " discord-v2-separator-divider" : "";
  return `<div class="discord-v2-separator${largeClass}${dividerClass}"></div>`;
}

function getButtonStyleClass(style?: number): string {
  switch (style) {
    case 1: return "discord-button-primary";
    case 2: return "discord-button-secondary";
    case 3: return "discord-button-success";
    case 4: return "discord-button-danger";
    case 5: return "discord-button-link";
    default: return "discord-button-secondary";
  }
}

// ─── Poll ───

function renderPoll(poll: DiscordPoll): string {
  const totalVotes = poll.answers.reduce((sum, a) => sum + (a.count ?? 0), 0);
  const maxVotes = Math.max(...poll.answers.map(a => a.count ?? 0), 1);
  const expired = poll.isFinalized ? " (Final Results)" : "";
  const multiLabel = poll.allowMultiselect ? `<span class="discord-poll-multi">Select multiple</span>` : "";

  const parts: string[] = [];
  parts.push(`<div class="discord-poll">`);
  parts.push(`<div class="discord-poll-header">${ICONS.poll}<span class="discord-poll-question">${esc(poll.question.text ?? "Poll")}</span>${multiLabel}${esc(expired)}</div>`);

  for (const answer of poll.answers) {
    const count = answer.count ?? 0;
    const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
    const barWidth = totalVotes > 0 ? Math.round((count / maxVotes) * 100) : 0;
    const isWinner = poll.isFinalized && count === maxVotes && count > 0;
    const winnerClass = isWinner ? " discord-poll-answer-winner" : "";
    const emojiHtml = answer.pollMedia.emoji
      ? answer.pollMedia.emoji.id
        ? `<img src="${esc(resolveMedia(`https://cdn.discordapp.com/emojis/${answer.pollMedia.emoji.id}.webp?size=48`))}" alt="" class="discord-poll-emoji" width="22" height="22" />`
        : `<span class="discord-poll-emoji">${esc(answer.pollMedia.emoji.name)}</span>`
      : "";

    parts.push(`<div class="discord-poll-answer${winnerClass}">
<div class="discord-poll-answer-text">${emojiHtml}${esc(answer.pollMedia.text ?? "")}</div>
<div class="discord-poll-bar-container"><div class="discord-poll-bar" style="width:${barWidth}%"></div></div>
<div class="discord-poll-answer-info"><span class="discord-poll-count">${count} vote${count !== 1 ? "s" : ""}</span><span class="discord-poll-pct">${pct}%</span></div>
</div>`);
  }

  parts.push(`<div class="discord-poll-footer">${totalVotes} vote${totalVotes !== 1 ? "s" : ""}</div>`);
  parts.push(`</div>`);
  return parts.join("\n");
}

// ─── Voice Message ───

function renderVoiceMessage(message: DiscordMessage): string {
  const vm = message.voiceMessage!;
  const audioAtt = message.attachments?.find(a => a.contentType?.startsWith("audio/"));
  const audioUrl = audioAtt?.url ?? "";
  const duration = vm.duration;
  const mins = Math.floor(duration / 60);
  const secs = Math.floor(duration % 60);
  const durationStr = `${mins}:${secs.toString().padStart(2, "0")}`;

  // Decode waveform from base64 to bar heights
  let bars = "";
  if (vm.waveform) {
    try {
      const raw = Buffer.from(vm.waveform, "base64");
      const barCount = Math.min(raw.length, 64);
      const barsArr: string[] = [];
      for (let i = 0; i < barCount; i++) {
        const h = Math.max(4, Math.round((raw[i] / 255) * 28));
        barsArr.push(`<div class="discord-voice-bar" style="height:${h}px"></div>`);
      }
      bars = barsArr.join("");
    } catch {
      bars = Array(32).fill('<div class="discord-voice-bar" style="height:8px"></div>').join("");
    }
  } else {
    bars = Array(32).fill('<div class="discord-voice-bar" style="height:8px"></div>').join("");
  }

  return `<div class="discord-voice-message">
<div class="discord-voice-play" role="button" tabindex="0" aria-label="Play voice message">\u25B6</div>
<div class="discord-voice-waveform">${bars}</div>
<div class="discord-voice-duration">${esc(durationStr)}</div>
${audioUrl ? `<audio preload="metadata" class="discord-voice-audio"><source src="${esc(resolveMedia(audioUrl))}" type="${esc(audioAtt?.contentType || "audio/ogg")}" /></audio>` : ""}
</div>`;
}

// ─── User Statistics ───

function renderUserStats(data: TranscriptData): string {
  const stats = new Map<string, { user: { username: string; globalName?: string | null; avatar?: string | null; id: string; discriminator?: string }; count: number; firstMsg: number; lastMsg: number; }>();

  for (const msg of data.messages) {
    const existing = stats.get(msg.author.id);
    const ts = new Date(msg.timestamp).getTime();
    if (existing) {
      existing.count++;
      if (ts < existing.firstMsg) existing.firstMsg = ts;
      if (ts > existing.lastMsg) existing.lastMsg = ts;
    } else {
      stats.set(msg.author.id, {
        user: msg.author,
        count: 1,
        firstMsg: ts,
        lastMsg: ts,
      });
    }
  }

  const sorted = [...stats.values()].sort((a, b) => b.count - a.count);
  const maxCount = sorted[0]?.count ?? 1;

  const rows = sorted.map((s, i) => {
    const barWidth = Math.round((s.count / maxCount) * 100);
    const displayName = s.user.globalName || s.user.username;
    const avatarUrl = resolveMedia(getAvatarUrl(s.user.id, s.user.avatar, s.user.discriminator));
    return `<div class="discord-stats-row">
<span class="discord-stats-rank">#${i + 1}</span>
<img src="${esc(avatarUrl)}" alt="" class="discord-stats-avatar" width="24" height="24" loading="lazy" />
<span class="discord-stats-name">${esc(displayName)}</span>
<div class="discord-stats-bar-container"><div class="discord-stats-bar" style="width:${barWidth}%"></div></div>
<span class="discord-stats-count">${s.count}</span>
</div>`;
  });

  // Hour distribution
  const hours = new Array(24).fill(0);
  let attachmentCount = 0;
  for (const msg of data.messages) {
    hours[hourOfDay(new Date(msg.timestamp))]++;
    attachmentCount += msg.attachments?.length ?? 0;
  }
  const maxHour = Math.max(...hours, 1);
  const peakHour = hours.indexOf(Math.max(...hours));
  const hourLabel = (i: number) => (i === 0 ? "12a" : i < 12 ? `${i}a` : i === 12 ? "12p" : `${i - 12}p`);
  const hourBars = hours.map((h, i) => {
    const barH = h === 0 ? 2 : Math.max(4, Math.round((h / maxHour) * 64));
    const cls = h === 0 ? " empty" : i === peakHour ? " peak" : "";
    return `<div class="discord-stats-hour${cls}" title="${hourLabel(i)}: ${h} ${h === 1 ? "message" : "messages"}"><div class="discord-stats-hour-track"><div class="discord-stats-hour-bar" style="height:${barH}px"></div></div><span class="discord-stats-hour-label">${i % 3 === 0 ? hourLabel(i) : ""}</span></div>`;
  }).join("");

  const total = data.messages.length;
  const tile = (value: string, label: string) =>
    `<div class="discord-stats-tile"><div class="discord-stats-tile-value">${esc(value)}</div><div class="discord-stats-tile-label">${esc(label)}</div></div>`;
  const tiles = [
    tile(formatNumber(total), total === 1 ? "Message" : "Messages"),
    tile(String(sorted.length), sorted.length === 1 ? "Participant" : "Participants"),
    tile(formatNumber(attachmentCount), attachmentCount === 1 ? "Attachment" : "Attachments"),
    tile(total ? hourLabel(peakHour).replace("a", " AM").replace("p", " PM") : "\u2014", "Busiest hour"),
  ].join("");

  return `<div class="discord-user-stats">
<div class="discord-stats-header">Statistics</div>
<div class="discord-stats-tiles">${tiles}</div>
<div class="discord-stats-grid">
<div class="discord-stats-section">
<div class="discord-stats-section-title">Most Active Users</div>
${rows.join("\n")}
</div>
<div class="discord-stats-section">
<div class="discord-stats-section-title">Activity by Hour</div>
<div class="discord-stats-hours">${hourBars}</div>
</div>
</div>
</div>`;
}

// ─── Helpers ───

function getUserColor(
  userRoleIds?: string[],
  roles?: Record<string, DiscordRole>,
): string | undefined {
  if (!userRoleIds || !roles) return undefined;
  let highestRole: DiscordRole | undefined;
  for (const roleId of userRoleIds) {
    const role = roles[roleId];
    if (role && role.color && role.color !== 0) {
      if (!highestRole || (role.position ?? 0) > (highestRole.position ?? 0)) {
        highestRole = role;
      }
    }
  }
  return highestRole ? colorIntToHex(highestRole.color) : undefined;
}

interface SystemMessage {
  html: string;
  /** Whether the line starts with the author's name */
  withAuthor: boolean;
}

function getSystemMessageText(message: DiscordMessage): SystemMessage | null {
  const by = (html: string): SystemMessage => ({ html, withAuthor: true });
  const plain = (html: string): SystemMessage => ({ html, withAuthor: false });
  switch (message.type as number) {
    case 1: return by("added a recipient to the group.");
    case 2: return by("removed a recipient from the group.");
    case 3: return by("started a call.");
    case 4: return by(`changed the channel name: ${esc(message.content)}`);
    case 5: return by("changed the channel icon.");
    case 6: return by("pinned a message to this channel.");
    case 7: return by("joined the server!");
    case 8: return by("just boosted the server!");
    case 9: return by("just boosted the server! This server has achieved Level 1!");
    case 10: return by("just boosted the server! This server has achieved Level 2!");
    case 11: return by("just boosted the server! This server has achieved Level 3!");
    case 12: return by(`has added a channel follow: ${esc(message.content)}`);
    case 14: return plain("This server has been removed from Server Discovery because it no longer passes all the requirements.");
    case 15: return plain("This server is eligible for Server Discovery again and has been automatically relisted!");
    case 16: return plain("This server has failed Discovery activity requirements for 1 week.");
    case 17: return plain("This server has failed Discovery activity requirements for 3 weeks in a row.");
    case 18: return by(`started a thread: <strong>${esc(message.content)}</strong>`);
    case 22: return plain("Wondering who to invite? Start by inviting anyone who can help you build the server!");
    case 24: return by(`${ICONS.automod} <span class="discord-automod-label">AutoMod</span> has blocked a message in this channel.`);
    case 27: return by("started a Stage event.");
    case 28: return by("ended the Stage event.");
    case 29: return by("is now a speaker.");
    case 31: return by(`changed the Stage topic: ${esc(message.content)}`);
    case 36: return by("enabled security actions.");
    case 37: return by("disabled security actions.");
    case 38: return by("reported a raid in this server.");
    case 39: return by("reported a false alarm.");
    case 46: return pollResultText(message);
    default: return null;
  }
}

/** Poll result messages carry the outcome as fields of a "poll_result" embed */
function pollResultText(message: DiscordMessage): SystemMessage {
  const fields = message.embeds?.find((e) => e.type === "poll_result")?.fields ?? [];
  const get = (name: string) => fields.find((f) => f.name === name)?.value;
  const question = get("poll_question_text");
  const winner = get("victor_answer_text");
  const votes = get("victor_answer_votes");
  const total = get("total_votes");
  let html = question
    ? `\u2019s poll <strong>${esc(question)}</strong> has closed.`
    : "\u2019s poll has closed.";
  if (winner) {
    html += ` Winner: <strong>${esc(winner)}</strong>`;
    if (votes && total) html += ` (${esc(votes)} of ${esc(total)} votes)`;
  } else if (question) {
    html += " There was no winner.";
  }
  const name = esc(message.author.globalName || message.author.username);
  return { html: `<span class="discord-system-message-author">${name}</span>${html}`, withAuthor: false };
}

function groupMessages(messages: DiscordMessage[]): DiscordMessage[][] {
  const groups: DiscordMessage[][] = [];
  let current: DiscordMessage[] = [];

  for (const msg of messages) {
    if (current.length === 0) {
      current.push(msg);
      continue;
    }
    const prev = current[current.length - 1];
    const sameAuthor = prev.author.id === msg.author.id;
    const withinTimeout =
      new Date(msg.timestamp).getTime() - new Date(prev.timestamp).getTime() < 7 * 60 * 1000;
    const isRegular =
      (msg.type === 0 || msg.type === 19) && (prev.type === 0 || prev.type === 19);
    const noReply = !msg.referencedMessage && !msg.messageReference;

    const sameDay = isSameDay(prev.timestamp, msg.timestamp);

    if (sameAuthor && withinTimeout && isRegular && noReply && sameDay) {
      current.push(msg);
    } else {
      groups.push(current);
      current = [msg];
    }
  }
  if (current.length > 0) groups.push(current);
  return groups;
}

function isSameDay(a: string, b: string): boolean {
  return dayKey(new Date(a)) === dayKey(new Date(b));
}
