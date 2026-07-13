/**
 * AI 回复生成模块
 * 支持 Claude API 和 DeepSeek API
 * 覆盖差评和好评回复，中国本地生活商家专用
 */

export type ReplyTone =
  | "apologetic"      // 真诚道歉 — 差评
  | "professional"    // 专业得体 — 差评/中评
  | "friendly"        // 温和亲切 — 中评
  | "compensation"    // 补偿引导 — 严重差评
  | "improvement"     // 改进承诺 — 差评
  | "enthusiastic"    // 热情感谢 — 好评
  | "warm"            // 朋友互动 — 好评
  | "revisit";        // 邀请复购 — 好评

interface GenerateReplyParams {
  reviewContent: string;
  rating: number;
  reviewerName: string;
  productName?: string;
  tone?: ReplyTone;
  language?: "zh" | "en";
}

const toneMap: Record<ReplyTone, string> = {
  apologetic:    "真诚道歉，承认不足，不找借口。语气诚恳，让客人感受到你真的在乎",
  professional:  "专业得体，先共情再给解决方案。不卑不亢，理性中带着温度",
  friendly:       "温和亲切，像朋友聊天一样安抚。轻松自然，让人消气",
  compensation:  "主动补偿，引导私下联系。给出具体补偿方案（赠项目/优惠券），把负面体验变成复购机会",
  improvement:   "承诺改进，说明具体的整改动作。让客人看到你真的在行动，不是说说而已",
  enthusiastic:  "热情感激，真心感谢客人的认可。语气热情但不浮夸，让客人觉得被重视",
  warm:           "朋友式互动，亲切拉家常。回忆服务中的细节，建立长期关系",
  revisit:        "巧妙邀约复购，顺带推荐新品/新项目。不硬推销，自然引导下次到店",
};

// Tone groups for UI display
export const TONE_GROUPS = {
  negative: [
    { value: "apologetic" as const,    emoji: "🙏", label: "真诚道歉" },
    { value: "compensation" as const,  emoji: "🎁", label: "补偿安抚" },
    { value: "improvement" as const,   emoji: "📋", label: "改进承诺" },
    { value: "professional" as const,  emoji: "💼", label: "专业得体" },
    { value: "friendly" as const,      emoji: "😊", label: "温和亲切" },
  ],
  positive: [
    { value: "enthusiastic" as const,  emoji: "🎉", label: "热情感谢" },
    { value: "warm" as const,          emoji: "💬", label: "朋友互动" },
    { value: "revisit" as const,       emoji: "🔄", label: "邀请复购" },
  ],
};

export async function generateAIReply(params: GenerateReplyParams): Promise<string> {
  const {
    reviewContent,
    rating,
    reviewerName,
    productName = "",
    tone = "professional",
    language = "zh",
  } = params;

  const isPositive = rating >= 4;
  const isNeutral = rating === 3;
  const isNegative = rating <= 2;

  const systemPrompt = isPositive
    ? buildPositivePrompt(tone)
    : isNeutral
    ? buildNeutralPrompt(tone)
    : buildNegativePrompt(tone);

  const userPrompt = `顾客名: ${reviewerName}
${productName ? `消费项目: ${productName}` : ""}
评分: ${"⭐".repeat(rating)}
评价内容: "${reviewContent}"

请生成回复：`;

  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.DEEPSEEK_API_KEY;
  const baseUrl = process.env.ANTHROPIC_BASE_URL || "";

  // Skip placeholder keys
  const isRealKey = apiKey && !apiKey.includes("your-") && !apiKey.includes("xxxxxxxx");
  if (isRealKey) {
    if (baseUrl.includes("deepseek")) {
      return generateWithDeepSeek(systemPrompt, userPrompt, apiKey);
    }
    return generateWithClaude(systemPrompt, userPrompt);
  }

  return generateFallbackReply(rating, reviewerName, reviewContent, tone);
}

function buildNegativePrompt(tone: ReplyTone): string {
  return `你是一个中国本地生活门店的老板，你正在亲自回复一个给了差评的客人。

你必须：
1. 真诚——你真的很抱歉，不是公关话术。语气必须像一个真的老板在说话
2. 具体——针对客人说的具体问题回应，不要说空话
3. 像个真人——是你自己会说的话，不是你培训员工说的话
4. 语气：${toneMap[tone]}
5. 长度：60-200字

回复结构：
- 先真诚道歉
- 针对客人说的具体问题，解释或回应
- 给出具体的改进承诺或补偿（根据语气风格）
- 给客人一个出口（联系你/下次补偿）

严禁：
- 不要说"亲""亲爱的"
- 不要说"相关部门""已反馈""我们会注意"
- 不要和客人争辩
- 不要复制粘贴模板的感觉
- 不要写"我是老板XXX"——你不用说你是谁`;
}

function buildNeutralPrompt(tone: ReplyTone): string {
  return `你是一个中国本地生活门店的老板，你正在回复一个给了中评的客人。

客人对你没有特别满意，但也没有发脾气。这是转化的黄金机会——一条真诚的好回复可能让 ta 下次再来。

你必须：
1. 感谢对方的反馈——ta 愿意说真话，这本身就是有价值的
2. 对不够好的地方坦诚承认
3. 语气：${toneMap[tone]}
4. 长度：60-200字

回复结构：
- 先感谢反馈
- 对不够好的地方坦诚回应
- 邀请下次再来体验改进后的服务

严禁：
- 不要说"亲""亲爱的"
- 不要敷衍——中评客人最讨厌"感谢您的评价"这种话
- 不要显得不在乎`;
}

function buildPositivePrompt(tone: ReplyTone): string {
  return `你是一个中国本地生活门店的老板，你正在回复一个给了好评的客人。

好评回复的目的不是"礼貌回复"，而是：
1. 让这个满意的客人变成你的忠实粉丝
2. 让其他看评价的人感受到你店里的氛围
3. 制造复购机会

你必须：
1. 真情实感——不是"感谢您的评价，欢迎下次光临"这种机器人话术
2. 具体——回忆服务中的细节，提到客人的具体选择
3. 语气：${toneMap[tone]}
4. 长度：50-200字

根据不同语气：
- 热情感谢型：真诚感激，让客人觉得自己被重视
- 朋友互动型：亲切自然，像跟朋友说话
- 邀请复购型：自然引导下次到店，顺带提新品或特色项目

严禁：
- 不要说"亲""亲爱的"
- 不要说"您的满意是我们最大的动力"这种套话
- 不要读起来像机器人
- 不要太长——热情不等于啰嗦`;
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

function generateFallbackReply(rating: number, name: string, content: string, tone: ReplyTone): string {
  // 好评 (4-5星)
  if (rating >= 4) {
    switch (tone) {
      case "warm":
        return `谢谢${name}！看到你说${content.slice(0, 15)}...我们特别开心～能帮到你，就是我们每天最大的动力。下次来提前说一声，给你留个惊喜 ✨`;
      case "revisit":
        return `${name}，谢谢你这么用心的评价！我们最近还上了几个新项目，下次来可以试试。老顾客都有专属优惠，来之前说一声就行～`;
      default:
        return `谢谢${name}的认可！看到你说${content.slice(0, 15)}...我们觉得一切努力都值了。欢迎随时回来，我们还想做得更好 ❤️`;
    }
  }
  // 中评 (3星)
  if (rating >= 3) {
    return `${name}，谢谢你的坦诚反馈。${content.slice(0, 15)}...这事我们确实可以做得更好。已经在着手改了，下次你来如果还有任何问题，直接找我，一定让你满意。`;
  }
  // 差评 (1-2星)
  switch (tone) {
    case "compensation":
      return `${name}，非常抱歉。你说的${content.slice(0, 15)}...确实是我们做得不好。方便加我微信吗？我想亲自跟你道歉，顺便送你一次免费体验，让你看到我们在改。`;
    case "improvement":
      return `${name}，让你失望了，真的很抱歉。关于${content.slice(0, 15)}...的问题，我们已经做了具体整改：换了产品/调整了流程。下次来如果还不满意，直接找我，我全额退。`;
    case "friendly":
      return `${name}，真的不好意思让你有了不好的体验～你说的${content.slice(0, 15)}...我特别能理解。下次来提前告诉我，我亲自帮你安排，保证跟这次不一样 😊`;
    default:
      return `${name}，非常抱歉。你说的${content.slice(0, 15)}...的问题，我们已经在认真整改了。方便的话联系我，一定给你一个满意的处理结果。`;
  }
}
