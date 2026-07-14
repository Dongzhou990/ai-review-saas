"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle, MessageSquare, ThumbsUp, Trash2, Radio,
  Bell, RefreshCw, ExternalLink, Star, Filter, Clock,
  ShieldAlert, HelpCircle, CheckCircle2,
} from "lucide-react";

interface MonitorItem {
  id: number;
  platform: string;
  content: string;
  rating: number;
  type: string;
  priority: string;
  author: string;
  time: string;
  url: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  "大众点评": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "美团": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  "小红书": "bg-red-500/10 text-red-400 border-red-500/20",
  "抖音": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

const TYPE_CONFIG = {
  "差评": { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10", label: "差评预警" },
  "咨询": { icon: HelpCircle, color: "text-blue-400", bg: "bg-blue-500/10", label: "客户咨询" },
  "好评": { icon: ThumbsUp, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "好评" },
  "垃圾": { icon: Trash2, color: "text-neutral-500", bg: "bg-neutral-500/10", label: "垃圾信息" },
};

export default function MonitorPage() {
  const [items, setItems] = useState<MonitorItem[]>([]);
  const [stats, setStats] = useState<any>({});
  const [filter, setFilter] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ filter, platform, limit: "20" });
    const res = await fetch(`/api/monitor?${params}`);
    if (res.ok) {
      const data = await res.json();
      setItems(data.items || []);
      setStats(data.stats || {});
    }
    setLoading(false);
  }, [filter, platform]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // 自动刷新
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  const starRating = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`w-3 h-3 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-neutral-600"}`} />
    ));
  };

  const timeAgo = (time: string) => {
    const diff = Date.now() - new Date(time).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "刚刚";
    if (mins < 60) return `${mins}分钟前`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}小时前`;
    return `${Math.floor(hours / 24)}天前`;
  };

  return (
    <div className="space-y-6 pb-10">
      {/* 头部 */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">📡 实时监控</h2>
          <p className="text-neutral-400 mt-1">AI 自动抓取 + 智能筛选差评/咨询/好评</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={autoRefresh ? "default" : "outline"}
            className={autoRefresh ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "border-neutral-700 text-neutral-400"}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Radio className={`w-4 h-4 mr-1 ${autoRefresh ? "animate-pulse" : ""}`} />
            {autoRefresh ? "自动刷新中" : "自动刷新"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-neutral-700 text-neutral-400"
            onClick={fetchData}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            刷新
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="bg-neutral-900 border-neutral-800 cursor-pointer hover:border-neutral-700" onClick={() => setFilter("all")}>
          <CardContent className="p-3">
            <div className="text-2xl font-bold text-white">{stats.total || 0}</div>
            <div className="text-xs text-neutral-400">全部</div>
          </CardContent>
        </Card>
        {["negative", "inquiry", "positive", "spam"].map((key) => {
          const config = TYPE_CONFIG[{ negative: "差评", inquiry: "咨询", positive: "好评", spam: "垃圾" }[key] as keyof typeof TYPE_CONFIG];
          const Icon = config.icon;
          return (
            <Card
              key={key}
              className={`bg-neutral-900 border cursor-pointer transition-all ${filter === key ? "border-white/30 scale-105" : "border-neutral-800 hover:border-neutral-700"}`}
              onClick={() => setFilter(filter === key ? "all" : key)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className={`text-2xl font-bold ${config.color}`}>
                    {stats[{ negative: "negative", inquiry: "inquiry", positive: "positive", spam: "spam" }[key]] || 0}
                  </div>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="text-xs text-neutral-400 mt-1">{config.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 平台筛选 */}
      <div className="flex gap-2 flex-wrap">
        {["all", "大众点评", "美团", "小红书", "抖音"].map((p) => (
          <button
            key={p}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              platform === p
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:border-neutral-600"
            }`}
            onClick={() => setPlatform(p)}
          >
            {p === "all" ? "全部平台" : p}
          </button>
        ))}
      </div>

      {/* 告警横幅 */}
      {(stats.highPriority || 0) > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-pulse">
          <Bell className="w-5 h-5 text-red-400 shrink-0" />
          <div className="flex-1">
            <p className="text-red-400 font-semibold text-sm">
              🚨 {stats.highPriority} 条差评需要立即处理
            </p>
            <p className="text-red-400/60 text-xs mt-0.5">
              建议 5 分钟内回复，避免影响门店评分
            </p>
          </div>
          <Button size="sm" className="bg-red-500 text-white" onClick={() => setFilter("negative")}>
            立即处理
          </Button>
        </div>
      )}

      {/* 实时数据流 */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            实时数据流
            <span className="text-xs text-neutral-500 font-normal ml-2">
              {loading ? "刷新中..." : `${items.length} 条`}
            </span>
          </CardTitle>
          <div className="flex items-center gap-1 text-xs text-neutral-500">
            <Clock className="w-3 h-3" /> {autoRefresh ? "每15秒自动刷新" : "手动刷新"}
          </div>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              <ShieldAlert className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">暂无数据</p>
              <p className="text-xs mt-1">开启自动刷新或调整筛选条件</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {items.map((item) => {
                const config = TYPE_CONFIG[item.type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG["好评"];
                const Icon = config.icon;
                return (
                  <div
                    key={item.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                      item.priority === "high"
                        ? "border-red-500/30 bg-red-500/5 hover:bg-red-500/10"
                        : "border-neutral-800 bg-neutral-950 hover:bg-neutral-900"
                    }`}
                  >
                    {/* 平台标签 */}
                    <div className={`shrink-0 px-2 py-1 rounded text-[10px] font-medium border ${PLATFORM_COLORS[item.platform] || "bg-neutral-700 text-neutral-300"}`}>
                      {item.platform}
                    </div>

                    {/* 评分 */}
                    <div className="flex shrink-0">{starRating(item.rating)}</div>

                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-neutral-200 leading-relaxed">{item.content}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[11px] text-neutral-500">{item.author}</span>
                        <span className="text-[11px] text-neutral-600">·</span>
                        <span className={`text-[11px] ${config.color}`}>
                          <Icon className="w-3 h-3 inline mr-0.5" />
                          {config.label}
                        </span>
                        <span className="text-[11px] text-neutral-600">·</span>
                        <span className="text-[11px] text-neutral-600">{timeAgo(item.time)}</span>
                      </div>
                    </div>

                    {/* 操作 */}
                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-500 hover:text-white transition-colors"
                        title="查看原文"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      {item.type === "差评" && (
                        <Button
                          size="sm"
                          className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 h-7 text-[11px]"
                        >
                          <AlertTriangle className="w-3 h-3 mr-1" /> 立即回复
                        </Button>
                      )}
                      {item.type === "咨询" && (
                        <Button
                          size="sm"
                          className="bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 h-7 text-[11px]"
                        >
                          <HelpCircle className="w-3 h-3 mr-1" /> 回复
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
