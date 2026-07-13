import { generateAIReply } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";

const MAX_DEMO_PER_DAY = 3;

// Simple in-memory rate limiter: track requests per IP per day
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviewContent, rating, reviewerName, tone, phone } = body;

    // Check if user has a verified paid phone
    let isPaidUser = false;
    if (phone && /^1[3-9]\d{9}$/.test(phone)) {
      try {
        const supabase = createAdminSupabase();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase as any)
          .from("paid_phones")
          .select("phone, expires_at")
          .eq("phone", phone)
          .maybeSingle();

        if (data && (!data.expires_at || new Date(data.expires_at) > new Date())) {
          isPaidUser = true;
        }
      } catch {
        // DB check failed — fall through to rate limit
      }
    }

    // Rate limit free users to 3/day
    if (!isPaidUser) {
      const ip = getClientIP(request);
      const now = Date.now();
      const entry = rateLimit.get(ip);

      if (entry && now < entry.resetAt) {
        if (entry.count >= MAX_DEMO_PER_DAY) {
          return NextResponse.json(
            {
              error: "今日免费次数已用完（3次/天）。¥99/月 即可无限使用 👇",
              limitReached: true,
            },
            { status: 429 }
          );
        }
        entry.count++;
      } else {
        rateLimit.set(ip, { count: 1, resetAt: now + 24 * 60 * 60 * 1000 });
      }
    }

    // Validate input
    if (!reviewContent || rating === undefined || !reviewerName) {
      return NextResponse.json(
        { error: "请填写评价内容、评分和顾客名" },
        { status: 400 }
      );
    }

    const reply = await generateAIReply({
      reviewContent: reviewContent.slice(0, 500),
      rating: Math.max(1, Math.min(5, rating)),
      reviewerName,
      tone: tone || "professional",
      language: "zh",
    });

    return NextResponse.json({
      reply,
      isPaidUser,
      remaining: isPaidUser ? Infinity : Math.max(0, MAX_DEMO_PER_DAY - (rateLimit.get(getClientIP(request))?.count || 0)),
    });
  } catch (error: any) {
    const msg = error?.message || String(error);
    console.error("Demo AI reply generation failed:", msg);
    return NextResponse.json(
      { error: `AI 生成失败，请稍后重试` },
      { status: 500 }
    );
  }
}
