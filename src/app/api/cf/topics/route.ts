import { NextRequest, NextResponse } from "next/server";
import { generateTopics } from "@/lib/ai/content-factory-service";

export async function POST(req: NextRequest) {
  const profile = await req.json();
  const topics = await generateTopics(profile);
  return NextResponse.json(topics);
}
