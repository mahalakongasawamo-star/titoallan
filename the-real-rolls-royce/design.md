# Design Document — Rolls-Royce Motor Cars Website

**Reference:** [https://www.rolls-roycemotorcars.com/en_GB/home.html](https://www.rolls-roycemotorcars.com/en_GB/home.html)
**Last Analysed:** April 2026
**Document Purpose:** Full design specification for replicating or adapting the Rolls-Royce Motor Cars digital aesthetic in a custom build.

---

## 1. Design Philosophy

The Rolls-Royce Motor Cars website is a masterclass in **digital luxury**. Every design decision serves a single thesis: *restraint is power*. The site avoids the conversion-obsessed patterns of mainstream automotive marketing. Instead, it operates like a private gallery — letting imagery, negative space, and subtle motion communicate exclusivity.

**Core Principles:**

- **Cinematic Immersion** — Full-bleed hero imagery and autoplay video set the emotional tone before any copy is read. The product *is* the interface.
- **Whispered Typography** — Ultra-light font weights, generous letter-spacing, and restrained sizing let the vehicles command attention. Type exists to frame, not to shout.
- **Deliberate Emptiness** — Massive padding and margins create a sense of spaciousness. The site breathes like a penthouse, not a showroom floor.
- **Dark Palette Dominance** — Deep blacks and charcoal greys dominate, punctuated by warm metallics and the signature Rolls-Royce purple. Light exists only where it illuminates.
- **Frictionless Glide** — Navigation is minimal and disappears on scroll. Transitions are slow and eased. The experience feels like riding in the cabin, not driving through traffic.

---

## 2. Color Palette

The palette is intentionally narrow — almost monochromatic — with restrained accent usage.

```css
:root {
  /* === PRIMARY PALETTE === */
  --rr-black:           #0A0A0A;   /* True black — primary background */
  --rr-rich-black:      #1A1A1A;   /* Elevated surfaces, cards */
  --rr-charcoal:        #2C2C2C;   /* Secondary surfaces, dividers */
  --rr-graphite:        #3D3D3D;   /* Tertiary backgrounds, hover states */

  /* === TEXT === */
  --rr-white:           #FFFFFF;   /* Primary headings, hero text */
  --rr-ivory:           #F5F3EF;   /* Body text on dark backgrounds */
  --rr-silver:          #B0ACA4;   /* Secondary/muted text */
  --rr-pewter:          #7A7672;   /* Tertiary text, captions, metadata */

  /* === ACCENT === */
  --rr-purple:          #281432;   /* Rolls-Royce brand purple (deep) */
  --rr-purple-light:    #4A2660;   /* Hover state / gradient end */
  --rr-gold:            #C4A265;   /* Luxury accent — highlights, CTAs, lines */
  --rr-gold-light:      #D4B978;   /* Gold hover state */
  --rr-champagne:       #D9CDB8;   /* Warm neutral accent */

  /* === FUNCTIONAL === */
  --rr-overlay:         rgba(0, 0, 0, 0.65);   /* Image overlay / vignette */
  --rr-overlay-light:   rgba(0, 0, 0, 0.35);   /* Subtle overlay */
  --rr-border:          rgba(255, 255, 255, 0.08); /* Ultra-subtle dividers */
  --rr-border-hover:    rgba(255, 255, 255, 0.15);
  --rr-focus-ring:      rgba(196, 162, 101, 0.5);  /* Gold focus ring */
}
```

### Color Usage Rules

| Element                  | Token                | Notes                                              |
|--------------------------|----------------------|----------------------------------------------------|
| Page background          | `--rr-black`         | Never pure `#000` — use `#0A0A0A` for depth        |
| Card / section surfaces  | `--rr-rich-black`    | 1-2 shades lighter than page bg for layering        |
| Hero headline            | `--rr-white`         | Only for primary hero text; never overused          |
| Body copy                | `--rr-ivory`         | Warm white reduces eye strain on dark bg            |
| Navigation links         | `--rr-silver`        | Muted by default; `--rr-white` on hover            |
| CTA buttons              | `--rr-gold` on border/text | Ghost buttons preferred; filled sparingly    |
| Horizontal rules         | `--rr-border`        | Almost invisible — felt more than seen              |
| Accent lines / highlights| `--rr-gold`          | Thin 1px lines used as decorative separators        |

### Light-on-Light Alternate (Configurator / Interior Pages)

Certain interior pages (e.g., the Bespoke configurator) use a light palette:

```css
[data-theme="light"] {
  --rr-bg:       #F5F3EF;   /* Warm parchment */
  --rr-surface:  #FFFFFF;
  --rr-text:     #1A1A1A;
  --rr-muted:    #6B6560;
  --rr-border:   rgba(0, 0, 0, 0.08);
}
```

---

## 3. Typography

Rolls-Royce uses a proprietary serif-forward type system that evokes editorial luxury — think British Vogue, not Silicon Valley.

```css
:root {
  /* === FONT FAMILIES === */
  --font-display:  'Riviera Nights', 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
  --font-body:     'Riviera Nights', 'DM Sans', 'Gill Sans', 'Helvetica Neue', sans-serif;
  --font-mono:     'JetBrains Mono', 'Fira Code', monospace; /* For configurator specs */

  /* === TYPE SCALE (Fluid, desktop-first for luxury) === */
  --text-caption:  clamp(0.6875rem, 0.65rem + 0.2vw, 0.75rem);     /* 11-12px */
  --text-small:    clamp(0.75rem,   0.7rem + 0.25vw,  0.875rem);    /* 12-14px */
  --text-body:     clamp(0.875rem,  0.8rem + 0.375vw, 1rem);        /* 14-16px */
  --text-intro:    clamp(1rem,      0.9rem + 0.5vw,   1.25rem);     /* 16-20px */
  --text-h4:       clamp(1.125rem,  1rem + 0.625vw,   1.5rem);      /* 18-24px */
  --text-h3:       clamp(1.5rem,    1.2rem + 1.5vw,   2.25rem);     /* 24-36px */
  --text-h2:       clamp(2rem,      1.5rem + 2.5vw,   3.5rem);      /* 32-56px */
  --text-h1:       clamp(2.5rem,    1.8rem + 3.5vw,   5rem);        /* 40-80px */
  --text-hero:     clamp(3rem,      2rem + 5vw,        7rem);        /* 48-112px */

  /* === TRACKING (Letter-spacing) === */
  --tracking-tight:    -0.02em;   /* Large headings — pulled in for elegance */
  --tracking-normal:    0;
  --tracking-wide:      0.08em;   /* Navigation labels, eyebrows */
  --tracking-ultra:     0.15em;   /* Caps lock labels, model names */
  --tracking-spread:    0.25em;   /* "ROLLS-ROYCE" wordmark treatment */

  /* === LINE HEIGHT === */
  --leading-tight:     1.05;     /* Hero display text */
  --leading-heading:   1.15;     /* Section headings */
  --leading-body:      1.65;     /* Body paragraphs */
  --leading-relaxed:   1.85;     /* Long-form reading */

  /* === FONT WEIGHTS === */
  --weight-thin:       100;
  --weight-extralight: 200;      /* ← Most used for display headings */
  --weight-light:      300;      /* ← Primary body weight */
  --weight-regular:    400;
  --weight-medium:     500;
}
```

### Typography Usage Rules

| Element                | Size Token      | Weight            | Tracking           | Transform       |
|------------------------|-----------------|-------------------|--------------------|-----------------|
| Hero headline          | `--text-hero`   | `extralight (200)`| `--tracking-tight` | None            |
| Section heading (H2)   | `--text-h2`     | `extralight (200)`| `--tracking-tight` | None            |
| Sub-heading (H3)       | `--text-h3`     | `light (300)`     | `--tracking-normal`| None            |
| Model name label       | `--text-small`  | `regular (400)`   | `--tracking-ultra` | `uppercase`     |
| Navigation links       | `--text-small`  | `light (300)`     | `--tracking-wide`  | `uppercase`     |
| Body paragraph         | `--text-body`   | `light (300)`     | `--tracking-normal`| None            |
| CTA button text        | `--text-small`  | `regular (400)`   | `--tracking-wide`  | `uppercase`     |
| Caption / metadata     | `--text-caption`| `regular (400)`   | `--tracking-wide`  | `uppercase`     |
| Eyebrow label          | `--text-caption`| `medium (500)`    | `--tracking-spread`| `uppercase`     |

### Closest Open-Source Substitutes

Since "Riviera Nights" is proprietary to Rolls-Royce, for a clone build use:

```css
/* Display / Headings */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;0,400;0,600;1,300&display=swap');

/* Body / UI */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
```

| Role              | Substitute                | Why                                                |
|-------------------|--------------------------|----------------------------------------------------|
| Display serif     | Cormorant Garamond 200   | Ultra-thin serifs, tall x-height, luxury editorial  |
| Body sans-serif   | DM Sans 300              | Geometric, clean, excellent thin weights            |
| Alternate display | Playfair Display 400     | More contrast, bolder feel if Cormorant too thin    |

---

## 4. Spacing & Layout System

### Grid System

```css
:root {
  /* === GRID === */
  --grid-max-width:     1440px;    /* Content max-width */
  --grid-wide:          1680px;    /* Extended sections */
  --grid-narrow:        960px;     /* Text-focused sections */
  --grid-gutter:        clamp(1rem, 2vw, 3rem);
  --grid-margin:        clamp(1.5rem, 5vw, 8rem);   /* Page edge margins */

  /* === SPACING SCALE (luxury = generous) === */
  --space-xs:    0.5rem;    /*   8px  */
  --space-sm:    1rem;      /*  16px  */
  --space-md:    2rem;      /*  32px  */
  --space-lg:    4rem;      /*  64px  */
  --space-xl:    6rem;      /*  96px  */
  --space-2xl:   8rem;      /* 128px  */
  --space-3xl:  12rem;      /* 192px  */
  --space-4xl:  16rem;      /* 256px  */

  /* === SECTION PADDING === */
  --section-pad-y:  clamp(4rem, 8vw, 12rem);   /* Vertical between sections */
  --section-pad-x:  var(--grid-margin);
}
```

### Layout Patterns

| Pattern                  | Description                                                         |
|--------------------------|---------------------------------------------------------------------|
| **Full-bleed hero**      | `width: 100vw; height: 100vh` or `100svh`. Image/video fills viewport entirely. Overlaid text centered or bottom-left aligned. |
| **Split 50/50**          | Two-column grid: image left, text right (or reversed). Used for model feature highlights. `grid-template-columns: 1fr 1fr`. |
| **Offset asymmetric**    | Image takes ~60% width, text floats in the remaining 40% with generous vertical offset. Creates editorial tension. |
| **Stacked editorial**    | Full-width image → centered text block → full-width image. Alternating rhythm. Max text width: `--grid-narrow`. |
| **Card carousel**        | Horizontal scroll of model cards. No visible scrollbar. Peek of next card visible as affordance. |
| **Sticky scroll reveal** | Text pinned on one side; images swap on the other side as user scrolls. Used for feature deep-dives. |

### Responsive Breakpoints

```css
/* Mobile-first is NOT the approach here — luxury sites are desktop-first */
@media (max-width: 1440px) { /* Large desktop → standard desktop */ }
@media (max-width: 1024px) { /* Desktop → tablet landscape */ }
@media (max-width: 768px)  { /* Tablet → mobile */ }
@media (max-width: 480px)  { /* Small mobile */ }
```

---

## 5. Component Specifications

### 5.1 Navigation

```
┌──────────────────────────────────────────────────────────────────────┐
│  [RR Logo]          MODELS   BESPOKE   INSPIRE   OWNERSHIP   [≡]   │
└──────────────────────────────────────────────────────────────────────┘
```

**Behaviour:**
- Fixed position on initial load; transitions to `position: sticky` after scrolling past hero
- Background: fully transparent on hero → `rgba(10, 10, 10, 0.92)` with `backdrop-filter: blur(20px)` after scroll
- Links: `--rr-silver` default → `--rr-white` on hover, with a 1px underline that animates from left-to-right (`scaleX(0) → scaleX(1)`)
- Hamburger menu on mobile: animated three-bar → X morph, `transition: 0.4s cubic-bezier(0.77, 0, 0.175, 1)`
- Logo: Rolls-Royce monogram, ~40px height, SVG format, color: `--rr-white`

```css
.rr-nav {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  padding: var(--space-sm) var(--grid-margin);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.6s ease, padding 0.4s ease;
}

.rr-nav.scrolled {
  background: rgba(10, 10, 10, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: var(--space-xs) var(--grid-margin);
}

.rr-nav-link {
  font-family: var(--font-body);
  font-size: var(--text-small);
  font-weight: var(--weight-light);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--rr-silver);
  text-decoration: none;
  position: relative;
  transition: color 0.3s ease;
}

.rr-nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--rr-gold);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.rr-nav-link:hover {
  color: var(--rr-white);
}
.rr-nav-link:hover::after {
  transform: scaleX(1);
}
```

### 5.2 Hero Section

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│              [Full-viewport cinematic video/image]                    │
│                                                                      │
│                                                                      │
│         ─── SPECTRE ───                                              │
│                                                                      │
│       The first fully electric                                       │
│         Rolls-Royce                                                  │
│                                                                      │
│          [ DISCOVER ]                                                │
│                                                                      │
│                                                     ▼ scroll         │
└──────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Full viewport (`100vh` / `100svh`) with `object-fit: cover` on video/image
- Dark gradient overlay from bottom: `linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 60%)`
- Text positioned bottom-left with large padding (`--space-3xl` from bottom, `--grid-margin` from left)
- Eyebrow label: small caps, `--tracking-spread`, with decorative thin lines on each side
- Headline: `--text-hero`, `--weight-extralight`, `--leading-tight`
- CTA button: ghost style with gold border (see Buttons below)
- Scroll indicator: thin animated chevron or line at bottom center, opacity-pulsing animation

```css
.rr-hero {
  position: relative;
  width: 100%;
  height: 100svh;
  min-height: 600px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}

.rr-hero__media {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.rr-hero__media video,
.rr-hero__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rr-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10, 10, 10, 0.85) 0%,
    rgba(10, 10, 10, 0.3) 40%,
    transparent 70%
  );
  z-index: 1;
}

.rr-hero__content {
  position: relative;
  z-index: 2;
  padding: var(--space-3xl) var(--grid-margin) var(--space-2xl);
  max-width: 800px;
}

.rr-hero__eyebrow {
  font-size: var(--text-caption);
  font-weight: var(--weight-medium);
  letter-spacing: var(--tracking-spread);
  text-transform: uppercase;
  color: var(--rr-gold);
  margin-bottom: var(--space-md);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.rr-hero__eyebrow::before,
.rr-hero__eyebrow::after {
  content: '';
  width: 32px;
  height: 1px;
  background: var(--rr-gold);
}

.rr-hero__heading {
  font-family: var(--font-display);
  font-size: var(--text-hero);
  font-weight: var(--weight-extralight);
  letter-spacing: var(--tracking-tight);
  line-height: var(--leading-tight);
  color: var(--rr-white);
  margin-bottom: var(--space-lg);
}
```

### 5.3 Buttons

Two primary button styles dominate:

**Ghost Button (Primary CTA):**
```css
.rr-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  font-family: var(--font-body);
  font-size: var(--text-small);
  font-weight: var(--weight-regular);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  text-decoration: none;
  border: 1px solid var(--rr-gold);
  color: var(--rr-gold);
  background: transparent;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  min-height: 48px;
  position: relative;
  overflow: hidden;
}

.rr-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--rr-gold);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: -1;
}

.rr-btn:hover {
  color: var(--rr-black);
}

.rr-btn:hover::before {
  transform: scaleX(1);
}

.rr-btn:focus-visible {
  outline: 2px solid var(--rr-focus-ring);
  outline-offset: 3px;
}

/* Arrow icon inside button */
.rr-btn__arrow {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}
.rr-btn:hover .rr-btn__arrow {
  transform: translateX(4px);
}
```

**Minimal Text Link (Secondary CTA):**
```css
.rr-link {
  font-size: var(--text-small);
  font-weight: var(--weight-regular);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--rr-silver);
  text-decoration: none;
  border-bottom: 1px solid var(--rr-border);
  padding-bottom: 2px;
  transition: color 0.3s ease, border-color 0.3s ease;
}

.rr-link:hover {
  color: var(--rr-white);
  border-color: var(--rr-white);
}
```

### 5.4 Model Cards

```
┌─────────────────────────────────┐
│                                 │
│     [Full-width car image]      │
│                                 │
├─────────────────────────────────┤
│                                 │
│   ─── PHANTOM ───               │
│                                 │
│   Starting from £363,600        │
│                                 │
│   [ EXPLORE ]    [ CONFIGURE ]  │
│                                 │
└─────────────────────────────────┘
```

```css
.rr-model-card {
  background: var(--rr-rich-black);
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.rr-model-card:hover {
  transform: scale(1.01);
}

.rr-model-card__image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.rr-model-card:hover .rr-model-card__image {
  transform: scale(1.05);
}

.rr-model-card__content {
  padding: var(--space-lg) var(--space-md);
  text-align: center;
}

.rr-model-card__name {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: var(--weight-extralight);
  letter-spacing: var(--tracking-wide);
  color: var(--rr-white);
  margin-bottom: var(--space-sm);
}

.rr-model-card__price {
  font-size: var(--text-body);
  font-weight: var(--weight-light);
  color: var(--rr-pewter);
  margin-bottom: var(--space-md);
}
```

### 5.5 Section Dividers

Rolls-Royce avoids heavy borders. Divisions between sections are achieved through:

```css
/* Approach 1: Massive vertical spacing (primary method) */
.rr-section {
  padding: var(--section-pad-y) var(--section-pad-x);
}

/* Approach 2: Ultra-subtle horizontal line */
.rr-divider {
  width: 60px;
  height: 1px;
  background: var(--rr-gold);
  margin: var(--space-xl) auto;
  opacity: 0.6;
}

/* Approach 3: Gradient fade between sections */
.rr-section + .rr-section {
  border-top: 1px solid var(--rr-border);
}
```

### 5.6 Footer

```css
.rr-footer {
  background: var(--rr-black);
  border-top: 1px solid var(--rr-border);
  padding: var(--space-2xl) var(--grid-margin) var(--space-lg);
}

.rr-footer__grid {
  display: grid;
  grid-template-columns: 2fr repeat(4, 1fr);
  gap: var(--space-lg);
  max-width: var(--grid-max-width);
  margin: 0 auto;
}

.rr-footer__heading {
  font-size: var(--text-caption);
  font-weight: var(--weight-medium);
  letter-spacing: var(--tracking-ultra);
  text-transform: uppercase;
  color: var(--rr-pewter);
  margin-bottom: var(--space-md);
}

.rr-footer__link {
  display: block;
  font-size: var(--text-small);
  font-weight: var(--weight-light);
  color: var(--rr-silver);
  text-decoration: none;
  padding: var(--space-xs) 0;
  transition: color 0.3s ease;
}

.rr-footer__link:hover {
  color: var(--rr-white);
}

.rr-footer__legal {
  margin-top: var(--space-2xl);
  padding-top: var(--space-md);
  border-top: 1px solid var(--rr-border);
  font-size: var(--text-caption);
  color: var(--rr-pewter);
  text-align: center;
}
```

---

## 6. Motion & Animation

All motion follows a single principle: **slow, deliberate, and eased** — mimicking the glide of the vehicle itself.

### Easing Curves

```css
:root {
  --ease-glide:     cubic-bezier(0.25, 0.46, 0.45, 0.94);  /* Primary — smooth entry & exit */
  --ease-reveal:    cubic-bezier(0.77, 0, 0.175, 1);        /* Dramatic entrance (menu open, hero reveal) */
  --ease-subtle:    cubic-bezier(0.4, 0, 0.2, 1);           /* Micro-interactions (hover, focus) */
}
```

### Scroll-Triggered Reveals

Elements fade in from below on scroll. Staggered by index for grouped elements.

```css
.rr-reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s var(--ease-glide), transform 0.8s var(--ease-glide);
}

.rr-reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger children */
.rr-reveal-group .rr-reveal:nth-child(1) { transition-delay: 0s; }
.rr-reveal-group .rr-reveal:nth-child(2) { transition-delay: 0.15s; }
.rr-reveal-group .rr-reveal:nth-child(3) { transition-delay: 0.3s; }
.rr-reveal-group .rr-reveal:nth-child(4) { transition-delay: 0.45s; }
```

```javascript
/* IntersectionObserver for scroll reveals */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll('.rr-reveal').forEach((el) => observer.observe(el));
```

### Hero Video Treatment

```css
.rr-hero__media video {
  animation: heroZoom 20s ease-in-out infinite alternate;
}

@keyframes heroZoom {
  0%   { transform: scale(1); }
  100% { transform: scale(1.05); }
}
```

### Parallax Scroll (Subtle)

```css
.rr-parallax {
  transform: translateZ(0);
  will-change: transform;
}
```

```javascript
/* Light parallax — images move at 70% scroll speed */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  document.querySelectorAll('.rr-parallax').forEach((el) => {
    const speed = parseFloat(el.dataset.speed) || 0.3;
    el.style.transform = `translateY(${scrollY * speed}px)`;
  });
}, { passive: true });
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .rr-reveal {
    opacity: 1;
    transform: none;
  }

  .rr-hero__media video {
    animation: none;
  }
}
```

---

## 7. Imagery & Media

### Photography Style

| Attribute           | Specification                                                       |
|---------------------|---------------------------------------------------------------------|
| **Lighting**        | Low-key, dramatic. Single directional light source creating deep shadows. Studio-lit product shots with inky black backgrounds. |
| **Color grading**   | Desaturated, cool shadows, warm highlights. Muted greens and blues in landscape shots. |
| **Composition**     | Wide aspect ratios (16:9, 21:9). Car placed off-center using rule-of-thirds. Generous negative space. |
| **Perspective**     | Low angle (3/4 front), overhead drone, and detail macro shots. Never eye-level straight-on. |
| **Backgrounds**     | Architectural (modern concrete, glass towers), natural (cliff roads, coastal), or pure black studio. |
| **People**          | Rarely shown. When present: silhouetted, shot from behind, or hands-only (on steering wheel, door handle). Never smiling at camera. |

### Image Technical Requirements

```css
/* All images */
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Hero / full-bleed images */
.rr-img-hero {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 40%;   /* Slight upward crop — shows car, not ground */
}

/* Model gallery images */
.rr-img-gallery {
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 0;              /* No rounded corners — luxury = sharp edges */
}
```

**Format & Performance:**
- Serve WebP with AVIF fallback using `<picture>` element
- Hero images: max 1920px wide, compressed to ~150-200KB
- Lazy-load all below-fold images with `loading="lazy"` and `decoding="async"`
- Use `srcset` with breakpoints at 640w, 1024w, 1440w, 1920w

---

## 8. Page Architecture & Information Architecture

### Sitemap (Top-Level)

```
Home
├── Models
│   ├── Phantom
│   ├── Spectre
│   ├── Ghost
│   ├── Cullinan
│   └── [Each with: Overview, Gallery, Specs, Configure]
├── Bespoke
│   ├── Commissioning
│   ├── Gallery
│   └── Materials & Craft
├── Inspiring Greatness
│   ├── Stories / Editorial
│   ├── Events
│   └── Heritage
├── Ownership
│   ├── Aftersales
│   ├── Financial Services
│   └── Whispers (Members)
├── Find a Dealer
└── Configure Your Rolls-Royce
```

### Page Scroll Structure (Homepage)

```
[Nav — transparent, fixed]
[Hero — fullscreen video, Spectre/Ghost]
[Model Showcase — horizontal card scroll]
[Bespoke Teaser — split image/text]
[Editorial Feature — full-bleed image + text overlay]
[Heritage/Craft Story — sticky scroll reveal]
[Ownership Teaser — minimal text + CTA]
[Newsletter/Contact — centred form on dark bg]
[Footer — multi-column]
```

---

## 9. Accessibility Notes

Despite the luxury aesthetic, accessibility must be maintained:

| Concern                  | Implementation                                                      |
|--------------------------|---------------------------------------------------------------------|
| **Contrast**             | `--rr-ivory` (#F5F3EF) on `--rr-black` (#0A0A0A) = **16.5:1** ✅   |
| **Light text on overlay**| Ensure gradient overlay pushes contrast to ≥ 4.5:1 on hero text    |
| **Focus indicators**     | Gold focus ring (`--rr-focus-ring`) at 2px width, 3px offset       |
| **Keyboard nav**         | All interactive elements reachable via Tab. Hamburger menu trappable. |
| **Reduced motion**       | All animations respect `prefers-reduced-motion: reduce`             |
| **Semantic HTML**        | `<nav>`, `<main>`, `<article>`, `<section>` with `aria-labelledby` |
| **Image alt text**       | Descriptive for product shots. Decorative images use `alt=""`       |
| **Video**                | Autoplay videos: `muted`, with pause control visible                |
| **Font sizing**          | All `clamp()` values. Minimum body size: 14px. Never below 11px.   |
| **Touch targets**        | Minimum 48×48px on mobile for all interactive elements              |

---

## 10. Performance Targets

| Metric                    | Target        |
|---------------------------|---------------|
| Largest Contentful Paint  | < 2.5s        |
| First Input Delay         | < 100ms       |
| Cumulative Layout Shift   | < 0.1         |
| Total page weight (hero)  | < 3MB         |
| Font files                | ≤ 4 weights   |
| JS bundle (above fold)    | < 100KB gzip  |

**Strategy:**
- Inline critical CSS for above-the-fold content
- Defer all JS with `defer` or dynamic `import()`
- Preload hero video/image with `<link rel="preload">`
- Use `font-display: swap` on all `@font-face` declarations
- Serve images from CDN with automatic format negotiation

---

## 11. Implementation Checklist

- [ ] Dark background with warm ivory text — never pure white on pure black
- [ ] Ultra-light font weights (200-300) dominate headings
- [ ] Wide letter-spacing on all uppercase labels
- [ ] Full-bleed hero with gradient overlay and bottom-aligned text
- [ ] Ghost buttons with gold borders and fill-on-hover animation
- [ ] Scroll-triggered fade-in reveals (staggered for groups)
- [ ] Slow easing curves (`0.6s–0.8s` duration minimum)
- [ ] Massive section padding (`8rem–12rem` vertical)
- [ ] No border-radius anywhere — sharp edges throughout
- [ ] Parallax and slow Ken Burns zoom on hero imagery
- [ ] Nav transitions from transparent → blurred dark on scroll
- [ ] `prefers-reduced-motion` respected globally
- [ ] WCAG AA contrast maintained on all text elements
- [ ] All images lazy-loaded, WebP/AVIF format, responsive `srcset`
