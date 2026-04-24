/**
 * big.dk runtime capture.
 *
 * Standalone usage:
 *   npm i playwright && npx playwright install chromium
 *   node capture/playwright-script.js
 *
 * Outputs:
 *   capture/runtime-data.json
 *   capture/rendered-page.html
 *   capture/screenshots/scroll-{0,25,50,75,100}.png
 *   assets/<downloaded files>
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const TARGET_URL = process.env.TARGET_URL || 'https://big.dk/';
const ROOT = path.resolve(__dirname, '..');
const CAPTURE_DIR = path.join(ROOT, 'capture');
const SHOTS_DIR = path.join(CAPTURE_DIR, 'screenshots');
const ASSETS_DIR = path.join(ROOT, 'assets');

for (const d of [CAPTURE_DIR, SHOTS_DIR, ASSETS_DIR]) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

const VIEWPORT = { width: 1440, height: 900 };

// Selectors sampled at each scroll position. Resolved at runtime against the
// actual DOM; unknown selectors just yield null.
const KEY_SELECTORS = [
  'html', 'body', 'main', 'header', 'footer', 'nav',
  'h1', 'h2', 'h3',
  'a[href]',
  // BIG-specific guesses; the real ones are discovered below.
  '[class*="hero"]', '[class*="project"]', '[class*="tile"]',
  '[class*="grid"]', '[class*="card"]', '[class*="cta"]',
  '[class*="logo"]', '[class*="menu"]', '[class*="mask"]',
];

const COMPUTED_PROPS = [
  'display', 'position', 'width', 'height',
  'transform', 'opacity', 'filter', 'mix-blend-mode',
  'background-color', 'background-image', 'color',
  'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing',
  'padding', 'margin', 'gap', 'grid-template-columns',
  'border-radius', 'box-shadow',
  'transition', 'animation',
  'text-transform', 'text-align',
];

function nowIso() { return new Date().toISOString(); }

function downloadFile(url, dest) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const lib = u.protocol === 'http:' ? http : https;
      const req = lib.get(url, { timeout: 30000, headers: {
        'User-Agent': 'Mozilla/5.0 (BIG site-spec capture bot)',
        'Accept': '*/*',
      } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // follow one redirect
          const next = new URL(res.headers.location, url).toString();
          res.resume();
          downloadFile(next, dest).then(resolve);
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          return resolve({ ok: false, status: res.statusCode });
        }
        const out = fs.createWriteStream(dest);
        res.pipe(out);
        out.on('finish', () => out.close(() => resolve({ ok: true, bytes: out.bytesWritten })));
        out.on('error', (e) => resolve({ ok: false, error: String(e) }));
      });
      req.on('error', (e) => resolve({ ok: false, error: String(e) }));
      req.on('timeout', () => { req.destroy(); resolve({ ok: false, error: 'timeout' }); });
    } catch (e) {
      resolve({ ok: false, error: String(e) });
    }
  });
}

function sanitizeFilename(u) {
  try {
    const parsed = new URL(u);
    let name = path.basename(parsed.pathname) || 'asset';
    // Strip query but keep extension. If query contains width=, append.
    const w = parsed.searchParams.get('width');
    const h = parsed.searchParams.get('height');
    if (w || h) {
      const ext = path.extname(name);
      const base = path.basename(name, ext);
      name = `${base}${w ? `_w${w}` : ''}${h ? `_h${h}` : ''}${ext}`;
    }
    return name.replace(/[^\w.\-]/g, '_');
  } catch { return 'asset'; }
}

(async () => {
  console.log(`[${nowIso()}] launching chromium`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
    javaScriptEnabled: true,
  });
  const page = await context.newPage();

  const netEvents = [];
  page.on('response', (res) => {
    netEvents.push({
      url: res.url(),
      status: res.status(),
      type: res.request().resourceType(),
      contentType: res.headers()['content-type'] || '',
    });
  });
  page.on('requestfailed', (req) => {
    netEvents.push({ url: req.url(), status: 'failed', type: req.resourceType(), failure: req.failure()?.errorText });
  });

  console.log(`[${nowIso()}] navigating to ${TARGET_URL}`);
  let response;
  try {
    response = await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 });
  } catch (e) {
    // fall back to load; some sites never reach networkidle due to analytics
    console.log(`[${nowIso()}] networkidle timed out, falling back to load:`, e.message);
    response = await page.goto(TARGET_URL, { waitUntil: 'load', timeout: 60000 });
    // give it a bit more time to settle
    await page.waitForTimeout(4000);
  }

  const status = response?.status();
  console.log(`[${nowIso()}] got status ${status}`);
  if (status === 403 || status === 429) {
    console.error(`[${nowIso()}] BLOCKED: Playwright got ${status} from ${TARGET_URL}`);
    fs.writeFileSync(path.join(CAPTURE_DIR, 'runtime-data.json'),
      JSON.stringify({ blocked: true, status, url: TARGET_URL, timestamp: nowIso() }, null, 2));
    await browser.close();
    process.exit(1);
  }

  // Check for Cloudflare / bot-challenge markers in page content.
  const title = await page.title();
  const bodyText = await page.evaluate(() => document.body?.innerText?.slice(0, 500) || '');
  if (/Just a moment|Checking your browser|Cloudflare/i.test(title + ' ' + bodyText)) {
    console.error(`[${nowIso()}] BLOCKED: Cloudflare/bot challenge detected`);
    fs.writeFileSync(path.join(CAPTURE_DIR, 'runtime-data.json'),
      JSON.stringify({ blocked: true, reason: 'cloudflare-challenge', title, bodyText, timestamp: nowIso() }, null, 2));
    await browser.close();
    process.exit(1);
  }

  // Wait for the intro loader to dissolve. big.dk shows a black splash with a
  // pixelated BIG logo before revealing the project list. Wait until the
  // projects-container has visible children and the document becomes taller
  // than the viewport (indicates content rendered).
  console.log(`[${nowIso()}] waiting for intro loader to clear`);
  try {
    await page.waitForFunction(() => {
      const pc = document.querySelector('.projects-container, [class*="projects-container"]');
      const tall = document.documentElement.scrollHeight > window.innerHeight * 1.5;
      return (pc && pc.children.length > 0 && pc.getBoundingClientRect().height > 200) || tall;
    }, { timeout: 15000 });
    // Extra buffer for the fade/curtain to finish and images to settle in.
    await page.waitForTimeout(3500);
  } catch (e) {
    console.log(`[${nowIso()}] loader wait timed out, continuing anyway:`, e.message);
    await page.waitForTimeout(4000);
  }

  // Save rendered HTML (post-loader).
  const renderedHtml = await page.content();
  fs.writeFileSync(path.join(CAPTURE_DIR, 'rendered-page.html'), renderedHtml);
  console.log(`[${nowIso()}] saved rendered-page.html (${renderedHtml.length} bytes)`);

  // ----- Framework / library detection -----
  const frameworkInfo = await page.evaluate(() => {
    const markers = {
      nextJs: !!document.querySelector('[id="__next"], script[src*="/_next/"]') || !!window.__NEXT_DATA__,
      react: !!(window.React || document.querySelector('[data-reactroot]') || Array.from(document.querySelectorAll('*')).some(el => Object.keys(el).some(k => k.startsWith('__reactFiber') || k.startsWith('__reactProps')))),
      gsap: !!window.gsap || !!window.TweenMax || !!window.TweenLite,
      scrollTrigger: !!(window.gsap && window.gsap.plugins && window.gsap.plugins.ScrollTrigger) || !!window.ScrollTrigger,
      lenis: !!window.Lenis || !!window.lenis || document.documentElement.classList.contains('lenis'),
      framerMotion: !!document.querySelector('[data-framer-name], [data-framer-component-type]'),
      webflow: !!document.querySelector('[data-wf-page], [data-wf-site]'),
      wix: !!document.querySelector('[id^="wix-"], [data-wix]'),
      squarespace: !!document.querySelector('[data-sqs-type], [data-squarespace]'),
      aos: !!document.querySelector('[data-aos]'),
      locomotive: !!window.LocomotiveScroll || document.documentElement.classList.contains('has-scroll-smooth'),
      turbopack: Array.from(document.scripts).some(s => /turbopack/.test(s.src)),
      threeJs: !!window.THREE,
      p5: !!window.p5,
    };
    // Grab any global scroll/motion-related runtime configs.
    const globals = {};
    try { if (window.__NEXT_DATA__) globals.nextBuild = { buildId: window.__NEXT_DATA__.buildId, page: window.__NEXT_DATA__.page }; } catch {}
    try {
      if (window.lenis) {
        globals.lenisInstance = {
          duration: window.lenis.options?.duration,
          easing: String(window.lenis.options?.easing),
          smoothWheel: window.lenis.options?.smoothWheel,
          orientation: window.lenis.options?.orientation,
          gestureOrientation: window.lenis.options?.gestureOrientation,
        };
      }
    } catch (e) { globals.lenisError = String(e); }
    return { markers, globals };
  });

  // ----- GSAP / ScrollTrigger introspection -----
  const gsapDump = await page.evaluate(() => {
    if (!window.gsap) return null;
    const out = { detected: true, version: window.gsap.version, tweens: [], timelines: [], scrollTriggers: [] };
    try {
      const root = window.gsap.globalTimeline;
      const children = typeof root.getChildren === 'function' ? root.getChildren(true, true, true) : [];
      for (const tw of children.slice(0, 200)) {
        try {
          out.tweens.push({
            duration: tw.duration?.(),
            progress: tw.progress?.(),
            vars: tw.vars ? JSON.parse(JSON.stringify(tw.vars, (k, v) => typeof v === 'function' ? String(v) : v)) : null,
            targets: (tw.targets?.() || []).slice(0, 10).map(t => t?.tagName ? `${t.tagName.toLowerCase()}${t.id ? '#' + t.id : ''}${t.className ? '.' + String(t.className).split(' ').slice(0, 2).join('.') : ''}` : String(t)),
          });
        } catch {}
      }
    } catch (e) { out.tweenError = String(e); }
    try {
      const ST = window.ScrollTrigger || (window.gsap.plugins && window.gsap.plugins.ScrollTrigger);
      if (ST && typeof ST.getAll === 'function') {
        for (const st of ST.getAll()) {
          out.scrollTriggers.push({
            trigger: st.vars?.trigger ? (st.vars.trigger.tagName ? `${st.vars.trigger.tagName.toLowerCase()}${st.vars.trigger.className ? '.' + String(st.vars.trigger.className).split(' ').slice(0, 2).join('.') : ''}` : String(st.vars.trigger)) : null,
            start: st.start, end: st.end,
            scrub: st.vars?.scrub,
            pin: st.vars?.pin,
            toggleActions: st.vars?.toggleActions,
          });
        }
      }
    } catch (e) { out.stError = String(e); }
    return out;
  });

  // ----- Page outline: top-level sections -----
  const outline = await page.evaluate(() => {
    function simpleSelector(el) {
      if (!el) return '';
      if (el.id) return `#${el.id}`;
      const tag = el.tagName.toLowerCase();
      const cls = (el.className && typeof el.className === 'string') ? el.className.split(/\s+/).filter(Boolean).slice(0, 2).join('.') : '';
      return cls ? `${tag}.${cls}` : tag;
    }
    const root = document.body;
    const direct = Array.from(root.children);
    const sections = [];
    for (const c of direct) {
      // Walk one or two layers down looking for <main>/<section>/semantic wrappers.
      sections.push({
        tag: c.tagName.toLowerCase(),
        selector: simpleSelector(c),
        childCount: c.children.length,
        roleHints: c.getAttribute('role') || null,
      });
      if (c.tagName === 'MAIN' || c.children.length < 12) {
        const subs = Array.from(c.children).slice(0, 30);
        for (const s of subs) {
          sections.push({
            tag: s.tagName.toLowerCase(),
            selector: simpleSelector(s),
            depth: 2,
            childCount: s.children.length,
            headingPreview: s.querySelector('h1,h2,h3')?.innerText?.slice(0, 120) || null,
            textPreview: s.innerText?.slice(0, 200).replace(/\s+/g, ' ').trim() || null,
            rect: s.getBoundingClientRect().toJSON(),
          });
        }
      }
    }
    return sections;
  });

  // ----- Design tokens: dump computed styles on root + headings + links -----
  const tokens = await page.evaluate((COMPUTED_PROPS) => {
    function dump(el) {
      if (!el) return null;
      const cs = getComputedStyle(el);
      const out = {};
      for (const p of COMPUTED_PROPS) out[p] = cs.getPropertyValue(p).trim();
      return out;
    }
    function uniqueColors() {
      const colors = new Set();
      const nodes = document.querySelectorAll('*');
      for (let i = 0; i < nodes.length && i < 3000; i++) {
        const cs = getComputedStyle(nodes[i]);
        const c = cs.color; const bg = cs.backgroundColor; const br = cs.borderTopColor;
        [c, bg, br].forEach(v => { if (v && v !== 'rgba(0, 0, 0, 0)' && v !== 'transparent') colors.add(v); });
      }
      return Array.from(colors);
    }
    function uniqueFonts() {
      const fams = new Set();
      const nodes = document.querySelectorAll('body, body *');
      for (let i = 0; i < nodes.length && i < 3000; i++) fams.add(getComputedStyle(nodes[i]).fontFamily);
      return Array.from(fams);
    }
    function typeScale() {
      const sizes = new Set(); const lhs = new Set(); const weights = new Set(); const letters = new Set();
      const nodes = document.querySelectorAll('body *');
      for (let i = 0; i < nodes.length && i < 3000; i++) {
        const cs = getComputedStyle(nodes[i]);
        if (nodes[i].innerText?.trim()) {
          sizes.add(cs.fontSize); lhs.add(cs.lineHeight); weights.add(cs.fontWeight); letters.add(cs.letterSpacing);
        }
      }
      return { sizes: Array.from(sizes), lineHeights: Array.from(lhs), weights: Array.from(weights), letterSpacings: Array.from(letters) };
    }
    function shadows() {
      const set = new Set();
      const nodes = document.querySelectorAll('*');
      for (let i = 0; i < nodes.length && i < 2000; i++) {
        const v = getComputedStyle(nodes[i]).boxShadow;
        if (v && v !== 'none') set.add(v);
      }
      return Array.from(set);
    }
    function radii() {
      const set = new Set();
      const nodes = document.querySelectorAll('*');
      for (let i = 0; i < nodes.length && i < 2000; i++) {
        const v = getComputedStyle(nodes[i]).borderRadius;
        if (v && v !== '0px') set.add(v);
      }
      return Array.from(set);
    }
    function cssVars() {
      const cs = getComputedStyle(document.documentElement);
      const out = {};
      for (let i = 0; i < cs.length; i++) {
        const name = cs[i];
        if (name.startsWith('--')) out[name] = cs.getPropertyValue(name).trim();
      }
      return out;
    }
    return {
      root: dump(document.documentElement),
      body: dump(document.body),
      h1: dump(document.querySelector('h1')),
      h2: dump(document.querySelector('h2')),
      h3: dump(document.querySelector('h3')),
      a: dump(document.querySelector('a')),
      button: dump(document.querySelector('button, [role="button"]')),
      colors: uniqueColors(),
      fonts: uniqueFonts(),
      type: typeScale(),
      shadows: shadows(),
      radii: radii(),
      cssVars: cssVars(),
      viewport: { w: innerWidth, h: innerHeight },
      documentHeight: document.documentElement.scrollHeight,
    };
  }, COMPUTED_PROPS);

  // ----- Copy extraction: headings, buttons, links, paragraphs -----
  const copy = await page.evaluate(() => {
    function take(sel, max = 200) {
      return Array.from(document.querySelectorAll(sel)).slice(0, max).map(el => ({
        tag: el.tagName.toLowerCase(),
        text: (el.innerText || el.textContent || '').trim(),
        href: el.getAttribute('href') || null,
        aria: el.getAttribute('aria-label') || null,
      })).filter(x => x.text);
    }
    return {
      title: document.title,
      metaDescription: document.querySelector('meta[name="description"]')?.content || null,
      ogTitle: document.querySelector('meta[property="og:title"]')?.content || null,
      ogDescription: document.querySelector('meta[property="og:description"]')?.content || null,
      canonical: document.querySelector('link[rel="canonical"]')?.href || null,
      h1: take('h1'), h2: take('h2'), h3: take('h3'), h4: take('h4'),
      p: take('p', 500),
      buttons: take('button, [role="button"]', 100),
      links: take('a[href]', 300),
      listItems: take('li', 200),
    };
  });

  // ----- Schema / AEO passive capture -----
  const aeo = await page.evaluate(() => {
    const jsonLd = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      .map(s => { try { return JSON.parse(s.textContent); } catch { return null; } }).filter(Boolean);
    const meta = {};
    for (const m of document.querySelectorAll('meta[name], meta[property]')) {
      const k = m.getAttribute('name') || m.getAttribute('property');
      meta[k] = m.getAttribute('content');
    }
    const headings = {
      h1: document.querySelectorAll('h1').length,
      h2: document.querySelectorAll('h2').length,
      h3: document.querySelectorAll('h3').length,
      h4: document.querySelectorAll('h4').length,
    };
    const semantic = {
      header: document.querySelectorAll('header').length,
      nav: document.querySelectorAll('nav').length,
      main: document.querySelectorAll('main').length,
      article: document.querySelectorAll('article').length,
      section: document.querySelectorAll('section').length,
      aside: document.querySelectorAll('aside').length,
      footer: document.querySelectorAll('footer').length,
    };
    const paragraphs = Array.from(document.querySelectorAll('p')).map(p => (p.innerText || '').length).filter(n => n > 0);
    const avgParagraph = paragraphs.length ? Math.round(paragraphs.reduce((a,b)=>a+b,0)/paragraphs.length) : 0;
    const lists = document.querySelectorAll('ul, ol').length;
    const faqRe = /FAQ|Frequently Asked Questions/i;
    const faq = Array.from(document.querySelectorAll('*')).filter(el => {
      const label = el.getAttribute('aria-label') || '';
      const text = (el.innerText || '').slice(0, 160);
      return faqRe.test(label) || faqRe.test(text);
    }).length;
    return { jsonLd, meta, headings, semantic, avgParagraph, lists, faqCandidates: faq, title: document.title, lang: document.documentElement.lang };
  });

  // ----- Asset URLs discovered in DOM -----
  const assetUrls = await page.evaluate(() => {
    const urls = new Set();
    const add = (u) => { if (u && /^https?:/.test(u)) urls.add(u); };
    for (const img of document.querySelectorAll('img')) {
      add(img.src);
      const srcset = img.srcset;
      if (srcset) for (const part of srcset.split(',')) add(part.trim().split(/\s+/)[0]);
    }
    for (const src of document.querySelectorAll('source')) {
      add(src.src || src.getAttribute('src'));
      const srcset = src.srcset;
      if (srcset) for (const part of srcset.split(',')) add(part.trim().split(/\s+/)[0]);
    }
    for (const v of document.querySelectorAll('video')) add(v.src);
    for (const link of document.querySelectorAll('link[rel="preload"][as="image"], link[rel="preload"][as="font"]')) add(link.href);
    // background-image on elements in viewport
    const els = document.querySelectorAll('*');
    for (let i = 0; i < els.length && i < 1500; i++) {
      const bg = getComputedStyle(els[i]).backgroundImage;
      if (bg && bg !== 'none') {
        const m = bg.match(/url\(["']?([^"')]+)["']?\)/);
        if (m) add(m[1]);
      }
    }
    return Array.from(urls);
  });

  // ----- Scroll sampling -----
  const scrollSamples = [];
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const viewportHeight = VIEWPORT.height;
  const maxScroll = Math.max(0, pageHeight - viewportHeight);

  for (const pct of [0, 25, 50, 75, 100]) {
    const y = Math.round((pct / 100) * maxScroll);
    await page.evaluate((y) => {
      // Lenis intercepts native scroll; use its scrollTo if available.
      if (window.lenis && typeof window.lenis.scrollTo === 'function') {
        window.lenis.scrollTo(y, { immediate: true, force: true });
      } else {
        window.scrollTo({ top: y, behavior: 'auto' });
      }
    }, y);
    await page.waitForTimeout(1500); // let any scroll-linked animations settle
    await page.screenshot({ path: path.join(SHOTS_DIR, `scroll-${pct}.png`), fullPage: false });
    console.log(`[${nowIso()}] screenshot at ${pct}% (y=${y})`);

    const sample = await page.evaluate(({ sels, props }) => {
      function dump(el) {
        if (!el) return null;
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        const out = { rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } };
        for (const p of props) out[p] = cs.getPropertyValue(p).trim();
        return out;
      }
      const out = {};
      for (const sel of sels) {
        try {
          const nodes = Array.from(document.querySelectorAll(sel)).slice(0, 3);
          out[sel] = nodes.map(n => dump(n));
        } catch (e) { out[sel] = { error: String(e) }; }
      }
      return out;
    }, { sels: KEY_SELECTORS, props: COMPUTED_PROPS });

    scrollSamples.push({ pct, y, pageYOffset: await page.evaluate(() => window.scrollY), sample });
  }

  // scroll back to top for consistent state
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  // ----- Interactive probes: nav hover / button hover -----
  const hoverSamples = [];
  try {
    const firstButton = await page.$('button, a[href]');
    if (firstButton) {
      const before = await firstButton.evaluate(el => {
        const cs = getComputedStyle(el);
        return { color: cs.color, background: cs.backgroundColor, transform: cs.transform, opacity: cs.opacity, transition: cs.transition };
      });
      await firstButton.hover();
      await page.waitForTimeout(600);
      const after = await firstButton.evaluate(el => {
        const cs = getComputedStyle(el);
        return { color: cs.color, background: cs.backgroundColor, transform: cs.transform, opacity: cs.opacity, transition: cs.transition };
      });
      hoverSamples.push({ selector: 'first interactive', before, after });
    }
  } catch (e) { hoverSamples.push({ error: String(e) }); }

  // ----- Responsive probe: shrink viewport and re-sample layout -----
  const responsive = {};
  for (const [name, w, h] of [['mobile', 375, 812], ['tablet', 768, 1024], ['desktop', 1440, 900]]) {
    await page.setViewportSize({ width: w, height: h });
    await page.waitForTimeout(400);
    const snap = await page.evaluate(() => {
      const nav = document.querySelector('nav, header');
      const main = document.querySelector('main');
      return {
        docWidth: document.documentElement.clientWidth,
        navDisplay: nav ? getComputedStyle(nav).display : null,
        navHeight: nav ? nav.getBoundingClientRect().height : null,
        mainCols: main ? getComputedStyle(main).gridTemplateColumns : null,
        bodyFontSize: getComputedStyle(document.body).fontSize,
        h1FontSize: document.querySelector('h1') ? getComputedStyle(document.querySelector('h1')).fontSize : null,
        hiddenElements: Array.from(document.querySelectorAll('*')).filter(el => getComputedStyle(el).display === 'none').length,
      };
    });
    await page.screenshot({ path: path.join(SHOTS_DIR, `responsive-${name}.png`), fullPage: false });
    responsive[name] = { width: w, height: h, ...snap };
  }
  await page.setViewportSize(VIEWPORT);

  // ----- robots.txt / llms.txt / ai.txt -----
  const domainRoot = new URL(TARGET_URL).origin;
  const aiVisibilityFiles = {};
  for (const fname of ['robots.txt', 'llms.txt', 'ai.txt']) {
    const r = await page.goto(`${domainRoot}/${fname}`, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(e => null);
    if (r) {
      aiVisibilityFiles[fname] = {
        status: r.status(),
        body: r.status() === 200 ? (await r.text()).slice(0, 4000) : null,
      };
    } else {
      aiVisibilityFiles[fname] = { status: 'unreachable' };
    }
  }
  // go back to main page
  await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});

  // ----- Download assets -----
  console.log(`[${nowIso()}] discovered ${assetUrls.length} asset URLs; downloading (cap 80)`);
  const assetManifest = [];
  const capped = assetUrls.slice(0, 80);
  for (const u of capped) {
    const name = sanitizeFilename(u);
    const dest = path.join(ASSETS_DIR, name);
    if (fs.existsSync(dest)) {
      assetManifest.push({ url: u, local: path.relative(ROOT, dest), skipped: 'exists' });
      continue;
    }
    const r = await downloadFile(u, dest);
    assetManifest.push({ url: u, local: path.relative(ROOT, dest), ...r });
  }

  // ----- Write everything to runtime-data.json -----
  const data = {
    meta: {
      target: TARGET_URL,
      capturedAt: nowIso(),
      viewport: VIEWPORT,
      status,
      finalUrl: page.url(),
      pageTitle: title,
      documentHeight: pageHeight,
    },
    frameworkInfo,
    gsap: gsapDump,
    outline,
    tokens,
    copy,
    aeo,
    aiVisibilityFiles,
    assetUrls,
    assetManifest,
    scrollSamples,
    hoverSamples,
    responsive,
    networkSummary: {
      total: netEvents.length,
      byType: netEvents.reduce((acc, e) => { acc[e.type] = (acc[e.type] || 0) + 1; return acc; }, {}),
      failed: netEvents.filter(e => e.status === 'failed' || (typeof e.status === 'number' && e.status >= 400)).slice(0, 40),
    },
  };
  fs.writeFileSync(path.join(CAPTURE_DIR, 'runtime-data.json'), JSON.stringify(data, null, 2));
  console.log(`[${nowIso()}] wrote runtime-data.json (${JSON.stringify(data).length} chars)`);

  await browser.close();
  console.log(`[${nowIso()}] done`);
})().catch(e => {
  console.error('capture error:', e);
  process.exit(1);
});
