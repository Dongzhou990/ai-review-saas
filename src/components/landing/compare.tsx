"use client";

import { X, Check } from "lucide-react";

const rows = [
  {
    label: "回差评",
    without: "憋半小时，每条都写不一样",
    with: "10秒生成真诚回复，每条都不同",
  },
  {
    label: "看懂问题",
    without: "凭感觉猜，不知道哪里出问题",
    with: "AI分析归因，服务还是技术问题一目了然",
  },
  {
    label: "好评量",
    without: "等客人主动写，一个月没几条",
    with: "AI邀评文案，满意客人更愿意写",
  },
  {
    label: "时间精力",
    without: "每天花1小时翻评价想回复",
    with: "每天5分钟看一眼口碑总览",
  },
];

export function CompareSection() {
  return (
    <section id="compare" className="bg-neutral-950 py-16 sm:py-20">
      <div className="max-w-lg mx-auto px-5">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">
            有了口碑助手
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold">
            和以前的<span className="text-neutral-400">差别在哪？</span>
          </h2>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-3 gap-2 mb-2 px-2">
          <div className="text-xs font-medium text-neutral-500" />
          <div className="text-xs font-medium text-neutral-500 text-center flex items-center justify-center gap-1">
            <X className="w-3 h-3 text-red-500" />
            以前
          </div>
          <div className="text-xs font-medium text-blue-400 text-center flex items-center justify-center gap-1">
            <Check className="w-3 h-3" />
            现在
          </div>
        </div>

        {/* Rows */}
        <div className="space-y-2">
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-neutral-900/50 border border-neutral-800/30"
            >
              <div className="text-sm font-medium self-center">{row.label}</div>
              <div className="text-xs text-neutral-500 text-center self-center leading-relaxed">
                {row.without}
              </div>
              <div className="text-xs text-neutral-200 text-center self-center leading-relaxed">
                {row.with}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
