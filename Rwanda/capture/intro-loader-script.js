/**
 * Intro loader frame-by-frame capture for big.dk.
 * Captures screenshots at fine intervals from first paint through loader
 * dissolve, and samples the loader element's computed styles at each frame
 * so we can infer the exact animation curve/duration.
 *
 *   node capture/intro-loader-script.js
 *
 * Outputs:
 *   capture/screenshots/loader-<ms>.png           (viewport screenshots)
 *   capture/loader-samples.json                   (computed-style samples)
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const TARGET_URL = 'https://big.dk/';
const ROOT = path.resolve(__dirname, '..');
const SHOTS_DIR = path.join(ROOT, 'capture/screenshots');
if (!fs.existsSync(SHOTS_DIR)) fs.mkdirSync(SHOTS_DIR, { recursive: true });

// Sample at these ms offsets from `goto` resolving.
const FRAMES_MS = [0, 300, 800, 1500, 2500, 2700, 2900, 3000, 3050, 3100, 3150, 3200, 3300, 3400, 3500, 3700, 4000, 4500];

const PROPS = [
  'opacity', 'transform', 'clip-path', 'visibility', 'display',
  'background-color', 'z-index',
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
  });
  const page = await ctx.newPage();

  // Use domcontentloaded rather than networkidle so we start sampling before
  // the loader has had a chance to dissolve.
  const t0 = Date.now();
  await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  console.log(`domcontentloaded at +${Date.now() - t0}ms`);

  const samples = [];

  for (const offset of FRAMES_MS) {
    const wait = offset - (Date.now() - t0);
    if (wait > 0) await page.waitForTimeout(wait);
    await page.screenshot({
      path: path.join(SHOTS_DIR, `loader-${String(offset).padStart(4, '0')}.png`),
      fullPage: false,
    });
    const snap = await page.evaluate((props) => {
      function pick(el) {
        if (!el) return null;
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        const out = {
          rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
          inViewport: r.width > 0 && r.height > 0 && r.top < window.innerHeight && r.bottom > 0,
        };
        for (const p of props) out[p] = cs.getPropertyValue(p).trim();
        return out;
      }
      // Hunt for the loader. Typical names / patterns on a black splash with white logo.
      function findLoader() {
        const candidates = document.querySelectorAll('[class*="loader" i], [class*="splash" i], [class*="intro" i], [id*="loader" i], [id*="splash" i], [id*="intro" i]');
        for (const c of candidates) {
          const cs = getComputedStyle(c);
          if (cs.position === 'fixed' && parseFloat(cs.zIndex) > 10) return c;
        }
        // Heuristic: any fixed, full-viewport, dark-background element.
        const all = document.querySelectorAll('div, section');
        for (const el of all) {
          const cs = getComputedStyle(el);
          if (cs.position !== 'fixed') continue;
          const r = el.getBoundingClientRect();
          if (r.width >= window.innerWidth * 0.95 && r.height >= window.innerHeight * 0.95) {
            const bg = cs.backgroundColor;
            if (/rgb\(0,\s*0,\s*0\)/.test(bg) || cs.opacity !== '1' || cs.transform !== 'none') return el;
          }
        }
        return null;
      }
      const loader = findLoader();
      // Also find the pixelated BIG logo (any SVG inside the loader, or any white SVG on screen)
      let innerLogo = null;
      if (loader) {
        innerLogo = loader.querySelector('svg, img, [class*="logo" i]');
      }
      if (!innerLogo) innerLogo = document.querySelector('svg[class*="logo" i], [class*="logo" i] svg');
      return {
        url: location.href,
        loader: pick(loader),
        loaderSelector: loader ? (loader.tagName.toLowerCase() + (loader.id ? '#' + loader.id : '') + (loader.className && typeof loader.className === 'string' ? '.' + loader.className.split(/\s+/).filter(Boolean).slice(0, 3).join('.') : '')) : null,
        innerLogo: pick(innerLogo),
        innerLogoSelector: innerLogo ? (innerLogo.tagName.toLowerCase() + (innerLogo.className && typeof innerLogo.className === 'string' ? '.' + String(innerLogo.className).split(/\s+/).filter(Boolean).slice(0, 2).join('.') : '')) : null,
        scrollY: window.scrollY,
        docHeight: document.documentElement.scrollHeight,
        bodyBg: getComputedStyle(document.body).backgroundColor,
      };
    }, PROPS);
    samples.push({ t: offset, ...snap });
    console.log(`+${String(offset).padStart(4, ' ')}ms  scrollY=${snap.scrollY}  loaderT=${snap.loader?.transform || '—'}  inner=${snap.innerLogoSelector||'—'}  innerRect=${snap.innerLogo?JSON.stringify(snap.innerLogo.rect):'—'}  innerT=${snap.innerLogo?.transform||'—'}`);
  }

  fs.writeFileSync(path.join(ROOT, 'capture/loader-samples.json'), JSON.stringify(samples, null, 2));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
