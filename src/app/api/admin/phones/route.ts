import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

function auth(req: NextRequest): boolean {
  if (!ADMIN_SECRET) return false; // Not configured → deny all
  const token = req.headers.get("x-admin-token") || "";
  return token === ADMIN_SECRET;
}

// Minimal type for the paid_phones table (Supabase types not generated for this table)
interface PaidPhone {
  phone: string;
  expires_at: string;
  duration_days: number;
  created_at: string;
}


export async function GET(request: NextRequest) {
  if (!auth(request)) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const supabase = createAdminSupabase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("paid_phones")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ phones: data });
}

export async function POST(request: NextRequest) {
  if (!auth(request)) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { phone, durationDays } = await request.json();

  if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
    return NextResponse.json({ error: "请输入正确的手机号" }, { status: 400 });
  }

  const days = durationDays || 14;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  const supabase = createAdminSupabase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from("paid_phones").upsert({
    phone,
    expires_at: expiresAt.toISOString(),
    duration_days: days,
    created_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    phone,
    expiresAt: expiresAt.toISOString(),
  });
}

export async function DELETE(request: NextRequest) {
  if (!auth(request)) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { phone } = await request.json();

  if (!phone) {
    return NextResponse.json({ error: "请提供手机号" }, { status: 400 });
  }

  const supabase = createAdminSupabase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from("paid_phones").delete().eq("phone", phone);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
