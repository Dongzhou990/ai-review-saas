import { chromium } from "playwright";
import path from "path";
import os from "os";

const DESKTOP = path.join(os.homedir(), "Desktop");
const BASE = "http://localhost:3000/content-factory";

async function main() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  const page = await context.newPage();

  console.log("🎬 录制美业内容工厂演示...\n");

  // Step 1: Landing
  console.log("📱 Step 1: 首页");
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(DESKTOP, "cf-01-landing.png"), type: "png" });
  console.log("   ✅ cf-01-landing.png");

  // Step 2: Brand Profile Form (fill partially)
  console.log("📝 Step 2: 门店画像");
  await page.goto(BASE + "/brand", { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(1000);

  // Fill in the form to make it look realistic
  // Fill all inputs by order (they appear in sequence)
  const inputs = page.locator("input");
  const count = await inputs.count();
  if (count >= 2) {
    await inputs.nth(0).fill("花漾美甲工作室");
    await inputs.nth(1).fill("杭州");
  }
  // Click industry button
  await page.click('button:has-text("美甲美睫")');
  if (count >= 3) await inputs.nth(2).fill("日式美甲 · 全手单色");
  await page.click('button:has-text("25-35岁上班族")');
  await page.click('button:has-text("温柔")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(DESKTOP, "cf-02-brand.png"), type: "png" });
  console.log("   ✅ cf-02-brand.png");

  // Step 3: Topics (navigate after submit)
  console.log("📋 Step 3: 30条选题");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(DESKTOP, "cf-03-topics.png"), type: "png" });
  console.log("   ✅ cf-03-topics.png");

  // Click first topic
  const topicBtns = page.locator('button:has-text("🎯")');
  if ((await topicBtns.count()) > 0) {
    await topicBtns.first().click();
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: path.join(DESKTOP, "cf-03b-topic-selected.png"), type: "png" });

  // Step 4: Scripts
  console.log("🎤 Step 4: 口播脚本");
  await page.click('button:has-text("生成脚本")');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(DESKTOP, "cf-04-scripts.png"), type: "png" });
  console.log("   ✅ cf-04-scripts.png");

  // Select first script version
  const selectBtns = page.locator('button:has-text("选这个版本")');
  if ((await selectBtns.count()) > 0) {
    await selectBtns.first().click();
    await page.waitForTimeout(500);
  }

  // Step 5: Video
  console.log("🎬 Step 5: 视频任务");
  await page.click('button:has-text("创建视频任务")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(DESKTOP, "cf-05-video.png"), type: "png" });
  // Click create
  await page.click('button:has-text("创建视频任务")');
  await page.waitForTimeout(4000); // wait for mock processing
  await page.screenshot({ path: path.join(DESKTOP, "cf-05b-video-done.png"), type: "png" });
  console.log("   ✅ cf-05-video.png");

  // Step 6: Content
  console.log("📄 Step 6: 小红书内容");
  await page.click('button:has-text("生成小红书")');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(DESKTOP, "cf-06-content.png"), type: "png" });
  console.log("   ✅ cf-06-content.png");

  // Step 7: Schedule
  console.log("📅 Step 7: 发布计划");
  await page.click('button:has-text("生成发布计划")');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(DESKTOP, "cf-07-schedule.png"), type: "png" });
  console.log("   ✅ cf-07-schedule.png");

  // Step 8: Library
  console.log("📚 Step 8: 内容库");
  await page.click('button:has-text("查看内容库")');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(DESKTOP, "cf-08-library.png"), type: "png" });
  console.log("   ✅ cf-08-library.png");

  await browser.close();
  console.log("\n✅ 全部截图已保存到桌面！");
}

main().catch((err) => { console.error("❌", err.message); process.exit(1); });
