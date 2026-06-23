import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { verified: false, error: "请输入正确的手机号" },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabase();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("paid_phones")
      .select("phone, expires_at")
      .eq("phone", phone)
      .maybeSingle();

    if (error) {
      console.error("verify-phone DB error:", error);
      return NextResponse.json(
        { verified: false, error: "验证失败，请稍后重试" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ verified: false, error: "该手机号未开通付费" });
    }

    // Check if expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return NextResponse.json({
        verified: false,
        error: "您的体验已过期，请续费",
        expired: true,
      });
    }

    return NextResponse.json({
      verified: true,
      expiresAt: data.expires_at,
    });
  } catch (error: any) {
    console.error("verify-phone error:", error);
    return NextResponse.json(
      { verified: false, error: "验证失败" },
      { status: 500 }
    );
  }
}
