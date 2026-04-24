// capture/playwright-script.js
// Reproducible runtime capture for https://telhaclarke.com.au/
// Run: node capture/playwright-script.js

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const TARGET_URL = 'https://telhaclarke.com.au/';
const OUT_ROOT   = path.join(__dirname, '..');
const SHOT_DIR   = path.join(__dirname, 'screenshots');
const ASSET_DIR  = path.join(OUT_ROOT, 'assets');
const DATA_FILE  = path.join(__dirname, 'runtime-data.json');

// Selectors to sample at each scroll interval.
// Derived from static analysis of the local HTML dump.
const SAMPLE_SELECTORS = [
  'header.header',
  '.header-logo',
  '.header-link',
  '.header-contact',
  '.cover-home',
  '.cover-home-image-prlx',
  '.cover-home-title-light .line',
  '.cover-home-content',
  '.cover-home-scroll-text',
  '.about',
  '.about .offset-title',
  '.about .subtitle-text',
  '.works',
  '.works-item',
  '.works-item-title',
  '.works-item-image',
  '.works-grid-button',
  '.works-grid-item',
  '.works-grid-image',
  '.vision',
  '.vision-image',
  '.vision-image-parallax',
  '.vision-title',
  '.vision-content',
  '.vision-line',
  '.vision-number',
  '.process',
  '.process-item',
  '.process-image',
  '.widget',
  '.footer',
  '.footer-bottom',
  '.footer-bottom-inner',
  '.loader',
  '.loader-logo',
  '.loader-title .line',
  '.loader-counter',
];

const COMPUTED_PROPS = [
  'transform', 'opacity', 'filter', 'background-color', 'color',
  'font-family', 'font-size', 'font-weight', 'line-height',
  'letter-spacing', 'text-transform',
  'width', 'height',
  'position', 'top', 'left', 'bottom', 'right',
  'z-index', 'display', 'visibility',
  'clip-path', 'mix-blend-mode',
  'border-radius', 'box-shadow',
];

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }
ensureDir(SHOT_DIR);
ensureDir(ASSET_DIR);

function download(url, dest) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    client.get(url, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close(); fs.unlinkSync(dest);
        return download(new URL(res.headers.location, url).toString(), dest).then(resolve);
      }
      if (res.statusCode !== 200) {
        file.close(); fs.unlinkSync(dest);
        return resolve({ url, dest, ok: false, status: res.statusCode });
      }
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve({ url, dest, ok: true, size: fs.statSync(dest).size })));
    }).on('error', (err) => {
      file.close();
      try { fs.unlinkSync(dest); } catch (_) {}
      resolve({ url, dest, ok: false, error: err.message });
    });
  });
}

function safeName(url) {
  const u = new URL(url);
  let name = path.basename(u.pathname) || 'index';
  name = name.replace(/[^\w.\-]+/g, '_');
  if (!path.extname(name)) name += '.bin';
  return name;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
  });
  const page = await ctx.newPage();

  // === GSAP / ScrollTrigger / Lenis sniffer ===
  // GSAP writes a `_gsap` cache onto any element it animates. We hook the
  // Element.prototype setter so the moment the first cache lands, we walk up
  // to the globalTimeline, locate a ScrollTrigger via any timeline with a
  // `.scrollTrigger` property, and try several tricks for Lenis.
  await page.addInitScript(() => {
    // Strategy: a long-running RAF poll scans every element for an active
    // _gsap cache with a live tween. GSAP removes completed tweens from the
    // cache, so we have to catch them mid-animation.
    const tryCapture = () => {
      if (window.__gsap_globalTimeline) return true;
      const nodes = document.getElementsByTagName('*');
      for (let i = 0; i < nodes.length; i++) {
        const c = nodes[i]._gsap;
        if (!c) continue;
        const t = (c.tweens && c.tweens[0]) || c._pt;
        if (!t) continue;
        let n = t;
        let depth = 0;
        while (n && n.parent && depth++ < 200) n = n.parent;
        if (n) {
          window.__gsap_globalTimeline = n;
          if (t.constructor) window.__gsap_Tween = t.constructor;
          // Crawl current tree for a ScrollTrigger constructor
          (function crawl(m, d) {
            if (!m || d > 400 || window.__ScrollTrigger) return;
            if (m.scrollTrigger && m.scrollTrigger.constructor) { window.__ScrollTrigger = m.scrollTrigger.constructor; return; }
            let cur = m._first;
            while (cur) { crawl(cur, d + 1); if (window.__ScrollTrigger) return; cur = cur._next; }
          })(n, 0);
          return true;
        }
      }
      return false;
    };
    const rafLoop = () => {
      if (tryCapture()) return;
      requestAnimationFrame(rafLoop);
    };
    // Start loop after page starts rendering
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(rafLoop), { once: true });
    } else {
      requestAnimationFrame(rafLoop);
    }
    window.__gsap_tryCapture = tryCapture;

    // Lenis sniffs: the site's Lenis instance may or may not be exposed.
    // Try common property names, and install a wheel-listener count.
    window.__lenis_probe_events = 0;
    window.addEventListener('wheel', () => { window.__lenis_probe_events++; }, { passive: true, capture: true });

    // If the theme ever calls `new Lenis(...)`, patch the constructor's
    // prototype.raf method to expose the instance on first raf tick.
    const hookCtorByName = (name) => {
      Object.defineProperty(window, name, {
        configurable: true,
        set(v) {
          Object.defineProperty(window, name, { configurable: true, writable: true, value: v });
          if (typeof v === 'function' && v.prototype && typeof v.prototype.raf === 'function') {
            const origRaf = v.prototype.raf;
            v.prototype.raf = function patched(t) { if (!window.__lenis_instance) window.__lenis_instance = this; return origRaf.call(this, t); };
          }
        },
        get() { return undefined; }
      });
    };
    try { hookCtorByName('Lenis'); } catch (_) {}
  });

  // Collect every network response URL for asset mining
  const resourceUrls = new Set();
  page.on('response', (res) => {
    const req = res.request();
    const type = req.resourceType();
    if (['image', 'font', 'media', 'stylesheet'].includes(type)) {
      resourceUrls.add(JSON.stringify({ url: req.url(), type, status: res.status() }));
    }
  });

  console.log(`[capture] navigating to ${TARGET_URL}`);
  let response;
  try {
    response = await page.goto(TARGET_URL, { waitUntil: 'load', timeout: 90000 });
  } catch (err) {
    console.error('[capture] FAILED to load:', err.message);
    await browser.close();
    process.exit(1);
  }
  if (!response || response.status() >= 400) {
    console.error(`[capture] blocked/error response: ${response && response.status()}`);
    await browser.close();
    process.exit(1);
  }
  const title = await page.title();
  if (/just a moment|attention required|checking your browser/i.test(title)) {
    console.error(`[capture] Cloudflare-style challenge detected: "${title}"`);
    await browser.close();
    process.exit(1);
  }

  // Give the loader a generous window to complete after `load`.
  console.log('[capture] waiting for loader (up to 20s)...');
  try {
    await page.waitForFunction(() => {
      const app = document.getElementById('app');
      return app && !app.classList.contains('lenis-stopped');
    }, { timeout: 20000 });
    console.log('[capture] loader released naturally.');
  } catch (_) {
    console.warn('[capture] loader never released — prodding Lenis + unlocking.');
    // Prod Lenis by dispatching a wheel event — this often kicks the loader's
    // "first interaction" gate in these theme patterns.
    try {
      await page.mouse.move(720, 450);
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(600);
      await page.mouse.wheel(0, 300);
      await page.waitForTimeout(1200);
      await page.waitForFunction(() => {
        const app = document.getElementById('app');
        return app && !app.classList.contains('lenis-stopped');
      }, { timeout: 5000 });
      console.log('[capture] loader released after wheel prod.');
    } catch (_) {
      console.warn('[capture] still locked — proceeding with force-unlock.');
    }
  }
  // Always force-unlock so window.scroll drives ScrollTriggers uniformly.
  await page.evaluate(() => {
    for (const sel of ['html', 'body', '#app', '#wrapper']) {
      const el = document.querySelector(sel);
      if (el) {
        el.style.overflow = 'visible';
        el.style.height = 'auto';
        el.style.maxHeight = 'none';
      }
    }
    const app = document.getElementById('app');
    if (app) app.classList.remove('lenis-stopped');
    // Hide the loader so screenshots aren't blocked
    for (const sel of ['.loader', '.loader-panel', '.loader-overlay', '.fade', '.frame', '.page-overlay']) {
      for (const el of document.querySelectorAll(sel)) {
        el.style.opacity = '0';
        el.style.visibility = 'hidden';
        el.style.pointerEvents = 'none';
        el.style.display = 'none';
      }
    }
    // Clear the intro GSAP transform on #wrapper so content sits at 0,0
    const wrapper = document.getElementById('wrapper');
    if (wrapper) {
      wrapper.style.transform = 'none';
      wrapper.style.clipPath = 'none';
    }
    // Reveal elements that the intro had held at opacity:0
    for (const el of document.querySelectorAll('.cover-home-content, .loader, [style*="opacity: 0"], [style*="visibility: hidden"]')) {
      // only the top-level section containers, not individual GSAP-controlled spans
    }
  });
  await page.waitForTimeout(1500);

  // Force lazy images to load so asset manifest is complete.
  await page.evaluate(() => {
    for (const img of document.querySelectorAll('img[data-src]')) {
      const ds = img.getAttribute('data-src');
      const dss = img.getAttribute('data-srcset');
      if (ds) img.src = ds;
      if (dss) img.srcset = dss;
      img.classList.remove('lazy', 'opacity-0');
      img.classList.add('loaded');
      img.style.opacity = '1';
    }
  });

  // Slow scroll pass to fire every ScrollTrigger and IntersectionObserver,
  // then back to top.
  console.log('[capture] slow scroll pass to trigger animations + lazy loads...');
  const fullHeight = await page.evaluate(() => {
    return Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.getElementById('app') ? document.getElementById('app').scrollHeight : 0,
      document.getElementById('wrapper') ? document.getElementById('wrapper').scrollHeight : 0
    );
  });
  const vh = await page.evaluate(() => window.innerHeight);
  const steps = Math.max(25, Math.ceil(fullHeight / vh) * 4);
  for (let i = 0; i <= steps; i++) {
    const y = Math.round((fullHeight - vh) * (i / steps));
    await page.evaluate((y) => window.scrollTo({ top: y, left: 0, behavior: 'instant' }), y);
    await page.waitForTimeout(180);
  }
  // back to top
  await page.evaluate(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }));
  // wait for networkidle-ish
  try { await page.waitForLoadState('networkidle', { timeout: 15000 }); } catch (_) {}
  await page.waitForTimeout(1500);

  const pageHeight = await page.evaluate(() => Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.getElementById('app') ? document.getElementById('app').scrollHeight : 0,
    document.getElementById('wrapper') ? document.getElementById('wrapper').scrollHeight : 0
  ));
  const viewportH  = await page.evaluate(() => window.innerHeight);
  console.log(`[capture] page height=${pageHeight}, viewport=${viewportH}`);

  // --- Detect smooth-scroll / animation libs ---
  const libDetect = await page.evaluate(() => {
    const out = {
      gsap: !!window.gsap,
      gsapVersion: window.gsap && window.gsap.version,
      ScrollTrigger: !!(window.ScrollTrigger || (window.gsap && window.gsap.core && window.gsap.plugins && window.gsap.plugins.scrollTrigger)),
      Lenis: !!window.Lenis,
      locomotive: !!window.LocomotiveScroll,
      framerMotion: !!window.FramerMotion,
      webflow: !!window.Webflow || document.documentElement.hasAttribute('data-wf-page'),
      framer: !!document.querySelector('[data-framer-name]'),
      wix: /wix-/.test(document.documentElement.className),
      squarespace: !!document.querySelector('[data-sqs-type], [data-block-type]'),
      barba: !!window.Barba || !!window.barba,
      taxi: !!document.querySelector('[data-taxi]'),
      highway: !!window.Highway,
      customElements: Array.from(document.querySelectorAll('*'))
        .map(el => el.tagName.toLowerCase())
        .filter(t => t.includes('-'))
        .reduce((acc, t) => { acc[t] = (acc[t] || 0) + 1; return acc; }, {}),
    };
    return out;
  });

  // --- GSAP timeline introspection ---
  // Post-scroll fallback: dump cache structure + try harder paths to globalTimeline.
  await page.evaluate(() => {
    const nodes = document.querySelectorAll('*');
    const keyedEls = [];
    for (const el of nodes) if (el._gsap) keyedEls.push(el);
    window.__gsap_diag = {
      totalEls: nodes.length,
      keyedEls: keyedEls.length,
      withTweens: keyedEls.filter(e => e._gsap.tweens && e._gsap.tweens.length).length,
      cacheKeysSample: keyedEls.slice(0, 3).map(e => ({
        el: e.tagName + '.' + (typeof e.className === 'string' ? e.className.trim().split(/\s+/).slice(0,2).join('.') : ''),
        keys: Object.keys(e._gsap || {}),
        types: Object.keys(e._gsap || {}).reduce((a, k) => {
          const v = e._gsap[k];
          a[k] = v == null ? 'null' : Array.isArray(v) ? `array[${v.length}]` : typeof v;
          return a;
        }, {})
      })),
    };
    // Try every possible chain from every cache
    for (const el of keyedEls) {
      const c = el._gsap;
      // cache itself may have .parent / ._parent pointing to a timeline
      const candidates = [c, c.parent, c._parent, c.owner, c.harness && c.harness.parent];
      for (const cand of candidates) {
        if (cand && cand.parent) {
          let n = cand;
          let d = 0;
          while (n && n.parent && d++ < 500) n = n.parent;
          if (n) {
            window.__gsap_globalTimeline = n;
            if (cand.constructor && cand.constructor.name && /tween|timeline/i.test(cand.constructor.name)) {
              window.__gsap_Tween = cand.constructor;
            }
            return;
          }
        }
      }
    }
  });

  const gsapDump = await page.evaluate(() => {
    const gt = window.__gsap_globalTimeline;
    if (!gt) return { hooked: false, reason: window.__gsap_hook_err || 'no element received a _gsap cache', diag: window.__gsap_diag || null };
    // Walk linked-list of children: gt._first ... _next
    const out = [];
    let n = gt._first;
    let depth = 0;
    while (n && depth++ < 400) {
      try {
        const vars = n.vars || {};
        let targetSelectors = [];
        try {
          const targets = (typeof n.targets === 'function') ? n.targets() : (vars.targets || []);
          if (targets && targets.length) {
            targetSelectors = targets.slice(0, 4).map((el) => {
              if (!el || el.nodeType !== 1) return String(el);
              const cls = (el.className && typeof el.className === 'string')
                ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.')
                : '';
              return el.tagName.toLowerCase() + cls;
            });
          }
        } catch (_) {}
        const ease = vars.ease && (typeof vars.ease === 'function' ? (vars.ease.name || '[fn]') : String(vars.ease));
        // shallow-safe var clone
        const safeVars = {};
        for (const k of Object.keys(vars)) {
          const v = vars[k];
          if (v == null) safeVars[k] = v;
          else if (typeof v === 'function') safeVars[k] = `[fn:${v.name || 'anon'}]`;
          else if (typeof v === 'object') {
            if (k === 'scrollTrigger') {
              safeVars[k] = {
                trigger: v.trigger && (v.trigger.className || v.trigger.tagName || String(v.trigger)),
                start: v.start, end: v.end, scrub: v.scrub, pin: v.pin,
                toggleActions: v.toggleActions,
              };
            } else safeVars[k] = '[obj]';
          } else safeVars[k] = v;
        }
        out.push({
          kind: n._first ? 'timeline' : 'tween',
          duration: typeof n.duration === 'function' ? n.duration() : undefined,
          totalDuration: typeof n.totalDuration === 'function' ? n.totalDuration() : undefined,
          delay: typeof n.delay === 'function' ? n.delay() : undefined,
          repeat: typeof n.repeat === 'function' ? n.repeat() : undefined,
          yoyo: typeof n.yoyo === 'function' ? n.yoyo() : undefined,
          ease,
          targetSelectors,
          vars: safeVars,
          hasScrollTrigger: !!vars.scrollTrigger,
        });
      } catch (e) { /* ignore one bad child */ }
      n = n._next;
    }
    return { hooked: true, count: out.length, children: out };
  });

  // --- ScrollTrigger dump (via hooked constructor) ---
  const scrollTriggerDump = await page.evaluate(() => {
    const ST = window.__ScrollTrigger;
    if (!ST || typeof ST.getAll !== 'function') return { hooked: false, reason: 'ScrollTrigger constructor not recovered' };
    const all = ST.getAll();
    return {
      hooked: true,
      count: all.length,
      triggers: all.slice(0, 200).map((t) => {
        const tr = t.trigger;
        const trSel = tr ? (tr.id ? ('#' + tr.id) : (tr.className ? '.' + String(tr.className).trim().split(/\s+/)[0] : tr.tagName)) : null;
        return {
          trigger: trSel,
          start: t.start,
          end: t.end,
          scrub: t.scrub,
          pin: !!t.pin,
          pinSpacing: t.pinSpacing,
          toggleActions: t.vars && t.vars.toggleActions,
          markers: !!t.markers,
          hasAnimation: !!t.animation,
        };
      })
    };
  });

  // --- Lenis config (best-effort) ---
  const lenisDump = await page.evaluate(() => {
    const app = document.getElementById('app') || document.querySelector('.lenis');
    let instance = window.__lenis_instance || null;
    // Walk all elements looking for an object that has Lenis signatures
    if (!instance) {
      const candidates = [app, document.documentElement, document.body, window];
      for (const c of candidates) {
        for (const k of Object.keys(c || {})) {
          const v = c[k];
          if (v && typeof v === 'object' && 'scrollTo' in v && 'raf' in v && 'options' in v) {
            instance = v; break;
          }
        }
        if (instance) break;
      }
    }
    const opts = instance && (instance.options || instance.__options) || null;
    // Safe shallow serializer: DOM nodes → tag/id/class; functions → name; skip objects.
    const safeOpts = {};
    if (opts) {
      for (const k of Object.keys(opts)) {
        const v = opts[k];
        if (v == null) safeOpts[k] = v;
        else if (typeof v === 'function') safeOpts[k] = `[fn:${v.name || 'anon'}]`;
        else if (v && v.nodeType === 1) safeOpts[k] = `<${v.tagName.toLowerCase()}${v.id ? '#' + v.id : ''}${v.className ? '.' + String(v.className).trim().split(/\s+/)[0] : ''}>`;
        else if (v === window) safeOpts[k] = '[window]';
        else if (typeof v === 'object') safeOpts[k] = '[obj]';
        else safeOpts[k] = v;
      }
    }
    return {
      classPresent: app ? app.className : null,
      hasGlobalLenis: typeof window.Lenis,
      instanceFound: !!instance,
      options: safeOpts,
      wheelEventsObserved: window.__lenis_probe_events || 0,
      dataAttrs: app ? Object.fromEntries(Array.from(app.attributes).map(a => [a.name, a.value])) : null,
    };
  });

  // --- Design tokens from computed styles ---
  const tokens = await page.evaluate(() => {
    function colorsFromRules() {
      const colors = new Set();
      for (const sheet of document.styleSheets) {
        let rules;
        try { rules = sheet.cssRules || sheet.rules; } catch (e) { continue; }
        if (!rules) continue;
        for (const r of rules) {
          const text = (r.cssText || '').toLowerCase();
          const m = text.match(/#[0-9a-f]{3,8}\b|rgb[a]?\([^)]+\)|hsl[a]?\([^)]+\)/g);
          if (m) m.forEach(c => colors.add(c));
        }
      }
      return Array.from(colors).slice(0, 80);
    }
    const rootStyle = getComputedStyle(document.documentElement);
    const bodyStyle = getComputedStyle(document.body);
    const htmlVars = {};
    for (const name of ['--vw', '--vh', '--margin', '--gutter', '--col', '--height-multiplier']) {
      const v = rootStyle.getPropertyValue(name); if (v) htmlVars[name] = v.trim();
    }
    return {
      htmlStyle: {
        backgroundColor: rootStyle.backgroundColor,
        color: rootStyle.color,
        fontFamily: rootStyle.fontFamily,
        fontSize: rootStyle.fontSize,
        lineHeight: rootStyle.lineHeight,
      },
      bodyStyle: {
        backgroundColor: bodyStyle.backgroundColor,
        color: bodyStyle.color,
        fontFamily: bodyStyle.fontFamily,
        fontSize: bodyStyle.fontSize,
      },
      htmlVars,
      cssColors: colorsFromRules(),
      fontFaces: Array.from(document.fonts || []).map(f => ({ family: f.family, weight: f.weight, style: f.style, display: f.display, status: f.status })),
    };
  });

  // --- Meta / schema / structural capture ---
  const structural = await page.evaluate(() => {
    const headings = [];
    for (const tag of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) {
      for (const el of document.querySelectorAll(tag)) {
        headings.push({ tag, text: el.innerText.trim().slice(0, 200) });
      }
    }
    const metas = {};
    for (const m of document.querySelectorAll('meta[name], meta[property]')) {
      const k = m.getAttribute('name') || m.getAttribute('property');
      metas[k] = m.getAttribute('content');
    }
    const jsonLd = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => s.textContent);
    const semantic = {};
    for (const t of ['main', 'header', 'footer', 'nav', 'article', 'section', 'aside']) {
      semantic[t] = document.querySelectorAll(t).length;
    }
    const paragraphs = Array.from(document.querySelectorAll('p')).map(p => p.innerText.trim()).filter(Boolean);
    const avgPara = paragraphs.length ? paragraphs.reduce((a, p) => a + p.length, 0) / paragraphs.length : 0;
    return {
      title: document.title,
      lang: document.documentElement.lang,
      headings,
      metas,
      jsonLd,
      semantic,
      paragraphCount: paragraphs.length,
      avgParagraphLen: Math.round(avgPara),
      listCount: document.querySelectorAll('ul, ol').length,
    };
  });

  // --- Sample computed styles at each scroll checkpoint ---
  async function sampleAtScroll(ratio, label) {
    const y = Math.round((pageHeight - viewportH) * ratio);
    // Step toward target in a few hops so Lenis/ScrollTrigger see the motion
    const startY = await page.evaluate(() => window.scrollY || window.pageYOffset || 0);
    const hops = 8;
    for (let h = 1; h <= hops; h++) {
      const ty = Math.round(startY + (y - startY) * (h / hops));
      await page.evaluate((ty) => window.scrollTo({ top: ty, left: 0, behavior: 'instant' }), ty);
      await page.waitForTimeout(140);
    }
    await page.waitForTimeout(900); // let scroll-linked anims settle
    const shot = path.join(SHOT_DIR, `scroll-${label}.png`);
    // full-page shot only at 0 to avoid massive files; viewport at others
    if (label === '0') {
      await page.screenshot({ path: shot, fullPage: true });
    } else {
      await page.screenshot({ path: shot, fullPage: false });
    }
    const data = await page.evaluate(({ selectors, props }) => {
      const out = {};
      for (const sel of selectors) {
        const nodes = Array.from(document.querySelectorAll(sel)).slice(0, 3);
        out[sel] = nodes.map((el) => {
          const cs = getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          const entry = {
            rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
            inline: el.getAttribute('style') || null,
          };
          for (const p of props) entry[p] = cs.getPropertyValue(p);
          return entry;
        });
      }
      return out;
    }, { selectors: SAMPLE_SELECTORS, props: COMPUTED_PROPS });
    return { scrollY: y, ratio, label, data };
  }

  const scrollSamples = [];
  for (const [label, ratio] of [['0', 0], ['25', 0.25], ['50', 0.5], ['75', 0.75], ['100', 1.0]]) {
    console.log(`[capture] sampling at ${label}%`);
    scrollSamples.push(await sampleAtScroll(ratio, label));
  }

  // --- Hover / interaction probes ---
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  const interactionProbes = {};
  try {
    const headerLink = await page.$('.header-link');
    if (headerLink) {
      const before = await headerLink.evaluate(el => {
        const cs = getComputedStyle(el);
        return { color: cs.color, opacity: cs.opacity, transform: cs.transform, textDecoration: cs.textDecoration };
      });
      await headerLink.hover();
      await page.waitForTimeout(400);
      const after = await headerLink.evaluate(el => {
        const cs = getComputedStyle(el);
        return { color: cs.color, opacity: cs.opacity, transform: cs.transform, textDecoration: cs.textDecoration };
      });
      interactionProbes.headerLinkHover = { before, after };
    }
    const worksItem = await page.$('.works-item');
    if (worksItem) {
      const before = await worksItem.evaluate(el => {
        const img = el.querySelector('.works-item-image');
        const cs = img && getComputedStyle(img);
        return cs ? { transform: cs.transform, filter: cs.filter, opacity: cs.opacity } : null;
      });
      await worksItem.hover();
      await page.waitForTimeout(500);
      const after = await worksItem.evaluate(el => {
        const img = el.querySelector('.works-item-image');
        const cs = img && getComputedStyle(img);
        return cs ? { transform: cs.transform, filter: cs.filter, opacity: cs.opacity } : null;
      });
      interactionProbes.worksItemHover = { before, after };
    }
  } catch (e) { interactionProbes._error = e.message; }

  // --- Asset download ---
  console.log(`[capture] network recorded ${resourceUrls.size} resource urls`);
  const rawList = Array.from(resourceUrls).map(s => JSON.parse(s));
  const downloadable = rawList.filter(r => {
    if (r.status !== 200) return false;
    const u = r.url;
    // skip analytics/tag-manager/etc
    if (/googletagmanager|google-analytics|doubleclick|hotjar|yandex/i.test(u)) return false;
    // images, fonts, mp4/webm
    return /\.(jpe?g|png|gif|webp|avif|svg|woff2?|ttf|otf|eot|mp4|webm)(\?|$)/i.test(u);
  });
  // Dedup by url
  const uniq = new Map();
  for (const r of downloadable) if (!uniq.has(r.url)) uniq.set(r.url, r);
  console.log(`[capture] downloading ${uniq.size} unique assets...`);

  const assetManifest = [];
  let i = 0;
  for (const r of uniq.values()) {
    i++;
    let filename = safeName(r.url);
    let dest = path.join(ASSET_DIR, filename);
    if (fs.existsSync(dest)) {
      const stem = path.basename(filename, path.extname(filename));
      filename = `${stem}-${i}${path.extname(filename)}`;
      dest = path.join(ASSET_DIR, filename);
    }
    const res = await download(r.url, dest);
    assetManifest.push({ id: `A${i}`, type: r.type, url: r.url, local: path.relative(OUT_ROOT, dest).replace(/\\/g, '/'), size: res.size || null, ok: res.ok });
    if (i % 20 === 0) console.log(`[capture]   ... ${i}/${uniq.size}`);
  }

  // --- Image dimensions (from rendered DOM) ---
  const imageDims = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).slice(0, 200).map(img => ({
      src: img.currentSrc || img.src,
      naturalW: img.naturalWidth, naturalH: img.naturalHeight,
      renderedW: img.width, renderedH: img.height,
      alt: img.alt,
      loading: img.loading,
    }));
  });

  // --- robots / llms / ai ---
  const probes = {};
  for (const probe of ['/robots.txt', '/llms.txt', '/ai.txt', '/sitemap.xml']) {
    try {
      const r = await page.request.get(new URL(probe, TARGET_URL).toString());
      probes[probe] = { status: r.status(), body: r.status() < 400 ? (await r.text()).slice(0, 4000) : null };
    } catch (e) { probes[probe] = { error: e.message }; }
  }

  // --- Final dump ---
  const dump = {
    meta: {
      capturedAt: new Date().toISOString(),
      targetUrl: TARGET_URL,
      viewport: { width: 1440, height: 900 },
      ua: await page.evaluate(() => navigator.userAgent),
    },
    libs: libDetect,
    gsap: gsapDump,
    scrollTrigger: scrollTriggerDump,
    lenis: lenisDump,
    tokens,
    structural,
    scrollSamples,
    interactionProbes,
    assetManifest,
    imageDims,
    externalProbes: probes,
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(dump, null, 2));
  console.log(`[capture] wrote ${DATA_FILE}`);

  await browser.close();
  console.log('[capture] done.');
})();
