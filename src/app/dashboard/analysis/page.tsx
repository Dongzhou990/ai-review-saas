"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Loader2,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const CATEGORY_COLORS = ["#ef4444", "#f97316", "#eab308", "#3b82f6", "#8b5cf6"];

export default function AnalysisPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      try {
        const res = await fetch("/api/ai/analyze-reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const result = await res.json();
        if (!res.ok) { setError(result.error || "加载失败"); } else { setData(result); }
      } catch { setError("网络错误"); }
      setLoading(false);
    })();
  }, [supabase]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  if (!data || data.totalReviews === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <BarChart3 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold mb-2">暂无评论数据</h2>
        <p className="text-gray-500 mb-4">导入评论后即可查看差评分析，AI 会帮你找出门店问题所在。</p>
        <a href="/dashboard/reviews">
          <Button variant="primary">去导入评论</Button>
        </a>
      </div>
    );
  }

  const maxCount = Math.max(...(data.categories || []).map((c: any) => c.count), 1);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold">{data.totalReviews}</p><p className="text-sm text-gray-500">总评论数</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-red-600">{data.badReviewCount}</p><p className="text-sm text-gray-500">差评数</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-amber-600">{data.badReviewRate}%</p><p className="text-sm text-gray-500">差评率</p></CardContent></Card>
      </div>

      {/* Summary */}
      {data.summary && (
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-sm mb-1">AI 概况分析</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{data.summary}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories */}
      {data.categories && data.categories.length > 0 && (
        <Card>
          <CardHeader><CardTitle>差评集中在哪</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {data.categories.map((cat: any, i: number) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{cat.name}</span>
                  <span className="text-sm text-gray-500">{cat.count} 条 ({cat.percentage}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(cat.count / maxCount) * 100}%`, backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Suggestions */}
      {data.suggestions && data.suggestions.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Lightbulb className="w-5 h-5 text-yellow-500" />改进建议</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {data.suggestions.map((s: string, i: number) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">{i + 1}</span>
                <p className="text-sm text-gray-700 dark:text-gray-300">{s}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Upgrade CTA */}
      {data.badReviewCount > 0 && (
        <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800">
          <p className="font-bold text-lg mb-2">想让 AI 24 小时帮你盯口碑？</p>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">Pro 版 ¥99/月，无限回复 + 差评分析 + 好评邀约</p>
          <a href="/#pricing">
            <Button variant="primary">升级 Pro</Button>
          </a>
        </div>
      )}
    </div>
  );
}
