import { generateMeetingMinutes } from "@/lib/ai-meeting";
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

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan, daily_reply_limit")
      .eq("user_id", user.id)
      .single();

    if (sub) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count } = await supabase
        .from("meetings")
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
    const { content, title, language } = body;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { error: "缺少必要参数: content" },
        { status: 400 }
      );
    }

    const result = await generateMeetingMinutes({
      content: content.trim(),
      title: title?.trim(),
      language: language || "zh",
    });

    return NextResponse.json({ meeting: result });
  } catch (error: any) {
    const msg = error?.message || String(error);
    console.error("Meeting minutes generation failed:", msg);
    return NextResponse.json(
      { error: `AI 生成失败: ${msg}` },
      { status: 500 }
    );
  }
}
