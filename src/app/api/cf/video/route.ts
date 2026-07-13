import { NextRequest, NextResponse } from "next/server";
import { createVideoJob, getVideoJob } from "@/lib/ai/content-factory-service";

export async function POST(req: NextRequest) {
  const { scriptId, avatarStyle, voiceStyle } = await req.json();
  const job = await createVideoJob(scriptId, avatarStyle || "default", voiceStyle || "default");
  return NextResponse.json(job);
}

export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get("jobId") || "";
  const job = await getVideoJob(jobId);
  return NextResponse.json(job);
}
