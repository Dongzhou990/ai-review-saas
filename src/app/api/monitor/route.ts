import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 模拟实时数据源（可替换为真实爬虫/API）
const MOCK_PLATFORMS = ["大众点评", "美团", "小红书", "抖音"];

function generateMockItem(platform: string, index: number) {
  const reviewTypes = [
    { text: "做了个美甲，三天就掉了，太差了", rating: 1, type: "差评" },
    { text: "服务态度特别差，等了半小时才轮到我", rating: 1, type: "差评" },
    { text: "效果还不错，就是价格有点贵，有没有优惠？", rating: 3, type: "咨询" },
    { text: "请问怎么预约啊？第一次来不太懂", rating: 4, type: "咨询" },
    { text: "太好看了！小姐姐超温柔，下次还来", rating: 5, type: "好评" },
    { text: "朋友推荐来的，果然没失望，强烈推荐", rating: 5, type: "好评" },
    { text: "加微信领优惠是真的吗？", rating: 3, type: "咨询" },
    { text: "卫生条件不行，不会再来了", rating: 1, type: "差评" },
    { text: "染发颜色和图片完全不一样，气死了", rating: 1, type: "差评" },
    { text: "技师很专业，给的建议也中肯", rating: 5, type: "好评" },
    { text: "想了解一下你们家脱毛项目", rating: 4, type: "咨询" },
    { text: "广告垃圾", rating: 1, type: "垃圾" },
  ];

  const t = reviewTypes[index % reviewTypes.length];
  return {
    id: Date.now() + index,
    platform,
    content: t.text,
    rating: t.rating,
    type: t.type, // AI 自动分类
    priority: t.type === "差评" ? "high" : t.type === "咨询" ? "medium" : "low",
    author: `用户${Math.random().toString(36).slice(2, 6)}`,
    time: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    url: `https://${platform === "小红书" ? "xiaohongshu" : platform === "大众点评" ? "dianping" : platform === "美团" ? "meituan" : "douyin"}.com/review/${index}`,
  };
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") || "all"; // all | negative | inquiry | positive | spam
  const platform = searchParams.get("platform") || "all";
  const limit = parseInt(searchParams.get("limit") || "20");

  // 生成模拟实时数据（实际接真实 API）
  let items = [];
  for (let i = 0; i < limit; i++) {
    const plat = platform === "all"
      ? MOCK_PLATFORMS[Math.floor(Math.random() * MOCK_PLATFORMS.length)]
      : platform;
    items.push(generateMockItem(plat, i));
  }

  // AI 筛选
  if (filter !== "all") {
    const typeMap: Record<string, string> = {
      negative: "差评",
      inquiry: "咨询",
      positive: "好评",
      spam: "垃圾",
    };
    items = items.filter((item) => item.type === typeMap[filter]);
  }

  // 按优先级排序：紧急差评 > 咨询 > 好评 > 垃圾
  const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
  items.sort((a, b) => {
    if (a.priority !== b.priority) return priorityOrder[a.priority] - priorityOrder[b.priority];
    return new Date(b.time).getTime() - new Date(a.time).getTime();
  });

  // 统计
  const stats = {
    total: items.length,
    negative: items.filter((i) => i.type === "差评").length,
    inquiry: items.filter((i) => i.type === "咨询").length,
    positive: items.filter((i) => i.type === "好评").length,
    spam: items.filter((i) => i.type === "垃圾").length,
    highPriority: items.filter((i) => i.priority === "high").length,
  };

  return NextResponse.json({ items, stats });
}

// 手动刷新/抓取
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  // 这里接入真实抓取逻辑
  // 例如：调用 BrightData / ScrapingBee API 抓取最新评论
  return NextResponse.json({
    status: "ok",
    message: "数据刷新中，请稍后查看结果",
    timestamp: new Date().toISOString(),
  });
}
