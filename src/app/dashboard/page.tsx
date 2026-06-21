"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare, ThumbsUp, AlertTriangle, TrendingUp, BarChart3, Sparkles, ClipboardList, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const STAT_CARDS = [
  { key: "totalReviews", label: "总评论数", icon: MessageSquare, color: "text-cyan-400", bg: "from-cyan-500/10 to-cyan-500/5", border: "border-cyan-500/20" },
  { key: "goodReviews", label: "好评数", icon: ThumbsUp, color: "text-emerald-400", bg: "from-emerald-500/10 to-emerald-500/5", border: "border-emerald-500/20" },
  { key: "pendingBad", label: "待处理差评", icon: AlertTriangle, color: "text-rose-400", bg: "from-rose-500/10 to-rose-500/5", border: "border-rose-500/20" },
  { key: "remaining", label: "今日剩余", icon: Zap, color: "text-violet-400", bg: "from-violet-500/10 to-violet-500/5", border: "border-violet-500/20" },
];

const QUICK_ACTIONS = [
  { href: "/dashboard/reviews", label: "差评处理", desc: "粘贴差评 → AI 秒回", icon: MessageSquare, color: "bg-cyan-500/10 text-cyan-400", border: "border-cyan-500/20 hover:border-cyan-500/40" },
  { href: "/dashboard/analysis", label: "差评分析", desc: "看懂客人在抱怨什么", icon: BarChart3, color: "bg-violet-500/10 text-violet-400", border: "border-violet-500/20 hover:border-violet-500/40" },
  { href: "/dashboard/invite", label: "好评邀约", desc: "生成微信邀评文案", icon: ThumbsUp, color: "bg-emerald-500/10 text-emerald-400", border: "border-emerald-500/20 hover:border-emerald-500/40" },
  { href: "/dashboard/weekly", label: "每周周报", desc: "口碑回顾 + 改进建议", icon: ClipboardList, color: "bg-amber-500/10 text-amber-400", border: "border-amber-500/20 hover:border-amber-500/40" },
];

export default function DashboardPage() {
  const supabase = createClient();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { count: totalReviews } = await supabase.from("reviews").select("*", { count: "exact", head: true }).eq("user_id", user.id);
      const { count: pendingBad } = await supabase.from("reviews").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "pending").lte("rating", 2);
      const { count: goodReviews } = await supabase.from("reviews").select("*", { count: "exact", head: true }).eq("user_id", user.id).gte("rating", 4);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const { count: todayReplies } = await supabase.from("replies").select("*", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", today.toISOString());
      const { data: sub } = await supabase.from("subscriptions").select("plan, daily_reply_limit").eq("user_id", user.id).single();
      const remaining = sub ? Math.max(0, (sub.daily_reply_limit || (sub.plan === "pro" ? 999 : 3)) - (todayReplies || 0)) : 0;
      const isPro = sub?.plan === "pro";

      setStats({ totalReviews: totalReviews || 0, pendingBad: pendingBad || 0, goodReviews: goodReviews || 0, todayReplies: todayReplies || 0, remaining, isPro, hasData: (totalReviews || 0) > 0 });
      setLoading(false);
    })();
  }, [supabase]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>;
  }

  const statValues: Record<string, number> = {
    totalReviews: stats.totalReviews,
    goodReviews: stats.goodReviews,
    pendingBad: stats.pendingBad,
    remaining: stats.isPro ? 999 : stats.remaining,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">门店口碑总览</h1>
          <p className="text-neutral-400 text-sm mt-1">
            {stats.hasData ? "门店近期口碑一目了然" : "还没有数据，先去处理一条差评吧"}
          </p>
        </div>
        {stats.isPro && (
          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
            ⚡ Pro
          </span>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => (
          <div key={card.key} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.bg} border ${card.border} p-5`}>
            <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-10" style={{ background: `radial-gradient(circle, currentColor, transparent)` }} />
            <div className="relative">
              <card.icon className={`w-5 h-5 ${card.color} mb-3`} />
              <p className="text-3xl font-bold text-white">{statValues[card.key]}</p>
              <p className="text-xs text-neutral-400 mt-1">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-medium text-neutral-500 mb-4 uppercase tracking-wider">快捷操作</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.href} href={action.href}>
              <div className={`rounded-2xl border ${action.border} p-5 transition-all duration-200 cursor-pointer bg-neutral-900/50`}>
                <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center mb-3`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <p className="font-semibold text-white text-sm">{action.label}</p>
                <p className="text-xs text-neutral-500 mt-1">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Weekly Report Teaser */}
      {stats.hasData && (
        <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-500/20 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-2xl">📊</div>
              <div>
                <p className="font-bold text-white">每周口碑周报</p>
                <p className="text-sm text-neutral-400 mt-0.5">AI 自动分析本周评论，告诉你问题在哪、该改什么</p>
              </div>
            </div>
            <Link href="/dashboard/weekly">
              <Button variant="primary" size="sm">查看周报 →</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Upgrade */}
      {!stats.isPro && (
        <div className="rounded-2xl bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-purple-500/10 border border-indigo-500/20 p-8 text-center">
          <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
          <p className="text-xl font-bold text-white mb-2">每天 3 条不够用？</p>
          <p className="text-neutral-400 mb-6 text-sm">Pro 版 ¥99/月，无限次数 + 差评分析 + 好评邀约 + 每周周报</p>
          <Link href="/#pricing">
            <Button variant="primary" size="lg">升级 Pro · ¥99/月</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
