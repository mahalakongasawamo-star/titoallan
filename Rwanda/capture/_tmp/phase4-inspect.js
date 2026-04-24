const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newContext({ viewport: { width: 1440, height: 900 } }).then(c => c.newPage());
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(200);
  const info = await page.evaluate(() => {
    const loader = document.querySelector(".intro-loader");
    const cs = getComputedStyle(loader);
    return {
      animation: cs.animation,
      animationName: cs.animationName,
      animationDuration: cs.animationDuration,
      animationDelay: cs.animationDelay,
      animationFillMode: cs.animationFillMode,
      animationTimingFunction: cs.animationTimingFunction,
      transform: cs.transform,
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
