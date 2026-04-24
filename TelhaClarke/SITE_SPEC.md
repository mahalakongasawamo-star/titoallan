# SITE_SPEC — Telha Clarke (home page rebuild spec)

> INCOMPLETE — structure, tokens, copy, assets, and Lenis config are fully pinned. GSAP timelines and ScrollTrigger instances remain source-inferred because the bundle does not expose them on `window` and the `_gsap` cache objects GSAP leaves on animated elements are pure transform caches with no back-reference to the gsap module. Animation entries in §4 are labelled `[inferred]` where they were derived from source patterns rather than runtime introspection. See **Gaps** below.

## Gaps

| # | What is missing | Status | Why / How to recover |
|---|---|---|---|
| G1 | GSAP global timeline (every tween's targets, duration, ease, vars) | **OPEN** — inferred only | Cache hook recovered 223 elements with `_gsap` state, but GSAP's `GSCache2` objects hold only transform state (`id`, `target`, `harness`, `get`, `set`, `xPercent`, `x`, `yPercent`, `scaleX`, …), no `tweens[]` retained after completion, no `.parent` back-reference to `globalTimeline`. Only path remaining is route-intercepting `/wp-content/themes/gl/public/build/assets/app-*.js` to append `globalThis.gsap = <minified-gsap-binding>` — bundle-specific and brittle. |
| G2 | `ScrollTrigger.getAll()` (triggers, pin, scrub, start/end) | **OPEN** — inferred only | Same root cause as G1. Would need the same bundle patch to also expose `globalThis.ScrollTrigger = <minified-ST-binding>`. |
| G3 | Lenis config | **RESOLVED** — see §5 | Recovered at runtime via an object-shape sniffer (walk own properties of `#app`, `document.documentElement`, `document.body`, `window` looking for `{scrollTo, raf, options}`). Full options block captured in `capture/runtime-data.json.lenis.options`. |
| G4 | Scroll-linked transform deltas at checkpoints | **OPEN** — mitigated | The force-unlock (required because the loader never completes in headless without a user wheel event) prevents ScrollTrigger from re-binding to the scroll context, so transforms sampled at 0/25/50/75/100 stayed at fixed matrices. Mitigated by the `page.mouse.wheel()` prod now in the script which does unlock the loader naturally — but reacquisition still fails. Record on a headful browser with DevTools Performance to verify the deltas. |
| G5 | `[uncertain]` easing curves + specific magnitudes across §4 | **OPEN** | Blocked by G1/G2. Entries annotated `[inferred]` are educated reconstructions; entries annotated `[uncertain]` are best-guess magnitudes and need tuning. |

All other sections are complete.

### Confirmed at runtime (via `capture/playwright-script.js`)

- **GSAP present and running.** Diagnostic: 223 / 784 DOM elements carry a `_gsap` cache with classic 3.x keys (`id, target, harness, get, set, xPercent, x, yPercent, y, z, scaleX, scaleY, rotation, rotationX, rotationY, skewX, skewY, transformPerspective, zOrigin, yOffset, xOffset, force3D, renderTransform, uncache, svg`).
- **Lenis instance located**, options fully captured — see §5.
- **Web Components confirmed at runtime** (count in parentheses): `c-cover-home`(1), `c-parallax-image`(1), `c-about`(1), `c-subtitle`(2), `c-content`(4), `c-title`(1), `c-works`(1), `c-works-grid`(1), `c-vision`(1), `c-process`(1), `c-footer`(1), `c-newsletter`(1).
- **Taxi.js confirmed** via `[data-taxi]`/`[data-taxi-view]` presence.

---

## 1. Site Overview

- **TARGET_URL:** `https://telhaclarke.com.au/` (home page only)
- **Detected frameworks & libraries (Phase 1 + Phase 2 cross-checked):**
  - WordPress (custom theme in `wp-content/themes/gl/`)
  - Yoast SEO v25.7 (JSON-LD + meta output)
  - Vite-built ES modules (hashed filenames `app-Sq9rcrZY.css`, `app-xdznotNO.js`, chunked: `Vision-*.js`, `AnimationContext-*.js`, `WorksGrid-*.js`, `Mousemove-*.js`)
  - Tailwind CSS (observed utility classes: `grid-w`, `col-span-full`, `px-margin`, `gap-x-gutter`, `body-16`, `body-48`, `body-72`, `md:col-span-3`, `xl:col-start-7`, etc.)
  - **GSAP** (inferred — inline `translate: none; rotate: none; scale: none; transform: matrix(…);` is GSAP's signature)
  - **ScrollTrigger** (inferred — sticky + pinned sections `c-vision`, `c-works-grid` with `--height-multiplier` pattern)
  - **Lenis** (confirmed — `#app.lenis` + `#app.lenis-stopped` classes present)
  - **Taxi.js** (confirmed — `[data-taxi]` + `[data-taxi-view]` attributes on `<main>`)
  - Native **Web Components** (custom elements prefixed `c-`: `c-cover-home`, `c-parallax-image`, `c-about`, `c-subtitle`, `c-title`, `c-content`, `c-works`, `c-works-grid`, `c-vision`, `c-process`, `c-footer`, `c-newsletter`)
  - Google Tag Manager (`G-RV6THF0QP9`)
  - WP-native lazy loading (`img.lazy` + `data-src` + `data-ll-status`)
  - WP-native HTML Speculation Rules prefetch (`<script type="speculationrules">`)
- **Tech-stack verdict:** WordPress-served, Vite-bundled client with custom web components, Taxi.js page transitions, GSAP + ScrollTrigger for animation, and Lenis for smooth-scroll — single self-hosted font, tailwind-like utility CSS.
- **Overall page structure (top-level, in DOM order):**
  1. `.loader` (intro overlay, dismissed on first paint)
  2. `.fade` + `.frame` + `.page-overlay` (global transition layers)
  3. `header.header` (sticky top nav, logo + links + clock + location + Contact)
  4. `main#main[data-taxi]` → `div[data-taxi-view]` → `.home`
     1. `c-cover-home` (full-viewport hero, parallax image)
     2. `c-about` (`01 / Studio` — acknowledgement + offset headline + intro para)
     3. `c-works` (`02 / Selected Works` — three featured cards)
     4. `c-works-grid` (mosaic "All Work (28)" sticky link + decorative grid)
     5. `c-vision` (`03 / Vision` — sticky image with three swapping titles + paragraphs)
     6. `c-process` (`04 / Method` — seven process steps + paired image swap)
     7. sticky widget CTA (pulled from section metadata — "Discover")
  5. `footer.footer` (newsletter + sitemap + contact + credits) followed by a full-width sticky "TELHA CLARKE" wordmark slab

---

## 2. Design Tokens

```css
/* === Colors (extracted from computed styles + stylesheet rules) === */
--color-bg:            #ffffff;           /* page / app background */
--color-fg:            #000000;           /* primary text */
--color-inverse-bg:    #000000;           /* dark sections: hero, vision, footer-bottom-slab, mobile menu */
--color-inverse-fg:    #ffffff;           /* text on dark */
--color-mist:          #cacfcb;           /* muted grey-green — section numbers ("01"…), meta labels, disabled links, placeholder tone */
--color-accent-red:    #952c16;           /* dark rust red — observed in stylesheet; usage not visible on home page [uncertain usage] */

/* Transparency variants observed in rules */
--overlay-black-24:    rgba(0,0,0,0.24);   /* image-darkening overlay on hero + vision image */
--overlay-black-32:    rgba(0,0,0,0.32);
--overlay-black-52:    rgba(0,0,0,0.52);
--overlay-black-95:    rgba(0,0,0,0.95);
--overlay-white-12:    rgba(255,255,255,0.12);
--overlay-white-32:    rgba(255,255,255,0.32); /* .vision-line */
--overlay-white-52:    rgba(255,255,255,0.52); /* scroll cue opacity */
--overlay-mist-32:     rgba(202,207,203,0.32);

/* === Typography === */
--font-display: "Europa-Grotesk", sans-serif;      /* single family for everything */
--font-body:    "Europa-Grotesk", sans-serif;
/* One weight observed: 400. Font-display: swap. Source file: assets/Europa-Grotesk-No2-Medium-B7a8PlH0.woff2 */

/* Size scale — named by Tailwind utility `body-*`, values from computed styles */
--text-14:  14px; /* line-height 16.8px (1.2)  — subtitles, header links, uppercase labels */
--text-16:  16px; /* line-height 17.6px (1.1)  — base body */
--text-20:  20px; /* line-height 26px   (1.3)  — hero content sentence (md+) */
--text-24:  24px; /* footer "Talk to us…" (mobile) */
--text-32:  32px; /* md variant of process superscripts */
--text-36:  36px; /* mobile offset-title, process body-36 mobile */
--text-48:  48px; /* .cover-home-title-light default, .process-item */
--text-60:  60px; /* .vision-title (lg) */
--text-72:  72px; /* .offset-title (about) md+ */
--text-100: 100px; /* .works-item-title (lg) line-height 110px */
/* Breakpoint note: utility names like `body-36 md:body-48 lg:body-60 xl:body-72` indicate a 4-step responsive scale. */

/* Line heights observed */
--lh-1:    1.0;   /* 72/72 on .offset-title */
--lh-1_1:  1.1;   /* 16/17.6, 60/66, 100/110 */
--lh-1_2:  1.2;   /* 14/16.8, 48/57.6, process-item leading-[120%] */
--lh-1_3:  1.3;   /* 20/26   — hero body */

/* Weights used: 400 (single weight) */

/* === Spacing === */
/* CSS custom properties exposed on :root */
--margin:  2rem;   /* 32px  — horizontal page padding + vertical rhythm unit */
--gutter:  1rem;   /* 16px  — grid gap */
--vw:      1440px; /* captured; used as a sizing reference */
--vh:      calc(9px * 100); /* the site's iOS-safe custom vh; resolves to 900px on a 900-tall viewport */

/* Tailwind-style numeric spacing observed in class names (px units, arbitrary-value scale) */
/*   4 / 8 / 10 / 12 / 16 / 20 / 25 / 30 / 32 / 52 / 60 / 62 / 64 / 65 / 100 / 140 / 150 / 180 / 250
 *   — plus viewport-relative: [25vh], [-40vh], [20vh], [30vh], [60vh], [calc(var(--vh)*1.5)] etc.
 */

/* Radii */
--radius-0:    0;
--radius-4:    4px;   /* .widget rounded-4 */
--radius-full: 9999px;

/* Shadows — none observed on the home page. Dark image overlays are used in place of box-shadows. */

/* === Breakpoints (from Tailwind utility prefixes in rendered classes) === */
/* md:  >= 768px   (tablet)       */
/* lg:  >= 1024px  (small laptop) */
/* xl:  >= 1280px  (desktop)      */
/* max-md:   up to 767px          */
/* max-xl:   up to 1279px         */

/* === Grid === */
/* Mobile:  6 columns, gap = --gutter (1rem) */
/* Desktop: 12 columns, gap = --gutter (1rem) */
/* Horizontal padding: --margin (2rem) — implemented as `.grid-w { padding-inline: var(--margin); }` */
```

---

## 3. Section-by-Section Breakdown

### 3.1 Loader

- **Structure:**
  ```
  .loader.fixed.inset-0.flex.items-center
    .loader-logo.svg-wrapper (full-width "TELHA CLARKE" SVG, dual-layer for mask-slide reveal)
      .loader-logo-top    svg
      .loader-logo-bottom svg (absolute, offset, used as the sliding mask)
    .loader-overlay.absolute-full.bg-black
    .grid-w.absolute.top-margin (mobile: first title block)
      .loader-title > .line-w > .line ("Design studio" / "Architecture & interior")
    .grid-w.absolute.max-xl:bottom-margin.xl:top-margin (location + loader counter)
      .loader-location > .line-w > .line ("South Yarra" / "Australia")
      .loader-loading ("Loading")
      .loader-counter ("100%")
  ```
- **Layout:** Full-viewport black panel, logo vertically centered, location + counter in the top-right (desktop) or bottom (mobile), both inside a 12-col grid locked to `--margin`.
- **Copy:** see copy.md § Loader
- **Assets:** inline SVG wordmark (no asset file)
- **Animations:** references Animation Catalog 4.1, 4.2

### 3.2 Header

- **Structure:**
  ```
  header.header.sticky.top-0.grid-w.content-end.text-black.header-light
    a.header-logo   (inline 1512×150 SVG wordmark)
    .header-toggler (mobile only — "Menu" / "Close" slide)
    .header-links (desktop)
      a.header-link "Work,"
      a.header-link "Process,"
      a.header-link "Studio"
    .header-time  ("HH:MM am/pm"  live, opacity-24)
    .header-location "South Yarra, AUS"
    a.header-contact "Contact"
    .header-overlay (mobile dropdown backdrop)
    .header-menu.fixed.inset-0.bg-mist (mobile overlay)
      .header-link-mobile  ("Home" / "Work" / "Process" / "Studio" / "Contact")
      .header-social-link  ("Instagram," / "Linkedin")
  ```
- **Layout:** Sticky top, 12-col grid (desktop): col 1–3 logo, col 4–10 links, col 11–12 clock + location, col 12 Contact. Mobile: logo + Menu toggler only.
- **Copy:** see copy.md § Header
- **Assets:** inline SVG wordmark
- **Animations:** references 4.3 (link-underline hover), 4.4 (mobile menu slide-down), 4.5 (clock live update every minute)

### 3.3 Cover / Hero (`c-cover-home`)

- **Structure:**
  ```
  c-cover-home.relative.w-full
    .relative.w-full.h-screen
      .cover-home-title-dark (absolute top-[25vh], 3-col wide, aria-hidden mirror) [desktop]
      .cover-home-bottom-dark.grid-w (scroll cue + mirror content)
        .cover-home-scroll-dark "[" "Scroll" "down" "]"
        .cover-home-content-dark "Driven by History, Centered on Context, Embracing Culture"
      .cover-home-image.absolute-full.flex.items-end
        .cover-home-image-inner.absolute-full.overflow-hidden
          c-parallax-image (initial scale 1.1)
            figure > img (full-bleed)
            .absolute-full.bg-black/24  (24% black overlay)
        .cover-home-title-light  (white split-text version, rendered on top of image)
        .cover-home-bottom-light.grid-w.sticky.bottom-margin
          .opacity-52 "[Scroll down]"     (desktop only)
          h1.cover-home-content            (split into line-w > line spans)
  ```
- **Layout:** Full-viewport section. Image fills the viewport with a 24% black overlay. H1 sits at col-span 10–12 (desktop) in the bottom-right using `.grid-w`. Scroll cue sits at col 1–2 bottom-left (desktop), hidden on mobile.
- **Copy:** see copy.md § 1. Cover / Hero
- **Assets:** background image = `assets/PNG-1-1600x1600.jpg` (A2) — served from `/wp-content/uploads/2025/10/PNG-1.jpg` with srcset of 480/768/1200/1600/1920/2560.
- **Animations:** references 4.6 (hero image parallax scrub), 4.7 (hero H1 line-by-line reveal on enter), 4.8 (scroll-down bracket wiggle)

### 3.4 About / Studio (`c-about`)

- **Structure:**
  ```
  c-about.grid-w.pt-margin
    .corner-top-left / .corner-top-right  (L-shaped decorative brackets: 16×16 md:20×20, black, 1px stroke)
    [col-span-full md:col-span-3 xl:col-span-2] — portrait image (sticky inside its tall container)
      .image > figure > img  (A4 — Loller-22-480x720.jpg)
    [md:col-start-5 xl:col-start-7 md:col-end-11]
      c-subtitle ("01" + "Studio" char-by-char)
      c-content.wysiwyg  (First Nations acknowledgement paragraph, line-by-line)
    [col-span-full mt-250 mb-100]
      c-title
        h2.offset-title  ("Telha Clarke is a Melbourne based … Internationally." — 5 lines)
    c-content col-start-1 col-end-4 xl:col-start-4 xl:col-end-6
      "Architecture" "& Interior Design"
    h3 col-start-5 xl:col-start-7 col-end-11 xl:pb-150
      c-content wysiwyg  (typology paragraph)
  ```
- **Layout:** 12-col grid with page-padding (`grid-w`). Portrait image in left column is `sticky top-62` inside a tall shell (`pt-[120%]` + `h-[calc(100%+25rem)]`), meaning it remains in view while the right column scrolls past it. Corners (L-brackets) pin to the outer rectangle.
- **Copy:** see copy.md § 2. About / Studio
- **Assets:** A4 (Loller-22)
- **Animations:** references 4.9 (subtitle char slide-in), 4.10 (split-text line reveal), 4.11 (image parallax/sticky)

### 3.5 Selected Works (`c-works`)

- **Structure:**
  ```
  c-works.pb-150.overflow-hidden
    .flex.justify-between.px-margin.pb-52.md:pb-150.uppercase
      h2 "Selected Works"
      span "02"
      span "17 - 25'"
    .flex.flex-col.gap-y-32.md:gap-y-100.xl:gap-y-52
      a.works-item   (× N — 3 on home)
        .works-item-wrapper
          .relative  (title row)
            .absolute.w-12.h-px (short horizontal dashes left + right of the title, decorative)
            .works-item-bracket-left  "["
            h3.works-item-title       (e.g. "Loller")
            .works-item-bracket-right "]"
          .works-item-image-wrapper.grid-w
            .col-start-3 xl:col-start-4 col-end-11 xl:col-end-10
              .works-item-image.relative.overflow-hidden
                figure > img
              .flex.justify-between
                .works-item-category "Multi-residential"
                .works-item-date     "2025"
  ```
- **Layout:** Full-width stack, title row centered with left/right brackets and short decorative dashes. Image in cols 4–10 (xl). Category/date row flex-justify-between below.
- **Copy:** see copy.md § 3. Selected Works
- **Assets:** A5 (Loller-28), A6 (CN-Residence-18), A7 (SB-Tower-Render_4)
- **Animations:** references 4.12 (works-item-title in-view reveal), 4.13 (image in-view fade/scale), 4.14 (brackets expand hover)

### 3.6 All Work Grid (`c-works-grid`)

- **Structure:**
  ```
  c-works-grid.flex.flex-col.-mt-[40vh]
    .works-grid-button.sticky.top-0.h-screen.flex-center (pulled by -mb-screen-mobile)
      a.link-underline-hover  "All Work" + sup "(28)"
    .flex.flex-col.xl:gap-y-140.pt-[30vh].mt-[60vh].xl:-mb-[55rem].overflow-hidden
      .grid.grid-cols-6.xl:grid-cols-12.gap-x-gutter.px-margin  (× N rows)
        .works-grid-item[data-size="large|medium|small"]
          .works-grid-image.will-change-transform.absolute-full
            figure > img
  ```
- **Layout:** The "All Work (28)" link is `sticky top-0` centered in viewport while the decorative mosaic of images scrolls past it behind. Rows use the 12-col grid with irregular item sizes (`data-size="large|medium|small"`) and hand-tuned offsets (`-ml-col-1`, `translate-y-1/2`, `opacity-20`, etc.). Four rows total on desktop.
- **Copy:** see copy.md § 4. All Work Grid
- **Assets:** A8–A20, A27–A33 (mosaic thumbnails — Hepburn, Parlington-2, Loller-19, Argo-5, High-St-2, Ormond-21-2, StudioPiper, ES-5, PNG-1-1, Hurstmon-9, Argo-1, Image9, ES-7, Image14_000, Greville-7, Parlington-7-1, Coburg-North-2, Soho-13, Kaye_3017_HR)
- **Animations:** references 4.15 (sticky "All Work" pin), 4.16 (per-image parallax y-offset, variable by `data-size`), 4.17 (underline-hover on the central link)

### 3.7 Vision (`c-vision`)

- **Structure:**
  ```
  c-vision.text-white  [data-offset="0.75"] [data-widget="" data-widget-offset="1"]
    .sticky.top-0.h-screen.items-center.-mt-[100vh].overflow-hidden.z-1
      .vision-image-wrapper.col-start-6 xl:col-end-8
        .vision-image.relative.pt-[130%]
          .vision-image-scroll.absolute-full
            .vision-image-parallax.absolute.w-full.h-full  (image + black/24 overlay)
    .relative.h-[calc(var(--vh)*var(--height-multiplier))]  (tall scroll runway; --height-multiplier: 4.25)
      .vision-wrapper.sticky.top-0.h-screen.grid-w.content-center
        .vision-titles.flex.flex-nowrap  (3 titles side-by-side, horizontal scroll via transform)
          h3.vision-title "Design integrity"
          h3.vision-title.opacity-32 "Innovation"
          h3.vision-title.opacity-32 "Enhanced living"
        .flex.gap-x-32  (number + line + suptitle row)
          .vision-number   ("03", char-by-char)
          .vision-line     (hairline, flex-1)
          h2.vision-suptitle ("Vision")
        .vision-contents.relative (3 absolutely-stacked paragraphs — the first is relative, next two absolute top-0 left-0; swapped by opacity as title advances)
          .vision-content × 3
  ```
- **Layout:** Two stacked sticky layers. Layer A pins the vision image during the section. Layer B (`--height-multiplier: 4.25`) creates a ~4.25 × vh scroll runway; inside it, a second sticky wrapper holds the horizontally-scrolling titles and the synchronized paragraph swap.
- **Copy:** see copy.md § 5. Vision
- **Assets:** A1 (Stanhope-3-2.jpg full-resolution 749×1125)
- **Animations:** references 4.18 (image pin + parallax-within-frame), 4.19 (horizontal title scrub across 3 titles), 4.20 (paragraph opacity-crossfade synced to title index), 4.21 (vision-line width grow-in), 4.22 (section-number char slide-up)

### 3.8 Process / Method (`c-process`)

- **Structure:**
  ```
  c-process.grid-w.pt-margin.pb-150.md:pt-150
    4× corner brackets (top-left, top-right, bottom-left, bottom-right)
    [col-span-full xl:col-span-8]  — process-items text flow
      × 7 items:  span.process-item   (".a" = active state)
                    "Schematic Design" + sup "(01)"
                  span "/"   (separator, omitted after last)
    [col-span-full xl:col-start-10 xl:col-end-13 xl:row-span-2]  — image slot
      × 7 .process-image.absolute-full.opacity-0.[&.a]:opacity-100   (stacked, swap by adding `.a`)
    [col-span-full md:col-span-2]  — c-subtitle "04" + "Method"
    [col-span-full md:col-start-7 xl:col-start-4 xl:col-end-7] — h3 c-content (scope paragraph)
  ```
- **Layout:** Bordered (via 4 corner brackets) 12-col section. Left: a large mist-colored wall of 7 step labels separated by "/". Right: a stack of 7 images, only one visible at a time (crossfaded by adding `.a` class on both the item and its image).
- **Copy:** see copy.md § 6. Process / Method
- **Assets:** A21–A26, A29, and reused (Anderson-Sketch A21, PNG-AXO-03-NO-BADGE A23, Italian-Club-External1 A24, Marketing-Plan-2 A25, CN-Residence-22 A19, Bala-In-Construction A22, Soho-2 A20)
- **Animations:** references 4.23 (process-item hover text-color swap + paired image crossfade), 4.24 (split-text line reveal on enter), 4.25 (subtitle char slide)

### 3.9 Sticky Widget CTA

- **Structure:**
  ```
  .sticky.bottom-margin.flex-center.pointer-events-none.z-widget
    a.widget.opacity-0.invisible (activated by page context via [data-widget] attrs on sections)
      .widget-wrapper.flex.items-center.rounded-4
        .widget-title-wrapper.opacity-52 > .widget-title (dynamic section title)
        .widget-cta.flex.items-center.gap-x-6
          .widget-cta-label "Discover"
          .widget-icon (inline SVG plus-icon)
  ```
- **Layout:** Sticky bottom-center pill that activates when the user is inside a section that declares `[data-widget="" data-widget-title="…" data-widget-url="…"]` (About → "Studio", Works → sectional titles, Works-grid → "All Work", Vision → "Vision", Process → rooted widgets).
- **Copy:** see copy.md § 7. Sticky Widget
- **Assets:** inline plus-icon SVG
- **Animations:** references 4.26 (widget fade-in/out when section metadata changes), 4.27 (rolling title swap)

### 3.10 Footer (`c-footer`)

- **Structure:**
  ```
  footer.footer.flex.flex-col.items-end.xl:h-screen.-mt-px
    c-footer.grid-w.content-end.pt-100.pb-margin.bg-white
      col-span-full xl:col-span-5
        "Talk to us about your project" + a.link-underline "Contact us"
        c-newsletter (newsletter subscribe form)
          "Subscribe to our newsletter"
          form#newsletter-form
            input.newsletter-email-field [placeholder="Enter your email"]
            .newsletter-form-success-message "Thanks for joining!" (translated below until submit)
            button.newsletter-form-submit
              .newsletter-form-submit-arrow (SVG arrow)
              .newsletter-form-submit-tick  (SVG tick, opacity-0 until success)
      col-span-full xl:col-start-7 xl:col-end-9
        sitemap links: Home / Work / Studio / Process / Contact
        .footer-scroll "Back to top"
      col-span-full xl:col-start-10 xl:col-end-13
        Address (L) / Phone (P) / Email (C)
        Instagram, / Linkedin
      mobile-only: legal strip, credits strip, arrow-back-to-top
    .sticky.bottom-0.w-full.bg-black.z-0.overflow-hidden
      .footer-bottom.p-margin
        .footer-bottom-inner
          .footer-bottom-overlay.absolute-full.bg-black.opacity-0 (revealed via scroll ≈ 0.85)
          svg (full-width "TELHA CLARKE" wordmark, white on black)
          .flex.justify-between (All rights reserved / Privacy / Terms / Website by TM & GL)
  ```
- **Layout:** Two-stage footer. Stage A is the white informational footer (contact, newsletter, sitemap, address) in the standard 12-col grid. Stage B is a sticky-bottom black slab behind it, revealed with an upward reveal + overlay fade as the user scrolls to the very end.
- **Copy:** see copy.md § 8. Footer and § 9. Footer Bottom Slab
- **Assets:** inline SVG arrow (submit), inline SVG tick (success), inline SVG "TELHA CLARKE" wordmark
- **Animations:** references 4.28 (newsletter submit → arrow slides out, tick fades in), 4.29 (success message slide-up), 4.30 (footer-bottom-inner reveal translateY from 40% → 0), 4.31 (footer-bottom-overlay opacity 0 → 0.85 scroll-linked), 4.32 (back-to-top link hover)

---

## 4. Animation Catalog

> All entries below use **GSAP-flavored pseudo-code**. Scroll-linked entries use ScrollTrigger.
>
> **Source of each entry:**
> - Structural selectors, initial inline transforms (`translate: none; rotate: none; scale: none; transform: …`), and the DOM classes (`.line-w > .line`, `.char-w > .char`, `.works-item-title`, `.vision-title`, etc.) are **confirmed from the rendered DOM** — see `capture/runtime-data.json` and the local HTML dump.
> - GSAP version is **confirmed 3.x** via the GSCache signature (keys: `id, target, harness, xPercent, yPercent, scaleX, scaleY, rotation, rotationX, rotationY, skewX, skewY, transformPerspective, zOrigin, force3D, renderTransform, uncache, svg`).
> - **Lenis options are runtime-confirmed** — see §5.
> - **Durations, eases, and stagger magnitudes are `[inferred]`** from source patterns (G1/G2 blocked direct introspection). Every one is a reasonable GSAP-idiomatic default for the visible effect; they are starting points, not measurements.

### 4.1 Loader — wordmark mask-slide reveal
Two overlapping copies of the "TELHA CLARKE" SVG. The top copy is translated up, the bottom copy up-out-of-frame, creating a 100%-height line-wipe while the outer `.loader-logo` group translates down into the viewport center on intro.
```js
timeline()
  .from('.loader-logo',          { yPercent: -100, duration: 1.0, ease: 'power3.out' })   // [uncertain]
  .from('.loader-logo-top path', { yPercent: 100,  duration: 0.8, ease: 'power3.out', stagger: 0.02 }, '<0.1')
  .to  ('.loader-logo-bottom path', { yPercent: -100, duration: 0.8, ease: 'power3.in' }, '+=0.2');
```
Trigger: page load. Target selectors: `.loader-logo`, `.loader-logo-top path`, `.loader-logo-bottom path`. Notes: the loader sets `translate: none; rotate: none; scale: none; transform: translate(0px, -384.734px);` mid-animation — consistent with a GSAP `from(yPercent: -100)` final state.

### 4.2 Loader — text reveal + counter
Each `.line` inside `.loader-title .line-w` / `.loader-location .line-w` / `.loader-loading` / `.loader-counter` starts at `translate(0%, -100%)` and slides to 0.
```js
timeline({ delay: 0.1 })
  .from('.loader-title .line, .loader-location .line', { yPercent: -100, duration: 0.6, ease: 'power3.out', stagger: 0.06 })
  .from('.loader-loading, .loader-counter',           { yPercent: -100, duration: 0.5, ease: 'power3.out' }, '<0.1');
// counter number ticks from 0 → 100%
gsap.to({ n: 0 }, { n: 100, duration: 1.6, ease: 'power1.inOut', onUpdate() { counterEl.textContent = Math.round(this.targets()[0].n) + '%'; } });
```
Trigger: page load. Target selectors: `.loader-title .line`, `.loader-location .line`, `.loader-loading`, `.loader-counter`.

### 4.3 Header link — underline hover (`.link-underline-hover`, `.link-underline`, `.link-underline-footer`)
CSS-level. A hairline underline animates from 0→100% width via a scale-x or a transform on a `::after`.
```css
.link-underline-hover::after { content:''; display:block; height:1px; background:currentColor; transform: scaleX(0); transform-origin: left; transition: transform .4s cubic-bezier(.77,0,.175,1); }
.link-underline-hover:hover::after { transform: scaleX(1); }
```
Trigger: hover. Duration ≈ 0.4s `[uncertain]`. Classes observed: `link-underline`, `link-underline-hover`, `link-underline-mist`, `link-underline-footer`.

### 4.4 Mobile menu — panel slide-down
`.header-menu` starts with `transform: translate(0%, -100%)`. On tap of `.header-toggler`, it translates to 0%; `.header-menu-inner` counter-translates from `translate(0%, 100%)` to 0% for the overshoot split effect.
```js
const tl = gsap.timeline({ paused: true })
  .to('.header-menu',       { yPercent: 0,  duration: 0.9, ease: 'expo.inOut' })
  .to('.header-menu-inner', { yPercent: 0,  duration: 0.9, ease: 'expo.inOut' }, '<')
  .from('.header-link-mobile',   { yPercent: 100, duration: 0.6, stagger: 0.06, ease: 'power3.out' }, '-=0.3')
  .from('.header-social-link',   { yPercent: 100, duration: 0.5, stagger: 0.05, ease: 'power3.out' }, '<+0.1');
// .header-toggler-menu ↔ .header-toggler-close also yPercent-swap
```
Trigger: click `.header-toggler`. Easing `[uncertain]`.

### 4.5 Header clock
```js
setInterval(() => {
  const d = new Date();
  hourEl.textContent = String(((d.getHours() + 11) % 12) + 1).padStart(2, '0');
  minuteEl.textContent = String(d.getMinutes()).padStart(2, '0');
  ampmEl.textContent  = d.getHours() >= 12 ? 'pm' : 'am';
}, 1000);
```
Trigger: setInterval. Not a GSAP animation — plain timer.

### 4.6 Cover / Hero — image parallax scrub
`.cover-home-image-prlx` starts at `scale(1.1)` and translates upward as the user scrolls past the hero section. The dark `bg-black/24` overlay remains static.
```js
ScrollTrigger.create({
  trigger: '.cover-home',
  start: 'top top',
  end:   'bottom top',
  scrub: true,
  animation: gsap.timeline()
    .fromTo('.cover-home-image-prlx', { scale: 1.1, yPercent: 0 }, { scale: 1.1, yPercent: -15, ease: 'none' })
});
```
Scroll-linked: yes (scrub). Smooth scroll integration: Lenis. `[uncertain values: exact yPercent delta]`

### 4.7 Cover / Hero — H1 line-by-line reveal
Each `<span class="line">` inside `.line-w` starts at `translate(0%, 100%)` (observed in DOM). On enter, they slide up to 0%.
```js
ScrollTrigger.create({
  trigger: '.cover-home',
  start: 'top 80%',
  animation: gsap.from('.cover-home-content .line', { yPercent: 100, duration: 0.9, stagger: 0.08, ease: 'expo.out' })
});
```
Target selectors: `h1.cover-home-content .line`. Notes: the site wraps every line in `.line-w` (clip container, `overflow:hidden`) + an inner `.line` span for the slide — the split-text pattern is consistent across the page.

### 4.8 Cover / Hero — scroll cue
`.cover-home-scroll-text` cycles its two spans ("Scroll", "down") in a vertical roll, and brackets `[`/`]` subtly breathe.
```js
gsap.timeline({ repeat: -1, defaults: { duration: 0.8, ease: 'expo.inOut' } })
  .to('.cover-home-scroll-text', { yPercent: -100, stagger: 0.0 })
  .to('.cover-home-scroll-text', { yPercent: 0, delay: 1.2 });
```
Trigger: page load, infinite loop. `[uncertain timing]`.

### 4.9 Subtitle — number + label char slide-in
Every `c-subtitle` contains `.subtitle-number .char` and `.subtitle-text .char`, each initially at `translate(-100%, 0%)` (number, horizontal wipe) or `translate(0%, 200%)` (letters, vertical from below). On enter they slide to 0.
```js
ScrollTrigger.create({
  trigger: 'c-subtitle',
  start: 'top 85%',
  animation: gsap.timeline()
    .from('c-subtitle .subtitle-number .char', { xPercent: -100, stagger: 0.04, duration: 0.5, ease: 'expo.out' })
    .from('c-subtitle .subtitle-text   .char', { yPercent: 200,  stagger: 0.02, duration: 0.6, ease: 'expo.out' }, '-=0.3')
});
```
Also animates `.subtitle-text` wrapper with a horizontal translate (observed e.g. `transform: translate(-22.3409px, 0px)`) — a per-letter justification pass.

### 4.10 Offset-title / split-line reveal (generic)
Any element wrapped in `.line-w > .line` performs the same vertical slide-in pattern (hero H1, about H2/H3, works-item-title, vision-title, vision-content, process content). Covered by one reusable trigger factory.
```js
document.querySelectorAll('.line-w').forEach(wrap => {
  ScrollTrigger.create({
    trigger: wrap,
    start: 'top 85%',
    animation: gsap.from(wrap.querySelectorAll('.line'), { yPercent: 100, duration: 0.9, stagger: 0.06, ease: 'expo.out' })
  });
});
```

### 4.11 About — sticky portrait image
The portrait image inside the left column uses CSS `position: sticky; top: 62px;` (class `md:sticky md:top-62`). No GSAP tween — pure CSS sticky within an over-tall container (`h-[calc(100%+25rem)]`).
Notes: The about section's H1 has an initial `max-md:hidden` spacer (`inline-block md:w-col-4 xl:w-col-offset-3`) creating the "offset" feel.

### 4.12 Works item — title reveal
`.works-item-title` + brackets slide up (`translate(0%, 100%)` → 0%) and the decorative side-dashes grow out (scaleX 0 → 1).
```js
ScrollTrigger.create({
  trigger: '.works-item',
  start: 'top 85%',
  animation: gsap.timeline()
    .from('.works-item-title',                { yPercent: 100, duration: 0.9, ease: 'expo.out' })
    .from('.works-item-bracket-left, .works-item-bracket-right', { yPercent: 100, duration: 0.8, ease: 'expo.out' }, '<0.05')
    .from('.works-item .absolute.w-8, .works-item .absolute.w-12', { scaleX: 0, transformOrigin: 'center', duration: 0.6, ease: 'expo.out' }, '<0.1')
});
```

### 4.13 Works item — image in-view + hover
Each image fades in (`opacity 0 → 1`, lazy load handoff) and subtly scales from 1.05→1 on enter. Hover has no visible transform in captured probes (see `interactionProbes.worksItemHover` — before/after identical). Hover effect — if any — would be a cursor swap or cursor-follower, not an image transform `[uncertain]`.

### 4.14 Works item — bracket hover (decorative)
CSS letter-spacing easing or a small transform on brackets. `[uncertain]` — not visible in computed-style probe.

### 4.15 Works-grid — sticky "All Work (28)" link
`.works-grid-button.sticky.top-0.h-screen.flex-center` with `-mb-screen-mobile`. The container that follows has `mt-[60vh]` + `-mt-[40vh]` on parent to create overlap. The sticky behavior is pure CSS — no pinned ScrollTrigger needed.

### 4.16 Works-grid — per-image parallax y-offset (scrub)
Each `.works-grid-image.will-change-transform` gets a different `y` translation based on `data-size` (large / medium / small) and its row position, yielding the mosaic-float effect.
```js
gsap.utils.toArray('.works-grid-image').forEach(img => {
  const size = img.closest('[data-size]')?.dataset.size;
  const amp  = { large: 120, medium: 200, small: 280 }[size] || 160;  // [uncertain]
  ScrollTrigger.create({
    trigger: img.closest('.works-grid-item'),
    start: 'top bottom',
    end:   'bottom top',
    scrub: true,
    animation: gsap.fromTo(img, { y: amp/2 }, { y: -amp/2, ease: 'none' })
  });
});
```
Scroll-linked: yes (scrub).

### 4.17 Works-grid — "All Work" underline-hover
CSS `.link-underline-hover` pattern (see 4.3). Applied to the central "All Work (28)" link.

### 4.18 Vision — sticky image + internal parallax
The `.vision-image-wrapper` is placed inside a `sticky top-0 h-screen` shell so the image is pinned for the full runway. Inside, `.vision-image-parallax` has `h-[130%] xl:h-full` (mobile) — as user scrolls, its inline transform shifts (observed snapshot: `matrix(1, 0, 0, 1, 0, 4.38)` — essentially a 4.4px baseline; deltas `[uncertain]`).
```js
ScrollTrigger.create({
  trigger: 'c-vision',
  start: 'top top',
  end:   'bottom bottom',
  scrub: true,
  animation: gsap.fromTo('.vision-image-parallax', { y: 0 }, { y: -200, ease: 'none' })   // [uncertain]
});
```

### 4.19 Vision — horizontal title scrub
`.vision-titles.flex.flex-nowrap` has three `h3.vision-title` inline-blocks sized `xl:basis-col-5 / col-4 / col-5` that extend beyond the viewport. The container runs a scrub-linked `x` translate that moves titles horizontally; the non-active titles are `opacity-32`, the active one is `opacity-100`.
```js
const titles = gsap.utils.toArray('.vision-title');
ScrollTrigger.create({
  trigger: 'c-vision',
  start: 'top top',
  end:   'bottom bottom',
  scrub: 0.6,
  animation: gsap.timeline()
    .to('.vision-titles', { xPercent: -66.6, ease: 'none' })  // [uncertain: exact % depends on basis widths]
    .to(titles[0], { opacity: 0.32 }, 0.0)
    .to(titles[1], { opacity: 1.00 }, 0.33)
    .to(titles[2], { opacity: 0.32 }, 0.33)
    .to(titles[1], { opacity: 0.32 }, 0.66)
    .to(titles[2], { opacity: 1.00 }, 0.66)
});
```
The 3 paragraphs in `.vision-contents` crossfade at the same scrub progress (see 4.20).

### 4.20 Vision — paragraph crossfade synced to title index
`.vision-contents` contains 3 `.vision-content` blocks: the first is `relative`, the next two `absolute top-0 left-0`. The container starts `opacity-0 invisible` — revealed on enter, then individual paragraphs crossfade.
```js
ScrollTrigger.create({
  trigger: 'c-vision',
  start: 'top top',
  end:   'bottom bottom',
  scrub: 0.6,
  animation: gsap.timeline()
    .to('.vision-contents', { opacity: 1, autoAlpha: 1, duration: 0.1 })
    .to(gsap.utils.toArray('.vision-content')[0], { opacity: 0 }, 0.33)
    .to(gsap.utils.toArray('.vision-content')[1], { opacity: 1 }, 0.33)
    .to(gsap.utils.toArray('.vision-content')[1], { opacity: 0 }, 0.66)
    .to(gsap.utils.toArray('.vision-content')[2], { opacity: 1 }, 0.66)
});
```

### 4.21 Vision — hairline width grow-in
`.vision-line` starts at `opacity: 0` (observed). On section enter it fades in and then grows to `flex-1` width via its natural layout (it's already flex-1; only the opacity gates it).
```js
gsap.from('.vision-line', { opacity: 0, duration: 0.8, scrollTrigger: { trigger: '.vision-line', start: 'top 85%' } });
```

### 4.22 Vision — "03" number char slide
Same per-char slide pattern as 4.9, but applied to the standalone `.vision-number-text .char`.

### 4.23 Process — hover swaps active step + paired image
Each `.process-item` can receive class `.a` (active). The matching index `.process-image.a` becomes `opacity-100`; all others are `opacity-0`. The inactive items' text color is mist; `.a` is black. No GSAP needed for the opacity — it's a CSS `[&.a]:opacity-100` toggle.
```js
document.querySelectorAll('.process-item').forEach((item, i) => {
  item.addEventListener('mouseenter', () => {
    document.querySelectorAll('.process-item').forEach(el => el.classList.remove('a'));
    document.querySelectorAll('.process-image').forEach(el => el.classList.remove('a'));
    item.classList.add('a');
    document.querySelectorAll('.process-image')[i]?.classList.add('a');
  });
});
```
Trigger: hover on `.process-item`. Transition duration controlled by CSS `transition: opacity .4s ease-out` `[uncertain]`.

### 4.24 Process — line reveal
Generic 4.10 split-text pattern applied to the process scope paragraph H3.

### 4.25 Process — subtitle char slide
4.9 pattern applied to the "04 / Method" subtitle.

### 4.26 Widget — fade in/out on section enter
Sections advertise metadata via `[data-widget] [data-widget-title] [data-widget-url] [data-widget-offset]`. An `AnimationContext` module (`/wp-content/themes/gl/public/build/assets/AnimationContext-CP5ToJZ_.js`) watches intersections and toggles the widget visibility + URL + title.
```js
ScrollTrigger.create({
  trigger: section, // each [data-widget]
  start: `top ${offset * 100}%`,
  onEnter:      () => gsap.to('.widget', { opacity: 1, autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }),
  onLeave:      () => gsap.to('.widget', { opacity: 0, autoAlpha: 0, duration: 0.4, ease: 'power2.in' }),
  onEnterBack:  () => gsap.to('.widget', { opacity: 1, autoAlpha: 1, duration: 0.4 }),
  onLeaveBack:  () => gsap.to('.widget', { opacity: 0, autoAlpha: 0, duration: 0.4 }),
});
```

### 4.27 Widget — title rolling swap
The widget label is replaced with a vertical-scroll text-swap when the active section changes (mirrors the loader/subtitle pattern).
```js
function swap(newText) {
  const next = document.createElement('div'); next.textContent = newText; next.style.transform = 'translateY(100%)';
  widgetTitle.prepend(next);
  gsap.to(next,                              { y: 0,    duration: 0.5, ease: 'expo.out' });
  gsap.to(widgetTitle.querySelector('.old'), { y: -22,  duration: 0.5, ease: 'expo.in', onComplete: el => el.remove() });
}
```
`[uncertain]`

### 4.28 Newsletter — submit success sequence
On form submit → arrow slides right-out, tick fades + scales in.
```js
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  await fetch('/wp-json/...', { method:'POST', body: new FormData(form) });
  gsap.timeline()
    .to('.newsletter-form-submit-arrow', { xPercent: 200, opacity: 0, duration: 0.4, ease: 'power3.in' })
    .to('.newsletter-form-submit-tick',  { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }, '-=0.1')
    .to('.newsletter-form-success-message', { yPercent: 0, duration: 0.5, ease: 'expo.out' }, '<');
});
```

### 4.29 Newsletter — success message slide-up
Initial inline `transform: translate(0%, 100%)` → 0% on success (see 4.28).

### 4.30 Footer-bottom — wordmark reveal
`.footer-bottom-inner` starts at `transform: translate(0%, 40%)`. As the user scrolls to the end, it translates to 0%.
```js
ScrollTrigger.create({
  trigger: '.footer-bottom',
  start: 'top bottom',
  end:   'bottom bottom',
  scrub: true,
  animation: gsap.to('.footer-bottom-inner', { yPercent: 0, ease: 'none' })
});
```
Observed inline start: `transform: translate(0%, 40%)`.

### 4.31 Footer-bottom — overlay fade-to-0.85
`.footer-bottom-overlay` starts at `opacity: 0` and scrolls to `opacity: 0.85` (final captured value).
```js
ScrollTrigger.create({
  trigger: '.footer-bottom', start: 'top bottom', end: 'bottom bottom', scrub: true,
  animation: gsap.to('.footer-bottom-overlay', { opacity: 0.85, ease: 'none' })
});
```

### 4.32 Back-to-top
Click handler that calls `lenis.scrollTo(0, …)`. Lenis runtime default `duration: 1` is in effect for the site (see §5); `scrollTo` calls usually pass a higher value to make the long jump visible — 1.5–2s is typical, not observed directly `[uncertain for scrollTo call-site]`.
```js
document.querySelectorAll('.footer-scroll').forEach(el =>
  el.addEventListener('click', () => lenis.scrollTo(0, { duration: 1.5, easing: t => 1 - Math.pow(1 - t, 3) }))
);
```

---

## 5. Scroll Behavior

- **Smooth-scroll library:** **Lenis** (confirmed via the `lenis` class on `#app` and `lenis-stopped` during the loader phase). **Config recovered at runtime** — full options block captured in `capture/runtime-data.json.lenis.options`:

```js
new Lenis({
  // target
  wrapper: document.getElementById('app'),   // <div#app.lenis>
  content: document.getElementById('app'),   // same node — Lenis uses #app as its scroll context
  eventsTarget: window,                      // wheel/touch events listened on window

  // motion
  duration: 1,                               // scroll smoothing window (seconds)
  easing: /* custom fn — closure, body not accessible */,
  lerp: 0.1,                                 // per-frame interpolation factor
  smoothWheel: true,                         // smooth wheel scroll: ON
  syncTouch: false,                          // do not smooth touch; use native inertia
  syncTouchLerp: 0.075,
  touchInertiaExponent: 1.7,
  touchMultiplier: 1,
  wheelMultiplier: 1,

  // orientation
  orientation: 'vertical',
  gestureOrientation: 'vertical',

  // misc
  infinite: false,
  autoResize: true,
  overscroll: true,                          // overscroll enabled (bounce at edges on platforms that support it)
  autoRaf: false,                            // theme drives raf manually — `lenis.raf(t)` called from an external ticker
  anchors: false,
  autoToggle: false,
  allowNestedScroll: false,
  __experimental__naiveDimensions: false,
});
```
Notes:
- `autoRaf: false` means the theme calls `lenis.raf(time)` from its own ticker, likely the same ticker as GSAP — `gsap.ticker.add((time) => lenis.raf(time * 1000))` is the canonical pairing.
- The `easing` function itself is a closure whose body could not be extracted; Lenis' default is `t => Math.min(1, 1.001 - Math.pow(2, -10 * t))` and no override was observed in the options, so the default is the most likely value `[uncertain body only]`.

- **All scroll-linked animations on this page:** 4.6, 4.16, 4.18, 4.19, 4.20, 4.30, 4.31. In-view (non-scrub) triggered reveals: 4.7, 4.9, 4.10, 4.12, 4.13, 4.21, 4.22, 4.24, 4.25, 4.26.
- **Scroll-velocity effects:** None observed on the home page.
- **Snap points / section-locked scrolling:** None — the section advances are driven by pinned sticky + scrub timelines, not by snap.
- **Pin sections / horizontal scroll:**
  - `c-works-grid` — "All Work (28)" centered link is **CSS `position: sticky`** (not GSAP-pinned) via `.sticky top-0 h-screen` with `-mb-screen-mobile` on the container, so the button remains centered while imagery scrolls past.
  - `c-vision` — two stacked sticky layers: (1) image layer pins the image for the whole section; (2) content layer pins the title+paragraph row while a **horizontal scrub** runs through three `.vision-title` slides inside `.vision-titles.flex-nowrap` across a `--height-multiplier: 4.25` runway. This is the only horizontal scrub on the home page.
  - `.footer-bottom` is `sticky bottom-0` so the big wordmark slab becomes the final visible layer as the user scrolls off the end.

---

## 6. Asset Manifest

| ID | Type | Original URL | Local Path | Dimensions | Size | Used In |
|---|---|---|---|---|---|---|
| A1 | image | `/wp-content/uploads/2025/09/Stanhope-3-2.jpg` | `assets/Stanhope-3-2.jpg` | 749×1125 (natural) | 2.3 MB | §3.7 Vision (sticky image) |
| A2 | image | `/wp-content/uploads/2025/10/PNG-1-1600x1600.jpg` | `assets/PNG-1-1600x1600.jpg` | 1440×1440 (natural) | 409 KB | §3.3 Hero (cover-home background) |
| A3 | font | `/wp-content/themes/gl/public/build/assets/Europa-Grotesk-No2-Medium-B7a8PlH0.woff2` | `assets/Europa-Grotesk-No2-Medium-B7a8PlH0.woff2` | — | 11 KB | Global body font |
| A4 | image | `/wp-content/uploads/2025/09/Loller-22-480x720.jpg` | `assets/Loller-22-480x720.jpg` | 432×648 | 21 KB | §3.4 About (sticky portrait) |
| A5 | image | `/wp-content/uploads/2025/09/Loller-28-1600x1067.jpg` | `assets/Loller-28-1600x1067.jpg` | 1440×960 | 353 KB | §3.5 Works — "Loller" |
| A6 | image | `/wp-content/uploads/2025/11/CN-Residence-18-e1764200266170-1600x848.jpg` | `assets/CN-Residence-18-e1764200266170-1600x848.jpg` | 1440×763 | 258 KB | §3.5 Works — "Penthouse Vivace" |
| A7 | image | `/wp-content/uploads/2025/11/SB-Tower-Render_4-1600x1200.jpg` | `assets/SB-Tower-Render_4-1600x1200.jpg` | 1440×1080 | 93 KB | §3.5 Works — "Southbank Tower" |
| A8 | image | `/wp-content/uploads/2025/09/Hepburn-20-480x320.jpg` | `assets/Hepburn-20-480x320.jpg` | 432×288 | 14 KB | §3.6 Works grid (row 1) |
| A9 | image | `/wp-content/uploads/2025/10/ES-5-480x720.jpg` | `assets/ES-5-480x720.jpg` | 432×648 | 57 KB | §3.6 Works grid (row 2) |
| A10 | image | `/wp-content/uploads/2025/08/Parlington-2-480x480.jpg` | `assets/Parlington-2-480x480.jpg` | 432×432 | 53 KB | §3.6 Works grid (row 1) |
| A11 | image | `/wp-content/uploads/2025/09/Ormond-21-2-480x720.jpg` | `assets/Ormond-21-2-480x720.jpg` | 432×648 | 57 KB | §3.6 Works grid (row 2) |
| A12 | image | `/wp-content/uploads/2025/09/StudioPiper_KensingtonRoad_SouthYarra_EXT-e1764222151372-480x254.jpg` | `assets/StudioPiper_KensingtonRoad_SouthYarra_EXT-e1764222151372-480x254.jpg` | 432×228 | 58 KB | §3.6 Works grid (row 2) |
| A13 | image | `/wp-content/uploads/2025/09/Loller-19-480x720.jpg` | `assets/Loller-19-480x720.jpg` | 432×648 | 32 KB | §3.6 Works grid (row 1) |
| A14 | image | `/wp-content/uploads/2025/10/Argo-1-480x720.jpg` | `assets/Argo-1-480x720.jpg` | 432×648 | 53 KB | §3.6 Works grid (row 3) |
| A15 | image | `/wp-content/uploads/2025/10/Image9-480x270.jpg` | `assets/Image9-480x270.jpg` | 432×243 | 33 KB | §3.6 Works grid (row 3) |
| A16 | image | `/wp-content/uploads/2025/09/High-St-2-480x614.jpg` | `assets/High-St-2-480x614.jpg` | 432×552 | 47 KB | §3.6 Works grid (row 1) |
| A17 | image | `/wp-content/uploads/2025/10/Argo-5-480x720.jpg` | `assets/Argo-5-480x720.jpg` | 432×648 | 29 KB | §3.6 Works grid (row 1) |
| A18 | image | `/wp-content/uploads/2025/10/ES-7-e1764223193966-480x609.jpg` | `assets/ES-7-e1764223193966-480x609.jpg` | 432×548 | 54 KB | §3.6 Works grid (row 3) |
| A19 | image | `/wp-content/uploads/2025/11/CN-Residence-22-e1764201118833-480x480.jpg` | `assets/CN-Residence-22-e1764201118833-480x480.jpg` | 432×432 | 91 KB | §3.8 Process — step 05 "Interior Design" (image swap) |
| A20 | image | `/wp-content/uploads/2025/09/Soho-2-480x720.jpg` | `assets/Soho-2-480x720.jpg` | 432×648 | 79 KB | §3.8 Process — step 07 "Contract Administration" (image swap) |
| A21 | image | `/wp-content/uploads/2025/12/Anderson-Sketch-480x600.png` | `assets/Anderson-Sketch-480x600.png` | 432×540 | 13 KB | §3.8 Process — step 01 "Schematic Design" (image swap) |
| A22 | image | `/wp-content/uploads/2025/12/Bala-In-Construction-480x640.jpg` | `assets/Bala-In-Construction-480x640.jpg` | 432×576 | 63 KB | §3.8 Process — step 06 "Construction Documentation" (image swap) |
| A23 | image | `/wp-content/uploads/2025/10/PNG-AXO-03-NO-BADGE-480x600.jpg` | `assets/PNG-AXO-03-NO-BADGE-480x600.jpg` | 432×540 | 38 KB | §3.8 Process — step 02 "Development & Town Planning" (image swap) |
| A24 | image | `/wp-content/uploads/2025/11/Italian-Club-External1-480x476.jpg` | `assets/Italian-Club-External1-480x476.jpg` | 432×428 | 101 KB | §3.8 Process — step 03 "Design Development" (image swap) |
| A25 | image | `/wp-content/uploads/2025/12/Marketing-Plan-2-480x340.jpg` | `assets/Marketing-Plan-2-480x340.jpg` | 432×306 | 18 KB | §3.8 Process — step 04 "Marketing" (image swap) |
| A26 | image | `/wp-content/uploads/2025/10/Image14_000-480x270.jpg` | `assets/Image14_000-480x270.jpg` | 432×243 | 23 KB | §3.6 Works grid (row 3) |
| A27 | image | `/wp-content/uploads/2025/10/Kaye_3017_HR-480x719.jpg` | `assets/Kaye_3017_HR-480x719.jpg` | 432×647 | 51 KB | §3.6 Works grid (row 2) |
| A28 | image | `/wp-content/uploads/2025/09/Hurstmon-9-480x719.jpg` | `assets/Hurstmon-9-480x719.jpg` | 432×647 | 68 KB | §3.6 Works grid (row 2) |
| A29 | image | `/wp-content/uploads/2025/09/Soho-13-480x720.jpg` | `assets/Soho-13-480x720.jpg` | 432×648 | 42 KB | §3.6 Works grid (row 4) |
| A30 | image | `/wp-content/uploads/2025/09/Coburg-North-2-480x270.jpeg` | `assets/Coburg-North-2-480x270.jpeg` | 432×243 | 32 KB | §3.6 Works grid (row 4) |
| A31 | image | `/wp-content/uploads/2025/10/PNG-1-1-480x480.jpg` | `assets/PNG-1-1-480x480.jpg` | 432×432 | 41 KB | §3.6 Works grid (row 2) |
| A32 | image | `/wp-content/uploads/2025/10/Greville-7-480x720.jpg` | `assets/Greville-7-480x720.jpg` | 432×648 | 42 KB | §3.6 Works grid (row 4) |
| A33 | image | `/wp-content/uploads/2025/08/Parlington-7-1-480x720.jpg` | `assets/Parlington-7-1-480x720.jpg` | 432×648 | 62 KB | §3.6 Works grid (row 4) |

Additional inline SVG graphics embedded directly in the HTML (no asset file): "TELHA CLARKE" wordmark (used in loader, header, header-menu, footer slab), 4× corner-bracket ornament (about + process), newsletter-submit arrow, newsletter-success tick, widget plus-icon, footer-up-arrow.

OG image (referenced in meta but not on-page): `/wp-content/uploads/2025/09/og-telha-1.jpg` — 1440×780.

Favicons (not downloaded — referenced from `/wp-content/themes/gl/resources/favicon/` in sizes 16, 32, 48, 57, 60, 72, 76, 114, 120, 144, 152, 180, 192, 512; plus `manifest.webmanifest`).

---

## 7. Copy Document

All verbatim copy extracted to `copy.md`, organized by section with heading hierarchy preserved.

---

## 8. Interactive Elements

| Element | Trigger | Visual response | Duration / easing | DOM state change |
|---|---|---|---|---|
| `.header-link` (desktop) | hover | Underline grows via `.link-underline-hover` `::after` scaleX 0→1 | ≈0.4s cubic-bezier(.77,0,.175,1) `[uncertain]` | No class change; pseudo-element transform |
| `.header-contact` | hover | `xl:hover:opacity-24` — opacity to 0.24 | Tailwind default `transition-colors duration-normal` | inline opacity |
| `.header-toggler` | click (mobile) | Toggler label slides up; `.header-menu` + `.header-menu-inner` slide down from -100% to 0; links stagger-up | 0.9s expo.inOut, link stagger 0.06s | `.header-menu` gains inline `transform: translate(0%,0%)`; toggler swaps `.header-toggler-menu` ↔ `.header-toggler-close` |
| `.works-item` | hover | No visible transform (verified in `capture/runtime-data.json.interactionProbes.worksItemHover`). Site may implement a custom cursor-follower `[uncertain]` | — | — |
| `.works-item` | in-view | Title lines + brackets yPercent 100→0; decorative dashes scaleX 0→1 | 0.9s expo.out, stagger 0.06s | `.line` transform updates |
| "All Work (28)" link | hover | `.link-underline-hover` underline grow | ≈0.4s `[uncertain]` | pseudo-element transform |
| `.process-item` | hover | Item's text color swap mist → black (adds `.a`); paired `.process-image` opacity 0→1; all siblings lose `.a` | CSS `transition: opacity .4s ease-out` `[uncertain]` | Adds `.a` class to one `.process-item` and one `.process-image` |
| Newsletter `form` | submit | Arrow slides right + fades; tick fades in; "Thanks for joining!" slides up from below (`translate(0,100%)` → 0) | 0.4–0.5s expo.out | Arrow + tick opacity; success message transform |
| `.newsletter-email-field` | focus | `outline-none rounded-none`; custom focus state not observed | — | — |
| `.footer-scroll` ("Back to top") | click | Lenis `scrollTo(0, { duration: 2 })` | ≈2s `[uncertain]` | Scroll position |
| `.footer-scroll` | hover | `xl:hover:text-black` (default mist → black) | CSS color transition | color |
| Sticky `.widget` | section enter/leave | Fades/slides in or out; title rolls over (see 4.26 + 4.27) | 0.4s power2.out | `opacity`, `visibility`, title node swap |
| Loader dismissal | page load complete | Wordmark mask-slide + text slides → `lenis-stopped` removed from `#app` | ≈1.6s staggered | removes `lenis-stopped` class |

---

## 9. Responsive Behavior

Breakpoints detected in utility classes (Tailwind default breakpoints confirmed via `md:`, `lg:`, `xl:`, `max-md:`, `max-xl:` prefixes):

- **< 768px (mobile)**
  - Grid collapses to 6 columns (`grid-cols-6`) from 12.
  - Header shows only logo + "Menu" toggler; desktop `.header-links`, `.header-time`, `.header-location`, `.header-contact` are hidden (`max-xl:hidden`).
  - Cover title uses `body-48 md:body-72 xl:body-48` — mobile 48px, tablet 72px, desktop 48px (the hero title is intentionally smaller on desktop, with the brand weight going to the large About H2).
  - `.cover-home-scroll-dark` hidden (`max-md:hidden`); `.cover-home-title-dark` hidden (`max-xl:hidden`); `.cover-home-bottom-dark` hidden (`max-xl:hidden`).
  - About section typography scales down: `.offset-title body-36 md:body-48 lg:body-60 xl:body-72`.
  - `.works-item-title` scales `body-48 md:body-72 lg:body-100`.
  - `.works-grid-button` link uses the same scale.
  - `c-works-grid` layout shifts — some `.works-grid-item` columns use `col-start-5 col-end-7` (mobile 6-col) vs. `xl:col-start-6 xl:col-end-8` (desktop 12-col), with several decorative small images hidden via `max-xl:hidden` or shown only on desktop via `xl:hidden` inversion.
  - Vision `.vision-image-wrapper` is `col-start-4 col-end-7` (mobile) vs. `xl:col-start-6 xl:col-end-8` (desktop) + `max-xl:-ml-[calc(var(--gutter)/2)] max-xl:-translate-x-1/2` (manual re-centering on mobile).
  - Vision titles use `body-36 lg:body-60`.
  - Process items `body-36 md:body-48` with mobile stacking.
  - Footer stacks vertically; extra mobile-only legal/credit blocks appear (`xl:hidden`).
- **768–1023px (md / tablet)**
  - 12-col grid begins (`md:grid-cols-12` implicit via `md:col-*` classes).
  - About portrait moves to sidebar position (`md:col-span-3`), offset title takes middle.
  - Process gets 7-step multi-column layout.
- **1024–1279px (lg)**
  - Typography steps up (`lg:body-60`, `lg:body-100`).
  - Works-item image becomes `xl:h-464` fixed height.
- **≥ 1280px (xl / desktop)**
  - Full 12-column grid active on all sections.
  - Header links, clock, location all visible; mobile `.header-menu` is hidden (`xl:hidden`).
  - Hero uses the 3-col title slot at `top-[25vh]`.
  - Works-grid adopts `xl:gap-y-140` between rows + `-mb-[55rem]` overlap.
  - Vision runway uses the full 4.25 × vh scrub.
  - Sticky widget is `sticky bottom-margin`.
  - Footer adopts the 3-column 5 / 2 / 3 layout and the black slab pins at `sticky bottom-0` with the full-width SVG wordmark.
  - Animations: no evidence of `@media (prefers-reduced-motion)` being respected in the current build `[uncertain]`.

---

## 10. Rebuild Phases

Phased implementation plan for Claude Code.

- **Phase 1 — Static layout (HTML skeleton, no styling).** Done when the page renders every section in document order (loader → header → cover → about → works → works-grid → vision → process → widget → footer → footer-bottom-slab) as plain HTML, no CSS, using the semantic structure in §3 (notably: only one `<main>`, one `<header>`, one `<footer>`, `<h1>` on hero, `<h2>` on section titles, `<h3>` on works-item titles and paragraph wrappers).
- **Phase 2 — Design tokens + base styles (no animations).** Done when `--color-*`, `--font-*`, spacing vars, 12/6-col `grid-w`, and the `body-14/16/20/48/72/100` utilities render at the correct sizes across breakpoints, Europa-Grotesk is loaded via `@font-face` with `font-display: swap`, and dark/light sections (cover, vision, footer-bottom) have their correct background/text colors.
- **Phase 3 — Copy + assets inserted.** Done when every copy block in `copy.md` appears in its section, images from the Asset Manifest render at the correct cols and aspect ratios, the three decorative SVG wordmarks (loader, header, footer-bottom) are inlined, and lazy-loading is wired on images below the fold.
- **Phase 4 — Entry animations (load-triggered from Animation Catalog).** Done when the loader (4.1, 4.2) plays on page load, the hero H1 (4.7) and scroll-cue (4.8) animate, and any `.line-w > .line` / `.char-w > .char` wrapper reveals correctly on in-view (4.9, 4.10). No scroll-linked behavior yet.
- **Phase 5 — Scroll-linked animations.** Done when Lenis is installed and active, hero parallax (4.6) scrubs, the works-grid mosaic (4.16) parallaxes per-size, the vision section (4.18, 4.19, 4.20) pins the image + scrubs three titles + crossfades paragraphs, and the footer-bottom slab (4.30, 4.31) reveals at the end of the page. Verify on a headful browser — numbers marked `[uncertain]` will need tuning.
- **Phase 6 — Interactive elements.** Done when all rows in §8 behave as captured: mobile menu slides (4.4), link-underline hovers (4.3), process item hover swaps the paired image (4.23), newsletter submit runs its arrow→tick sequence (4.28), widget fades in on section entry (4.26), and Back-to-top (4.32) scrolls smoothly to 0.
- **Phase 7 — Responsive polish.** Done when all §9 behaviors hold across 320px, 768px, 1024px, and 1440px viewports — particularly the mobile menu overlay, the 6-col → 12-col grid swap, the works-grid reflowed cell positions, and the mobile-only legal strips in the footer. Cross-check hover states are keyboard-reachable and the site remains usable with JavaScript disabled where possible.

---

## 11. AEO/AI-Visibility Readiness Notes

Passive capture only. No recommendations.

- **Schema.org markup present (JSON-LD, via Yoast SEO):**
  - `WebPage` (id: `https://telhaclarke.com.au/`)
  - `ImageObject` (primary image — og-telha-1.jpg, 1440×780)
  - `BreadcrumbList` (single item: "Home")
  - `WebSite` (id: `https://telhaclarke.com.au/#website`, with `SearchAction` defined for `?s={search_term_string}`)
- **Heading hierarchy (rendered DOM, in order):**
  - `H1` — "Driven by History, Centered on Context, Embracing Culture"
  - `H2` — "Telha Clarke is a Melbourne based Architecture & Interior Design studio, designing various project typologies across Australia and Internationally."
  - `H2` — "SELECTED WORKS" (uppercased visually; DOM text is "Selected Works")
  - `H2` — "VISION"
  - `H2` — "METHOD" (rendered twice via aria-label + char wrapper)
  - `H3` — "With experience covering a range of typologies…"
  - `H3` — "Loller"
  - `H3` — "Penthouse Vivace"
  - `H3` — "Southbank Tower"
  - `H3` — three empty h3s (the vision-title wrappers have no text at snapshot time because their contents are rendered inside `<h3 class="vision-title">` inside `.line-w` spans; see the vision section in the HTML)
  - `H3` — "The scope of our Studio covers all stages within Architecture and Interior Design…"
- **FAQ or Q&A blocks:** No (count: 0). No `<dl>` / `FAQPage` schema detected.
- **Semantic HTML usage (rendered DOM counts):**
  - `<main>` — 1
  - `<header>` — 1
  - `<footer>` — 1
  - `<nav>` — 0
  - `<article>` — 0
  - `<section>` — 0
  - `<aside>` — 0
  - Site relies on custom elements (`c-cover-home`, `c-about`, `c-works`, `c-vision`, `c-process`, `c-footer`, etc.) instead of `<section>`.
- **Meta tags (rendered DOM):**
  - `title`: `Telha Clarke — Melbourne based Architecture & Interior Design studio`
  - `meta description`: `Melbourne based architecture and interior design studio working across diverse project types in Australia and internationally.`
  - `meta robots`: `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`
  - `link rel=canonical`: `https://telhaclarke.com.au/`
  - Open Graph: `og:locale en_US`, `og:type website`, `og:title`, `og:description`, `og:url`, `og:site_name Telha Clarke`, `og:image https://telhaclarke.com.au/wp-content/uploads/2025/09/og-telha-1.jpg` (1440×780, JPEG), `article:modified_time 2026-01-07T09:32:34+00:00`
  - Twitter: `twitter:card summary_large_image` (no separate twitter:title/description)
  - `meta theme-color`: `#ffffff`
  - `meta msapplication-TileColor`: `#ffffff`
- **Domain-root probes:**
  - `/robots.txt` → **200**. Contains Cloudflare-managed "Content-Signals" preamble (`Content-Signal: search=yes,ai-train=no`), and explicit `User-agent: Amazonbot Disallow: /` and `User-agent: Applebot-Extended Disallow: /` blocks. Default `User-agent: *` → `Allow: /`.
  - `/llms.txt` → **404** (not present).
  - `/ai.txt` → **404** (not present).
  - `/sitemap.xml` → **200** (served).
- **Content chunking statistics (rendered DOM):**
  - Paragraph count (`<p>`): 4
  - Average paragraph length: ≈ 175 characters
  - List usage (`<ul>` + `<ol>`): 0
  - Note: the site avoids lists even for structurally list-like content — process steps are rendered as inline `<span>` chains separated by `/`, and the vision titles are a 3-item `.flex-nowrap` of individual `<h3>` elements, not an `<ol>`.
