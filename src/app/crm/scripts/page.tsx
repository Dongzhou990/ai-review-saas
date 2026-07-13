"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Sparkles, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

// Industry-specific templates
const INDUSTRY_CONFIG: Record<string, {
  painPoints: string[];
  valueProps: string[];
  demoExample: string;
}> = {
  "皮肤管理": {
    painPoints: ["差评说没效果", "过敏/不适投诉", "价格贵不值", "排队等太久"],
    valueProps: ["一条差评劝退几十个新客", "AI回得比人工更真诚", "10秒一条，不耽误你服务客人"],
    demoExample: "做完水光没效果，1680白花了——这种差评AI怎么回？",
  },
  "美甲美睫": {
    painPoints: ["颜色跟色板差太多", "三天就掉了", "排队等太久", "卫生问题"],
    valueProps: ["新客100%先看评价再预约", "一条差评可能丢10个新客", "回了比不回多30%到店率"],
    demoExample: "做了指甲三天就翘边——这种差评AI怎么回？",
  },
  "美容美发": {
    painPoints: ["剪得跟参考图差太多", "烫染效果不好", "价格不值", "服务态度差"],
    valueProps: ["你店里一个新客值500-2000", "差评回复直接影响评分", "代运营收3000，我们收99"],
    demoExample: "烫完像大妈完全不是我要的效果——这种差评AI怎么回？",
  },
  "轻医美": {
    painPoints: ["做了没效果", "术后反应严重", "价格不透明", "医生技术质疑"],
    valueProps: ["客单价高，差评代价大", "专业回复能挽回信任", "比请客服便宜100倍"],
    demoExample: "打完水光针一点用没有还过敏了——这种差评AI怎么回？",
  },
  "餐饮": {
    painPoints: ["菜难吃", "等了太久", "服务态度差", "卫生问题"],
    valueProps: ["差评直接影响排名", "回复好的差评变加分项", "不用再憋半小时想怎么回"],
    demoExample: "等了40分钟菜还是凉的——这种差评AI怎么回？",
  },
  "酒店民宿": {
    painPoints: ["房间不干净", "隔音太差", "前台态度差", "图片与实际不符"],
    valueProps: ["携程/美团排名靠评价", "一条差评影响一个月的单", "专业回复提高转化"],
    demoExample: "房间有味道，空调坏了没人修——这种差评AI怎么回？",
  },
};

function generateScripts(industry: string, storeName: string, rating: string) {
  const config = INDUSTRY_CONFIG[industry] || INDUSTRY_CONFIG["皮肤管理"];
  const name = storeName || "您的门店";
  const stars = rating || "3.8";

  return {
    firstContact: {
      title: "首次私信（大众点评/小红书）",
      content: `老板你好，看到你们店在大众点评上${stars}分，有几条差评一直没回——

我自己做了个AI工具，把差评粘贴进去10秒就能出一段真诚回复。不是那种"亲亲抱歉"的模板，是真的针对差评内容回应、让客人看了消气的那种。

你可以在微信打开免费用：每天3条，不好用不花钱。

要不要试试？我把链接发你。`,
    },
    followup2: {
      title: "第2天跟进（对方没回复）",
      content: `老板，上次发的工具试过了吗？😊

说实话，${config.painPoints[0]}这种差评，对${industry}店影响挺大的。新客搜到你们店，看到差评没人回，可能就划走找别家了。

你试试把那条差评粘贴进去，看看AI怎么回——反正免费的。`,
    },
    followup4: {
      title: "第4天跟进（试过但没付钱）",
      content: `老板，免费3条用完了吧？感觉怎么样？

说真的，¥99一个月，你店里少丢一个新客就回本了。${config.valueProps[0]}。

而且不满意随时退，你没有任何风险。要不先开一个月试试？我帮你开通。`,
    },
    demoScript: {
      title: "当面演示脚本",
      content: `【开场】
"老板，我就耽误你2分钟。你现在打开大众点评，随便找一条你们店的差评——"

【演示】
"你看，我把它粘贴进去，选个风格……"

【等待10秒AI生成】

"这就是AI帮你写的。你感受一下，像不像真人说的？"

【收尾】
"每天免费3条。¥99/月无限用，不满意退。你店里一个新客值多少钱？少说几百上千吧？这个工具帮你多留住一个新客就回本了。"`,
    },
    pricing: {
      title: "报价话术",
      content: `【算账法】
"姐，你店里一个新客平均消费多少？${config.valueProps[2]}

¥99也就一顿饭钱。你用了这个工具，只要帮你多留住一个新客，就已经回本了。要是没效果，钱退你。"

【对比法】
"现在请代运营帮你回差评，一个月少说¥2000-5000。

我这个工具¥99自己就能搞定，不是让你多花钱，是让你省钱。"

【降维法（犹豫时）】
"这样，你先不急着买月付。¥99先用一个月，觉得有用再续。没用？钱退你。就当交个朋友。"`,
    },
    objections: {
      title: "常见拒绝应对",
      content: `【"我看看再说"】
"行，链接发你。你先免费试3条。过两天我再来问你用得怎么样。"

【"太贵了"】
"¥99一个月，你店里一个新客值多少？少丢一个新客就回本了。而且不满意退。"

【"我不会用"】
"比发微信还简单。粘贴→点生成→复制。就三步，我教你。"

【"我这本来就有人回"】
"那挺好！但你们的人回一条要多久？这个10秒一条。省下来的时间多服务几个客人不好吗？"

【"有效果吗"】
"你先免费试3条，自己看看效果。我说再好没用，你看了就知道。"`,
    },
  };
}

export default function ScriptsPage() {
  const [industry, setIndustry] = useState("皮肤管理");
  const [storeName, setStoreName] = useState("");
  const [rating, setRating] = useState("3.8");
  const [scripts, setScripts] = useState<ReturnType<typeof generateScripts> | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null);

  const handleGenerate = () => {
    setScripts(generateScripts(industry, storeName, rating));
  };

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(key);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 text-gray-900">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/crm" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold">📝 销售话术生成器</h1>
          </div>
        </div>

        {/* Input form */}
        <div className="bg-white rounded-2xl border p-5 space-y-4">
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">行业</label>
              <select value={industry} onChange={e => setIndustry(e.target.value)}
                className="w-full h-10 rounded-lg border px-3 text-sm">
                {Object.keys(INDUSTRY_CONFIG).map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">店名（可选）</label>
              <input value={storeName} onChange={e => setStoreName(e.target.value)}
                placeholder="如：XX皮肤管理" className="w-full h-10 rounded-lg border px-3 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">评分（可选）</label>
              <input value={rating} onChange={e => setRating(e.target.value)}
                placeholder="3.8" className="w-full h-10 rounded-lg border px-3 text-sm" />
            </div>
          </div>
          <Button onClick={handleGenerate} className="w-full bg-[#D4725A]">
            <Sparkles className="w-4 h-4" /> 生成全套话术
          </Button>
        </div>

        {/* Generated scripts */}
        {scripts && (
          <div className="space-y-4">
            {Object.entries(scripts).map(([key, script]) => (
              <div key={key} className="bg-white rounded-2xl border p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm">{script.title}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyText(script.content, key)}
                    className="text-xs"
                  >
                    {copiedIdx === key ? (
                      <><Check className="w-3 h-3" /> 已复制</>
                    ) : (
                      <><Copy className="w-3 h-3" /> 复制</>
                    )}
                  </Button>
                </div>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed bg-gray-50 rounded-xl p-4">
                  {script.content}
                </pre>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!scripts && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-3xl mb-3">📝</p>
            <p>选择行业 → 填店名 → 点"生成全套话术"</p>
            <p className="text-xs mt-1">会自动生成：私信、跟进、演示、报价、拒绝应对</p>
          </div>
        )}
      </div>
    </div>
  );
}
