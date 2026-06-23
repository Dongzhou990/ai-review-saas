"use client";

import {
  MessageSquare,
  TrendingUp,
  Sparkles,
  Shield,
  ClipboardList,
  Heart,
} from "lucide-react";

const features = [
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "差评来了，10 秒回好",
    desc: "粘贴差评，AI 自动生成真诚回复。选好语气就生成，复制粘贴就能发——再也不用憋半小时。",
    color: "text-blue-400 bg-blue-500/10",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "差评归因，看懂问题在哪",
    desc: "AI 分析近期差评规律——是服务态度退步了？还是换的产品客人不适应？不凭感觉，有数据。",
    color: "text-indigo-400 bg-indigo-500/10",
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "好评邀约，多拿好评",
    desc: "生成适合微信发给客人的邀评文案。做完项目发一条，满意客人主动帮你写好评。",
    color: "text-cyan-400 bg-cyan-500/10",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "差评危机，提前预警",
    desc: "差评突然变多？AI 第一时间提醒你，并告诉你主要问题在哪。不等评分掉下去才后悔。",
    color: "text-rose-400 bg-rose-500/10",
  },
  {
    icon: <ClipboardList className="w-5 h-5" />,
    title: "每周周报，一眼看清",
    desc: "每周自动生成口碑周报：差评汇总、主要问题、改进建议。老板花 2 分钟扫一眼就够了。",
    color: "text-amber-400 bg-amber-500/10",
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: "像真人在说话，不像机器",
    desc: "每条回复都针对差评内容生成。客人说等太久就回等太久，说效果不好就回效果。不是千篇一律的模板。",
    color: "text-pink-400 bg-pink-500/10",
  },
];

export function FeatureSection() {
  return (
    <section id="features" className="bg-black py-16 sm:py-20">
      <div className="max-w-lg mx-auto px-5">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">
            不只会回差评
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold">
            更帮你看懂<span className="text-neutral-400">问题在哪</span>
          </h2>
          <p className="mt-3 text-sm text-neutral-500">
            不是一个"回差评的工具"，是一个帮你管好门店口碑的助手
          </p>
        </div>

        <div className="space-y-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex gap-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-800/50"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${f.color}`}
              >
                {f.icon}
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
