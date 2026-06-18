"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import {
  MessageSquare,
  Zap,
  BarChart3,
  Shield,
  Check,
  ArrowRight,
  Loader2,
  Copy,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: MessageSquare,
    title: "AI 智能回复",
    description:
      "好评自动感谢、差评智能挽回，根据买家语气和商品类型生成个性化回复，告别千篇一律的模板。",
  },
  {
    icon: Zap,
    title: "多平台接入",
    description:
      "支持抖音小店、淘宝、拼多多、TikTok Shop 等主流平台，一个后台管理所有店铺评论。",
  },
  {
    icon: BarChart3,
    title: "数据看板",
    description:
      "实时监控店铺评分趋势、好评率变化、客服回复率，用数据驱动运营决策。",
  },
  {
    icon: Shield,
    title: "安全可靠",
    description:
      "数据加密传输，不存储敏感信息。AI 生成回复后由你审核发布，完全可控。",
  },
];

const pricingPlans = [
  {
    name: "免费版",
    price: "¥0",
    period: "永久免费",
    description: "适合个人卖家体验",
    features: [
      "每天 20 条 AI 回复",
      "1 个店铺接入",
      "基础回复模板",
      "邮件支持",
    ],
    cta: "免费开始",
    href: "/register",
    plan: "free" as const,
  },
  {
    name: "Pro 版",
    price: "¥99",
    period: "/月",
    description: "适合成长型店铺",
    features: [
      "无限 AI 回复",
      "3 个店铺接入",
      "AI 客服机器人",
      "评论情感分析",
      "自定义回复风格",
      "优先客服支持",
    ],
    cta: "开始试用",
    href: "/register",
    plan: "pro" as const,
    popular: true,
  },
  {
    name: "企业版",
    price: "¥499",
    period: "/月",
    description: "适合多店铺商家",
    features: [
      "无限 AI 回复",
      "不限店铺数量",
      "专属 AI 模型训练",
      "高级数据看板",
      "API 接口",
      "专属客户经理",
      "定制化开发",
    ],
    cta: "联系销售",
    href: "/register",
    plan: "enterprise" as const,
  },
];

export default function LandingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [showWechat, setShowWechat] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handlePricingCTA = (plan: string) => {
    if (plan === "free") {
      router.push("/register");
      return;
    }
    // Pro + 企业版：弹窗显示微信收款码
    setShowWechat(plan);
  };
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Logo size={32} />
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <a href="#features" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                功能
              </a>
              <a href="#pricing" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                价格
              </a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                文档
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  登录
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  免费注册
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="default" className="mb-6 px-4 py-1.5 text-sm">
              ✨ AI 驱动的电商评论管理工具
            </Badge>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              让你的店铺
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                自动回复每一条评论
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              连接抖音、淘宝、拼多多等平台，AI 自动生成个性化回复。
              好评感谢、差评挽回，节省 90% 客服人力，提升店铺评分。
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button variant="primary" size="xl">
                  免费开始使用
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="xl">
                查看演示
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              无需信用卡 · 免费版永久可用
            </p>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-2xl mx-auto text-center">
            {[
              { value: "10,000+", label: "活跃商家" },
              { value: "500万+", label: "AI 回复数" },
              { value: "98.5%", label: "好评率提升" },
              { value: "90%", label: "人力节省" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              一个人管理所有评论
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              AI 帮你处理 90% 的重复工作，你只需要审核和优化
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-2">
                    <feature.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">简单透明的定价</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              从小卖家到企业级，都有适合的方案
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${
                  plan.popular
                    ? "border-blue-500 shadow-xl shadow-blue-500/10 scale-105"
                    : "border-gray-100 dark:border-gray-800"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                    最受欢迎
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-500 text-sm ml-1">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{plan.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">{f}</span>
                    </div>
                  ))}
                </CardContent>
                <div className="p-6 pt-0">
                  <Button
                    variant={plan.plan === "pro" ? "primary" : "outline"}
                    className="w-full"
                    size="lg"
                    onClick={() => handlePricingCTA(plan.plan)}
                    disabled={loadingPlan === plan.plan}
                  >
                    {loadingPlan === plan.plan ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> 跳转 Stripe 支付...</>
                    ) : plan.cta}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">
            准备好节省 90% 的客服时间了吗？
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            注册即享免费版，无需信用卡。满意后扫码升级 Pro 解锁无限次数。
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button variant="primary" size="xl">
                免费开始使用
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* WeChat Payment Modal */}
      {showWechat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowWechat(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">
                {showWechat === "pro" ? "升级 Pro 版 · ¥99/月" : "升级企业版 · ¥499/月"}
              </h2>
              <button onClick={() => setShowWechat(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 mb-4 text-center border border-green-200 dark:border-green-800">
              <img src="/qrcode.jpg" alt="微信收款码" className="w-48 h-48 mx-auto rounded-lg shadow-md object-cover" />
              <p className="text-sm text-gray-500 mt-3">
                微信扫一扫 · {showWechat === "pro" ? "¥99/月" : "¥499/月"}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-sm font-mono shadow-sm">
                <span>Dongzhou526</span>
                <button
                  onClick={() => { navigator.clipboard.writeText("Dongzhou526"); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {copied ? "✓ 已复制" : "复制"}
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium text-gray-900 dark:text-gray-100">📱 开通步骤：</p>
              <p>1. 微信扫码付款</p>
              <p>2. 添加 Dongzhou526 发付款截图 + 注册邮箱</p>
              <p>3. 5 分钟内为你开通权限</p>
            </div>

            <div className="flex gap-2">
              <Link href="/register" className="flex-1">
                <Button variant="outline" className="w-full">先免费试用</Button>
              </Link>
              <Button variant="primary" className="flex-1" onClick={() => setShowWechat(null)}>
                知道了
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>© 2026 Kuki AI. All rights reserved.</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300">
              隐私政策
            </Link>
            <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300">
              服务条款
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
