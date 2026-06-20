/**
 * AI 回复生成模块
 * 支持 Claude API 和 DeepSeek API
 * 针对中国本地生活商家优化
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
    productName = "",
    tone = "professional",
    language = "zh",
  } = params;

  const toneMap: Record<string, string> = {
    professional: "诚恳、真诚，先道歉再给解决方案",
    friendly: "温和、亲切，像朋友一样安抚",
    apologetic: "非常诚恳地道歉，引导私下联系解决",
    enthusiastic: "热情、感激，适用于好评回复",
  };

  const systemPrompt = `你是一个中国本地生活门店的客服回复助手。你帮餐饮老板、酒店民宿老板、美容美发店老板回复大众点评、美团、携程上的顾客评价。

你的回复必须：
1. 真诚——老板真的在道歉和改进，不是公关话术
2. 具体——根据差评内容针对性回复，不要说"我们已经反馈给相关部门"这种空话
3. 像真人说的——一个餐饮老板、酒店前台、美容店老板真的会说出口的话
4. 语气：${toneMap[tone]}
5. 长度：50-200字

回复结构：
- 先道歉或感谢（根据评分）
- 针对顾客说的具体问题给出回应或改进承诺
- 给一个出口（下次补偿/联系解决/已在改进）

不要做的：
- 不要说"亲""亲爱的"
- 不要说"相关部门""已经反馈"这种空话
- 不要和顾客争辩
- 不要看起来像AI生成的模板`;

  const isPositive = rating >= 4;
  const isNegative = rating <= 2;

  const userPrompt = `顾客名: ${reviewerName}
${productName ? `消费项目: ${productName}` : ""}
评分: ${"⭐".repeat(rating)}
评价内容: "${reviewContent}"

请生成回复：`;

  // 使用已配置的 API Key
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.DEEPSEEK_API_KEY;
  const baseUrl = process.env.ANTHROPIC_BASE_URL || "";

  if (apiKey) {
    if (baseUrl.includes("deepseek")) {
      return generateWithDeepSeek(systemPrompt, userPrompt, apiKey);
    }
    return generateWithClaude(systemPrompt, userPrompt);
  }

  return generateFallbackReply(rating, reviewerName, reviewContent);
}

async function generateWithClaude(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  if (!data.content?.[0]?.text) throw new Error("Claude API returned unexpected response format");
  return data.content[0].text;
}

async function generateWithDeepSeek(systemPrompt: string, userPrompt: string, apiKey?: string): Promise<string> {
  const key = apiKey || process.env.DEEPSEEK_API_KEY || process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("No API key configured for DeepSeek");

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
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

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  if (!data.choices?.[0]?.message?.content) throw new Error("DeepSeek API returned unexpected response format");
  return data.choices[0].message.content;
}

function generateFallbackReply(rating: number, name: string, content: string): string {
  if (rating >= 4) {
    return `感谢${name}的好评！很高兴您对我们的服务感到满意。我们会继续努力，期待您的再次光临！`;
  } else if (rating >= 3) {
    return `感谢${name}的反馈。您提到的意见我们非常重视，已经在着手改进了。下次来如果有任何问题，可以直接找店长，我们一定给您满意的体验。`;
  } else {
    return `非常抱歉给您带来了不好的体验，${name}。关于您提到的${content.slice(0, 20)}...的问题，我们已经在整改了。方便的话可以联系我们，我们一定给您一个满意的处理结果。`;
  }
}
