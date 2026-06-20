import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    // 查询最近 7 天的评论
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { data: reviews } = await supabase
      .from("reviews")
      .select("rating, content, buyer_name, product_name, created_at, platform")
      .eq("user_id", user.id)
      .gte("created_at", weekAgo.toISOString())
      .order("created_at", { ascending: false })
      .limit(50);

    if (!reviews || reviews.length === 0) {
      return NextResponse.json({
        success: true,
        weeklyReviews: 0,
        weeklyGood: 0,
        weeklyBad: 0,
        badRate: 0,
        summary: "本周暂无评论数据。导入评论后即可生成周报。",
        topIssues: [],
        suggestions: ["导入更多评论数据，让 AI 帮你做更准确的分析"],
        replyExamples: [],
        inviteSuggestion: "",
      });
    }

    const good = reviews.filter((r) => r.rating >= 4).length;
    const bad = reviews.filter((r) => r.rating <= 2).length;
    const badRate = Math.round((bad / reviews.length) * 100);

    // Try AI-powered analysis first
    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.DEEPSEEK_API_KEY;
    if (apiKey && bad >= 2) {
      try {
        const baseUrl = process.env.ANTHROPIC_BASE_URL || "";
        const isDeepSeek = baseUrl.includes("deepseek");

        const badReviewsText = reviews
          .filter((r) => r.rating <= 3)
          .map((r) => `【${"⭐".repeat(r.rating)}】${r.content}`)
          .join("\n---\n");

        const systemPrompt = `你是中国本地生活门店的运营顾问。你帮餐饮、酒店、美容门店的老板写每周口碑周报。

老板是门店经营者，不是互联网从业者，所以你的报告必须：
1. 用老板看得懂的大白话，不要说"赋能""闭环""颗粒度"这类词
2. 先讲结论——本周口碑怎么样，好在哪，差在哪
3. 再讲问题——差评集中在哪几个方面
4. 给改进建议——老板这周应该重点干什么
5. 给可用的回复参考——可以直接复制用的差评回复
6. 给邀评建议——本周怎么多拿好评

输出要求：
- 总结：50-100 字，先讲结论
- 问题：列出 top 3 差评问题方向，每个给占比
- 改进建议：3-5 条，每条是老板这周能干的事
- 回复参考：2-3 条针对本周常见差评的可直接用的回复
- 邀评建议：1 条本周邀评文案建议

输出格式：严格 JSON
{
  "summary": "本周概况总结",
  "topIssues": [{ "name": "问题名称", "count": 数字, "percentage": "百分比" }],
  "suggestions": ["建议1", "建议2"],
  "replyExamples": [{ "scenario": "场景描述", "reply": "回复内容" }],
  "inviteSuggestion": "邀评建议文案"
}`;

        const userPrompt = `以下是 ${reviews.length} 条评论，其中差评 ${bad} 条。请生成周报：

好评示例：
${reviews.filter(r => r.rating >= 4).slice(0, 3).map(r => `【好评】${r.content}`).join("\n")}

差评内容：
${badReviewsText}`;

        let content: string;
        if (isDeepSeek) {
          const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }], max_tokens: 1500, temperature: 0.7 }),
          });
          const data = await res.json();
          content = data.choices[0].message.content;
        } else {
          const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
            body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1500, system: systemPrompt, messages: [{ role: "user", content: userPrompt }] }),
          });
          const data = await res.json();
          content = data.content[0].text;
        }

        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return NextResponse.json({
            success: true,
            weeklyReviews: reviews.length,
            weeklyGood: good,
            weeklyBad: bad,
            badRate,
            ...parsed,
          });
        }
      } catch {
        // AI failed, fall through to rule-based
      }
    }

    // Rule-based fallback
    const keywordMap: Record<string, string[]> = {
      "服务态度": ["态度", "服务", "前台", "服务员", "店员", "不耐烦", "冷淡"],
      "卫生状况": ["脏", "卫生", "异味", "不干净", "发霉", "灰尘"],
      "等待时间": ["慢", "等", "排队", "太久", "半天", "速度"],
      "口味/品质": ["难吃", "咸", "淡", "味道", "口感", "质量"],
      "价格": ["贵", "不值", "价格", "收费"],
    };

    const badReviews = reviews.filter((r) => r.rating <= 3);
    const topIssues: { name: string; count: number; percentage: string }[] = [];

    for (const [name, words] of Object.entries(keywordMap)) {
      const count = badReviews.filter((r) => words.some((w) => (r.content || "").includes(w))).length;
      if (count > 0) {
        topIssues.push({
          name,
          count,
          percentage: `${Math.round((count / Math.max(badReviews.length, 1)) * 100)}%`,
        });
      }
    }
    topIssues.sort((a, b) => b.count - a.count);

    const top3 = topIssues.slice(0, 3);
    const suggestions = top3.length > 0
      ? top3.map((t) => `重点关注「${t.name}」：本周 ${t.count} 条差评涉及该问题（${t.percentage}），建议安排专人排查整改。`)
      : ["本周差评较少，继续保持！建议鼓励满意顾客写好评。"]

    const replyExamples = top3.slice(0, 2).map((t) => ({
      scenario: `针对「${t.name}」问题的回复参考`,
      reply: `非常抱歉给您带来了不好的体验。关于您提到的${t.name}问题，我们已经第一时间进行了整改。欢迎您下次再来体验，我们一定给您更好的服务。如有任何问题，可随时联系我们。`,
    }));

    const summary = bad === 0
      ? `本周共 ${reviews.length} 条评论，全部是好评！门店口碑良好，继续保持。`
      : `本周共 ${reviews.length} 条评论，好评 ${good} 条，差评 ${bad} 条（占比 ${badRate}%）。${
          top3.length > 0 ? `主要问题是「${top3[0].name}」，建议优先处理。` : ""
        }`;

    return NextResponse.json({
      success: true,
      weeklyReviews: reviews.length,
      weeklyGood: good,
      weeklyBad: bad,
      badRate,
      summary,
      topIssues: top3,
      suggestions,
      replyExamples,
      inviteSuggestion: bad > good
        ? "本周差评较多，建议先集中处理差评。等差评处理后，再对满意的老客进行邀评。"
        : "本周好评较多！建议给消费过的老客人发条微信，感谢他们的支持，顺便请他们去平台写个好评。",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "生成周报失败" }, { status: 500 });
  }
}
