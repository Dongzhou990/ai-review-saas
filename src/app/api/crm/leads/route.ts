import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

function auth(req: NextRequest): boolean {
  if (!ADMIN_SECRET) return false;
  return req.headers.get("x-admin-token") === ADMIN_SECRET;
}

// GET /api/crm/leads — list all leads
export async function GET(request: NextRequest) {
  if (!auth(request)) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const supabase = createAdminSupabase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("leads")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Auto-tag leads needing follow-up (no contact in 3+ days)
  const now = new Date();
  const enriched = (data || []).map((lead: any) => {
    const lastContact = lead.last_contact_at ? new Date(lead.last_contact_at) : null;
    const daysSinceContact = lastContact
      ? Math.floor((now.getTime() - lastContact.getTime()) / 86400000)
      : 999;
    return {
      ...lead,
      needs_followup: lead.status !== "won" && lead.status !== "lost" && daysSinceContact >= 3,
      days_since_contact: daysSinceContact,
    };
  });

  return NextResponse.json({ leads: enriched });
}

// POST /api/crm/leads — create or update a lead
export async function POST(request: NextRequest) {
  if (!auth(request)) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const body = await request.json();
  const { id, store_name, contact_name, phone, platform, rating, status, notes, industry } = body;

  if (!store_name) {
    return NextResponse.json({ error: "店名不能为空" }, { status: 400 });
  }

  const supabase = createAdminSupabase();
  const now = new Date().toISOString();

  if (id) {
    // Update existing lead
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("leads")
      .update({
        store_name,
        contact_name: contact_name || null,
        phone: phone || null,
        platform: platform || "大众点评",
        rating: rating || null,
        status: status || "new",
        notes: notes || null,
        industry: industry || null,
        last_contact_at: status !== "new" ? now : undefined,
        updated_at: now,
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, id });
  }

  // Create new lead
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("leads")
    .insert({
      store_name,
      contact_name: contact_name || null,
      phone: phone || null,
      platform: platform || "大众点评",
      rating: rating || null,
      status: status || "new",
      notes: notes || null,
      industry: industry || null,
      source: body.source || "manual",
      created_at: now,
      updated_at: now,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data.id });
}

// DELETE /api/crm/leads — delete a lead
export async function DELETE(request: NextRequest) {
  if (!auth(request)) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "请提供ID" }, { status: 400 });
  }

  const supabase = createAdminSupabase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from("leads").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
