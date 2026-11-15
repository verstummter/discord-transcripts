export const TRANSCRIPT_CSS = `
.discord-dark {
  --dc-bg-primary: #313338;
  --dc-bg-secondary: #2b2d31;
  --dc-bg-tertiary: #1e1f22;
  --dc-bg-accent: #404249;
  --dc-bg-floating: #111214;
  --dc-bg-message-hover: rgba(0, 0, 0, 0.06);
  --dc-bg-mentioned: rgba(250, 166, 26, 0.08);
  --dc-bg-mentioned-border: #f0b232;
  --dc-text-normal: #dbdee1;
  --dc-text-muted: #949ba4;
  --dc-text-link: #00a8fc;
  --dc-text-header: #f2f3f5;
  --dc-text-header-secondary: #b5bac1;
  --dc-border-subtle: rgba(255, 255, 255, 0.06);
  --dc-border-faint: rgba(255, 255, 255, 0.04);
  --dc-bg-code: #2b2d31;
  --dc-bg-code-inline: rgba(255, 255, 255, 0.06);
  --dc-bg-embed: #2b2d31;
  --dc-bg-embed-border: rgba(255, 255, 255, 0.08);
  --dc-bg-spoiler: rgba(255, 255, 255, 0.1);
  --dc-bg-spoiler-hover: rgba(255, 255, 255, 0.16);
  --dc-bg-mention: rgba(88, 101, 242, 0.3);
  --dc-bg-mention-hover: rgba(88, 101, 242, 0.5);
  --dc-bg-reaction: rgba(255, 255, 255, 0.06);
  --dc-bg-reaction-hover: rgba(255, 255, 255, 0.12);
  --dc-accent-primary: #5865f2;
  --dc-green: #23a55a;
  --dc-red: #f23f43;
  --dc-yellow: #f0b232;
  --dc-bg-attachment: #2b2d31;
  --dc-bg-attachment-border: rgba(255, 255, 255, 0.08);
  --dc-bg-button-secondary: rgba(255, 255, 255, 0.1);
  --dc-bg-button-secondary-hover: rgba(255, 255, 255, 0.16);
  --dc-scrollbar-thumb: rgba(255, 255, 255, 0.16);
  --dc-scrollbar-track: transparent;
  --dc-shadow-low: 0 1px 0 rgba(0, 0, 0, 0.2), 0 1.5px 0 rgba(0, 0, 0, 0.05), 0 2px 0 rgba(0, 0, 0, 0.05);
  --dc-shadow-high: 0 8px 16px rgba(0, 0, 0, 0.24);
  --dc-bg-container: rgba(0, 0, 0, 0.2);
  --dc-bg-container-border: rgba(255, 255, 255, 0.1);
  --dc-channel-icon-bg: #5865f2;
}

.discord-light {
  --dc-bg-primary: #ffffff;
  --dc-bg-secondary: #f2f3f5;
  --dc-bg-tertiary: #e3e5e8;
  --dc-bg-accent: #e3e5e8;
  --dc-bg-floating: #ffffff;
  --dc-bg-message-hover: rgba(0, 0, 0, 0.03);
  --dc-bg-mentioned: rgba(250, 166, 26, 0.1);
  --dc-bg-mentioned-border: #f0b232;
  --dc-text-normal: #313338;
  --dc-text-muted: #5c5e66;
  --dc-text-link: #006ce7;
  --dc-text-header: #060607;
  --dc-text-header-secondary: #4e5058;
  --dc-border-subtle: rgba(0, 0, 0, 0.08);
  --dc-border-faint: rgba(0, 0, 0, 0.04);
  --dc-bg-code: rgba(0, 0, 0, 0.05);
  --dc-bg-code-inline: rgba(0, 0, 0, 0.07);
  --dc-bg-embed: #f2f3f5;
  --dc-bg-embed-border: rgba(0, 0, 0, 0.08);
  --dc-bg-spoiler: rgba(0, 0, 0, 0.12);
  --dc-bg-spoiler-hover: rgba(0, 0, 0, 0.06);
  --dc-bg-mention: rgba(88, 101, 242, 0.15);
  --dc-bg-mention-hover: rgba(88, 101, 242, 0.25);
  --dc-bg-reaction: rgba(0, 0, 0, 0.05);
  --dc-bg-reaction-hover: rgba(0, 0, 0, 0.1);
  --dc-accent-primary: #5865f2;
  --dc-green: #23a55a;
  --dc-red: #f23f43;
  --dc-yellow: #f0b232;
  --dc-bg-attachment: #f2f3f5;
  --dc-bg-attachment-border: rgba(0, 0, 0, 0.08);
  --dc-bg-button-secondary: rgba(0, 0, 0, 0.08);
  --dc-bg-button-secondary-hover: rgba(0, 0, 0, 0.12);
  --dc-scrollbar-thumb: rgba(0, 0, 0, 0.2);
  --dc-scrollbar-track: transparent;
  --dc-shadow-low: 0 1px 0 rgba(0, 0, 0, 0.06);
  --dc-shadow-high: 0 8px 16px rgba(0, 0, 0, 0.12);
  --dc-bg-container: rgba(0, 0, 0, 0.06);
  --dc-bg-container-border: rgba(0, 0, 0, 0.1);
  --dc-channel-icon-bg: #5865f2;
}

.discord-transcript {
  font-family: "gg sans", "Noto Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  font-size: 16px;
  line-height: 1.375;
  color: var(--dc-text-normal);
  background: var(--dc-bg-primary);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.discord-transcript *, .discord-transcript *::before, .discord-transcript *::after { box-sizing: border-box; }
.discord-transcript img { max-width: 100%; height: auto; }
.discord-transcript svg { display: inline-block; vertical-align: middle; }

.discord-transcript::-webkit-scrollbar { width: 8px; height: 8px; }
.discord-transcript::-webkit-scrollbar-thumb { background: var(--dc-scrollbar-thumb); border-radius: 100px; }
.discord-transcript::-webkit-scrollbar-track { background: var(--dc-scrollbar-track); }

.discord-channel-header {
  background: var(--dc-bg-secondary);
  border-bottom: 1px solid var(--dc-border-subtle);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--dc-shadow-low);
}

.discord-channel-header-inner {
  padding: 0 16px;
  min-height: 56px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.discord-channel-header-tools-only .discord-header-tools { flex: 1; }

.discord-channel-header-top {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.discord-guild-icon {
  border-radius: 8px;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  object-fit: cover;
}

.discord-guild-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--dc-text-header-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
  min-width: 0;
  flex-shrink: 0;
}

.discord-header-sep {
  display: flex;
  align-items: center;
  color: var(--dc-text-muted);
  opacity: 0.6;
  flex-shrink: 0;
  margin: 0 -4px;
}

.discord-channel-name {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  font-weight: 600;
  color: var(--dc-text-header);
  white-space: nowrap;
  flex-shrink: 0;
}

.discord-channel-icon {
  color: var(--dc-text-muted);
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.discord-channel-icon svg {
  width: 20px;
  height: 20px;
}

.discord-channel-topic {
  font-size: 13px;
  color: var(--dc-text-muted);
  margin-left: 8px;
  padding-left: 16px;
  border-left: 1px solid var(--dc-border-subtle);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  /* The topic gives up its space before the server or channel name does */
  flex-shrink: 1000;
}

.discord-header-tools {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.discord-transcript-meta {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--dc-text-muted);
  flex-shrink: 0;
  white-space: nowrap;
}

.discord-transcript-meta span {
  display: inline-flex;
  align-items: center;
}

.discord-transcript-meta span + span::before {
  content: "";
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.6;
  margin: 0 8px;
}

.discord-channel-beginning {
  padding: 40px 16px 8px;
  margin: 0;
}

.discord-channel-beginning-icon {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: var(--dc-channel-icon-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-bottom: 12px;
}

.discord-channel-beginning-icon svg {
  width: 42px;
  height: 42px;
}

.discord-channel-beginning-title {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--dc-text-header);
  margin: 0 0 8px;
  line-height: 1.25;
}

.discord-channel-beginning-topic {
  font-size: 15px;
  color: var(--dc-text-muted);
  margin: 0 0 6px;
  line-height: 1.4;
}

.discord-channel-beginning-subtitle {
  font-size: 14px;
  color: var(--dc-text-muted);
  margin: 0;
  line-height: 1.4;
}

.discord-date-separator {
  display: flex;
  align-items: center;
  margin: 24px 0 8px;
  padding: 0 14px;
  user-select: none;
}

.discord-date-separator-line {
  flex: 1;
  height: 1px;
  background: var(--dc-border-subtle);
}

.discord-date-separator-text {
  padding: 2px 12px;
  font-size: 12px;
  font-weight: 700;
  color: var(--dc-text-muted);
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.discord-messages {
  padding-bottom: 30px;
}

.discord-message {
  position: relative;
  padding: 2px 48px 2px 72px;
  min-height: 2.75rem;
  border-left: 2px solid transparent;
  transition: background-color 0.05s ease;
  scroll-margin-top: 72px;
}

.discord-date-separator { scroll-margin-top: 64px; }

.discord-message:target { animation: dc-target-flash 2.4s ease-out; }

@keyframes dc-target-flash {
  0%, 35% { background: var(--dc-bg-mention); }
  100% { background: transparent; }
}

.discord-reply-link {
  display: contents;
  color: inherit;
  text-decoration: none;
}

.discord-message:hover {
  background: var(--dc-bg-message-hover);
}

.discord-message-grouped {
  padding-top: 0;
  min-height: 1.375rem;
}

.discord-message:not(.discord-message-grouped) {
  padding-top: 1.0625rem;
}

.discord-message-pinned {
  background: var(--dc-bg-mentioned);
  border-left-color: var(--dc-bg-mentioned-border);
}

.discord-message-pinned:hover {
  background: var(--dc-bg-mentioned);
}

.discord-message-body {
  display: flex;
  align-items: flex-start;
}

.discord-message-avatar-container {
  position: absolute;
  left: 16px;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  margin-top: 2px;
  z-index: 1;
  cursor: pointer;
}

.discord-message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  transition: opacity 0.1s;
}

.discord-message-avatar:hover { opacity: 0.8; }

.discord-message-gutter {
  position: absolute;
  left: 0;
  width: 72px;
  text-align: right;
  padding-right: 4px;
  opacity: 0;
  transition: opacity 0.1s;
}

.discord-message:hover .discord-message-gutter { opacity: 1; }

.discord-message-timestamp-short {
  font-size: 11px;
  font-weight: 500;
  color: var(--dc-text-muted);
}

.discord-message-content-wrapper {
  flex: 1;
  min-width: 0;
  overflow-wrap: break-word;
  word-break: break-word;
}

.discord-message-header {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  flex-wrap: wrap;
  line-height: 1.375;
}

.discord-message-username {
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: inline;
  line-height: 1.375;
}

.discord-message-username:hover { text-decoration: underline; }

.discord-bot-badge {
  display: inline-flex;
  align-items: center;
  gap: 1px;
  font-size: 0.625rem;
  padding: 0 4px;
  height: 15px;
  line-height: 15px;
  border-radius: 3px;
  background: var(--dc-accent-primary);
  color: #fff;
  font-weight: 500;
  vertical-align: baseline;
  position: relative;
  top: -1px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  margin-left: 4px;
}

.discord-bot-badge-icon {
  display: inline-flex;
  align-items: center;
  margin-right: 1px;
}

.discord-pin-icon {
  color: var(--dc-text-muted);
  flex-shrink: 0;
  position: relative;
  top: 3px;
  display: inline-flex;
}

.discord-pin-icon svg {
  width: 16px;
  height: 16px;
}

.discord-message-timestamp {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--dc-text-muted);
  margin-left: 0.25rem;
  white-space: nowrap;
}

.discord-message-edited {
  font-size: 0.625rem;
  color: var(--dc-text-muted);
  user-select: none;
  cursor: default;
}

.discord-message-text {
  color: var(--dc-text-normal);
  line-height: 1.375rem;
  white-space: pre-wrap;
  font-size: 1rem;
}

.discord-message-text a { word-break: break-all; }

.discord-reply-context {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: var(--dc-text-muted);
  margin-bottom: 4px;
  padding-left: 72px;
  margin-left: -72px;
  position: relative;
}

.discord-reply-bar {
  position: absolute;
  left: 35px;
  top: 50%;
  width: 33px;
  height: 13px;
  border-left: 2px solid var(--dc-bg-accent);
  border-top: 2px solid var(--dc-bg-accent);
  border-top-left-radius: 6px;
}

.discord-reply-avatar {
  border-radius: 50%;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-left: 4px;
}

.discord-reply-username {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--dc-text-header-secondary);
  flex-shrink: 0;
  cursor: pointer;
}

.discord-reply-username:hover { text-decoration: underline; }

.discord-reply-content {
  font-size: 0.875rem;
  color: var(--dc-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.discord-reply-content:hover { color: var(--dc-text-normal); }

.discord-reply-deleted {
  font-style: italic;
  cursor: default;
}

.discord-reply-deleted:hover { color: var(--dc-text-muted); }

.discord-message.discord-system-message {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 48px 2px 72px;
  padding-top: 0.5rem;
  min-height: 26px;
}

.discord-system-message-icon {
  position: absolute;
  left: 16px;
  width: 40px;
  display: flex;
  justify-content: center;
  color: var(--dc-green);
}

.discord-system-message-icon svg {
  width: 18px;
  height: 18px;
}

.discord-system-message-content {
  font-size: 1rem;
  color: var(--dc-text-muted);
}

.discord-system-message-author {
  font-weight: 500;
  color: var(--dc-text-header);
  cursor: pointer;
}

.discord-system-message-author:hover { text-decoration: underline; }

.discord-link {
  color: var(--dc-text-link);
  text-decoration: none;
}

.discord-link:hover { text-decoration: underline; }

.discord-inline-code {
  padding: 0.2em 0.4em;
  font-size: 85%;
  background: var(--dc-bg-code-inline);
  border-radius: 4px;
  font-family: "Consolas", "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", Monaco, "Courier New", Courier, monospace;
  white-space: pre-wrap;
}

.discord-code-block {
  margin: 6px 0;
  padding: 8px 12px;
  background: var(--dc-bg-code);
  border: 1px solid var(--dc-border-subtle);
  border-radius: 4px;
  font-size: 0.875rem;
  line-height: 1.125rem;
  white-space: pre-wrap;
  overflow-x: auto;
  font-family: "Consolas", "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", Monaco, "Courier New", Courier, monospace;
}

.discord-code-block code {
  font-family: inherit;
  font-size: inherit;
  background: none;
  padding: 0;
}

/* ─── Syntax highlighting (dark theme) ─── */
.discord-dark .hljs-keyword { color: #f47fff; }
.discord-dark .hljs-built_in { color: #e2c17b; }
.discord-dark .hljs-string { color: #a8d4a2; }
.discord-dark .hljs-number { color: #d19a66; }
.discord-dark .hljs-literal { color: #d19a66; }
.discord-dark .hljs-comment { color: #6a737d; font-style: italic; }
.discord-dark .hljs-function { color: #61afef; }
.discord-dark .hljs-property { color: #e06c75; }
.discord-dark .hljs-variable { color: #e06c75; }
.discord-dark .hljs-decorator { color: #e2c17b; }
.discord-dark .hljs-meta { color: #c678dd; }
.discord-dark .hljs-tag { color: #e06c75; }
.discord-dark .hljs-attr { color: #d19a66; }
.discord-dark .hljs-selector { color: #e06c75; }
.discord-dark .hljs-symbol { color: #56b6c2; }
.discord-dark .hljs-macro { color: #56b6c2; }
.discord-dark .hljs-section { color: #61afef; font-weight: bold; }
.discord-dark .hljs-strong { font-weight: bold; }
.discord-dark .hljs-emphasis { font-style: italic; }
.discord-dark .hljs-code { color: #a8d4a2; }
.discord-dark .hljs-link { color: #61afef; }
.discord-dark .hljs-bullet { color: #d19a66; }
.discord-dark .hljs-addition { color: #a8d4a2; background: rgba(46, 160, 67, 0.15); }
.discord-dark .hljs-deletion { color: #e06c75; background: rgba(248, 81, 73, 0.15); }

/* ─── Syntax highlighting (light theme) ─── */
.discord-light .hljs-keyword { color: #a626a4; }
.discord-light .hljs-built_in { color: #c18401; }
.discord-light .hljs-string { color: #50a14f; }
.discord-light .hljs-number { color: #986801; }
.discord-light .hljs-literal { color: #986801; }
.discord-light .hljs-comment { color: #a0a1a7; font-style: italic; }
.discord-light .hljs-function { color: #4078f2; }
.discord-light .hljs-property { color: #e45649; }
.discord-light .hljs-variable { color: #e45649; }
.discord-light .hljs-decorator { color: #c18401; }
.discord-light .hljs-meta { color: #a626a4; }
.discord-light .hljs-tag { color: #e45649; }
.discord-light .hljs-attr { color: #986801; }
.discord-light .hljs-selector { color: #e45649; }
.discord-light .hljs-symbol { color: #0184bc; }
.discord-light .hljs-macro { color: #0184bc; }
.discord-light .hljs-section { color: #4078f2; font-weight: bold; }
.discord-light .hljs-strong { font-weight: bold; }
.discord-light .hljs-emphasis { font-style: italic; }
.discord-light .hljs-code { color: #50a14f; }
.discord-light .hljs-link { color: #4078f2; }
.discord-light .hljs-bullet { color: #986801; }
.discord-light .hljs-addition { color: #50a14f; background: rgba(46, 160, 67, 0.1); }
.discord-light .hljs-deletion { color: #e45649; background: rgba(248, 81, 73, 0.1); }

.discord-header {
  margin: 8px 0 4px;
  color: var(--dc-text-header);
  font-weight: 700;
}

h1.discord-header { font-size: 1.5rem; line-height: 1.3; }
h2.discord-header { font-size: 1.25rem; line-height: 1.3; }
h3.discord-header { font-size: 1rem; line-height: 1.3; }

.discord-blockquote {
  border-left: 4px solid var(--dc-bg-accent);
  padding: 0 8px 0 12px;
  margin: 2px 0;
}

.discord-list-item {
  margin-left: 16px;
  list-style: disc;
}

.discord-list .discord-list > .discord-list-item { list-style: circle; }

ol.discord-list > .discord-list-item,
.discord-list ol.discord-list > .discord-list-item {
  list-style: decimal;
  margin-left: 24px;
}

.discord-subtext {
  display: block;
  font-size: 0.8125rem;
  line-height: 1.25;
  color: var(--dc-text-muted);
}

.discord-forwarded {
  border-left: 4px solid var(--dc-bg-accent);
  padding: 0 8px 0 12px;
  margin: 2px 0;
}

.discord-forwarded-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8125rem;
  font-style: italic;
  color: var(--dc-text-muted);
  margin-bottom: 2px;
}

.discord-forwarded-footer {
  font-size: 0.75rem;
  color: var(--dc-text-muted);
  margin-top: 4px;
}

.discord-mention {
  background: var(--dc-bg-mention);
  color: var(--dc-accent-primary);
  border-radius: 3px;
  padding: 0 2px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.1s, color 0.1s;
}

.discord-mention:hover {
  background: var(--dc-bg-mention-hover);
  color: #fff;
}

.discord-role-mention:hover {
  filter: brightness(1.5);
  color: #fff !important;
}

.discord-mention-everyone { background: var(--dc-bg-mention); }

.discord-spoiler {
  background: var(--dc-bg-spoiler);
  color: transparent;
  border-radius: 3px;
  padding: 0 2px;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
}

.discord-spoiler.revealed {
  background: var(--dc-bg-spoiler-hover);
  color: var(--dc-text-normal);
}

.discord-timestamp {
  background: var(--dc-bg-accent);
  border-radius: 3px;
  padding: 0 2px;
  font-size: 0.875rem;
  white-space: nowrap;
}

.discord-custom-emoji {
  width: 22px;
  height: 22px;
  vertical-align: -0.4em;
  object-fit: contain;
  display: inline;
}

.discord-embeds {
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.discord-embed {
  background: var(--dc-bg-embed);
  border: 1px solid var(--dc-bg-embed-border);
  border-left: 4px solid var(--dc-border-subtle);
  border-radius: 8px;
  padding: 12px 16px 12px 12px;
  max-width: 520px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  overflow: hidden;
}

.discord-embed-author {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.discord-embed-author-icon {
  border-radius: 50%;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
}

.discord-embed-author-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--dc-text-header);
}

.discord-embed-title {
  grid-column: 1 / 2;
  font-size: 1rem;
  font-weight: 600;
  color: var(--dc-text-header);
  margin-bottom: 4px;
}

.discord-embed-title .discord-link { color: var(--dc-text-link); }

.discord-embed-description {
  grid-column: 1 / 2;
  font-size: 0.875rem;
  color: var(--dc-text-normal);
  line-height: 1.375rem;
  white-space: pre-wrap;
}

.discord-embed-fields {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 8px;
}

.discord-embed-field { grid-column: 1 / -1; }
.discord-embed-field-inline { grid-column: span 1; }

.discord-embed-field-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--dc-text-header);
  margin-bottom: 2px;
}

.discord-embed-field-value {
  font-size: 0.875rem;
  color: var(--dc-text-normal);
  line-height: 1.375rem;
  white-space: pre-wrap;
}

.discord-embed-thumbnail {
  grid-column: 2 / 3;
  grid-row: 1 / 5;
  align-self: start;
  justify-self: end;
}

.discord-embed-thumbnail-img {
  max-width: 80px;
  max-height: 80px;
  border-radius: 4px;
  object-fit: cover;
}

.discord-embed-image {
  grid-column: 1 / -1;
  margin-top: 8px;
}

.discord-embed-image-img {
  border-radius: 4px;
  max-width: 100%;
  height: auto;
}

.discord-embed-video {
  grid-column: 1 / -1;
  margin-top: 8px;
}

.discord-embed-footer {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.discord-embed-footer-icon {
  border-radius: 50%;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.discord-embed-footer-text {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--dc-text-muted);
}

.discord-embed-footer-separator {
  font-size: 0.75rem;
  color: var(--dc-text-muted);
}

.discord-attachments {
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.discord-attachment-image {
  border-radius: 8px;
  overflow: hidden;
  display: inline-block;
}

.discord-attachment-img {
  border-radius: 8px;
  display: block;
  cursor: pointer;
  max-height: 350px;
  object-fit: contain;
}

.discord-spoiler-attachment {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border-radius: 8px;
  display: inline-block;
}

.discord-spoiler-attachment img,
.discord-spoiler-attachment video {
  filter: blur(44px);
  transition: filter 0.3s;
  display: block;
  max-height: 350px;
  object-fit: contain;
}

.discord-spoiler-attachment .discord-spoiler-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  background: rgba(0, 0, 0, 0.4);
  transition: opacity 0.3s;
}

.discord-spoiler-attachment .discord-spoiler-overlay span {
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  pointer-events: none;
}

.discord-spoiler-attachment.revealed img,
.discord-spoiler-attachment.revealed video {
  filter: none;
}

.discord-spoiler-attachment.revealed .discord-spoiler-overlay {
  opacity: 0;
  pointer-events: none;
}

.discord-attachment-alt {
  font-size: 12px;
  color: var(--dc-text-muted);
  margin-top: 4px;
}

.discord-attachment-video-player {
  border-radius: 8px;
  max-height: 350px;
}

.discord-attachment-audio-container {
  background: var(--dc-bg-attachment);
  border: 1px solid var(--dc-bg-attachment-border);
  border-radius: 8px;
  padding: 12px 16px;
  max-width: 400px;
}

.discord-attachment-audio-player {
  width: 100%;
  max-width: 360px;
  margin-top: 8px;
}

.discord-attachment-file { max-width: 432px; }

.discord-attachment-file-container {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--dc-bg-attachment);
  border: 1px solid var(--dc-bg-attachment-border);
  border-radius: 8px;
  padding: 12px 16px;
  transition: background 0.1s;
}

.discord-attachment-file-container:hover {
  background: var(--dc-bg-message-hover);
}

.discord-attachment-file-icon {
  color: var(--dc-accent-primary);
  flex-shrink: 0;
  display: flex;
}

.discord-attachment-file-icon svg {
  width: 24px;
  height: 24px;
}

.discord-attachment-file-info {
  flex: 1;
  min-width: 0;
}

.discord-attachment-file-name {
  font-size: 1rem;
  font-weight: 500;
  color: var(--dc-text-link);
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.discord-attachment-file-name:hover { text-decoration: underline; }

.discord-attachment-file-size {
  font-size: 0.75rem;
  color: var(--dc-text-muted);
  margin-top: 2px;
}

.discord-attachment-download {
  color: var(--dc-text-muted);
  transition: color 0.15s;
  flex-shrink: 0;
  display: flex;
}

.discord-attachment-download svg {
  width: 20px;
  height: 20px;
}

.discord-attachment-download:hover { color: var(--dc-text-normal); }

.discord-reactions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.discord-reaction {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--dc-bg-reaction);
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.1s, border-color 0.1s;
  user-select: none;
}

.discord-reaction:hover {
  background: var(--dc-bg-reaction-hover);
  border-color: var(--dc-border-subtle);
}

.discord-reaction-count {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--dc-text-muted);
  min-width: 9px;
  text-align: center;
}

.discord-reaction-emoji-custom {
  width: 18px;
  height: 18px;
}

.discord-reaction-emoji-unicode {
  font-size: 1rem;
  line-height: 1;
}

.discord-component-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.discord-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 2px 16px;
  min-width: 60px;
  min-height: 32px;
  border-radius: 3px;
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.17s ease, filter 0.17s ease;
  border: none;
  white-space: nowrap;
  user-select: none;
}

.discord-button-primary {
  background: var(--dc-accent-primary);
  color: #fff;
}

.discord-button-primary:hover { background: #4752c4; }

.discord-button-secondary {
  background: var(--dc-bg-button-secondary);
  color: var(--dc-text-normal);
}

.discord-button-secondary:hover { background: var(--dc-bg-button-secondary-hover); }

.discord-button-success {
  background: var(--dc-green);
  color: #fff;
}

.discord-button-success:hover { background: #1a8b4d; }

.discord-button-danger {
  background: var(--dc-red);
  color: #fff;
}

.discord-button-danger:hover { background: #d83c3e; }

.discord-button-link {
  background: var(--dc-bg-button-secondary);
  color: var(--dc-text-normal);
}

.discord-button-link:hover { background: var(--dc-bg-button-secondary-hover); }

.discord-button-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.discord-button-emoji {
  width: 22px;
  height: 22px;
  line-height: 1;
  object-fit: contain;
}

.discord-select {
  background: var(--dc-bg-button-secondary);
  border-radius: 4px;
  padding: 8px 36px 8px 12px;
  color: var(--dc-text-muted);
  font-size: 0.875rem;
  min-width: 200px;
  max-width: 400px;
  transition: background 0.1s;
  cursor: pointer;
}

.discord-select:hover { background: var(--dc-bg-button-secondary-hover); }

.discord-v2-container {
  margin-top: 8px;
  background: var(--dc-bg-container);
  border: 1px solid var(--dc-bg-container-border);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 520px;
  overflow: hidden;
}

.discord-v2-container.discord-v2-spoiler {
  position: relative;
  cursor: pointer;
}

.discord-v2-container.discord-v2-spoiler > *:not(.discord-spoiler-overlay) {
  filter: blur(10px);
  transition: filter 0.2s;
}

.discord-v2-container.discord-v2-spoiler > .discord-spoiler-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  transition: opacity 0.3s;
}

.discord-v2-container.discord-v2-spoiler > .discord-spoiler-overlay span {
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  pointer-events: none;
}

.discord-v2-container.discord-v2-spoiler.revealed > *:not(.discord-spoiler-overlay) { filter: none; }
.discord-v2-container.discord-v2-spoiler.revealed > .discord-spoiler-overlay { opacity: 0; pointer-events: none; }

.discord-v2-section {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.discord-v2-section-accessory {
  flex-shrink: 0;
  margin-left: auto;
}

.discord-v2-thumbnail-img {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  object-fit: cover;
}

.discord-v2-text-display {
  font-size: 14px;
  line-height: 1.375;
  color: var(--dc-text-normal);
  word-wrap: break-word;
  overflow-wrap: break-word;
  min-width: 0;
  flex: 1;
}

.discord-v2-text-display p { margin: 0; }

.discord-v2-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--dc-text-muted);
  letter-spacing: 0.02em;
}

.discord-v2-separator {
  margin: 8px 0;
  height: 0;
}

.discord-v2-separator-large { margin: 16px 0; }

.discord-v2-separator-divider {
  border-top: 1px solid var(--dc-border-subtle);
}

.discord-v2-media-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 4px;
  margin-top: 4px;
  border-radius: 8px;
  overflow: hidden;
}

.discord-v2-media-gallery-single {
  grid-template-columns: 1fr;
}

.discord-v2-media-item {
  overflow: hidden;
}

.discord-v2-media-item.discord-v2-spoiler {
  position: relative;
  cursor: pointer;
}

.discord-v2-media-item.discord-v2-spoiler > img {
  filter: blur(44px);
  transition: filter 0.2s;
}

.discord-v2-media-item.discord-v2-spoiler > .discord-spoiler-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  background: rgba(0, 0, 0, 0.4);
  transition: opacity 0.3s;
}

.discord-v2-media-item.discord-v2-spoiler > .discord-spoiler-overlay span {
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  pointer-events: none;
}

.discord-v2-media-item.discord-v2-spoiler.revealed > img { filter: none; }
.discord-v2-media-item.discord-v2-spoiler.revealed > .discord-spoiler-overlay { opacity: 0; pointer-events: none; }

.discord-v2-media-img {
  width: 100%;
  display: block;
}

.discord-v2-file {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--dc-bg-attachment);
  border: 1px solid var(--dc-bg-attachment-border);
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 4px;
  max-width: 400px;
}

.discord-v2-file-icon {
  flex-shrink: 0;
  display: flex;
  color: var(--dc-text-muted);
}

.discord-v2-file-icon svg {
  width: 20px;
  height: 20px;
}

.discord-v2-file-name {
  color: var(--dc-text-link);
  font-size: 0.875rem;
  word-break: break-all;
}

.discord-v2-file-name:hover { text-decoration: underline; }

.discord-v2-thumbnail {
  margin-top: 4px;
}

.discord-stickers {
  margin-top: 4px;
  display: flex;
  gap: 4px;
}

.discord-sticker-img {
  width: 160px;
  height: 160px;
  object-fit: contain;
}

.discord-sticker-placeholder {
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--dc-bg-accent);
  border-radius: 8px;
  color: var(--dc-text-muted);
  font-size: 0.875rem;
}

.discord-thread-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  max-width: 100%;
  margin-top: 8px;
  padding: 8px 12px;
  background: var(--dc-bg-secondary);
  border: 1px solid var(--dc-border-subtle);
  border-radius: 8px;
}

.discord-thread-icon {
  color: var(--dc-text-muted);
  display: flex;
}

.discord-thread-icon svg {
  width: 16px;
  height: 16px;
}

.discord-thread-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--dc-text-link);
}

.discord-thread-name:hover { text-decoration: underline; }

.discord-thread-count {
  font-size: 0.75rem;
  color: var(--dc-text-muted);
}

.discord-transcript-footer {
  text-align: center;
  padding: 24px 16px 40px;
  font-size: 0.75rem;
  color: var(--dc-text-muted);
  border-top: 1px solid var(--dc-border-subtle);
  margin-top: 16px;
}

.discord-to-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 90;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--dc-bg-floating);
  color: var(--dc-text-header-secondary);
  border: 1px solid var(--dc-border-subtle);
  box-shadow: var(--dc-shadow-high);
  opacity: 0;
  visibility: hidden;
  transform: translateY(8px);
  transition: opacity 0.15s, transform 0.15s, visibility 0.15s, color 0.15s;
}
.discord-to-top.visible { opacity: 1; visibility: visible; transform: none; }
.discord-to-top:hover { color: var(--dc-text-header); }
.discord-to-top svg { width: 20px; height: 20px; transform: rotate(-90deg); }

.discord-compact .discord-message {
  padding-left: 16px;
  min-height: 22px;
}

.discord-compact .discord-message-avatar-container { display: none; }

.discord-compact .discord-message-gutter {
  position: static;
  width: auto;
  opacity: 1;
  margin-right: 8px;
}

.discord-compact .discord-message-header { display: inline; }
.discord-compact .discord-message-username { font-size: 0.875rem; }
.discord-compact .discord-message-text { display: inline; }

.discord-compact .discord-reply-context {
  margin-left: 0;
  padding-left: 16px;
}

@media (max-width: 1100px) {
  .discord-transcript-meta { display: none; }
}

@media (max-width: 900px) {
  .discord-guild-name { flex-shrink: 1; }
}

@media (max-width: 768px) {
  .discord-channel-header-inner {
    padding: 8px 12px;
    flex-wrap: wrap;
    gap: 8px;
  }

  .discord-transcript-meta { display: none; }
  .discord-channel-topic { display: none; }
  .discord-guild-name, .discord-header-sep { display: none; }
  .discord-header-tools { flex: 1 1 100%; }
  .discord-search-bar { flex: 1; width: auto; }
  .discord-search-bar:focus-within { width: auto; }
  .discord-search-kbd { display: none; }
  .discord-date-nav-toggle span:not(.discord-date-nav-chevron) { display: none; }
  .discord-to-top { right: 12px; bottom: 12px; }

  .discord-message {
    padding-left: 56px;
    padding-right: 12px;
  }

  .discord-message-avatar-container { left: 10px; }

  .discord-message-avatar {
    width: 32px;
    height: 32px;
  }

  .discord-embed,
  .discord-v2-container { max-width: 100%; }

  .discord-attachment-file { max-width: 100%; }

  .discord-embed-fields { grid-template-columns: 1fr; }
  .discord-embed-field-inline { grid-column: 1 / -1; }

  .discord-channel-beginning-title { font-size: 1.5rem; }

  .discord-channel-beginning-icon {
    width: 56px;
    height: 56px;
  }
  .discord-channel-beginning-icon svg {
    width: 28px;
    height: 28px;
  }
}

@media (max-width: 480px) {
  .discord-transcript { font-size: 14px; }

  .discord-message { padding-left: 48px; }

  .discord-message-avatar {
    width: 28px;
    height: 28px;
  }

  .discord-channel-beginning-icon {
    width: 48px;
    height: 48px;
  }
  .discord-channel-beginning-icon svg {
    width: 24px;
    height: 24px;
  }
}

@media print {
  .discord-transcript { min-height: auto; }
  .discord-channel-header { position: static; box-shadow: none; }
  .discord-header-tools, .discord-to-top, .discord-search-empty, .discord-pagination { display: none !important; }
  .discord-message:hover { background: transparent; }
  .discord-spoiler { color: var(--dc-text-normal); background: var(--dc-bg-spoiler-hover); }
}

/* ─── Polls ─── */

.discord-poll {
  background: var(--dc-bg-secondary);
  border: 1px solid var(--dc-border-subtle);
  border-radius: 8px;
  padding: 16px;
  margin-top: 8px;
  max-width: 480px;
}
.discord-poll-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 15px;
  color: var(--dc-text-header);
  margin-bottom: 12px;
}
.discord-poll-header svg { flex-shrink: 0; }
.discord-poll-question { flex: 1; }
.discord-poll-multi {
  font-size: 11px;
  font-weight: 400;
  color: var(--dc-text-muted);
  background: var(--dc-bg-accent);
  padding: 2px 6px;
  border-radius: 4px;
}
.discord-poll-answer {
  margin-bottom: 8px;
  border-radius: 6px;
  padding: 8px 12px;
  background: var(--dc-bg-primary);
  border: 1px solid var(--dc-border-subtle);
  transition: border-color 0.15s;
}
.discord-poll-answer-winner { border-color: var(--dc-green); }
.discord-poll-answer-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--dc-text-normal);
  margin-bottom: 6px;
}
.discord-poll-emoji { flex-shrink: 0; vertical-align: middle; }
.discord-poll-bar-container {
  height: 6px;
  background: var(--dc-bg-accent);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}
.discord-poll-bar {
  height: 100%;
  background: var(--dc-accent-primary);
  border-radius: 3px;
  transition: width 0.3s ease;
}
.discord-poll-answer-winner .discord-poll-bar { background: var(--dc-green); }
.discord-poll-answer-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--dc-text-muted);
}
.discord-poll-footer {
  margin-top: 8px;
  font-size: 12px;
  color: var(--dc-text-muted);
  text-align: center;
  padding-top: 8px;
  border-top: 1px solid var(--dc-border-subtle);
}

/* ─── Interaction Context (Slash Commands) ─── */

.discord-interaction-context {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  padding: 2px 0 2px 72px;
  margin-left: -72px;
  color: var(--dc-text-muted);
  position: relative;
}
.discord-interaction-user { font-weight: 500; color: var(--dc-text-normal); }
.discord-interaction-label { color: var(--dc-text-muted); }
.discord-interaction-command {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  color: var(--dc-text-link);
  font-weight: 500;
}
.discord-interaction-command svg { opacity: 0.7; }
.discord-compact .discord-interaction-context { padding-left: 60px; margin-left: -60px; }

/* ─── Voice Message ─── */

.discord-voice-message {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--dc-bg-secondary);
  border-radius: 22px;
  padding: 8px 16px 8px 10px;
  margin-top: 4px;
  max-width: 340px;
  border: 1px solid var(--dc-border-subtle);
}
.discord-voice-play {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--dc-accent-primary);
  color: #fff;
  font-size: 14px;
  flex-shrink: 0;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  border: none;
  transition: background 0.15s ease;
}
.discord-voice-play:hover { filter: brightness(1.1); }
.discord-voice-audio { display: none; }
.discord-voice-waveform {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
  height: 32px;
  overflow: hidden;
}
.discord-voice-bar {
  width: 3px;
  background: var(--dc-accent-primary);
  border-radius: 2px;
  opacity: 0.6;
  flex-shrink: 0;
}
.discord-voice-duration {
  font-size: 12px;
  color: var(--dc-text-muted);
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}

/* ─── AutoMod ─── */

.discord-automod-label {
  font-weight: 600;
  color: var(--dc-accent-primary);
}

/* ─── Search Bar ─── */

.discord-search-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 220px;
  height: 32px;
  padding: 0 8px 0 10px;
  background: var(--dc-bg-tertiary);
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: text;
  transition: width 0.2s ease, border-color 0.15s;
}
.discord-search-bar:focus-within { width: 300px; border-color: var(--dc-accent-primary); }
.discord-search-icon { display: flex; color: var(--dc-text-muted); flex-shrink: 0; }
.discord-search-input {
  flex: 1;
  min-width: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--dc-text-normal);
  font-size: 14px;
  font-family: inherit;
  outline: none;
}
.discord-search-input::placeholder { color: var(--dc-text-muted); }
.discord-search-count {
  font-size: 12px;
  color: var(--dc-text-muted);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.discord-search-kbd {
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  line-height: 18px;
  min-width: 18px;
  text-align: center;
  padding: 0 4px;
  border-radius: 4px;
  color: var(--dc-text-muted);
  background: var(--dc-bg-reaction);
  border: 1px solid var(--dc-border-subtle);
  flex-shrink: 0;
}
.discord-search-bar:focus-within .discord-search-kbd,
.discord-search-bar.has-query .discord-search-kbd { display: none; }
.discord-search-hidden { display: none !important; }
.discord-search-highlight { background: rgba(88, 101, 242, 0.08) !important; }
.discord-search-empty {
  display: none;
  text-align: center;
  padding: 48px 16px 64px;
  font-size: 14px;
  color: var(--dc-text-muted);
}
.discord-search-empty-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 12px;
  border-radius: 50%;
  background: var(--dc-bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}
.discord-search-empty-icon svg { width: 24px; height: 24px; }
.discord-search-empty-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--dc-text-header);
  margin-bottom: 4px;
}

/* ─── Date Navigation ─── */

.discord-date-nav { position: relative; }
.discord-date-nav-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 8px 0 10px;
  background: var(--dc-bg-tertiary);
  border: 1px solid transparent;
  border-radius: 8px;
  color: var(--dc-text-header-secondary);
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  transition: color 0.15s, border-color 0.15s;
}
.discord-date-nav-toggle:hover { color: var(--dc-text-header); }
.discord-date-nav-toggle.open { border-color: var(--dc-accent-primary); color: var(--dc-text-header); }
.discord-date-nav-toggle:focus-visible { outline: 2px solid var(--dc-accent-primary); outline-offset: 2px; }
.discord-date-nav-chevron { display: flex; }
.discord-date-nav-chevron svg { width: 14px; height: 14px; transform: rotate(90deg); transition: transform 0.2s; }
.discord-date-nav-toggle.open .discord-date-nav-chevron svg { transform: rotate(-90deg); }
.discord-date-nav-list {
  display: none;
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 100%;
  padding: 6px;
  background: var(--dc-bg-floating);
  border: 1px solid var(--dc-border-subtle);
  border-radius: 8px;
  max-height: min(400px, 70vh);
  overflow-y: auto;
  box-shadow: var(--dc-shadow-high);
  z-index: 110;
}
.discord-date-nav-list.open { display: block; }
.discord-date-nav-item {
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 13px;
  color: var(--dc-text-header-secondary);
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.1s, color 0.1s;
}
.discord-date-nav-item:hover { background: var(--dc-accent-primary); color: #fff; }

/* ─── Theme Toggle ─── */

.discord-theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: var(--dc-bg-tertiary);
  border: 1px solid transparent;
  border-radius: 8px;
  color: var(--dc-text-header-secondary);
  cursor: pointer;
  transition: color 0.15s;
}
.discord-theme-toggle:hover { color: var(--dc-text-header); }
.discord-theme-toggle:focus-visible { outline: 2px solid var(--dc-accent-primary); outline-offset: 2px; }
.discord-theme-toggle span { display: flex; }
.discord-dark .discord-theme-icon-moon,
.discord-light .discord-theme-icon-sun { display: none; }

/* ─── User Statistics ─── */

.discord-user-stats {
  margin: 24px 16px;
  padding: 20px;
  background: var(--dc-bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--dc-border-subtle);
}
.discord-stats-header {
  font-size: 18px;
  font-weight: 700;
  color: var(--dc-text-header);
  margin-bottom: 16px;
}
.discord-stats-tiles {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}
.discord-stats-tile {
  padding: 12px 16px;
  background: var(--dc-bg-primary);
  border: 1px solid var(--dc-border-subtle);
  border-radius: 8px;
  min-width: 0;
}
.discord-stats-tile-value {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--dc-text-header);
  font-variant-numeric: tabular-nums;
}
.discord-stats-tile-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--dc-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  margin-top: 2px;
}
.discord-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}
@media (max-width: 700px) {
  .discord-stats-grid { grid-template-columns: 1fr; }
  .discord-stats-tiles { grid-template-columns: repeat(2, 1fr); }
}
.discord-stats-section { min-width: 0; }
.discord-stats-section-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--dc-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  margin-bottom: 12px;
}
.discord-stats-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 0;
}
.discord-stats-rank {
  width: 24px;
  font-size: 12px;
  color: var(--dc-text-muted);
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}
.discord-stats-avatar {
  display: block;
  border-radius: 50%;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  object-fit: cover;
}
.discord-stats-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--dc-text-normal);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 120px;
  flex-shrink: 0;
}
.discord-stats-bar-container {
  flex: 1;
  height: 8px;
  background: var(--dc-bg-accent);
  border-radius: 4px;
  overflow: hidden;
}
.discord-stats-bar {
  height: 100%;
  background: var(--dc-accent-primary);
  border-radius: 4px;
}
.discord-stats-count {
  font-size: 13px;
  color: var(--dc-text-muted);
  width: 40px;
  text-align: right;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}
.discord-stats-hours {
  display: flex;
  gap: 3px;
}
.discord-stats-hour {
  flex: 1;
  min-width: 0;
}
.discord-stats-hour-track {
  height: 64px;
  display: flex;
  align-items: flex-end;
  border-bottom: 1px solid var(--dc-border-subtle);
}
.discord-stats-hour-bar {
  width: 100%;
  background: var(--dc-accent-primary);
  border-radius: 3px 3px 0 0;
  opacity: 0.55;
}
.discord-stats-hour.peak .discord-stats-hour-bar { opacity: 1; }
.discord-stats-hour.empty .discord-stats-hour-bar { background: var(--dc-bg-accent); opacity: 1; border-radius: 0; }
.discord-stats-hour-label {
  display: block;
  height: 14px;
  margin-top: 4px;
  font-size: 10px;
  line-height: 14px;
  color: var(--dc-text-muted);
  white-space: nowrap;
}

/* ─── Copy Button ─── */

.discord-copy-btn {
  display: none;
  margin-left: 8px;
  cursor: pointer;
  color: var(--dc-text-muted);
  opacity: 0.6;
  transition: opacity 0.15s;
  vertical-align: middle;
}
.discord-copy-btn:hover { opacity: 1; }
.discord-message:hover .discord-copy-btn { display: inline; }

/* ─── Collapsible Embeds ─── */

.discord-embed-collapse {
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
  color: var(--dc-text-muted);
  line-height: 1;
  opacity: 0;
  transition: opacity 0.15s, transform 0.15s;
  z-index: 1;
}
.discord-embed-collapse svg { width: 12px; height: 12px; }
.discord-embed.collapsed .discord-embed-collapse svg { transform: rotate(-90deg); }
.discord-embed { position: relative; }
.discord-embed:hover .discord-embed-collapse { opacity: 1; }
.discord-embed.collapsed .discord-embed-description,
.discord-embed.collapsed .discord-embed-fields,
.discord-embed.collapsed .discord-embed-image,
.discord-embed.collapsed .discord-embed-thumbnail,
.discord-embed.collapsed .discord-embed-video,
.discord-embed.collapsed .discord-embed-footer { display: none; }

/* ─── Image Lightbox ─── */

.discord-lightbox {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 1000;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
}
.discord-lightbox.active { display: flex; }
.discord-lightbox-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);
  cursor: zoom-out;
}
.discord-lightbox-img {
  position: relative;
  z-index: 1;
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 4px;
}
.discord-lightbox-link {
  position: relative;
  z-index: 1;
  color: var(--dc-text-link);
  font-size: 13px;
  text-decoration: underline;
}

/* ─── Pagination ─── */

.discord-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid var(--dc-border-subtle);
}
.discord-page-btn {
  padding: 6px 16px;
  border: 1px solid var(--dc-border-subtle);
  border-radius: 8px;
  background: var(--dc-bg-secondary);
  color: var(--dc-text-normal);
  font-size: 14px;
  cursor: pointer;
  font-family: inherit;
}
.discord-page-btn:hover:not(:disabled) { background: var(--dc-bg-accent); }
.discord-page-btn:disabled { opacity: 0.4; cursor: default; }
.discord-page-info {
  font-size: 13px;
  color: var(--dc-text-muted);
  font-variant-numeric: tabular-nums;
}

/* ─── Thread Expansion ─── */

.discord-thread-expand { margin-top: 4px; }
.discord-thread-expand-toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--dc-text-link);
  cursor: pointer;
  padding: 4px 0;
  user-select: none;
}
.discord-thread-expand-toggle svg {
  width: 10px;
  height: 10px;
  transition: transform 0.15s;
}
.discord-thread-expand.expanded .discord-thread-expand-toggle svg {
  transform: rotate(90deg);
}
.discord-thread-expand-content {
  display: none;
  border-left: 2px solid var(--dc-border-subtle);
  padding-left: 16px;
  margin-top: 4px;
}
.discord-thread-expand.expanded .discord-thread-expand-content { display: block; }

/* ─── Sticker improvements ─── */

.discord-sticker-placeholder {
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--dc-bg-secondary);
  border: 1px solid var(--dc-border-subtle);
  border-radius: 8px;
  color: var(--dc-text-muted);
  font-size: 13px;
}
`;