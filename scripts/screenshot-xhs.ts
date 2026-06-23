import { chromium } from "playwright";
import path from "path";
import os from "os";

const DESKTOP = path.join(os.homedir(), "Desktop");
const URL = "http://localhost:3000/xiaohongshu";

async function main() {
  const browser = await chromium.launch({
    args: ["--disable-font-loading-limits"],
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  const page = await context.newPage();
  page.setDefaultTimeout(60000);

  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  // Wait for sections to render
  await page.locator("section").first().waitFor({ state: "visible", timeout: 30000 });
  // Override document.fonts.ready to prevent Playwright screenshot timeout
  await page.evaluate(`
    var _originalFonts = document.fonts;
    Object.defineProperty(document, 'fonts', {
      get: function() {
        _originalFonts.ready = Promise.resolve(_originalFonts);
        return _originalFonts;
      },
      configurable: true
    });
  `);
  console.log("Page loaded, starting screenshots...");

  // Get all full-screen sections
  const sections = await page.locator("section").all();
  console.log(`Found ${sections.length} sections`);

  for (let i = 0; i < sections.length; i++) {
    // Scroll to section and wait for it to be visible
    await sections[i].scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const fileName = `口碑助手_小红书_${i + 1}.png`;
    const filePath = path.join(DESKTOP, fileName);

    // Use page-level screenshot of just the viewport (each section is min-h-screen)
    await page.screenshot({ path: filePath, type: "png", timeout: 30000 });
    console.log(`✅ Saved: ${fileName}`);
  }

  await browser.close();
  console.log("\nDone! 图片已保存到桌面");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
