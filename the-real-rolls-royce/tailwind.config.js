/** @type {import('tailwindcss').Config} */

/*
 * ─── ROLLS-ROYCE TAILWIND CONFIGURATION ─────────────────────────────
 *
 * Standalone reference configuration for Tailwind CSS v3.
 * In the actual project (modern-ai-site), Tailwind v4 is used
 * and brand colors are registered via `@theme inline` in globals.css.
 *
 * This file serves as documentation of the design system tokens.
 */

module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* ── Brand Colors ──────────────────────────────────────── */
      colors: {
        "rr-blue": "#00498F",     // Special Blue — accent / links
        "rr-cobalt": "#00205B",   // Deep Cobalt — footer / overlays
        "rr-white": "#FFFFFF",    // Pure White — text on dark
        "rr-black": "#050505",    // Near Black — primary backgrounds
        "rr-gold": "#C4A44D",     // Gold accent — dividers / details
        "rr-silver": "#C0C0C0",   // Silver — subtle accents
      },

      /* ── Typography ────────────────────────────────────────── */
      fontFamily: {
        display: [
          "var(--font-montserrat)",
          "Montserrat",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
      },
      fontSize: {
        "hero": ["120px", { lineHeight: "0.9", letterSpacing: "-0.02em" }],
        "section": ["72px", { lineHeight: "0.95", letterSpacing: "-0.01em" }],
      },
      letterSpacing: {
        "rr-wide": "0.35em",
        "rr-condensed": "-0.02em",
      },

      /* ── Animations ────────────────────────────────────────── */
      transitionTimingFunction: {
        "rr-ease": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        "800": "800ms",
        "1200": "1200ms",
      },
      keyframes: {
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scale-in 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },

      /* ── Spacing & Layout ──────────────────────────────────── */
      spacing: {
        "section": "10rem",       // 160px — vertical section padding
        "section-sm": "6rem",     // 96px — mobile section padding
      },

      /* ── Backdrop Blur ─────────────────────────────────────── */
      backdropBlur: {
        "3xl": "64px",
      },
    },
  },
  plugins: [],
};
