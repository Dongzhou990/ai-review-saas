import { NextRequest, NextResponse } from "next/server";
import { generateScripts } from "@/lib/ai/content-factory-service";

export async function POST(req: NextRequest) {
  const { profile, topic } = await req.json();
  const scripts = await generateScripts(profile, topic);
  return NextResponse.json(scripts);
}
