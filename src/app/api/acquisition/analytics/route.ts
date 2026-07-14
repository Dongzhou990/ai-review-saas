import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  // 获取所有线索
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const total = leads?.length || 0;

  // 按来源统计
  const bySource: Record<string, number> = {};
  // 按状态统计
  const byStatus: Record<string, number> = {};
  // 按日期统计（近7天）
  const byDate: Record<string, number> = {};
  const now = new Date();

  leads?.forEach((lead: any) => {
    bySource[lead.source] = (bySource[lead.source] || 0) + 1;
    byStatus[lead.status] = (byStatus[lead.status] || 0) + 1;

    const date = lead.created_at?.split("T")[0];
    if (date) {
      const d = new Date(date);
      const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      if (diff <= 7) byDate[date] = (byDate[date] || 0) + 1;
    }
  });

  // 转化率
  const converted = byStatus["已成交"] || 0;
  const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;

  return NextResponse.json({
    total,
    converted,
    conversionRate,
    bySource: Object.entries(bySource).map(([name, value]) => ({ name, value })),
    byStatus: Object.entries(byStatus).map(([name, value]) => ({ name, value })),
    byDate: Object.entries(byDate).map(([name, value]) => ({ name, value })).sort(),
  });
}
