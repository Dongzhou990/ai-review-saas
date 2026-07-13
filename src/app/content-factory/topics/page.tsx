"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Lightbulb, Heart, AlertTriangle, GitCompare, ShoppingBag, MapPin } from "lucide-react";
import type { BrandProfile, Topic, TopicCategory } from "@/lib/ai/content-factory-types";

const CAT_ICONS: Record<TopicCategory, any> = {
  "痛点类": AlertTriangle,
  "种草类": Heart,
  "避坑类": Lightbulb,
  "对比类": GitCompare,
  "成交类": ShoppingBag,
  "本地引流类": MapPin,
};
const CAT_COLORS: Record<TopicCategory, string> = {
  "痛点类": "text-red-400 bg-red-500/10 border-red-500/20",
  "种草类": "text-pink-400 bg-pink-500/10 border-pink-500/20",
  "避坑类": "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  "对比类": "text-blue-400 bg-blue-500/10 border-blue-500/20",
  "成交类": "text-green-400 bg-green-500/10 border-green-500/20",
  "本地引流类": "text-purple-400 bg-purple-500/10 border-purple-500/20",
};

export default function TopicsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<BrandProfile | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("cf_brand");
    if (!raw) { router.push("/content-factory/brand"); return; }
    const p = JSON.parse(raw);
    setProfile(p);
    fetch("/api/cf/topics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) })
      .then((r) => r.json())
      .then((data) => { setTopics(data); setLoading(false); });
  }, []);

  const goNext = () => {
    if (!selected) return;
    const topic = topics.find((t) => t.id === selected);
    localStorage.setItem("cf_topic", JSON.stringify(topic));
    router.push("/content-factory/scripts");
  };

  const grouped: Record<string, Topic[]> = {};
  topics.forEach((t) => { if (!grouped[t.category]) grouped[t.category] = []; grouped[t.category].push(t); });

  if (loading) {
    return <div className="flex items-center justify-center py-20"><svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs mb-4">Step 2</div>
        <h1 className="text-2xl font-extrabold mb-2">30条爆款选题</h1>
        <p className="text-neutral-500 text-sm">{profile?.name} · {profile?.city} · 选一条进入下一步</p>
      </div>

      <div className="space-y-8">
        {Object.entries(grouped).map(([cat, items]) => {
          const Icon = CAT_ICONS[cat as TopicCategory];
          return (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4" />
                <h2 className="text-sm font-bold text-neutral-300">{cat}</h2>
                <span className="text-xs text-neutral-600">({items.length}条)</span>
              </div>
              <div className="space-y-2">
                {items.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelected(t.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      selected === t.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-neutral-800 bg-neutral-900 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium">{t.title}</div>
                        <div className="text-xs text-neutral-500 mt-1">🎯 {t.goal} · 钩子: {t.hook}</div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${CAT_COLORS[cat as TopicCategory]}`}>{cat}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Button onClick={goNext} disabled={!selected} variant="primary" size="xl" className="px-8">
          <Sparkles className="w-4 h-4" /> 基于选定选题生成脚本 <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
