/**
 * generate-ai-ingest.ts
 *
 * Build-time script that syncs the Content Layer (/src/content/) to clean
 * Markdown files in /public/ai-ingest/ and writes /public/llms.txt
 * and /public/llms-full.txt.
 *
 * Run: npx tsx scripts/generate-ai-ingest.ts
 * Hooked into: "build" and "dev" via package.json
 */

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// ─── Content Layer Imports (single source of truth) ─────────────────────────
import { SITE_URL, SITE_NAME, SITE_EMAIL, ORG } from "../src/content/site";
import { HERO_BODY, HERO_CHATGPT_STAT, HERO_STAT } from "../src/content/hero";
import {
  VALUE_PROP_COUNTER_TARGET,
  VALUE_PROP_BODY,
} from "../src/content/value-prop";
import { features } from "../src/content/features";
import {
  tiers,
  MONTHLY_SUBSCRIPTION,
  MONTHLY_SUBSCRIPTION_DESC,
} from "../src/content/pricing";
import { industries } from "../src/content/industries";
import { faqs } from "../src/content/faq";
import {
  featuredArticle,
  featuredLearnings,
  articles,
} from "../src/content/insights";
import { CONTACT_BODY } from "../src/content/contact";
import { FREE_SCAN_URL } from "../src/content/site";

// ─── Paths ──────────────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");
const INGEST = join(PUBLIC, "ai-ingest");
const GENERATED = `<!-- Auto-generated from /src/content/ by scripts/generate-ai-ingest.ts — do not edit by hand -->`;

mkdirSync(INGEST, { recursive: true });

// ─── Generators ─────────────────────────────────────────────────────────────

function generateIndex(): string {
  return `${GENERATED}

# ${SITE_NAME} — AI-Friendly Web Design

> ${ORG.description}

## What ${SITE_NAME} Does

${HERO_BODY[0]}

${HERO_BODY[1]}

## The Problem

${HERO_CHATGPT_STAT}

${HERO_STAT.target}% ${HERO_STAT.label.toLowerCase()} (${HERO_STAT.source}).

## ${VALUE_PROP_COUNTER_TARGET} Million Weekly ChatGPT Users — Is Your Data Verified?

${VALUE_PROP_BODY.join("\n\n")}

## Why ${SITE_NAME}

${features.map((f) => `### ${f.title}\n\n${f.desc}`).join("\n\n")}

## Contact

${CONTACT_BODY}

- Email: ${SITE_EMAIL}
- Free AI Scan: https://geo-check.org/lander
- Starting at ${tiers[0].price}
`;
}

function generatePricing(): string {
  const rows = tiers
    .map((t) => `| ${t.label} | ${t.name} | ${t.price} | ${t.desc} |`)
    .join("\n");

  return `${GENERATED}

# Pricing Structures

Verified datasets pushed to 19 platforms. All tiers require a ${MONTHLY_SUBSCRIPTION} data subscription.

## Plans

| Tier | Name | Price | What You Get |
| ---- | ---- | ----- | ------------ |
${rows}

## What Every Tier Includes

- AI-ready website with semantic HTML
- Schema markup for structured data
- Verified AI Training Document
- Push to 19 AI platforms
- Ghost Score before and after launch

## Monthly Data Subscription — ${MONTHLY_SUBSCRIPTION}

${MONTHLY_SUBSCRIPTION_DESC}

## Contact

- Email: ${SITE_EMAIL}
- Free AI Scan: https://geo-check.org/lander
`;
}

function generateFeatures(): string {
  const sections = features
    .map((f) => `### ${f.title}\n\n${f.desc}`)
    .join("\n\n");

  return `${GENERATED}

# Why ${SITE_NAME} — Built for the AI Era

## Core Capabilities

${sections}

## How It Works

1. **Free AI Visibility Scan** — We audit what AI currently says about your business.
2. **Business Interview** — 30-60 minute interview to capture verified facts.
3. **Website Build** — Semantic HTML, schema markup, fact-statement copy.
4. **Training Document** — Plain-language fact file formatted to the llms.txt standard.
5. **Platform Push** — Verified data pushed to 19 AI platforms.
6. **Ghost Score Report** — Before-and-after measurement of AI visibility.
`;
}

function generateIndustries(): string {
  const sections = industries
    .map(
      (ind) => `### ${ind.name}

**Tier:** ${ind.num}

**Problem:** ${ind.problem}

**Result:** ${ind.result}`
    )
    .join("\n\n");

  return `${GENERATED}

# Industry Solutions

${SITE_NAME} builds AI-visible websites for specific industries. Each solution addresses the exact AI visibility problem that industry faces.

## Case Studies

${sections}
`;
}

function generateFAQ(): string {
  const stageLabels: Record<string, string> = {
    before: "Before You Buy",
    started: "Getting Started",
    after: "After Launch",
    all: "General",
  };

  const stages = ["before", "started", "after", "all"];
  const sections = stages
    .map((stage) => {
      const items = faqs.filter((f) => f.stage === stage);
      if (!items.length) return "";
      const qaPairs = items
        .map((f) => `### ${f.question}\n\n${f.answer}`)
        .join("\n\n");
      return `## ${stageLabels[stage]}\n\n${qaPairs}`;
    })
    .filter(Boolean)
    .join("\n\n");

  return `${GENERATED}

# Frequently Asked Questions

${sections}

## Still have a question?

Email us directly at ${SITE_EMAIL}
`;
}

function generateInsights(): string {
  let md = `${GENERATED}

# AI Insights

Plain-language articles on AI visibility, schema markup, training documents, and how small businesses get recommended by ChatGPT, Gemini, and Perplexity.

## Featured — ${featuredArticle.date}

### ${featuredArticle.title}

${featuredArticle.description}

#### What You Will Learn

${featuredLearnings.map((item) => `- ${item}`).join("\n")}

## Articles

| Date | Title |
| ---- | ----- |
${articles.map((a) => `| ${a.date} | ${a.title} |`).join("\n")}

## Subscribe

One email per month. No fluff. Only fact-based updates on AI search changes that affect your business.

Email: ${SITE_EMAIL}
`;

  return md;
}

function generateLlmsTxt(): string {
  return `# ${SITE_NAME}

> ${ORG.description}

## About

${SITE_NAME} is a web design agency that rebuilds websites for local businesses so AI platforms can accurately cite and recommend them. ${HERO_BODY[1]}

Website: ${SITE_URL}
Email: ${SITE_EMAIL}
Free AI Scan: https://geo-check.org/lander

## Full Site Content

- [llms-full.txt](${SITE_URL}/llms-full.txt): Complete core content in a single file — overview, pricing, features, 9 industry case studies, 11 FAQs, and articles. Read this to understand everything ${SITE_NAME} offers in one request.

## Docs

- [Homepage](${SITE_URL}/ai-ingest/index.md): Full overview of ${SITE_NAME} — what we do, the problem we solve, and how AI visibility works.
- [Pricing](${SITE_URL}/ai-ingest/pricing.md): Three pricing tiers (${tiers.map((t) => t.price).join(" / ")}) with plan details and monthly subscription info.
- [Features](${SITE_URL}/ai-ingest/features.md): Core capabilities — ${features.map((f) => f.title.toLowerCase()).join(", ")}.
- [Industries](${SITE_URL}/ai-ingest/industries.md): ${industries.length} industry case studies showing AI visibility problems and results.
- [FAQ](${SITE_URL}/ai-ingest/faq.md): ${faqs.length} questions covering before purchase, getting started, and post-launch.
- [Insights](${SITE_URL}/ai-ingest/insights.md): Articles on AI search, schema markup, training documents, and zero-click search.
`;
}

function generateLlmsFullTxt(): string {
  const divider = "\n\n---\n\n";

  // ── 1. Overview ───────────────────────────────────────────────────────────
  const overview = `# ${SITE_NAME} — AI-Friendly Web Design for Small & Medium Businesses

> ${ORG.description}

Website: ${SITE_URL}
Email: ${SITE_EMAIL}
Free AI Scan: ${FREE_SCAN_URL}

${HERO_BODY[0]}

${HERO_BODY[1]}`;

  // ── 2. The Problem ────────────────────────────────────────────────────────
  const problem = `## The Problem ${SITE_NAME} Solves

${HERO_CHATGPT_STAT}

${HERO_STAT.target}% ${HERO_STAT.label.toLowerCase()} (${HERO_STAT.source}).

${VALUE_PROP_BODY.join("\n\n")}`;

  // ── 3. Features ───────────────────────────────────────────────────────────
  const featuresBlock = `## Core Capabilities

${features.map((f) => `### ${f.title}\n\n${f.desc}`).join("\n\n")}`;

  // ── 4. Pricing ────────────────────────────────────────────────────────────
  const pricingRows = tiers
    .map((t) => `| ${t.label} | ${t.name} | ${t.price} | ${t.desc} |`)
    .join("\n");

  const pricingBlock = `## Pricing

All tiers require a ${MONTHLY_SUBSCRIPTION} data subscription.

| Tier | Name | Price | What You Get |
| ---- | ---- | ----- | ------------ |
${pricingRows}

### What Every Tier Includes

- AI-ready website with semantic HTML
- Schema markup for structured data
- Verified AI Training Document
- Push to 19 AI platforms
- Ghost Score before and after launch

### Monthly Data Subscription — ${MONTHLY_SUBSCRIPTION}

${MONTHLY_SUBSCRIPTION_DESC}`;

  // ── 5. How It Works ───────────────────────────────────────────────────────
  const process = `## How It Works

1. **Free AI Visibility Scan** — We audit what AI currently says about your business.
2. **Business Interview** — 30–60 minute interview to capture verified facts.
3. **Website Build** — Semantic HTML, schema markup, fact-statement copy.
4. **Training Document** — Plain-language fact file formatted to the llms.txt standard.
5. **Platform Push** — Verified data pushed to 19 AI platforms.
6. **Ghost Score Report** — Before-and-after measurement of AI visibility.

Most sites launch in 7 days.`;

  // ── 6. Industry Case Studies ──────────────────────────────────────────────
  const industryBlock = `## Industry Case Studies

${industries
    .map(
      (ind) =>
        `### ${ind.name} (${ind.num})\n\n**Problem:** ${ind.problem}\n\n**Result:** ${ind.result}`
    )
    .join("\n\n")}`;

  // ── 7. FAQ ────────────────────────────────────────────────────────────────
  const faqBlock = `## Frequently Asked Questions

${faqs.map((f) => `### ${f.question}\n\n${f.answer}`).join("\n\n")}`;

  // ── 8. Insights ───────────────────────────────────────────────────────────
  const insightsBlock = `## AI Insights & Articles

### Featured: ${featuredArticle.title}

${featuredArticle.description}

**What you will learn:**
${featuredLearnings.map((item) => `- ${item}`).join("\n")}

### More Articles

${articles.map((a) => `- **${a.date}** — ${a.title}`).join("\n")}`;

  // ── 9. 19 Platforms ───────────────────────────────────────────────────────
  const platformFaq = faqs.find((f) =>
    f.question.includes("19 AI platforms")
  );
  const platformsBlock = `## The 19 AI Platforms

${platformFaq?.answer ?? ""}`;

  // ── 10. Contact ───────────────────────────────────────────────────────────
  const contactBlock = `## Contact ${SITE_NAME}

${CONTACT_BODY}

- Email: ${SITE_EMAIL}
- Free AI Scan: ${FREE_SCAN_URL}
- Starting at ${tiers[0].price}`;

  return [
    overview,
    problem,
    featuresBlock,
    pricingBlock,
    process,
    industryBlock,
    faqBlock,
    insightsBlock,
    platformsBlock,
    contactBlock,
  ].join(divider);
}

// ─── Write Files ────────────────────────────────────────────────────────────

const files = [
  { name: "index.md", content: generateIndex() },
  { name: "pricing.md", content: generatePricing() },
  { name: "features.md", content: generateFeatures() },
  { name: "industries.md", content: generateIndustries() },
  { name: "faq.md", content: generateFAQ() },
  { name: "insights.md", content: generateInsights() },
];

for (const file of files) {
  writeFileSync(join(INGEST, file.name), file.content.trimStart(), "utf-8");
  console.log(`  ai-ingest/${file.name}`);
}

writeFileSync(join(PUBLIC, "llms.txt"), generateLlmsTxt().trimStart(), "utf-8");
console.log("  llms.txt");

writeFileSync(
  join(PUBLIC, "llms-full.txt"),
  generateLlmsFullTxt().trimStart(),
  "utf-8"
);
console.log("  llms-full.txt");

console.log(
  `\n✓ Synced ${files.length} Markdown files + llms.txt + llms-full.txt from /src/content/`
);
