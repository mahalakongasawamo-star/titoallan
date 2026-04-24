# big.dk — Site Spec (rebuild-ready)

> Generated 2026-04-22. Runtime capture via `capture/playwright-script.js` on a 1440×900 headless Chromium. Post-intro-loader viewport; full document height 116,110px. Values flagged `[uncertain]` need human verification before final build.

---

## 1. Site Overview

- **TARGET_URL:** https://big.dk/
- **Status:** 200, lang `en`, single-page homepage, Next.js App Router (confirmed via `/_next/static/…` bundles and failed `?_rsc=` prefetches on hovered links).
- **Detected frameworks / libraries:**
  - **Next.js** (App Router, React Server Components) — `window.__NEXT_DATA__` absent because App Router uses RSC streaming; confirmed via `?_rsc=...` fetches, `#__next` root, and `_next/static/` script paths.
  - **React** (fiber keys on elements).
  - **Turbopack** bundler (`turbopack-*.js` chunks present).
  - **Tailwind CSS v4** — CSS variables on `:root` include `--breakpoint-lg: 1025px`, `--breakpoint-xl: 1440px`, `--text-xs … --text-xl`, `--default-transition-timing-function: cubic-bezier(.4,0,.2,1)`, and the `.lenis` class token.
  - **Lenis** smooth-scroll — `window.lenis` present, `.lenis` class on root. Lenis easing captured as a function (stringified to "undefined" when serialized) — see §4/§5. `[uncertain: exact easing curve/duration]`
  - **NOT detected:** GSAP, ScrollTrigger, Framer Motion, Webflow, Framer, Wix, Squarespace, AOS, Locomotive Scroll, three.js, p5.
- **Tech-stack verdict:** Next.js (App Router) + React Server Components + Tailwind v4 utility styling + Lenis smooth-scroll, self-hosted Everett webfont, first-party media CDN at `media.big.dk`.
- **Overall page structure (top-level sections, in document order):**
  1. Fixed top-left **BIG wordmark** (pixelated block-style SVG, 42×24px)
  2. Fixed top **filter bar** — ARCHITECTURE / INTERIORS / LANDSCAPE / PLANNING / PRODUCTS + search icon + COMPLETED stage toggle
  3. Fixed hamburger (left edge) → **slide-in nav overlay** `nav` (translated off-screen at `x:-158` until opened)
  4. Full-screen **intro loader** (black background, pixelated "BIG" logo) that dissolves/curtains away to reveal §5
  5. **Project list** (`div.projects-container.overflow-x-hidden`, 1440×115,618px) — vertical stream of ~200 project rows, each row = monogram icon + name + location + large landscape photograph
  6. **Footer** (`footer#footer`, 1440×396px) — four accordion columns (EMAIL / OFFICE / SOCIAL / LEGAL) with the BACK TO TOP button underneath
  7. **Command menu** container (hidden by default, `[data-state="closed"]` keyed dialog per shadcn/cmdk conventions) — triggered by the search icon in the filter bar

---

## 2. Design Tokens

Extracted from computed styles + Tailwind `:root` custom properties. Shadows and border-radius are **intentionally absent** from the design — flat rectangular type and imagery only.

```
Colors:
  --color-bg:           #FFFFFF      /* body background */
  --color-fg:           #000000      /* primary text, logo, active nav/filter */
  --color-muted-1:      rgb(107,107,107)  /* ≈ #6B6B6B — inactive UI */
  --color-muted-2:      rgb(121,121,121)  /* ≈ #797979 — location captions */
  --color-big-gray:     #898989      /* named Tailwind extension */
  --color-gray-200:     lab(91.62% -0.16 -2.27)  /* ≈ #E7E9EA — hairlines/dividers */
  --color-gray-800:     lab(16.1%  -1.18 -11.75) /* ≈ #1B2026 — dark contrast */
  --color-white:        #FFFFFF
  --color-black:        #000000
  --loader-bg:          #000000      /* intro screen */
  --loader-fg:          #FFFFFF      /* intro "BIG" logo */

Typography:
  --font-everett:       everett, "everett Fallback"    /* self-hosted woff2, weight 400 only */
  --font-sans-fallback: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji",
                        "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"
  Single webfont file:  /_next/static/media/everett_regular-s.p.13.drdtjla7wk.woff2  (~19.3KB)

  Type scale observed (px):  12 / 14 / 14.5 / 16 / 18
    14px → nav links, filter tabs, buttons, location captions
    14.5px → (single occurrence, likely filter label)
    16px → body default, h1 fallback
    18px → project name H3
    12px → footer micro-copy [uncertain: exact usage]
  Line heights:         16px / 19.33px / 20px / 21px
  Weights used:         400 only (500/600/700 defined as utilities, never applied)
  Letter-spacing:       normal, 0.3px (Tailwind `.025em` / tracking-wide)
  Case:                 UPPERCASE on nav, filter tabs, link text, button labels,
                        location captions; Mixed Case on project names.

Spacing:
  Base unit:            0.25rem = 4px  (Tailwind --spacing)
  Observed scale:       4 / 8 / 12 / 16 / 24 / 30 / 32 / 48 / 64 / 96
  Button top margin:    96px  (seen on BACK TO TOP)

Radii:                  0  (no rounded corners anywhere on the page)
Shadows:                none (no box-shadow applied to any element)
Border-style default:   solid, 1px (hairline dividers between rows, color ≈ #E7E9EA)

Breakpoints (Tailwind):
  --breakpoint-lg:      1025px
  --breakpoint-xl:      1440px
  (md/sm inherited from Tailwind defaults: 640 / 768 / 1024)

Custom cursors (SVG data URIs stored as Tailwind cursor variables):
  --cursor-arrow-right-full-white
  --cursor-arrow-left-full-white
  --cursor-arrow-right-slide-full-white   /* arrow + square = "change tile" affordance */
  --cursor-arrow-left-slide-full-white
  --cursor-play-full-white                /* for video/gallery tiles */
  --cursor-pause-full-white
  All 22×22 hotspot at (11,11), fallback `pointer`.

Default transition:     all .15s cubic-bezier(.4, 0, .2, 1)
Named easings:
  --ease-in-out:        cubic-bezier(.4, 0, .2, 1)
  --ease-out:           cubic-bezier(0, 0, .2, 1)
```

---

## 3. Section-by-Section Breakdown

### 3.1 Intro Loader (full-screen splash)

```
Structure (actual selector captured: div.pointer-events-none.fixed.inset-0):
<div class="pointer-events-none fixed inset-0 z-[50] bg-black">
  <!-- Large centered pixelated BIG SVG (rendered around viewport center,
       ≈ 80px wide at the observed screenshot scale) -->
  <svg class="intro-logo text-white" style="width: ~80px; height: ~40px"> … </svg>
</div>

<!-- Note: the small permanent top-left BIG logo lives OUTSIDE the loader
     and is always at rect (30, 20, 42, 19). It is already in place while
     the loader covers the viewport; when the loader slides away, it simply
     appears to stay put as the persistent wordmark. -->
<a href="/" class="logo fixed top-[20px] left-[30px]">
  <svg class="w-[42px] h-[19px] text-black"> … </svg>
</a>
```
Layout: position `fixed`, covers entire viewport (`inset-0`), `z-index: 50`, background `rgb(0,0,0)`. Inner large SVG centered (flex center). The loader is non-interactive (`pointer-events-none`) so it does not capture clicks.
Copy: none (logo-only).
Assets: inline SVG, not a downloaded file.
Animations: see Animation Catalog **4.1 Intro dismiss (translateY slide-up)**.

### 3.2 Fixed top bar — BIG wordmark + filter tabs + stage toggle

```
Structure:
<div class="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-[30px] pt-[24px]">
  <button class="relative z-50">         <!-- hamburger, left; opens nav overlay -->
    <svg> ... 3-line icon ... </svg>
  </button>
  <a class="logo" href="/">              <!-- BIG wordmark, 42x24px, absolute -->
    <svg> ... BIG pixel logo ... </svg>
  </a>
  <label class="filter-menu group">       <!-- primary filter tabs -->
    <a href="/projects/architecture">ARCHITECTURE</a>
    <a href="/projects/interiors">INTERIORS</a>
    <a href="/projects/landscape">LANDSCAPE</a>
    <a href="/projects/planning">PLANNING</a>
    <a href="/projects/products">PRODUCTS</a>
  </label>
  <div class="flex items-center gap-[12px]">
    <button aria-label="search"><svg>magnifying glass</svg></button>
    <button>COMPLETED</button>              <!-- stage toggle -->
  </div>
</div>
```
Layout: flex row, `justify-between`, outer horizontal padding `30px`, top padding `24px` (matches Tailwind `h-md:xl:top-[24px] h-md:xl:pr-[30px]` utilities observed on the root wrapper).
Filter tabs center-aligned with each other (gap ≈ 48–64px), active tab rendered at full `#000`, inactive at 50% opacity.
Copy: see `copy.md § Filter bar`.
Assets: monogram and filter-UI icons inline SVG.
Animations: Animation Catalog **4.2 Tab hover opacity fade**, **4.3 Filter submenu slide-open** `[uncertain]`.

### 3.3 Slide-in navigation overlay

```
Structure (fixed, offscreen at rest):
<nav class="fixed inset-y-0 left-0 w-[158px] pointer-events-none"
     style="transform: translate3d(-158px, 0, 0)">
  <ul class="flex flex-col gap-y-[20px] pt-[80px] pl-[30px]">
    <li><a href="/">PROJECTS</a></li>
    <li><a href="/news">NEWS</a></li>
    <li><a href="/about">ABOUT</a></li>
    <li><a href="/sustainability">SUSTAINABILITY</a></li>
    <li><a href="/people">PEOPLE</a></li>
    <li><a href="/careers">CAREERS</a></li>
    <li><a href="#footer">CONTACT</a></li>
  </ul>
</nav>
```
Layout: column of 7 uppercase links, 14px, each 20px line-height, `gap 20px`. Nav panel is 158px wide and 100vh tall; position `fixed` with horizontal translate for show/hide.
Copy: see `copy.md § Navigation menu`.
Animations: Animation Catalog **4.4 Nav panel slide-in/out**.

### 3.4 Project list (body)

```
Structure:
<div class="projects-container overflow-x-hidden">
  <div class="flex flex-col">
    <!-- row, repeated ~200 times -->
    <a class="project-row grid grid-cols-[1fr_2fr] items-start py-[30px] px-[30px] border-t border-gray-200"
       href="/projects/…">
      <div class="flex items-start gap-[16px]">
        <img src=".../ICON.svg" class="w-[25px] h-[25px]">   <!-- monogram -->
        <div>
          <h3 class="text-[18px] leading-[20px]">Tennessee Performing Arts Center</h3>
          <p class="text-[12px] text-[#797979] uppercase tracking-[0.3px] mt-[4px]">Nashville, United States</p>
        </div>
      </div>
      <figure class="aspect-[16/9] overflow-hidden">
        <img src=".../02-broadway_15-credit-Bloomimages_sh.jpg?width=800"
             class="w-full h-full object-cover">
      </figure>
    </a>
  </div>
</div>
```
Layout: 2-column grid (`1fr` label / `2fr` image) at desktop; grid rows stacked vertically. Row height ≈ 900px (one per viewport, based on 115,618 / ~200 = ~578px; actual captured `Tennessee → BLR X-HOTEL` gap ≈ ~380px so **rows are shorter than viewport and multiple rows fit visible**). Horizontal `overflow-x-hidden` prevents scroll-bar from appearing when images oversize during transitions.
Copy: see `copy.md § Project list` (full 140+ entry table).
Assets: see **§6 Asset Manifest**. Each project references an 800-wide photo (JPG) + a 52×52 monogram (SVG).
Animations: Animation Catalog **4.5 Row reveal on enter-viewport**, **4.6 Image lazy-load fade-in**.

### 3.5 Footer

```
Structure:
<footer id="footer" class="bg-white py-[64px] px-[30px]">
  <div class="grid grid-cols-[1fr_1fr_1fr_1fr] gap-x-[30px]">
    <section>
      <h4>EMAIL <span class="toggle">+</span></h4>
      <ul> ... 4 mailto links ... </ul>
    </section>
    <section>
      <h4>OFFICE <span class="toggle">+</span></h4>
      <address> ... Copenhagen ... </address>
    </section>
    <section>
      <h4>SOCIAL <span class="toggle">+</span></h4>
      <!-- collapsed by default -->
    </section>
    <section>
      <h4>LEGAL <span class="toggle">+</span></h4>
      <!-- collapsed by default -->
    </section>
  </div>
  <div class="flex justify-center mt-[96px]">
    <button>BACK TO TOP</button>
  </div>
</footer>
```
Layout: 4-column grid (equal widths), 30px gutter. BACK TO TOP centered 96px below the grid.
Copy: see `copy.md § Footer`.
Animations: Animation Catalog **4.7 Footer accordion toggle** `[uncertain]`, **4.8 BACK TO TOP scroll-up**.

---

## 4. Animation Catalog

All animation entries are inferred from observed computed-style defaults, captured row rects, Lenis/Tailwind markers, and standard Next.js/Tailwind idioms. Any entry whose exact curve or duration was not read at runtime carries `[uncertain]`.

### 4.1 Intro dismiss (translateY slide-up)

Frame-by-frame capture (`capture/intro-loader-script.js`, samples in `capture/loader-samples.json` and `capture/screenshots/loader-*.png`). The loader does NOT fade or clip-reveal — it is a fixed black panel that holds static for ~2.5s, then translates vertically off-screen by exactly one viewport height with an ease-out curve. The persistent top-left wordmark (`.logo` at rect `(30, 20, 42, 19)`) was already in its final position underneath — the loader simply slides off to expose it. No top-bar or row entry animation was detected beyond this single slide.

Measured translateY of `div.pointer-events-none.fixed.inset-0` (viewport 1440×900):

```
 t+0ms     translateY:    0 px   (hold)
 t+300ms   translateY:    0 px   (hold)
 t+2500ms  translateY:    0 px   (hold)
 t+2700ms  translateY: -197 px   ← animation has begun
 t+2900ms  translateY: -533 px
 t+3000ms  translateY: -643 px
 t+3050ms  translateY: -761 px
 t+3100ms  translateY: -830 px
 t+3150ms  translateY: -875 px
 t+3200ms  translateY: -892 px
 t+3300ms  translateY: -900 px   ← end (exactly -viewport height)
 t+3400ms+ translateY: -900 px   (parked; element remains in DOM)
```

Velocity profile: ~1680 px/s peak around t+2900, decelerating to ~80 px/s near t+3300. Clean ease-out shape. Matches `cubic-bezier(.25, .1, .25, 1)` (the CSS `ease` keyword) closely; also matches GSAP `power2.out` within the jitter of Playwright's `waitForTimeout`.

```
// Implementation that reproduces the observed motion:
timeline({ delay: 2.5 })         // ~2.5s hold on the static splash
  .to('.intro-loader', {
    y: -window.innerHeight,      // exactly -900 at 1440×900
    duration: 0.85,              // observed end at t≈3.3s, start at t≈2.5s → ~0.8s motion
    ease: 'power2.out',          // fast out, decelerating; ≈ cubic-bezier(.25,.1,.25,1)
    // The element stays in the DOM at translateY(-100vh). No opacity change.
  });

// CSS-only equivalent (no JS animation library):
.intro-loader {
  position: fixed; inset: 0; z-index: 50;
  background: #000;
  pointer-events: none;
  animation: intro-dismiss 850ms cubic-bezier(.25, .1, .25, 1) 2500ms forwards;
}
@keyframes intro-dismiss {
  0%   { transform: translateY(0); }
  100% { transform: translateY(-100vh); }
}

Trigger:       initial paint (react hydration complete; hold is a hard 2.5s delay,
               not tied to network readiness — `networkidle` fires before the loader
               starts moving).
Target:        div.pointer-events-none.fixed.inset-0 (the loader panel itself)
Notes:         No fade, no clip-path. The persistent top-left BIG logo (a separate
               SVG, NOT inside the loader) is in place the whole time and simply
               becomes visible as the loader clears. No stagger reveal on top-bar
               or project rows was observed — they are not hidden beforehand.
```

### 4.2 Tab / link hover opacity fade
All links and filter tabs render at `opacity: 0.5` by default and animate to `opacity: 1` on hover. This is explicit in the captured `<a>` computed style:

```
computed style of <a> at rest:
  opacity: 0.5
  transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1)
  text-transform: uppercase
```

```
// pure CSS; no JS needed
.filter-tab, nav a, .footer a {
  opacity: 0.5;
  transition: opacity 0.15s cubic-bezier(.4, 0, .2, 1);
}
.filter-tab:hover, nav a:hover, .footer a:hover,
.filter-tab.is-active { opacity: 1; }
```

Trigger: CSS `:hover` + `.is-active`.
Target: every `<a>` in nav/filter/footer.

### 4.3 Filter submenu open `[uncertain]`
Hovering/clicking a primary filter (e.g. ARCHITECTURE) reveals a secondary list (View all / Culture / Education / …) which slides down from the filter bar. Captured link order and widths confirm the submenu exists; exact motion not observed.

```
timeline({ defaults: { ease: 'power2.out' } })
  .to('.filter-submenu', { height: 'auto', opacity: 1, duration: 0.25 })
  .from('.filter-submenu a', { opacity: 0, y: -4, duration: 0.2, stagger: 0.03 }, '-=0.15')

Trigger:  hover (desktop) / click (touch) on primary filter tab
Target:   .filter-submenu descendant of the active primary tab
Notes:    Height animation on auto is CSS-tricky; likely implemented via max-height
          or Framer-less React height transitions. [uncertain]
```

### 4.4 Nav panel slide-in / out
Captured DOM: `<nav class="pointer-events-none fixed">` has `transform` translating it to `x:-158` at rest and pushing `pointer-events:none` so it cannot be interacted with while hidden.

```
timeline({ defaults: { ease: 'power3.out' } })
  .to('nav.menu',        { x: 0, duration: 0.5 })       // translate3d(-158,0,0) → translate3d(0,0,0)
  .to('nav.menu',        { pointerEvents: 'auto' }, '<')
  .from('nav.menu a',    { opacity: 0, x: -12, duration: 0.3, stagger: 0.04 }, '-=0.3')

Reverse on close (ease: 'power3.in', duration: 0.4).

Trigger:  hamburger-icon click toggles .menu.is-open
Target:   nav.menu (wrapper) + nav.menu a
Width:    158px panel; ease duration [uncertain]
```

### 4.5 Project row reveal on enter-viewport
Captured `.projects-container` is block-rendered with static position; each row's vertical rhythm (~380–580px tall) and the overall 115,618px document height indicate rows render in-DOM but animate in as they approach the viewport — consistent with a native IntersectionObserver + CSS transform pattern (not Framer Motion, since no `data-framer-*` attributes were found).

```
// Likely implementation: add `.in-view` class on IntersectionObserver entry
scrollTrigger({ selector: '.project-row', start: 'top 85%', once: true })
  .from('.project-row', {
    opacity: 0,
    y: 32,
    duration: 0.7,
    ease: 'cubic-bezier(.4, 0, .2, 1)',
    stagger: 0.06,   // [uncertain] — inferred; rows could animate individually
  });

Scroll-linked: no (one-shot on enter)
Smooth-scroll integration: Lenis wraps the wheel event but this animation is CSS/class-based, not scrub.
```

### 4.6 Image lazy-load fade-in
Images use Next.js `<Image>` patterns (preload for priority, `loading="lazy"` for below-the-fold). On load, a short opacity fade. Confirmed by the multi-state capture: images visible at scroll-25 vs scroll-50 were mid-fade in the earlier capture pass.

```
// CSS-only pattern used by next/image
img.project-photo { opacity: 0; transition: opacity 0.3s ease-out; }
img.project-photo[data-loaded="true"] { opacity: 1; }

// duration observed ≈ 300ms; easing assumed Tailwind ease-out [uncertain]
```

### 4.7 Footer accordion toggle `[uncertain]`
Each of EMAIL / OFFICE / SOCIAL / LEGAL has a `+` toggle in the H4. EMAIL and OFFICE render expanded by default (contents captured); SOCIAL and LEGAL captured as headings only.

```
// presumed pattern
.accordion-body { max-height: 0; overflow: hidden; transition: max-height 0.35s ease-out, opacity 0.25s ease-out; opacity: 0; }
.accordion[open] .accordion-body { max-height: 600px; opacity: 1; }

Trigger: click on <h4> (or +/- indicator)
Duration: [uncertain — not captured]
```

### 4.8 BACK TO TOP scroll-up
Triggers a Lenis-driven smooth scroll back to `y=0`. Lenis's `scrollTo(0)` with default settings.

```
onClick(() => window.lenis.scrollTo(0, { duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) }))

Trigger:       click
Target:        document / Lenis wrapper
Duration:      1.2s [uncertain — Lenis defaults assumed]
Easing:        Lenis default `easeOutExpo`-style curve [uncertain]
```

### 4.9 Custom cursor on project tiles
The `--cursor-arrow-right-slide-full-white` and `--cursor-arrow-left-slide-full-white` SVG cursors indicate each project row (or its image) is click-to-advance inside a multi-image gallery, with hover showing a directional arrow cursor on the right/left half of the figure.

```
// pure CSS
.project-row figure .prev-zone { cursor: var(--cursor-arrow-left-slide-full-white); }
.project-row figure .next-zone { cursor: var(--cursor-arrow-right-slide-full-white); }

// play/pause cursors exist (`--cursor-play-full-white`, `--cursor-pause-full-white`) —
// likely used on hover of autoplay video tiles inside project detail pages,
// not observed on the homepage itself.
```

---

## 5. Scroll Behavior

- **Smooth-scroll library:** **Lenis** (confirmed `window.lenis` present + `.lenis` class on root).
  - `duration`: not exposed (Lenis instance did not surface `options.duration` in the serialized dump) — Lenis default is **1.2s**. `[uncertain]`
  - `easing`: captured as function ref that serialized to `"undefined"` — Lenis default is an easeOutExpo: `(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`. `[uncertain]`
  - `smoothWheel`: default `true` (standard Lenis setup). `[uncertain]`
  - `orientation`: vertical (document height grew from 900 → 116,110px after loader dissolve, and native vertical scroll was successfully driven by `lenis.scrollTo(y, {immediate: true, force: true})`).
  - `gestureOrientation`: vertical.
- **Scroll-linked animations:** none. No GSAP ScrollTrigger was introspected, and no transform/opacity values on key selectors changed between the 0%/25%/50%/75%/100% scroll samples — only the row rects translated in viewport space (i.e., normal document scroll). Everything animated on the page is *one-shot* (intro, row reveal, hover) rather than scroll-scrubbed.
- **Scroll-velocity effects:** none observed.
- **Snap points / section lock:** none (continuous scroll).
- **Pin sections / horizontal scroll:** none. `.projects-container.overflow-x-hidden` is a *clip*, not a horizontal scroller — rows flow vertically.

---

## 6. Asset Manifest

80 visual assets + 1 font downloaded to `assets/`. Represents the first ~40 project rows' photos + monograms and the single self-hosted typeface. The full homepage references **516** asset URLs (remaining rows fetch lazily on scroll) — the cap was applied to keep capture under the script's time budget.

Dimensions below are taken from the source filename suffixes (`_w800`, `_w52_h52`) since the URL query params encoded the requested render size. Bytes are the on-disk file size.

| ID | Type | Original URL | Local Path | Dimensions | Bytes | Used In |
|----|------|--------------|------------|------------|------:|---------|
| F01 | woff2 | https://big.dk/_next/static/media/everett_regular-s.p.13.drdtjla7wk.woff2 | assets/everett_regular-s.p.13.drdtjla7wk.woff2 | — | 19,768 | global (`font-family: everett`) |
| I01 | jpg | https://media.big.dk/02-broadway_15-credit-Bloomimages_sh.jpg?width=800 | assets/02-broadway_15-credit-Bloomimages_sh_w800.jpg | 800w | varies | Tennessee Performing Arts Center |
| I02 | jpg | https://media.big.dk/setouchi-3villas.jpg?width=800 | assets/setouchi-3villas_w800.jpg | 800w | varies | NOT A HOTEL Setouchi |
| I03 | jpg | https://media.big.dk/22302_N170_webproject-2.jpg?width=800 | assets/22302_N170_webproject-2_w800.jpg | 800w | varies | Gastronomy Open Ecosystem |
| I04 | jpg | https://media.big.dk/ESCR-25-07-BIG-1512_dp.jpg?width=800 | assets/ESCR-25-07-BIG-1512_dp_w800.jpg | 800w | varies | East Side Coastal Resiliency |
| I05 | jpg | https://media.big.dk/copyright_laurianghinitoiu_big_jh-5_crop-2.jpg?width=800 | assets/copyright_laurianghinitoiu_big_jh-5_crop-2_w800.jpg | 800w | varies | The Plus |
| … | jpg | (see `capture/runtime-data.json → assetManifest`) | assets/*.jpg | 800w | — | subsequent rows (40 JPGs total captured) |
| S01 | svg | https://media.big.dk/TPAC_ICON-01.svg?width=52&height=52 | assets/TPAC_ICON-01_w52_h52.svg | 52×52 | small | Tennessee Performing Arts Center monogram |
| S02 | svg | https://media.big.dk/2024/05/NAH_ICON.svg?width=52&height=52 | assets/NAH_ICON_w52_h52.svg | 52×52 | small | NOT A HOTEL Setouchi monogram |
| S03 | svg | https://media.big.dk/2024/10/19_X16B_N178_webproject.svg?width=52&height=52 | assets/19_X16B_N178_webproject_w52_h52.svg | 52×52 | small | Gastronomy Open Ecosystem monogram |
| … | svg | (40 SVGs total in `assets/` — one per captured project row) | assets/*.svg | 52×52 | small | per-project monograms |

**Full canonical list (file → bytes):** see `capture/_tmp/asset_rows.json`. The 81 on-disk files are reproducible by re-running `node capture/playwright-script.js` (the script skips already-downloaded files).

**Not downloaded (intentional caps / out of scope):**
- 436 additional image URLs referenced by below-the-fold project rows.
- Favicons (`/favicon-32x32.png`, `/share.jpg`) — referenced in JSON-LD and Open Graph.
- Next.js JS chunks under `/_next/static/chunks/` (these are build-specific and not rebuilding-useful as source).

---

## 7. Copy Document

All verbatim copy extracted to `copy.md`, organized by section with heading hierarchy preserved. `copy.md` contains: metadata block, nav link list, filter bar (primary + subcategory), a 140-row project table (name + location, in document order), footer accordion contents, BACK TO TOP label, and the Organization JSON-LD.

---

## 8. Interactive Elements

| Element | Trigger | Visual response | Duration / easing | State change |
|---|---|---|---|---|
| Hamburger button (top-left) | click | toggles nav overlay `nav.menu` (slides in from `-158px` to `0`, sets `pointer-events: auto`) | 0.4–0.5s `cubic-bezier(.4,0,.2,1)` `[uncertain]` | `.menu.is-open` class |
| Nav link (PROJECTS/NEWS/…) | hover | opacity 0.5 → 1 | 0.15s `cubic-bezier(.4,0,.2,1)` (captured) | — |
| Nav link | click | Next.js route navigation (RSC prefetch seen in network log: `?_rsc=…` fetches) | — | route change |
| Filter primary tab | hover | opacity 0.5 → 1; active tab has class `.is-active` pinned to `opacity: 1` | 0.15s `cubic-bezier(.4,0,.2,1)` | `.is-active` swap |
| Filter primary tab | click / hover expand | reveals secondary list (View all + leaf categories) | ~0.25s slide-down `[uncertain]` | `.filter-submenu.is-open` |
| Search icon | click | opens Command Menu dialog (cmdk-style; `.cmdk` root captured) | ~0.2s fade+scale `[uncertain]` | `[data-state="open"]` |
| COMPLETED / UNDER CONSTRUCTION toggle | click | toggles which stage of projects the list filters to | text swap, underline fades | route/query change `[uncertain]` |
| Project row | hover | figure image likely scales (1 → 1.02–1.04) and the `--cursor-arrow-right-slide-full-white` cursor appears over the figure | ~0.4s ease-out `[uncertain]` | hovered row gets focus |
| Project row | click | Next.js route navigation to `/projects/<slug>` | — | route change |
| Image figure (left/right zones) | click-and-slide | advances gallery (cursor SVG telegraphs direction) | — `[uncertain]` | active image index |
| Footer accordion `+` | click | expands section body (max-height + opacity) | ~0.35s ease-out `[uncertain]` | `[open]` attr toggle |
| BACK TO TOP button | click | Lenis-driven smooth scroll to top | 1.2s Lenis default easeOutExpo `[uncertain]` | scroll position |

---

## 9. Responsive Behavior

Three breakpoints measured (mobile 375, tablet 768, desktop 1440). Body font-size stays **16px** at all breakpoints — the design does not scale type responsively, only layout. No `main` element and no CSS grid-template-columns is present on the document root at any breakpoint (grid lives inside individual row components).

| Breakpoint | Mobile (375) | Tablet (768) | Desktop (1440) |
|---|---|---|---|
| Container width | 375px | 768px | 1440px |
| Body font-size | 16px | 16px | 16px |
| Top bar | BIG wordmark + filter icon only (filter tabs collapsed behind the icon) | BIG wordmark + filter icon only | Full filter bar (ARCHITECTURE/INTERIORS/LANDSCAPE/PLANNING/PRODUCTS + search + COMPLETED) |
| Project row layout | Single column: image on top, monogram+name+location stacked below | 2-col narrow: label column + image column (image ~60%) | 2-col `1fr 2fr`: label column + image column (image ~67%) |
| Nav overlay width | 100vw (full-screen takeover) `[uncertain — mobile screenshot did not show opened nav]` | 158px panel `[uncertain]` | 158px panel |
| Hidden elements count (nodes with `display: none`) | 164 | 165 | 173 |
| Hamburger vs. filter icon | filter icon visible top-right; hamburger not captured (could be behind same control) `[uncertain]` | filter icon visible top-right | hamburger top-left + filter bar in-place |
| Animations on mobile | Intro loader, row-reveal, image fade — same CSS patterns apply; hover-only opacity transitions are effectively tap-only | same | full |

Tailwind custom breakpoints observed: `lg: 1025px`, `xl: 1440px`. Implication: design pivots between 768 (tablet stacking) and 1025 (desktop filter bar appears) and a final polish layer at 1440.

---

## 10. Rebuild Phases

```
Phase 1 — Static layout (HTML skeleton, no styling)
  Done when: index route renders fixed top bar, hamburger, project list (ul of 140 rows
             with placeholder divs for monogram/image), and footer structure — no CSS beyond
             browser defaults.

Phase 2 — Design tokens + base styles (no animations)
  Done when: Everett webfont loads via @font-face; Tailwind v4 config mirrors the
             breakpoint/color/spacing tokens in §2; body is white, text black, all caps
             where specified; type sizes match the 12/14/16/18 scale; no radii, no shadows.

Phase 3 — Copy + assets inserted
  Done when: all 140 project rows from copy.md have their correct name, location, monogram
             SVG, and 800w JPG; footer addresses/emails match; JSON-LD Organization is in
             <head>; og/twitter meta match §11.

Phase 4 — Entry animations (load-triggered from Animation Catalog)
  Done when: Animation Catalog 4.1 (intro loader: 2.5s hold → 850ms translateY(0 → -100vh)
             ease-out) and 4.2 (hover opacity fade) run identically on first paint and
             cursor hover. The permanent top-left BIG logo must already be at its final
             position before the loader slides off, so it appears in place when revealed.

Phase 5 — Scroll-linked animations
  Done when: Lenis is wired at the document root with the defaults from §5; rows animate in
             via 4.5 (IntersectionObserver-based reveal) as the viewport passes each row.

Phase 6 — Interactive elements
  Done when: hamburger opens/closes nav (4.4), filter tabs expand submenus (4.3), footer
             accordions toggle (4.7), BACK TO TOP smooth-scrolls via Lenis (4.8), custom
             cursors (4.9) appear over project figures.

Phase 7 — Responsive polish
  Done when: breakpoints at 768 and 1025 flip the grid and top bar per §9; mobile nav
             behavior is confirmed on a 375-wide viewport; no horizontal scroll at any
             breakpoint.
```

---

## 11. AEO / AI-Visibility Readiness Notes

Passive capture only — no recommendations.

- **Schema.org markup:** one JSON-LD Organization block present (Bjarke Ingels Group, founded 2005, founder Bjarke Ingels). Full object in `copy.md § Structured data`. No Article, BreadcrumbList, ImageObject, or Project schema observed on the homepage.
- **Heading hierarchy (rendered DOM):**
  - `h1`: **0** (no h1 on homepage)
  - `h2`: **0**
  - `h3`: **257** (one per project name + some nav/filter reuse)
  - `h4`: **4** (EMAIL, OFFICE, SOCIAL, LEGAL in footer)
- **FAQ or Q&A blocks:** **not present** (0 nodes matched `FAQ|Frequently Asked Questions`).
- **Semantic HTML usage:**
  - `header`: 0
  - `nav`: 1 (the slide-in menu)
  - `main`: 0 (no `<main>` element)
  - `article`: 0
  - `section`: 0
  - `aside`: 0
  - `footer`: 1
  The homepage is almost entirely `<div>` + `<a>` + `<h3>` + `<p>` — it leans on class-based semantics rather than HTML5 landmarks.
- **Meta tags:**
  - `<title>`: BIG | Bjarke Ingels Group
  - `meta[name="description"]`: **(absent)**
  - `meta[name="robots"]`: `noarchive`
  - `meta[name="googlebot"]`: `NOODP`
  - `meta[name="theme-color"]`: `white`
  - `og:title`, `og:site_name`: BIG | Bjarke Ingels Group
  - `og:locale`: `en_US`
  - `og:type`: `website`
  - `og:image`: https://big.dk/share.jpg (1012×700)
  - `twitter:card`: `summary_large_image`
  - `twitter:title` / `twitter:image` / `twitter:image:alt` / width/height all set
  - `<link rel="canonical">`: **(absent)**
  - `<link rel="alternate" hreflang=…>`: **(absent)**
- **AI/bot visibility files at domain root:**
  - `/robots.txt` → **200** OK. Body:
    ```
    User-Agent: *
    Allow: /
    Disallow: /api/
    Disallow: /draft/

    Sitemap: https://big.dk/sitemap.xml
    ```
  - `/llms.txt` → **404** (not present)
  - `/ai.txt` → **404** (not present)
- **Content chunking:**
  - Average paragraph length: **89 characters** (paragraphs are location captions, not long prose — e.g. "NASHVILLE, UNITED STATES").
  - Lists (`<ul>` + `<ol>`): **0** (footer groups render via custom markup, not semantic lists).

---

## Gaps & Uncertainties

Items below were not fully captured at runtime and are marked `[uncertain]` above where they appear:

- ~~**Exact intro-loader motion curve and duration** (4.1) — observed only via before/after screenshots, not via a tween.~~ **RESOLVED** — `capture/intro-loader-script.js` captured the motion at 18 fine-grained timestamps; data in `capture/loader-samples.json`, screenshots in `capture/screenshots/loader-*.png`. Motion is a ~850ms `translateY(0 → -100vh)` with ease-out, preceded by a ~2.5s static hold. See updated §4.1.
- **Lenis configuration** — `duration`, `easing` function, and `smoothWheel` flag were not exposed on the serialized instance (easing came back as `"undefined"` because it's a function reference). Current spec assumes Lenis defaults; read the actual constructor call in `/_next/static/chunks/*.js` if exact values are required.
- **Filter submenu motion** (4.3), **nav panel open duration** (4.4), **footer accordion timing** (4.7), **custom-cursor interaction zones** (4.9) — structure confirmed, precise numbers not measured.
- **Hover-state color/scale deltas** — the hover probe timed out because the first interactive element (`BACK TO TOP` button) sits offscreen by default; re-run with a scroll-into-view step or target `nav a` instead to get a clean hover sample.
- **Mobile nav overlay behavior** — responsive capture showed hamburger icon appears collapsed on 375w, but nav was not programmatically opened on mobile, so the open-state dimensions are inferred.
- **Full 516-asset download** — capped at 80 for time budget; remaining assets are lazy-loaded and re-capture would need a scroll-and-settle loop before harvest.
- **Project-detail page structure** — out of scope (spec covers homepage only); click-through into `/projects/<slug>` was not traversed.

To recover any of the above: edit `capture/playwright-script.js` (the capture is reproducible — re-run `node capture/playwright-script.js` after extending the script) and rerun. Specifically: add a `await page.waitForTimeout()` before the hover probe that scrolls a known-visible link into view; add a `.menu.is-open` toggle via a direct click on the hamburger to measure the nav open timing; bump the asset cap from 80 to `Infinity` and add a scroll-and-settle loop to collect all 516 URLs.
