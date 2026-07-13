"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Check, Library } from "lucide-react";
import type { Schedule, ScheduleItem, TopicCategory } from "@/lib/ai/content-factory-types";

const CAT_COLORS: Record<TopicCategory, string> = {
  "痛点类": "text-red-400 bg-red-500/10",
  "种草类": "text-pink-400 bg-pink-500/10",
  "避坑类": "text-yellow-400 bg-yellow-500/10",
  "对比类": "text-blue-400 bg-blue-500/10",
  "成交类": "text-green-400 bg-green-500/10",
  "本地引流类": "text-purple-400 bg-purple-500/10",
};

const DAY_NAMES = ["", "周一", "周二", "周三", "周四", "周五", "周六", "周日"];

export default function SchedulePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rawP = localStorage.getItem("cf_brand");
    const rawT = localStorage.getItem("cf_topics_all");
    if (!rawP) { router.push("/content-factory/brand"); return; }
    const p = JSON.parse(rawP);
    setProfile(p);

    // Get topics from API again
    fetch("/api/cf/topics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) })
      .then((r) => r.json())
      .then((topics) => {
        return fetch("/api/cf/schedule", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profile: p, topics }) });
      })
      .then((r) => r.json())
      .then((data) => { setSchedule(data); setLoading(false); });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs mb-4">Step 6</div>
        <h1 className="text-2xl font-extrabold mb-2">7天发布计划</h1>
        <p className="text-neutral-500 text-sm">{profile?.name} · 每天2条，混合内容类型</p>
      </div>

      <div className="space-y-4">
        {schedule?.items.map((item, i) => {
          const isMorning = i % 2 === 0;
          const dayIdx = Math.floor(i / 2) + 1;
          const showDayHeader = i % 2 === 0;

          return (
            <div key={i}>
              {showDayHeader && (
                <div className="flex items-center gap-3 mb-2 mt-4 first:mt-0">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-bold text-white">{item.dayOfWeek} · 第{dayIdx}天</span>
                </div>
              )}
              <div className={`flex items-start gap-3 p-3 rounded-xl border border-neutral-800 bg-neutral-950 ${!isMorning ? "ml-6" : ""}`}>
                <span className="text-xs text-neutral-600 w-8 shrink-0 mt-0.5">{isMorning ? "☀️ 上午" : "🌙 下午"}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-neutral-200 truncate">{item.topicTitle}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${CAT_COLORS[item.category]}`}>{item.category}</span>
                    <span className="text-[10px] text-neutral-600">{item.contentType}</span>
                  </div>
                </div>
                <Check className="w-4 h-4 text-neutral-700 shrink-0" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Button onClick={() => { localStorage.setItem("cf_schedule", JSON.stringify(schedule)); router.push("/content-factory/library"); }} variant="primary" size="xl">
          <Library className="w-4 h-4" /> 查看内容库 <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
