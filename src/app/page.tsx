"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import {
  Check,
  ArrowRight,
  X,
  Clock,
  Shield,
  Lightbulb,
  MessageSquare,
  Sparkles,
  TrendingUp,
  ClipboardList,
  Smartphone,
} from "lucide-react";
import Link from "next/link";

const pricingPlans = [
  {
    name: "免费版",
    price: "¥0",
    period: "免费",
    description: "适合先试试看",
    features: [
      "每天 3 条 AI 回复",
      "AI 差评分析",
      "好评邀约文案",
    ],
    cta: "免费开始用",
    href: "/register",
    plan: "free" as const,
  },
  {
    name: "Pro 版",
    price: "¥99",
    period: "/月",
    description: "适合认真做口碑的门店",
    features: [
      "无限 AI 回复",
      "AI 差评归因分析",
      "门店改进建议",
      "每周口碑周报",
      "好评邀约文案无限用",
    ],
    cta: "升级 Pro",
    plan: "pro" as const,
    popular: true,
  },
];

export default function LandingPage() {
  const [showWechat, setShowWechat] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Logo size={28} />
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400">
              <a href="#features" className="hover:text-white transition-colors">
                它能做什么
              </a>
              <a href="#pricing" className="hover:text-white transition-colors">
                价格
              </a>
              <a href="/plugin" className="hover:text-white transition-colors">
                浏览器插件
              </a>
              <a href="/blog" className="hover:text-white transition-colors">
                使用指南
              </a>
              <a href="#plugin" className="hover:text-white transition-colors">
                浏览器插件
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">登录</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">免费注册</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-cyan-400/20 to-blue-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="default" className="mb-6 px-4 py-1.5 text-sm bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              🏪 餐饮·酒店·美容门店老板都在用
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] text-white">
              打开看一眼，
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                就知道门店口碑怎么样、问题出在哪
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-300/90 max-w-2xl mx-auto leading-relaxed">
              不只是一个"回差评的工具"。
              它是一个 AI 口碑运营助手——帮你回差评、找问题、出主意、做周报。
              每天花 2 分钟，门店口碑清清楚楚。
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button variant="primary" size="xl">
                  免费注册，每天 3 条
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="xl">
                  看看都能做什么
                </Button>
              </a>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              免费版每天 3 条 AI 回复 · 不用绑卡 · 满意再升级
            </p>
          </div>
        </div>
      </section>

      {/* ============ USE CASES ============ */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[
              { icon: "🍜", title: "餐饮老板", desc: "每天出餐忙没空看评价？AI帮你盯差评、出回复、每周告诉你问题在哪。" },
              { icon: "🏨", title: "酒店/民宿", desc: "一条差评丢一单生意。及时回复+分析问题，减少差评对入住率的影响。" },
              { icon: "💆", title: "美容美发/美甲", desc: "新客都看评价选店。AI帮你回好评邀约，差评及时处理，好评越来越多。" },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
                <span className="text-4xl block mb-3">{item.icon}</span>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section id="features" className="py-20 bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">一个工具，帮你管好门店口碑</h2>
            <p className="mt-4 text-lg text-slate-300">不是"AI 回复功能"，是一个让你省心的口碑运营助手</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <MessageSquare className="w-6 h-6" />,
                title: "差评来了，10 秒回好",
                desc: "把顾客差评粘贴进来，AI自动生成真诚回复。选好风格就生成，复制粘贴就能发。不用绞尽脑汁想怎么回。",
                color: "text-blue-600",
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "差评归因，看懂问题在哪",
                desc: "AI自动分析近期差评，告诉你「最近客人主要是抱怨服务态度还是卫生」。有数据支撑，不是拍脑袋。",
                color: "text-purple-600",
              },
              {
                icon: <Lightbulb className="w-6 h-6" />,
                title: "改进建议，知道该改什么",
                desc: "不光发现问题，还给你改造建议。「本周建议重点检查厨房出餐流程」——是老板看得懂的话。",
                color: "text-amber-600",
              },
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: "好评邀约，多拿好评",
                desc: "生成适合微信/短信发给客人的邀评文案。消费后邀评、老客复购邀评、活动后邀评——不同场景都有模板。",
                color: "text-green-600",
              },
              {
                icon: <ClipboardList className="w-6 h-6" />,
                title: "每周周报，不用天天盯",
                desc: "每周生成一份口碑周报：本周差评汇总、最主要问题、改进建议、可直接用的回复文案。老板看一眼就清楚。",
                color: "text-rose-600",
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: "每天 2 分钟，口碑管好",
                desc: "打开看一眼就知道了，不用天天盯着各个平台。省下来的时间，不如多想想怎么把生意做好。",
                color: "text-sky-600",
              },
            ].map((feature) => (
              <Card key={feature.title} className="hover:shadow-md transition-shadow border-slate-700 bg-slate-800/50">
                <CardContent className="p-6">
                  <div className={`w-11 h-11 rounded-xl bg-slate-700 flex items-center justify-center mb-4 ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-white">{feature.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">使用步骤，就这么简单</h2>
          <p className="text-lg text-slate-300 mb-12">从注册到用上，不超过 3 分钟</p>

          <div className="grid sm:grid-cols-4 gap-6">
            {[
              { step: "1", title: "注册账号", desc: "微信或邮箱，30 秒注册" },
              { step: "2", title: "粘贴差评", desc: "从美团/点评复制差评粘贴进来" },
              { step: "3", title: "AI 回复", desc: "选风格，点生成，10 秒出回复" },
              { step: "4", title: "复制发布", desc: "复制回平台发布，搞定" },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="font-bold mb-1 text-white">{item.title}</h4>
                <p className="text-sm text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BROWSER PLUGIN ============ */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-sm mb-4">
              🧩 更省事的用法
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              装个插件，不用复制粘贴
            </h2>
            <p className="text-lg text-slate-300">
              在美团/大众点评/携程后台，每条评价旁边直接出现 AI 回复按钮
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 text-center">
              <div className="text-3xl mb-3">1️⃣</div>
              <h3 className="text-white font-bold mb-2">安装插件</h3>
              <p className="text-sm text-slate-400">Chrome 应用商店搜"口碑助手"，或加载本地扩展包，30秒搞定</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 text-center">
              <div className="text-3xl mb-3">2️⃣</div>
              <h3 className="text-white font-bold mb-2">打开商家后台</h3>
              <p className="text-sm text-slate-400">进入美团/大众点评/携程的评价管理页面，保持日常习惯</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 text-center">
              <div className="text-3xl mb-3">3️⃣</div>
              <h3 className="text-white font-bold mb-2">一键 AI 回复</h3>
              <p className="text-sm text-slate-400">每条评价旁边出现 🤖 AI回复 按钮，点一下自动填入</p>
            </div>
          </div>

          {/* 支持平台 */}
          <div className="rounded-2xl bg-slate-800/30 border border-slate-700 p-6">
            <p className="text-center text-slate-400 text-sm mb-4">插件支持的平台</p>
            <div className="flex flex-wrap justify-center gap-3">
              {["🍜 美团商家中心", "📝 大众点评商家后台", "🏨 携程ebooking", "✈️ 飞猪", "📕 小红书"].map(p => (
                <span key={p} className="px-4 py-2 rounded-full bg-slate-800 text-slate-300 text-sm border border-slate-700">
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="text-center mt-8 space-y-3">
            <p className="text-sm text-slate-400">
              还没用过插件？试试看 —— 比复制粘贴快 10 倍
            </p>
            <div className="flex justify-center gap-4">
              <a href="/plugin" className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
                📖 查看插件详情
              </a>
              <a href="/dashboard/reviews" className="px-6 py-2.5 rounded-xl border border-slate-600 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-colors">
                去网页版直接试 →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="pricing" className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">先免费试用，满意再付费</h2>
            <p className="mt-4 text-lg text-slate-300">每天 3 条免费，够你试出效果。Pro 版 ¥99/月，能帮你省下的时间远不止这个价。</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card key={plan.name} className={`relative ${plan.popular ? "ring-2 ring-orange-500 shadow-xl" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="default" className="px-4 py-1 text-sm bg-indigo-600 text-white">
                      推荐 · 最多人选
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-1 text-white">{plan.name}</h3>
                  <p className="text-sm text-slate-300 mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-slate-400 ml-1">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                        <span className="text-slate-300">{f}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.plan === "free" ? (
                    <Link href="/register">
                      <Button variant={plan.popular ? "primary" : "outline"} className="w-full" size="lg">
                        {plan.cta}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="primary"
                      className="w-full"
                      size="lg"
                      onClick={() => setShowWechat(true)}
                    >
                      升级 Pro · ¥99/月
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            每天 3 条免费，够不够用自己试
          </h2>
          <p className="text-lg text-indigo-100 mb-8">
            不收费、不绑卡。注册就能用，满意了再考虑升级。
          </p>
          <Link href="/register">
            <Button variant="secondary" size="xl" className="bg-white text-indigo-700 hover:bg-indigo-50">
              免费开始使用
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-indigo-300">
            不需要信用卡 · 30 秒注册 · 不满意可以不付费
          </p>
        </div>
      </section>

      {/* ============ WeChat Payment Modal ============ */}
      {showWechat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowWechat(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">升级 Pro 版 · ¥99/月</h2>
              <button onClick={() => setShowWechat(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Pay */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 mb-3 text-center border border-green-200">
              <img src="/qrcode.jpg" alt="微信收款码" className="w-40 h-40 mx-auto rounded-lg shadow-md object-cover" />
              <p className="text-sm text-slate-300 mt-3">微信扫码支付 <strong>¥99</strong></p>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full text-sm font-mono shadow-sm">
                <span>Dongzhou526</span>
                <button
                  onClick={() => { navigator.clipboard.writeText("Dongzhou526"); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="text-blue-600 hover:text-blue-700 font-medium text-xs"
                >
                  {copied ? "✓ 已复制" : "复制微信号"}
                </button>
              </div>
            </div>

            {/* Step 2: Payment note (optional) */}
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-1 block">付款备注（可选，方便核对）</label>
              <input
                type="text"
                id="paymentNote"
                placeholder="填你的手机号或店铺名"
                className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Step 3: Activate */}
            <button
              id="activateProBtn"
              onClick={async () => {
                const btn = document.getElementById('activateProBtn') as HTMLButtonElement | null;
                if (!btn) return;
                btn.innerHTML = '开通中...';
                (btn as HTMLButtonElement).disabled = true;
                try {
                  const note = (document.getElementById('paymentNote') as HTMLInputElement | null)?.value || '';
                  const res = await fetch('/api/payment/activate-pro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ paymentNote: note }),
                  });
                  const data = await res.json();
                  if (data.success) {
                    btn.innerHTML = '✅ 开通成功！';
                    (btn as HTMLButtonElement).className = 'w-full py-2.5 rounded-xl text-sm font-medium bg-green-600 text-white';
                    setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
                  } else {
                    btn.innerHTML = data.error || '开通失败，请重试';
                    (btn as HTMLButtonElement).disabled = false;
                    setTimeout(() => { btn.innerHTML = '我已付款，立即开通 Pro'; }, 3000);
                  }
                } catch {
                  btn.innerHTML = '网络错误，请重试';
                  (btn as HTMLButtonElement).disabled = false;
                  setTimeout(() => { btn.innerHTML = '我已付款，立即开通 Pro'; }, 3000);
                }
              }}
              className="w-full py-2.5 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors mb-2"
            >
              我已付款，立即开通 Pro
            </button>

            <p className="text-xs text-slate-500 text-center">
              💡 付款后点击上方按钮即可开通，无需等待人工审核
            </p>

            <div className="flex gap-2 mt-3">
              <a href="/register" className="flex-1">
                <button className="w-full py-2 rounded-lg text-sm border border-gray-300 text-slate-300 hover:bg-gray-50 transition-colors">
                  先免费试用
                </button>
              </a>
              <button
                onClick={() => setShowWechat(false)}
                className="flex-1 py-2 rounded-lg text-sm border border-gray-300 text-slate-300 hover:bg-gray-50 transition-colors"
              >
                稍后再说
              </button>
            </div>
          </div>
        </div>
      )}
{/* Footer */}
      <footer className="border-t border-slate-800 py-12 bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-300">
          <p>© 2026 口碑助手 · AI门店口碑运营助手</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <Link href="/privacy" className="hover:text-gray-700">隐私政策</Link>
            <Link href="/terms" className="hover:text-gray-700">服务条款</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
