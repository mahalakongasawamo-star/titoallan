export interface Article {
  date: string;
  time?: string;
  title: string;
  tags?: string[];
  description?: string;
  featured?: boolean;
  isoDate: string;
}

export const featuredArticle: Article = {
  date: "MARCH 2026",
  time: "6 MIN READ",
  title:
    "93% of Google AI Mode Searches End Without a Click. Here Is What That Means for Your Business.",
  description:
    "In 2026, Google AI Mode answers the majority of search queries directly \u2014 without sending the user to any website. This article explains what zero-click AI search means for small business owners and the exact steps to stay visible.",
  tags: ["AI SEARCH", "ZERO-CLICK", "SMALL BUSINESS", "GOOGLE MUM"],
  featured: true,
  isoDate: "2026-03-01",
};

export const featuredLearnings = [
  "Why 93% of AI Mode searches produce no website clicks",
  "How AI decides which businesses to recommend",
  "The 3 things your website needs for AI to cite you correctly",
  "What happens to businesses that do nothing in 2026",
];

export const articles: Article[] = [
  {
    date: "FEB 2026",
    time: "5 MIN READ",
    title:
      "What Is a Training Document and Why Does Every Small Business Need One?",
    tags: ["TRAINING DOC", "AI DATA"],
    isoDate: "2026-02-01",
  },
  {
    date: "JAN 2026",
    time: "4 MIN READ",
    title: "AI Visibility Is Not SEO. Here Is the Difference.",
    tags: ["AI VISIBILITY", "VS SEO"],
    isoDate: "2026-01-15",
  },
  {
    date: "JAN 2026",
    time: "7 MIN READ",
    title:
      "A Dental Clinic Asked ChatGPT to Recommend Itself. Here Is What AI Said.",
    tags: ["CASE STUDY"],
    isoDate: "2026-01-01",
  },
  {
    date: "DEC 2025",
    time: "3 MIN READ",
    title:
      "Schema Markup for Small Businesses: The Complete Plain-Language Guide",
    tags: ["SCHEMA", "GUIDE"],
    isoDate: "2025-12-15",
  },
  {
    date: "DEC 2025",
    time: "4 MIN READ",
    title: "What Is llms.txt and Does Your Business Website Need One?",
    tags: ["LLMS.TXT", "TECHNICAL"],
    isoDate: "2025-12-01",
  },
];
