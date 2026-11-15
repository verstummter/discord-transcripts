# Contributing

Thanks for helping out. This is a small project, so the process is light.

## Setup

You need [Bun](https://bun.sh) and Node.js 20 or newer.

```bash
bun install
bun run typecheck
bun run build
```

## Project layout

```
src/
├── index.ts                 # Public API
├── lib/
│   ├── discord-adapter.ts   # discord.js bridge: fetching messages, roles, channels
│   ├── generator.ts         # HTML rendering (messages, embeds, attachments, components)
│   ├── markdown.ts          # Discord markdown → HTML, syntax highlighter
│   ├── media-resolver.ts    # Downloads media for offline transcripts (embedMedia)
│   └── transcript-css.ts    # Embedded stylesheet, dark and light themes
└── types/discord.ts         # Data types and options
docs/                        # Documentation content
website/                     # Docusaurus site that renders docs/
examples/                    # Runnable examples, used to verify changes
```

## Verifying a change

There is no automated test suite. Rendering changes are checked with the examples, which import the built package:

```bash
bun run build
bun run examples/markdown-stress-test.ts   # writes stress-test-*.html
bun run examples/showcase.ts               # writes showcase.html
```

Open the generated HTML files in a browser and check both the dark and light output.

When you add a feature or fix a rendering bug, add a message to `examples/markdown-stress-test.ts` that exercises it.

## Guidelines

- All user-supplied text goes through `esc()`, all URLs through `sanitizeUrl()`, and markdown output through the `sanitize-html` allowlist. Do not bypass these.
- Generated HTML must stay self-contained: no external scripts, fonts, or stylesheets.
- New colours need a CSS variable in both `.discord-dark` and `.discord-light`.
- Discord IDs in example data must be numeric strings.
- If you change options, types, or behaviour, update the matching page in `docs/`.

## Pull requests

Keep each pull request to one change, describe what it does and how you checked it, and make sure `bun run typecheck` and `bun run build` pass. CI runs both, plus the examples and the docs build.
