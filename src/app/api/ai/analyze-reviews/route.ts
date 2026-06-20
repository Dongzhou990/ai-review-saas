import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);

    const { data: reviews } = await supabase
      .from("reviews")
      .select("rating, content, buyer_name, product_name, created_at, platform")
      .eq("user_id", user.id)
      .gte("created_at", threeMonthsAgo.toISOString())
      .order("created_at", { ascending: false })
      .limit(100);

    if (!reviews || reviews.length === 0) {
      return NextResponse.json({
        totalReviews: 0,
        badReviewCount: 0,
        badReviewRate: 0,
        categories: [],
        summary: "暂无评论数据。去处理差评时，粘贴评论进来就会自动记录了。",
        suggestions: ["先去处理一条差评试试"],
      });
    }

    const badReviews = reviews.filter((r) => r.rating <= 3);
    const badRate = Math.round((badReviews.length / reviews.length) * 100);

    if (badReviews.length < 2) {
      return NextResponse.json({
        totalReviews: reviews.length,
        badReviewCount: badReviews.length,
        badReviewRate: badRate,
        categories: [],
        summary: `近 90 天共 ${reviews.length} 条评论，差评仅 ${badReviews.length} 条，门店口碑良好。继续保持！`,
        suggestions: ["继续保持现有服务质量", "鼓励满意顾客写好评，增加好评数量"],
      });
    }

    // Try AI-powered analysis first
    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.DEEPSEEK_API_KEY;
    if (apiKey) {
      try {
        const baseUrl = process.env.ANTHROPIC_BASE_URL || "";
        const isDeepSeek = baseUrl.includes("deepseek");

        const badReviewsText = badReviews
          .map((r) => `【评分: ${"⭐".repeat(r.rating)}】${r.content}`)
          .join("\n---\n");

        const systemPrompt = `你是一个中国本地生活门店的运营分析顾问。你帮餐饮、酒店、美容门店的老板分析他们的差评数据。

你的分析必须：
1. 用老板看得懂的大白话
2. 从差评中找出真正的门店问题，不是简单统计
3. 归类差评主题（如服务态度、卫生、等待时间、口味/品质、价格、环境设施等）
4. 给 actionable 的改进建议
5. 总结要像一个有经验的门店运营顾问说的话

输出格式：严格 JSON（不要带 markdown 标记）
{
  "summary": "一段 50-80 字的概况分析，先讲结论，再讲最突出的问题",
  "categories": [
    { "name": "问题类别名", "count": 数字, "percentage": 百分比数字 }
  ],
  "suggestions": ["具体建议1", "具体建议2", "具体建议3"],
  "detailedAnalysis": "一段更详细的分析（可选，100-150字）"
}`;

        const userPrompt = `这些是近 90 天该门店收到的差评（${badReviews.length} 条，共 ${reviews.length} 条评论）：

${badReviewsText}

请分析这些差评，找出核心问题。`;

        let content: string;
        if (isDeepSeek) {
          const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }], max_tokens: 1200, temperature: 0.3 }),
          });
          const data = await res.json();
          content = data.choices[0].message.content;
        } else {
          const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
            body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1200, system: systemPrompt, messages: [{ role: "user", content: userPrompt }] }),
          });
          const data = await res.json();
          content = data.content[0].text;
        }

        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return NextResponse.json({
            totalReviews: reviews.length,
            badReviewCount: badReviews.length,
            badReviewRate: badRate,
            categories: parsed.categories || [],
            summary: parsed.summary || "",
            suggestions: parsed.suggestions || [],
            detailedAnalysis: parsed.detailedAnalysis || "",
          });
        }
      } catch {
        // AI failed, fall through to rule-based
      }
    }

    // Rule-based fallback (kept as backup)
    const keywordMap: Record<string, string[]> = {
      "服务态度": ["态度", "服务", "前台", "服务员", "店员", "不耐烦", "冷淡", "凶", "骂"],
      "卫生状况": ["脏", "卫生", "异味", "不干净", "发霉", "灰尘", "蟑螂", "虫子"],
      "等待时间": ["慢", "等", "排队", "太久", "半天", "速度", "效率"],
      "口味/品质": ["难吃", "咸", "淡", "味道", "口感", "质量", "不好吃", "差"],
      "价格": ["贵", "不值", "价格", "收费", "坑", "性价比"],
      "环境设施": ["环境", "装修", "空调", "噪音", "隔音", "停车", "位置"],
    };

    const categories: { name: string; count: number; percentage: number }[] = [];
    for (const [name, words] of Object.entries(keywordMap)) {
      const count = badReviews.filter((r: any) => words.some((w: string) => (r.content || "").includes(w))).length;
      if (count > 0) {
        categories.push({ name, count, percentage: Math.round((count / badReviews.length) * 100) });
      }
    }
    categories.sort((a, b) => b.count - a.count);

    const topIssue = categories[0]?.name || "综合问题";
    const suggestions = categories.slice(0, 3).map(
      (c) => `重点关注「${c.name}」问题：涉及 ${c.count} 条差评（${c.percentage}%），建议本周内排查并制定整改方案。`
    );

    return NextResponse.json({
      totalReviews: reviews.length,
      badReviewCount: badReviews.length,
      badReviewRate: badRate,
      categories,
      summary: `近 90 天共 ${reviews.length} 条评论，差评 ${badReviews.length} 条（${badRate}%）。最突出问题是「${topIssue}」，建议优先处理。`,
      suggestions,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "分析失败" }, { status: 500 });
  }
}
