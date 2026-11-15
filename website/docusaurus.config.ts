import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'discord-transcripts',
  tagline: 'Generate Discord chat transcripts with ease.',
  favicon: 'img/logo.svg',

  future: {
    v4: true,
    // Docusaurus 3.10+ turns on the Rspack/SWC "faster" pipeline with v4: true,
    // which needs the @docusaurus/faster package. Stay on the webpack pipeline.
    faster: false,
  },

  url: 'https://docs.boobs.rip',
  baseUrl: '/',

  organizationName: 'verstummter',
  projectName: 'discord-transcripts',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: '../docs',
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'discord-transcripts',
      logo: {
        alt: 'discord-transcripts logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/docs/api-reference',
          label: 'API',
          position: 'left',
        },
        {
          to: '/docs/examples',
          label: 'Examples',
          position: 'left',
        },
        {
          href: 'https://github.com/verstummter/discord-transcripts',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://www.npmjs.com/package/@getoeteter/discord-transcripts',
          label: 'npm',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Getting Started', to: '/docs/' },
            { label: 'API Reference', to: '/docs/api-reference' },
            { label: 'Options', to: '/docs/options' },
            { label: 'Types', to: '/docs/types' },
          ],
        },
        {
          title: 'Features',
          items: [
            { label: 'Discord Features', to: '/docs/features/discord-features' },
            { label: 'UI Features', to: '/docs/features/ui-features' },
            { label: 'Advanced', to: '/docs/features/advanced' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'Examples', to: '/docs/examples' },
            { label: 'Themes & Styling', to: '/docs/themes' },
            { label: 'Security', to: '/docs/security' },
            {
              label: 'GitHub',
              href: 'https://github.com/verstummter/discord-transcripts',
            },
            {
              label: 'npm',
              href: 'https://www.npmjs.com/package/@getoeteter/discord-transcripts',
            },
          ],
        },
      ],
      copyright: `Copyright \u00a9 ${new Date().getFullYear()} discord-transcripts`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['bash', 'json', 'typescript'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
