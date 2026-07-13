"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Sparkles, Copy, Check, MessageSquare, X, RefreshCw } from "lucide-react";
import Link from "next/link";
import { TONE_GROUPS, type ReplyTone } from "@/lib/ai";

const PRESET_EXAMPLES = [
  // 差评示例
  {
    id: 1,
    label: "💅 美甲差评",
    reviewer: "张女士",
    rating: 1,
    content: "做了个指甲，三天就翘边了。做完颜色也跟色板差很多，沟通了半天也没用。不会再来了，失望。",
    tone: "apologetic" as ReplyTone,
  },
  {
    id: 2,
    label: "💆‍♀️ 皮肤管理差评",
    reviewer: "李小姐",
    rating: 2,
    content: "做了一次水光，说实话跟没做一样。1680花得完全不值。而且做完脸上还过敏了，说好的敏感肌专用产品呢？",
    tone: "compensation" as ReplyTone,
  },
  {
    id: 3,
    label: "💇‍♀️ 美发中评",
    reviewer: "王女士",
    rating: 3,
    content: "剪得还行，但跟我给的参考图效果差很多。沟通的时候说明白了，但理发师好像有自己的想法。价格不算便宜，下次应该换一家了。",
    tone: "professional" as ReplyTone,
  },
  // 好评示例
  {
    id: 4,
    label: "⭐ 皮肤管理好评",
    reviewer: "赵女士",
    rating: 5,
    content: "在这里做了半年的皮肤管理了，每次来都觉得特别舒服。美容师很细心，效果也一直在变好。强烈推荐！",
    tone: "enthusiastic" as ReplyTone,
  },
  {
    id: 5,
    label: "⭐ 美甲好评",
    reviewer: "陈小姐",
    rating: 4,
    content: "第二次来了，款式很多，小姐姐很耐心地帮我调颜色。做完真的很好看，朋友都问我在哪做的～",
    tone: "warm" as ReplyTone,
  },
  {
    id: 6,
    label: "⭐ 美发好评",
    reviewer: "刘女士",
    rating: 5,
    content: "终于找到靠谱的理发师了！这次烫的卷度刚刚好，不像以前烫完像大妈。男朋友也说好看，以后就认准这家了！",
    tone: "revisit" as ReplyTone,
  },
];

const MAX_FREE_PER_DAY = 3;

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function loadUsage(): { count: number; date: string } {
  if (typeof window === "undefined") return { count: 0, date: getToday() };
  const date = localStorage.getItem("kb_review_date");
  const count = localStorage.getItem("kb_review_count");
  if (date === getToday() && count) {
    return { count: parseInt(count, 10), date };
  }
  return { count: 0, date: getToday() };
}

function saveUsage(count: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem("kb_review_date", getToday());
  localStorage.setItem("kb_review_count", String(count));
}

function loadVerifiedPhone(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("kb_verified_phone");
}

function saveVerifiedPhone(phone: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("kb_verified_phone", phone);
}

export default function DemoPage() {
  // Form state
  const [reviewContent, setReviewContent] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(1);
  const [tone, setTone] = useState<ReplyTone>("apologetic");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState<number | null>(null);

  // Usage state
  const [usage, setUsage] = useState({ count: 0, date: getToday() });
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);
  const remaining = verifiedPhone ? Infinity : Math.max(0, MAX_FREE_PER_DAY - usage.count);
  const isLimitReached = !verifiedPhone && usage.count >= MAX_FREE_PER_DAY;

  // Payment modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payPhone, setPayPhone] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  // Init
  useEffect(() => {
    const u = loadUsage();
    setUsage(u);
    const phone = loadVerifiedPhone();
    if (phone) setVerifiedPhone(phone);
  }, []);

  // Auto-select tone based on rating
  const isPositive = rating >= 4;
  const activeTones = isPositive ? TONE_GROUPS.positive : TONE_GROUPS.negative;

  const handlePresetClick = (preset: (typeof PRESET_EXAMPLES)[0]) => {
    setReviewContent(preset.content);
    setReviewerName(preset.reviewer);
    setRating(preset.rating);
    setTone(preset.tone);
    setActivePreset(preset.id);
    setReply("");
    setError("");
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    setActivePreset(null);
    // Auto-switch tone when rating changes between positive/negative
    const wasPositive = rating >= 4;
    const nowPositive = newRating >= 4;
    if (wasPositive !== nowPositive) {
      setTone(nowPositive ? "enthusiastic" : "apologetic");
    }
  };

  const handleGenerate = async () => {
    if (!reviewContent.trim()) {
      setError("请先选择示例或粘贴一条评价");
      return;
    }
    if (!reviewerName.trim()) {
      setError("请填写顾客名称");
      return;
    }

    if (isLimitReached && !verifiedPhone) {
      setShowPaymentModal(true);
      return;
    }

    setLoading(true);
    setError("");
    setReply("");

    try {
      const res = await fetch("/api/public/demo-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewContent,
          rating,
          reviewerName,
          tone,
          phone: verifiedPhone || undefined,
        }),
      });
      const data = await res.json();

      if (data.error) {
        if (data.limitReached) {
          setShowPaymentModal(true);
          setError(data.error);
        } else {
          setError(data.error);
        }
      } else {
        setReply(data.reply);
        if (!verifiedPhone) {
          const newCount = usage.count + 1;
          setUsage({ count: newCount, date: getToday() });
          saveUsage(newCount);
        }
      }
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (!payPhone || !/^1[3-9]\d{9}$/.test(payPhone)) {
      setVerifyError("请输入正确的11位手机号");
      return;
    }
    setVerifying(true);
    setVerifyError("");

    try {
      const res = await fetch("/api/public/verify-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: payPhone }),
      });
      const data = await res.json();

      if (data.verified) {
        setVerifiedPhone(payPhone);
        saveVerifiedPhone(payPhone);
        setShowPaymentModal(false);
        setPayPhone("");
        setError("");
        setTimeout(() => handleGenerate(), 300);
      } else {
        setVerifyError(data.error || "验证失败，请确认已付款并联系客服开通");
      }
    } catch {
      setVerifyError("网络错误，请稍后重试");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF9]">
      {/* Header */}
      <header className="border-b border-[#F0E4E0] bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-[#D4725A] font-bold text-lg">
            ← 口碑助手
          </Link>
          <div className="flex items-center gap-3">
            {verifiedPhone ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium border border-green-200">
                <Check className="w-3 h-3" /> 已解锁无限使用
              </span>
            ) : (
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
                remaining <= 1
                  ? "bg-red-50 text-red-500 border-red-200"
                  : "bg-[#D4725A]/10 text-[#D4725A] border-[#D4725A]/20"
              }`}>
                今日剩余 <strong className="mx-0.5">{remaining}</strong> 次
              </span>
            )}
            {!verifiedPhone && (
              <Button
                size="sm"
                className="bg-gradient-to-r from-[#D4725A] to-[#C05A42] text-white"
                onClick={() => setShowPaymentModal(true)}
              >
                ¥99 解锁 <ArrowRight className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Hero */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4725A]/10 text-[#D4725A] text-sm font-medium mb-4 border border-[#D4725A]/20">
            <Zap className="w-4 h-4" /> 免注册 · 直接试 · 每天免费 {MAX_FREE_PER_DAY} 次
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#3D2220]">
            粘贴评价，看 AI 怎么回 👇
          </h1>
          <p className="mt-3 text-[#8B6B65] text-lg">
            不管好评差评，选一条试试——不用注册、不用登录
          </p>
        </div>

        {/* Preset Examples */}
        <div>
          <p className="text-sm font-semibold text-[#8B6B65] mb-3 uppercase tracking-wide">
            📌 试试这些真实案例（点一下就填好）
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {PRESET_EXAMPLES.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetClick(preset)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  activePreset === preset.id
                    ? "border-[#D4725A] bg-[#FDF0EB] ring-1 ring-[#D4725A]/20"
                    : "border-[#F0E4E0] bg-white hover:border-[#E8D5CE]"
                }`}
              >
                <p className="font-semibold text-[#3D2220] text-sm">{preset.label}</p>
                <p className="text-xs text-[#8B6B65] mt-1 line-clamp-2">
                  {preset.content.slice(0, 60)}...
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Demo Area */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* INPUT */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#F0E4E0] p-5 space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#D4725A]" />
                <h3 className="font-bold text-[#3D2220]">
                  {isPositive ? "好评内容" : "评价内容"}
                </h3>
              </div>

              <textarea
                value={reviewContent}
                onChange={(e) => { setReviewContent(e.target.value); setActivePreset(null); }}
                placeholder={isPositive
                  ? "把大众点评/美团上的好评粘贴到这里..."
                  : "把大众点评/美团上的差评粘贴到这里..."
                }
                className="w-full h-32 rounded-xl border border-[#F0E4E0] p-4 text-sm text-[#3D2220] placeholder-[#B8A09A] focus:outline-none focus:ring-2 focus:ring-[#D4725A]/30 focus:border-[#D4725A] resize-none bg-[#FFFBF9]"
              />

              {/* Rating + Customer Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#8B6B65] mb-1 block">顾客名</label>
                  <input
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="张女士"
                    className="w-full h-9 rounded-lg border border-[#F0E4E0] px-3 text-sm text-[#3D2220] focus:outline-none focus:ring-2 focus:ring-[#D4725A]/30 bg-[#FFFBF9]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8B6B65] mb-1 block">
                    评分 · {rating === 5 ? "好评" : rating >= 4 ? "好评" : rating === 3 ? "中评" : "差评"}
                  </label>
                  <div className="flex gap-0.5 h-9 items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingChange(star)}
                        className={`text-lg px-0.5 transition-all ${
                          star <= rating
                            ? "text-amber-400 scale-110"
                            : "text-gray-300 hover:text-amber-300"
                        }`}
                        title={`${star}星`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tone Buttons */}
              <div>
                <label className="text-xs text-[#8B6B65] mb-2 block">
                  {isPositive ? "回复风格（好评）" : "回复风格（差评/中评）"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {activeTones.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTone(t.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        tone === t.value
                          ? isPositive
                            ? "border-green-400 bg-green-50 text-green-700 shadow-sm"
                            : "border-[#D4725A] bg-[#FDF0EB] text-[#D4725A] shadow-sm"
                          : "border-[#F0E4E0] bg-white text-[#8B6B65] hover:border-[#E8D5CE] hover:text-[#3D2220]"
                      }`}
                    >
                      {t.emoji} {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#D4725A] to-[#C05A42] text-white shadow-md shadow-[#D4725A]/20 hover:shadow-lg"
                size="lg"
              >
                {loading ? (
                  <>生成中...</>
                ) : isLimitReached ? (
                  <>
                    <Zap className="w-5 h-5" /> 今日3次已用完，¥99 解锁无限使用
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" /> 生成 AI 回复（10 秒）
                  </>
                )}
              </Button>

              {isLimitReached && !verifiedPhone && (
                <div className="text-center p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm text-amber-700 font-medium">
                    ⚡ 今日免费 {MAX_FREE_PER_DAY} 次已用完
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    ¥99/月 无限使用 · 不满意退
                  </p>
                </div>
              )}

              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg p-3">{error}</p>
              )}
            </div>
          </div>

          {/* OUTPUT */}
          <div>
            <div className={`rounded-2xl border p-5 min-h-[300px] flex flex-col ${
              reply
                ? "border-green-200 bg-gradient-to-br from-green-50/50 to-white"
                : "border-[#F0E4E0] bg-white"
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className={`w-5 h-5 ${reply ? "text-green-500" : "text-[#D4725A]"}`} />
                <h3 className="font-bold text-[#3D2220]">
                  {reply ? "✨ AI 生成的回复" : "AI 回复将出现在这里"}
                </h3>
              </div>

              {reply ? (
                <>
                  <div className="flex-1 text-[#3D2220] leading-relaxed text-sm whitespace-pre-wrap">
                    {reply}
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-green-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-200 text-green-600 hover:bg-green-50"
                      onClick={() => {
                        navigator.clipboard.writeText(reply);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                    >
                      {copied ? (
                        <><Check className="w-4 h-4" /> 已复制</>
                      ) : (
                        <><Copy className="w-4 h-4" /> 复制回复</>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#F0E4E0] text-[#8B6B65] hover:bg-[#FDF0EB]"
                      onClick={handleGenerate}
                      disabled={loading}
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> 换种风格
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-[#B8A09A] text-sm">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#D4725A]/20 border-t-[#D4725A] rounded-full animate-spin" />
                      AI 正在生成...
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-3xl mb-2">👆</p>
                      <p>左边选一条评价，或粘贴你自己的</p>
                      <p className="text-xs mt-1">选好回复风格，点"生成 AI 回复"看效果</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CTA */}
            {reply && !verifiedPhone && (
              <div className="mt-4 text-center">
                <p className="text-sm text-[#8B6B65] mb-3">
                  觉得有用？¥99/月 或 ¥299/年 👇
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#D4725A] to-[#C05A42] text-white shadow-md"
                  onClick={() => setShowPaymentModal(true)}
                >
                  ¥99/月 或 ¥299/年 <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-in">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-[#B8A09A] hover:text-[#3D2220]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold mb-3">
                ⚡ 今日免费 {MAX_FREE_PER_DAY} 次已用完
              </span>
              <h2 className="text-2xl font-bold text-[#3D2220] mb-2">
                开通无限使用
              </h2>
              {/* Plan selector */}
              <div className="flex gap-2 justify-center mb-3">
                <span className="px-3 py-1.5 rounded-full bg-[#D4725A] text-white text-xs font-bold">
                  ¥99/月
                </span>
                <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs">
                  ¥299/年 · 省¥889
                </span>
              </div>
              <p className="text-[#8B6B65] text-sm">无限次 AI 回复 · 不满意退</p>
            </div>

            <div className="flex justify-center mb-4">
              <img
                src="/qrcode.jpg"
                alt="微信收款码"
                className="w-48 h-auto rounded-2xl border-2 border-[#F0E4E0] shadow-sm"
              />
            </div>

            <p className="text-center text-xs text-[#8B6B65] mb-6">
              📱 微信扫一扫付款 · 备注手机号
            </p>

            <div className="border-t border-[#F0E4E0] pt-4 space-y-3">
              <p className="text-sm font-semibold text-[#3D2220] text-center">
                付款后，输入手机号验证开通 👇
              </p>
              <input
                type="tel"
                value={payPhone}
                onChange={(e) => { setPayPhone(e.target.value); setVerifyError(""); }}
                placeholder="输入你的手机号"
                maxLength={11}
                className="w-full h-11 rounded-xl border border-[#F0E4E0] px-4 text-sm text-[#3D2220] text-center placeholder-[#B8A09A] focus:outline-none focus:ring-2 focus:ring-[#D4725A]/30 focus:border-[#D4725A]"
              />
              {verifyError && (
                <p className="text-xs text-red-500 text-center">{verifyError}</p>
              )}
              <Button
                onClick={handleVerifyPhone}
                disabled={verifying}
                className="w-full bg-gradient-to-r from-[#07C160] to-[#06AD56] text-white shadow-md hover:shadow-lg"
                size="lg"
              >
                {verifying ? "验证中..." : "验证开通"}
              </Button>
              <p className="text-xs text-[#B8A09A] text-center">
                付款后如验证失败，请联系客服微信开通
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
