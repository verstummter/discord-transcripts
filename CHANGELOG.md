# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [1.3.0] - 2026-11-15

### Added

- CommonJS build alongside the ES module build, so `require("@getoeteter/discord-transcripts")` works.
- `locale` and `timeZone` options for dates, times, numbers, day separators, and the hourly activity chart.
- `enableThemeToggle` option: a button in the top bar that switches the open transcript between dark and light.
- Forwarded messages, through the new `messageSnapshots` field and automatically in `createTranscript`.
- `createTranscript` accepts threads, forum posts, announcement channels, and voice or stage channel chat, not only text channels.
- Markdown: numbered lists, `*` bullets, nested lists, and `-#` subtext.
- A test suite (`bun test`) covering the markdown parser, renderer, media resolver, and discord.js adapter.

### Changed

- Pagination controls now sit above the footer instead of below it, and changing page scrolls back to the top.
- Searching a paginated transcript searches every page; pagination returns when the search is cleared.
- The top bar drops the topic first, then the counts, as the window narrows.

### Fixed

- Heading styles were stripped by the sanitizer, so `#`, `##`, and `###` rendered at browser default sizes.
- The channel name could be covered by the search box at medium window widths.

### Security

- Development and docs-site dependencies with known vulnerabilities are pinned to fixed versions. Neither set is shipped to users of the package.

## [1.2.0] - 2026-11-15

The project is now open source.

### Changed

- Licensed under MIT (previously proprietary).
- The published JavaScript is no longer minified or obfuscated. The package now ships plain compiled output, source maps, declaration maps, and the TypeScript sources.
- The `discord.js` peer dependency range is now `^14.14.0`, the oldest version the adapter compiles against.
- `types` is listed before `import` in the package `exports`, so TypeScript resolves the declarations reliably.

### Added

- `repository`, `homepage`, and `bugs` links in the package metadata.
- `CONTRIBUTING.md`, `SECURITY.md`, and a CI workflow that typechecks, builds, runs the examples, and builds the docs site.

## [1.1.5] - 2026-11-15

### Changed

- Redesigned the transcript page chrome. The channel header, search box, and date navigation are now a single sticky top bar that also shows the server name and participant count.
- Search matches author names, embeds, polls, and file names as well as message text. Press `/` to focus it and `Esc` to clear it; an empty state is shown when nothing matches.
- Jump-to-date is a dropdown menu that closes on outside click or `Esc`.
- The statistics panel has summary tiles for messages, participants, attachments, and the busiest hour.
- Reply previews show the author's display name and link to the original message when it is part of the transcript.
- Thread indicators are rendered as a card, and the lightbox backdrop is blurred.
- Updated dependencies, including TypeScript 7 and `sanitize-html` 2.18.

### Added

- Back-to-top button that appears after scrolling.
- A brief highlight on the message targeted by a `#msg-<id>` link.

### Fixed

- URLs containing `__`, `*`, or `~~` were cut off and partly rendered as formatting.
- `<https://…>` links rendered with stray angle brackets, and trailing punctuation was included in auto-linked URLs.
- A masked link whose label was itself a URL produced an empty link followed by a wrong one.
- Asterisks surrounded by spaces (`5 * 3 = 15`) were italicised, and `@here` or `@everyone` inside an email address became a mention.
- Users on the new username system (discriminator `0`) all received the same default avatar, and a non-numeric user ID threw an error.
- The copy button lost its icon after the first use.
- Custom component renderers were ignored inside V2 containers and sections.
- Consecutive messages from one author that crossed midnight were grouped without a date separator.
- `embedMedia` skipped V2 file and thumbnail components.
- The hour chart in the statistics panel drew labelled and unlabelled bars at different baselines.
- Documentation referred to a `--dc-text-primary` CSS variable; the variable is `--dc-text-normal`.

### Security

- `embedMedia` now validates every redirect hop against the internal-network rules and blocks `127.0.0.0/8` and `*.localhost`.
- All `<` characters are escaped in the embedded JSON block produced by `includeJson`.

## Earlier versions

Versions 1.1.0 through 1.1.4 were published before this changelog was started.

[1.3.0]: https://github.com/verstummter/discord-transcripts/releases/tag/v1.3.0
[1.2.0]: https://github.com/verstummter/discord-transcripts/releases/tag/v1.2.0
[1.1.5]: https://www.npmjs.com/package/@getoeteter/discord-transcripts/v/1.1.5
