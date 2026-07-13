"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "免费试用",
    price: "¥0",
    period: "每天3条",
    desc: "先试试效果，不绑卡",
    features: ["每天 3 条 AI 回复", "8 种回复风格", "差评 + 好评都支持"],
    cta: "免费开始用",
    href: "/demo",
    plan: "free" as const,
  },
  {
    name: "月度版",
    price: "¥99",
    period: "/月",
    desc: "按月付费 · 随时可停",
    features: [
      "无限 AI 回复",
      "8 种回复风格随意切换",
      "AI 差评归因分析",
      "每周口碑周报",
      "好评邀约文案",
      "微信 1v1 咨询",
    ],
    cta: "¥99/月 开通",
    plan: "monthly" as const,
    planType: "monthly" as const,
  },
  {
    name: "年度版",
    price: "¥299",
    period: "/年",
    desc: "立省 ¥889 · 相当于 ¥25/月",
    features: [
      "月度版全部功能",
      "无限 AI 回复",
      "8 种回复风格随意切换",
      "AI 差评归因分析 + 每周周报",
      "好评邀约文案",
      "微信 1v1 优先咨询",
    ],
    cta: "¥299/年 立即开通",
    plan: "yearly" as const,
    planType: "yearly" as const,
    popular: true,
  },
];

export function PricingSection() {
  const [showWechat, setShowWechat] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{name: string; price: string; planType: string} | null>(null);
  const [copied, setCopied] = useState(false);

  return (
    <>
      <section id="pricing" className="bg-neutral-950 py-16 sm:py-20">
        <div className="max-w-lg mx-auto px-5">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">
              先免费用
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold">
              觉得值<span className="text-neutral-400">再付费</span>
            </h2>
            <p className="mt-3 text-sm text-neutral-500">
              少丢一个新客就回本了。一个美业新客值 ¥300-3000，你算算账。
            </p>
          </div>

          <div className="space-y-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-5 ${
                  plan.popular
                    ? "bg-gradient-to-br from-indigo-600/10 to-blue-600/10 border-2 border-indigo-500/30"
                    : "bg-neutral-900 border border-neutral-800"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg">
                    最多人选
                  </span>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-base">{plan.name}</h3>
                    <p className="text-xs text-neutral-500">{plan.desc}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold">{plan.price}</span>
                    <span className="text-xs text-neutral-500 ml-0.5">
                      {plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-1.5 mb-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-neutral-400">
                      <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {plan.plan === "free" ? (
                  <Link href={plan.href}>
                    <Button
                      variant={plan.popular ? "primary" : "outline"}
                      size="md"
                      className="w-full"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => {
                      setSelectedPlan({ name: plan.name, price: plan.price, planType: plan.planType });
                      setShowWechat(true);
                    }}
                  >
                    {plan.cta}
                  </Button>
                )}
              </div>
            ))}
          </div>

          <p className="text-center mt-5 text-xs text-neutral-500">
            也可以先试试{" "}
            <Link href="/demo" className="text-blue-400 underline">
              免注册演示
            </Link>
            ，看了效果再说
          </p>
        </div>
      </section>

      {/* WeChat payment modal */}
      {showWechat && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowWechat(false)}
        >
          <div
            className="bg-neutral-900 rounded-t-2xl sm:rounded-2xl w-full max-w-sm mx-0 sm:mx-4 p-6 border border-neutral-800 animate-in slide-in-from-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{selectedPlan?.name} · {selectedPlan?.price}{selectedPlan?.planType === "yearly" ? "/年" : "/月"}</h2>
              <button
                onClick={() => setShowWechat(false)}
                className="p-2 hover:bg-neutral-800 rounded-lg -mr-2"
                aria-label="关闭"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            <div className="bg-neutral-950 rounded-xl p-6 text-center border border-neutral-800">
              <img
                src="/qrcode.jpg"
                alt="微信收款码"
                className="w-40 h-40 mx-auto rounded-lg object-cover"
              />
              <p className="text-sm text-neutral-400 mt-3">
                微信扫码支付 <strong className="text-white">{selectedPlan?.price || "¥99"}</strong>
              </p>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-800 rounded-full text-sm">
                <span className="text-neutral-300">Dongzhou526</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("Dongzhou526");
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-blue-400 hover:text-blue-300 font-medium text-xs"
                >
                  {copied ? "✓ 已复制" : "复制微信号"}
                </button>
              </div>
            </div>

            <div className="mt-3">
              <input
                type="text"
                id="paymentNote"
                placeholder="填你的手机号或店铺名（方便核对）"
                className="w-full h-10 rounded-lg border border-neutral-700 bg-neutral-800 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder:text-neutral-500"
              />
            </div>

            <button
              onClick={async () => {
                const btn = document.getElementById("proBtn") as HTMLButtonElement | null;
                if (!btn) return;
                btn.textContent = "开通中...";
                btn.disabled = true;
                try {
                  const note =
                    (document.getElementById("paymentNote") as HTMLInputElement | null)?.value || "";
                  const res = await fetch("/api/payment/activate-pro", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ paymentNote: note }),
                  });
                  const data = await res.json();
                  if (data.success) {
                    btn.textContent = "✅ 开通成功！";
                    btn.className =
                      "w-full mt-3 py-2.5 rounded-xl text-sm font-medium bg-green-600 text-white";
                    setTimeout(() => {
                      window.location.href = "/dashboard";
                    }, 1500);
                  } else {
                    btn.textContent = data.error || "开通失败，请重试";
                    btn.disabled = false;
                    setTimeout(() => {
                      btn.textContent = "我已付款，立即开通 Pro";
                    }, 3000);
                  }
                } catch {
                  btn.textContent = "网络错误，请重试";
                  btn.disabled = false;
                  setTimeout(() => {
                    btn.textContent = "我已付款，立即开通 Pro";
                  }, 3000);
                }
              }}
              id="proBtn"
              className="w-full mt-3 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 transition-colors"
            >
              我已付款，立即开通 Pro
            </button>

            <p className="text-xs text-neutral-500 text-center mt-2">
              💡 付款后点击上方按钮即可开通
            </p>
          </div>
        </div>
      )}
    </>
  );
}
