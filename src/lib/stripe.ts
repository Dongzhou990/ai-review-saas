import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-05-27.dahlia",
});

// 价格 ID 映射 — 在 Stripe Dashboard 创建产品和价格后填入
export const PRICE_IDS = {
  pro: process.env.STRIPE_PRO_PRICE_ID || "price_pro_monthly",
  enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID || "price_enterprise_monthly",
};

export const PLANS = {
  free: { name: "免费版", dailyReplyLimit: 20, storeLimit: 1 },
  pro: { name: "Pro 版", dailyReplyLimit: 999999, storeLimit: 3 },
  enterprise: { name: "企业版", dailyReplyLimit: 999999, storeLimit: 999 },
} as const;
