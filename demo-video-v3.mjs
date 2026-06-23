// 口碑助手 · 产品演示视频录制脚本 V3
import { chromium } from 'playwright';

const DEMO_URL = 'http://localhost:3459';
const PAGE_TIMEOUT = 60000;

async function main() {
  const browser = await chromium.launch({ headless: true, channel: "chrome", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: '/Users/xiaobinggan/ai-review-saas/public/', size: { width: 1440, height: 900 } },
  });

  const page = await context.newPage();
  page.setDefaultTimeout(PAGE_TIMEOUT);
  page.setDefaultNavigationTimeout(PAGE_TIMEOUT);

  // ═══ 场景 1: 首页 ═══
  console.log('🎬 录制：首页');
  try {
    await page.goto(DEMO_URL, { waitUntil: "domcontentloaded", timeout: PAGE_TIMEOUT });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: '/Users/xiaobinggan/ai-review-saas/public/screenshot-01-landing.png', fullPage: true });
    console.log('  ✅ 首页完成');
  } catch (e) {
    console.log('  ❌ 首页:', e.message);
  }

  // ═══ 场景 2: 注册 ═══
  console.log('🎬 录制：注册');
  const email = `demo${Date.now()}@test.com`;
  const password = 'demo123456';
  try {
    await page.goto(`${DEMO_URL}/register`, { waitUntil: "domcontentloaded", timeout: PAGE_TIMEOUT });
    await page.waitForTimeout(2000);
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.screenshot({ path: '/Users/xiaobinggan/ai-review-saas/public/screenshot-02-register.png', fullPage: true });
    await page.click('button[type="submit"]');
    await page.waitForTimeout(4000);
    console.log('  ✅ 注册完成');
  } catch (e) {
    console.log('  ❌ 注册:', e.message);
  }

  // ═══ 场景 3: 差评处理 ═══
  console.log('🎬 录制：差评处理');
  try {
    await page.goto(`${DEMO_URL}/dashboard/reviews`, { waitUntil: "domcontentloaded", timeout: PAGE_TIMEOUT });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: '/Users/xiaobinggan/ai-review-saas/public/screenshot-03-reviews.png', fullPage: true });
    console.log('  ✅ 差评处理完成');
  } catch (e) {
    console.log('  ❌ 差评处理:', e.message);
  }

  // ═══ 场景 4: 好评邀约 ═══
  console.log('🎬 录制：好评邀约');
  try {
    await page.goto(`${DEMO_URL}/dashboard/invite`, { waitUntil: "domcontentloaded", timeout: PAGE_TIMEOUT });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/Users/xiaobinggan/ai-review-saas/public/screenshot-04-invite.png', fullPage: true });
    console.log('  ✅ 好评邀约完成');
  } catch (e) {
    console.log('  ❌ 好评邀约:', e.message);
  }

  // ═══ 场景 5: 口碑总览 ═══
  console.log('🎬 录制：口碑总览');
  try {
    await page.goto(`${DEMO_URL}/dashboard`, { waitUntil: "domcontentloaded", timeout: PAGE_TIMEOUT });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/Users/xiaobinggan/ai-review-saas/public/screenshot-05-dashboard.png', fullPage: true });
    console.log('  ✅ 口碑总览完成');
  } catch (e) {
    console.log('  ❌ 口碑总览:', e.message);
  }

  await context.close();
  await browser.close();

  console.log('\n✅ 演示录制完成！');
  console.log('📷 截图: public/screenshot-*.png');
  console.log('🎥 视频文件在 public/ 目录');
}
main().catch(e => { console.error(e); process.exit(1); });
