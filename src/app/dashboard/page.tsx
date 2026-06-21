"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, AlertTriangle, ThumbsUp, MessageSquare, TrendingUp } from "lucide-react";
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
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Welcome / Status */}
      <div>
        <h1 className="text-2xl font-bold mb-1">门店口碑总览</h1>
        <p className="text-neutral-400 text-sm">
          {stats.hasData
            ? "以下是你门店近期的口碑情况"
            : "还没有评论数据，去处理一条差评试试"}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <MessageSquare className="w-4 h-4 text-neutral-500" />
            </div>
            <p className="text-3xl font-bold">{stats.totalReviews}</p>
            <p className="text-xs text-neutral-400">总评论数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <ThumbsUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.goodReviews}</p>
            <p className="text-xs text-neutral-400">好评数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-red-600">{stats.pendingBad}</p>
            <p className="text-xs text-neutral-400">待处理的差评</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.remaining}</p>
            <p className="text-xs text-neutral-400">{stats.isPro ? "无限（Pro）" : "今日剩余回复"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/reviews">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">差评处理</span>
              </div>
              <p className="text-sm text-neutral-400">粘贴差评 → AI 生成回复 → 复制发布</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/analysis">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="font-semibold">差评分析</span>
              </div>
              <p className="text-sm text-neutral-400">看看客人在抱怨什么，该改什么</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/invite">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <ThumbsUp className="w-5 h-5 text-green-600" />
                <span className="font-semibold">好评邀约</span>
              </div>
              <p className="text-sm text-neutral-400">生成发给客人的邀评文案</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/weekly">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                <span className="font-semibold">每周周报</span>
              </div>
              <p className="text-sm text-neutral-400">本周口碑回顾 + 改进建议</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Weekly report teaser */}
      {stats.hasData && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-lg">📊 每周口碑周报</p>
              <p className="text-sm text-neutral-300 mt-1">AI 自动分析本周评论，告诉你问题在哪、该改什么</p>
            </div>
            <a href="/dashboard/weekly">
              <button className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition-colors">
                查看周报 →
              </button>
            </a>
          </div>
        </div>
      )}

      {/* Upgrade CTA */}
      {!stats.isPro && (
        <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
          <p className="font-bold text-lg mb-2">每天 3 条不够用？</p>
          <p className="text-neutral-300 mb-4 text-sm">Pro 版 ¥99/月，无限次数 + 差评分析 + 好评邀约 + 每周周报</p>
          <a href="/#pricing">
            <Button variant="primary">升级 Pro · ¥99/月</Button>
          </a>
        </div>
      )}
    </div>
  );
}
