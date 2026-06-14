/**
 * AI 回复生成模块
 * 支持 Claude API 和 DeepSeek API
 */

interface GenerateReplyParams {
  reviewContent: string;
  rating: number;
  reviewerName: string;
  productName?: string;
  tone?: "professional" | "friendly" | "apologetic" | "enthusiastic";
  language?: "zh" | "en";
}

export async function generateAIReply(params: GenerateReplyParams): Promise<string> {
  const {
    reviewContent,
    rating,
    reviewerName,
    productName = "商品",
    tone = "professional",
    language = "zh",
  } = params;

  const toneMap = {
    professional: "专业、礼貌",
    friendly: "亲切、温暖",
    apologetic: "诚恳、道歉",
    enthusiastic: "热情、感激",
  };

  const isPositive = rating >= 4;
  const isNegative = rating <= 2;

  const systemPrompt = `你是一个专业的电商客服回复助手。你需要根据买家评论生成合适的回复。

规则：
1. 回复要真诚、个性化，不要套模板
2. 好评：表达感谢，可以邀请复购或推荐
3. 中评：感谢反馈，表示会改进
4. 差评：诚恳道歉，提出解决方案，引导联系客服
5. 语气：${toneMap[tone]}
6. 长度：控制在50-150字
7. 用${language === "zh" ? "中文" : "英文"}回复
8. 不要使用"亲"等过度营销用语`;

  const userPrompt = `买家: ${reviewerName}
商品: ${productName}
评分: ${"⭐".repeat(rating)}
评论内容: "${reviewContent}"

请生成回复：`;

  // 优先使用 Claude API，fallback 到 DeepSeek
  if (process.env.ANTHROPIC_API_KEY) {
    return generateWithClaude(systemPrompt, userPrompt);
  }
  if (process.env.DEEPSEEK_API_KEY) {
    return generateWithDeepSeek(systemPrompt, userPrompt);
  }

  // 本地 fallback：基于规则的回复模板
  return generateFallbackReply(rating, reviewerName);
}

async function generateWithClaude(systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  const data = await response.json();
  return data.content[0].text;
}

async function generateWithDeepSeek(systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 500,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

function generateFallbackReply(rating: number, name: string): string {
  if (rating >= 4) {
    return `感谢${name}的好评！很高兴您对我们的商品感到满意。我们会继续努力提供优质的产品和服务，期待您的再次光临！`;
  } else if (rating >= 3) {
    return `感谢${name}的反馈！我们非常重视您的意见，会认真考虑如何改进。如有任何问题，欢迎随时联系我们的客服，祝您生活愉快！`;
  } else {
    return `非常抱歉给您带来了不好的体验，${name}。我们十分重视您的反馈，客服团队会尽快与您联系，为您解决问题。请您放心，我们一定会给您一个满意的处理结果。`;
  }
}
