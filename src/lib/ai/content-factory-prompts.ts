import type { BrandProfile, Topic, TopicCategory } from "./content-factory-types";

// ====== Topic Generation ======
export function buildTopicPrompt(profile: BrandProfile): string {
  return `你是一个小红书内容策略专家。请根据以下门店信息，生成30条小红书爆款选题。

门店信息：
- 名称：${profile.name}
- 城市：${profile.city}
- 行业：${profile.industry}
- 主推项目：${profile.mainService}
- 目标人群：${profile.targetAudience}
- 风格：${profile.style}

要求：
1. 必须覆盖6个分类：痛点类、种草类、避坑类、对比类、成交类、本地引流类，每个分类5条
2. 每条选题必须适合短视频口播（15-60秒）
3. 每条选题必须有引导私信/评论的钩子
4. 标题要像小红书爆款，不要像企业宣传
5. 用口语化语言，像真人博主

输出JSON格式：
[{
  "category": "痛点类",
  "title": "选题标题",
  "hook": "3秒钩子文案",
  "goal": "私信"
}]

只输出JSON数组，不要其他文字。`;
}

// ====== Script Generation ======
export function buildScriptPrompt(
  profile: BrandProfile,
  topic: { title: string; hook: string; category: string }
): string {
  return `你是${profile.city}一家${profile.industry}店（${profile.name}）的${profile.style}型博主。
主推项目：${profile.mainService}。

请根据以下选题，生成3个版本的口播脚本：

【选题】：${topic.title}
【3秒钩子】：${topic.hook}
【分类】：${topic.category}

每个版本的口播脚本必须遵循这个结构：
1. 【3秒钩子】— 一句话抓住注意力
2. 【痛点/问题】— 戳中目标客户真实困扰
3. 【专业解释】— 用你的专业知识分析
4. 【服务自然植入】— 自然带出${profile.name}的${profile.mainService}
5. 【引导私信/评论】— 引导互动

3个版本风格：
- 版本1：${profile.style}风格
- 版本2：更轻松、更像聊天
- 版本3：更专业、更有说服力

输出JSON格式：
[{
  "version": 1,
  "style": "${profile.style}",
  "hook": "...",
  "painPoint": "...",
  "explanation": "...",
  "servicePlug": "...",
  "cta": "...",
  "fullScript": "完整口播文案，像是在对着镜头说话"
}]

fullScript必须是可以直接对着手机念的口播文案，不是文章。只输出JSON数组。`;
}

// ====== XHS Content Generation ======
export function buildXHSContentPrompt(
  profile: BrandProfile,
  scriptVersion: { fullScript: string; hook: string; style: string }
): string {
  return `根据以下口播脚本，生成小红书图文发布内容。

门店：${profile.name}（${profile.city} ${profile.industry}）
口播脚本：${scriptVersion.fullScript}

输出JSON格式：
{
  "titles": ["10个小红书标题候选，风格多样：痛点型、提问型、结果型、反常识型、数据型等"],
  "body": "小红书正文，带emoji分段，种草风格，结尾有引导私信/评论的钩子。300-500字。",
  "hashtags": ["8-12个精准标签"],
  "commentHooks": ["3条评论区引导话术，分别引导私信、评论互动、收藏"]
}

只输出JSON对象。`;
}

// ====== Schedule Generation ======
export function buildSchedulePrompt(
  profile: BrandProfile,
  topics: Topic[]
): string {
  const topicsList = topics
    .map((t, i) => `${i + 1}. [${t.category}] ${t.title}`)
    .join("\n");

  return `请为${profile.name}（${profile.industry}）生成7天小红书发布计划。

可用选题：
${topicsList}

要求：
1. 每天安排2条内容（上午1条+下午1条）
2. 混合内容类型：痛点类/种草类/成交类/避坑类/本地引流类交替
3. 不要连续2天发同类型内容
4. 每条标明发布日期、选题编号、内容类型

输出JSON格式：
[{
  "date": "第1天",
  "dayOfWeek": "周一",
  "topicIndex": 3,
  "contentType": "口播视频"
}]

共14条（7天×2条/天）。只输出JSON数组。`;
}
