export interface Industry {
  num: string;
  name: string;
  image: string;
  link: string;
  problem: string;
  badge: string;
  result: string;
}

export const industries: Industry[] = [
  {
    num: "01 / Health Starter \u2014 $1,000",
    name: "Dental Clinic",
    image: "/dental-clinic.png",
    link: "#",
    problem:
      "AI was hallucinating crown pricing for dental practices, quoting $800 less than actual rates. Patients booked elsewhere. Upserv built a fact-statement site with verified pricing schema and pushed it to 19 AI platforms.",
    badge: "AI Visibility Problem Solved",
    result:
      "ChatGPT now correctly cites service menu, prices, and hours when patients ask for local dental options.",
  },
  {
    num: "02 / Legal Growth \u2014 $5,000",
    name: "Law Firm",
    image: "/law-firm.png",
    link: "#",
    problem:
      "AI was fabricating practice areas for law firms, listing personal injury for a pure corporate firm. Upserv built a verified legal entity profile with LegalService schema, attorney credentials in live text, and a training document clarifying exact practice areas.",
    badge: "AI Visibility Problem Solved",
    result:
      "Perplexity now accurately lists the firm\u2019s practice areas and jurisdiction when prospects ask AI for specialized legal help.",
  },
  {
    num: "03 / Property Starter \u2014 $1,000",
    name: "Real Estate Agency",
    image: "/real-estate.png",
    link: "#",
    problem:
      "Real estate agencies were being confused with brokers, developers, and competitors by AI. Upserv built a RealEstateAgent schema profile with verified agent names, licensed service areas, and transaction history facts so AI cites the correct firm.",
    badge: "AI Visibility Problem Solved",
    result:
      "Gemini now correctly surfaces the agency\u2019s service zip codes and specialties when buyers ask AI to recommend a local agent.",
  },
  {
    num: "04 / Food Starter \u2014 $1,000",
    name: "Restaurant",
    image: "/restaurant.png",
    link: "#",
    problem:
      "Restaurants were being ignored by AI when diners asked \u201cfind me a family Italian restaurant open Sunday near downtown.\u201d AI could not read the menu, hours, or cuisine type. Upserv built a Restaurant schema site with structured menu data and verified hours.",
    badge: "AI Visibility Problem Solved",
    result:
      "ChatGPT and Meta AI now surface the restaurant when users ask for cuisine type, dietary options, or weekend availability in the area.",
  },
  {
    num: "05 / Health Scale \u2014 $10,000",
    name: "Medical Practice",
    image: "/medical-practice.png",
    link: "#",
    problem:
      "AI was directing patients to competing clinics because the practice website had no structured specialties data, no physician credentials in live text, and no insurance acceptance schema. Upserv built a full MedicalOrganization profile and pushed it to 19 platforms.",
    badge: "AI Visibility Problem Solved",
    result:
      "Perplexity and ChatGPT now correctly list physician names, specialties, accepted insurance, and new patient availability.",
  },
  {
    num: "06 / Retail Growth \u2014 $5,000",
    name: "Retail Store",
    image: "/retail-store.png",
    link: "#",
    problem:
      "Retail stores were invisible when shoppers asked AI \u201cwhere can I buy X near me?\u201d Upserv built a LocalBusiness + Store schema profile with verified product categories, store hours, location data, and a training document pushed to Google, ChatGPT, and Meta AI.",
    badge: "AI Visibility Problem Solved",
    result:
      "Google Gemini now recommends the store when local shoppers ask AI for specific product categories available nearby.",
  },
  {
    num: "07 / Service Starter \u2014 $1,000",
    name: "Home Services",
    image: "/home-services.png",
    link: "#",
    problem:
      "HVAC companies and plumbers were invisible to AI emergency queries. When homeowners asked \u201cfind me an emergency plumber available tonight,\u201d AI had no structured service-area or availability data to cite. Upserv fixed this with HomeAndConstructionBusiness schema and verified service zone data.",
    badge: "AI Visibility Problem Solved",
    result:
      "ChatGPT now correctly surfaces the business for emergency and same-day service queries within the verified service area.",
  },
  {
    num: "08 / Finance Growth \u2014 $5,000",
    name: "Accounting Firm",
    image: "/accounting-firm.png",
    link: "#",
    problem:
      "Accounting firms were being confused with tax prep chains and general bookkeeping services. Upserv built a verified FinancialService schema profile specifying exact services (forensic accounting, tax strategy, CFO advisory), client sizes served, and partner credentials.",
    badge: "AI Visibility Problem Solved",
    result:
      "ChatGPT now distinguishes the firm from national chains and cites the correct specialties when business owners ask AI for a local CPA.",
  },
  {
    num: "09 / Beauty Starter \u2014 $1,000",
    name: "Salon & Beauty",
    image: "/beauty-salon.png",
    link: "#",
    problem:
      "Salons were losing bookings because AI cited wrong pricing and services. Upserv built a BeautySalon schema site with live service menu text, stylist names and credentials, booking link, and verified price ranges pushed to all platforms.",
    badge: "AI Visibility Problem Solved",
    result:
      "Meta AI and ChatGPT now correctly surface the salon\u2019s services and pricing when users ask AI to find a specific treatment nearby.",
  },
];
