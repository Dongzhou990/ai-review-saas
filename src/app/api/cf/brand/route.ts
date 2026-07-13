import { NextRequest, NextResponse } from "next/server";
import type { BrandProfile } from "@/lib/ai/content-factory-types";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const profile: BrandProfile = {
    id: Date.now().toString(36),
    name: body.name,
    city: body.city,
    industry: body.industry,
    mainService: body.mainService,
    targetAudience: body.targetAudience,
    style: body.style,
    createdAt: new Date().toISOString(),
  };
  return NextResponse.json(profile);
}
