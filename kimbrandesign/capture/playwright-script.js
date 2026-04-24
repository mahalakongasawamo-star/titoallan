/**
 * Runtime capture for kimbrandesign.com.
 *
 * Writes:
 *   capture/runtime-data.json
 *   capture/screenshots/scroll-{0,25,50,75,100}.png
 *   capture/rendered-dom.html           (full DOM after scripts settle)
 *   capture/network-log.json            (every resource URL + status)
 *   ../assets/*                         (downloaded images, fonts, videos)
 *
 * Exit 1 on block (403 / 429 / Cloudflare challenge).
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const TARGET_URL = process.env.TARGET_URL || 'https://kimbrandesign.com/';
const VIEWPORT = { width: 1440, height: 900 };
const OUT_DIR = __dirname;
const SHOTS_DIR = path.join(OUT_DIR, 'screenshots');
const ASSETS_DIR = path.join(OUT_DIR, '..', 'assets');

for (const d of [OUT_DIR, SHOTS_DIR, ASSETS_DIR]) fs.mkdirSync(d, { recursive: true });

// ------------- helpers -------------

function safeFilename(u) {
  const url = new URL(u);
  let name = path.basename(url.pathname) || 'index';
  name = name.replace(/[^a-zA-Z0-9._-]/g, '_');
  if (!name.includes('.')) name += '.bin';
  return name;
}

function download(urlStr, dest) {
  return new Promise((resolve) => {
    try {
      const u = new URL(urlStr);
      const mod = u.protocol === 'http:' ? http : https;
      const req = mod.get(urlStr, { headers: { 'User-Agent': 'Mozilla/5.0 kimbran-capture' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const next = new URL(res.headers.location, urlStr).toString();
          res.resume();
          return download(next, dest).then(resolve);
        }
        if (res.statusCode !== 200) {
          res.resume();
          return resolve({ url: urlStr, ok: false, status: res.statusCode });
        }
        const stream = fs.createWriteStream(dest);
        res.pipe(stream);
        stream.on('finish', () => stream.close(() => resolve({ url: urlStr, ok: true, dest, size: fs.statSync(dest).size })));
        stream.on('error', (e) => resolve({ url: urlStr, ok: false, error: e.message }));
      });
      req.on('error', (e) => resolve({ url: urlStr, ok: false, error: e.message }));
      req.setTimeout(30000, () => { req.destroy(new Error('timeout')); });
    } catch (e) {
      resolve({ url: urlStr, ok: false, error: e.message });
    }
  });
}

async function sampleStyles(page, selectors) {
  return page.evaluate((sels) => {
    const pick = [
      'transform', 'opacity', 'filter', 'background-color', 'background-image',
      'color', 'font-size', 'font-family', 'font-weight', 'line-height',
      'letter-spacing', 'width', 'height', 'margin', 'padding', 'position',
      'top', 'left', 'right', 'bottom', 'z-index', 'display', 'visibility',
      'border-radius', 'box-shadow', 'text-shadow'
    ];
    const out = {};
    for (const sel of sels) {
      const nodes = document.querySelectorAll(sel);
      if (!nodes.length) { out[sel] = null; continue; }
      const el = nodes[0];
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const styles = {};
      for (const p of pick) styles[p] = cs.getPropertyValue(p);
      out[sel] = {
        count: nodes.length,
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        styles,
        innerText: (el.innerText || '').slice(0, 140)
      };
    }
    return out;
  }, selectors);
}

// ------------- main -------------

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
    locale: 'fr-FR'
  });
  const page = await context.newPage();

  const network = [];
  page.on('response', (res) => {
    network.push({
      url: res.url(),
      status: res.status(),
      ct: res.headers()['content-type'] || '',
      type: res.request().resourceType()
    });
  });
  page.on('pageerror', (e) => network.push({ error: 'pageerror', message: e.message }));

  console.log('[nav]', TARGET_URL);
  let response;
  try {
    response = await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 });
  } catch (e) {
    console.error('FAIL navigation:', e.message);
    await browser.close();
    process.exit(1);
  }

  const status = response?.status();
  if (status === 403 || status === 429) {
    console.error(`BLOCKED status=${status}`);
    await browser.close();
    process.exit(1);
  }

  // Detect Cloudflare/bot challenge
  const title = await page.title();
  const bodyText = (await page.evaluate(() => document.body?.innerText || '')).slice(0, 2000);
  if (/just a moment|checking your browser|cloudflare|attention required/i.test(title + ' ' + bodyText)) {
    console.error('BLOCKED bot-protection challenge detected');
    fs.writeFileSync(path.join(OUT_DIR, 'block-evidence.txt'), `title=${title}\n\n${bodyText}`);
    await browser.close();
    process.exit(1);
  }

  // Give the page a moment past networkidle for deferred JS (Lenis, GSAP init)
  await page.waitForTimeout(2500);

  // ---- framework detection on window ----
  const detect = await page.evaluate(() => {
    const w = window;
    const hasGsap = !!w.gsap;
    const hasScrollTrigger = !!(w.ScrollTrigger || (w.gsap && w.gsap.ScrollTrigger));
    const hasLenis = !!w.Lenis || !!w.lenis || !!document.querySelector('html.lenis, html.lenis-smooth');
    const hasFramerMotion = !!w.motion || !!document.querySelector('[data-framer-name]');
    const hasWebflow = !!document.querySelector('[data-wf-page], [data-wf-site], html.w-mod-js');
    const hasAOS = !!w.AOS || !!document.querySelector('[data-aos]');
    const hasSwiper = !!w.Swiper || !!document.querySelector('.swiper, .swiper-container');
    const generator = document.querySelector('meta[name="generator"]')?.getAttribute('content');
    const astroCid = !!document.querySelector('[data-astro-cid-1], [data-astro-cid-2]')
      || Array.from(document.querySelectorAll('*')).some(e =>
        Array.from(e.attributes).some(a => a.name.startsWith('data-astro-cid-')));
    return { hasGsap, hasScrollTrigger, hasLenis, hasFramerMotion, hasWebflow, hasAOS, hasSwiper, generator, astroCid };
  });
  console.log('[detect]', detect);

  // ---- GSAP introspection ----
  let gsapDump = null;
  if (detect.hasGsap) {
    gsapDump = await page.evaluate(() => {
      try {
        const g = window.gsap;
        const tweens = g.globalTimeline.getChildren(true, true, true).map(t => {
          const vars = {};
          for (const k of Object.keys(t.vars || {})) {
            const v = t.vars[k];
            if (typeof v === 'function') vars[k] = 'function';
            else if (v && typeof v === 'object' && v.trigger) {
              vars[k] = { _scrollTrigger: true, trigger: String(v.trigger), start: v.start, end: v.end, scrub: v.scrub, pin: v.pin, toggleActions: v.toggleActions };
            } else {
              try { vars[k] = JSON.parse(JSON.stringify(v)); } catch { vars[k] = String(v); }
            }
          }
          return {
            duration: t.duration(),
            ease: (t.vars && t.vars.ease) ? String(t.vars.ease) : undefined,
            targetSelector: (() => { try { const tg = t.targets(); return tg && tg[0] ? (tg[0].tagName ? tg[0].tagName + (tg[0].className ? '.' + String(tg[0].className).split(' ').join('.') : '') : String(tg[0])) : null; } catch { return null; } })(),
            vars
          };
        });
        return { tweens: tweens.slice(0, 80), total: tweens.length };
      } catch (e) { return { error: e.message }; }
    });
  }

  // ---- ScrollTrigger introspection ----
  let stDump = null;
  if (detect.hasScrollTrigger) {
    stDump = await page.evaluate(() => {
      try {
        const ST = window.ScrollTrigger || (window.gsap && window.gsap.ScrollTrigger);
        if (!ST || !ST.getAll) return null;
        const all = ST.getAll();
        return all.map(t => ({
          trigger: t.trigger ? (t.trigger.tagName + (t.trigger.className ? '.' + String(t.trigger.className).split(' ').join('.') : '')) : null,
          start: t.start,
          end: t.end,
          scrub: !!t.scrub,
          pin: !!t.pin,
          pinType: t.pinType,
          vars: {
            start: t.vars?.start,
            end: t.vars?.end,
            scrub: t.vars?.scrub,
            pin: t.vars?.pin ? (typeof t.vars.pin === 'boolean' ? t.vars.pin : String(t.vars.pin)) : false,
            toggleActions: t.vars?.toggleActions,
            markers: !!t.vars?.markers
          }
        }));
      } catch (e) { return { error: e.message }; }
    });
  }

  // ---- Lenis config ----
  let lenisDump = null;
  if (detect.hasLenis) {
    lenisDump = await page.evaluate(() => {
      try {
        const l = window.Lenis || window.lenis || (window.__lenis);
        if (!l) return { note: 'Lenis class detected on html but instance not on window' };
        const inst = typeof l === 'function' ? null : l;
        if (!inst) return { note: 'Lenis constructor only' };
        return {
          duration: inst.options?.duration,
          easing: inst.options?.easing ? inst.options.easing.toString().slice(0, 160) : undefined,
          smoothWheel: inst.options?.smoothWheel,
          orientation: inst.options?.orientation,
          gestureOrientation: inst.options?.gestureOrientation,
          lerp: inst.options?.lerp,
          wheelMultiplier: inst.options?.wheelMultiplier
        };
      } catch (e) { return { error: e.message }; }
    });
  }

  // ---- Extract structural skeleton ----
  const domInfo = await page.evaluate(() => {
    function outline(el, depth = 0, maxDepth = 4) {
      if (!el || depth > maxDepth) return null;
      const skip = ['SCRIPT', 'STYLE', 'NOSCRIPT'];
      if (skip.includes(el.tagName)) return null;
      const classRaw = typeof el.className === 'string' ? el.className : (el.getAttribute('class') || '');
      const classes = classRaw.split(' ').filter(Boolean).slice(0, 3);
      const children = [];
      for (const c of el.children) {
        const o = outline(c, depth + 1, maxDepth);
        if (o) children.push(o);
      }
      return {
        tag: el.tagName.toLowerCase(),
        id: el.id || undefined,
        classes,
        text: el.children.length === 0 ? (el.textContent || '').trim().slice(0, 120) : undefined,
        children: children.length ? children : undefined
      };
    }
    const sections = Array.from(document.querySelectorAll('body > *, main > *, .main > *, #main > *, [role="main"] > *'))
      .filter(el => !['SCRIPT', 'STYLE', 'NOSCRIPT', 'HEAD'].includes(el.tagName));
    return {
      title: document.title,
      lang: document.documentElement.lang,
      generator: document.querySelector('meta[name="generator"]')?.getAttribute('content'),
      description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
      og: Array.from(document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]')).map(m => ({
        k: m.getAttribute('property') || m.getAttribute('name'),
        v: m.getAttribute('content')
      })),
      jsonLd: Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => {
        try { return JSON.parse(s.textContent); } catch { return { raw: (s.textContent || '').slice(0, 400) }; }
      }),
      headings: Array.from(document.querySelectorAll('h1, h2, h3, h4')).slice(0, 80).map(h => ({
        level: +h.tagName[1],
        text: (h.innerText || '').trim().slice(0, 200)
      })),
      semantic: {
        header: document.querySelectorAll('header').length,
        nav: document.querySelectorAll('nav').length,
        main: document.querySelectorAll('main').length,
        article: document.querySelectorAll('article').length,
        section: document.querySelectorAll('section').length,
        aside: document.querySelectorAll('aside').length,
        footer: document.querySelectorAll('footer').length
      },
      skeleton: document.body ? Array.from(document.body.children)
        .filter(el => !['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName))
        .map(el => outline(el, 0, 3)) : []
    };
  });

  // ---- Auto-derive candidate selectors for style sampling ----
  const sampleSelectors = await page.evaluate(() => {
    const picks = new Set([
      'html', 'body', 'header', 'nav', 'main', 'footer',
      'h1', 'h2', 'h3', 'a', 'button'
    ]);
    // Top-level body children
    const bodyKids = Array.from(document.body.children).filter(el => !['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName));
    bodyKids.slice(0, 15).forEach((el, i) => {
      if (el.id) picks.add('#' + el.id);
      else {
        const cn = typeof el.className === 'string' ? el.className : (el.getAttribute('class') || '');
        const c = cn.split(' ').filter(Boolean)[0];
        if (c) picks.add(el.tagName.toLowerCase() + '.' + CSS.escape(c));
        else picks.add(`body > ${el.tagName.toLowerCase()}:nth-child(${i + 1})`);
      }
    });
    // Any class that smells like a section/component: BEM block names without __
    const classCounts = {};
    document.querySelectorAll('[class]').forEach(el => {
      const cn = typeof el.className === 'string' ? el.className : (el.getAttribute('class') || '');
      cn.split(/\s+/).forEach(c => {
        if (!c || c.includes('__') || c.startsWith('lenis') || c.startsWith('w-') || c.startsWith('data-')) return;
        classCounts[c] = (classCounts[c] || 0) + 1;
      });
    });
    Object.entries(classCounts)
      .filter(([, n]) => n >= 1 && n <= 10)
      .slice(0, 40)
      .forEach(([c]) => picks.add('.' + c));
    return Array.from(picks);
  });

  // ---- Scroll-position sampling ----
  const docHeight = await page.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
  const viewportH = VIEWPORT.height;
  const maxScroll = Math.max(0, docHeight - viewportH);
  const scrollStops = [0, 0.25, 0.5, 0.75, 1.0];
  const scrollSamples = [];

  for (const p of scrollStops) {
    const y = Math.round(maxScroll * p);
    await page.evaluate((yy) => {
      // If Lenis is managing scroll, prefer window.scrollTo; Lenis intercepts.
      window.scrollTo({ top: yy, behavior: 'instant' });
      if (window.lenis && window.lenis.scrollTo) { try { window.lenis.scrollTo(yy, { immediate: true }); } catch {} }
    }, y);
    await page.waitForTimeout(900); // allow scroll-linked anims to settle at stop
    const styles = await sampleStyles(page, sampleSelectors);
    scrollSamples.push({ pct: p, y, styles });
    const shotPath = path.join(SHOTS_DIR, `scroll-${Math.round(p * 100)}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
  }

  // Reset to top and take a full-page screenshot for reference
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SHOTS_DIR, 'full-page.png'), fullPage: true });

  // ---- Rendered DOM snapshot ----
  const html = await page.content();
  fs.writeFileSync(path.join(OUT_DIR, 'rendered-dom.html'), html);

  // ---- Asset download (images, fonts, videos) ----
  const assetSeen = new Set();
  const downloads = [];
  for (const r of network) {
    if (!r.url) continue;
    if (!/^https?:/.test(r.url)) continue;
    const rt = r.type;
    const ct = r.ct || '';
    const isAsset =
      rt === 'image' || rt === 'font' || rt === 'media' ||
      /image\/|font\/|video\/|audio\//.test(ct) ||
      /\.(png|jpg|jpeg|webp|avif|gif|svg|woff2?|ttf|otf|mp4|webm|mov)(\?|$)/i.test(r.url);
    if (!isAsset) continue;
    if (assetSeen.has(r.url)) continue;
    assetSeen.add(r.url);
    let fname = safeFilename(r.url);
    let dest = path.join(ASSETS_DIR, fname);
    let n = 1;
    while (fs.existsSync(dest)) {
      const p = path.parse(fname);
      dest = path.join(ASSETS_DIR, `${p.name}__${n}${p.ext}`);
      n++;
    }
    downloads.push(download(r.url, dest).then(info => ({ ...info, rtype: rt, ct })));
  }
  const assetResults = await Promise.all(downloads);

  // ---- robots.txt / llms.txt / ai.txt / sitemap ----
  const origin = new URL(TARGET_URL).origin;
  const probePaths = ['/robots.txt', '/llms.txt', '/ai.txt', '/sitemap.xml'];
  const probes = {};
  for (const p of probePaths) {
    const u = origin + p;
    const tmp = path.join(OUT_DIR, 'probe_' + p.slice(1).replace(/\//g, '_'));
    const r = await download(u, tmp);
    if (r.ok) {
      probes[p] = { ok: true, size: r.size, preview: fs.readFileSync(tmp, 'utf8').slice(0, 1200) };
    } else {
      probes[p] = { ok: false, status: r.status || r.error };
    }
    try { if (fs.existsSync(tmp)) fs.unlinkSync(tmp); } catch {}
  }

  // ---- Paragraph / list stats for content-chunking note ----
  const contentStats = await page.evaluate(() => {
    const ps = Array.from(document.querySelectorAll('p'));
    const lens = ps.map(p => (p.innerText || '').trim().length).filter(n => n > 0);
    const avg = lens.length ? Math.round(lens.reduce((a, b) => a + b, 0) / lens.length) : 0;
    return {
      paragraphs: ps.length,
      avgParagraphChars: avg,
      ul: document.querySelectorAll('ul').length,
      ol: document.querySelectorAll('ol').length,
      li: document.querySelectorAll('li').length
    };
  });

  // ---- Interactive element inventory ----
  const interactives = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll('a, button, [role="button"], details, summary, input, form').forEach(el => {
      const rect = el.getBoundingClientRect();
      items.push({
        tag: el.tagName.toLowerCase(),
        type: el.getAttribute('type') || undefined,
        role: el.getAttribute('role') || undefined,
        text: (el.innerText || el.value || '').trim().slice(0, 80),
        classes: (typeof el.className === 'string' ? el.className : (el.getAttribute('class') || '')).slice(0, 120),
        href: el.getAttribute('href') || undefined,
        visible: rect.width > 0 && rect.height > 0
      });
    });
    return items.slice(0, 200);
  });

  // ---- Write runtime-data.json ----
  const out = {
    meta: {
      targetUrl: TARGET_URL,
      viewport: VIEWPORT,
      capturedAt: new Date().toISOString(),
      docHeight,
      maxScroll
    },
    detection: detect,
    gsap: gsapDump,
    scrollTrigger: stDump,
    lenis: lenisDump,
    dom: domInfo,
    sampleSelectors,
    scrollSamples,
    assetDownloads: assetResults,
    probes,
    contentStats,
    interactives,
    network: network.slice(0, 500)
  };
  fs.writeFileSync(path.join(OUT_DIR, 'runtime-data.json'), JSON.stringify(out, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'network-log.json'), JSON.stringify(network, null, 2));

  console.log('[done]', {
    screenshots: scrollStops.length + 1,
    sampled: sampleSelectors.length,
    gsap: gsapDump ? gsapDump.total : 0,
    st: stDump ? (stDump.length || 0) : 0,
    assets: assetResults.filter(a => a.ok).length + '/' + assetResults.length
  });

  await browser.close();
})().catch(err => {
  console.error('UNCAUGHT', err);
  process.exit(1);
});
