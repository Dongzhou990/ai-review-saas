"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function DashboardPage() {
  const supabase = createClient();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { count: t } = await supabase.from("reviews").select("*", { count: "exact", head: true }).eq("user_id", user.id);
      const { count: b } = await supabase.from("reviews").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "pending").lte("rating", 2);
      const { count: g } = await supabase.from("reviews").select("*", { count: "exact", head: true }).eq("user_id", user.id).gte("rating", 4);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const { count: r } = await supabase.from("replies").select("*", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", today.toISOString());
      const { data: sub } = await supabase.from("subscriptions").select("plan, daily_reply_limit").eq("user_id", user.id).single();
      const rem = sub ? Math.max(0, (sub.daily_reply_limit || (sub.plan === "pro" ? 999 : 3)) - (r || 0)) : 0;
      setStats({ total: t || 0, bad: b || 0, good: g || 0, replies: r || 0, remaining: rem, isPro: sub?.plan === "pro", empty: !t });
      setLoading(false);
    })();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-sm text-neutral-500">加载中...</span>
        </div>
      </div>
    );
  }

  const metrics = [
    { value: stats.total, label: "总评论", sub: "条", gradient: "from-blue-500 to-cyan-400", glow: "shadow-blue-500/20" },
    { value: stats.good, label: "好评", sub: "条", gradient: "from-emerald-500 to-green-400", glow: "shadow-emerald-500/20" },
    { value: stats.bad, label: "待处理差评", sub: "条", gradient: "from-rose-500 to-red-400", glow: "shadow-rose-500/20" },
    { value: stats.isPro ? "∞" : stats.remaining, label: "今日剩余", sub: stats.isPro ? "无限" : "次", gradient: "from-violet-500 to-purple-400", glow: "shadow-violet-500/20" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-violet-500/10 to-transparent rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">门店口碑总览</h1>
              <p className="text-sm text-neutral-400">
                {stats.empty ? "导入第一条评论，开启口碑管理" : "一眼看清门店口碑全貌"}
              </p>
            </div>
          </div>

          {/* Stat pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {metrics.map((m) => (
              <div key={m.label} className={`relative overflow-hidden rounded-2xl bg-black/40 border border-white/5 p-4 ${m.glow} transition-all hover:scale-[1.02]`}>
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${m.gradient} opacity-10 rounded-bl-full`} />
                <p className={`text-3xl font-black bg-gradient-to-r ${m.gradient} bg-clip-text text-transparent`}>{m.value}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xs text-neutral-400">{m.label}</span>
                  <span className="text-[10px] text-neutral-600">{m.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-[0.2em]">快捷操作</h2>
          {stats.isPro && (
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">Pro</span>
          )}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { to: "/dashboard/reviews", icon: "💬", label: "差评处理", desc: "粘贴差评，AI 秒回", color: "bg-cyan-500/10 border-cyan-500/20 hover:border-cyan-500/40 text-cyan-400" },
            { to: "/dashboard/analysis", icon: "📊", label: "差评分析", desc: "看懂问题在哪", color: "bg-violet-500/10 border-violet-500/20 hover:border-violet-500/40 text-violet-400" },
            { to: "/dashboard/invite", icon: "✨", label: "好评邀约", desc: "生成邀评文案", color: "bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400" },
            { to: "/dashboard/weekly", icon: "📋", label: "每周周报", desc: "口碑回顾与建议", color: "bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40 text-amber-400" },
          ].map((a) => (
            <Link key={a.to} href={a.to}>
              <div className={`group rounded-2xl border ${a.color} p-5 transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-black/40`}>
                <div className="text-2xl mb-3">{a.icon}</div>
                <p className="font-semibold text-white text-sm group-hover:text-white/90">{a.label}</p>
                <p className="text-xs text-neutral-500 mt-1">{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Weekly Teaser ── */}
      {!stats.empty && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-amber-500/5 border border-amber-500/10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-3xl">📋</span>
              <div>
                <p className="font-semibold text-white">每周口碑周报</p>
                <p className="text-sm text-neutral-400">AI 总结本周问题，告诉你该改什么</p>
              </div>
            </div>
            <Link href="/dashboard/weekly" className="shrink-0 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 text-sm font-medium hover:bg-amber-500/30 transition-colors">
              查看 →
            </Link>
          </div>
        </div>
      )}

      {/* ── Upgrade Card ── */}
      {!stats.isPro && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-purple-500/5 border border-indigo-500/10 p-8 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-indigo-500/10 to-transparent rounded-full blur-3xl" />
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">解锁全部功能</h3>
            <p className="text-neutral-400 mb-6 max-w-md mx-auto text-sm leading-relaxed">
              无限 AI 回复 · 差评深度分析 · 好评邀约 · 每周周报<br />
              <span className="text-white font-semibold">¥99/月</span>，帮你的门店口碑升级
            </p>
            <Link href="/#pricing" className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all">
              升级 Pro
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
