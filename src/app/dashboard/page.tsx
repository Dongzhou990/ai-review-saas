"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Star,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { createClient } from "@/lib/supabase/client";

interface Stats {
  todayReviews: number;
  avgRating: number;
  replyRate: number;
  pendingBad: number;
}

export default function DashboardPage() {
  const supabase = createClient();
  const [stats, setStats] = useState<Stats | null>(null);
  const [trend, setTrend] = useState<{ date: string; rating: number }[]>([]);
  const [sentiment, setSentiment] = useState<
    { name: string; value: number; color: string }[]
  >([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    // Stats
    const { count: todayCount } = await supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", todayStart.toISOString());

    const { data: allReviews } = await supabase
      .from("reviews")
      .select("rating, status")
      .eq("user_id", user.id);

    const { data: todayReplies } = await supabase
      .from("replies")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", todayStart.toISOString());

    if (allReviews) {
      const avg =
        allReviews.length > 0
          ? allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
          : 0;
      const replied = allReviews.filter((r) => r.status === "replied").length;
      const bad = allReviews.filter(
        (r) => r.rating <= 2 && r.status === "pending"
      ).length;

      setStats({
        todayReviews: todayCount || 0,
        avgRating: Math.round(avg * 10) / 10,
        replyRate:
          allReviews.length > 0
            ? Math.round((replied / allReviews.length) * 100)
            : 0,
        pendingBad: bad,
      });

      // Sentiment
      const good = allReviews.filter((r) => r.rating >= 4).length;
      const mid = allReviews.filter((r) => r.rating === 3).length;
      const badCount = allReviews.filter((r) => r.rating <= 2).length;
      setSentiment([
        { name: "好评", value: good, color: "#22c55e" },
        { name: "中评", value: mid, color: "#eab308" },
        { name: "差评", value: badCount, color: "#ef4444" },
      ]);
    }

    // Trend (last 7 days)
    const trendData: { date: string; rating: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayStart = new Date(d.setHours(0, 0, 0, 0));
      const dayEnd = new Date(d.setHours(23, 59, 59, 999));

      const { data: dayReviews } = await supabase
        .from("reviews")
        .select("rating")
        .eq("user_id", user.id)
        .gte("created_at", dayStart.toISOString())
        .lte("created_at", dayEnd.toISOString());

      trendData.push({
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        rating:
          dayReviews && dayReviews.length > 0
            ? Math.round(
                (dayReviews.reduce((s, r) => s + r.rating, 0) /
                  dayReviews.length) *
                  10
              ) / 10
            : 0,
      });
    }
    setTrend(trendData);

    // Recent reviews
    const { data: recent } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (recent) {
      const ids = recent.map((r) => r.id);
      const { data: replies } = await supabase
        .from("replies")
        .select("*")
        .in("review_id", ids)
        .eq("user_id", user.id);

      setRecentReviews(
        recent.map((r) => ({
          ...r,
          reply: replies?.find((rp) => rp.review_id === r.id),
        }))
      );
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const statCards = stats
    ? [
        {
          label: "今日新评论",
          value: stats.todayReviews,
          change: "",
          trend: "up" as const,
          icon: MessageSquare,
        },
        {
          label: "平均评分",
          value: stats.avgRating || "--",
          change: "",
          trend: "up" as const,
          icon: Star,
        },
        {
          label: "回复率",
          value: `${stats.replyRate}%`,
          change: "",
          trend: "up" as const,
          icon: CheckCircle,
        },
        {
          label: "待处理差评",
          value: stats.pendingBad,
          change: "",
          trend: stats.pendingBad > 0 ? ("down" as const) : ("up" as const),
          icon: AlertTriangle,
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    stat.trend === "up"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-red-100 dark:bg-red-900/30"
                  }`}
                >
                  <stat.icon
                    className={`w-5 h-5 ${
                      stat.trend === "up"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>评分趋势（近 7 天）</CardTitle>
          </CardHeader>
          <CardContent>
            {trend.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis domain={[0, 5]} stroke="#9ca3af" fontSize={12} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke="url(#gradient)"
                    strokeWidth={2}
                    dot={{ fill: "#6366f1", r: 4 }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#9333ea" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center py-10 text-gray-400">暂无数据</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>评论情感分布</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {sentiment.some((s) => s.value > 0) ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={sentiment}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sentiment.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2 ml-4">
                  {sentiment.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.name} {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center py-10 text-gray-400">暂无数据</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>最新评论</CardTitle>
        </CardHeader>
        <CardContent>
          {recentReviews.length === 0 ? (
            <p className="text-center py-8 text-gray-400">
              还没有评论，去连接店铺吧
            </p>
          ) : (
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <div
                  key={review.id}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                    {review.buyer_name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {review.buyer_name}
                      </span>
                      <span className="text-yellow-500 text-sm">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </span>
                      <Badge
                        variant={review.reply ? "success" : "warning"}
                        className="text-xs"
                      >
                        {review.reply ? "已回复" : "待回复"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                      {review.content}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span>{review.product_name}</span>
                      <span>
                        {new Date(review.created_at).toLocaleDateString(
                          "zh-CN"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
