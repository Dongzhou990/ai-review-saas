import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    // 检查是否已经是 Pro
    const { data: existingSub } = await supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", user.id)
      .single();

    if (existingSub?.plan === "pro" && existingSub?.status === "active") {
      return NextResponse.json({ success: true, message: "已经是 Pro 会员" });
    }

    // 检查当天是否已经激活过（防刷）
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: todayActivations } = await supabase
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("updated_at", today.toISOString());

    if (todayActivations && todayActivations > 3) {
      return NextResponse.json({ error: "激活次数过多，请联系客服" }, { status: 429 });
    }

    // 激活 Pro（信任先行模式）
    // 30天有效期，到期后降级为免费版
    const now = new Date();
    const expireAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const { error: upsertError } = await supabase.from("subscriptions").upsert({
      user_id: user.id,
      plan: "pro",
      status: "active",
      daily_reply_limit: 999,  // 无限
      store_limit: 99,
      current_period_start: now.toISOString(),
      current_period_end: expireAt.toISOString(),
      updated_at: now.toISOString(),
    }, { onConflict: "user_id" });

    if (upsertError) {
      throw new Error(upsertError.message);
    }

    // 记录付款记录（供后续核验）
    const body = await request.json().catch(() => ({}));
    try {
      await supabase.from("replies").insert({
        user_id: user.id,
        review_id: "00000000-0000-0000-0000-000000000000",
        content: `Pro 版激活 - 微信支付¥99 - 信任激活 - 有效期至${expireAt.toLocaleDateString("zh-CN")} - 付款备注: ${body.paymentNote || "无"}`,
        tone: "professional",
        status: "draft",
        is_ai_generated: false,
      });
    } catch {}  // 记录失败不影响主流程

    return NextResponse.json({
      success: true,
      message: "Pro 版已开通！有效期 30 天，到期后可续费。",
      expireAt: expireAt.toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "开通失败" }, { status: 500 });
  }
}
