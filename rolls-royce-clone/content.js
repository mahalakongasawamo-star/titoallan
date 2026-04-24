// ============================================================
//  MASTER CONTENT FILE — upserv.ai
//  ▸ Edit ONLY the values inside CONTENT to update the site.
//  ▸ Do NOT edit below the "DO NOT EDIT BELOW" line.
//  ▸ Use <br> inside strings for manual line breaks.
//  ▸ Image filenames must exist in the same folder as index.html
// ============================================================

const CONTENT = {

  // ──────────────────────────────────────────────────────────
  //  SITE-WIDE
  // ──────────────────────────────────────────────────────────
  site: {
    logo:  'upservai.png',         // logo file name (same folder)
    email: 'hello@upserv.ai',
  },

  // ──────────────────────────────────────────────────────────
  //  NAVIGATION
  // ──────────────────────────────────────────────────────────
  nav: {
    ctaText: 'GET IN TOUCH',
    ctaLink: '#contact',
  },

  // ──────────────────────────────────────────────────────────
  //  HERO SECTION
  // ──────────────────────────────────────────────────────────
  hero: {
    label: 'UPSERV We make your business show up in ChatGPT recommendations when customers search for your service',

    // Use <br> for line breaks in the headline
    title: 'Upserv Builds Websites That Get Your Business<br>Recommended by AI<br>Not Just Found by Google.',

    image: 'hero-bg.png',          // hero background image file

    ctaPrimary: {
      text: 'GET YOUR FREE AI SCAN',
      url:  'https://geo-check.org/lander',
    },
    ctaSecondary: {
      text: 'SIGNUP FOR WAITLIST',
      url:  '#contact',
    },
  },

  // ──────────────────────────────────────────────────────────
  //  ABOUT TEXT SECTION  (below the hero image)
  // ──────────────────────────────────────────────────────────
  about: {
    lead: 'Upserv is a web design agency that rebuilds and redesigns websites for small and medium businesses so they appear in AI-driven recommendations, ChatGPT Ads, Google MUM, Perplexity, Grok, and Meta Andromeda.',

    body1: 'We serve dental clinics, medical practices, restaurants, retail stores, auto repair shops, electricians, plumbers, and law firms across the United States.',

    // Wrap text in <strong> for bold
    body2: 'On <strong>February 9, 2026</strong>, ChatGPT launched advertising to 900 million users. AI now surfaces 3 to 5 businesses per query, not pages of links. An analysis of 350,000 local businesses found <strong>98.8% were absent from ChatGPT recommendations entirely.</strong>',
  },

  // ──────────────────────────────────────────────────────────
  //  STATS BAR
  // ──────────────────────────────────────────────────────────
  stats: {
    number:    93,                 // animated counter end value
    suffix:    '%',
    statement: 'Of Google AI Mode Searches End Without A Single Click.',
    source:    'Source: Semrush, 2025',
  },

  // ──────────────────────────────────────────────────────────
  //  VALUE PROPOSITION SECTION
  // ──────────────────────────────────────────────────────────
  valueProp: {
    counterNumber: 900,            // animated counter end value

    body1: 'AI-referred visitors convert at 4.4\u00d7 the rate of traditional organic traffic because they arrive already knowing what they want. If your local business isn\u2019t structuring its data for AI, AI platforms cannot recommend your services.',

    body2: 'AI hallucinates unverified data. It guesses your pricing, invents your service areas, and cites outdated hours. We build your verified Training Document and push it to 19 AI platforms so they get it right every time.',
  },

  // ──────────────────────────────────────────────────────────
  //  PRICING SECTION
  // ──────────────────────────────────────────────────────────
  pricing: {
    title:    'PRICING<br>STRUCTURES.',
    subtitle: 'VERIFIED DATASETS PUSHED TO<br>19 PLATFORMS.',
    note:     '+ $150/MONTH DATA<br>SUBSCRIPTION REQUIRED FOR<br>ALL TIERS.',

    // Each tier: label, name, desc, price
    tiers: [
      {
        label: 'TIER 01',
        name:  'Starter',
        desc:  '5-section AI-ready site, semantic HTML, training document, and push to 19 platforms.',
        price: '$1,000',
      },
      {
        label: 'TIER 02',
        name:  'Growth',
        desc:  'Full multi-page site, deep AI integration, training document, and AI chatbot included.',
        price: '$5,000',
      },
      {
        label: 'TIER 03',
        name:  'Scale',
        desc:  'Complete custom build, advanced chatbot, employee upskilling, and quarterly strategy.',
        price: '$10,000',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  //  INDUSTRY CARDS  (keep same order as the cards: 01 → 09)
  // ──────────────────────────────────────────────────────────
  //  image  — filename in same folder as index.html
  //  link   — destination when card is clicked (new tab)
  //           Use '#' as placeholder for pages not yet built
  //           Use a full URL for external: 'https://example.com/page'
  //           Use a relative path for local: 'dental-clinic.html'
  // ──────────────────────────────────────────────────────────
  industries: [
    // ── 01 ──────────────────────────────────────────────────
    {
      num:     '',
      name:    'Dental Clinic',
      image:   'dental-clinic.png',
      link:    '#',                    // ← EDIT: Dental Clinic page link
      problem: 'AI was hallucinating crown pricing for dental practices, quoting $800 less than actual rates. Patients booked elsewhere. Upserv built a fact-statement site with verified pricing schema and pushed it to 19 AI platforms.',
      badge:   'AI Visibility Problem Solved',
      result:  'ChatGPT now correctly cites service menu, prices, and hours when patients ask for local dental options.',
    },
    // ── 02 ──────────────────────────────────────────────────
    {
      num:     '',
      name:    'Law Firm',
      image:   'law-firm.png',
      link:    '#',                    // ← EDIT: Law Firm page link
      problem: 'AI was fabricating practice areas for law firms, listing personal injury for a pure corporate firm. Upserv built a verified legal entity profile with LegalService schema, attorney credentials in live text, and a training document clarifying exact practice areas.',
      badge:   'AI Visibility Problem Solved',
      result:  'Perplexity now accurately lists the firm\u2019s practice areas and jurisdiction when prospects ask AI for specialized legal help.',
    },
    // ── 03 ──────────────────────────────────────────────────
    {
      num:     '',
      name:    'Real Estate Agency',
      image:   'real-estate.png',
      link:    '#',                    // ← EDIT: Real Estate Agency page link
      problem: 'Real estate agencies were being confused with brokers, developers, and competitors by AI. Upserv built a RealEstateAgent schema profile with verified agent names, licensed service areas, and transaction history facts so AI cites the correct firm.',
      badge:   'AI Visibility Problem Solved',
      result:  'Gemini now correctly surfaces the agency\u2019s service zip codes and specialties when buyers ask AI to recommend a local agent.',
    },
    // ── 04 ──────────────────────────────────────────────────
    {
      num:     '',
      name:    'Restaurant',
      image:   'restaurant.png',
      link:    'restaurants.html',     // ← EDIT: Restaurant page link
      problem: 'Restaurants were being ignored by AI when diners asked \u201cfind me a family Italian restaurant open Sunday near downtown.\u201d AI could not read the menu, hours, or cuisine type. Upserv built a Restaurant schema site with structured menu data and verified hours.',
      badge:   'AI Visibility Problem Solved',
      result:  'ChatGPT and Meta AI now surface the restaurant when users ask for cuisine type, dietary options, or weekend availability in the area.',
    },
    // ── 05 ──────────────────────────────────────────────────
    {
      num:     '',
      name:    'Medical Practice',
      image:   'medical-practice.png',
      link:    'medicalpractice.html', // ← EDIT: Medical Practice page link
      problem: 'AI was directing patients to competing clinics because the practice website had no structured specialties data, no physician credentials in live text, and no insurance acceptance schema. Upserv built a full MedicalOrganization profile and pushed it to 19 platforms.',
      badge:   'AI Visibility Problem Solved',
      result:  'Perplexity and ChatGPT now correctly list physician names, specialties, accepted insurance, and new patient availability.',
    },
    // ── 06 ──────────────────────────────────────────────────
    {
      num:     '',
      name:    'Retail Store',
      image:   'retail-store.png',
      link:    '#',                    // ← EDIT: Retail Store page link
      problem: 'Retail stores were invisible when shoppers asked AI \u201cwhere can I buy X near me?\u201d Upserv built a LocalBusiness + Store schema profile with verified product categories, store hours, location data, and a training document pushed to Google, ChatGPT, and Meta AI.',
      badge:   'AI Visibility Problem Solved',
      result:  'Google Gemini now recommends the store when local shoppers ask AI for specific product categories available nearby.',
    },
    // ── 07 ──────────────────────────────────────────────────
    {
      num:     '',
      name:    'Home Services',
      image:   'home-services.png',
      link:    '#',                    // ← EDIT: Home Services page link
      problem: 'HVAC companies and plumbers were invisible to AI emergency queries. When homeowners asked \u201cfind me an emergency plumber available tonight,\u201d AI had no structured service-area or availability data to cite. Upserv fixed this with HomeAndConstructionBusiness schema and verified service zone data.',
      badge:   'AI Visibility Problem Solved',
      result:  'ChatGPT now correctly surfaces the business for emergency and same-day service queries within the verified service area.',
    },
    // ── 08 ──────────────────────────────────────────────────
    {
      num:     '',
      name:    'Accounting Firm',
      image:   'accounting-firm.png',
      link:    '#',                    // ← EDIT: Accounting Firm page link
      problem: 'Accounting firms were being confused with tax prep chains and general bookkeeping services. Upserv built a verified FinancialService schema profile specifying exact services (forensic accounting, tax strategy, CFO advisory), client sizes served, and partner credentials.',
      badge:   'AI Visibility Problem Solved',
      result:  'ChatGPT now distinguishes the firm from national chains and cites the correct specialties when business owners ask AI for a local CPA.',
    },
    // ── 09 ──────────────────────────────────────────────────
    {
      num:     '',
      name:    'Salon & Beauty',
      image:   'beauty-salon.png',
      link:    'beautysalon.html',     // ← EDIT: Salon & Beauty page link
      problem: 'Salons were losing bookings because AI cited wrong pricing and services. Upserv built a BeautySalon schema site with live service menu text, stylist names and credentials, booking link, and verified price ranges pushed to all platforms.',
      badge:   'AI Visibility Problem Solved',
      result:  'Meta AI and ChatGPT now correctly surface the salon\u2019s services and pricing when users ask AI to find a specific treatment nearby.',
    },
  ],

  // ──────────────────────────────────────────────────────────
  //  CONTACT / CTA SECTION  (bottom of page)
  // ──────────────────────────────────────────────────────────
  contact: {
    headlineBlack: 'OPTIMIZE YOUR<br>BUSINESS<br>FOR AI SEARCH.',
    headlineBlue:  'NOT JUST<br>GOOGLE.',

    scanBtn: {
      text: 'RUN FREE SCAN \u00a0\u2192',
      url:  'https://www.semrush.com/ai-seo/overview/',
    },
    waitlistBtn: {
      text: 'SIGN-UP FOR WAITLIST',
      url:  'https://form.typeform.com/to/upservai',  // ← replace with your Typeform form ID
    },

    tagline: 'Upserv is an AI-ready website company serving businesses that cannot afford to be invisible.',
    email:   'hello@upserv.ai',
  },

  // ──────────────────────────────────────────────────────────
  //  FOOTER
  // ──────────────────────────────────────────────────────────
  footer: {
    tagline:   'AI DATA SOLUTIONS',
    copyright: '\u00a9 2026 upserv.ai. All rights reserved.',
  },

};


// ============================================================
//  DO NOT EDIT BELOW THIS LINE
//  The function below reads CONTENT and injects it into the DOM
// ============================================================
function applyContent() {

  // ── Site-wide logos ──────────────────────────────────────
  document.querySelectorAll('.header__logo-img, .footer__logo-img')
    .forEach(el => { el.src = CONTENT.site.logo; });

  // ── Nav ──────────────────────────────────────────────────
  const navCta = document.querySelector('.header__cta');
  if (navCta) {
    const span = navCta.querySelector('span');
    if (span) span.textContent = CONTENT.nav.ctaText;
    navCta.href = CONTENT.nav.ctaLink;
  }

  // ── Hero ─────────────────────────────────────────────────
  const heroLabel = document.querySelector('.hero__label');
  if (heroLabel) heroLabel.textContent = CONTENT.hero.label;

  const heroTitle = document.querySelector('.hero__title');
  if (heroTitle) heroTitle.innerHTML = CONTENT.hero.title;

  const heroBg = document.querySelector('.hero__image-bg');
  if (heroBg) heroBg.style.backgroundImage = `url('${CONTENT.hero.image}')`;

  const heroPrimary = document.querySelector('.hero__cta-btn--primary');
  if (heroPrimary) {
    heroPrimary.textContent = CONTENT.hero.ctaPrimary.text;
    heroPrimary.href = CONTENT.hero.ctaPrimary.url;
  }

  const heroSecondary = document.querySelector('.hero__cta-btn--secondary');
  if (heroSecondary) {
    heroSecondary.textContent = CONTENT.hero.ctaSecondary.text;
    heroSecondary.href = CONTENT.hero.ctaSecondary.url;
  }

  // ── About text ───────────────────────────────────────────
  const aboutLead = document.querySelector('.about-text__lead');
  if (aboutLead) aboutLead.innerHTML = CONTENT.about.lead;

  const aboutBodies = document.querySelectorAll('.about-text__body');
  if (aboutBodies[0]) aboutBodies[0].innerHTML = CONTENT.about.body1;
  if (aboutBodies[1]) aboutBodies[1].innerHTML = CONTENT.about.body2;

  // ── Stats bar ────────────────────────────────────────────
  const statsNum = document.querySelector('.stats__number--large');
  if (statsNum) statsNum.dataset.count = CONTENT.stats.number;

  const statsSuffix = document.querySelector('.stats__suffix--large');
  if (statsSuffix) statsSuffix.textContent = CONTENT.stats.suffix;

  const statsStmt = document.querySelector('.stats__statement');
  if (statsStmt) statsStmt.textContent = CONTENT.stats.statement;

  const statsSrc = document.querySelector('.stats__source');
  if (statsSrc) statsSrc.textContent = CONTENT.stats.source;

  // ── Value proposition ────────────────────────────────────
  const vpNum = document.querySelector('.value-prop__number');
  if (vpNum) vpNum.dataset.count = CONTENT.valueProp.counterNumber;

  const vpBodies = document.querySelectorAll('.value-prop__body p');
  if (vpBodies[0]) vpBodies[0].innerHTML = CONTENT.valueProp.body1;
  if (vpBodies[1]) vpBodies[1].innerHTML = CONTENT.valueProp.body2;

  // ── Pricing ──────────────────────────────────────────────
  const pTitle = document.querySelector('.pricing__title');
  if (pTitle) pTitle.innerHTML = CONTENT.pricing.title;

  const pSubtitle = document.querySelector('.pricing__subtitle');
  if (pSubtitle) pSubtitle.innerHTML = CONTENT.pricing.subtitle;

  const pNote = document.querySelector('.pricing__note-header');
  if (pNote) pNote.innerHTML = CONTENT.pricing.note;

  document.querySelectorAll('.pricing__card').forEach((card, i) => {
    const t = CONTENT.pricing.tiers[i];
    if (!t) return;
    const tier  = card.querySelector('.pricing__tier');
    const name  = card.querySelector('.pricing__name');
    const desc  = card.querySelector('.pricing__desc');
    const price = card.querySelector('.pricing__price');
    if (tier)  tier.textContent  = t.label;
    if (name)  name.textContent  = t.name;
    if (desc)  desc.textContent  = t.desc;
    if (price) price.textContent = t.price;
  });

  // ── Industry cards ───────────────────────────────────────
  document.querySelectorAll('.industry__card').forEach((card, i) => {
    const d = CONTENT.industries[i];
    if (!d) return;
    const linkEl    = card.querySelector('.industry__card-href');
    const bgEl      = card.querySelector('.industry__card-bg');
    const numEl     = card.querySelector('.industry__card-num');
    const nameEl    = card.querySelector('.industry__card-name');
    const problemEl = card.querySelector('.industry__card-problem');
    const badgeEl   = card.querySelector('.industry__card-badge');
    const resultEl  = card.querySelector('.industry__card-result');
    if (linkEl)    linkEl.href                  = d.link;
    if (bgEl)      bgEl.style.backgroundImage   = `url('${d.image}')`;
    if (numEl)     numEl.textContent             = d.num;
    if (nameEl)    nameEl.textContent            = d.name;
    if (problemEl) problemEl.textContent         = d.problem;
    if (badgeEl)   badgeEl.textContent           = d.badge;
    if (resultEl)  resultEl.textContent          = d.result;
  });

  // ── Contact section ──────────────────────────────────────
  const cBlack = document.querySelector('.contact__headline--black');
  if (cBlack) cBlack.innerHTML = CONTENT.contact.headlineBlack;

  const cBlue = document.querySelector('.contact__headline--blue');
  if (cBlue) cBlue.innerHTML = CONTENT.contact.headlineBlue;

  const scanBtn = document.querySelector('.contact__btn--scan');
  if (scanBtn) {
    scanBtn.innerHTML = CONTENT.contact.scanBtn.text;
    scanBtn.href      = CONTENT.contact.scanBtn.url;
  }

  const waitlistBtn = document.querySelector('.contact__btn--waitlist');
  if (waitlistBtn) {
    waitlistBtn.textContent = CONTENT.contact.waitlistBtn.text;
    waitlistBtn.href        = CONTENT.contact.waitlistBtn.url;
  }

  const tagline = document.querySelector('.contact__tagline');
  if (tagline) tagline.textContent = CONTENT.contact.tagline;

  const emailEl = document.querySelector('.contact__email');
  if (emailEl) {
    emailEl.textContent = CONTENT.contact.email.toUpperCase();
    emailEl.href        = `mailto:${CONTENT.contact.email}`;
  }

  // ── Footer ───────────────────────────────────────────────
  const footerTagline = document.querySelector('.footer__brand-tagline');
  if (footerTagline) footerTagline.textContent = CONTENT.footer.tagline;

  const footerCopyright = document.querySelector('.footer__copyright');
  if (footerCopyright) footerCopyright.innerHTML = CONTENT.footer.copyright;
}

// Run as soon as the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyContent);
} else {
  applyContent();
}
