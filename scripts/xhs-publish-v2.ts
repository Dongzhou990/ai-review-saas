import { chromium } from "playwright";
import path from "path";
import os from "os";

// Persistent browser data dir — saves login state between runs
const USER_DATA = path.join(os.homedir(), ".xhs-browser-data");
const PUBLISH_URL = "https://creator.xiaohongshu.com/publish/publish";

// === 今日第1条 ===
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
  tags: ["美业老板", "差评回复", "门店运营", "美甲店", "美容院"],
};

async function main() {
  console.log("🚀 打开小红书发布页...");
  console.log("📁 浏览器数据目录: " + USER_DATA);
  console.log("💡 如果之前登录过，本次无需重新登录\n");

  const browser = await chromium.launchPersistentContext(USER_DATA, {
    headless: false,
    viewport: { width: 1440, height: 900 },
    args: ["--no-sandbox"],
  });

  const page = browser.pages()[0] || (await browser.newPage());

  // Step 1: Go directly to publish page
  await page.goto(PUBLISH_URL, { waitUntil: "domcontentloaded", timeout: 30000 });

  // Step 2: Check login status
  if (page.url().includes("login") || page.url().includes("signin")) {
    console.log("⚠️  未登录，请在浏览器中登录（扫码/手机号）");
    console.log("⏳ 登录后脚本会自动继续...\n");
    // Wait until redirected away from login
    await page.waitForURL((url) => !url.href.includes("login") && !url.href.includes("signin"), {
      timeout: 120000,
    });
    console.log("✅ 登录成功！");
  } else {
    console.log("✅ 已登录，跳过验证");
  }

  // Step 3: Make sure we're on the publish page
  if (!page.url().includes("publish")) {
    await page.goto(PUBLISH_URL, { waitUntil: "domcontentloaded", timeout: 15000 });
  }
  await page.waitForTimeout(3000);
  console.log("✅ 发布页面已就绪\n");

  // Step 4: Try to fill title
  console.log("📝 填入标题...");
  try {
    const titleArea = page.locator('[class*="title"], [placeholder*="标题"], [data-testid*="title"]').first();
    await titleArea.waitFor({ state: "visible", timeout: 8000 });
    await titleArea.click();
    await page.keyboard.insertText(NOTE.title);
    console.log("✅ 标题已填入");
  } catch {
    console.log("⚠️  标题未能自动填入");
  }

  // Step 5: Try to fill body
  console.log("📝 填入正文...");
  try {
    const bodyArea = page.locator('[class*="content"], [placeholder*="正文"], [class*="editor"]').first();
    await bodyArea.waitFor({ state: "visible", timeout: 5000 });
    await bodyArea.click();
    await page.keyboard.insertText(NOTE.body);
    console.log("✅ 正文已填入");
  } catch {
    console.log("⚠️  正文未能自动填入");
  }

  // Step 6: Print manual instructions
  console.log("\n" + "=".repeat(50));
  console.log("📋 请在浏览器中完成以下操作：");
  console.log("   1. 确认标题和正文已填入");
  console.log("   2. 上传配图（如果有）");
  console.log("   3. 添加话题标签: " + NOTE.tags.join(" "));
  console.log("   4. 点击「发布」按钮");
  console.log("=".repeat(50) + "\n");

  console.log("📋 如果内容未填入，请手动复制：\n");
  console.log("【标题】\n" + NOTE.title + "\n");
  console.log("【正文】\n" + NOTE.body + "\n");
  console.log("【话题】\n" + NOTE.tags.join(" ") + "\n");

  console.log("⏸️  浏览器保持打开。发布完成后，关闭浏览器即可。");
  console.log("💡 下次运行时将自动保持登录状态！");
}

main().catch((err) => {
  console.error("❌ 错误:", err.message);
  process.exit(1);
});
