"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Users, DollarSign, Target, BarChart3, RefreshCw, Loader2 } from "lucide-react";
import Link from "next/link";

interface Lead {
  status: string;
  industry: string | null;
  source: string;
  needs_followup: boolean;
  created_at: string;
}

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("kb_admin_token") || "" : "";
}

export default function AnalyticsPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("kb_admin_token");
    if (saved) setAuthed(true);
    setLoading(false);
  }, []);

  const loadData = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/crm/leads", { headers: { "x-admin-token": token } });
      if (res.status === 401) { setAuthed(false); return; }
      const data = await res.json();
      if (data.leads) setLeads(data.leads);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) loadData();
  }, [authed, loadData]);

  const handleLogin = () => {
    if (password.length < 4) { setMsg("密码至少4位"); return; }
    setAuthed(true);
    localStorage.setItem("kb_admin_token", password);
  };

  // Compute metrics
  const total = leads.length;
  const statusCounts: Record<string, number> = {};
  leads.forEach(l => { statusCounts[l.status] = (statusCounts[l.status] || 0) + 1; });

  const won = statusCounts["won"] || 0;
  const lost = statusCounts["lost"] || 0;
  const contacted = (statusCounts["contacted"] || 0) + (statusCounts["demoed"] || 0) + (statusCounts["negotiating"] || 0) + won + lost;
  const demoed = (statusCounts["demoed"] || 0) + (statusCounts["negotiating"] || 0) + won;

  // Funnel
  const funnel = [
    { label: "总线索", count: total, pct: "100%", color: "bg-blue-500" },
    { label: "已联系", count: contacted, pct: total ? Math.round(contacted / total * 100) + "%" : "0%", color: "bg-yellow-500" },
    { label: "已演示", count: demoed, pct: total ? Math.round(demoed / total * 100) + "%" : "0%", color: "bg-purple-500" },
    { label: "已成交", count: won, pct: total ? Math.round(won / total * 100) + "%" : "0%", color: "bg-green-500" },
  ];

  const conversionRate = total ? Math.round(won / total * 100) : 0;
  const contactRate = total ? Math.round(contacted / total * 100) : 0;
  const demoToWinRate = demoed ? Math.round(won / demoed * 100) : 0;

  // Industry breakdown
  const industryCounts: Record<string, { total: number; won: number }> = {};
  leads.forEach(l => {
    const ind = l.industry || "未分类";
    if (!industryCounts[ind]) industryCounts[ind] = { total: 0, won: 0 };
    industryCounts[ind].total++;
    if (l.status === "won") industryCounts[ind].won++;
  });

  // Source breakdown
  const sourceCounts: Record<string, number> = {};
  leads.forEach(l => {
    const s = l.source || "manual";
    sourceCounts[s] = (sourceCounts[s] || 0) + 1;
  });

  // Daily trend (last 7 days)
  const now = new Date();
  const dailyData: Record<string, { new: number; won: number }> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const key = d.toISOString().slice(0, 10);
    dailyData[key] = { new: 0, won: 0 };
  }
  leads.forEach(l => {
    const dateKey = l.created_at?.slice(0, 10);
    if (dateKey && dailyData[dateKey]) {
      dailyData[dateKey].new++;
      if (l.status === "won") dailyData[dateKey].won++;
    }
  });

  // MRR estimate (¥99 × won customers)
  const mrr = won * 99;
  const arr = won * 299;

  // Login
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border p-8 max-w-sm w-full mx-4 text-gray-900">
          <h1 className="text-xl font-bold mb-4">📈 数据分析</h1>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="管理员密码" className="w-full h-11 rounded-xl border px-4 text-sm mb-3" />
          {msg && <p className="text-xs text-red-500 mb-3">{msg}</p>}
          <Button onClick={handleLogin} className="w-full bg-[#D4725A]">进入</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 text-gray-900">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/crm" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold">📈 数据分析</h1>
          </div>
          <button onClick={loadData} className="p-2 text-gray-400 hover:text-gray-600">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Big numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "总线索", value: total, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "成交率", value: conversionRate + "%", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
            { label: "演示→成交", value: demoToWinRate + "%", icon: Target, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "预估月收入", value: "¥" + mrr, icon: DollarSign, color: "text-[#D4725A]", bg: "bg-[#FDF0EB]" },
          ].map(m => (
            <div key={m.label} className={`${m.bg} rounded-2xl border p-4`}>
              <m.icon className={`w-5 h-5 ${m.color} mb-2`} />
              <p className="text-2xl font-bold">{m.value}</p>
              <p className="text-xs text-gray-500">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-2xl border p-5">
          <h2 className="font-bold text-sm flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-[#D4725A]" /> 转化漏斗
          </h2>
          <div className="space-y-3">
            {funnel.map((f, i) => (
              <div key={f.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{f.label}</span>
                  <span className="text-gray-500">{f.count}人 · {f.pct}</span>
                </div>
                <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${f.color} rounded-full transition-all duration-500 flex items-center justify-end px-2`}
                    style={{ width: f.count > 0 ? Math.max(8, (f.count / Math.max(total, 1)) * 100) + "%" : "0%" }}
                  >
                    {f.count > 0 && <span className="text-white text-xs font-bold">{f.count}</span>}
                  </div>
                </div>
                {i < funnel.length - 1 && (
                  <div className="flex justify-center text-xs text-gray-400 py-1">
                    ↓ {f.count > 0 ? Math.round((funnel[i + 1].count / f.count) * 100) : 0}% 转化
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Industry breakdown */}
          <div className="bg-white rounded-2xl border p-5">
            <h2 className="font-bold text-sm mb-3">🏭 行业分布</h2>
            {Object.keys(industryCounts).length === 0 ? (
              <p className="text-sm text-gray-400">暂无数据</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(industryCounts)
                  .sort((a, b) => b[1].total - a[1].total)
                  .slice(0, 6)
                  .map(([ind, counts]) => (
                    <div key={ind} className="flex items-center justify-between text-sm">
                      <span>{ind}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">{counts.total}线索</span>
                        {counts.won > 0 && (
                          <span className="text-green-600 font-medium">{counts.won}成交</span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Source breakdown */}
          <div className="bg-white rounded-2xl border p-5">
            <h2 className="font-bold text-sm mb-3">📥 来源渠道</h2>
            {Object.keys(sourceCounts).length === 0 ? (
              <p className="text-sm text-gray-400">暂无数据</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(sourceCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([src, count]) => (
                    <div key={src} className="flex items-center justify-between text-sm">
                      <span>{src === "manual" ? "手动录入" : src === "dianping" ? "大众点评" : src === "xiaohongshu" ? "小红书" : src}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#D4725A] rounded-full"
                            style={{ width: Math.round(count / total * 100) + "%" }}
                          />
                        </div>
                        <span className="text-gray-500 w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Daily trend */}
        <div className="bg-white rounded-2xl border p-5">
          <h2 className="font-bold text-sm mb-3">📅 近7天趋势</h2>
          <div className="flex items-end gap-2 h-32">
            {Object.entries(dailyData).map(([date, counts]) => {
              const maxVal = Math.max(...Object.values(dailyData).map(d => d.new), 1);
              const height = Math.round((counts.new / maxVal) * 100);
              return (
                <div key={date} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-bold text-[#D4725A]">{counts.new || ""}</span>
                  <div className="w-full bg-[#FDF0EB] rounded-t-lg relative" style={{ height: Math.max(height, 4) + "px" }}>
                    {counts.won > 0 && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs text-green-600">
                        ✓{counts.won}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {date.slice(5).replace("-", "/")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Forecast & CAC */}
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border p-4 text-center">
            <p className="text-xs text-gray-500">预估 MRR</p>
            <p className="text-xl font-bold text-[#D4725A]">¥{mrr}</p>
            <p className="text-xs text-gray-400">¥99 × {won}个付费客户</p>
          </div>
          <div className="bg-white rounded-xl border p-4 text-center">
            <p className="text-xs text-gray-500">预估 ARR</p>
            <p className="text-xl font-bold text-[#D4725A]">¥{arr}</p>
            <p className="text-xs text-gray-400">¥299 × {won}个年付客户</p>
          </div>
          <div className="bg-white rounded-xl border p-4 text-center">
            <p className="text-xs text-gray-500">下一个目标</p>
            <p className="text-xl font-bold">10个客户</p>
            <p className="text-xs text-gray-400">MRR = ¥990/月</p>
          </div>
        </div>
      </div>
    </div>
  );
}
