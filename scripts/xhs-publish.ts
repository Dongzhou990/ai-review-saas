import { chromium } from "playwright";

const CREATOR_URL = "https://creator.xiaohongshu.com";
const PUBLISH_URL = "https://creator.xiaohongshu.com/publish/publish";

// === W1-01 内容 ===
const NOTE = {
  title: "你的店差评躺了3天没人回，新客划走找别家了",
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
而且每天3条免费，不绑卡

现在评论区说说👇
你遇到过最难回的差评是什么？`,
  tags: "美业老板 差评回复 门店运营 美甲店 美容院",
};

async function main() {
  console.log("🚀 打开小红书创作者平台...");
  console.log("📱 如果需要登录，请在浏览器中扫码或输入手机号");
  console.log("⏰ 登录完成后请按回车键继续...\n");

  const browser = await chromium.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-blink-features=AutomationControlled"],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  });

  // Hide automation indicators
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
  });

  const page = await context.newPage();

  // Step 1: Open creator page
  await page.goto(CREATOR_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
  console.log("✅ 已打开 creator.xiaohongshu.com");

  // Step 2: Wait for manual login
  console.log("\n⏳ 请在浏览器中登录小红书...");
  console.log("   登录方式：扫码 or 手机号验证码");
  console.log("   登录成功后，回到终端按 Enter 继续\n");

  // Wait for user input in terminal
  await new Promise<void>((resolve) => {
    process.stdin.once("data", () => resolve());
  });

  // Step 3: Navigate to publish page
  console.log("📝 正在打开发布页面...");
  await page.goto(PUBLISH_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(3000);
  console.log("✅ 发布页面已打开");

  // Step 4: Try to fill in content
  console.log("\n📋 开始填写内容...");

  // Try to find and fill the title input
  try {
    const titleInput = page.locator('[placeholder*="标题"]').first();
    await titleInput.waitFor({ state: "visible", timeout: 10000 });
    await titleInput.click();
    await titleInput.fill(NOTE.title);
    console.log("✅ 标题已填入");
  } catch {
    console.log("⚠️  未能自动填入标题，请手动粘贴：");
    console.log(`   ${NOTE.title}`);
  }

  // Try to find and fill the body
  try {
    const bodyInput = page.locator('[placeholder*="正文"], [data-placeholder*="正文"], .ql-editor').first();
    await bodyInput.waitFor({ state: "visible", timeout: 5000 });
    await bodyInput.click();
    await bodyInput.fill(NOTE.body);
    console.log("✅ 正文已填入");
  } catch {
    console.log("⚠️  未能自动填入正文，请手动粘贴");
  }

  // Print content for manual copy
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋 如果自动填入失败，请手动复制以下内容：\n");
  console.log("【标题】");
  console.log(NOTE.title);
  console.log("\n【正文】");
  console.log(NOTE.body);
  console.log("\n【话题】");
  console.log(NOTE.tags);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log("✅ 内容已准备好。请在浏览器中：");
  console.log("   1. 确认标题和正文");
  console.log("   2. 添加图片");
  console.log("   3. 添加话题标签：" + NOTE.tags);
  console.log("   4. 点击发布\n");
  console.log("⏳ 浏览器保持打开，发布完成后按 Enter 关闭...");

  // Wait for user to finish
  await new Promise<void>((resolve) => {
    process.stdin.once("data", () => resolve());
  });

  await browser.close();
  console.log("👋 完成！");
}

main().catch((err) => {
  console.error("❌ 错误:", err.message);
  process.exit(1);
});
