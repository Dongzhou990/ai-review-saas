"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Star, MapPin, AlertTriangle, Check, ClipboardList, ExternalLink, Search } from "lucide-react";
import Link from "next/link";

// Scoring criteria
const SCORE_CRITERIA = [
  { weight: 30, label: "有未回复差评（3条以上）", icon: "🔥", desc: "最直接的痛点信号，越多越痛" },
  { weight: 25, label: "评分 3.5-4.0 之间", icon: "⭐", desc: "不好不坏的店最需要改善口碑" },
  { weight: 15, label: "有竞品在周边", icon: "🏪", desc: "同商圈3家以上同类店，竞争焦虑强" },
  { weight: 15, label: "差评回复敷衍", icon: "😐", desc: "回了但只说'抱歉'，说明想回但不会回" },
  { weight: 10, label: "经营1年以上", icon: "⏱️", desc: "新店可能还在调整期，老店更稳定" },
  { weight: 5, label: "客单价 ¥200+", icon: "💰", desc: "客单价高的店，差评代价更大" },
];

// Industry prospecting guides
const INDUSTRY_GUIDES: Record<string, {
  dianpingSearch: string;
  keywords: string[];
  redFlags: string[];
  greenFlags: string[];
  targetAreas: string[];
}> = {
  "皮肤管理": {
    dianpingSearch: "皮肤管理",
    keywords: ["水光", "小气泡", "光子", "祛痘", "补水", "清洁", "M22", "海菲秀"],
    redFlags: ["差评说没效果", "差评说过敏/烂脸", "差评说价格不透明", "差评说推销办卡"],
    greenFlags: ["评分3.5-4.0", "3+条差评没回", "旁边有竞品", "老板自己回复的好评很用心"],
    targetAreas: ["万达/万象城/商圈", "写字楼集中区", "高档小区底商", "大学城周边"],
  },
  "美甲美睫": {
    dianpingSearch: "美甲",
    keywords: ["日式美甲", "延长甲", "美睫", "款式", "翘边", "持久度"],
    redFlags: ["差评说颜色跟色板不一样", "差评说三天就掉", "差评说卫生差", "差评说排队久"],
    greenFlags: ["评分3.5-4.2", "款式更新快", "客流量大评价多", "有小红书/抖音账号"],
    targetAreas: ["商场/综合体", "大学城", "年轻人聚集区", "地铁口周边"],
  },
  "美容美发": {
    dianpingSearch: "美发",
    keywords: ["烫发", "染发", "剪发", "护理", "造型", "参考图"],
    redFlags: ["差评说发型跟参考图差太多", "差评说烫坏了", "差评说价格贵不值", "差评说等太久"],
    greenFlags: ["评分3.5-4.0", "有明星发型师", "店铺开了2年以上", "周边竞争密集"],
    targetAreas: ["商圈核心区", "社区密集型街道", "地铁沿线", "大学城"],
  },
  "轻医美": {
    dianpingSearch: "轻医美",
    keywords: ["水光针", "热玛吉", "皮秒", "除皱", "填充", "瘦脸针"],
    redFlags: ["差评说没效果", "差评说术后反应", "差评说医生不专业", "差评说价格欺诈"],
    greenFlags: ["评分3.5-4.2", "单店非连锁", "老板自己是医生", "客单价高"],
    targetAreas: ["CBD/金融区", "高端住宅区", "医美诊所集中区", "大型商圈"],
  },
};

function generateDailyPlan(industry: string) {
  const guide = INDUSTRY_GUIDES[industry] || INDUSTRY_GUIDES["皮肤管理"];
  const today = new Date().toLocaleDateString("zh-CN", { month: "long", day: "numeric", weekday: "long" });

  return {
    date: today,
    goal: `今天找 5 家${industry}店`,
    searchQueries: [
      `${guide.dianpingSearch}`,
      ...guide.keywords.slice(0, 4).map(k => `${guide.dianpingSearch} ${k}`),
    ],
    filters: "评分选 3.5-4.0，评价数 30-200，看差评有没有被认真回复",
    checklist: [
      "打开大众点评 App",
      `搜索"${guide.dianpingSearch}"，筛选评分 3.5-4.0`,
      "找到有未回复差评的门店",
      "记录店名 + 评分 + 差评条数",
      "用评分标准打分（目标 ≥60分）",
      "≥60分 → 私信 / 录入 CRM",
      "重复找够 5 家",
    ],
    scoringExample: {
      store: `某${industry}店`,
      scores: [
        { criterion: "3条未回复差评", score: 30 },
        { criterion: "评分3.7", score: 25 },
        { criterion: "周边5家同类店", score: 15 },
        { criterion: "差评回复敷衍", score: 15 },
        { criterion: "经营2年", score: 10 },
      ],
      total: 95,
      verdict: "🔥 高优先级 — 立即联系",
    },
  };
}

export default function ProspectPage() {
  const [industry, setIndustry] = useState("皮肤管理");
  const [plan, setPlan] = useState<ReturnType<typeof generateDailyPlan> | null>(null);

  const guide = INDUSTRY_GUIDES[industry] || INDUSTRY_GUIDES["皮肤管理"];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 text-gray-900">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/crm" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold">🎯 潜在客户挖掘</h1>
          </div>
        </div>

        {/* Industry selector */}
        <div className="bg-white rounded-2xl border p-4">
          <label className="text-xs text-gray-500 mb-2 block">选择目标行业</label>
          <div className="flex gap-2 flex-wrap">
            {Object.keys(INDUSTRY_GUIDES).map(k => (
              <button
                key={k}
                onClick={() => { setIndustry(k); setPlan(null); }}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  industry === k
                    ? "bg-[#D4725A] text-white border-[#D4725A]"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* Scoring criteria */}
        <div className="bg-white rounded-2xl border p-5">
          <h2 className="font-bold text-sm flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-amber-500" /> 线索评分标准（满分100）
          </h2>
          <div className="space-y-2">
            {SCORE_CRITERIA.map(c => (
              <div key={c.label} className="flex items-center justify-between text-sm p-2 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{c.icon}</span>
                  <div>
                    <span className="font-medium">{c.label}</span>
                    <span className="text-xs text-gray-400 ml-2">{c.desc}</span>
                  </div>
                </div>
                <span className="font-bold text-[#D4725A] text-xs bg-[#FDF0EB] px-2 py-0.5 rounded-full">
                  {c.weight}分
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-gray-400 flex items-center gap-1">
            <Check className="w-3 h-3 text-green-500" /> ≥60分 = 高优先级 · 50-59分 = 值得联系 · &lt;50分 = 先放放
          </div>
        </div>

        {/* Industry intelligence */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-red-50 rounded-2xl border border-red-100 p-4">
            <h3 className="font-bold text-sm text-red-700 flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4" /> 红旗信号（痛点）
            </h3>
            <ul className="space-y-1">
              {guide.redFlags.map(f => (
                <li key={f} className="text-xs text-red-600 flex items-start gap-1">
                  <span className="shrink-0 mt-0.5">•</span> {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-green-50 rounded-2xl border border-green-100 p-4">
            <h3 className="font-bold text-sm text-green-700 flex items-center gap-2 mb-2">
              <Check className="w-4 h-4" /> 绿旗信号（好目标）
            </h3>
            <ul className="space-y-1">
              {guide.greenFlags.map(f => (
                <li key={f} className="text-xs text-green-600 flex items-start gap-1">
                  <span className="shrink-0 mt-0.5">•</span> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Target areas */}
        <div className="bg-white rounded-2xl border p-4">
          <h3 className="font-bold text-sm flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-[#D4725A]" /> 重点搜索区域
          </h3>
          <div className="flex flex-wrap gap-2">
            {guide.targetAreas.map(a => (
              <span key={a} className="px-3 py-1.5 rounded-full bg-gray-100 text-xs text-gray-700">
                📍 {a}
              </span>
            ))}
          </div>
        </div>

        {/* Generate daily plan */}
        <Button
          onClick={() => setPlan(generateDailyPlan(industry))}
          className="w-full bg-[#D4725A] text-lg"
          size="lg"
        >
          <ClipboardList className="w-5 h-5" /> 生成本日挖掘计划
        </Button>

        {/* Daily plan output */}
        {plan && (
          <div className="space-y-4">
            {/* Mission card */}
            <div className="bg-gradient-to-r from-[#D4725A] to-[#C05A42] rounded-2xl p-6 text-white">
              <p className="text-sm opacity-80">{plan.date}</p>
              <h2 className="text-2xl font-bold mt-1">{plan.goal}</h2>
              <p className="text-sm opacity-80 mt-2">{plan.filters}</p>
            </div>

            {/* Search queries */}
            <div className="bg-white rounded-2xl border p-4">
              <h3 className="font-bold text-sm flex items-center gap-2 mb-3">
                <Search className="w-4 h-4" /> 今天搜这些关键词
              </h3>
              <div className="flex flex-wrap gap-2">
                {plan.searchQueries.map(q => (
                  <span key={q} className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                    {q}
                  </span>
                ))}
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-white rounded-2xl border p-4">
              <h3 className="font-bold text-sm flex items-center gap-2 mb-3">
                <Check className="w-4 h-4 text-green-500" /> 执行清单（30分钟内完成）
              </h3>
              <div className="space-y-2">
                {plan.checklist.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs flex items-center justify-center shrink-0 font-bold">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scoring example */}
            <div className="bg-white rounded-2xl border p-4">
              <h3 className="font-bold text-sm mb-3">📊 评分示例：{plan.scoringExample.store}</h3>
              <div className="space-y-1.5 mb-3">
                {plan.scoringExample.scores.map(s => (
                  <div key={s.criterion} className="flex justify-between text-sm">
                    <span className="text-gray-600">{s.criterion}</span>
                    <span className="font-bold text-[#D4725A]">+{s.score}</span>
                  </div>
                ))}
                <div className="border-t pt-1.5 flex justify-between text-sm font-bold">
                  <span>总分</span>
                  <span className="text-lg">{plan.scoringExample.total}分</span>
                </div>
              </div>
              <div className="bg-green-50 text-green-700 text-sm font-bold px-3 py-2 rounded-lg text-center">
                {plan.scoringExample.verdict}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Link href="/crm/scripts" className="flex-1">
                <Button variant="outline" className="w-full">
                  📝 打开话术生成器
                </Button>
              </Link>
              <Link href="/crm" className="flex-1">
                <Button className="w-full bg-[#D4725A]">
                  📊 录入 CRM
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
