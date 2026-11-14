import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';

import styles from './index.module.css';

const installCode = `npm install @getoeteter/discord-transcripts`;

const usageCode = `import { createTranscript } from "@getoeteter/discord-transcripts";

const result = await createTranscript(channel, {
  theme: "dark",
  enableSearch: true,
});

await interaction.editReply({
  files: [{ attachment: result.buffer, name: result.filename }],
});`;

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <Heading as="h1" className={styles.heroTitle}>
              {siteConfig.title}
            </Heading>
            <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
            <p className={styles.heroDescription}>
              Self-contained HTML transcripts with embedded CSS, dark/light themes,
              polls, voice messages, search, and more. No external dependencies in the output.
            </p>
            <div className={styles.buttons}>
              <Link
                className="button button--primary button--lg"
                to="/docs/">
                Get Started
              </Link>
              <Link
                className="button button--outline button--lg"
                to="/docs/api-reference">
                API Reference
              </Link>
            </div>
            <div className={styles.installBlock}>
              <CodeBlock language="bash">{installCode}</CodeBlock>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Drop-in discord.js Support',
    icon: '🔌',
    description: (
      <>
        Pass a channel, get HTML back. Handles message fetching, role resolution,
        and member colors automatically.
      </>
    ),
  },
  {
    title: 'Fully Self-Contained',
    icon: '📦',
    description: (
      <>
        Output is a single HTML file with all CSS and JS baked in.
        No external fonts, scripts, or stylesheets. Just Discord CDN for media.
      </>
    ),
  },
  {
    title: 'Everything Discord Has',
    icon: '💬',
    description: (
      <>
        Embeds, polls, voice messages, threads, slash commands, reactions,
        stickers, components (V1 + V2), and 24+ syntax-highlighted languages.
      </>
    ),
  },
  {
    title: 'Dark & Light Themes',
    icon: '🎨',
    description: (
      <>
        Pixel-perfect Discord themes with full CSS variable support.
        Inject your own styles or swap out the font.
      </>
    ),
  },
  {
    title: 'Interactive Features',
    icon: '🔍',
    description: (
      <>
        Message search, date navigation, user stats, image lightbox,
        collapsible embeds, copy buttons, and pagination.
      </>
    ),
  },
  {
    title: 'Standalone Mode',
    icon: '🛠️',
    description: (
      <>
        Don't use discord.js? Pass your own data to <code>generateTranscriptHtml</code> and
        get the same output. Works with any data source.
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={styles.featureCard}>
      <div className={styles.featureIcon}>{icon}</div>
      <Heading as="h3">{title}</Heading>
      <p>{description}</p>
    </div>
  );
}

function HomepageCode() {
  return (
    <section className={styles.codeSection}>
      <div className="container">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <Heading as="h2" className="text--center">
              A few lines of code is all you need
            </Heading>
            <CodeBlock language="typescript" title="bot.ts">
              {usageCode}
            </CodeBlock>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featureGrid}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Discord Transcript Generator"
      description="Generate self-contained HTML transcripts from Discord channels. Supports embeds, polls, voice messages, themes, search, and more.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <HomepageCode />
      </main>
    </Layout>
  );
}
