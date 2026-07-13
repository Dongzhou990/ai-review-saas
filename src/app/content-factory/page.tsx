"use client";

import Link from "next/link";
import { Sparkles, FileText, Mic, Video, Calendar, Library, ArrowRight } from "lucide-react";

export default function ContentFactoryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6">
          <Sparkles className="w-4 h-4" />
          美业门店 · 自动获客内容工厂
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
          输入门店信息，自动生成
          <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            小红书获客内容
          </span>
        </h1>
        <p className="text-neutral-400 max-w-lg mx-auto">
          30条选题 → 口播脚本 → 视频任务 → 小红书内容 → 发布计划，一站式生成
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
        {[
          { href: "/content-factory/brand", icon: FileText, label: "Step 1", title: "门店画像", desc: "输入门店基本信息" },
          { href: "/content-factory/topics", icon: Sparkles, label: "Step 2", title: "30条选题", desc: "6大分类爆款选题" },
          { href: "/content-factory/scripts", icon: Mic, label: "Step 3", title: "口播脚本", desc: "3版本口播文案" },
          { href: "/content-factory/video", icon: Video, label: "Step 4", title: "视频任务", desc: "Mock 视频生成" },
          { href: "/content-factory/content", icon: FileText, label: "Step 5", title: "小红书内容", desc: "标题正文标签评论" },
          { href: "/content-factory/schedule", icon: Calendar, label: "Step 6", title: "发布计划", desc: "7天内容日历" },
          { href: "/content-factory/library", icon: Library, label: "Step 7", title: "内容库", desc: "查看与复用所有内容" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-start gap-3 p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <item.icon className="w-5 h-5 text-blue-400" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-neutral-600 mb-0.5">{item.label}</div>
              <div className="font-semibold text-sm mb-0.5 group-hover:text-white transition-colors">{item.title}</div>
              <div className="text-xs text-neutral-500">{item.desc}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-700 shrink-0 self-center group-hover:text-neutral-400 transition-colors" />
          </Link>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/content-factory/brand"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/20"
        >
          开始创建内容 <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
