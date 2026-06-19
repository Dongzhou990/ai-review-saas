"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Store,
  Plus,
  Check,
  Loader2,
  Trash2,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PLATFORMS } from "@/lib/platforms";

interface StoreRecord {
  id: string;
  name: string;
  platform: string;
  status: string;
  review_count: number;
  last_sync_at: string | null;
}

const TONES = [
  { label: "专业礼貌", value: "professional" },
  { label: "亲切温暖", value: "friendly" },
  { label: "诚恳道歉", value: "apologetic" },
  { label: "热情感激", value: "enthusiastic" },
];

export default function SettingsPage() {
  const supabase = createClient();
  const [stores, setStores] = useState<StoreRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newStoreName, setNewStoreName] = useState("");
  const [newStorePlatform, setNewStorePlatform] = useState(PLATFORMS[0].name);
  const [savingTone, setSavingTone] = useState(false);
  const [defaultTone, setDefaultTone] = useState("professional");
  const [autoPublish, setAutoPublish] = useState({ good: true, medium: false, bad: false });

  const loadData = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: storeData } = await supabase
      .from("stores")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (storeData) setStores(storeData);

    const { data: settings } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (settings) {
      setDefaultTone(settings.default_tone || "professional");
      setAutoPublish({
        good: settings.auto_publish_good ?? true,
        medium: settings.auto_publish_medium ?? false,
        bad: settings.auto_publish_bad ?? false,
      });
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddStore = async () => {
    if (!newStoreName.trim()) return;
    setAdding(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: store, error } = await supabase.from("stores").insert({
      user_id: user.id,
      name: newStoreName.trim(),
      platform: newStorePlatform,
      status: "active",
    }).select().single();

    if (error) {
      console.error("添加店铺失败:", error.message);
      alert("添加失败: " + error.message);
    } else {
      setNewStoreName("");
      setNewStorePlatform("抖音小店");
      loadData();
    }
    setAdding(false);
  };

  const handleRemoveStore = async (id: string) => {
    await supabase.from("stores").delete().eq("id", id);
    setStores((prev) => prev.filter((s) => s.id !== id));
  };

  const handleToneChange = async (tone: string) => {
    setDefaultTone(tone);
    setSavingTone(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("user_settings").upsert({
      user_id: user.id,
      default_tone: tone,
    });
    setSavingTone(false);
  };

  const handleAutoPublishChange = async (key: string, value: boolean) => {
    setAutoPublish((prev) => ({ ...prev, [key]: value }));
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const updates: Record<string, boolean> = {};
    if (key === "good") updates.auto_publish_good = value;
    if (key === "medium") updates.auto_publish_medium = value;
    if (key === "bad") updates.auto_publish_bad = value;

    await supabase.from("user_settings").upsert({ user_id: user.id, ...updates });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Stores */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>已连接店铺</CardTitle>
            <CardDescription>管理已接入 AI 评论回复的电商店铺</CardDescription>
          </div>
          <Button variant="primary" size="sm" onClick={() => setAdding(true)}>
            <Plus className="w-4 h-4" /> 添加店铺
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {stores.length === 0 ? (
            <p className="text-center py-6 text-gray-400">还没有店铺，点击上方添加</p>
          ) : (
            stores.map((store) => (
              <div
                key={store.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Store className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{store.name}</span>
                      <Badge variant="success">
                        {store.status === "active" ? "已连接" : store.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {store.platform} · {store.review_count || 0} 条评论
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500"
                  onClick={() => handleRemoveStore(store.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}

          {/* Add store form */}
          {adding && (
            <div className="mt-4 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
              <div className="space-y-3">
                <div>
                  <Label>平台</Label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {PLATFORMS.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => setNewStorePlatform(p.name)}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-sm transition-all ${
                          newStorePlatform === p.name
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <span>{p.icon}</span>
                        <span className="text-xs">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="store-name">店铺名称</Label>
                  <Input
                    id="store-name"
                    placeholder="输入店铺名称"
                    value={newStoreName}
                    onChange={(e) => setNewStoreName(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={handleAddStore} disabled={!newStoreName.trim()}>
                    <Check className="w-4 h-4" /> 添加
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { setAdding(false); setNewStoreName(""); }}>
                    取消
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Reply Settings */}
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              AI 回复设置
            </span>
          </CardTitle>
          <CardDescription>自定义 AI 回复的风格和自动发布规则</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>默认回复风格</Label>
            {savingTone && (
              <span className="text-xs text-blue-600 ml-2">保存中...</span>
            )}
            <div className="grid grid-cols-4 gap-3 mt-2">
              {TONES.map((tone) => (
                <button
                  key={tone.value}
                  onClick={() => handleToneChange(tone.value)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm transition-all ${
                    defaultTone === tone.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  }`}
                >
                  {defaultTone === tone.value && <Check className="w-4 h-4" />}
                  {tone.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>自动发布规则</Label>
            <div className="space-y-3 mt-2">
              {[
                { key: "good", label: "好评自动发布", desc: "4-5 星评论无需审核直接发布" },
                { key: "medium", label: "中评审核后发布", desc: "3 星评论需要你审核后再发布" },
                { key: "bad", label: "差评手动处理", desc: "1-2 星评论需手动确认" },
              ].map((rule) => {
                const checked =
                  rule.key === "good"
                    ? autoPublish.good
                    : rule.key === "medium"
                    ? autoPublish.medium
                    : autoPublish.bad;

                return (
                  <div
                    key={rule.key}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div>
                      <span className="text-sm font-medium">{rule.label}</span>
                      <p className="text-xs text-gray-500 mt-0.5">{rule.desc}</p>
                    </div>
                    <button
                      role="switch"
                      aria-checked={checked}
                      onClick={() => handleAutoPublishChange(rule.key, !checked)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        checked ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          checked ? "translate-x-4" : "translate-x-[2px]"
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
