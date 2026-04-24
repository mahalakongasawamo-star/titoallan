/**
 * Schema — Injects one or more JSON-LD structured data blocks into <head>.
 *
 * Usage:
 *   <Schema data={webPageSchema} />
 *   <Schema data={[faqSchema, articleSchema]} />
 */

import { SITE_URL, SITE_NAME, SITE_EMAIL, SITE_DESCRIPTION, ORG } from "@/content/site";
import { tiers } from "@/content/pricing";
import { faqs } from "@/content/faq";
import { featuredArticle, articles } from "@/content/insights";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsonLd = Record<string, any>;

export default function Schema({ data }: { data: JsonLd | JsonLd[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}

// ─── Schema Builders ────────────────────────────────────────────────────────

const schemaOrg = {
  "@type": "Organization" as const,
  name: ORG.name,
  url: ORG.url,
  email: ORG.email,
  description: ORG.description,
};

export function buildWebPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${SITE_NAME} \u2014 AI-Friendly Web Design`,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: schemaOrg,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "Service",
      name: "AI-Friendly Web Design",
      provider: schemaOrg,
      serviceType: "Web Design and AI Visibility",
      areaServed: {
        "@type": "Country",
        name: "United States",
      },
      offers: tiers.map((t) => ({
        "@type": "Offer",
        name: t.name,
        price: String(t.priceNumber),
        priceCurrency: "USD",
        description: t.desc,
      })),
    },
  };
}

export function buildFAQPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function buildArticleSchemas() {
  return [featuredArticle, ...articles].map((a) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description ?? undefined,
    datePublished: a.isoDate,
    author: schemaOrg,
    publisher: schemaOrg,
    inLanguage: "en-US",
  }));
}
