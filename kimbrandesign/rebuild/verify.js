// Phase verification harness. Run from kimbrandesign/ as:
//   node rebuild/verify.js
const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '..', 'capture', 'node_modules', 'playwright'));

const VIEWPORTS = [
  { label: 'mobile-375',   width: 375,  height: 812  },
  { label: 'tablet-768',   width: 768,  height: 1024 },
  { label: 'desktop-1440', width: 1440, height: 900  },
  { label: 'wide-1920',    width: 1920, height: 1080 },
];
// Phase 6/5 interaction probes run at the desktop viewport only — they're
// DOM-level checks, not viewport-sensitive.
const PROBE_VIEWPORT = 'desktop-1440';

(async () => {
  const htmlPath = path.resolve(__dirname, 'index.html');
  if (!fs.existsSync(htmlPath)) { console.error('MISSING', htmlPath); process.exit(2); }
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  const shotDir = path.resolve(__dirname, 'screenshots');
  if (!fs.existsSync(shotDir)) fs.mkdirSync(shotDir, { recursive: true });

  const browser = await chromium.launch();
  const allErrors = [];
  const perViewport = [];

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    const consoleErrors = [];
    const pageErrors = [];
    const failedRequests = [];
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', (err) => pageErrors.push(String(err)));
    page.on('requestfailed', (req) => failedRequests.push(`${req.url()} :: ${req.failure() && req.failure().errorText}`));

    await page.goto(fileUrl, { waitUntil: 'load' });
    try { await page.evaluate(() => document.fonts && document.fonts.ready); } catch (_) {}
    try { await page.waitForLoadState('networkidle', { timeout: 15000 }); } catch (_) {}
    await page.waitForTimeout(600);

    // Overflow check — any element sticking outside the viewport width?
    const overflow = await page.evaluate(() => {
      const docW = document.documentElement.scrollWidth;
      const vw = window.innerWidth;
      const offenders = [];
      if (docW > vw + 2) {
        Array.from(document.body.querySelectorAll('*')).forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.right > vw + 2 && el.offsetParent) {
            offenders.push({ tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 40), right: Math.round(r.right), w: Math.round(r.width) });
          }
        });
      }
      return { docW, vw, horizontalScroll: docW > vw + 2, offenders: offenders.slice(0, 6) };
    });

    const metrics = await page.evaluate(() => ({
      pageHeight: document.documentElement.scrollHeight,
      viewportH: window.innerHeight,
      viewportW: window.innerWidth,
      scrollTriggerCount: (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.getAll) ? ScrollTrigger.getAll().length : 0,
      h1Font: parseFloat(getComputedStyle(document.querySelector('h1')).fontSize),
      serviceH3Font: parseFloat(getComputedStyle(document.querySelector('.service h3')).fontSize),
      aboutCols: getComputedStyle(document.querySelector('.about')).gridTemplateColumns,
      workCols: getComputedStyle(document.querySelector('.work')).gridTemplateColumns,
      teamCols: getComputedStyle(document.querySelector('.team__grid')).gridTemplateColumns,
    }));

    // Scroll sweep — visible sections at 0/25/50/75/100%.
    const sweep = [];
    const maxScroll = metrics.pageHeight - metrics.viewportH;
    for (const pct of [0, 0.25, 0.5, 0.75, 1]) {
      const y = Math.round(Math.max(0, maxScroll) * pct);
      await page.evaluate((to) => {
        if (window.__lenis) window.__lenis.scrollTo(to, { immediate: true });
        window.scrollTo(0, to);
      }, y);
      await page.waitForTimeout(400);
      const visible = await page.evaluate(() => {
        const sections = ['.hero','#about','#services','#works','#testimonies','#book','#team','#club','#faqs','#contact'];
        const vh = window.innerHeight;
        return sections.filter((sel) => {
          const el = document.querySelector(sel);
          if (!el) return false;
          const r = el.getBoundingClientRect();
          return r.top < vh && r.bottom > 0;
        });
      });
      const shotPath = path.join(shotDir, `${vp.label}-scroll-${Math.round(pct*100)}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });
      sweep.push({ pct, y, visible, shot: path.basename(shotPath) });
    }

    // Interaction probes only at desktop viewport.
    let faqReport = null, snackbarReport = null, navReport = null;
    if (vp.label === PROBE_VIEWPORT) {
      await page.evaluate(() => {
        if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(200);

      faqReport = await page.evaluate(async () => {
        const out = [];
        const faqs = document.querySelectorAll('kim-faq details');
        for (const d of faqs) {
          const summary = d.querySelector('summary');
          const answer  = d.querySelector('.faq__answer');
          summary.click();
          await new Promise((r) => setTimeout(r, 500));
          const hO = answer.getBoundingClientRect().height;
          const openAttr = d.hasAttribute('open');
          summary.click();
          await new Promise((r) => setTimeout(r, 500));
          const hC = answer.getBoundingClientRect().height;
          const closeAttr = !d.hasAttribute('open');
          out.push({ openAttr, hOpen: Math.round(hO), closeAttr, hClose: Math.round(hC) });
        }
        return out;
      });

      snackbarReport = await page.evaluate(async () => {
        const link = document.querySelector('a[href^="mailto:"]');
        const snack = document.querySelector('kim-snackbar.snackbar');
        if (!link || !snack) return { found: false };
        link.click();
        await new Promise((r) => setTimeout(r, 100));
        const shownDuringHold = snack.classList.contains('is-visible');
        return { found: true, shownDuringHold };
      });

      navReport = await page.evaluate(async () => {
        if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
        await new Promise((r) => setTimeout(r, 200));
        const before = window.scrollY;
        const link = document.querySelector('header nav a[href="#services"]');
        if (!link) return { found: false };
        link.click();
        await new Promise((r) => setTimeout(r, 1500));
        const after = window.scrollY;
        return { found: true, before, after, moved: after > before + 100 };
      });
    }

    perViewport.push({ vp, overflow, metrics, sweep, consoleErrors, pageErrors, failedRequests, faqReport, snackbarReport, navReport });
    await page.close();
  }

  await browser.close();

  console.log('============ PHASE 7 MULTI-VIEWPORT SWEEP ============');
  let fatal = 0;
  for (const r of perViewport) {
    const { vp, overflow, metrics, sweep, consoleErrors, pageErrors, failedRequests } = r;
    console.log(`\n--- ${vp.label} (${vp.width}x${vp.height}) ---`);
    console.log(`  pageHeight=${metrics.pageHeight}, scrollTriggers=${metrics.scrollTriggerCount}`);
    console.log(`  h1=${metrics.h1Font}px, .service h3=${metrics.serviceH3Font}px`);
    console.log(`  grids: about=[${metrics.aboutCols}], work=[${metrics.workCols}], team=[${metrics.teamCols}]`);
    console.log(`  horizontal overflow: ${overflow.horizontalScroll} (docW=${overflow.docW}, vw=${overflow.vw})`);
    if (overflow.offenders.length) {
      console.log('   offenders:');
      overflow.offenders.forEach((o) => console.log(`    ${o.tag}.${o.cls} right=${o.right} w=${o.w}`));
    }
    sweep.forEach((s) => console.log(`  pct=${s.pct} y=${s.y} -> ${s.visible.join(', ') || '(none)'} [${s.shot}]`));
    if (consoleErrors.length) { console.log(`  consoleErrors: ${consoleErrors.length}`); consoleErrors.forEach((e) => console.log('    ', e)); fatal += consoleErrors.length; }
    if (pageErrors.length) { console.log(`  pageErrors: ${pageErrors.length}`); pageErrors.forEach((e) => console.log('    ', e)); fatal += pageErrors.length; }
    if (failedRequests.length) {
      const nonMailto = failedRequests.filter((f) => !/mailto:/.test(f));
      if (nonMailto.length) { console.log(`  failedRequests (non-mailto): ${nonMailto.length}`); nonMailto.forEach((e) => console.log('    ', e)); fatal += nonMailto.length; }
    }
    if (overflow.horizontalScroll) fatal += 1;

    if (r.faqReport) {
      const faqOk = r.faqReport.every((x) => x.openAttr && x.hOpen > 10 && x.closeAttr && x.hClose < 5);
      console.log(`  [probe] FAQ cycle 10/10: ${faqOk}`);
      if (!faqOk) { fatal += 1; r.faqReport.forEach((x, i) => console.log(`    [${i}]`, JSON.stringify(x))); }
    }
    if (r.snackbarReport) {
      const ok = r.snackbarReport.found && r.snackbarReport.shownDuringHold;
      console.log(`  [probe] Mailto → snackbar: ${ok}`);
      if (!ok) fatal += 1;
    }
    if (r.navReport) {
      const ok = r.navReport.found && r.navReport.moved;
      console.log(`  [probe] Nav → lenis.scrollTo (0→${r.navReport.after}): ${ok}`);
      if (!ok) fatal += 1;
    }
  }
  console.log(`\n============ FATAL COUNT: ${fatal} ============`);
  process.exit(fatal ? 1 : 0);
})();
