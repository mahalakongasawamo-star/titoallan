/* ═══════════════════════════════════════════════════════════════════════════
   SITE CONTENT — Edit everything here
   ═══════════════════════════════════════════════════════════════════════════
   To update the site, change any value below and save.
   content.js is loaded BEFORE the closing </body> tag and runs automatically.

   IMAGE TIPS:
     • Drop files into the "images/" folder next to index.html
     • Reference them as "images/your-file.jpg"
     • Recommended formats: .webp (best), .jpg, .png, .svg
     • Hero / Bespoke  → 1920×1080+
     • Featured models  → 960×540
     • Grid models      → 640×480
     • Whisper cards    → 640×854 (3:4 portrait)
   ═══════════════════════════════════════════════════════════════════════════ */

const SITE_CONTENT = {

  /* ─────────────────────────────────────────────────────────────────────────
     IMAGES — All image paths in one place
     Change any path to swap an image site-wide.
     ───────────────────────────────────────────────────────────────────────── */
  images: {
    hero:              "images/hero.png",
    bespoke:           "images/bespoke.svg",
    phantom:           "images/phantom.svg",
    spectre:           "images/spectre.svg",
    ghost:             "images/ghost.svg",
    cullinan:          "images/cullinan.svg",
    blackbadge:        "images/blackbadge.svg",
    whisperExperiences:"images/whisper-experiences.svg",
    whisperJourneys:   "images/whisper-journeys.svg",
    whisperEcstasy:    "images/whisper-ecstasy.svg",
  },

  /* ─────────────────────────────────────────────────────────────────────────
     NAVIGATION
     ───────────────────────────────────────────────────────────────────────── */
  nav: {
    brandName:    "ROLLS-ROYCE",
    brandTagline: "MOTOR CARS",
    menuLabel:    "MENU",
    closeLabel:   "CLOSE",
    brandMark:    "ROLLS-ROYCE",        // text at bottom of overlay
    links: [
      { text: "MODELS",        href: "#models"    },
      { text: "BESPOKE",       href: "#bespoke"   },
      { text: "WHISPERS",      href: "#whispers"  },
      { text: "OWNERSHIP",     href: "#ownership" },
      { text: "FIND A DEALER", href: "#dealer"    },
    ],
  },

  /* ─────────────────────────────────────────────────────────────────────────
     HERO SECTION
     ───────────────────────────────────────────────────────────────────────── */
  hero: {
    subtitle:   "MOTOR CARS",
    title:      "Inspiring Greatness",
    ctaText:    "DISCOVER MORE",
    ctaHref:    "#models",
    scrollText: "SCROLL",
    imageAlt:   "Rolls-Royce luxury motor car",
  },

  /* ─────────────────────────────────────────────────────────────────────────
     MODELS SECTION
     ─ "featured" renders as large 2-column cards
     ─ "grid" renders as smaller 3-column cards
     ─ Add or remove entries freely — the page rebuilds automatically
     ───────────────────────────────────────────────────────────────────────── */
  models: {
    label: "THE MARQUE",
    title: "OUR MODELS",

    featured: [
      {
        name:     "PHANTOM",
        tagline:  "The Pinnacle of Luxury",
        desc:     "The definitive luxury motor car. Phantom is the signature Rolls-Royce, a series of firsts — a car born of the pursuit of perfection.",
        ctaText:  "EXPLORE PHANTOM",
        ctaHref:  "#",
        imageKey: "phantom",            // matches SITE_CONTENT.images key
        imageAlt: "Rolls-Royce Phantom",
      },
      {
        name:     "SPECTRE",
        tagline:  "The First Fully Electric Rolls-Royce",
        desc:     "An ultra-luxury electric super coupé that redefines the boundaries of possibility. The future of Rolls-Royce is electric.",
        ctaText:  "EXPLORE SPECTRE",
        ctaHref:  "#",
        imageKey: "spectre",
        imageAlt: "Rolls-Royce Spectre",
      },
    ],

    grid: [
      {
        name:     "GHOST",
        tagline:  "Post Opulent",
        desc:     "The purest expression of Rolls-Royce. A motor car that distils complexity to create something wonderfully effortless.",
        ctaText:  "EXPLORE GHOST",
        ctaHref:  "#",
        imageKey: "ghost",
        imageAlt: "Rolls-Royce Ghost",
      },
      {
        name:     "CULLINAN SERIES II",
        tagline:  "Effortless, Everywhere",
        desc:     "The most versatile super-luxury SUV in the world — commanding every landscape with absolute authority.",
        ctaText:  "EXPLORE CULLINAN",
        ctaHref:  "#",
        imageKey: "cullinan",
        imageAlt: "Rolls-Royce Cullinan Series II",
      },
      {
        name:     "BLACK BADGE",
        tagline:  "The Alter Ego",
        desc:     "For those who dare. The darker, more assertive expression of Rolls-Royce motor cars.",
        ctaText:  "EXPLORE BLACK BADGE",
        ctaHref:  "#",
        imageKey: "blackbadge",
        imageAlt: "Rolls-Royce Black Badge",
      },
    ],
  },

  /* ─────────────────────────────────────────────────────────────────────────
     BESPOKE SECTION
     ───────────────────────────────────────────────────────────────────────── */
  bespoke: {
    subtitle: "YOUR VISION, OUR CRAFT",
    title:    "BESPOKE",
    desc:     "Every Rolls-Royce is as unique as its owner. Our Bespoke programme invites you to imagine, and then makes the impossible, possible. From hand-painted coachlines to starlight headliners with over 1,600 fibre-optic lights, no request is too ambitious.",
    ctaText:  "COMMISSION YOURS",
    ctaHref:  "#",
  },

  /* ─────────────────────────────────────────────────────────────────────────
     WHISPERS SECTION
     ─ Add or remove cards freely — the page rebuilds automatically
     ───────────────────────────────────────────────────────────────────────── */
  whispers: {
    label: "AN EXCLUSIVE COMMUNITY",
    title: "WHISPERS",
    desc:  "Whispers is a digital ecosystem dedicated exclusively to Rolls-Royce clients. Members gain privileged access to extraordinary experiences, curated events, and unparalleled lifestyle content.",

    cards: [
      {
        title:    "CURATED EXPERIENCES",
        desc:     "Access the world's most exclusive events, from private art viewings to Michelin-starred culinary experiences.",
        ctaText:  "DISCOVER",
        imageKey: "whisperExperiences",
        imageAlt: "Curated Experiences",
      },
      {
        title:    "BESPOKE JOURNEYS",
        desc:     "Discover extraordinary travel destinations handpicked by our lifestyle connoisseurs.",
        ctaText:  "DISCOVER",
        imageKey: "whisperJourneys",
        imageAlt: "Bespoke Journeys",
      },
      {
        title:    "THE SPIRIT OF ECSTASY",
        desc:     "Explore the heritage, artistry, and philosophy that define the Rolls-Royce marque.",
        ctaText:  "DISCOVER",
        imageKey: "whisperEcstasy",
        imageAlt: "The Spirit of Ecstasy",
      },
    ],

    bottomCtaText: "LEARN MORE",
    bottomCtaHref: "#",
  },

  /* ─────────────────────────────────────────────────────────────────────────
     FOOTER
     ───────────────────────────────────────────────────────────────────────── */
  footer: {
    quote:       "\u201CStrive for perfection in everything you do.\u201D",
    quoteAuthor: "\u2014 SIR HENRY ROYCE",

    columns: [
      {
        title: "MODELS",
        links: [
          { text: "Phantom",          href: "#" },
          { text: "Spectre",          href: "#" },
          { text: "Ghost",            href: "#" },
          { text: "Cullinan Series II", href: "#" },
          { text: "Black Badge",      href: "#" },
        ],
      },
      {
        title: "OWNERSHIP",
        links: [
          { text: "Financial Services",    href: "#" },
          { text: "Provenance Pre-Owned",  href: "#" },
          { text: "Accessories",           href: "#" },
          { text: "Service & Maintenance", href: "#" },
        ],
      },
      {
        title: "BESPOKE",
        links: [
          { text: "Bespoke Programme", href: "#" },
          { text: "Gallery",           href: "#" },
          { text: "Commissioning",     href: "#" },
          { text: "Inspiration",       href: "#" },
        ],
      },
      {
        title: "ABOUT",
        links: [
          { text: "Our Story",                href: "#" },
          { text: "The Home of Rolls-Royce",  href: "#" },
          { text: "Press",                    href: "#" },
          { text: "Careers",                  href: "#" },
          { text: "Contact",                  href: "#" },
        ],
      },
    ],

    social: [
      { text: "INSTAGRAM", href: "#" },
      { text: "FACEBOOK",  href: "#" },
      { text: "X",         href: "#" },
      { text: "YOUTUBE",   href: "#" },
      { text: "LINKEDIN",  href: "#" },
    ],

    brandMark: "ROLLS-ROYCE",
    legal:     "\u00A9 Copyright Rolls-Royce Motor Cars Limited 2024. All rights reserved.",
  },
};


/* ═══════════════════════════════════════════════════════════════════════════
   RENDER ENGINE — Applies SITE_CONTENT to the page
   ═══════════════════════════════════════════════════════════════════════════
   You should NOT need to edit anything below this line.
   It reads the object above and writes it into the DOM.
   ═══════════════════════════════════════════════════════════════════════════ */

(function applyContent() {
  "use strict";

  var C = SITE_CONTENT;
  var img = C.images;

  /* ── Helper: shorthand for querySelector ────────────────────────────── */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return (root || document).querySelectorAll(sel); }

  /* ── Helper: set text if element exists ─────────────────────────────── */
  function setText(sel, text, root) {
    var el = $(sel, root);
    if (el) el.textContent = text;
  }

  /* ── Helper: set innerHTML if element exists ────────────────────────── */
  function setHTML(sel, html, root) {
    var el = $(sel, root);
    if (el) el.innerHTML = html;
  }

  /* ── Helper: set attribute if element exists ────────────────────────── */
  function setAttr(sel, attr, val, root) {
    var el = $(sel, root);
    if (el) el.setAttribute(attr, val);
  }

  /* ── CSS Custom Properties (image paths) ─────────────────────────────
     Dynamically sets --img-<key> for EVERY entry in SITE_CONTENT.images
     so adding a new image key automatically creates its CSS variable.  */
  var root = document.documentElement;
  Object.keys(img).forEach(function (key) {
    root.style.setProperty("--img-" + key, "url('" + img[key] + "')");
  });
  /* Also map whisper cards to numbered vars for the CSS fallback bg */
  C.whispers.cards.forEach(function (card, i) {
    root.style.setProperty("--img-whisper" + (i + 1), "url('" + (img[card.imageKey] || "") + "')");
  });

  /* ─────────────────────────────────────────────────────────────────────
     NAVIGATION
     ───────────────────────────────────────────────────────────────────── */
  setText(".nav__brand-name", C.nav.brandName);
  setText(".nav__brand-tagline", C.nav.brandTagline);
  setText("#menuOpen", C.nav.menuLabel);
  setText("#menuClose", C.nav.closeLabel);
  setText(".menu-overlay__brand-mark", C.nav.brandMark);

  var menuLinksContainer = $(".menu-overlay__links");
  if (menuLinksContainer) {
    menuLinksContainer.innerHTML = C.nav.links.map(function (link, i) {
      return '<a href="' + link.href + '" class="menu-overlay__link" style="transition-delay:' + (0.15 + i * 0.08) + 's">' + link.text + '</a>';
    }).join("");
  }

  /* ─────────────────────────────────────────────────────────────────────
     HERO
     ───────────────────────────────────────────────────────────────────── */
  setText(".hero__subtitle", C.hero.subtitle);
  setText(".hero__title", C.hero.title);
  setText(".hero__scroll-text", C.hero.scrollText);

  var heroCta = $(".hero__cta");
  if (heroCta) {
    heroCta.textContent = C.hero.ctaText;
    heroCta.href = C.hero.ctaHref;
  }

  var heroImg = $(".hero__bg-image");
  if (heroImg) {
    heroImg.src = img.hero;
    heroImg.alt = C.hero.imageAlt;
  }

  /* ─────────────────────────────────────────────────────────────────────
     MODELS
     ───────────────────────────────────────────────────────────────────── */
  setText(".models__label", C.models.label);
  setText(".models__title", C.models.title);

  /* — Build featured cards ———————————————————————————————————————————— */
  var featuredWrap = $(".models__featured");
  if (featuredWrap) {
    featuredWrap.innerHTML = C.models.featured.map(function (m, i) {
      var imgSrc = img[m.imageKey] || "";
      return (
        '<div class="model-card model-card--large reveal" style="--delay:' + (i * 0.15) + 's">' +
          '<div class="model-card__image-wrap" style="--card-bg:var(--img-' + m.imageKey + ')">' +
            '<img class="model-card__image" src="' + imgSrc + '" alt="' + m.imageAlt + '" loading="lazy" onerror="this.style.display=\'none\'">' +
            '<div class="model-card__image-overlay"></div>' +
          '</div>' +
          '<div class="model-card__body">' +
            '<h3 class="model-card__name">' + m.name + '</h3>' +
            '<p class="model-card__tagline">' + m.tagline + '</p>' +
            '<p class="model-card__desc">' + m.desc + '</p>' +
            '<a href="' + m.ctaHref + '" class="model-card__cta">' + m.ctaText + ' <span class="model-card__cta-line"></span></a>' +
          '</div>' +
        '</div>'
      );
    }).join("");
  }

  /* — Build grid cards ———————————————————————————————————————————————— */
  var gridWrap = $(".models__grid");
  if (gridWrap) {
    gridWrap.innerHTML = C.models.grid.map(function (m, i) {
      var imgSrc = img[m.imageKey] || "";
      return (
        '<div class="model-card model-card--small reveal" style="--delay:' + (i * 0.12) + 's">' +
          '<div class="model-card__image-wrap" style="--card-bg:var(--img-' + m.imageKey + ')">' +
            '<img class="model-card__image" src="' + imgSrc + '" alt="' + m.imageAlt + '" loading="lazy" onerror="this.style.display=\'none\'">' +
            '<div class="model-card__image-overlay"></div>' +
          '</div>' +
          '<div class="model-card__body">' +
            '<h3 class="model-card__name">' + m.name + '</h3>' +
            '<p class="model-card__tagline">' + m.tagline + '</p>' +
            '<p class="model-card__desc">' + m.desc + '</p>' +
            '<a href="' + m.ctaHref + '" class="model-card__cta">' + m.ctaText + ' <span class="model-card__cta-line"></span></a>' +
          '</div>' +
        '</div>'
      );
    }).join("");
  }

  /* ─────────────────────────────────────────────────────────────────────
     BESPOKE
     ───────────────────────────────────────────────────────────────────── */
  setText(".bespoke__subtitle", C.bespoke.subtitle);
  setText(".bespoke__title", C.bespoke.title);
  setText(".bespoke__desc", C.bespoke.desc);

  var bespokeCta = $(".bespoke__cta");
  if (bespokeCta) {
    bespokeCta.innerHTML = C.bespoke.ctaText + ' <span class="bespoke__cta-line"></span>';
    bespokeCta.href = C.bespoke.ctaHref;
  }

  /* ─────────────────────────────────────────────────────────────────────
     WHISPERS
     ───────────────────────────────────────────────────────────────────── */
  setText(".whispers__label", C.whispers.label);
  setText(".whispers__title", C.whispers.title);
  setText(".whispers__desc", C.whispers.desc);

  /* — Build whisper cards ————————————————————————————————————————————— */
  var whispersCardsWrap = $(".whispers__cards");
  if (whispersCardsWrap) {
    whispersCardsWrap.innerHTML = C.whispers.cards.map(function (card, i) {
      var imgSrc = img[card.imageKey] || "";
      var cssVarName = "--img-whisper" + (i + 1);
      return (
        '<div class="whisper-card reveal" style="--delay:' + (i * 0.15) + 's">' +
          '<div class="whisper-card__image-wrap" style="--card-bg:var(' + cssVarName + ')">' +
            '<img class="whisper-card__image" src="' + imgSrc + '" alt="' + card.imageAlt + '" loading="lazy" onerror="this.style.display=\'none\'">' +
            '<div class="whisper-card__overlay"></div>' +
          '</div>' +
          '<div class="whisper-card__body">' +
            '<h4 class="whisper-card__title">' + card.title + '</h4>' +
            '<p class="whisper-card__desc">' + card.desc + '</p>' +
            '<span class="whisper-card__cta">' + card.ctaText + ' <span class="whisper-card__cta-line"></span></span>' +
          '</div>' +
        '</div>'
      );
    }).join("");
  }

  var bottomCta = $(".whispers__cta-btn");
  if (bottomCta) {
    bottomCta.innerHTML = C.whispers.bottomCtaText + ' <span class="whispers__cta-line"></span>';
    bottomCta.href = C.whispers.bottomCtaHref;
  }

  /* ─────────────────────────────────────────────────────────────────────
     FOOTER
     ───────────────────────────────────────────────────────────────────── */
  setText(".footer__tagline", C.footer.quote);
  setText(".footer__tagline-author", C.footer.quoteAuthor);
  setText(".footer__brand-mark", C.footer.brandMark);
  setText(".footer__legal", C.footer.legal);

  /* — Build footer columns ———————————————————————————————————————————— */
  var columnsWrap = $(".footer__columns");
  if (columnsWrap) {
    columnsWrap.innerHTML = C.footer.columns.map(function (col, i) {
      var linksHTML = col.links.map(function (link) {
        return '<li><a href="' + link.href + '">' + link.text + '</a></li>';
      }).join("");
      return (
        '<div class="reveal" style="--delay:' + ((i + 1) * 0.1) + 's">' +
          '<h4 class="footer__col-title">' + col.title + '</h4>' +
          '<ul class="footer__col-links">' + linksHTML + '</ul>' +
        '</div>'
      );
    }).join("");
  }

  /* — Build social links —————————————————————————————————————————————— */
  var socialWrap = $(".footer__social");
  if (socialWrap) {
    socialWrap.innerHTML = C.footer.social.map(function (s) {
      return '<a href="' + s.href + '">' + s.text + '</a>';
    }).join("");
  }

  /* ─────────────────────────────────────────────────────────────────────
     RE-INIT SCROLL REVEAL FOR DYNAMICALLY ADDED ELEMENTS
     ───────────────────────────────────────────────────────────────────── */
  var revealEls = $$(".reveal, .reveal-scale");
  if (window.IntersectionObserver) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "-40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ── Re-bind menu overlay links after rebuild ───────────────────────── */
  var menuOverlay = document.getElementById("menuOverlay");
  if (menuOverlay) {
    var newMenuLinks = menuOverlay.querySelectorAll(".menu-overlay__link");
    newMenuLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        menuOverlay.classList.remove("open");
        document.body.classList.remove("menu-open");
      });
    });
  }

})();
