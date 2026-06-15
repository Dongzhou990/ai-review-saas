#!/bin/bash
# ============================================
# ReviewAI 一键配置脚本
# 配置 Supabase + Vercel 环境变量
# ============================================
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ReviewAI 一键配置${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# ============================================
# Step 1: Supabase 配置
# ============================================
echo -e "${YELLOW}[1/4] 配置 Supabase${NC}"
echo ""
echo "请先在浏览器中完成以下操作："
echo "  1. 打开 https://supabase.com 并登录"
echo "  2. 点击 'New project' 创建项目"
echo "  3. 项目创建后，进入 Settings > API"
echo "  4. 复制 Project URL 和 anon public key"
echo ""

read -p "粘贴 Supabase Project URL: " SUPABASE_URL
read -p "粘贴 Supabase Anon Key: " SUPABASE_ANON_KEY
read -p "粘贴 Supabase Service Role Key (Settings > API > service_role): " SUPABASE_SERVICE_KEY

echo ""
echo -e "${YELLOW}[2/4] 执行数据库 Schema${NC}"
echo "请在 Supabase 控制台执行以下操作："
echo "  1. 进入 SQL Editor"
echo "  2. 打开项目中的 supabase-schema.sql 文件"
echo "  3. 复制全部内容并粘贴到 SQL Editor"
echo "  4. 点击 Run 执行"
echo ""
read -p "Schema 执行完成后按回车继续..."

# ============================================
# Step 2: Vercel 环境变量
# ============================================
echo ""
echo -e "${YELLOW}[3/4] 配置 Vercel 环境变量${NC}"

# 填入你的 AI API Key（支持 Claude API 或 DeepSeek API）
echo ""
read -sp "粘贴你的 API Key (DeepSeek 或 Anthropic): " API_KEY
echo ""

# 检测 API Key 类型来决定 Base URL
if [[ "$API_KEY" == sk-* ]]; then
  API_URL="https://api.deepseek.com/anthropic"
else
  API_URL="https://api.anthropic.com"
fi

cd /Users/xiaobinggan/ai-review-saas

echo "设置 NEXT_PUBLIC_SUPABASE_URL..."
echo "$SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL production

echo "设置 NEXT_PUBLIC_SUPABASE_ANON_KEY..."
echo "$SUPABASE_ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

echo "设置 SUPABASE_SERVICE_ROLE_KEY..."
echo "$SUPABASE_SERVICE_KEY" | vercel env add SUPABASE_SERVICE_ROLE_KEY production

echo "设置 ANTHROPIC_API_KEY..."
echo "$API_KEY" | vercel env add ANTHROPIC_API_KEY production

echo "设置 ANTHROPIC_BASE_URL..."
echo "$API_URL" | vercel env add ANTHROPIC_BASE_URL production

# ============================================
# Step 3: 重新部署
# ============================================
echo ""
echo -e "${YELLOW}[4/4] 重新部署${NC}"
vercel --cwd /Users/xiaobinggan/ai-review-saas --prod --yes

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  配置完成！${NC}"
echo -e "${GREEN}  你的 AI 评论管理 SaaS 已就绪 🚀${NC}"
echo -e "${GREEN}  线上地址: https://ai-review-saas-one.vercel.app${NC}"
echo -e "${GREEN}========================================${NC}"
