import { generateAIReply } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviewContent, rating, reviewerName, productName, tone, language } =
      body;

    if (!reviewContent || rating === undefined || !reviewerName) {
      return NextResponse.json(
        { error: "缺少必要参数: reviewContent, rating, reviewerName" },
        { status: 400 }
      );
    }

    const reply = await generateAIReply({
      reviewContent,
      rating,
      reviewerName,
      productName,
      tone: tone || "professional",
      language: language || "zh",
    });

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI reply generation failed:", error);
    return NextResponse.json(
      { error: "AI 回复生成失败，请稍后重试" },
      { status: 500 }
    );
  }
}
