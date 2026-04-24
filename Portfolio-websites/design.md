# Design Reference: telhaclarke.com.au
**Source:** https://telhaclarke.com.au/  
**Studio:** Telha Clarke — Melbourne-based Architecture & Interior Design  
**Purpose:** Full design reference for cloning the visual style, layout, and interactions to a new website.

---

## 1. Brand Identity

| Attribute | Value |
|-----------|-------|
| Studio Name | Telha Clarke |
| Tagline | "Driven by History, Centered on Context, Embracing Culture" |
| Location | South Yarra, Melbourne, Australia |
| Industry | Architecture & Interior Design |
| Brand Voice | Minimal, editorial, restrained — lets photography do the talking |

---

## 2. Color Palette

| Role | Color | Hex |
|------|-------|-----|
| Background (default) | Off-white / Cream | `#FAF7F5` (approx warm white) |
| Background (dark sections) | Near black | `#0A0A0A` |
| Primary text | Pure black | `#000000` |
| Inverse text (on dark bg) | Pure white | `#FFFFFF` |
| Muted / secondary text | Medium gray | `#999999` |
| Nav bar (scrolled) | White with transparency | `rgba(255,255,255,0.95)` |
| Footer bar | Deep black | `#0A0A0A` |
| CTA button background | Black | `#000000` |
| CTA button text | White | `#FFFFFF` |
| Borders / dividers | Very light gray | `#E0E0E0` |

> **Key principle:** Near zero use of accent colors. The palette is entirely monochromatic — black, white, and warm off-white — with full-bleed photography providing all the visual color.

---

## 3. Typography

### Font Family
- **Primary / Body:** `Europa-Grotesk` — a clean, geometric grotesque sans-serif  
  - Fallback: `sans-serif`  
  - Load via custom font embed or replicate with **`Inter`**, **`DM Sans`**, or **`Space Grotesk`** (all available on Google Fonts)

### Type Scale

| Element | Font Size (approx rem) | Font Weight | Line Height | Notes |
|---------|----------------------|-------------|-------------|-------|
| Hero tagline (H1) | 1.25rem (20px) | 400 | 1.3 | Appears bottom-right, in white over image |
| Section display heading (H2) | ~4.5rem–5.5rem | 400 (regular) | 1.0 | Massive, full-width editorial style |
| Project title (large) | ~5rem | 400 | 1.0 | Centered, bracketed `[ Project Name ]` pattern |
| Sub-heading / label (H3) | 1rem | 400 | 1.1 | Used for body text sections |
| Body / paragraph | 1rem | 400 | 1.1 | Small, tight line height |
| Nav links | 0.85rem | 400 | 1.0 | Comma-separated, not spaced |
| Footer labels (uppercase small) | 0.75rem | 400 | 1.0 | Section labels like "SELECTED WORKS", "VISION" |
| Mega footer wordmark | ~10–12vw | 700–900 | 1.0 | Full-width giant brand name at bottom |

### Typography Principles
- **No italic, no bold** in body copy — weight hierarchy is achieved through size alone
- All headings are `font-weight: 400` (regular) — the mass/scale IS the emphasis
- Letter spacing is `normal` throughout — no tracking tricks
- Text transforms are minimal — mostly default case, occasional small-caps for labels
- The "All Work(28)" style with superscript-like counter is a signature detail

---

## 4. Layout & Grid System

### CSS Grid Variables
```css
:root {
  --margin: 1.6rem;       /* Left/right page margin */
  --gutter: 1rem;          /* Column gutter */
  --header-height: 3.8rem; /* Fixed header height */
  --column: calc((100vw - var(--margin) * 2) / 6);  /* 6-column grid */
  --vh: calc(var(--vh-initial, 1vh) * 100);  /* Dynamic viewport height */
}
```

### Grid Structure
- **6-column grid** with `1.6rem` page margins on each side
- Maximum content width: `~1300px` (approximately full-bleed up to wide screens)
- Sections use asymmetric placement — content is rarely centered, often offset left or right

### Spacing Scale
| Token | Value |
|-------|-------|
| xs | 0.5rem (8px) |
| sm | 1rem (16px) |
| md | 2rem (32px) |
| lg | 4rem (64px) |
| xl | 8rem (128px) |
| section gap | 12–20vh (viewport-proportional) |

---

## 5. Header / Navigation

### Structure
```
[LOGO - Left]        [Nav links - Center-Left]        [Live Time  Location]   [Contact - Right]
TELHA CLARKE         Work, Process, Studio             03:34 AM  South Yarra   Contact
```

### Behavior
- Fixed position, transparent on page load, becomes white (with subtle bg) on scroll
- Logo: Uppercase condensed wordmark `TELHA CLARKE` — all caps, bold weight, custom lettering
- Nav links: Comma-separated inline list (no pipes, no dots) — `Work, Process, Studio`
- **Live local time** displayed center-right (real-time clock) — highly distinctive detail
- Location text: `South Yarra, AUS` — always visible alongside the time
- `Contact` link far right — no underline by default, underlines on hover

### CSS Approach
```css
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height); /* 3.8rem */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--margin);
  z-index: 100;
  mix-blend-mode: normal; /* switches to difference on dark sections */
}
```

---

## 6. Page Sections (Homepage Breakdown)

### Section 1 — Hero
- **Layout:** Single large photograph (portrait/square ratio), centered on white canvas
- **Background:** Warm off-white / cream `#FAF7F5`
- **Image position:** Centered, roughly 50% viewport width, vertically centered in viewport
- **Text:** Tagline "Driven by History, Centered on Context, Embracing Culture" — bottom-right, small, white or black depending on image
- **Scroll cue:** `[Scroll down]` text, bottom-left, muted gray, small — rotates or fades on scroll
- **Interaction:** Page border is a subtle salmon/blush pink `~#F5E8E0` — appears as a thin inset frame around the viewport

### Section 2 — About / Brand Statement
- **Layout:** Left: small architectural detail photo (portrait). Right: offset body text block
- **Heading:** Giant display text — `"Telha Clarke is a Melbourne based Architecture & Interior Design studio, designing various project typologies across Australia and Internationally."` — spans nearly full width, ~5rem
- **Below heading:** Two columns: label left (`Architecture & Interior Design`), description right
- **Background:** White `#FFFFFF`
- **Section label:** `SELECTED WORKS` (uppercase, small, gray) + counter `02` centered + year range `17 - 25` right

### Section 3 — Selected Works (Carousel / Scroll)
- **Pattern:** Project name in giant bracketed format: `[ Loller ]`, `[ Penthouse Vivace ]`, `[ Southbank Tower ]`
- **Between each:** Full-bleed or contained project image (portrait ratio, centered)
- **Project meta:** Category below image (e.g., "Multi Residential") + year (e.g., "2018")
- **CTA per project:** Black pill-button `[Studio Name]  [Discover +]` — appears at bottom center, inline
- **Navigation:** Left/right dash `—` arrows at viewport edges for carousel control
- **Alternating:** Project titles alternate alignment (left/right) or images shift between sections

### Section 4 — All Work (Masonry Gallery)
- **Label:** `All Work(28)` — large display heading, with count in smaller superscript style
- **Layout:** Scattered/masonry layout — images of varying sizes placed at different vertical offsets
- **Effect:** Images appear to float/scatter across the white canvas, intentionally non-grid
- **Image sizes:** Mix of small thumbnails and medium portraits — no uniform sizing
- **CTA:** Same pill button `[All Work]  [Discover +]`

### Section 5 — Vision (Full Bleed Dark)
- **Background:** Full-screen architectural photography (dark tones — tree, glass, metal)
- **Overlay layout:** White text over photo, positioned bottom-right quadrant
- **Section label:** `03` (top-left) and `VISION` (top-right) in white
- **Text:** Vision statement paragraphs, white, small, ~1rem
- **Height:** `100vh` — full viewport height, scrolljack or parallax

### Section 6 — Footer
- **Top CTA area:**
  - Large muted text: `"Talk to us about your project"` (light gray, ~2rem)
  - Below: Bold underlined link `Contact us` (~2rem, underlined)
- **Footer columns:**
  - Col 1: CTA (left)
  - Col 2: Site map links (Home, Work, Studio, Process, Contact)
  - Col 3: Address + Phone + Email with labeled prefixes (L / P / C)
- **Bottom bar:**
  - Newsletter subscription: `Subscribe to our newsletter` + email input + `→` arrow
  - Center: `Back to top` link
  - Right: `Instagram, Linkedin` (comma-separated, no icons)
- **Mega footer:** Full-width giant brand name `TELHA CLARKE` in light gray on black — ~10vw font
- **Bottom strip:** Copyright left, Privacy Policy center, Terms right, Credits far right

---

## 7. Components

### CTA / Pill Button
```html
<button class="pill-cta">
  <span class="label">Studio</span>
  <span class="action">Discover +</span>
</button>
```
```css
.pill-cta {
  background: #000;
  color: #fff;
  border-radius: 999px;
  padding: 0.5rem 1.2rem;
  font-size: 0.85rem;
  font-family: 'Europa-Grotesk', sans-serif;
  font-weight: 400;
  border: none;
  display: inline-flex;
  gap: 0.75rem;
  align-items: center;
  cursor: pointer;
}
.pill-cta .label {
  color: rgba(255,255,255,0.6);  /* dimmed label */
}
.pill-cta .action {
  color: #fff;
}
```

### Project Title Block (Bracketed)
```html
<div class="project-title">
  <span class="bracket">[</span>
  <h2>Loller</h2>
  <span class="bracket">]</span>
</div>
```
```css
.project-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  font-size: clamp(3rem, 8vw, 8rem);
  font-weight: 400;
  font-family: 'Europa-Grotesk', sans-serif;
}
.bracket {
  opacity: 0.5;
}
```

### Live Clock (Nav)
```js
function updateClock() {
  const now = new Date().toLocaleTimeString('en-AU', {
    timeZone: 'Australia/Melbourne',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  document.querySelector('.nav-time').textContent = now;
}
setInterval(updateClock, 1000);
updateClock();
```

### Section Counter Labels
```html
<!-- Top-left: section number, top-right: section name -->
<div class="section-label">
  <span class="section-num">03</span>
  <span class="section-name">VISION</span>
</div>
```
```css
.section-label {
  position: absolute;
  top: 1.5rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 var(--margin);
  font-size: 0.75rem;
  color: rgba(255,255,255,0.7);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
```

### Footer Email Input
```html
<form class="newsletter">
  <label>Subscribe to our newsletter</label>
  <div class="input-row">
    <input type="email" placeholder="Enter your email" />
    <button type="submit">→</button>
  </div>
</form>
```

---

## 8. Interactions & Animations

| Interaction | Description |
|-------------|-------------|
| Page load | White fade-in, hero image scales subtly from 0.98 → 1.0 |
| Nav on scroll | Becomes opaque white, logo and links remain visible |
| Hero image | Parallax — image moves at ~0.7x scroll speed |
| Project titles | Animate in on scroll — slide up + fade, staggered with image |
| "All Work" gallery | Images appear scattered — animate in from various offsets |
| Vision section | Full-bleed image section, sticky scroll or slow parallax |
| CTA pill button | Hover: slight background lighten, cursor: pointer |
| Nav links | Hover: underline appears with `text-decoration` |
| Contact us | Underline always visible (persistent underline CTA) |
| Scroll cue | `[Scroll down]` fades out after first scroll |
| Project images | On hover: subtle zoom (1.0 → 1.03) with `transition: transform 0.6s ease` |
| Page border | Thin salmon/blush `1px` or `4px` inset frame visible on home hero |

---

## 9. Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| `< 640px` (mobile) | Single column, nav collapses to hamburger, giant type scales down via `clamp()` |
| `768px` (tablet) | 2-col grid, images fill more width, nav visible |
| `1280px` (desktop) | Full 6-col grid, all sections render as designed |
| `1440px+` (wide) | Content max-width locks, side margins increase |

```css
/* Fluid type for display headings */
font-size: clamp(2.5rem, 7vw, 6rem);

/* Section margins scale with viewport */
padding: clamp(4rem, 10vw, 12rem) var(--margin);
```

---

## 10. Page Structure / IA

```
/ (Home)
├── Work             → Portfolio grid / all projects
├── Process          → How they work / methodology
├── Studio           → About the team
└── Contact          → Contact form + office info
```

---

## 11. SEO & Meta

```html
<title>Telha Clarke — Melbourne based Architecture & Interior Design studio</title>
<meta name="description" content="Melbourne based architecture and interior design studio working across diverse project types in Australia and internationally." />
<!-- Recommend adding: -->
<meta property="og:image" content="[hero-image-url]" />
<meta property="og:type" content="website" />
<link rel="canonical" href="https://yoursite.com/" />
```

---

## 12. Key Design Principles (Clone Guidelines)

1. **White space is the design** — massive padding, sparse content density, let images breathe
2. **Typography as architecture** — use font SIZE as the only hierarchy tool, all weights are regular
3. **Monochrome only** — resist adding any color beyond black/white/off-white
4. **Photography first** — every section decision should serve the images, not the other way around
5. **Bracket pattern `[ Name ]`** — use for project/section titles, the spacing inside brackets is intentional and wide
6. **Live dynamic elements** — real-time clock in nav is a signature; adds life to an otherwise static UI
7. **Section numbers** — label every major section with a two-digit counter (`01`, `02`, `03`)
8. **Comma-separated nav** — instead of `|` or spaced links, use `, ` separator for a typographic feel
9. **Pill CTAs** — never traditional buttons; always rounded pill with dimmed label + bright action text
10. **Full-bleed dark sections** — alternate between white canvas and full-viewport dark photography sections for rhythm
11. **Mega footer wordmark** — giant brand name at very bottom in light gray on black is the signature closing element
12. **Asymmetric image placement** — never center images on white sections; offset them left or right within the grid

---

## 13. Technology Stack (Observed)

| Layer | Notes |
|-------|-------|
| Framework | Likely custom JS or Webflow / Framer with custom code |
| Fonts | `Europa-Grotesk` (custom/licensed) — replace with `Inter`, `DM Sans`, or `Space Grotesk` for free alternative |
| Images | High-res architectural photography (WebP recommended) |
| Animations | GSAP likely (ScrollTrigger for parallax and reveal animations) |
| Time display | Vanilla JS `setInterval` with `Intl.DateTimeFormat` |
| Analytics | Standard GA or similar |

---

## 14. Suggested Free Font Replacements

| Original | Free Alternative | Google Fonts Link |
|----------|-----------------|-------------------|
| Europa-Grotesk | Inter | `fonts.google.com/specimen/Inter` |
| Europa-Grotesk | DM Sans | `fonts.google.com/specimen/DM+Sans` |
| Europa-Grotesk | Space Grotesk | `fonts.google.com/specimen/Space+Grotesk` |
| Europa-Grotesk | Outfit | `fonts.google.com/specimen/Outfit` |

> **Recommendation:** Use **Space Grotesk** for the closest match to Europa-Grotesk's geometric, slightly quirky character. Pair with **`font-weight: 400`** exclusively.

---

*Last analyzed: April 2026. Design may have been updated since.*
