"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const REPLY_STYLES = [
  { value: "professional", label: "诚恳道歉", desc: "先道歉+承诺改进，适合服务类门店" },
  { value: "friendly", label: "真诚安抚", desc: "温和回应，拉近关系" },
  { value: "apologetic", label: "私下沟通", desc: "引导私聊解决，适合金额较大的投诉" },
];

export default function ReviewsPage() {
  const supabase = createClient();
  const [reviewContent, setReviewContent] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("professional");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);

  const checkQuota = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: sub } = await supabase.from("subscriptions").select("plan, daily_reply_limit").eq("user_id", user.id).single();
    if (!sub) return;
    const dailyLimit = typeof sub.daily_reply_limit === "number" ? sub.daily_reply_limit : sub.plan === "pro" ? Infinity : 3;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const { count } = await supabase.from("replies").select("*", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", today.toISOString());
    setRemaining(Math.max(0, dailyLimit - (count || 0)));
  }, [supabase]);

  useEffect(() => { checkQuota(); }, []);

  const handleGenerate = async () => {
    if (!reviewContent.trim()) return;
    setGenerating(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/ai/generate-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          reviewContent: reviewContent,
          rating: 3,
          reviewerName: "顾客",
          tone: selectedStyle,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          setError("今日免费次数已用完。升级 Pro 后可无限使用。");
        } else if (res.status === 401) {
          setError("请先登录");
        } else {
          setError(data.error || "生成失败，请重试");
        }
        setGenerating(false);
        return;
      }

      setResult(data.reply);
      checkQuota();
    } catch {
      setError("网络错误，请检查连接后重试");
    }
    setGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Remaining Quota */}
      <div className="flex items-center justify-between text-sm text-neutral-400">
        <span>
          今日剩余：
          <strong className="text-blue-600">{remaining !== null ? remaining : "..."}</strong>
          条
        </span>
        {remaining === 0 && (
          <a href="/#pricing" className="text-blue-600 font-medium hover:underline">
            升级 Pro 无限用 →
          </a>
        )}
      </div>

      {/* Main Input */}
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-1">粘贴差评，AI 帮你回</h2>
        <p className="text-sm text-neutral-400 mb-4">
          从美团、大众点评、携程复制顾客差评，粘贴到下面。AI 会根据内容生成回复，不是套模板。
        </p>

        <textarea
          className="w-full h-40 p-4 rounded-xl border border-neutral-700 bg-neutral-900 text-base resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder={`例如：\n房间有异味，前台服务态度很差，等了半小时才办完入住。不会再来了。`}
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
        />

        {/* Style Selector */}
        <div className="flex items-center gap-3 mt-4 flex-wrap">
          <span className="text-sm text-neutral-400">回复风格：</span>
          {REPLY_STYLES.map((s) => (
            <button
              key={s.value}
              onClick={() => setSelectedStyle(s.value)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                selectedStyle === s.value
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              }`}
              title={s.desc}
            >
              {s.label}
            </button>
          ))}
        </div>

        <Button
          variant="primary"
          size="xl"
          className="w-full mt-6"
          onClick={handleGenerate}
          disabled={!reviewContent.trim() || generating || remaining === 0}
        >
          {generating ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> AI 生成中...</>
          ) : remaining === 0 ? (
            "今日次数已用完"
          ) : (
            <><Sparkles className="w-5 h-5" /> 生成回复</>
          )}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-neutral-900 rounded-2xl border border-green-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              AI 生成的回复
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => { setReviewContent(""); setResult(""); }}>
                重新生成
              </Button>
              <Button variant="primary" size="sm" onClick={handleCopy}>
                {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
              </Button>
            </div>
          </div>
          <div className="p-4 bg-neutral-900 rounded-xl text-base leading-relaxed whitespace-pre-wrap text-white">
            {result}
          </div>
          <p className="text-xs text-neutral-500 mt-3">
            💡 复制后粘贴到美团/大众点评的回复框发布
          </p>
        </div>
      )}

      {/* Upgrade CTA */}
      {remaining !== null && remaining <= 1 && remaining > 0 && (
        <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
          <p className="font-bold text-lg mb-2">每天 3 条不够用？</p>
          <p className="text-neutral-300 mb-4 text-sm">Pro 版 ¥99/月，无限次数 + 差评分析 + 好评邀约</p>
          <a href="/#pricing">
            <Button variant="primary">升级 Pro · ¥99/月</Button>
          </a>
        </div>
      )}

      {/* Welcome / Empty state */}
      {!result && !generating && !reviewContent && (
        <div className="text-center py-10 bg-gradient-to-b from-blue-50 to-white rounded-2xl border border-blue-100">
          <div className="text-5xl mb-4">👋</div>
          <p className="text-xl font-bold text-white mb-2">欢迎使用口碑助手</p>
          <p className="text-neutral-400 mb-6 max-w-md mx-auto">
            第一步：从美团、大众点评、携程复制一条差评/好评，粘贴到上面的输入框，点击生成。
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-neutral-500">
            <div className="text-center">
              <div className="text-2xl mb-1">1️⃣</div>
              <p>复制差评</p>
            </div>
            <div className="text-gray-300 text-2xl">→</div>
            <div className="text-center">
              <div className="text-2xl mb-1">2️⃣</div>
              <p>粘贴进来</p>
            </div>
            <div className="text-gray-300 text-2xl">→</div>
            <div className="text-center">
              <div className="text-2xl mb-1">3️⃣</div>
              <p>选风格生成</p>
            </div>
            <div className="text-gray-300 text-2xl">→</div>
            <div className="text-center">
              <div className="text-2xl mb-1">4️⃣</div>
              <p>复制发布</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
