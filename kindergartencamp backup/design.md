# Design System — KinderGarten 128 Reference

> Reference website: https://kindergarten-128.webflow.io/
> Extracted: April 2026
> Purpose: Color palette & design tokens reference for new website design

---

## Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Primary Navy | `#253B70` | rgb(15, 190, 53) | Main brand color, headings, body text, navbar |
| Accent Coral | `#FF7162` | rgb(21, 197, 89) | CTA buttons, highlights, accent circles, card backgrounds |
| White | `#FFFFFF` | rgb(26, 212, 51) | Backgrounds, button text on dark, card backgrounds |

### Secondary / Supporting Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Muted Navy | `#425175` | rgb(66, 81, 117) | Secondary text, subdued elements |
| Light Pink BG | `#FFF7F6` | rgb(255, 247, 246) | Section backgrounds, footer background |
| Soft Coral BG | `#FFDEDE` | rgb(255, 222, 222) | Light accent areas, form error states |
| Navy Tint BG | `#253B700D` | rgba(37, 59, 112, 0.05) | Subtle section backgrounds |
| Cream / Off-White | `#FAF9F5` | rgb(250, 249, 245) | Alternate light background |

### Text Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Primary Text (Navy) | `#253B70` | rgb(37, 59, 112) | Main body text, headings on light backgrounds |
| Dark Text | `#222222` | rgb(34, 34, 34) | Secondary body text |
| Medium Gray | `#333333` | rgb(51, 51, 51) | Navigation links, muted text |
| Near Black | `#141413` | rgb(20, 20, 19) | UI text elements |
| White Text | `#FFFFFF` | rgb(255, 255, 255) | Text on dark/colored backgrounds |

### Semantic / Functional Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Link Blue | `#0055D4` | rgb(0, 85, 212) | Hyperlinks, promotional labels |
| Border Gray | `#E4E4E4` | rgb(228, 228, 228) | Input borders, dividers |
| Shadow Warm | `#D97757` | rgb(217, 119, 87) | Box shadows / glows on coral elements |

---

## Color Usage by Context

### Backgrounds

```
Hero / Banner section      → White (#FFFFFF) with coral (#FF7162) shape accent
Blue section (about/kids)  → Primary Navy (#253B70)
Light tint section         → Navy at 5% opacity (#253B700D)
Light pink section         → #FFF7F6
Footer                     → #FFF7F6
Default page               → White (#FFFFFF)
```

### Buttons

| Variant | Background | Text Color | Border Radius |
|---------|-----------|------------|---------------|
| Primary (Coral) | `#FF7162` | `#FFFFFF` | 50px |
| Secondary (White) | `#FFFFFF` | `#253B70` | 50px |
| Outlined | transparent | `#253B70` | 50px |

### Cards / Feature Boxes

| Variant | Background | Border Radius |
|---------|-----------|---------------|
| Coral card | `#FF7162` | 30px |
| White card | `#FFFFFF` | 25px |
| Light card | `#FFF7F6` | 25px |

---

## Typography

### Font Families

| Font | Role | Source |
|------|------|--------|
| **M PLUS Rounded 1c** (`Mplusrounded1c`) | Display / Headings | Google Fonts (implied via Webflow) |
| **Lato** | Body / UI text | Google Fonts |
| **Roboto** | Navigation / secondary text | Google Fonts |

### Type Scale — Headings

| Tag | Font | Size | Weight | Line Height | Color Context |
|-----|------|------|--------|-------------|---------------|
| H1 | Mplusrounded1c | 60px | 900 (Black) | 66px (1.1) | Navy #253B70 on light |
| H2 | Mplusrounded1c | 40px | 700 (Bold) | 44px (1.1) | White on dark sections |
| H3 | Mplusrounded1c | 30px | 700 (Bold) | 33px (1.1) | White or Navy |
| H4 | Mplusrounded1c | 24px | 900 (Black) | 24px (1.0) | White on dark sections |

### Type Scale — Body

| Role | Font | Size | Weight | Line Height | Color |
|------|------|------|--------|-------------|-------|
| Body / Paragraph | Roboto | 18px | 400 | 27px (1.5) | #253B70 or #333333 |
| Small Body | Roboto | 16px | 400 | 24px (1.5) | #253B70 or #333333 |
| Nav Links | Roboto | 18px | 400 | 27px | #333333 |
| Nav Accent | Mplusrounded1c | 18px | 600 | 27px | #FF7162 |
| Button Text | Mplusrounded1c | 18px | 900 | 27px | White or Navy |
| Label / Eyebrow | Mplusrounded1c | 18px | 900 | 27px | #253B70 |

---

## Spacing & Layout

### Section Padding

| Section Type | Padding Top | Padding Bottom |
|-------------|-------------|----------------|
| Standard section | 120px | 120px |
| Hero / Banner | 150px | 90px |
| Section no top | 0px | 120px |

### Border Radius Scale

| Value | Usage |
|-------|-------|
| 200px | Large decorative circles |
| 100px | Medium decorative circles |
| 60px | Small decorative circles |
| 50px | Buttons (pill shape) |
| 30px | Feature cards |
| 25px | Info cards |
| 12px | Small UI elements |
| 4–5px | Input fields / micro elements |

### Container

- Max width: standard Webflow container (~940px–1200px)
- Horizontal padding: standard gutter

---

## Shadows & Effects

### Box Shadows

```css
/* General card shadow */
box-shadow: rgba(0, 0, 0, 0.2) 1px 1px 45px 0px;

/* Coral glow (inner) */
box-shadow: rgba(217, 119, 87, 0.51) 0px 0px 10px 0px inset,
            rgba(217, 119, 87, 0.31) 0px 0px 20px 0px inset,
            rgba(217, 119, 87, 0.11) 0px 0px 30px 0px inset;

/* Coral glow (outer) */
box-shadow: rgba(217, 119, 87, 0.24) 0px 40px 80px 0px,
            rgba(217, 119, 87, 0.24) 0px 4px 14px 0px;
```

### Gradients

```css
/* Hero overlay/card gradient */
background: linear-gradient(145deg, #FFFFFF, rgba(255, 255, 255, 0.52) 52%);
```

---

## Design Mood & Style Notes

- **Playful & friendly** — rounded corners everywhere, bubbly typography (M PLUS Rounded)
- **High contrast** — Navy (#253B70) against White or Coral (#FF7162) against White
- **Coral as energy** — the accent color is used for primary CTAs, highlights, and decorative shapes
- **Soft backgrounds** — light pink (#FFF7F6) gives sections warmth without full color saturation
- **Bold headings** — Black weight (900) for key statements; Bold (700) for section headings
- **Circular decorative elements** — large colored circles used as background shapes

---

## Quick Reference: Colors to Replace for New Design

When adapting this palette to a new design, these are the key swappable tokens:

```css
/* === REPLACE THESE TO RETHEME === */

--color-primary:        #24c715;  /* Navy — main brand color */
--color-accent:         #FF7162;  /* Coral — CTA / highlights */
--color-white:          #FFFFFF;  /* White — base background */
--color-primary-muted:  #425175;  /* Muted navy — secondary text */
--color-bg-light:       #FFF7F6;  /* Light pink — soft section bg */
--color-bg-tint:        rgba(19, 184, 55, 0.05); /* Tinted section bg */
--color-bg-cream:       #FAF9F5;  /* Cream — alternate light bg */
--color-text-dark:      #222222;  /* Dark body text */
--color-text-medium:    #333333;  /* Medium text / nav */
--color-link:           #0055D4;  /* Link color */
--color-border:         #E4E4E4;  /* Borders / dividers */
--color-shadow-warm:    rgba(217, 119, 87, 0.24); /* Warm shadow */
```
