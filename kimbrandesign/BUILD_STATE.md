# Rebuild build state

Last completed phase: 7
Last run at:         2026-04-23
Next phase:          DONE

## Phase 7 notes
- `rebuild/app/styles/base.css` — switched heading typography to `clamp()` per the executor's "prefer fluid units" guidance. `h1` = `clamp(36px, 4.2vw, 60px) / clamp(44px, 5vw, 72px)`; `h2` = `clamp(28px, 2.8vw, 40px) / 1.1`; `.service h3` = `clamp(72px, 20vw, 300px) / clamp(56px, 15vw, 180px)` — the sampled 300 px desktop display size survives on wide viewports and caps out at 72 px at 375 wide.
- `rebuild/app/styles/sections.css` — added one `@media (max-width: 768px)` block to collapse multi-column grids that would otherwise crush below 400 px: `.about` 2→1 col, `.work` 4→1 col (plus `.work img { grid-row: auto !important }` to defeat the Phase 5 `nth-of-type(n+5)` row-spread), `.testimony` 2→1 col, `.team__grid` 3→2 col, header + sticky nav set to wrap their 7 links at 12 px. Added a `@media (min-width: 1600px)` block that caps `.works__list`, `#testimonies`, `kim-faq`, and `#faqs`/`.about` content widths at 1400 px so 1920-wide viewports don't stretch uncomfortably.
- `rebuild/verify.js` — rewritten to sweep four viewports (`375×812`, `768×1024`, `1440×900`, `1920×1080`). Each viewport gets its own Chromium page, its own error buckets, a horizontal-overflow probe, a metrics snapshot (pageHeight, h1 font, service h3 font, resolved grid-template-columns per section), and a 5-step scroll sweep with per-viewport screenshots in `rebuild/screenshots/<label>-scroll-*.png`. Interaction probes (FAQ cycle × 10, mailto → snackbar, nav → lenis.scrollTo) remain desktop-only because they're DOM behaviors, not viewport-sensitive.
- Lenis touch config left at defaults. Lenis 1.1.20 ignores touch wheel events by default (good for mobile) while still accepting programmatic `scrollTo` — no extra code needed for `lenis.scrollTo` nav links to work on phones.

## Phase 7 verification
- `node rebuild/verify.js` exits 0, FATAL COUNT 0.
- **mobile-375 (375×812)**: 0 horizontal overflow, pageHeight 38 231 (tall because work/testimony/team stack single-column), h1=36 px, `.service h3`=75 px, grids `.about=[335px]`, `.work=[335px]`, `.team=[157.5px 157.5px]`. All 31 ScrollTriggers still registered.
- **tablet-768 (768×1024)**: 0 horizontal overflow, h1=36 px, `.service h3`=153.6 px, grids single-column (the `max-width: 768px` rule is inclusive, so 768 gets the mobile layout — intentional).
- **desktop-1440 (1440×900)**: 0 horizontal overflow, h1=60 px (clamp ceiling), `.service h3`=288 px, grids back to `.about=[2×650px]`, `.work=[4×328px]`, `.team=[3×213px]`. FAQ / snackbar / nav probes all pass.
- **wide-1920 (1920×1080)**: 0 horizontal overflow, h1=60 px, `.service h3`=300 px (hit cap), content widths capped at 1400 px via the 1600+ query, grids `.about=[2×630px]`, `.work=[4×338px]`.
- Scroll visibility sweep at desktop/wide matches the reference order (0→hero, 25→services, 50→works, 75→testimonies, 100→faqs+contact). On mobile/tablet the middle pcts all sit inside `#works` because that section dominates page height once columns collapse — expected, not a regression.
- 0 console errors, 0 page errors at any viewport. Sole failed request (`mailto:…ERR_ABORTED`) still expected + excluded from fatal count.

## Rebuild summary — what exists
- `rebuild/index.html` — 13 body sections in spec order, header + hero branded "Aurum Spa & Aesthetics" per user override, otherwise kimbrandesign copy; 71 `<img>` load clean.
- `rebuild/app/styles/tokens.css` — 10 @font-face declarations (DM Sans ×8 weights × styles, Testimonia, Marcellus), :root tokens, `--background` variable, `--color-accent-yellow` = `#FFF14E` (sampled), `--color-club-dark` = `#0F0F0F` (sampled).
- `rebuild/app/styles/base.css` — typography + colors + `<kim-*> { display: block }` + `img { max-width: 100% }` + fluid heading clamps.
- `rebuild/app/styles/sections.css` — all 13 section layouts + Phase 7 media queries.
- `rebuild/app/scripts/scroll.js` — Lenis boot, GSAP ticker bridge, 31 ScrollTriggers covering entries 4.2 / 4.3 / 4.4 / 4.5 (×3) / 4.6 (×8) / 4.7 (×8) / 4.8 (×6) / 4.9 / 4.10 / 4.11. Entry 4.1 intentionally CSS-only (see uncertain-choices log).
- `rebuild/app/scripts/interactions.js` — FAQ animated height, mailto clipboard + snackbar, nav smooth-scroll via Lenis.
- `rebuild/verify.js` — multi-viewport harness that exercises structure, counts, lib globals, scroll sweep, interaction probes, and overflow checks.
- `rebuild/screenshots/*.png` — 25 per-viewport scroll screenshots (4 viewports × 5 pcts, plus the older desktop-only set from Phase 5/6 that is still on disk).

## What's still `[uncertain]` per SITE_SPEC.md § Gaps
1. **GSAP tween details** (§ Gaps 1) — exact durations, eases, stagger amounts. Current values are `power2.out` / `power2.inOut` / `'none'` defaults from pseudo-code, grouped at the top of `scroll.js` for easy tuning.
2. **Lenis config** (§ Gaps 2) — `duration: 1.2` + exp-ease are documented defaults, not recovered from bundle.
3. **Responsive behavior beyond eyeball tests** (§ Gaps 3) — no pin-behaviour sampling on actual mobile devices; verified only that `ScrollTrigger.getAll().length` stays at 31 and no console errors at each viewport. Real-device scroll feel not tested.
4. **Colors beyond sampled selectors** (§ Gaps 4) — `--color-accent-yellow` resolved via runtime-data.json; other on-brand shades still absent.
5. **Per-instance scroll sampling** (§ Gaps 5) — the capture only sampled the first H2 / H3 / etc., so reveal amplitudes for works/testimonies/team/club are inferred defaults.
6. **Team per-person bios + portraits** (§ Gaps 6) — not captured; rebuild shows name-only tiles.
7. **Book body copy** (§ Gaps 7) — only the image; no caption known.
8. **Contact layout beyond CTA** (§ Gaps 8) — centered CTA + legal + credit only; no form.
9. **Font hash → weight/style mapping** (§ Gaps 9) — resolved authoritatively from `css styles.txt` during Phase 2; no longer uncertain.
10. **Animation easing curves** (§ Gaps 10) — still inference-based; see item 1.

## Uncertain choices (cumulative)
- `<kim-*>` tag form → real autonomous custom elements. Phase 1.
- Team member count → 9 slots. Phase 1.
- Build root → `kimbrandesign/`. Phase 1.
- `verify.js` location → `rebuild/verify.js`. Phase 1.
- Default `h3` → 20 px DM Sans 400. Phase 2.
- `img { max-width: 100%; height: auto }` in base.css. Phase 2.
- Image paths use `../assets/…` relative. Phase 3.
- Services body lists rendered as single `<p>`. Phase 3.
- Works_Kim portrait placed in About. Phase 3.
- Team tagline placement. Phase 3.
- Hero H1 rendered with `<br>` per-word. Phase 3.
- Per-person team portraits omitted. Phase 3.
- "Med Spa"/"Day Spa" → `#services`, "Book a Visit" → `#contact`. Phase 3 re-run.
- Hero-section1.png referenced in-place. Phase 3 re-run.
- Header nav count 6→7 diverges from § 3.1 / § 3.4. Phase 3 re-run.
- 4.1 Header treated as non-pinned (CSS-only absolute top). Phase 5.
- `.pin-spacer { display: contents }`. Phase 5.
- CDN lib versions (Lenis 1.1.20, GSAP 3.12.5). Phase 5.
- Lenis duration 1.2 + exp-ease. Phase 5.
- Works deco parallax amplitudes. Phase 5.
- About H2 grid placement. Phase 5.
- Works tile image row-spread (4+3). Phase 5.
- Hero text-shadow. Phase 5.
- NEW: Mobile breakpoint 768 px (inclusive) — reason: executor recommended 768/1200 as pragmatic breakpoints; chose the lower one. Reversible: change `max-width: 768px` → `max-width: 767px` to spare tablets. Phase 7.
- NEW: Wide-viewport content cap at 1400 px via `@media (min-width: 1600px)` — reason: keeps Works / Testimonies / FAQs from sprawling at 1920. Phase 7.
- NEW: `.work img { grid-row: auto !important }` under mobile media query — reason: needed to override Phase 5's `nth-of-type(n+5) { grid-row: 3 }` since the mobile 1-col layout doesn't have rows 2 and 3 to fill. Phase 7.

## Known issues
- Page height 22 753 (desktop) vs reference 28 195 — due to denser Works grid + Aurum Spa brand override. Not a done-criterion failure.
- Hero-section1.png at 1.83:1 aspect crops ~10 % top/bottom at 1440×900 via `object-fit: cover`.
- Brand mismatch: about / services / works / testimonies / book / team / club / faqs still render kimbrandesign copy verbatim; only header + hero image are Aurum Spa. `<meta name="description">` and `og:description` likewise.
- Tablet breakpoint at 768 px (inclusive) may be aggressive — a future pass could raise to 767 or introduce a third breakpoint for 768–1199.

## Out-of-scope / deferred work after Phase 7
- Spa-brand replacement copy for everything below the hero — requires user-provided content.
- Real-device scroll / pin verification on actual touch hardware.
- Pixel-level parity with `capture/screenshots/*.png` — structural match achieved, not pixel-perfect (content differs between kimbrandesign and the Aurum Spa override).
- Optional: move Hero-section1.png into `rebuild/public/assets/` for deploy-friendly co-location; currently referenced in-place at `kimbrandesign/Hero-section1.png`.
