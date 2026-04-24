const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newContext({ viewport: { width: 1440, height: 900 } }).then(c => c.newPage());
  const t0 = Date.now();
  await page.goto("http://localhost:3000/", { waitUntil: "load" });
  console.log("load at", Date.now() - t0);

  // Poll every 100ms for 5s and log the raw transform string
  for (let i = 0; i < 50; i++) {
    await page.waitForTimeout(100);
    const t = Date.now() - t0;
    const info = await page.evaluate(() => {
      const loader = document.querySelector(".intro-loader");
      return { transform: getComputedStyle(loader).transform };
    });
    if (t > 2400 && t < 3500) {
      console.log(`t=${t}ms transform=${info.transform}`);
    }
  }
  await browser.close();
})();
