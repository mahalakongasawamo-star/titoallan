// Phase 2 verification: screenshot the post-loader view by hiding the intro loader.
const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.addStyleTag({ content: ".intro-loader { display: none !important; }" });
  await page.waitForTimeout(500);
  const out = path.resolve(__dirname, "../screenshots/phase2-scroll0.png");
  await page.screenshot({ path: out, fullPage: false });
  console.log("wrote", out);
  await browser.close();
})();
