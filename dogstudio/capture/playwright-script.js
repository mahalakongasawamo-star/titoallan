/**
 * Dogstudio.co runtime capture.
 * Reuses Playwright 1.59.1 from ../Rwanda/node_modules via NODE_PATH.
 *
 * Outputs to ./capture/ and ./assets/.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const TARGET = 'https://dogstudio.co/';
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.resolve(__dirname);
const SHOTS_DIR = path.join(OUT_DIR, 'screenshots');
const ASSETS_DIR = path.join(ROOT, 'assets');

for (const d of [OUT_DIR, SHOTS_DIR, ASSETS_DIR]) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

const VIEWPORT = { width: 1440, height: 900 };

// Selectors we want to sample computed styles for at each scroll position
const KEY_SELECTORS = [
  '.site-header',
  '.site-header-logo svg',
  '.site-menu',
  '.site-loader',
  '.dog-scene canvas',
  '.home-background img',
  '.home-hero',
  '.home-hero-title',
  '.home-hero-title .fx-letter--1',
  '.home-hero-showreel',
  '.home-hero-content .lead',
  '.home-cases',
  '.home-cases-title',
  '.home-cases-list',
  '.home-cases-list li:nth-child(1) a',
  '.home-cases-scenes',
  '.home-cases-scene--tomorrowland',
  '.home-cases-scene--tomorrowland .home-cases-picture img',
  '.home-cases-scene--tomorrowland .home-cases-name',
  '.home-cases-scene--tomorrowland .home-cases-text',
  '.home-about',
  '.home-about-background img',
  '.home-about-title',
  '.home-about-headline',
  '.home-about-text p',
  '.home-about-link',
  '.site-volume',
  '.site-header-button',
  '.site-footer',
  '.site-footer-title',
  '.site-footer-contact',
  '.site-footer-contact a',
  '.site-footer-languages',
  '.site-cookie',
];

const STYLE_PROPS = [
  'transform', 'opacity', 'filter', 'background-color', 'background-image',
  'color', 'font-family', 'font-size', 'font-weight', 'line-height',
  'letter-spacing', 'text-transform', 'width', 'height', 'padding',
  'margin', 'border-radius', 'box-shadow', 'display', 'position',
  'top', 'left', 'right', 'bottom', 'z-index', 'mix-blend-mode',
  'transition-property', 'transition-duration', 'transition-timing-function',
  'animation-name', 'animation-duration', 'animation-timing-function',
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return download(new URL(res.headers.location, url).toString(), dest).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`${res.statusCode} for ${url}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve(dest)));
      file.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(new Error('timeout')); });
  });
}

async function main() {
  const runtime = {
    target: TARGET,
    timestamp: new Date().toISOString(),
    viewport: VIEWPORT,
    blocked: false,
    error: null,
    pageStatus: null,
    title: null,
    description: null,
    framework_hints: {},
    head_links: [],
    meta_tags: [],
    schema_jsonld: [],
    heading_tree: [],
    semantic_counts: {},
    computed_styles_by_scroll: {},
    dimensions_by_scroll: {},
    css_variables: {},
    fonts_used: [],
    responsive_media_queries: [],
    screenshots: [],
    network_assets: [],
    downloaded_assets: [],
    download_errors: [],
    robots: null,
    llms: null,
    ai: null,
  };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  // Track network assets (images, fonts, videos, CSS)
  page.on('response', (resp) => {
    try {
      const url = resp.url();
      const ct = (resp.headers()['content-type'] || '').toLowerCase();
      if (
        ct.startsWith('image/') ||
        ct.startsWith('video/') ||
        ct.startsWith('font/') ||
        ct.includes('woff') || ct.includes('ttf') || ct.includes('otf') ||
        ct.includes('css') ||
        /\.(png|jpg|jpeg|gif|webp|svg|woff2?|ttf|otf|eot|mp4|webm|mov|css)(\?|$)/i.test(url)
      ) {
        runtime.network_assets.push({
          url,
          type: ct || 'unknown',
          status: resp.status(),
        });
      }
    } catch (_) {}
  });

  let response;
  try {
    response = await page.goto(TARGET, { waitUntil: 'networkidle', timeout: 90000 });
  } catch (e) {
    runtime.error = 'navigation failed: ' + e.message;
    runtime.blocked = true;
  }

  if (!runtime.blocked) {
    runtime.pageStatus = response ? response.status() : null;

    const blockHtml = await page.content();
    // Only treat as blocked on explicit challenge markers, not mere mentions of cloudflare
    // (cloudflareinsights.com is a legitimate analytics beacon used by many sites).
    const looksBlocked =
      runtime.pageStatus === 403 ||
      runtime.pageStatus === 429 ||
      /<title>\s*(Just a moment|Attention Required|Access denied|Please Wait|Verify you are human)/i.test(blockHtml) ||
      /cf-browser-verification|challenge-platform|__cf_chl_/i.test(blockHtml);

    if (looksBlocked) {
      runtime.blocked = true;
      runtime.error = 'apparent bot protection / non-200 status = ' + runtime.pageStatus;
    }
  }

  if (runtime.blocked) {
    fs.writeFileSync(path.join(OUT_DIR, 'runtime-data.json'), JSON.stringify(runtime, null, 2));
    console.error('BLOCKED:', runtime.error);
    await browser.close();
    process.exit(1);
  }

  // Let custom WebGL / loader finish
  await page.waitForTimeout(5000);

  // Try to dismiss cookie banner so it doesn't cover footer
  try {
    const accept = await page.$('.js-cookie-accept');
    if (accept) await accept.click({ timeout: 2000 });
  } catch (_) {}
  await page.waitForTimeout(500);

  runtime.title = await page.title();

  // Extract metadata from DOM
  const meta = await page.evaluate(() => {
    const out = { meta_tags: [], head_links: [], schema_jsonld: [], description: null };
    document.querySelectorAll('meta').forEach((m) => {
      const entry = { name: m.getAttribute('name'), property: m.getAttribute('property'), content: m.getAttribute('content') };
      out.meta_tags.push(entry);
      if (m.getAttribute('name') === 'description') out.description = m.getAttribute('content');
    });
    document.querySelectorAll('link[rel]').forEach((l) => {
      out.head_links.push({ rel: l.getAttribute('rel'), href: l.getAttribute('href'), type: l.getAttribute('type'), media: l.getAttribute('media') });
    });
    document.querySelectorAll('script[type="application/ld+json"]').forEach((s) => {
      try { out.schema_jsonld.push(JSON.parse(s.textContent)); } catch (_) { out.schema_jsonld.push({ parseError: true, raw: s.textContent.slice(0, 500) }); }
    });
    return out;
  });
  runtime.description = meta.description;
  runtime.meta_tags = meta.meta_tags;
  runtime.head_links = meta.head_links;
  runtime.schema_jsonld = meta.schema_jsonld;

  // Framework / library detection
  runtime.framework_hints = await page.evaluate(() => {
    const w = window;
    return {
      gsap: typeof w.gsap !== 'undefined',
      ScrollTrigger: typeof w.ScrollTrigger !== 'undefined' || (typeof w.gsap !== 'undefined' && !!w.gsap.plugins && !!w.gsap.plugins.ScrollTrigger),
      Lenis: typeof w.Lenis !== 'undefined' || !!document.querySelector('[data-lenis-prevent], .lenis, html.lenis'),
      LocomotiveScroll: typeof w.LocomotiveScroll !== 'undefined' || !!document.querySelector('[data-scroll], [data-scroll-container]'),
      FramerMotion: !!document.querySelector('[data-framer-component-type], [data-framer-name]'),
      Webflow: !!document.querySelector('[data-wf-site], [data-wf-page]') || typeof w.Webflow !== 'undefined',
      Wix: !!document.querySelector('[data-wix-viewer], [id^="wix-"], [class*="wix-"]'),
      Squarespace: !!document.querySelector('[id^="sqs-"], [class*="sqs-"]') || !!document.querySelector('[data-controller^="Squarespace"]'),
      NextJS: !!document.getElementById('__next') || !!window.__NEXT_DATA__,
      AOS: typeof w.AOS !== 'undefined' || !!document.querySelector('[data-aos]'),
      Barba: typeof w.barba !== 'undefined',
      Highway: typeof w.Highway !== 'undefined',
      Plyr: typeof w.Plyr !== 'undefined' || !!document.querySelector('.plyr'),
      Vimeo: !!document.querySelector('iframe[src*="player.vimeo.com"]') || typeof w.Vimeo !== 'undefined',
      Draco: !!document.getElementById('decoder_script'),
      WebGLCanvas: !!document.querySelector('.dog-scene canvas'),
      Detectizr: typeof w.Detectizr !== 'undefined',
      Modernizr: typeof w.Modernizr !== 'undefined',
      jQuery: typeof w.jQuery !== 'undefined',
      Dogstudio_global: typeof w.Dogstudio !== 'undefined',
      disable_dog: w.disable_dog,
      disable_motion: w.disable_motion,
      dom_attrs_wf: !!document.querySelector('[data-wf-site]'),
      dom_attrs_framer: !!document.querySelector('[data-framer-name]'),
      html_class: document.documentElement.className,
      body_class: document.body.className,
      body_data_theme: document.body.getAttribute('data-theme'),
      body_data_page: document.body.getAttribute('data-page'),
      has_router_wrapper: !!document.querySelector('[data-router-wrapper]'),
      has_router_view: !!document.querySelector('[data-router-view]'),
    };
  });

  // If GSAP is present, introspect timelines
  if (runtime.framework_hints.gsap) {
    runtime.gsap_timelines = await page.evaluate(() => {
      try {
        const out = [];
        const children = window.gsap.globalTimeline.getChildren(true, true, true);
        children.forEach((tw) => {
          out.push({
            duration: tw.duration(),
            delay: tw.delay(),
            ease: tw.vars && tw.vars.ease ? String(tw.vars.ease) : null,
            vars: (() => { try { return JSON.parse(JSON.stringify(tw.vars)); } catch { return null; } })(),
            target: tw.targets ? tw.targets().map((t) => (t && t.tagName) ? (t.tagName + (t.id ? '#'+t.id : '') + (t.className ? '.'+String(t.className).split(' ').join('.') : '')) : String(t)) : null,
          });
        });
        return out;
      } catch (e) { return { error: e.message }; }
    });
  }

  if (runtime.framework_hints.ScrollTrigger) {
    runtime.scrolltriggers = await page.evaluate(() => {
      try {
        const st = window.ScrollTrigger || (window.gsap && window.gsap.plugins && window.gsap.plugins.ScrollTrigger);
        if (!st || !st.getAll) return null;
        return st.getAll().map((t) => ({
          trigger: t.vars && t.vars.trigger ? String(t.vars.trigger) : null,
          start: t.vars && t.vars.start,
          end: t.vars && t.vars.end,
          scrub: t.vars && t.vars.scrub,
          pin: t.vars && t.vars.pin,
          toggleActions: t.vars && t.vars.toggleActions,
        }));
      } catch (e) { return { error: e.message }; }
    });
  }

  // CSS variables & fonts used
  const inspect = await page.evaluate(() => {
    const out = { css_vars: {}, fonts: new Set(), media_queries: [], headings: [], semantic_counts: {} };
    const root = getComputedStyle(document.documentElement);
    for (let i = 0; i < root.length; i++) {
      const name = root[i];
      if (name.startsWith('--')) out.css_vars[name] = root.getPropertyValue(name).trim();
    }
    document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((h) => {
      out.headings.push({ tag: h.tagName.toLowerCase(), text: (h.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 200), hidden: h.classList.contains('u-visually-hidden') || h.offsetParent === null });
    });
    ['article', 'section', 'nav', 'header', 'footer', 'aside', 'main', 'figure'].forEach((t) => {
      out.semantic_counts[t] = document.querySelectorAll(t).length;
    });
    // Walk stylesheets for @media and font-family declarations; same-origin only.
    try {
      for (const sheet of document.styleSheets) {
        let rules;
        try { rules = sheet.cssRules; } catch { continue; }
        if (!rules) continue;
        for (const rule of rules) {
          if (rule.type === 4 /* CSSMediaRule */) {
            out.media_queries.push(rule.conditionText || rule.media.mediaText);
          }
          if (rule.type === 5 /* CSSFontFaceRule */) {
            out.fonts.add((rule.style.getPropertyValue('font-family') || '').trim() + ' | ' + (rule.style.getPropertyValue('src') || '').trim().slice(0, 120));
          }
        }
      }
    } catch (_) {}
    out.fonts = Array.from(out.fonts);
    out.media_queries = Array.from(new Set(out.media_queries));
    return out;
  });
  runtime.css_variables = inspect.css_vars;
  runtime.fonts_used = inspect.fonts;
  runtime.responsive_media_queries = inspect.media_queries;
  runtime.heading_tree = inspect.headings;
  runtime.semantic_counts = inspect.semantic_counts;

  // Scroll sampling
  const sheight = await page.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
  runtime.documentScrollHeight = sheight;

  const positions = [0, 25, 50, 75, 100];
  for (const pct of positions) {
    const y = Math.round((sheight - VIEWPORT.height) * (pct / 100));
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'auto' }), y);
    await page.waitForTimeout(1200);

    const shotPath = path.join(SHOTS_DIR, `scroll-${pct}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    runtime.screenshots.push({ scrollPct: pct, scrollY: y, path: path.relative(ROOT, shotPath).replace(/\\/g, '/') });

    const sample = await page.evaluate(({ selectors, props }) => {
      const out = {};
      selectors.forEach((sel) => {
        const el = document.querySelector(sel);
        if (!el) { out[sel] = null; return; }
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        const styles = {};
        props.forEach((p) => { styles[p] = cs.getPropertyValue(p); });
        out[sel] = {
          rect: { x: r.x, y: r.y, w: r.width, h: r.height },
          classes: el.className && el.className.toString ? el.className.toString() : '',
          styles,
        };
      });
      return out;
    }, { selectors: KEY_SELECTORS, props: STYLE_PROPS });

    runtime.computed_styles_by_scroll[pct] = sample;
  }

  // Collect full-page screenshot too
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  const fullShot = path.join(SHOTS_DIR, 'full-page.png');
  await page.screenshot({ path: fullShot, fullPage: true });
  runtime.screenshots.push({ scrollPct: 'full', path: path.relative(ROOT, fullShot).replace(/\\/g, '/') });

  // robots.txt / llms.txt / ai.txt
  for (const fname of ['robots.txt', 'llms.txt', 'ai.txt']) {
    try {
      const resp = await context.request.get(new URL('/' + fname, TARGET).toString(), { timeout: 15000 });
      runtime[fname.split('.')[0]] = { status: resp.status(), size: (await resp.body()).length };
      if (resp.status() === 200) {
        fs.writeFileSync(path.join(OUT_DIR, fname), await resp.text());
      }
    } catch (e) {
      runtime[fname.split('.')[0]] = { error: e.message };
    }
  }

  // Save main CSS so we can scan rules
  try {
    const cssUrl = 'https://dogstudio.co/app/themes/portfolio-2018/static/css/main.css?v=07022024';
    const resp = await context.request.get(cssUrl, { timeout: 30000 });
    if (resp.status() === 200) {
      fs.writeFileSync(path.join(OUT_DIR, 'main.css'), await resp.text());
      runtime.mainCss = { url: cssUrl, savedTo: 'capture/main.css' };
    }
  } catch (_) {}

  await browser.close();

  // De-duplicate network assets
  const seen = new Set();
  const uniqueAssets = runtime.network_assets.filter((a) => {
    if (seen.has(a.url)) return false;
    seen.add(a.url);
    return true;
  });
  runtime.network_assets = uniqueAssets;

  // Download assets (images, fonts, videos) — skip cross-origin trackers
  const toDownload = uniqueAssets.filter((a) => {
    if (a.status !== 200) return false;
    const u = a.url;
    if (!/dogstudio\.co|typekit\.net|fonts\.gstatic\.com|use\.typekit\.net|dogstudio-assets/i.test(u)) return false;
    if (/gtm\.js|gtag\/js|analytics\.js|cloudflareinsights|browser-update|googletagmanager|google-analytics/i.test(u)) return false;
    return /\.(png|jpe?g|gif|webp|svg|woff2?|ttf|otf|eot|mp4|webm|mov|css)(\?|$)/i.test(u);
  });

  let dlIdx = 0;
  for (const a of toDownload) {
    dlIdx++;
    try {
      const u = new URL(a.url);
      // Skip the big CSS we already saved as main.css
      if (a.url.includes('/static/css/main.css')) continue;

      // Derive safe filename
      let rel = u.pathname.replace(/^\/+/, '').replace(/[^a-zA-Z0-9._\-\/]/g, '_');
      let destRel = rel;
      // Collision-safe: if target exists with different url, prepend index.
      let abs = path.join(ASSETS_DIR, destRel);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      if (fs.existsSync(abs)) {
        destRel = dlIdx + '_' + path.basename(rel);
        abs = path.join(ASSETS_DIR, destRel);
      }
      await download(a.url, abs);
      const size = fs.statSync(abs).size;
      runtime.downloaded_assets.push({
        url: a.url,
        type: a.type,
        localPath: 'assets/' + destRel.replace(/\\/g, '/'),
        size,
      });
    } catch (e) {
      runtime.download_errors.push({ url: a.url, error: e.message });
    }
  }

  fs.writeFileSync(path.join(OUT_DIR, 'runtime-data.json'), JSON.stringify(runtime, null, 2));
  console.log('DONE. Assets downloaded:', runtime.downloaded_assets.length, 'Errors:', runtime.download_errors.length);
}

main().catch((e) => {
  console.error('FATAL', e);
  fs.writeFileSync(
    path.join(OUT_DIR, 'runtime-data.json'),
    JSON.stringify({ error: e.message, stack: e.stack }, null, 2)
  );
  process.exit(1);
});
