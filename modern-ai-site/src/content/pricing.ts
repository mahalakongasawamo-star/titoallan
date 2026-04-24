export interface Tier {
  label: string;
  name: string;
  desc: string;
  price: string;
  priceNumber: number;
}

export const tiers: Tier[] = [
  {
    label: "TIER 01",
    name: "Starter",
    desc: "5-section AI-ready site, semantic HTML, training document, and push to 19 platforms.",
    price: "$1,000",
    priceNumber: 1000,
  },
  {
    label: "TIER 02",
    name: "Growth",
    desc: "Full multi-page site, deep AI integration, training document, and AI chatbot included.",
    price: "$5,000",
    priceNumber: 5000,
  },
  {
    label: "TIER 03",
    name: "Scale",
    desc: "Complete custom build, advanced chatbot, employee upskilling, and quarterly strategy.",
    price: "$10,000",
    priceNumber: 10000,
  },
];

export const MONTHLY_SUBSCRIPTION = "$150/month";
export const MONTHLY_SUBSCRIPTION_DESC =
  "Every 30 days we refresh your training document across all 19 platforms, update any changed services or pricing, add new reviews and trust signals, and send a monthly visibility report.";
