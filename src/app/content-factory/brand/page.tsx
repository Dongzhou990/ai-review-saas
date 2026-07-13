"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles } from "lucide-react";

const INDUSTRIES = ["美甲美睫", "皮肤管理", "美容院", "轻医美"];
const STYLES = ["温柔", "专业", "老板娘", "专家"];
const AUDIENCES = ["25-35岁上班族", "30-45岁宝妈", "18-28岁学生", "30-50岁中高端客户", "本地居民+游客"];

export default function BrandPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    city: "",
    industry: "美甲美睫" as string,
    mainService: "",
    targetAudience: "25-35岁上班族" as string,
    style: "温柔" as string,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/cf/brand", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const profile = await res.json();
    localStorage.setItem("cf_brand", JSON.stringify(profile));
    setLoading(false);
    router.push("/content-factory/topics");
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs mb-4">
          Step 1
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">创建门店画像</h1>
        <p className="text-neutral-500 text-sm">AI 需要了解你的门店，才能生成精准内容</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-neutral-300 mb-1.5 block">门店名称</label>
          <Input placeholder="如：花漾美甲工作室" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>

        <div>
          <label className="text-sm font-medium text-neutral-300 mb-1.5 block">城市</label>
          <Input placeholder="如：杭州" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
        </div>

        <div>
          <label className="text-sm font-medium text-neutral-300 mb-1.5 block">行业类型</label>
          <div className="grid grid-cols-2 gap-2">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind}
                type="button"
                onClick={() => setForm({ ...form, industry: ind })}
                className={`py-2.5 px-3 rounded-lg text-sm font-medium border transition-all ${
                  form.industry === ind
                    ? "border-blue-500 bg-blue-500/10 text-blue-400"
                    : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700"
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-neutral-300 mb-1.5 block">主推项目</label>
          <Input placeholder="如：日式美甲、小气泡清洁、热玛吉" value={form.mainService} onChange={(e) => setForm({ ...form, mainService: e.target.value })} required />
        </div>

        <div>
          <label className="text-sm font-medium text-neutral-300 mb-1.5 block">目标人群</label>
          <div className="grid grid-cols-2 gap-2">
            {AUDIENCES.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setForm({ ...form, targetAudience: a })}
                className={`py-2.5 px-3 rounded-lg text-xs font-medium border transition-all ${
                  form.targetAudience === a
                    ? "border-blue-500 bg-blue-500/10 text-blue-400"
                    : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-neutral-300 mb-1.5 block">人设风格</label>
          <div className="grid grid-cols-4 gap-2">
            {STYLES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setForm({ ...form, style: s })}
                className={`py-2.5 rounded-lg text-sm font-medium border transition-all ${
                  form.style === s
                    ? "border-blue-500 bg-blue-500/10 text-blue-400"
                    : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" variant="primary" size="xl" className="w-full" disabled={loading}>
          {loading ? "创建中..." : <><Sparkles className="w-4 h-4" /> 生成 30 条选题</>}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </Button>
      </form>
    </div>
  );
}
