# INCOMPLETE — kimbrandesign.com rebuild spec

This spec is partial. See `## Gaps` at the bottom for exactly what is missing and how to recover it. Everything below is captured from:

- static analysis of `css styles.txt`
- Playwright runtime capture on 2026-04-22 at `https://kimbrandesign.com/` (see `capture/runtime-data.json`, `capture/rendered-dom.html`, `capture/screenshots/`)

Assets: all referenced images and fonts are in `assets/`.
Copy: all verbatim user-facing text is in `copy.md`.

---

## 1. Site Overview

- **TARGET_URL**: https://kimbrandesign.com/
- **Detected frameworks / libraries**:
  - **Astro 5.16.6** (SSG; `<meta name="generator">` + `data-astro-cid-*` attributes on 21 unique scoped components)
  - **Lenis** smooth scroll (confirmed — `html.lenis.lenis-scrolling` class present in rendered DOM; instance not exposed on `window`, so Lenis options could not be introspected)
  - **Astro custom elements** (Web Components): `kim-signature`, `kim-sticky-nav`, `kim-service`, `kim-work`, `kim-faq`, `kim-snackbar`
  - **GSAP / ScrollTrigger**: not present on `window` at capture time, but `div.pin-spacer` wrapper elements appear in the DOM (signature of ScrollTrigger pinning) — library is likely bundled + tree-shaken out of the global scope. See `## Gaps`.
  - Not detected (explicitly checked): Webflow, Framer, Wix, Squarespace, Next.js, Tailwind, Bootstrap, Framer Motion, AOS, Swiper, emotion/styled-components.
- **Tech stack verdict**: Astro static build with hand-rolled Web Components, Lenis-driven smooth scroll, and ScrollTrigger-style pinning on hero/services — dressed in vanilla BEM CSS with self-hosted woff/woff2 fonts.
- **Overall page structure** (top-level body children, in order as rendered):
  1. `<header class="header grid">` — brand logo + primary nav (pinned via `.pin-spacer`)
  2. `<section class="hero">` inside a `.pin-spacer` — full-viewport intro with H1
  3. `<section id="about" class="about grid">` — "Shaping the beauty of everyday brands"
  4. `<kim-sticky-nav class="sticky-nav">` — appears after hero
  5. `<section id="services" class="services">` — three pinned `<kim-service>` tiles
  6. `<section id="works" class="works">` — "Our work", 8 `<kim-work>` project tiles + 8 decorative SVGs
  7. `<section id="testimonies">` — 6 client quotes (inferred from copy; count confirmed in `copy.md`)
  8. `<section id="book">` — book/publication block (image-forward)
  9. `<section id="team">` — "A tailored team for each project."
  10. `<section id="club">` — Providence Club (dark block with CTA)
  11. `<section id="faqs">` — FAQ + "Our approach" — 10 `<details>/<summary>` accordions
  12. `<section id="contact">` — mailto CTA
  13. `<kim-snackbar class="snackbar">` — toast for "Email copied"

There is **no `<main>` element** (semantic count: 0). `<header>` ×1, `<nav>` ×1, `<section>` ×7 (only top-level sections counted by Playwright — real count is higher when you include nested sections), `<footer>` ×0 (footer content lives in the contact section + credit inline).

---

## 2. Design Tokens

Values come from computed styles sampled at viewport 1440×900 via Playwright. Where a token was not observable at the sample points, it is marked `[uncertain]`.

```
Colors:
  --color-bg-page:            #FFFFFF    /* rgb(255, 255, 255) — html/body background */
  --color-fg-default:         #0F0F0F    /* rgb(15, 15, 15)    — body text, theme-color meta */
  --color-fg-on-dark:         #FFFFFF    /* header text over dark hero, h3 display text */
  --color-accent-yellow:      [uncertain — visible in screenshots as a large saturated yellow block, hex not sampled; likely ~#FFE017 / #FFE600 from the reference screenshot]
  --color-club-dark:          [uncertain — Club section background appears deep navy/black]
  --color-divider:            rgba(0, 0, 0, 0)    /* section backgrounds are transparent over page bg */

Typography:
  --font-primary:   "DM Sans"         self-hosted woff2+woff, weights 200 / 300 / 400 / 700, normal + italic
  --font-secondary: "Testimonia"      self-hosted woff2, display/script — used for H2/H3 in services, about heading
  --font-tertiary:  "Marcellus"       self-hosted woff2, serif — usage context [uncertain], likely testimonies/quotes
  Fallback stack: Arial, sans-serif (size-adjusted via Astro `size-adjust: 105.2039%` to match metrics)
  font-display: swap (all faces)

  Scale observed (from computed font-size samples):
    16 (html default)
    20 (body, nav)
    40 (about H2 — Testimonia)
    60 (hero H1 — DM Sans weight 200)
    300 (services H3 — Testimonia, display)

  Line heights observed:
    18.4 / 24 / 32 / 72 / 180 (px)

  Weights used: 200, 400  [300, 700 loaded but usage at sampled selectors not confirmed]

Spacing:
  Padding observed on header: 30px 10px 0px
  Margins observed on H2 about: -20px 0 0
  No unified numeric spacing scale was declared as CSS custom properties.
  Inferred scale from rect positions: 10 / 20 / 30 / … — [uncertain beyond header + H2]

Radii:
  0 (default for sampled elements)   — no radii > 0 sampled on hero/about/h1/h2/h3/header/nav.

Shadows:
  none observed on any sampled selector (box-shadow: none; text-shadow: none everywhere sampled)

Breakpoints:
  NONE detected in the local CSS dump via `@media` scan. The build emits no `@media` rules, so the site relies on:
    - fluid CSS Grid (77 grid declarations vs 15 flex)
    - inline responsive `srcset` on `<img>` (Astro image handling)
    - viewport-proportional units (vw/vh) [inferred — not proven from sampling]
  → Mobile behavior is [uncertain]. See `## Gaps`.
```

**Tokens that exist as CSS custom properties in the source** (from static analysis):
```
--font-primary    /* DM Sans */
--font-secondary  /* Testimonia */
--font-tertiary   /* Marcellus */
--fit             /* object-fit hint: contain | cover */
--pos             /* background-position hint: center | left top | right top */
--progress        /* runtime scroll-progress variable — 0..1 */
--background      /* url(/_astro/Background.BtFVN-l5.jpg) */
```

No color CSS variables were defined — colors are hard-coded in rule bodies.

---

## 3. Section-by-Section Breakdown

### 3.1 Header + primary nav
```
Structure:
  header.header.grid
    .pin-spacer
      .header__content
        span.header__logo        "KIMBRANDESIGN"
        nav
          ul (implicit — rendered as flat links)
            a[href="#about"]     "ABOUT"
            a[href="#services"]  "SERVICES"
            a[href="#works"]     "WORK"
            a[href="#team"]      "TEAM"
            a[href="#club"]      "CLUB"
            a[href="#contact"]   "CONTACT"
Layout: position: absolute, top:0, left:0, right:0; display: grid; padding: 30px 10px 0;
        color: #FFFFFF (readable over dark hero); z-index: 2
Copy: see copy.md § Header / Nav
Assets: none (text + inline SVG marks only)
Animations: references Animation Catalog 4.1 (header pin via .pin-spacer)
```

### 3.2 Hero
```
Structure:
  .pin-spacer
    section.hero   (display:flex; position switches fixed→static across scroll, see 4.2)
      img.hero__background       src=Hero.Bwo3F92J_Z4vX3r.webp
      .hero__content
        span.hero__deco  ×3      (decorative overlay glyphs, likely Testimonia characters)
        h1                       "Branding / with / soul, / strategy / & / impact"
Layout: full viewport (100vw × 100vh); H1 at roughly y=818 of 900-tall viewport (bottom-aligned).
        H1 is 60px / line-height 72px / DM Sans weight 200 / white.
Copy: see copy.md § Hero
Assets: Hero.Bwo3F92J_Z4vX3r.webp (426 KB, largest single asset — hero background)
Animations: 4.1 (header pin), 4.2 (hero pin/fixed-to-static)
```

### 3.3 About
```
Structure:
  section#about.about.grid
    .about__images.grid
      .about__image > img    About_01.webp
      .about__image > img    About_02.webp
      h2                     "Shaping the beauty of everyday brands"
    .about__description
      svg.about__deco        (ornamental flourish)
      p  × 5                 body paragraphs (5)
      kim-signature.signature > svg   (hand-signature SVG)
Layout: CSS grid — images + H2 on left column, description + signature on right column [inferred].
        H2 uses Testimonia at 40px/32px, rotated -8° via matrix(0.990269, -0.13917, …), color #0F0F0F on white bg.
Copy: see copy.md § About
Assets: About_01.ZXzuB3eg_Z2e5j5Y.webp, About_02.Di9Nhm44_ZeCWQd.webp
Animations: 4.3 (about H2 rotation + scroll-linked translateY reveal)
```

### 3.4 Sticky nav
```
Structure:
  kim-sticky-nav.sticky-nav
    ul.navigation
      li > a[href="#about"]      "About"
      li > a[href="#services"]   "Services"
      li > a[href="#works"]      "Work"
      li > a[href="#team"]       "Team"
      li > a[href="#club"]       "Club"
      li > a[href="#contact"]    "Contact"
Layout: fixed or sticky vertical nav that appears after user scrolls past the hero [inferred from component name and position in DOM].
        Appears in rendered DOM between About and Services sections.
Copy: see copy.md § Sticky nav
Assets: none
Animations: 4.4 (sticky-nav reveal)
```

### 3.5 Services
```
Structure:
  section#services.services
    .services__list
      .pin-spacer > kim-service.service    ×3
        (each service: h3 display text + descriptive body + large product/visual)
Layout: vertically stacked pinned tiles. Each `.pin-spacer` pins its inner `kim-service` for a scroll distance,
        enabling a "sticky reveal" sequence. Each H3 uses Testimonia at 300px/180px — an extremely large display treatment, rotated -8°, color #FFFFFF (tiles appear on dark backgrounds per screenshots).
Copy: see copy.md § Services (three tiles: brand strategy / brand creation / brand activation)
Assets:
  brand_strategy.w0hVrqaj_ZOdHpX.webp      (261 KB)
  brand_creation.O16Mg-Jj_ZWaRav.webp      (379 KB)
  brand_engagement.DKpNVKw7_nhULk.webp     (64 KB)   ← NOTE: filename says "engagement" but copy says "brand activation". [uncertain — likely legacy rename]
Animations: 4.5 (services sequential pin + parallax; translateY +1800 between pct 0→0.25 then locked)
```

### 3.6 Works
```
Structure:
  section#works.works
    h2                          "Our work"
    .works__decos > svg.works__deco  ×8   (small ornamental flourishes scattered around grid)
    .works__list
      kim-work.work.grid   ×8   (each project tile is a custom element with its own 4-cell grid)
Layout: CSS grid; 8 project tiles; each kim-work renders 4 grid children internally.
        Each tile contains: project images (3–7 per project), H3 tagline in Testimonia, tag list.
Copy: see copy.md § Works (8 projects — Cavaillès, Laboratoires de Biarritz, Danone, DIM, Club Med, Milton, Gucci, Tissot)
Assets: (67 product/lifestyle images, grouped by project prefix — see Asset Manifest § Works)
Animations: 4.6 (per-tile reveal on scroll — inferred), 4.7 (decorative SVG parallax — inferred)
```

### 3.7 Testimonies
```
Structure:
  section#testimonies
    h2                          "In their words"
    .testimony   ×6             (each: quote + avatar + attribution + role + company)
Layout: [uncertain] — likely a stacked or carousel layout. Custom-element markup suggests one-at-a-time display with scroll-driven advancement.
Copy: see copy.md § Testimonies (6 quotes)
Assets: 6 portrait webps — Lidia_Mola, Delphine_Logereau, Jerome_Goarnisson, Stephanie_Eyherabide, Frederic_Chivrac, Florence_Bauduin
Animations: 4.8 (testimony advance — inferred, details [uncertain])
```

### 3.8 Book
```
Structure:
  section#book
    [primary visual: Book.BPeCBdEJ_1PjYzs.webp — 173 KB]
Layout: image-forward block. [uncertain] whether there is accompanying body copy.
Copy: see copy.md § Book (gap flagged)
Assets: Book.BPeCBdEJ_1PjYzs.webp
Animations: 4.9 (book fade/reveal — inferred)
```

### 3.9 Team
```
Structure:
  section#team
    h2                          "A tailored team for each project."
    .team__grid                 — portrait cells for named contributors
Layout: grid of person cards. Names observed: Anissa, Anne, Stéphane, May, Cécile, Florence, Chloé, Guillaume, Hugo.
        Tagline observed: "Sustainability is responsibility." [context uncertain]
Copy: see copy.md § Team (per-person role + bio flagged as gap)
Assets: Works_Kim.BBNA_L4q_ZNRXfX.webp (portrait of Kim, used elsewhere too) — per-person portraits not positively mapped.
Animations: 4.10 (team card reveal — inferred)
```

### 3.10 Club
```
Structure:
  section#club
    [background: Club.DXZn1Moc_d1OLj.webp — 191 KB, dark architectural/location photo]
    h2                          "Providence club"
    subtitle                    "Hotel Eldorado, Paris"
    body paragraphs             (6 short paragraphs — see copy.md)
    .club__link.btn             "REQUEST ACCESS"  → mailto:ksentis@kimbrandesign.com
Layout: full-bleed dark photographic block; light text overlay; CTA button bottom.
Copy: see copy.md § Club
Assets: Club.DXZn1Moc_d1OLj.webp
Animations: 4.11 (club parallax background + text fade — inferred)
```

### 3.11 FAQs
```
Structure:
  section#faqs
    h2                          "FAQ"
    subheading/eyebrow          "Our approach"
    kim-faq + <details>   ×10   (each: <summary> question ; answer body)
Layout: stacked accordion list. `<summary>` is the trigger; the native `<details>` disclosure toggles the answer.
Copy: see copy.md § FAQs (10 Q&As)
Assets: none
Animations: 4.12 (FAQ expand — details element; height transition likely JS-augmented)
```

### 3.12 Contact + Footer
```
Structure:
  section#contact
    h2 or heading               "Contact Us" [uncertain label]
    .contact__link.btn          "CONTACT US" → mailto:ksentis@kimbrandesign.com
  (inline footer links — not inside a <footer> element)
    a.btn[href="/Legals.pdf"]   "LEGALS"
    a.btn[href="https://ocitocine.com"]  "SITE BY OCITOCINE"
  kim-snackbar.snackbar          toast: "Email copied"
Layout: [uncertain — likely centered CTA block]
Copy: see copy.md § Contact / Footer
Assets: none
Animations: 4.13 (snackbar slide-in on email copy)
```

---

## 4. Animation Catalog

> **Caveat**: GSAP was not exposed on `window` at capture time, so per-tween durations and easing curves could not be introspected. Every entry below is inferred from (a) the presence of `div.pin-spacer` wrappers (a ScrollTrigger signature), (b) computed-style deltas across 5 scroll positions, and (c) static CSS analysis. Durations and eases marked `[uncertain]` need DevTools Performance-tab capture to pin down.

### 4.1 Header pin (full-page)
The header is wrapped in `.pin-spacer` — a ScrollTrigger-produced wrapper that preserves layout flow while its child is pinned. The header visually stays at the top of the viewport while the page scrolls under it.

```js
scrollTrigger({
  trigger: '.header',
  start: 'top top',
  end: 'bottom top',       // pins for the full page scroll [uncertain end value]
  pin: true
})
```
Scroll-linked: yes (pin only, no scrub).
Smooth-scroll integration: Lenis (detected).

### 4.2 Hero pin / fixed-to-static release
Observed: `.hero` reports `position: fixed; transform: translateY(0)` at scroll pct 0, then `position: static; transform: translateY(900.001px)` at scroll pct 0.25+. The exact 900px offset equals one viewport height, confirming a pin that lasts for the duration of one screen of scroll before handing off to normal flow.

```js
scrollTrigger({
  trigger: '.hero',
  start: 'top top',
  end: '+=100%',           // pin for one viewport height
  pin: true,
  scrub: false             // no scrub — discrete pin release, not linked translation
})
```
Trigger: page scroll.
Target selectors: `.hero`.
Notes: the visual continuity between fixed and static phases is handled by a translateY(+900px) transform that exactly compensates for the 1-viewport scroll distance.

### 4.3 About H2 rotation + scroll-linked reveal
The about section H2 ("Shaping the beauty of everyday brands") is rotated −8° and moves on scroll.

- Rotation: `matrix(0.990269, -0.13917, 0.13917, 0.990269, …)` → atan2(-0.13917, 0.990269) ≈ **−8.00°**, scale 1.0. The rotation is static (present at every scroll position).
- TranslateY: +288px at pct 0 → −48px at pct 0.25 and held. Interpretation: the heading slides upward into place as the about section enters the viewport.

```js
// Static presentation:
gsap.set('#about h2', { rotation: -8 })

// Scroll reveal:
scrollTrigger({
  trigger: '#about',
  start: 'top bottom',     // when section top enters bottom of viewport
  end: 'top center',       // [uncertain — based on 288→-48 Y delta over early scroll window]
  scrub: true
})
  .from('#about h2', { y: 288, ease: 'none' })
```

Easing: cannot be confirmed. `[uncertain]` — if scrubbed, ease is effectively linear; if event-based, `power2.out` is the visually-matching guess for the fast-then-settle motion seen in screenshots.

### 4.4 Sticky nav reveal
`<kim-sticky-nav>` appears in the DOM between About and Services. It is not present (or not visible) in the hero's first-viewport screenshot but would logically become visible as the user scrolls past the hero. Exact appearance mechanism `[uncertain]` — likely `opacity: 0 → 1` + `translateY(-10px → 0)` triggered at a specific scroll threshold via a ScrollTrigger `toggleActions` config.

```js
scrollTrigger({
  trigger: '.hero',
  start: 'bottom top',
  toggleActions: 'play none none reverse'
})
  .from('.sticky-nav', { opacity: 0, y: -10, duration: 0.4, ease: 'power2.out' })
```

### 4.5 Services sequential pin
`#services .services__list` wraps each `kim-service` in its own `.pin-spacer`. The measured `.service` sample showed `translateY(0)` at pct 0 and `translateY(1800px)` at pct 0.25+ (`1800px` = 2 viewport heights). This matches a "three-panel scroll-through" pattern — each service tile pins for one screen of scroll while content (or H3 type) transitions, then unpins to reveal the next.

```js
document.querySelectorAll('.service').forEach((tile, i) => {
  scrollTrigger({
    trigger: tile,
    start: 'top top',
    end: '+=100%',
    pin: true,
    scrub: false            // [uncertain — might be scrubbed to animate the service H3 in/out]
  })
})
```
Scroll-linked: yes (pin per tile).
Note: the 1800px offset observed on `.service[0]` is a cumulative effect of the two preceding pins stacking.

### 4.6 Works tile reveals
Eight `<kim-work>` custom elements form the works grid. No per-instance sampling was captured, so reveal behavior is inferred. Pattern matches the site's overall vocabulary: on enter-viewport, tiles fade/slide in, possibly staggered.

```js
scrollTrigger({
  trigger: '.work',
  start: 'top 85%',
  toggleActions: 'play none none none'
})
  .from('.work', {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power2.out',
    stagger: 0.12          // [uncertain — stagger count depends on per-batch layout]
  })
```
`[uncertain]` — amplitude, duration, ease.

### 4.7 Works decorative SVG parallax
Eight `svg.works__deco` elements are scattered around the works grid. Behaviorally typical of this studio vocabulary: each flourishes translates at a different velocity as the user scrolls through the works section — a subtle parallax.

```js
document.querySelectorAll('.works__deco').forEach((el, i) => {
  gsap.to(el, {
    yPercent: -30 - i * 5, // [uncertain] individual offsets
    ease: 'none',
    scrollTrigger: {
      trigger: '#works',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  })
})
```
`[uncertain]` — exact per-element amplitudes.

### 4.8 Testimony advance
Six testimonies in `#testimonies`. No scroll-sample data for `.testimony`. Layout and behavior are `[uncertain]` — likely a swap/fade between quotes triggered by scroll position, or a single column scroll.

```js
// placeholder — needs DevTools capture
scrollTrigger({
  trigger: '#testimonies',
  start: 'top center',
  toggleActions: 'play none none reverse'
})
  .from('.testimony', { opacity: 0, y: 24, duration: 0.6, ease: 'power2.out', stagger: 0.15 })
```

### 4.9 Book reveal
Image-forward block; likely fade-in / scale on enter-viewport.

```js
scrollTrigger({
  trigger: '#book',
  start: 'top 80%',
  toggleActions: 'play none none none'
})
  .from('#book img', { opacity: 0, scale: 0.96, duration: 0.9, ease: 'power2.out' })
```
`[uncertain]`.

### 4.10 Team card reveal
Nine team members; likely staggered reveal on enter-viewport.

```js
scrollTrigger({
  trigger: '#team',
  start: 'top 85%'
})
  .from('#team .team__member', { opacity: 0, y: 30, stagger: 0.08, duration: 0.6, ease: 'power2.out' })
```
`[uncertain]`.

### 4.11 Club background parallax
Dark photographic block; club copy fades in while the background image scrubs. This vocabulary is near-universal for this layout style.

```js
scrollTrigger({
  trigger: '#club',
  start: 'top bottom',
  end: 'bottom top',
  scrub: true
})
  .to('#club .club__background', { yPercent: -20, ease: 'none' })
```
`[uncertain]` — amplitude guess only.

### 4.12 FAQ accordion expand
Standard `<details>/<summary>` disclosure, almost certainly augmented with JS to animate the answer's height (native `<details>` snaps open — the observed Astro component is a `kim-faq` custom element, implying JS augmentation).

```js
// When a <details> opens:
gsap.to(details.querySelector('.faq__answer'), {
  height: 'auto',
  duration: 0.4,
  ease: 'power2.inOut'
})
// When closing: height: 0 + reverse.
```
Trigger: click / keyboard activation on `<summary>`.
`[uncertain]` — exact animation duration/ease.

### 4.13 Snackbar toast
`<kim-snackbar class="snackbar">` renders "Email copied" when the user copies a mailto via UI. Typical pattern: slide up from bottom + fade out after a few seconds.

```js
// On email-copy event:
gsap.fromTo('.snackbar',
  { y: 40, opacity: 0 },
  { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' })
// Then after ~2.5s:
gsap.to('.snackbar', { y: 40, opacity: 0, duration: 0.3, ease: 'power2.in' })
```
Trigger: click on any `a[href^="mailto:"]` → clipboard copy → toast show. (Inferred — the site's interaction pattern.)

---

## 5. Scroll Behavior

- **Smooth scroll library**: **Lenis** (confirmed via `html.lenis.lenis-scrolling` class). Instance options could not be introspected because `window.Lenis` / `window.lenis` were both undefined — the library is bundled + module-scoped. Typical defaults for a site like this:
  ```js
  new Lenis({
    duration: 1.2,            // [uncertain]
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),  // [uncertain]
    smoothWheel: true,
    orientation: 'vertical',
    gestureOrientation: 'vertical'
  })
  ```
- **Scroll-linked animations** (references to Animation Catalog):
  - 4.1 Header pin (full-page)
  - 4.2 Hero pin (one viewport)
  - 4.3 About H2 scrubbed translateY + static −8° rotation
  - 4.5 Services sequential pins (one per tile, 3 total)
  - 4.7 Works decorative SVGs parallax (scrubbed)
  - 4.11 Club background parallax (scrubbed)
- **Scroll velocity effects**: none detected at sample points.
- **Snap points / section-locked scrolling**: no CSS `scroll-snap` declarations found in the source. Pinning provides a pseudo-snap feel on hero + services but the underlying scroll is continuous.
- **Pin sections**: header, hero, each of the three service tiles (`.pin-spacer` wrappers confirm — 5 `.pin-spacer` elements visible in the DOM skeleton).
- **Horizontal scroll**: none detected.

---

## 6. Asset Manifest

85 assets downloaded, total ≈ 3.4 MB. Local path is relative to repo root (`assets/`).

### Fonts (12 files, all in `assets/`)

| ID  | Type  | Original URL (Astro `/_astro/fonts/…`)                                    | Local Path                                              | Size (B)   | Used In              |
|-----|-------|---------------------------------------------------------------------------|---------------------------------------------------------|------------|----------------------|
| F1  | woff2 | /_astro/fonts/03b7cbddac9c3eb0.woff2                                      | assets/03b7cbddac9c3eb0.woff2                           | 39 804     | DM Sans (weight 200) |
| F2  | woff2 | /_astro/fonts/765d66fbb0991791.woff2                                      | assets/765d66fbb0991791.woff2                           | 36 980     | DM Sans (weight 400) |
| F3  | woff2 | /_astro/fonts/cd0acf0893b7ce08.woff2                                      | assets/cd0acf0893b7ce08.woff2                           | 14 272     | DM Sans (italic)     |
| F4  | woff2 | /_astro/fonts/ea89008166ecaf2a.woff2                                      | assets/ea89008166ecaf2a.woff2                           | 16 016     | Testimonia           |
| F5  | woff  | /_astro/fonts/062a3d73a3722636.woff                                       | assets/062a3d73a3722636.woff                            | 29 176     | DM Sans fallback     |
| F6  | woff  | /_astro/fonts/31be9ddde920ac08.woff                                       | assets/31be9ddde920ac08.woff                            | 22 856     | Marcellus            |
| F7  | woff  | /_astro/fonts/4302a682c7d921a0.woff                                       | assets/4302a682c7d921a0.woff                            | 26 744     | DM Sans              |
| F8  | woff  | /_astro/fonts/7895ba5fd3a797de.woff                                       | assets/7895ba5fd3a797de.woff                            | 26 228     | DM Sans              |
| F9  | woff  | /_astro/fonts/9491cd90228f492f.woff                                       | assets/9491cd90228f492f.woff                            | 25 132     | Marcellus (italic)   |
| F10 | woff  | /_astro/fonts/c991514f71c69373.woff                                       | assets/c991514f71c69373.woff                            | 27 964     | Testimonia fallback  |
| F11 | woff  | /_astro/fonts/cb668991ce8e6cd9.woff                                       | assets/cb668991ce8e6cd9.woff                            | 27 932     | —                    |
| F12 | woff  | /_astro/fonts/d0eaef4eda47b84b.woff                                       | assets/d0eaef4eda47b84b.woff                            | 28 836     | —                    |
| F13 | woff  | /_astro/fonts/dcb2480e1f266b67.woff                                       | assets/dcb2480e1f266b67.woff                            | 26 456     | —                    |

> `Used In` mappings above the first 4 are [uncertain — assigned by weight/size heuristic; verify via @font-face src matching before committing to variable names].

### Global / Page images

| ID  | Type | Local Path                                        | Size (B)    | Used In                  |
|-----|------|---------------------------------------------------|-------------|--------------------------|
| G1  | jpg  | assets/Background.BtFVN-l5.jpg                    | 133 908     | `--background` CSS var (global backdrop) |
| G2  | webp | assets/Hero.Bwo3F92J_Z4vX3r.webp                  | 426 534     | Hero `img.hero__background` |
| G3  | webp | assets/About_01.ZXzuB3eg_Z2e5j5Y.webp             |  12 422     | About column image 1     |
| G4  | webp | assets/About_02.Di9Nhm44_ZeCWQd.webp              |  11 190     | About column image 2     |
| G5  | webp | assets/brand_strategy.w0hVrqaj_ZOdHpX.webp        | 260 712     | Service tile 1           |
| G6  | webp | assets/brand_creation.O16Mg-Jj_ZWaRav.webp        | 378 578     | Service tile 2           |
| G7  | webp | assets/brand_engagement.DKpNVKw7_nhULk.webp       |  64 258     | Service tile 3 (copy: "brand activation") |
| G8  | webp | assets/Book.BPeCBdEJ_1PjYzs.webp                  | 173 480     | Book section             |
| G9  | webp | assets/Club.DXZn1Moc_d1OLj.webp                   | 191 280     | Club section background  |
| G10 | webp | assets/Works_Kim.BBNA_L4q_ZNRXfX.webp             |  12 364     | Works / About (Kim portrait) |

### Work project images (67 webp files, grouped by project prefix)

| Project                     | File count | Local files (prefix pattern)                                  |
|-----------------------------|-----------:|---------------------------------------------------------------|
| Cavaillès (Project 1)       |          7 | assets/Cavailles_01…07_*.webp                                 |
| Laboratoires de Biarritz (2)|          7 | assets/Labo_Biarritz_01…07_*.webp                             |
| Danone (3 — Symbiocene)     |          7 | assets/Danone_01…07_*.webp                                    |
| DIM (4)                     |          7 | assets/DIM_01…07_*.webp                                       |
| Club Med (5)                |          7 | assets/ClubMed_01…07_*.webp                                   |
| Milton (6)                  |          7 | assets/Milton_01…07_*.webp                                    |
| Gucci Beauty (7)            |          7 | assets/Gucci_01…07_*.webp                                     |
| Tissot (8)                  |          7 | assets/Tissot_01…07_*.webp                                    |

(Each project ships 7 images, numbered 01–07. Total 56. Plus 11 other kim-work-scoped assets — see `ls assets/`.)

### Testimony portraits (6 webp files)

| ID  | Local Path                                                 | Size (B) | Person / Role                                               |
|-----|------------------------------------------------------------|---------:|-------------------------------------------------------------|
| T1  | assets/Lidia_20Mola.BMMy8I31_SPM4H.webp                    |    5 842 | Lidia Mola — Managing Director at Bolton                    |
| T2  | assets/Delphine_20Logereau.BYEiqBig_Z2w0fp9.webp           |    5 212 | Delphine Logereau — Marketing Director at BOLTON            |
| T3  | assets/Jerome_20Goarnisson.BXff-HD2_1gqxtj.webp            |    2 482 | Jerome Goarnisson — Global VP Packaging at Revlon           |
| T4  | assets/Stephanie_20Eyherabide.DIWhZYe8_1sGvLE.webp         |    3 082 | Stephanie Eyherabide — COO at Laboratoires de Biarritz      |
| T5  | assets/Frederic_20Chivrac.DN6q_9Y9_rmYJV.webp              |    2 766 | Frederic Chivrac — Circularity Packaging director at Danone |
| T6  | assets/Florence_20Bauduin.cwvH_rM6_ZhxkDH.webp             |    2 636 | Florence Bauduin — Marketing director Parfums at Scent Beauty |

> `_20` in filenames decodes as the URL-encoded space (`%20`) from the original asset URL.

---

## 7. Copy Document

All verbatim copy extracted to `copy.md`, organized by section with heading hierarchy preserved. Consumers should reference it directly rather than duplicate strings here.

---

## 8. Interactive Elements

All triggers / responses below are inferred from the rendered DOM plus convention — exact durations and eases are `[uncertain]` (see § Gaps).

| Element                               | Trigger        | Visual response (inferred)                                      | Duration / ease   | State change                                   |
|---------------------------------------|----------------|-----------------------------------------------------------------|-------------------|------------------------------------------------|
| Header nav links (ABOUT/SERVICES/…)   | click          | smooth-scrolls to anchor via Lenis                              | Lenis-driven      | `window.location.hash` updates                 |
| Header nav links                      | hover          | color / underline change `[uncertain]`                          | ~200ms `[uncertain]` | inline style / class toggle                |
| Sticky nav links                      | click          | as above                                                        | as above          | as above                                       |
| Sticky nav appearance                 | scroll past hero | fade / slide in (Animation Catalog 4.4)                      | ~400ms `[uncertain]` | `.sticky-nav.is-visible` [inferred]       |
| "Ask Kim" `mailto:` link              | click          | opens mail client + copies email; triggers snackbar (4.13)      | 300ms in / 300ms out + ~2.5s hold | `<kim-snackbar>` show/hide       |
| "REQUEST ACCESS" button               | click          | opens `mailto:ksentis@kimbrandesign.com`                        | —                 | native mailto                                  |
| "CONTACT US" button                   | click          | as above                                                        | —                 | native mailto                                  |
| `.btn` hover                          | hover          | background/border/color transition `[uncertain]`                | ~200ms `[uncertain]` | class/inline style change                |
| `<summary>` (FAQ question)            | click / Enter  | toggles parent `<details>` open state; answer height animates in/out (Animation Catalog 4.12) | ~400ms [uncertain] | `[open]` attribute on `<details>` |
| Work tile                             | click `[uncertain]` | unknown — may open detail view, modal, or scroll-lock       | —                 | `[uncertain]`                                  |
| Email mailto (any)                    | click          | copy-to-clipboard side-effect + snackbar toast                  | as 4.13           | clipboard write + snackbar class               |
| `LEGALS` link                         | click          | opens `/Legals.pdf` in browser                                  | —                 | navigation                                     |
| `SITE BY OCITOCINE` link              | click          | opens `https://ocitocine.com`                                   | —                 | navigation (likely new tab)                    |

---

## 9. Responsive Behavior

**The source CSS contains zero `@media` queries.** This is the most surprising finding of the capture. Consequences for rebuild:

- The site relies entirely on fluid CSS Grid, intrinsic units (likely `vw`, `vh`, `clamp()`, `minmax()` — [uncertain without additional sampling at other viewports]), and Astro's `srcset`-based responsive images.
- Breakpoint-driven changes (stacking, nav hamburgers, font-size steps) — if they exist — are driven by container queries, JavaScript viewport listeners, or simply absent.
- **Mobile behavior was NOT captured** (viewport sampled only at 1440×900).

What this means for a rebuild:
- Default to fluid layout — `clamp()` for typography, `minmax()` for grid columns, `aspect-ratio` for images.
- Do not assume a hamburger nav exists on mobile unless re-captured.
- Hero H1 at 60px/line-height 72px will be huge on mobile without fluid sizing. Expect a `clamp(32px, 6vw, 60px)`-style pattern — [uncertain, needs re-capture].

**Action for a rebuild**: re-run `capture/playwright-script.js` with `VIEWPORT = { width: 375, height: 812 }` and a second pass at 768×1024 to populate this section. See § Gaps.

---

## 10. Rebuild Phases

A phased implementation plan for Claude Code to execute against this spec.

```
Phase 1 — Static layout (HTML skeleton, no styling)
  Done when: semantic HTML for all 13 top-level sections renders in source order,
  with the exact class names and ids from this spec (.header .hero .about #about,
  etc.), and every copy string from copy.md is inserted verbatim. No CSS, no JS.

Phase 2 — Design tokens + base styles (no animations)
  Done when: :root declares the custom properties from § 2, body uses DM Sans
  20px/24px on #FFFFFF with #0F0F0F text, H1 is 60px DM Sans weight 200, About
  H2 is 40px Testimonia, Services H3 is 300px Testimonia. Page is statically
  styled but static (no scroll effects, no Lenis yet).

Phase 3 — Copy + assets inserted
  Done when: every image in § 6 is wired up to its section from assets/, fonts
  from § 2 are self-hosted via @font-face, alt text is present for all images.
  The page looks like the reference screenshots at a single scroll position.

Phase 4 — Entry animations (load-triggered from Animation Catalog)
  Done when: any load-triggered animation from § 4 (if any — most on this site
  are scroll-triggered) fires on first paint. Given this site, this phase is
  mostly a no-op; consider folding into Phase 5.

Phase 5 — Scroll-linked animations
  Done when: Lenis is initialized, GSAP + ScrollTrigger are loaded, and all 13
  entries from § 4 are implemented. Verify against the 5 screenshots in
  capture/screenshots/ — the built page should match each at its scroll %.

Phase 6 — Interactive elements
  Done when: the 10 FAQ accordions animate open/close, the email copy-to-clipboard
  + snackbar works, nav smooth-scrolls via Lenis, hover states on .btn and links
  are implemented.

Phase 7 — Responsive polish
  Done when: the site holds up at 375×812, 768×1024, and 1920×1080 without
  capture data (this spec does not cover those breakpoints — see § Gaps).
  Expect to add fluid typography via clamp() and adjust grid column counts on
  small viewports.
```

---

## 11. AEO / AI-Visibility Readiness Notes

Passive capture only — no recommendations.

- **Schema.org markup present**: **none.** `document.querySelectorAll('script[type="application/ld+json"]')` returned zero entries. No microdata attributes sampled.
- **Heading hierarchy** (from rendered DOM):
  ```
  H1 (×1):
    Branding / with / soul, / strategy / & / impact
  H2 (×6):
    Shaping the beauty of everyday brands    (About)
    Our work                                 (Works)
    In their words                           (Testimonies)
    A tailored team for each project.        (Team)
    Providence club                          (Club)
    FAQ / Our approach                       (FAQs — contains a forced linebreak)
  H3 (×11):
    brand strategy
    brand creation
    brand activation
    The Power of Algae When the sensorial richness… (works tile taglines combine h3 with body)
    L'Art de Nourrir les Peaux Where rich care…
    The Symbiocene Where breakthrough biotechnology…
    Iconic since 1963 Where timeless simplicity…
    The Art of the Journey Where retail and spa…
    Protection You Can Trust Where expert care…
    The Guccification of Beauty Where self-expression…
    Give the Gift of Time Where the simple gesture…
  ```
  (H3s in the works section concatenate project name and teaser into a single heading — worth noting for semantic structure.)
- **FAQ / Q&A blocks present**: yes — 10 `<details>/<summary>` pairs in `#faqs`. No `FAQPage` schema.
- **Semantic HTML usage** (counts from rendered DOM):
  - `<header>`: 1
  - `<nav>`: 1
  - `<main>`: **0**
  - `<article>`: 0
  - `<section>`: 7 (top-level only — nested sections not tallied)
  - `<aside>`: 0
  - `<footer>`: **0**
  - Custom elements (`kim-*`): 6 distinct (see § 1)
- **Meta tags**:
  - `<title>`: "Kimbrandesign"
  - `<meta name="description">`: present (see copy.md)
  - `<meta name="generator">`: "Astro v5.16.6"
  - `<meta property="og:title">`, `og:type`, `og:url`, `og:description`: present
  - `<meta property="og:image">`: **empty** — not populated
  - `<meta property="og:image:alt">`: empty
  - `<meta name="twitter:*">`: not captured; [uncertain — none found in the og list]
  - `<link rel="canonical">`: [uncertain — not captured in dumped fields]
- **Root-level text files**:
  - `/robots.txt` → 200 OK, contents: `User-agent: *\nAllow: /` (permissive)
  - `/llms.txt` → **404**
  - `/ai.txt` → **404**
  - `/sitemap.xml` → **404**
- **Content chunking**:
  - Paragraphs: 90
  - Average paragraph length: 61 characters (very short — consistent with visual layout of fragmented lines rather than long-form prose)
  - Lists: 14 `<ul>`, 0 `<ol>`, 74 `<li>` total

---

## Gaps

Things this spec could not fully capture, and how to recover each:

1. **GSAP / ScrollTrigger tween details** — library is not on `window`. Exact durations, eases, stagger amounts, trigger start/end offsets, and pin start points are `[uncertain]`.
   - Recovery: open DevTools on the live site, Performance tab → record a full-page scroll → inspect the timings of transform mutations. Alternatively, unminify the bundled JS at `/_astro/*.js` and search for `gsap.` or `ScrollTrigger.create`.

2. **Lenis config** — detected via `html.lenis` class but `window.lenis` is undefined. Exact `duration`, `easing`, `wheelMultiplier`, `lerp` are `[uncertain]`.
   - Recovery: unminify the Lenis init module; or in DevTools Console, `Object.values` on module imports for the page's JS chunks.

3. **Responsive behavior** — captured only at 1440×900; source CSS has no `@media` queries, so the rebuild plan for Phase 7 lacks data.
   - Recovery: re-run `capture/playwright-script.js` with `VIEWPORT` set to `{width:375,height:812}` and `{width:768,height:1024}`. Compare computed styles for H1, services H3, nav, and hero.

4. **Colors beyond sampled selectors** — no accent yellow or dark club navy captured into computed-style samples. Reference screenshots confirm their existence but hex values are `[uncertain]`.
   - Recovery: open a screenshot in a color-picker tool (or Chromium's eyedropper) and read exact values. Likely candidates from the yellow: `#FFE600`, `#FDD700`, `#FFD000`.

5. **Per-instance scroll sampling** — the Playwright script samples only the first match per selector (`querySelectorAll(sel)[0]`). So "h2" across scroll positions tracked only the first H2 ("Shaping the beauty of everyday brands"), missing the 5 other H2s. Section-entry animations for Works/Testimonies/Team/Club/FAQs were therefore not directly observed.
   - Recovery: modify the script to iterate over `all` nodes and sample each by index (`Array.from(q).map((el, i) => …)`), then re-run. A templated patch is already obvious in the existing script at the `sampleStyles` helper.

6. **Team section content** — first names are visible in the rendered DOM but role + bio text could not be cleanly extracted (markup structure in the custom-element shadow-roots not fully traversed).
   - Recovery: inspect `#team` in DevTools, expand `<kim-team>` or equivalent custom element, and pull innerText for each card. Alternatively, view-source on the live page for the hydrated HTML.

7. **Book section content** — whether there is any body copy beyond the image is `[uncertain]`.
   - Recovery: view the `#book` section in DevTools; look for `<p>` or caption text.

8. **Contact section layout** — only the CTA button and email are confirmed. Whether there is a form, additional heading, or address is `[uncertain]`.
   - Recovery: inspect `#contact` in DevTools.

9. **Font → weight/style mapping** — 12 font files were downloaded but the mapping from file hash → family + weight + style is `[uncertain]` for half of them. The spec makes educated guesses by size but has not verified.
   - Recovery: inspect `@font-face` blocks in DevTools (Sources → Coverage, or inspect a rendered heading and read the resolved `font-family`). The capture script could be extended to `document.fonts.forEach(f => …)` to dump `FontFace` entries.

10. **Animation easing curves** — without GSAP introspection, no ease is verifiable. Entries in § 4 use `power2.out` / `power2.inOut` / `'none'` as plausible defaults matching the visual feel.
    - Recovery: DevTools Performance trace during a hero scroll; the timing-function at each animation frame can be reverse-engineered.

When any of the above is resolved, update the relevant section and remove the `[uncertain]` marker. If re-running Playwright at additional viewports, extend § 9 in-place.
