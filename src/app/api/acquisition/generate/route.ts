import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// AI 获客内容类型
const CONTENT_TEMPLATES = {
  viral: {
    label: "爆款引流笔记",
    prompt: (profile: any) => `你是小红书爆款写手。根据以下门店信息写一篇引流笔记：
门店：${profile.name}，城市：${profile.city}，主营：${profile.mainService}
目标客群：${profile.targetAudience}

要求：
1. 标题抓眼球（用数字/疑问句/反常识）
2. 正文200-300字，自然口语化
3. 埋入本地关键词（城市+服务名）
4. 结尾引导私信或到店
5. 加3-5个热门话题标签
直接输出笔记，不要说明文字。`,
  },
  story: {
    label: "客户故事",
    prompt: (profile: any) => `你是一个会讲故事的美业文案。根据门店信息写一篇客户故事：
门店：${profile.name}，主营：${profile.mainService}

要求：
1. 以客户第一人称或店主视角讲故事
2. 有"问题→解决→效果"的叙事结构
3. 真实感强，不要像广告
4. 200字左右
直接输出故事，不要说明文字。`,
  },
  local: {
    label: "本地引流帖",
    prompt: (profile: any) => `你在帮本地门店写大众点评/小红书引流帖。
门店：${profile.name}，城市：${profile.city}，主营：${profile.mainService}
目标客群：${profile.targetAudience}

要求：
1. 突出"本地""附近""新客优惠"
2. 语气亲切，像朋友推荐
3. 150-200字
4. 句尾加"私信我领取新客体验价"
直接输出内容。`,
  },
  qa: {
    label: "问答引流",
    prompt: (profile: any) => `你在模仿小红书真实用户的问答帖。
关于${profile.mainService}，写一个"求助帖"或"经验分享帖"：

要求：
1. 用"姐妹们"/"有没有人"开头
2. 看起来是真实用户在提问或分享
3. 评论区会有人推荐${profile.name}
4. 自然藏入关键词
直接输出。`,
  },
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const { type = "viral", profile } = await request.json();
  const template = CONTENT_TEMPLATES[type as keyof typeof CONTENT_TEMPLATES];
  if (!template) return NextResponse.json({ error: "未知类型" }, { status: 400 });

  // 调用 AI（优先 Claude，备选 DeepSeek）
  try {
    const content = await generateWithAI(template.prompt(profile));
    return NextResponse.json({ type, label: template.label, content });
  } catch (error: any) {
    // fallback: 返回模板内容
    return NextResponse.json({
      type,
      label: template.label,
      content: `【${template.label}】\n\n${profile.name ? '在' + profile.city + '，' : ''}${profile.mainService ? '做' + profile.mainService + '的宝藏店' : '值得推荐的好店'}！\n\n真实体验分享～私信我领取新客优惠 🎁`,
    });
  }
}

async function generateWithAI(prompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("No API key");

  // 优先用 Claude
  if (process.env.ANTHROPIC_API_KEY) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 800,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text || "";
  }

  // fallback DeepSeek
  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 800,
    }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}
