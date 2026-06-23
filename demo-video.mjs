// 口碑助手 · 产品演示视频录制脚本
import { chromium } from 'playwright';

const DEMO_URL = 'http://localhost:3459';
const OUTPUT = '/Users/xiaobinggan/ai-review-saas/public/demo-video.webm';

async function main() {
  const browser = await chromium.launch({ headless: true, channel: "chrome", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: '/Users/xiaobinggan/ai-review-saas/public/', size: { width: 1440, height: 900 } },
  });

  const page = await context.newPage();
  await page.setDefaultTimeout(30000);

  // ═══ 场景 1: 首页 ═══
  console.log('🎬 录制：首页');
  await page.goto(DEMO_URL, { waitUntil: "load" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '/Users/xiaobinggan/ai-review-saas/public/screenshot-01-landing.png', fullPage: false });

  // ═══ 场景 2: 注册 ═══
  console.log('🎬 录制：注册');
  const email = `demo${Date.now()}@test.com`;
  const password = 'demo123456';

  try {
    await page.goto(`${DEMO_URL}/register`, { waitUntil: "load" });
    await page.waitForTimeout(1000);
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.screenshot({ path: '/Users/xiaobinggan/ai-review-saas/public/screenshot-02-register-fill.png' });
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
  } catch (e) {
    console.log('注册跳过:', e.message);
  }

  // ═══ 场景 3: 差评处理 ═══
  console.log('🎬 录制：差评处理');
  try {
    await page.goto(`${DEMO_URL}/dashboard/reviews`, { waitUntil: "load" });
    await page.waitForTimeout(2000);

    // Fill in review
    const review = "服务态度太差了，等了40分钟才上菜，叫服务员半天没人理，菜还是凉的。不会再来了。";
    await page.fill('textarea', review);
    await page.waitForTimeout(500);

    // Select style
    const styles = await page.$$('button');
    for (const btn of styles) {
      const text = await btn.textContent();
      if (text?.includes('诚恳道歉')) {
        await btn.click();
        break;
      }
    }
    await page.waitForTimeout(500);

    await page.screenshot({ path: '/Users/xiaobinggan/ai-review-saas/public/screenshot-03-review-input.png' });

    // Generate
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await btn.textContent();
      if (text?.includes('生成回复')) {
        await btn.click();
        break;
      }
    }
    await page.waitForTimeout(8000); // Wait for AI

    await page.screenshot({ path: '/Users/xiaobinggan/ai-review-saas/public/screenshot-04-ai-result.png' });
  } catch (e) {
    console.log('差评处理跳过:', e.message);
  }

  // ═══ 场景 4: 好评邀约 ═══
  console.log('🎬 录制：好评邀约');
  try {
    await page.goto(`${DEMO_URL}/dashboard/invite`, { waitUntil: "load" });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/Users/xiaobinggan/ai-review-saas/public/screenshot-05-invite.png' });

    // Click generate
    const inviteBtns = await page.$$('button');
    for (const btn of inviteBtns) {
      const text = await btn.textContent();
      if (text?.includes('生成邀评')) {
        await btn.click();
        break;
      }
    }
    await page.waitForTimeout(6000);
    await page.screenshot({ path: '/Users/xiaobinggan/ai-review-saas/public/screenshot-06-invite-result.png' });
  } catch (e) {
    console.log('好评邀约跳过:', e.message);
  }

  // ═══ 场景 5: Dashboard ═══
  console.log('🎬 录制：口碑总览');
  try {
    await page.goto(`${DEMO_URL}/dashboard`, { waitUntil: "load" });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/Users/xiaobinggan/ai-review-saas/public/screenshot-07-dashboard.png' });
  } catch (e) {
    console.log('Dashboard跳过:', e.message);
  }

  await context.close();
  await browser.close();

  console.log('✅ 演示录制完成！');
  console.log(`📷 截图: public/screenshot-*.png`);
  console.log(`🎥 视频: public/demo-video.webm`);
}
main().catch(e => { console.error(e); process.exit(1); });
