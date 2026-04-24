// Phase 3 verification: screenshot the post-loader view and a mid-scroll view.
const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.addStyleTag({ content: ".intro-loader { display: none !important; }" });
  await page.waitForTimeout(1500);

  const top = path.resolve(__dirname, "../screenshots/phase3-scroll0.png");
  await page.screenshot({ path: top, fullPage: false });
  console.log("wrote", top);

  // Scroll to ~50% to verify mid-list renders correctly
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.5));
  await page.waitForTimeout(1500);
  const mid = path.resolve(__dirname, "../screenshots/phase3-scroll50.png");
  await page.screenshot({ path: mid, fullPage: false });
  console.log("wrote", mid);

  // Scroll to bottom (footer)
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(1500);
  const bot = path.resolve(__dirname, "../screenshots/phase3-scroll100.png");
  await page.screenshot({ path: bot, fullPage: false });
  console.log("wrote", bot);

  await browser.close();
})();
