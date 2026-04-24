// Phase 4 verification: capture intro-loader translateY + .logo rect at
// the same timestamps the reference capture used (§4.1), plus check that
// the persistent top-left .logo doesn't move during the dismiss.
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const timestamps = [0, 300, 2500, 2700, 2900, 3000, 3050, 3100, 3150, 3200, 3300, 3400, 4000];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();

  // Disable prefers-reduced-motion so we test the real animation
  await page.emulateMedia({ reducedMotion: "no-preference" });

  const t0 = Date.now();
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });

  const samples = [];
  for (const t of timestamps) {
    const wait = t - (Date.now() - t0);
    if (wait > 0) await page.waitForTimeout(wait);
    const data = await page.evaluate(() => {
      const loader = document.querySelector(".intro-loader");
      const logo = document.querySelector("a.logo");
      function matrixToY(s) {
        if (!s || s === "none") return 0;
        const m = s.match(/matrix\(([^)]+)\)/);
        if (m) return parseFloat(m[1].split(",")[5]);
        const m3 = s.match(/matrix3d\(([^)]+)\)/);
        if (m3) return parseFloat(m3[1].split(",")[13]);
        return null;
      }
      const loaderTransform = getComputedStyle(loader).transform;
      return {
        loaderTransform,
        loaderY: matrixToY(loaderTransform),
        logoRect: logo.getBoundingClientRect(),
      };
    });
    const elapsed = Date.now() - t0;
    samples.push({ reqT: t, actualT: elapsed, ...data });
  }

  fs.writeFileSync(
    path.resolve(__dirname, "phase4-loader-samples.json"),
    JSON.stringify(samples, null, 2),
    "utf8",
  );

  // Screenshot at a few key moments
  await browser.close();

  console.log("Loader translateY + logo rect samples:");
  for (const s of samples) {
    const y = s.loaderY !== null ? s.loaderY.toFixed(1).padStart(7) : "  null";
    const lr = `(${s.logoRect.x.toFixed(0)}, ${s.logoRect.y.toFixed(0)}, ${s.logoRect.width.toFixed(0)}×${s.logoRect.height.toFixed(0)})`;
    console.log(`  t+${String(s.reqT).padStart(4)}ms  actual=${String(s.actualT).padStart(4)}  loader.y=${y}  logo=${lr}`);
  }
})();
