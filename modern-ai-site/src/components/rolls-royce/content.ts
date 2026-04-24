// ─── ROLLS-ROYCE CONTENT ARCHITECTURE ───────────────────────────────
// All dynamic text is defined here for future editing and localisation.

export const CONTENT = {
  // ── Brand ──
  BRAND_NAME: "ROLLS-ROYCE",
  BRAND_TAGLINE: "MOTOR CARS",

  // ── Navigation ──
  NAV_LINKS: [
    { label: "MODELS", href: "#models" },
    { label: "BESPOKE", href: "#bespoke" },
    { label: "WHISPERS", href: "#whispers" },
    { label: "OWNERSHIP", href: "#ownership" },
    { label: "FIND A DEALER", href: "#dealer" },
  ],

  // ── Hero Section ──
  HERO_TITLE: "Inspiring Greatness",
  HERO_SUBTITLE: "MOTOR CARS",
  HERO_CTA: "DISCOVER MORE",
  HERO_IMAGE:
    "https://images.unsplash.com/photo-1631214548472-f481734e55e5?w=1920&q=80&auto=format&fit=crop",

  // ── Model Showcase ──
  SECTION_MODELS_TITLE: "OUR MODELS",
  MODELS_FEATURED: [
    {
      name: "PHANTOM",
      tagline: "The Pinnacle of Luxury",
      description:
        "The definitive luxury motor car. Phantom is the signature Rolls-Royce, a series of firsts — a car born of the pursuit of perfection.",
      image:
        "https://images.unsplash.com/photo-1563720223185-11003d516935?w=960&q=80&auto=format&fit=crop",
      cta: "EXPLORE PHANTOM",
    },
    {
      name: "SPECTRE",
      tagline: "The First Fully Electric Rolls-Royce",
      description:
        "An ultra-luxury electric super coupé that redefines the boundaries of possibility. The future of Rolls-Royce is electric.",
      image:
        "https://images.unsplash.com/photo-1580274455191-1c62238ce452?w=960&q=80&auto=format&fit=crop",
      cta: "EXPLORE SPECTRE",
    },
  ],
  MODELS_GRID: [
    {
      name: "GHOST",
      tagline: "Post Opulent",
      description:
        "The purest expression of Rolls-Royce. A motor car that distils complexity to create something wonderfully effortless.",
      image:
        "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=640&q=80&auto=format&fit=crop",
      cta: "EXPLORE GHOST",
    },
    {
      name: "CULLINAN SERIES II",
      tagline: "Effortless, Everywhere",
      description:
        "The most versatile super-luxury SUV in the world — commanding every landscape with absolute authority.",
      image:
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=640&q=80&auto=format&fit=crop",
      cta: "EXPLORE CULLINAN",
    },
    {
      name: "BLACK BADGE",
      tagline: "The Alter Ego",
      description:
        "For those who dare. The darker, more assertive expression of Rolls-Royce motor cars.",
      image:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=640&q=80&auto=format&fit=crop",
      cta: "EXPLORE BLACK BADGE",
    },
  ],

  // ── Bespoke Section ──
  BESPOKE_TITLE: "BESPOKE",
  BESPOKE_SUBTITLE: "YOUR VISION, OUR CRAFT",
  BESPOKE_DESCRIPTION:
    "Every Rolls-Royce is as unique as its owner. Our Bespoke programme invites you to imagine, and then makes the impossible, possible. From hand-painted coachlines to starlight headliners with over 1,600 fibre-optic lights, no request is too ambitious.",
  BESPOKE_CTA: "COMMISSION YOURS",
  BESPOKE_IMAGE:
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80&auto=format&fit=crop",

  // ── Whispers Section ──
  WHISPERS_TITLE: "WHISPERS",
  WHISPERS_SUBTITLE: "AN EXCLUSIVE COMMUNITY",
  WHISPERS_DESCRIPTION:
    "Whispers is a digital ecosystem dedicated exclusively to Rolls-Royce clients. Members gain privileged access to extraordinary experiences, curated events, and unparalleled lifestyle content.",
  WHISPERS_CTA: "LEARN MORE",
  WHISPERS_CARDS: [
    {
      title: "CURATED EXPERIENCES",
      description: "Access the world's most exclusive events, from private art viewings to Michelin-starred culinary experiences.",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=640&q=80&auto=format&fit=crop",
    },
    {
      title: "BESPOKE JOURNEYS",
      description: "Discover extraordinary travel destinations handpicked by our lifestyle connoisseurs.",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640&q=80&auto=format&fit=crop",
    },
    {
      title: "THE SPIRIT OF ECSTASY",
      description: "Explore the heritage, artistry, and philosophy that define the Rolls-Royce marque.",
      image:
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=640&q=80&auto=format&fit=crop",
    },
  ],

  // ── Footer ──
  FOOTER_SECTIONS: [
    {
      title: "MODELS",
      links: ["Phantom", "Spectre", "Ghost", "Cullinan Series II", "Black Badge"],
    },
    {
      title: "OWNERSHIP",
      links: [
        "Financial Services",
        "Provenance Pre-Owned",
        "Accessories",
        "Service & Maintenance",
      ],
    },
    {
      title: "BESPOKE",
      links: ["Bespoke Programme", "Gallery", "Commissioning", "Inspiration"],
    },
    {
      title: "ABOUT",
      links: ["Our Story", "The Home of Rolls-Royce", "Press", "Careers", "Contact"],
    },
  ],
  FOOTER_SOCIAL: [
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "X", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
  FOOTER_LEGAL:
    "\u00A9 Copyright Rolls-Royce Motor Cars Limited 2024. All rights reserved.",
  FOOTER_TAGLINE: "Strive for perfection in everything you do.",
} as const;
