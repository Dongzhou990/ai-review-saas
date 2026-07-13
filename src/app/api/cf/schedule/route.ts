import { NextRequest, NextResponse } from "next/server";
import { generateSchedule } from "@/lib/ai/content-factory-service";

export async function POST(req: NextRequest) {
  const { profile, topics } = await req.json();
  const schedule = await generateSchedule(profile, topics);
  return NextResponse.json(schedule);
}
