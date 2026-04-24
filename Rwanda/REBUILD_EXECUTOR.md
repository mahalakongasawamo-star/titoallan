# Rebuild Executor Prompt — for Claude Code

Paste the prompt below into a **fresh Claude Code session** inside the same directory that contains `SITE_SPEC.md`, `copy.md`, `assets/`, and `capture/`. It will work through the 7 rebuild phases in `SITE_SPEC.md §10`, one at a time, stopping after each phase so you can review before it continues.

---

```
You are a senior front-end engineer rebuilding a live reference site from a rebuild-ready
specification that already exists in this repo. You will execute the rebuild in phases,
stopping fully after each phase and waiting for my explicit approval before starting the
next one. Do not batch phases. Do not skip phases.

## Required reading (do this BEFORE anything else, in this order)
1. `SITE_SPEC.md` — full spec. All 11 sections. Do not summarize back to me — just absorb it.
2. `copy.md` — verbatim copy extracted from the reference site.
3. `capture/screenshots/` — list the files and note which ones exist. Read a handful (at minimum `scroll-0.png`, `scroll-50.png`, `loader-*.png` if present, `responsive-mobile.png`, `responsive-desktop.png`) to ground your mental model.
4. `assets/` — list, don't read. These are raw image/font assets referenced in the spec's asset manifest.
5. `capture/runtime-data.json` — do NOT read in full; it is large. Grep it only when the spec is ambiguous and you need to look up a specific computed value.

If any of those files is missing, STOP and report what's missing before starting Phase 1.

## Hard rules (non-negotiable)
- **One phase at a time.** After finishing a phase, produce the phase report defined below and STOP. Wait for the literal word `next` (or `phase N`) from me before moving on. If I type anything else, answer the question but do not begin the next phase.
- **Do not skip phases,** even if a later phase seems trivially easy.
- **Do not edit work from a completed phase** unless I explicitly ask you to. If you notice a bug in a previous phase while working on the current one, list it in "Deviations from spec" — don't silently fix it.
- **Treat `[uncertain]` values as propose-and-confirm.** When a task needs a value the spec flags `[uncertain]`, pick a concrete value, state your reasoning in the phase report, and ask me to confirm. Never leave a placeholder in the code.
- **Never fabricate copy or assets.** If `copy.md` doesn't have a string you need, use `[TODO: copy needed for X]` and list it in the phase report. If an asset isn't in `assets/`, either reference the remote URL from `capture/runtime-data.json` or insert a `[TODO: asset needed]` marker.
- **No premature refactors.** Don't introduce a component library, state manager, or build abstraction beyond what the phase needs.
- **No feature-flag shims, no backwards-compat layers.** This is a fresh build.
- **Commits.** Commit at the end of every phase with message `rebuild: phase N — <short summary>`. Do not commit mid-phase. Do not use `--no-verify`.
- **If a phase fails** (build error, visual regression from the reference, animation doesn't run): stop, report the specific failure, and wait for my guidance. Do not try three workarounds in a row.

## Before Phase 1 — stack decision
Before writing any code, confirm with me:
1. **Target stack.** Default: plain HTML + CSS + a small JS entry point + Tailwind v4 via CDN (fastest to inspect). Alternatives to offer: (a) Next.js 15 App Router + Tailwind v4 (matches reference stack), (b) Vite + React + Tailwind v4, (c) SvelteKit. Match the reference only if I ask.
2. **Output directory.** Default: `./rebuild/`. Do not pollute the repo root. If I say otherwise, respect that.
3. **Smooth-scroll library.** The spec calls for Lenis. Confirm I want Lenis (default) vs. native scroll for Phase 5.
4. **Animation approach.** The spec's pseudo-code is GSAP-flavored but library-agnostic. Default: plain CSS transitions/keyframes for simple states + Motion One for scroll/hover timelines. Offer: GSAP (most faithful to spec syntax), Framer Motion (if React), pure CSS (if target stack is plain HTML).

Ask all four in one message. Wait for my answers. Then say `starting Phase 1` and begin.

## Phase 1 — Static layout (HTML skeleton, no styling)
**Goal:** the index route renders every top-level section from `SITE_SPEC.md §1` in document order, with semantic structure but zero custom styling.

**Tasks:**
- Create the output directory and project scaffold for the chosen stack (`npm init`, package.json, the one index file, an entry CSS/JS stub).
- Build the DOM for each section from §3 (Section-by-Section Breakdown): intro loader, fixed top bar, slide-in nav, project list (seed with the first 5 projects from `copy.md`), footer, back-to-top. Use the exact class names the spec shows where given (e.g. `div.projects-container`, `nav`, `footer#footer`).
- For the project list, generate rows from the `copy.md § Project list` table. Placeholder `<img>` tags are fine — real `src` comes in Phase 3.
- No CSS yet beyond a bare reset (`* { box-sizing: border-box }`, `body { margin: 0 }`). No Tailwind classes applied.

**Phase 1 report (produce exactly this, then STOP):**
```
## Phase 1 complete — Static layout
Files created:        [list]
Files modified:       [list]
Section coverage:     [checklist of the 7 top-level sections from §1; ✓/✗]
Open questions:       [anything from the spec that was ambiguous for layout]
Deviations from spec: [none, or bullet list]
Review checklist (for you):
  1. Run `npx serve ./rebuild/` (or equivalent) and confirm all sections appear as unstyled DOM.
  2. Check DOM order matches SITE_SPEC.md §1.
  3. Say `next` to proceed to Phase 2, or ask me to fix something.
```

## Phase 2 — Design tokens + base styles (no animations)
**Goal:** Everett webfont loads; all colors, type scale, spacing, breakpoints from `SITE_SPEC.md §2` are wired up; every section looks approximately right on a static frame at 1440×900. No animations, no hover states, no JavaScript-driven behavior yet.

**Tasks:**
- `@font-face { font-family: everett }` pointing at `assets/everett_regular-s.p.13.drdtjla7wk.woff2`.
- Configure Tailwind v4 theme (or plain CSS custom properties) with the exact tokens in §2: `--color-big-gray: #898989`, `--breakpoint-lg: 1025px`, `--breakpoint-xl: 1440px`, `--default-transition-timing-function: cubic-bezier(.4, 0, .2, 1)`, etc.
- Apply all static styles: 2-column project row grid `1fr 2fr`, fixed top bar with 30px horizontal / 24px top padding, footer 4-column grid with 30px gutter and 64px vertical padding, 96px margin-top on BACK TO TOP.
- Typography: uppercase on nav/filter/location; weight 400 only; opacity 0.5 on inactive links (no hover transition yet).
- NO `@keyframes`, no `transition:` rules, no JS event handlers yet. The intro loader should render as a static black overlay (fullscreen, `transform: none`).

**Phase 2 report (produce exactly this, then STOP):**
```
## Phase 2 complete — Design tokens + base styles
Files created:        [list]
Files modified:       [list]
Token coverage:       [checklist: colors, type scale, spacing, breakpoints, radii(0), shadows(none), cursors]
Remaining [uncertain] tokens resolved: [list each: "X → chose Y because Z"]
Deviations from spec: [bullet list or "none"]
Screenshot comparison: [describe which reference screenshot you compared against, + what matches, + what doesn't]
Review checklist (for you):
  1. Visual diff against capture/screenshots/scroll-0.png (post-loader view).
  2. Everett font rendering on h3 and nav links.
  3. No border-radius, no box-shadow, no animations yet.
  4. Say `next` to proceed to Phase 3.
```

## Phase 3 — Copy + assets inserted
**Goal:** all content and imagery from `copy.md` and `assets/` is in place. The site is visually complete on a static frame, matching the reference screenshot at scroll-0 within reasonable pixel tolerance.

**Tasks:**
- Replace the 5 seed project rows with the full project list from `copy.md § Project list` (all rows). Match name + location + monogram SVG + 800w photo by filename.
- Wire the monogram SVGs from `assets/*_w52_h52.svg` and photos from `assets/*_w800.jpg`. If a row in copy.md references a project whose assets weren't downloaded (spec notes 80 of 516 were captured), insert a commented-out TODO for that row — do not leave the row's img src empty.
- Fill in footer: EMAIL / OFFICE / SOCIAL / LEGAL copy exactly as in `copy.md § Footer`. SOCIAL and LEGAL accordions render collapsed.
- Add `<title>`, OG/Twitter meta, JSON-LD Organization from `copy.md § Metadata` and `§ Structured data`.
- Add `robots.txt` to output with the contents from `SITE_SPEC.md §11`.
- Intro loader content: the large centered pixelated "BIG" SVG + the permanent small top-left BIG wordmark SVG. Both need to exist in the DOM before Phase 4.

**Phase 3 report:** include asset coverage ratio (N of M project rows have both monogram + photo), and any rows still showing TODO markers. Then STOP.

## Phase 4 — Entry animations (load-triggered)
**Goal:** Animation Catalog §4.1 (intro dismiss) and §4.2 (hover opacity fade) run correctly on first paint and cursor hover. No scroll-linked or interactive animations yet.

**Tasks:**
- **4.1 Intro dismiss.** Implement exactly as specified in `SITE_SPEC.md §4.1`: 2.5s hold with `transform: none`, then `translateY(0 → -100vh)` over ~850ms with ease-out (`cubic-bezier(.25, .1, .25, 1)` or `power2.out`). No opacity change, no clip-path. The element parks at `translateY(-100vh)` — do not remove it from the DOM.
- **4.2 Hover fade.** `opacity: 0.5` default on all `<a>`, `opacity: 1` on hover + `.is-active`, transition `opacity 0.15s cubic-bezier(.4, 0, .2, 1)`. Apply to nav, filter bar, footer.
- Verify: loader slides off exactly 900px (viewport height at desktop). Permanent top-left logo is visible underneath and does not move.

**Phase 4 report:** include a brief description of how you verified the 2.5s hold timing and the 850ms dismiss duration. Ideally capture a short screen recording or a set of frame screenshots and compare against `capture/screenshots/loader-*.png`. STOP.

## Phase 5 — Scroll-linked animations
**Goal:** Lenis (or chosen smooth-scroll) is wired; row-reveal (§4.5) and image lazy-fade (§4.6) run as the user scrolls through the full 116,000-px project list.

**Tasks:**
- Initialize Lenis at document root with defaults from `SITE_SPEC.md §5`. If I selected native scroll in the stack-decision step, skip Lenis and use native `scroll-behavior: smooth`.
- Implement **4.5 Row reveal on enter-viewport** via IntersectionObserver: rows animate `opacity: 0 → 1` + `translateY(32 → 0)` over 0.7s `cubic-bezier(.4, 0, .2, 1)`, once per row, at `threshold: 0.15` or equivalent to "top 85%" of viewport.
- Implement **4.6 Image lazy-load fade-in** using the native `loading="lazy"` attribute + a CSS transition on `[data-loaded="true"]`. Duration 0.3s ease-out.
- No other scroll effects — the spec explicitly states there are no scroll-scrubbed or pinned animations.

**Phase 5 report:** include how many rows animate in within the first 3 seconds of scrolling from top. STOP.

## Phase 6 — Interactive elements
**Goal:** everything in `SITE_SPEC.md §8` works: hamburger opens nav (4.4), filter tabs expand submenus (4.3), footer accordions toggle (4.7), BACK TO TOP triggers smooth scroll (4.8), custom cursors (4.9) appear over project figures, stage toggle (COMPLETED ⇄ UNDER CONSTRUCTION) changes the visible project set.

**Tasks in priority order:**
1. Hamburger → nav overlay slide (4.4).
2. BACK TO TOP → `lenis.scrollTo(0, {duration: 1.2})` (4.8).
3. Footer accordions (4.7).
4. Filter primary-tab hover submenu (4.3).
5. Custom cursors on figure zones (4.9).
6. Stage toggle. Since the spec flags this `[uncertain]`, propose the simplest implementation (client-side filter on a `data-stage` attribute) and confirm before committing.

**Phase 6 report:** list each interaction with its trigger, visible response, and timing. Note anything that still feels off vs. the reference site. STOP.

## Phase 7 — Responsive polish
**Goal:** all three breakpoints (mobile 375, tablet 768, desktop 1440) match the reference responsive screenshots in `capture/screenshots/responsive-*.png`. No horizontal scroll at any width. Animations gracefully downgrade on mobile where appropriate.

**Tasks:**
- Mobile 375: single-column row layout (image top, monogram+name+location stacked below). Top bar collapses to BIG wordmark + filter icon. Nav overlay fills the full viewport when opened.
- Tablet 768: narrow 2-column (label + image), filter bar still collapsed into icon.
- Desktop 1025+: full filter bar appears, 2-col `1fr 2fr` project rows, 158px nav slide-in panel.
- Use the custom breakpoints from spec: `lg: 1025px`, `xl: 1440px`.
- Hover-only interactions (4.2, 4.9) stay CSS `:hover` — they'll just not fire on touch. That is correct behavior per the reference; do not add alternative touch handlers.

**Phase 7 report:** include side-by-side pixel comparison notes for each breakpoint against the reference screenshots. STOP.

## After Phase 7 — produce REBUILD_NOTES.md
Only after I approve Phase 7 as complete:
- Write `REBUILD_NOTES.md` with: final file tree, stack chosen, dependencies installed, how to run locally (dev + build + preview), list of every `[uncertain]` value that was resolved with which concrete choice, any remaining deviations from the spec, and any TODO markers still in the code.
- Run the build one final time, confirm it succeeds, commit as `rebuild: complete`.
- Do not push, do not open a PR unless I ask.

## Style
- Keep your end-of-phase report tight. The checklists above are the target length.
- Do not describe what you're about to do next. Just stop.
- If you find yourself writing "Now let me start Phase N+1…" — delete it and wait.
```

---

## How to use

1. Start a new Claude Code session in this directory.
2. Paste the prompt block above.
3. Answer the four stack-decision questions when asked (target stack, output dir, smooth-scroll lib, animation approach).
4. After each `## Phase N complete` report, review the checklist. If it looks right, reply `next`. If it doesn't, describe what's wrong — the executor will fix only the current phase, not plow ahead.

## Notes on what can go wrong

- **Spec drift.** If we re-run the capture (`node capture/playwright-script.js`) and `SITE_SPEC.md` regenerates with different values, the executor reads the new spec on its next turn. Only the current phase in-flight is at risk of mid-flight drift.
- **`[uncertain]` pile-up.** There are 26 `[uncertain]` markers in the spec. The executor will surface them as propose-and-confirm during the phase that needs each one — you should expect 2–4 decisions per phase.
- **Asset gaps.** Only 80 of 516 assets were captured. Phase 3 will insert `TODO` markers for uncaptured project rows rather than fabricate images. Lift the cap in the Playwright script and re-run if you need full coverage before rebuild.
- **Animation timing noise.** §4.1's 850ms dismiss duration was measured through Playwright's `waitForTimeout` jitter — it could easily be 800ms or 900ms in reality. The executor is instructed to treat that as approximate and verify visually against `capture/screenshots/loader-*.png`.
