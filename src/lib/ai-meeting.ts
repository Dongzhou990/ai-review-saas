/**
 * AI 会议纪要生成模块
 * 支持 Claude API 和 DeepSeek API
 */

export interface MeetingMinutesResult {
  title: string;
  summary: string;
  decisions: string[];
  keyPoints: string[];
  actionItems: {
    content: string;
    assignee: string;
    priority: "high" | "medium" | "low";
    dueDate: string;
  }[];
}

interface GenerateMeetingMinutesParams {
  content: string;
  title?: string;
  language?: "zh" | "en";
}

export async function generateMeetingMinutes(
  params: GenerateMeetingMinutesParams
): Promise<MeetingMinutesResult> {
  const { content, title, language = "zh" } = params;

  const systemPrompt = `你是一个专业的会议纪要助手。你的任务是根据会议录音转写或会议笔记，生成结构化的会议纪要。

规则：
1. 提取会议的核心主题作为标题（如果未提供标题）
2. 写一段简洁的会议摘要（100-300字），概括会议的主要内容和结论
3. 列出会议中做出的所有决定（decisions），每项一条
4. 列出会议的关键要点（keyPoints），每项一条
5. 从会议内容中提取待办事项（actionItems），每项包含：
   - content: 具体的任务描述
   - assignee: 负责人（如果会议中提到），否则填"待定"
   - priority: 优先级（high/medium/low），根据紧迫性和重要程度判断
   - dueDate: 截止日期（如果提到），否则填""

请严格按照以下 JSON 格式返回，不要包含任何其他内容，不要用 markdown 代码块包裹：

{
  "title": "会议标题",
  "summary": "会议摘要...",
  "decisions": ["决定1", "决定2"],
  "keyPoints": ["要点1", "要点2"],
  "actionItems": [
    { "content": "任务描述", "assignee": "张三", "priority": "high", "dueDate": "2025-01-15" }
  ]
}

注意：
- 如果会议内容中没有明确的事项，decisions、keyPoints、actionItems 可以是空数组
- 语言：${language === "zh" ? "请用中文输出所有内容" : "Please output all content in English"}
- 标题要简洁明了，不要超过 30 个字`;

  const userPrompt = title
    ? `会议标题：${title}\n\n会议内容：\n${content}\n\n请根据以上内容生成会议纪要。`
    : `会议内容：\n${content}\n\n请根据以上内容生成会议纪要，并自动提取会议的标题。`;

  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.DEEPSEEK_API_KEY;
  const baseUrl = process.env.ANTHROPIC_BASE_URL || "";

  let rawResponse: string;

  if (apiKey) {
    if (baseUrl.includes("deepseek")) {
      rawResponse = await generateWithDeepSeek(systemPrompt, userPrompt, apiKey);
    } else {
      rawResponse = await generateWithClaude(systemPrompt, userPrompt);
    }
  } else {
    rawResponse = generateFallbackMeetingMinutes(content, title);
  }

  return parseResponse(rawResponse, content, title);
}

async function generateWithClaude(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  const data = await response.json();
  return data.content[0].text;
}

async function generateWithDeepSeek(
  systemPrompt: string,
  userPrompt: string,
  apiKey?: string
): Promise<string> {
  const key =
    apiKey || process.env.DEEPSEEK_API_KEY || process.env.ANTHROPIC_API_KEY;
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
      max_tokens: 2048,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

function parseResponse(
  raw: string,
  content: string,
  title?: string
): MeetingMinutesResult {
  try {
    // Remove possible markdown code block wrappers
    let jsonStr = raw.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\s*/i, "");
      jsonStr = jsonStr.replace(/\s*```$/, "");
    }

    const parsed = JSON.parse(jsonStr);

    return {
      title: parsed.title || title || extractTitle(content),
      summary: parsed.summary || "",
      decisions: Array.isArray(parsed.decisions) ? parsed.decisions : [],
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
      actionItems: Array.isArray(parsed.actionItems)
        ? parsed.actionItems.map((item: any) => ({
            content: item.content || "",
            assignee: item.assignee || "待定",
            priority: ["high", "medium", "low"].includes(item.priority)
              ? item.priority
              : "medium",
            dueDate: item.dueDate || "",
          }))
        : [],
    };
  } catch {
    // If JSON parsing fails, return a fallback structure
    return {
      title: title || extractTitle(content),
      summary: raw.substring(0, 500),
      decisions: [],
      keyPoints: [],
      actionItems: [],
    };
  }
}

function generateFallbackMeetingMinutes(
  content: string,
  title?: string
): string {
  const lines = content
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const firstLine = lines[0] || "";
  const preview = content.substring(0, 300);

  return JSON.stringify({
    title: title || extractTitle(content),
    summary: `会议讨论了以下内容：${preview}...`,
    decisions: [],
    keyPoints: lines.slice(0, 10).map((line) => line.substring(0, 100)),
    actionItems: [],
  });
}

function extractTitle(content: string): string {
  const firstLine = content.split("\n")[0]?.trim() || "";
  if (firstLine.length <= 30) return firstLine || "未命名会议";
  return firstLine.substring(0, 30) + "...";
}
