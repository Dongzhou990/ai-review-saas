import { chromium } from "playwright";
import path from "path";
import os from "os";
import fs from "fs";

const USER_DATA = path.join(os.homedir(), ".xhs-browser-data");
const PUBLISH_URL = "https://creator.xiaohongshu.com/publish/publish";

// ========== 配置：加载今天要发的内容 ==========
const CONTENT_DIR = path.join(os.homedir(), "ai-review-saas/xhs-content/04-发布日历");

const NOTE = {
  title: "差评躺了3天没人回，新客划走找别家了",
  body: `差评躺在美tuan/点评上没人回
新客搜到你店，看到这条差评
划走了。

你憋半天想不出怎么回
回得不好怕火上浇油
不回又显得不重视

但说实话
你每天忙着服务客人
哪有精力每条差评都仔细想回复？

以前我也觉得差评很头疼
后来用了个方法：
粘贴差评 → AI看懂内容 → 10秒出回复
每条都不一样，像真人在说话
每天3条免费，不绑卡

评论区说说👇
你遇到过最难回的差评是什么？`,
  tags: "美业老板 差评回复 门店运营 美甲店 美容院",
};

// 你桌面的配图（按发布顺序）
const IMAGE_PATHS: string[] = []; // 后面会生成

async function main() {
  console.log("🤖 小红书全流程自动发布 v3\n");

  const browser = await chromium.launchPersistentContext(USER_DATA, {
    headless: false,
    viewport: { width: 1440, height: 900 },
    args: ["--no-sandbox"],
  });

  const page = browser.pages()[0] || (await browser.newPage());

  // ===== 1. 打开发布页 =====
  console.log("📱 打开发布页...");
  await page.goto(PUBLISH_URL, { waitUntil: "domcontentloaded", timeout: 30000 });

  // ===== 2. 等登（如果没登）=====
  if (page.url().includes("login") || page.url().includes("signin")) {
    console.log("🔐 需要登录，请在浏览器中扫码");
    console.log("   等你登录完我继续...\n");
    await page.waitForURL(
      (url) => !url.href.includes("login") && !url.href.includes("signin"),
      { timeout: 180000 }
    );
    await page.goto(PUBLISH_URL, { waitUntil: "domcontentloaded", timeout: 15000 });
  }
  console.log("✅ 已登录\n");

  await page.waitForTimeout(3000);

  // ===== 3. 填标题 =====
  console.log("📝 填标题...");
  try {
    // 小红书发布页标题区
    await page.click('[class*="title"] textarea, [placeholder*="标题"]', { timeout: 5000 });
  } catch {
    // 用 Tab 导航到标题区
    await page.keyboard.press("Tab");
    await page.waitForTimeout(300);
  }
  await page.keyboard.insertText(NOTE.title);
  console.log("  ✅ 标题 OK");

  // ===== 4. 填正文 =====
  console.log("📝 填正文...");
  try {
    // 点击正文区
    const bodyEditors = page.locator('[class*="content"] [contenteditable], [class*="ql-editor"], [data-placeholder*="正文"]');
    if ((await bodyEditors.count()) > 0) {
      await bodyEditors.first().click();
    } else {
      // fallback: Tab 到正文区
      await page.keyboard.press("Tab");
      await page.waitForTimeout(300);
      await page.keyboard.press("Tab");
      await page.waitForTimeout(300);
    }
  } catch { /* ignore */ }
  await page.keyboard.insertText(NOTE.body);
  console.log("  ✅ 正文 OK\n");

  // ===== 5. 上传图片（如果有）=====
  if (IMAGE_PATHS.length > 0) {
    console.log("🖼️  上传图片...");
    for (const img of IMAGE_PATHS) {
      if (fs.existsSync(img)) {
        try {
          const fileInput = page.locator('input[type="file"]').first();
          await fileInput.setInputFiles(img);
          await page.waitForTimeout(2000);
          console.log(`  ✅ ${path.basename(img)}`);
        } catch {
          console.log(`  ⚠️  ${path.basename(img)} 上传失败，请手动拖入`);
        }
      }
    }
    console.log("");
  } else {
    console.log("🖼️  无预设图片，请在浏览器中手动拖入配图\n");
  }

  // ===== 6. 填话题标签 =====
  console.log("🏷️  填话题标签...");
  try {
    // 试找到标签输入框
    const tagInput = page.locator('[class*="tag"], [placeholder*="话题"], [placeholder*="标签"]').first();
    await tagInput.click({ timeout: 3000 });
    for (const tag of NOTE.tags.split(" ")) {
      await page.keyboard.insertText("#" + tag);
      await page.keyboard.press("Enter");
      await page.waitForTimeout(500);
    }
    console.log("  ✅ 标签 OK\n");
  } catch {
    console.log("  ⚠️  标签未能自动添加，请手动输入\n");
  }

  // ===== 7. 最终确认 =====
  console.log("=".repeat(55));
  console.log("🎯 标题和正文已填好，请在浏览器中确认：");
  console.log("   1. 检查内容是否正确");
  console.log("   2. 上传/确认配图");
  console.log("   3. 确认话题标签");
  console.log("   4. 点击 [发布] 按钮");
  console.log("=".repeat(55));
  console.log("\n💡 以后每次发帖，只需跑这条命令：");
  console.log("   cd ~/ai-review-saas && npx tsx scripts/xhs-full-auto.ts");
  console.log("   （已自动记住登录状态，下次不用再扫）\n");

  // 保持浏览器开着等用户手动点发布
  console.log("⏸️  浏览器保持打开，发布后关闭即可\n");
}

main().catch((err) => {
  console.error("❌", err.message);
  process.exit(1);
});
