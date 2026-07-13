"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Hash, MessageCircle, Copy, Check } from "lucide-react";
import type { XHSContent } from "@/lib/ai/content-factory-types";

export default function ContentPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [script, setScript] = useState<any>(null);
  const [content, setContent] = useState<XHSContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const rawP = localStorage.getItem("cf_brand");
    const rawS = localStorage.getItem("cf_script");
    if (!rawP || !rawS) { router.push("/content-factory/brand"); return; }
    const p = JSON.parse(rawP);
    const s = JSON.parse(rawS);
    setProfile(p); setScript(s);
    fetch("/api/cf/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profile: p, script: s }) })
      .then((r) => r.json())
      .then((data) => { setContent(data); setLoading(false); });
  }, []);

  const copy = (text: string) => { navigator.clipboard.writeText(text); setCopied(text); setTimeout(() => setCopied(""), 2000); };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>;
  }

  if (!content) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs mb-4">Step 5</div>
        <h1 className="text-2xl font-extrabold mb-2">小红书发布内容</h1>
        <p className="text-neutral-500 text-sm">{profile?.name} · 一键复制发布</p>
      </div>

      {/* Titles */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-neutral-300">📝 10个标题候选</h2>
          <button onClick={() => copy(content.titles.join("\n"))} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
            {copied === content.titles.join("\n") ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            一键复制
          </button>
        </div>
        <div className="space-y-1.5">
          {content.titles.map((t, i) => (
            <div key={i} className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-neutral-300 flex items-start gap-2">
              <span className="text-xs text-neutral-600 w-5 shrink-0">{i + 1}.</span>
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-neutral-300">📄 正文</h2>
          <button onClick={() => copy(content.body)} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
            {copied === content.body ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            复制正文
          </button>
        </div>
        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-300 whitespace-pre-wrap leading-relaxed">{content.body}</div>
      </div>

      {/* Tags */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-neutral-300 mb-3"><Hash className="w-4 h-4 inline mr-1" />话题标签</h2>
        <div className="flex flex-wrap gap-2">
          {content.hashtags.map((t) => (
            <span key={t} className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-400">#{t}</span>
          ))}
        </div>
      </div>

      {/* Comments */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-neutral-300 mb-3"><MessageCircle className="w-4 h-4 inline mr-1" />评论区引导</h2>
        <div className="space-y-2">
          {content.commentHooks.map((c, i) => (
            <div key={i} className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-neutral-400 flex items-center justify-between">
              <span>{c}</span>
              <button onClick={() => copy(c)} className="text-xs text-neutral-600 hover:text-blue-400 ml-2 shrink-0">
                {copied === c ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Button onClick={() => { localStorage.setItem("cf_content", JSON.stringify(content)); router.push("/content-factory/schedule"); }} variant="primary" size="xl">
          生成发布计划 <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
