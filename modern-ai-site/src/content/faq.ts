export interface FAQ {
  stage: string;
  stageTag: string;
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    stage: "before",
    stageTag: "STAGE 01 \u2014 BEFORE YOU BUY",
    question: "What exactly does Upserv do?",
    answer:
      "Upserv builds AI-friendly websites for small and medium businesses. We write your website copy as plain-language fact statements, implement semantic HTML and schema markup, and push a verified training document to 19 AI platforms \u2014 so ChatGPT, Gemini, Perplexity, and Meta AI can accurately cite and recommend your business.",
  },
  {
    stage: "before",
    stageTag: "STAGE 01 \u2014 BEFORE YOU BUY",
    question: "Why is my current website invisible to AI?",
    answer:
      "Most websites are built to look good visually \u2014 graphics, animations, and taglines. AI cannot read image text, cannot interpret design, and cannot extract facts from vague slogans. If your business name, services, pricing, and location are not written as readable plain-language text with schema markup, AI skips your site entirely and cites a competitor instead.",
  },
  {
    stage: "before",
    stageTag: "STAGE 01 \u2014 BEFORE YOU BUY",
    question: "Is Upserv the same as SEO?",
    answer:
      "No. SEO optimizes your website to rank higher in traditional Google search results. AI Visibility optimizes your business to be recommended by AI systems \u2014 ChatGPT, Gemini, Perplexity, and Meta AI. These are different systems with different requirements. SEO targets page rankings. We target AI citations. Both matter, but only one is growing at 900 million users weekly.",
  },
  {
    stage: "before",
    stageTag: "STAGE 01 \u2014 BEFORE YOU BUY",
    question: "How much does an Upserv website cost?",
    answer:
      "Upserv offers three tiers: Starter at $1,000 (5-section AI-ready site, semantic HTML, training document, push to 19 platforms), Growth at $5,000 (full multi-page site, deep AI integration, AI chatbot included), and Scale at $10,000 (complete custom build, advanced chatbot, employee upskilling, quarterly strategy). All tiers require a $150/month data subscription.",
  },
  {
    stage: "started",
    stageTag: "STAGE 02 \u2014 GETTING STARTED",
    question: "How long does it take to get my website live?",
    answer:
      "Most Upserv websites launch in 7 days. Day 1: Free AI visibility scan. Day 2\u20133: 30\u201360 minute business interview and training document build. Day 4\u20135: Website build with schema markup, llms.txt, and fact-statement copy. Day 6: Your review and approval. Day 7: Launch and push to 19 AI platforms.",
  },
  {
    stage: "started",
    stageTag: "STAGE 02 \u2014 GETTING STARTED",
    question: "Do I need to replace my current website?",
    answer:
      "Not necessarily. At the $1,000 Starter tier, you have two options: Option 1 \u2014 we edit your existing site by rewriting copy as fact statements and adding schema markup. Option 2 \u2014 we build a brand-new 1-page, 5-section AI-friendly website from scratch. We recommend the new build for businesses with outdated or heavily image-based sites.",
  },
  {
    stage: "started",
    stageTag: "STAGE 02 \u2014 GETTING STARTED",
    question: "What is a training document?",
    answer:
      "A training document is a plain-language fact file about your business. It contains your exact services, verified pricing, correct hours, location, staff names and credentials, and any other facts AI needs to recommend you accurately. We format it to the llms.txt standard so AI platforms can ingest it directly. Without a training document, AI guesses \u2014 and guesses wrong.",
  },
  {
    stage: "after",
    stageTag: "STAGE 03 \u2014 AFTER LAUNCH",
    question: "What is a Ghost Score?",
    answer:
      "A Ghost Score is Upserv\u2019s AI visibility measurement \u2014 a score of 0 to 100 that measures how accurately and how often AI platforms cite your business. A score of 0 means AI never mentions your business. A score of 100 means AI consistently recommends you with correct information. We run your Ghost Score before launch and again 30 days after.",
  },
  {
    stage: "after",
    stageTag: "STAGE 03 \u2014 AFTER LAUNCH",
    question: "How do I know if AI visibility is working?",
    answer:
      "Upserv provides a Ghost Score report before launch and 30 days after launch showing exactly what changed \u2014 which platforms now cite you, what they say, and where errors were corrected. Most clients see AI recognition within 4\u20138 weeks of launch.",
  },
  {
    stage: "after",
    stageTag: "STAGE 03 \u2014 AFTER LAUNCH",
    question: "What happens after my website launches?",
    answer:
      "After launch, Upserv manages your AI visibility on a $150/month subscription. Every 30 days we refresh your training document across all 19 platforms, update any changed services or pricing, add new reviews and trust signals, and send a monthly visibility report.",
  },
  {
    stage: "all",
    stageTag: "GENERAL",
    question: "What are the 19 AI platforms Upserv pushes data to?",
    answer:
      "We push your verified training document to: ChatGPT, Google Gemini, Perplexity, Meta AI (Facebook & Instagram), Microsoft Copilot, Claude (Anthropic), Google Search (MUM), Bing AI, Apple Intelligence, Amazon Alexa, Grok (xAI), You.com, Brave Leo, DuckDuckAI, Aria (Opera), HuggingChat, Cohere Command, Mistral Le Chat, and OpenRouter.",
  },
];

export interface FAQFilter {
  label: string;
  value: string;
}

export const faqFilters: FAQFilter[] = [
  { label: "All", value: "all" },
  { label: "Before You Buy", value: "before" },
  { label: "Getting Started", value: "started" },
  { label: "After Launch", value: "after" },
];
