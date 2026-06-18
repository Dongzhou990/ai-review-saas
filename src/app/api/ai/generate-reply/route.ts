import { generateAIReply } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "请先登录" },
        { status: 401 }
      );
    }

    // 检查用户套餐和使用限制
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan, daily_reply_limit")
      .eq("user_id", user.id)
      .single();

    if (sub) {
      // 统计今日已用次数
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count } = await supabase
        .from("replies")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", today.toISOString());

      if (count && count >= sub.daily_reply_limit) {
        return NextResponse.json(
          {
            error:
              sub.plan === "free"
                ? "免费版今日次数已用完，请升级到 Pro 版获取无限次数"
                : "今日次数已达上限",
            upgrade: sub.plan === "free",
          },
          { status: 402 }
        );
      }
    }

    const body = await request.json();
    const { reviewContent, rating, reviewerName, productName, tone, language } =
      body;

    if (!reviewContent || rating === undefined || !reviewerName) {
      return NextResponse.json(
        { error: "缺少必要参数: reviewContent, rating, reviewerName" },
        { status: 400 }
      );
    }

    const reply = await generateAIReply({
      reviewContent,
      rating,
      reviewerName,
      productName,
      tone: tone || "professional",
      language: language || "zh",
    });

    return NextResponse.json({ reply });
  } catch (error: any) {
    const msg = error?.message || String(error);
    console.error("AI reply generation failed:", msg);
    return NextResponse.json(
      { error: `AI 生成失败: ${msg}` },
      { status: 500 }
    );
  }
}
