"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Shield, Loader2, Check, Copy } from "lucide-react";

interface PaidPhone {
  phone: string;
  expires_at: string;
  duration_days: number;
  created_at: string;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [phones, setPhones] = useState<PaidPhone[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPhone, setNewPhone] = useState("");
  const [newDays, setNewDays] = useState(30);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  // Try restore auth from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("kb_admin_token");
    if (saved) setAuthed(true);
    setLoading(false);
  }, []);

  const handleLogin = () => {
    if (password.length < 4) {
      setMsg("密码至少4位");
      return;
    }
    setAuthed(true);
    localStorage.setItem("kb_admin_token", password);
  };

  const loadPhones = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("kb_admin_token");
    try {
      const res = await fetch("/api/admin/phones", {
        headers: { "x-admin-token": token || "" },
      });
      const data = await res.json();
      if (res.status === 401) {
        setAuthed(false);
        localStorage.removeItem("kb_admin_token");
        setMsg("密码错误或未配置，请重新登录");
        return;
      }
      if (data.phones) setPhones(data.phones);
      else setMsg(data.error || "加载失败");
    } catch {
      setMsg("网络错误");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) loadPhones();
  }, [authed, loadPhones]);

  const handleAdd = async () => {
    if (!/^1[3-9]\d{9}$/.test(newPhone)) {
      setMsg("请输入正确的手机号");
      return;
    }
    setAdding(true);
    setMsg("");
    const token = localStorage.getItem("kb_admin_token");
    try {
      const res = await fetch("/api/admin/phones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token || "",
        },
        body: JSON.stringify({ phone: newPhone, durationDays: newDays }),
      });
      const data = await res.json();
      if (data.success) {
        setNewPhone("");
        setMsg(`✅ 已添加 ${data.phone}，有效期至 ${new Date(data.expiresAt).toLocaleDateString("zh-CN")}`);
        loadPhones();
      } else {
        setMsg(data.error || "添加失败");
      }
    } catch {
      setMsg("网络错误");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (phone: string) => {
    if (!confirm(`确定删除 ${phone}？`)) return;
    setDeleting(phone);
    const token = localStorage.getItem("kb_admin_token");
    try {
      const res = await fetch("/api/admin/phones", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token || "",
        },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(`已删除 ${phone}`);
        loadPhones();
      } else {
        setMsg(data.error || "删除失败");
      }
    } catch {
      setMsg("网络错误");
    } finally {
      setDeleting(null);
    }
  };

  // Login screen
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border p-8 max-w-sm w-full mx-4 text-gray-900">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-6 h-6 text-[#D4725A]" />
            <h1 className="text-xl font-bold text-[#3D2220]">口碑助手 · 后台</h1>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="管理员密码"
            className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#D4725A]/30"
          />
          {msg && <p className="text-xs text-red-500 mb-3">{msg}</p>}
          <Button onClick={handleLogin} className="w-full bg-[#D4725A]">
            进入后台
          </Button>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 text-gray-900">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#D4725A]" />
            <h1 className="text-xl font-bold text-[#3D2220]">付费用户管理</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              localStorage.removeItem("kb_admin_token");
              setAuthed(false);
            }}
          >
            退出
          </Button>
        </div>

        {/* Add form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
          <h2 className="font-semibold text-sm text-[#3D2220] flex items-center gap-1">
            <Plus className="w-4 h-4" /> 添加付费用户
          </h2>
          <div className="flex gap-2">
            <input
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="手机号"
              maxLength={11}
              className="flex-1 h-10 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4725A]/30"
            />
            <select
              value={newDays}
              onChange={(e) => setNewDays(+e.target.value)}
              className="w-24 h-10 rounded-xl border border-gray-200 px-2 text-sm focus:outline-none"
            >
              <option value={30}>30天（推荐）</option>
              <option value={14}>14天</option>
              <option value={90}>90天</option>
              <option value={365}>365天</option>
            </select>
            <Button
              onClick={handleAdd}
              disabled={adding}
              className="bg-[#D4725A]"
              size="sm"
            >
              {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : "添加"}
            </Button>
          </div>
          {msg && (
            <p className={`text-xs ${msg.startsWith("✅") ? "text-green-600" : "text-red-500"}`}>
              {msg}
            </p>
          )}
        </div>

        {/* Phone list */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-sm text-[#3D2220]">
              已开通用户 ({phones.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : phones.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              还没有付费用户
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {phones.map((p) => {
                const expired = new Date(p.expires_at) < new Date();
                return (
                  <div key={p.phone} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-[#3D2220]">{p.phone}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          expired
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}>
                          {expired ? "已过期" : "有效"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {p.duration_days}天 · 到期: {new Date(p.expires_at).toLocaleDateString("zh-CN")}
                        {" · "}创建: {new Date(p.created_at).toLocaleDateString("zh-CN")}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(p.phone);
                          setMsg(`已复制 ${p.phone}`);
                        }}
                        className="p-1.5 text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.phone)}
                        disabled={deleting === p.phone}
                        className="p-1.5 text-red-400 hover:text-red-600"
                      >
                        {deleting === p.phone ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
