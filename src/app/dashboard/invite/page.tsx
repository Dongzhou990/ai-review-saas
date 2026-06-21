"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Copy,
  Check,
  Loader2,
} from "lucide-react";

const SCENES = [
  { key: "消费后", icon: "🍽️", label: "消费后邀评", desc: "客人刚消费完，体验不错，当面或微信发" },
  { key: "复购邀评", icon: "🔄", label: "老客复购邀评", desc: "老客人又来消费了，趁机请他们写个好评" },
  { key: "活动后", icon: "🎉", label: "活动后邀评", desc: "刚做完活动/促销，体验不错的人" },
  { key: "服务完成后", icon: "💆", label: "服务完成后邀评", desc: "客人做完护理/诊疗，效果满意" },
];

const CHANNELS = [
  { key: "大众点评", label: "大众点评" },
  { key: "美团", label: "美团" },
  { key: "小红书", label: "小红书" },
  { key: "微信", label: "微信" },
];

export default function InvitePage() {
  const [scene, setScene] = useState("消费后");
  const [storeName, setStoreName] = useState("");
  const [platform, setPlatform] = useState("大众点评");
  const [loading, setLoading] = useState(false);
  const [texts, setTexts] = useState<string[]>([]);
  const [tips, setTips] = useState("");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/generate-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ scene, storeName: storeName || undefined, platform }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "生成失败"); } else { setTexts(data.texts || []); setTips(data.tips || ""); }
    } catch { setError("网络错误"); }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-1">生成邀评文案</h2>
        <p className="text-sm text-neutral-400 mb-6">
          给满意的客人发条微信或当面说一句，请他们去平台写个好评。AI 帮你写得不那么像广告。
        </p>

        {/* Scene selector */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {SCENES.map((s) => (
            <button key={s.key} onClick={() => setScene(s.key)}
              className={`text-left p-3 rounded-xl border text-sm transition-all ${
                scene === s.key ? "border-blue-500 bg-blue-500/10" : "border-neutral-800"
              }`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{s.icon}</span>
                <span className="font-medium">{s.label}</span>
              </div>
              <p className="text-xs text-neutral-400 mt-1 ml-8">{s.desc}</p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-sm text-neutral-400 mb-1 block">门店名称（可选）</label>
            <Input placeholder="如：老王火锅（望京店）" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-neutral-400 mb-1 block">发布平台</label>
            <div className="flex gap-2 flex-wrap">
              {CHANNELS.map((c) => (
                <button key={c.key} onClick={() => setPlatform(c.key)}
                  className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                    platform === c.key ? "border-blue-500 bg-blue-500/10 text-blue-700" : "border-neutral-800 text-neutral-300"
                  }`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button variant="primary" className="w-full" onClick={handleGenerate} disabled={loading}>
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> 生成中...</> : <><Sparkles className="w-4 h-4" /> 生成邀评文案</>}
        </Button>
      </div>

      {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-200 text-red-700 text-sm">{error}</div>}

      {texts.length > 0 && (
        <Card>
          <CardHeader><CardTitle>邀评文案</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {texts.map((t, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-neutral-900">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">{i + 1}</span>
                <p className="flex-1 text-sm leading-relaxed whitespace-pre-wrap">{t}</p>
                <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(t); setCopiedIdx(i); setTimeout(() => setCopiedIdx(null), 2000); }}>
                  {copiedIdx === i ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            ))}
            {tips && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 text-sm text-amber-800">
                <span>💡</span><span>{tips}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!texts.length && !loading && (
        <div className="text-center py-8 text-neutral-500">
          <p className="text-lg mb-2">👆 选个场景，生成邀评文案</p>
          <p className="text-sm">文案适合复制后通过微信、企微发给客人</p>
        </div>
      )}
    </div>
  );
}
