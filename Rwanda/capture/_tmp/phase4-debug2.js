const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newContext({ viewport: { width: 1440, height: 900 } }).then(c => c.newPage());
  const t0 = Date.now();
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  console.log("DOMContentLoaded at", Date.now() - t0);

  // Register animation event listeners
  await page.evaluate(() => {
    window.__evts = [];
    const el = document.querySelector(".intro-loader");
    ["animationstart", "animationend", "animationiteration"].forEach(name =>
      el.addEventListener(name, (e) => window.__evts.push({ name, time: performance.now(), anim: e.animationName }))
    );
    window.__samples = [];
    const poll = () => {
      const cs = getComputedStyle(el);
      window.__samples.push({ time: performance.now(), transform: cs.transform, animationPlayState: cs.animationPlayState, animationName: cs.animationName });
    };
    window.__pollInt = setInterval(poll, 50);
    window.__t0 = performance.now();
  });

  await page.waitForTimeout(5000);

  const out = await page.evaluate(() => ({ evts: window.__evts, samples: window.__samples, t0: window.__t0 }));
  console.log("events:", JSON.stringify(out.evts, null, 2));
  console.log("t0 (ms since perf origin):", out.t0);
  console.log("sample count:", out.samples.length);
  // Show samples where transform changes
  let last = null;
  for (const s of out.samples) {
    if (s.transform !== last) {
      console.log(`  t=${(s.time - out.t0).toFixed(0)}ms  transform=${s.transform}  state=${s.animationPlayState}  name=${s.animationName}`);
      last = s.transform;
    }
  }
  await browser.close();
})();
