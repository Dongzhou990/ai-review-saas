import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 线索追踪
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source");
  const status = searchParams.get("status");

  let query = supabase.from("leads").select("*").eq("user_id", user.id).order("created_at", { ascending: false });

  if (source) query = query.eq("source", source);
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const body = await request.json();
  const { name, phone, source, note, status = "新线索" } = body;

  const { data, error } = await supabase
    .from("leads")
    .insert({
      user_id: user.id,
      name: name || "未知",
      phone: phone || "",
      source: source || "未知渠道",
      note: note || "",
      status,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// 更新线索状态
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const { id, status, note } = await request.json();
  const updates: any = {};
  if (status) updates.status = status;
  if (note !== undefined) updates.note = note;

  const { error } = await supabase
    .from("leads")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
