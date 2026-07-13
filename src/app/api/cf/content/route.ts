import { NextRequest, NextResponse } from "next/server";
import { generateXHSContent } from "@/lib/ai/content-factory-service";

export async function POST(req: NextRequest) {
  const { profile, script } = await req.json();
  const content = await generateXHSContent(profile, script);
  return NextResponse.json(content);
}
