# 口碑助手 (Word-of-Mouth AI)

> AI 驱动的美业门店评价回复工具 —— 10 秒生成真诚回复，8 种风格一键切换。

## 🚀 线上地址

[https://reviewai.chat](https://reviewai.chat)

免费试用 → [reviewai.chat/demo](https://reviewai.chat/demo)

## 💡 解决了什么问题？

美业老板（皮肤管理/美甲/美发）每天被大众点评上的差评困扰：
- 想回不知道怎么回，憋半小时
- 回了怕火上浇油，不回怕新客看见划走
- 请代运营 ¥2000-5000/月，小门店付不起

**口碑助手把这件事变成 3 步：粘贴 → 选风格 → 10 秒出回复。**

## ✨ 核心功能

- **8 种回复风格**：差评 5 种（真诚道歉/补偿安抚/改进承诺/专业得体/温和亲切）+ 好评 3 种（热情感谢/朋友互动/邀请复购）
- **AI 差评归因分析**：自动分析差评集中在什么问题（服务/技术/价格/卫生）
- **每周口碑周报**：自动汇总本周口碑变化
- **CRM 客户追踪**：内置销售漏斗，线索管理→跟进提醒→成交分析
- **免注册直接试**：每天 3 条免费，微信打开就能用

## 🛠 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 16 + React 19 + Tailwind CSS 4 |
| 后端 | Next.js API Routes |
| AI | Claude API / DeepSeek API |
| 数据库 | Supabase (PostgreSQL) |
| 部署 | Vercel |
| 支付 | 微信收款码 + 手动激活 |

## 📊 产品架构

```
首页 → Demo 试用（免费3次/天）→ 付款弹窗 → 微信扫码 ¥99
                    ↓
              CRM 系统：线索管理 → 话术生成 → 客户追踪 → 数据分析
```

## 🏃 本地运行

```bash
npm install
npm run dev
# 打开 http://localhost:3000
```

环境变量 (`.env.local`)：
```
ANTHROPIC_API_KEY=sk-ant-xxx
NEXT_PUBLIC_SUPABASE_URL=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
ADMIN_SECRET=你的密码
```

## 📈 定价

| 方案 | 价格 |
|------|------|
| 免费 | ¥0（每天3条） |
| 月度 | ¥99/月 |
| 年度 | ¥299/年（¥25/月） |

## 👤 作者

独立开发，全栈 + 产品 + 运营。

- 产品：[reviewai.chat](https://reviewai.chat)
- 微信：Dongzhou526
