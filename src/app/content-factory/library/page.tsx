"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Library, FileText, Mic, Video, Hash, Calendar, ArrowRight, Sparkles, Download } from "lucide-react";
import Link from "next/link";

function getStored(key: string) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; } catch { return null; }
}

export default function LibraryPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const all: any[] = [];
    const brand = getStored("cf_brand");
    const topic = getStored("cf_topic");
    const script = getStored("cf_script");
    const video = getStored("cf_video_job");
    const content = getStored("cf_content");
    const schedule = getStored("cf_schedule");

    if (brand) all.push({ type: "brand", icon: FileText, label: "门店画像", data: brand, color: "text-neutral-400" });
    if (topic) all.push({ type: "topic", icon: Sparkles, label: "选定选题", data: topic, color: "text-yellow-400" });
    if (script) all.push({ type: "script", icon: Mic, label: "口播脚本", data: script, color: "text-blue-400" });
    if (video) all.push({ type: "video", icon: Video, label: "视频任务", data: video, color: "text-green-400" });
    if (content) all.push({ type: "content", icon: Hash, label: "小红书内容", data: content, color: "text-pink-400" });
    if (schedule) all.push({ type: "schedule", icon: Calendar, label: "发布计划", data: schedule, color: "text-purple-400" });

    setItems(all);
  }, []);

  const exportAll = () => {
    const data: any = {};
    items.forEach((item) => { data[item.type] = item.data; });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "content-factory-export.json"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs mb-4">✅ 完成</div>
        <h1 className="text-2xl font-extrabold mb-2">内容库</h1>
        <p className="text-neutral-500 text-sm">所有生成的内容都在这里，可查看、复制、复用</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <Library className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
          <p className="text-neutral-500 mb-4">内容库是空的</p>
          <Link href="/content-factory/brand">
            <Button variant="primary">开始创建内容</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-8">
            {items.map((item) => (
              <div key={item.type} className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-neutral-900 flex items-center justify-center shrink-0">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{item.label}</div>
                  <div className="text-xs text-neutral-500 mt-0.5 truncate">
                    {item.type === "brand"
                      ? `${item.data.name} · ${item.data.city} · ${item.data.industry}`
                      : item.type === "topic"
                      ? item.data.title
                      : item.type === "script"
                      ? `${item.data.style}风格 · ${item.data.fullScript.length}字`
                      : item.type === "video"
                      ? `状态: ${item.data.status} · ${item.data.id}`
                      : item.type === "content"
                      ? `${item.data.titles.length}个标题 · ${item.data.hashtags.length}个标签`
                      : `${item.data.items?.length || 0}条发布计划`}
                  </div>
                </div>
                <span className="text-[10px] px-2 py-1 rounded bg-green-500/10 text-green-400 shrink-0">已保存</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button onClick={exportAll} variant="outline" size="lg">
              <Download className="w-4 h-4" /> 导出全部内容 (JSON)
            </Button>
            <Link href="/content-factory/brand">
              <Button variant="primary" size="lg">
                <Sparkles className="w-4 h-4" /> 创建新内容 <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
