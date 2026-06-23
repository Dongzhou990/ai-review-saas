import { chromium } from "playwright";
import path from "path";
import os from "os";
import fs from "fs";

const DESKTOP = path.join(os.homedir(), "Desktop");
const SVG_PATH = path.join(DESKTOP, "口碑助手_logo.svg");
const PNG_PATH = path.join(DESKTOP, "口碑助手_logo.png");

async function main() {
  const svgContent = fs.readFileSync(SVG_PATH, "utf-8");

  const html = `<!DOCTYPE html><html><body style="margin:0;background:#0a0a0a;display:flex;justify-content:center;align-items:center;width:600px;height:200px;">${svgContent}</body></html>`;

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 600, height: 200 });
  await page.setContent(html);
  await page.waitForTimeout(500);
  await page.screenshot({ path: PNG_PATH, type: "png" });
  await browser.close();
  console.log("✅ Logo PNG saved to desktop");
}

main().catch((err) => { console.error(err); process.exit(1); });
