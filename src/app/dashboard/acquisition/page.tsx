"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles, Users, Target, TrendingUp, Copy, RefreshCw,
  MessageCircle, MapPin, FileText, HelpCircle, Plus, Phone,
  CheckCircle, XCircle, Clock,
} from "lucide-react";

const CONTENT_TYPES = [
  { key: "viral", label: "爆款引流", icon: Sparkles, desc: "抓眼球的标题 + 引导私信" },
  { key: "story", label: "客户故事", icon: FileText, desc: "真实感强，像分享不像广告" },
  { key: "local", label: "本地引流", icon: MapPin, desc: "附近客群 + 新客优惠" },
  { key: "qa", label: "问答引流", icon: HelpCircle, desc: "伪装真实用户提问/分享" },
];

const SOURCES = [
  { value: "小红书私信", label: "小红书私信", icon: MessageCircle },
  { value: "小红书评论", label: "小红书评论", icon: MessageCircle },
  { value: "大众点评", label: "大众点评", icon: MapPin },
  { value: "微信好友", label: "微信好友", icon: MessageCircle },
  { value: "朋友介绍", label: "朋友介绍", icon: Users },
  { value: "抖音", label: "抖音", icon: Sparkles },
  { value: "其他", label: "其他渠道", icon: Target },
];

const STATUSES = ["新线索", "已联系", "有意向", "已到店", "已成交", "已流失"];

export default function AcquisitionPage() {
  const [profile, setProfile] = useState<any>({});
  const [generating, setGenerating] = useState<string | null>(null);
  const [content, setContent] = useState<Record<string, string>>({});
  const [leads, setLeads] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [showAddLead, setShowAddLead] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", phone: "", source: "小红书私信", note: "" });

  // 加载数据
  const loadData = useCallback(async () => {
    const supabase = createClient();
    // 加载门店信息
    const { data: profileData } = await supabase.from("profiles").select("*").single();
    if (profileData) setProfile(profileData);

    // 加载线索
    const res = await fetch("/api/acquisition/leads");
    if (res.ok) setLeads(await res.json());

    // 加载分析
    const res2 = await fetch("/api/acquisition/analytics");
    if (res2.ok) setAnalytics(await res2.json());
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // 生成内容
  const generateContent = async (type: string) => {
    setGenerating(type);
    const res = await fetch("/api/acquisition/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, profile }),
    });
    const data = await res.json();
    setContent({ ...content, [type]: data.content });
    setGenerating(null);
  };

  // 添加线索
  const addLead = async () => {
    const res = await fetch("/api/acquisition/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLead),
    });
    if (res.ok) {
      setShowAddLead(false);
      setNewLead({ name: "", phone: "", source: "小红书私信", note: "" });
      loadData();
    }
  };

  // 更新线索状态
  const updateLeadStatus = async (id: number, status: string) => {
    await fetch("/api/acquisition/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    loadData();
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">🚀 AI 获客系统</h2>
          <p className="text-neutral-400 mt-1">AI 生成引流内容 + 线索追踪 + 转化分析</p>
        </div>
      </div>

      {/* ====== 数据卡片 ====== */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{analytics.total}</p>
                  <p className="text-xs text-neutral-400">总线索数</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{analytics.converted}</p>
                  <p className="text-xs text-neutral-400">已成交</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{analytics.conversionRate}%</p>
                  <p className="text-xs text-neutral-400">转化率</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-orange-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{analytics.bySource?.length || 0}</p>
                  <p className="text-xs text-neutral-400">获客渠道</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ====== AI 内容生成 ====== */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" /> AI 生成引流内容
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CONTENT_TYPES.map((ct) => (
              <div key={ct.key} className="border border-neutral-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <ct.icon className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold text-white">{ct.label}</span>
                  <span className="text-xs text-neutral-500">{ct.desc}</span>
                </div>

                {content[ct.key] ? (
                  <div className="space-y-2">
                    <div className="bg-neutral-950 rounded-lg p-3 text-sm text-neutral-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {content[ct.key]}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-neutral-700 text-neutral-300"
                        onClick={() => copyText(content[ct.key])}
                      >
                        <Copy className="w-3 h-3 mr-1" /> 复制
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-neutral-700 text-neutral-300"
                        onClick={() => generateContent(ct.key)}
                        disabled={generating === ct.key}
                      >
                        <RefreshCw className={`w-3 h-3 mr-1 ${generating === ct.key ? "animate-spin" : ""}`} />
                        重新生成
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    className="w-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20"
                    onClick={() => generateContent(ct.key)}
                    disabled={generating === ct.key}
                  >
                    {generating === ct.key ? (
                      <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> 生成中...</>
                    ) : (
                      <><Sparkles className="w-4 h-4 mr-2" /> 生成内容</>
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ====== 线索管理 ====== */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" /> 线索管理
          </CardTitle>
          <Button
            className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
            onClick={() => setShowAddLead(!showAddLead)}
          >
            <Plus className="w-4 h-4 mr-1" /> 添加线索
          </Button>
        </CardHeader>
        <CardContent>
          {/* 添加线索表单 */}
          {showAddLead && (
            <div className="mb-4 p-4 border border-neutral-800 rounded-xl space-y-3 bg-neutral-950">
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-500"
                  placeholder="客户姓名"
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                />
                <input
                  className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-500"
                  placeholder="手机号"
                  value={newLead.phone}
                  onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white flex-1"
                  value={newLead.source}
                  onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                >
                  {SOURCES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <input
                  className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white flex-1 placeholder:text-neutral-500"
                  placeholder="备注"
                  value={newLead.note}
                  onChange={(e) => setNewLead({ ...newLead, note: e.target.value })}
                />
                <Button className="bg-emerald-500 text-white" onClick={addLead}>
                  <Plus className="w-4 h-4 mr-1" /> 添加
                </Button>
              </div>
            </div>
          )}

          {/* 线索列表 */}
          {leads.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>还没有线索，开始生成引流内容吸引客户吧</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400">
                    <th className="text-left py-3 px-2">姓名</th>
                    <th className="text-left py-3 px-2">电话</th>
                    <th className="text-left py-3 px-2">来源</th>
                    <th className="text-left py-3 px-2">状态</th>
                    <th className="text-left py-3 px-2">时间</th>
                    <th className="text-left py-3 px-2">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead: any) => (
                    <tr key={lead.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                      <td className="py-3 px-2 text-white">{lead.name}</td>
                      <td className="py-3 px-2 text-neutral-400">{lead.phone}</td>
                      <td className="py-3 px-2">
                        <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">{lead.source}</span>
                      </td>
                      <td className="py-3 px-2">
                        <select
                          className={`text-xs px-2 py-0.5 rounded-full border-0 cursor-pointer ${
                            lead.status === "已成交" ? "bg-emerald-500/10 text-emerald-400" :
                            lead.status === "已流失" ? "bg-red-500/10 text-red-400" :
                            "bg-neutral-700 text-neutral-300"
                          }`}
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-2 text-neutral-500 text-xs">
                        {lead.created_at ? new Date(lead.created_at).toLocaleDateString("zh-CN") : ""}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-1">
                          {lead.phone && (
                            <a href={`tel:${lead.phone}`} className="text-emerald-400 hover:text-emerald-300">
                              <Phone className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ====== 渠道分析 ====== */}
      {analytics?.bySource?.length > 0 && (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" /> 获客渠道分析
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.bySource.map((item: any) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="text-sm text-neutral-300 w-24 shrink-0">{item.name}</span>
                  <div className="flex-1 bg-neutral-800 rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all flex items-center justify-end pr-2"
                      style={{ width: `${Math.max((item.value / analytics.total) * 100, 8)}%` }}
                    >
                      <span className="text-xs text-white font-bold">{item.value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
