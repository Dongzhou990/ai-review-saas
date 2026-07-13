"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mic, Copy, Check } from "lucide-react";
import type { BrandProfile, Topic, ScriptVersion } from "@/lib/ai/content-factory-types";

export default function ScriptsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<BrandProfile | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [scripts, setScripts] = useState<ScriptVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("cf_brand");
    const rawT = localStorage.getItem("cf_topic");
    if (!raw || !rawT) { router.push("/content-factory/brand"); return; }
    const p = JSON.parse(raw);
    const t = JSON.parse(rawT);
    setProfile(p); setTopic(t);
    fetch("/api/cf/scripts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profile: p, topic: t }) })
      .then((r) => r.json())
      .then((data) => { setScripts(data); setLoading(false); });
  }, []);

  const goNext = () => {
    if (selected === null) return;
    localStorage.setItem("cf_script", JSON.stringify(scripts[selected]));
    router.push("/content-factory/video");
  };

  const copyScript = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs mb-4">Step 3</div>
        <h1 className="text-2xl font-extrabold mb-2">口播脚本</h1>
        <p className="text-neutral-500 text-sm">选题：{topic?.title}</p>
      </div>

      <div className="space-y-6">
        {scripts.map((s, i) => (
          <div key={s.id} className={`rounded-2xl border transition-all ${selected === i ? "border-blue-500 ring-1 ring-blue-500/20" : "border-neutral-800 bg-neutral-950"}`}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 text-xs flex items-center justify-center font-bold">{s.version}</span>
                <span className="font-semibold text-sm">{s.style} 风格</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => copyScript(s.fullScript)} className="text-xs px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors flex items-center gap-1">
                  {copied === s.fullScript ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  {copied === s.fullScript ? "已复制" : "复制脚本"}
                </button>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
                <span className="text-blue-400 font-medium">🎬 钩子</span>
                <span className="text-neutral-300">{s.hook}</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
                <span className="text-red-400 font-medium">😫 痛点</span>
                <span className="text-neutral-400">{s.painPoint.slice(0, 120)}...</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
                <span className="text-yellow-400 font-medium">💡 解释</span>
                <span className="text-neutral-400">{s.explanation.slice(0, 120)}...</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
                <span className="text-green-400 font-medium">🏪 植入</span>
                <span className="text-neutral-400">{s.servicePlug.slice(0, 120)}...</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
                <span className="text-purple-400 font-medium">📥 CTA</span>
                <span className="text-neutral-400">{s.cta.slice(0, 120)}...</span>
              </div>
            </div>

            <div className="px-5 pb-4">
              <button onClick={() => setSelected(i)} className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${selected === i ? "bg-blue-500/20 text-blue-400" : "bg-neutral-800 text-neutral-400 hover:text-white"}`}>
                {selected === i ? "✅ 已选择此版本" : "选这个版本 →"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button onClick={goNext} disabled={selected === null} variant="primary" size="xl">
          <Mic className="w-4 h-4" /> 创建视频任务 <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
