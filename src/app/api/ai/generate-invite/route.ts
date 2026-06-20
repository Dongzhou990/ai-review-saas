import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

const SCENES: Record<string, string> = {
  "消费后": "客人刚消费完，在店里体验不错，你希望他们去大众点评/美团写个好评",
  "复购邀评": "老客人又来消费了，你想感谢他们并请他们写个好评",
  "活动后": "刚做完一个活动/促销，参加的人体验不错，你想邀他们写评价",
  "服务完成后": "客人做完护理/诊疗/项目，效果满意，你想请他们在大众点评分享",
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const { scene, storeName, platform } = body || {};

    const sceneText = SCENES[scene] || "客人体验不错，你想请他们写个好评";
    const store = storeName || "本店";
    const plat = platform || "大众点评/美团";

    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        texts: [
          `【${store}】感谢您的光临！如果觉得还不错，方便的话帮我们在${plat}写个好评，您的支持是我们最大的动力~`,
          `${store}感谢您的信任！如果您对这次体验满意，欢迎在${plat}上给我们一个五星好评，帮助更多朋友找到我们~`,
        ],
        tips: "邀评时机很重要：客人刚消费完、心情好时立即发。不要在差评客人身上浪费邀评。",
      });
    }

    const systemPrompt = `你是中国本地生活门店的营销文案助手。你帮老板写邀评文案，鼓励满意的客人去大众点评/美团/小红书等平台写好评。

要求：
1. 用微信聊天/短信的语气，不要像广告
2. 真诚不套路，让客人觉得是老板真心在请求帮助
3. 不要太长（50-120字），适合在微信对话里发送
4. 给3个不同风格的版本
5. 再加一条"邀评小技巧"

输出格式：严格JSON
{
  "texts": ["文案1", "文案2", "文案3"],
  "tips": "邀评小技巧"
}`;

    const userPrompt = `门店: ${store}
场景: ${sceneText}
发布平台: ${plat}

请生成3个不同风格的邀评文案：`;

    try {
      const baseUrl = process.env.ANTHROPIC_BASE_URL || "";
      const isDeepSeek = baseUrl.includes("deepseek");
      let content: string;

      if (isDeepSeek) {
        const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }], max_tokens: 800, temperature: 0.7 }),
        });
        const data = await res.json();
        content = data.choices[0].message.content;
      } else {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": apiKey!, "anthropic-version": "2023-06-01" },
          body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 800, system: systemPrompt, messages: [{ role: "user", content: userPrompt }] }),
        });
        const data = await res.json();
        content = data.content[0].text;
      }

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return NextResponse.json(JSON.parse(jsonMatch[0]));
      }
    } catch {
      // AI failed, use fallback
    }

    return NextResponse.json({
      texts: [
        `【${store}】感谢您的光临！如果觉得还不错，方便的话帮我们在${plat}写个好评，您的支持是我们最大的动力~`,
        `${store}感谢您的信任！如果您对这次体验满意，欢迎在${plat}上给我们一个五星好评，帮助更多朋友找到我们~`,
        `您好！感谢您选择${store}。如果方便，能否在${plat}上分享您的真实感受？这对我们小店真的很重要，谢谢您！`,
      ],
      tips: "邀评时机：消费完成后立即发，这时客人心情最好。不要等第二天——那时热情已经过去了。",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "生成失败" }, { status: 500 });
  }
}
