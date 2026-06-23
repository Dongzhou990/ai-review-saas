import { chromium } from 'playwright';
import { spawn } from 'child_process';

const URL = 'http://localhost:3461';
const PROJECT_DIR = '/Users/xiaobinggan/ai-review-saas';

async function overlay(page, { title, subtitle, tag, pos = 'tr' }) {
  await page.evaluate(({ title, subtitle, tag, pos }) => {
    const old = document.getElementById('_ol');
    if (old) old.remove();
    const el = document.createElement('div');
    el.id = '_ol';
    el.style.cssText = 'position:fixed;z-index:999999;pointer-events:none;font-family:system-ui,"PingFang SC",sans-serif;';
    let h = '';
    if (tag) h += `<div style="display:inline-flex;align-items:center;gap:6px;padding:6px 16px;background:rgba(6,6,8,0.93);border:1px solid rgba(124,58,237,0.45);border-radius:40px;margin-bottom:10px;backdrop-filter:blur(12px);"><div style="width:7px;height:7px;border-radius:50%;background:#06b6d4;box-shadow:0 0 10px #06b6d4;"></div><span style="font-size:13px;font-weight:700;color:#7c3aed;letter-spacing:0.1em;">${tag}</span></div>`;
    if (title) h += `<div style="font-size:36px;font-weight:800;color:#e8e8f0;letter-spacing:-0.03em;line-height:1.3;text-shadow:0 0 40px rgba(124,58,237,0.5);">${title}</div>`;
    if (subtitle) h += `<div style="font-size:17px;font-weight:400;color:#6b6b80;margin-top:6px;letter-spacing:0.03em;">${subtitle}</div>`;
    el.innerHTML = h;
    el.style.cssText += pos==='c' ? 'inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;' : pos==='tl' ? 'top:45px;left:65px;' : 'top:45px;right:65px;text-align:right;';
    document.body.appendChild(el);
    const s = document.createElement('style'); s.textContent = '@keyframes _in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}'; el.style.animation='_in .5s ease-out'; document.head.appendChild(s);
  }, { title, subtitle, tag, pos });
}

async function clearOL(page) {
  await page.evaluate(() => { const e=document.getElementById('_ol'); if(e){e.style.opacity='0';e.style.transition='opacity .3s';setTimeout(()=>e.remove(),350);} });
}

async function goto(page, path) {
  try {
    await page.goto(URL + path, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(1200);
  } catch (e) {
    console.log('  ⚠ 导航超时，继续...');
    try { await page.goto(URL + path, { waitUntil: 'commit', timeout: 10000 }); await page.waitForTimeout(2000); } catch(e2) {}
  }
}

async function main() {
  console.log('🚀 启动服务...');
  const server = spawn('npx', ['next', 'dev', '-p', '3461'], {
    cwd: PROJECT_DIR,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env },
  });

  await new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), 40000);
    server.stdout.on('data', d => { if (d.toString().includes('Ready')) { clearTimeout(t); setTimeout(resolve, 2000); } });
  });
  console.log('✅ 就绪');

  const browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: PROJECT_DIR + '/public/', size: { width: 1440, height: 900 } },
  });
  const page = await ctx.newPage();

  // ═══ SCENE 1: Landing + Title (0-8s) ═══
  console.log('🎬 首页');
  await goto(page, '/');
  await overlay(page, { title: '口碑助手', subtitle: 'AI 智能回复差评 · 一站式口碑管理', pos: 'c' });
  await page.waitForTimeout(3500);
  await clearOL(page); await page.waitForTimeout(400);
  await overlay(page, { tag: '痛点', title: '顾客差评太多，回复不过来？', subtitle: '每一条差评都在影响你的店铺评分', pos: 'tl' });
  await page.waitForTimeout(4000);

  // ═══ SCENE 2: Register (8-16s) ═══
  console.log('🎬 注册');
  await clearOL(page);
  await goto(page, '/register');
  await overlay(page, { tag: '上手', title: '极速注册', subtitle: '邮箱即可，30 秒开始使用', pos: 'tr' });
  await page.waitForTimeout(4000);
  try { await page.fill('input[type="email"]', 'demo@kuki.ai'); await page.waitForTimeout(400); await page.fill('input[type="password"]', '123456'); await page.waitForTimeout(1500); } catch(e){}

  // ═══ SCENE 3: Review Reply (16-34s) ═══
  console.log('🎬 差评处理');
  await clearOL(page);
  await goto(page, '/dashboard/reviews');
  await overlay(page, { tag: '第1步', title: '粘贴顾客差评', subtitle: '复制差评内容粘贴到输入框', pos: 'tr' });
  await page.waitForTimeout(2500);
  try { const ta = await page.$('textarea'); if (ta) { await ta.fill('服务态度太差了，等了40分钟才上菜，叫服务员半天没人理。'); await page.waitForTimeout(2000); } } catch(e){}
  await clearOL(page); await page.waitForTimeout(400);
  await overlay(page, { tag: '第2步', title: '选择回复风格', subtitle: '诚恳道歉 · 专业解释 · 温暖关怀', pos: 'tr' });
  await page.waitForTimeout(3000);
  try { const btns = await page.$$('button'); for (const b of btns) { const t = await b.textContent(); if (t?.includes('诚恳')) { await b.click(); break; } } await page.waitForTimeout(1200); } catch(e){}
  await clearOL(page); await page.waitForTimeout(400);
  await overlay(page, { tag: '第3步', title: 'AI 一键生成回复', subtitle: '大模型驱动，专业自然如同真人', pos: 'tr' });
  await page.waitForTimeout(2500);
  try { const btns = await page.$$('button'); for (const b of btns) { const t = await b.textContent(); if (t?.includes('生成')) { await b.click(); break; } } await page.waitForTimeout(6000); } catch(e){}

  // ═══ SCENE 4: Styles (34-40s) ═══
  console.log('🎬 风格');
  await clearOL(page); await page.waitForTimeout(500);
  await overlay(page, { tag: '多种风格', title: '支持多种回复语气', subtitle: '诚恳道歉 · 专业解释 · 温暖关怀 · 幽默化解', pos: 'c' });
  await page.waitForTimeout(5000);

  // ═══ SCENE 5: Dashboard (40-50s) ═══
  console.log('🎬 邀评+看板');
  await clearOL(page);
  await goto(page, '/dashboard/invite');
  await overlay(page, { tag: '好评邀约', title: '智能生成邀评话术', subtitle: '主动邀请满意顾客留下好评', pos: 'tr' });
  await page.waitForTimeout(4000);
  await clearOL(page);
  await goto(page, '/dashboard');
  await overlay(page, { tag: '数据看板', title: '口碑数据总览', subtitle: '评分趋势 · 回复效果 · 一目了然', pos: 'tr' });
  await page.waitForTimeout(4500);

  // ═══ SCENE 6: CTA (50-56s) ═══
  console.log('🎬 结尾');
  await clearOL(page); await page.waitForTimeout(300);
  
  // Full screen CTA
  await page.evaluate(() => {
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;background:rgba(6,6,8,0.95);font-family:system-ui,"PingFang SC",sans-serif;';
    el.innerHTML = '<div style="text-align:center;padding:56px 80px;border:1px solid rgba(124,58,237,0.35);border-radius:24px;backdrop-filter:blur(20px);box-shadow:0 0 100px rgba(124,58,237,0.25);"><div style="font-size:52px;font-weight:900;letter-spacing:-0.04em;background:linear-gradient(135deg,#06b6d4,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:12px;">开启智能口碑管理</div><div style="font-size:22px;font-weight:300;color:#6b6b80;margin-bottom:24px;">让 AI 帮你高效处理每一条顾客评价</div><div style="display:inline-block;font-size:20px;font-weight:500;color:#06b6d4;padding:12px 32px;border:1px solid rgba(6,182,212,0.25);border-radius:50px;letter-spacing:0.06em;">reviewai.chat</div></div>';
    document.body.appendChild(el);
  });
  await page.waitForTimeout(5000);

  console.log('✅ 保存视频...');
  await ctx.close();
  await browser.close();
  server.kill();

  const { readdirSync, statSync, renameSync } = await import('fs');
  const files = readdirSync(PROJECT_DIR + '/public/').filter(f => f.endsWith('.webm'));
  const latest = files.sort((a,b) => statSync(PROJECT_DIR+'/public/'+b).mtimeMs - statSync(PROJECT_DIR+'/public/'+a).mtimeMs)[0];
  if (latest) {
    renameSync(PROJECT_DIR+'/public/'+latest, PROJECT_DIR+'/public/demo-final.webm');
    console.log('📁 ' + PROJECT_DIR + '/public/demo-final.webm');
  }
  console.log('🎉 完成！');
}

main().catch(e => { console.error('失败:', e.message); process.exit(1); });
