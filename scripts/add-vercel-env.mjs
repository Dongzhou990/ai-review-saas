/**
 * 安全添加 Vercel 环境变量 — 密钥通过 stdin 交互式输入，不经过命令行
 */
import { spawn } from "child_process";
import { createInterface } from "readline";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const PROJECT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..");

const rl = createInterface({ input: process.stdin, output: process.stdout });

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

function addEnv(key, value) {
  return new Promise((resolve, reject) => {
    const child = spawn("vercel", ["env", "add", key, "production"], {
      cwd: PROJECT_DIR,
      stdio: ["pipe", "inherit", "inherit"],
    });
    child.stdin.write(value + "\n");
    child.stdin.end();
    child.on("close", (code) => {
      code === 0 ? resolve() : reject(new Error(`${key} failed with code ${code}`));
    });
    child.on("error", reject);
  });
}

async function main() {
  console.log("=== Vercel 环境变量配置 ===\n");

  const anthropicKey = await ask("粘贴 ANTHROPIC_API_KEY（DeepSeek Key）: ");
  if (anthropicKey) {
    console.log("  设置中...");
    await addEnv("ANTHROPIC_API_KEY", anthropicKey);
    console.log("  ✅ ANTHROPIC_API_KEY\n");
  }

  const stripeKey = await ask("粘贴 STRIPE_SECRET_KEY: ");
  if (stripeKey) {
    console.log("  设置中...");
    await addEnv("STRIPE_SECRET_KEY", stripeKey);
    console.log("  ✅ STRIPE_SECRET_KEY\n");
  }

  console.log("=== 完成 ===");
  rl.close();
}

main().catch((e) => {
  console.error("失败:", e.message);
  rl.close();
  process.exit(1);
});
