"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Search, Check, X, AlertCircle, RefreshCw, Target, BarChart3, FileText, Phone } from "lucide-react";
import Link from "next/link";

interface Lead {
  id: number;
  store_name: string;
  contact_name: string | null;
  phone: string | null;
  platform: string;
  rating: number | null;
  industry: string | null;
  status: "new" | "contacted" | "demoed" | "negotiating" | "won" | "lost";
  notes: string | null;
  source: string;
  needs_followup: boolean;
  days_since_contact: number;
  created_at: string;
  updated_at: string;
  last_contact_at: string | null;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  new: { label: "新线索", color: "bg-blue-100 text-blue-700" },
  contacted: { label: "已联系", color: "bg-yellow-100 text-yellow-700" },
  demoed: { label: "已演示", color: "bg-purple-100 text-purple-700" },
  negotiating: { label: "洽谈中", color: "bg-orange-100 text-orange-700" },
  won: { label: "已成交", color: "bg-green-100 text-green-700" },
  lost: { label: "已流失", color: "bg-gray-100 text-gray-500" },
};

const STATUS_FLOW: Lead["status"][] = ["new", "contacted", "demoed", "negotiating", "won", "lost"];

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("kb_admin_token") || "" : "";
}

export default function CrmPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "followup" | Lead["status"]>("all");
  const [search, setSearch] = useState("");

  // New lead form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ store_name: "", contact_name: "", phone: "", platform: "大众点评", rating: "", industry: "皮肤管理", notes: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("kb_admin_token");
    if (saved) setAuthed(true);
    setLoading(false);
  }, []);

  const loadLeads = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/crm/leads", { headers: { "x-admin-token": token } });
      if (res.status === 401) { setAuthed(false); localStorage.removeItem("kb_admin_token"); return; }
      const data = await res.json();
      if (data.leads) setLeads(data.leads);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) loadLeads();
  }, [authed, loadLeads]);

  const handleLogin = () => {
    if (password.length < 4) { setMsg("密码至少4位"); return; }
    setAuthed(true);
    localStorage.setItem("kb_admin_token", password);
  };

  const handleSave = async () => {
    if (!form.store_name.trim()) { setMsg("请输入店名"); return; }
    setSaving(true);
    const token = getToken();
    try {
      const res = await fetch("/api/crm/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ ...form, rating: form.rating ? Number(form.rating) : null }),
      });
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        setForm({ store_name: "", contact_name: "", phone: "", platform: "大众点评", rating: "", industry: "皮肤管理", notes: "" });
        loadLeads();
        setMsg("✅ 已添加");
      } else {
        setMsg(data.error || "保存失败");
      }
    } catch { setMsg("网络错误"); }
    setSaving(false);
  };

  const updateStatus = async (id: number, status: Lead["status"]) => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;
    const token = getToken();
    await fetch("/api/crm/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ id, store_name: lead.store_name, status, notes: lead.notes }),
    });
    loadLeads();
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`删除 "${name}" ？`)) return;
    const token = getToken();
    await fetch("/api/crm/leads", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ id }),
    });
    loadLeads();
  };

  // Filter & search
  const filtered = leads.filter(l => {
    if (filter === "followup") return l.needs_followup;
    if (filter !== "all" && l.status !== filter) return false;
    if (search && !l.store_name.includes(search) && !(l.contact_name || "").includes(search) && !(l.phone || "").includes(search)) return false;
    return true;
  });

  // Stats
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === "new").length,
    won: leads.filter(l => l.status === "won").length,
    followup: leads.filter(l => l.needs_followup).length,
  };

  // Login screen
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border p-8 max-w-sm w-full mx-4 text-gray-900">
          <h1 className="text-xl font-bold mb-4">🔐 口碑助手 CRM</h1>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="管理员密码" className="w-full h-11 rounded-xl border px-4 text-sm mb-3" />
          {msg && <p className="text-xs text-red-500 mb-3">{msg}</p>}
          <Button onClick={handleLogin} className="w-full bg-[#D4725A]">进入 CRM</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 text-gray-900">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header + Stats */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-xl font-bold">📊 客户追踪 CRM</h1>
          <div className="flex items-center gap-2">
            <Link href="/crm/prospect" className="text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 flex items-center gap-1">
              <Target className="w-3 h-3" /> 挖掘客户
            </Link>
            <Link href="/crm/scripts" className="text-xs px-3 py-1.5 rounded-full bg-purple-50 text-purple-600 font-medium hover:bg-purple-100 flex items-center gap-1">
              <FileText className="w-3 h-3" /> 话术生成
            </Link>
            <Link href="/crm/analytics" className="text-xs px-3 py-1.5 rounded-full bg-green-50 text-green-600 font-medium hover:bg-green-100 flex items-center gap-1">
              <BarChart3 className="w-3 h-3" /> 数据分析
            </Link>
            <Button onClick={() => { setShowForm(true); setMsg(""); }} className="bg-[#D4725A]" size="sm">
              <Plus className="w-4 h-4" /> 添加线索
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "总线索", value: stats.total, color: "bg-white" },
            { label: "新线索", value: stats.new, color: "bg-blue-50" },
            { label: "已成交", value: stats.won, color: "bg-green-50" },
            { label: "待跟进", value: stats.followup, color: "bg-red-50" },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-xl border p-3 text-center`}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap items-center">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="搜索店名/联系人/电话..."
              className="w-full h-9 pl-9 pr-3 rounded-lg border text-sm" />
          </div>
          {(["all", "followup", "new", "contacted", "demoed", "negotiating", "won", "lost"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                filter === f ? "bg-[#D4725A] text-white border-[#D4725A]" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}>
              {f === "all" ? "全部" : f === "followup" ? "⚠️ 待跟进" : (STATUS_MAP as any)[f]?.label || f}
            </button>
          ))}
          <button onClick={loadLeads} className="p-1.5 text-gray-400 hover:text-gray-600"><RefreshCw className="w-4 h-4" /></button>
        </div>

        {/* Lead list */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-3xl mb-2">📭</p>
            <p>{leads.length === 0 ? "还没有线索，点「添加线索」开始" : "没有匹配的线索"}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(lead => (
              <div key={lead.id} className={`bg-white rounded-xl border p-4 transition-all ${
                lead.needs_followup ? "border-red-300 ring-1 ring-red-100" : "border-gray-200"
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm">{lead.store_name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_MAP[lead.status]?.color}`}>
                        {STATUS_MAP[lead.status]?.label}
                      </span>
                      {lead.needs_followup && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {lead.days_since_contact >= 999 ? "未联系" : `${lead.days_since_contact}天未跟进`}
                        </span>
                      )}
                      {lead.industry && <span className="text-xs text-gray-400">{lead.industry}</span>}
                      {lead.rating && <span className="text-xs text-amber-500">{lead.rating}⭐</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      {lead.contact_name && <span>{lead.contact_name}</span>}
                      {lead.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone}</span>}
                      <span>{lead.platform}</span>
                    </div>
                    {lead.notes && <p className="text-xs text-gray-400 mt-1 line-clamp-1">{lead.notes}</p>}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Status progression buttons */}
                    {lead.status !== "won" && lead.status !== "lost" && (
                      <>
                        {STATUS_FLOW.indexOf(lead.status) > 0 && (
                          <button onClick={() => updateStatus(lead.id, STATUS_FLOW[STATUS_FLOW.indexOf(lead.status) - 1])}
                            className="p-1.5 text-gray-400 hover:text-gray-600 text-xs" title="上一步">←</button>
                        )}
                        <button onClick={() => updateStatus(lead.id, STATUS_FLOW[STATUS_FLOW.indexOf(lead.status) + 1])}
                          className="p-1.5 text-[#D4725A] hover:bg-red-50 rounded-lg text-xs font-medium" title="下一步">
                          {lead.status === "negotiating" ? "成交 →" : "→"}
                        </button>
                      </>
                    )}
                    {lead.status === "won" && <Check className="w-4 h-4 text-green-500" />}
                    {lead.status === "lost" && <X className="w-4 h-4 text-gray-400" />}
                    <button onClick={() => handleDelete(lead.id, lead.store_name)}
                      className="p-1.5 text-gray-300 hover:text-red-500 text-xs ml-1">🗑</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add lead modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-3 text-gray-900">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">添加线索</h2>
                <button onClick={() => setShowForm(false)} className="p-1"><X className="w-5 h-5" /></button>
              </div>
              <input value={form.store_name} onChange={e => setForm({...form, store_name: e.target.value})}
                placeholder="店名 *" className="w-full h-10 rounded-lg border px-3 text-sm" />
              <div className="grid grid-cols-2 gap-2">
                <input value={form.contact_name} onChange={e => setForm({...form, contact_name: e.target.value})}
                  placeholder="联系人" className="h-10 rounded-lg border px-3 text-sm" />
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  placeholder="电话" className="h-10 rounded-lg border px-3 text-sm" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <select value={form.platform} onChange={e => setForm({...form, platform: e.target.value})}
                  className="h-10 rounded-lg border px-2 text-sm">
                  <option>大众点评</option><option>美团</option><option>小红书</option><option>微信</option><option>其他</option>
                </select>
                <input value={form.rating} onChange={e => setForm({...form, rating: e.target.value})}
                  placeholder="评分" type="number" min="0" max="5" step="0.1"
                  className="h-10 rounded-lg border px-3 text-sm" />
                <select value={form.industry} onChange={e => setForm({...form, industry: e.target.value})}
                  className="h-10 rounded-lg border px-2 text-sm">
                  <option>皮肤管理</option><option>美甲美睫</option><option>美容美发</option><option>轻医美</option><option>餐饮</option><option>酒店民宿</option>
                </select>
              </div>
              <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                placeholder="备注：差评情况、沟通记录等" rows={2}
                className="w-full rounded-lg border px-3 py-2 text-sm resize-none" />
              {msg && <p className={`text-xs ${msg.startsWith("✅") ? "text-green-600" : "text-red-500"}`}>{msg}</p>}
              <Button onClick={handleSave} disabled={saving} className="w-full bg-[#D4725A]">
                {saving ? "保存中..." : "保存线索"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
