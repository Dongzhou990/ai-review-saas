import type { BrandProfile, Topic, ScriptVersion, VideoJob, XHSContent, Schedule, ScheduleItem, TopicCategory } from "./content-factory-types";

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ====== Mock AI — 可替换为真实API ======

function mockTopic(profile: BrandProfile, category: TopicCategory, index: number): Topic {
  const titlePools: Record<TopicCategory, string[]> = {
    "痛点类": [
      `在${profile.city}做${profile.mainService}，最怕的就是做完没效果`,
      `做${profile.industry}这么多年，这个坑你一定踩过`,
      `为什么你的${profile.mainService}客人总是嫌贵`,
      `${profile.city}的${profile.industry}店，90%都不知道这个获客方法`,
      `开了好几年${profile.industry}，最后悔没早点做这件事`,
    ],
    "种草类": [
      `${profile.city}终于有一家${profile.mainService}值得推荐了`,
      `${profile.targetAudience}都在找的${profile.mainService}，我找到了`,
      `做完${profile.mainService}，效果绝了`,
      `${profile.city}${profile.industry}探店，这家真的不一样`,
      `${profile.name}的${profile.mainService}，我愿称之为天花板`,
    ],
    "避坑类": [
      `${profile.city}做${profile.mainService}，这3个坑一定要避开`,
      `在${profile.city}选${profile.industry}，价格太低的一定要小心`,
      `${profile.targetAudience}注意！${profile.mainService}不是越贵越好`,
      `${profile.city}${profile.industry}避坑指南，做过的人都懂`,
      `别只看价格选${profile.mainService}，看完这篇再说`,
    ],
    "对比类": [
      `${profile.mainService} vs 传统方法，差别居然这么大`,
      `${profile.city}的${profile.industry}，贵的和便宜的到底差在哪`,
      `同样的${profile.mainService}，为什么有的店做得好有的不行`,
      `${profile.industry}对比：我对比了5家终于懂了`,
      `${profile.mainService}自己做vs去店里，效果差距不是一点点`,
    ],
    "成交类": [
      `${profile.city}${profile.targetAudience}，${profile.mainService}限时体验价`,
      `第一次来专属！${profile.mainService}新客体验套餐`,
      `${profile.name}的${profile.mainService}，为什么客人来了一次又来`,
      `${profile.city}的${profile.targetAudience}看过来，到店有礼`,
      `在${profile.city}找${profile.mainService}？${profile.name}值得来看看`,
    ],
    "本地引流类": [
      `${profile.city}${profile.targetAudience}看过来！${profile.mainService}就在你家附近`,
      `${profile.city}哪家${profile.industry}靠谱？本地人推荐这家`,
      `${profile.city}探店 | ${profile.name}的${profile.mainService}真实体验`,
      `${profile.city}做${profile.mainService}去哪？本地人告诉你怎么选`,
      `在${profile.city}找${profile.mainService}？${profile.name}藏在写字楼里的宝藏店`,
    ],
  };

  const selectedTitle = titlePools[category][Math.min(index - 1, 4)];

  return {
    id: uid(),
    brandId: profile.id,
    category,
    title: selectedTitle,
    hook: index <= 3 ? "3秒让你知道答案👇" : "看到最后你会感谢我",
    goal: category === "成交类" ? "成交" : category === "本地引流类" ? "引流到店" : category === "种草类" ? "涨粉" : "私信",
    createdAt: new Date().toISOString(),
  };
}

export async function generateTopics(profile: BrandProfile): Promise<Topic[]> {
  const categories: TopicCategory[] = ["痛点类", "种草类", "避坑类", "对比类", "成交类", "本地引流类"];
  const topics: Topic[] = [];

  for (const cat of categories) {
    for (let i = 1; i <= 5; i++) {
      topics.push(mockTopic(profile, cat, i));
    }
  }

  return topics;
}

// ====== Script Generation ======
export async function generateScripts(
  profile: BrandProfile,
  topic: Topic
): Promise<ScriptVersion[]> {
  const styles = [profile.style, "轻松聊天", "专业说服"];
  const scripts: ScriptVersion[] = [];

  for (let v = 0; v < 3; v++) {
    const hook = v === 0
      ? `在${profile.city}做${profile.mainService}，${topic.hook}`
      : v === 1
      ? `姐妹们！今天聊个${profile.industry}行业的真心话👇`
      : `很多人不知道，${topic.title.slice(0, 15)}...`;

    const painPoint = v === 0
      ? `你是不是也遇到过这种情况：想做${profile.mainService}，又怕做完没效果？在${profile.city}找了好几家店，要么太贵要么不靠谱。其实真正好的${profile.mainService}，不是看价格，是看专业度。`
      : v === 1
      ? `说真的，每次看到有姐妹在${profile.city}随便找家店做${profile.mainService}，我都替她捏把汗。有些店连资质都没有，价格还死贵。我今天就把话说明白了：做${profile.mainService}，这3点一定要看。`
      : `${profile.city}的${profile.industry}市场很乱。低价引流、虚假宣传、做完不管售后...这些都是真实存在的。但你知道吗？真正专业的${profile.mainService}根本不是这样的。`;

    const explanation = v === 0
      ? `作为${profile.name}的${profile.industry}师，我来说说专业的${profile.mainService}应该是什么样。首先，一定要看操作环境和产品资质。其次，操作师的经验和手法至关重要。最后，售后和效果追踪也不能少。`
      : v === 1
      ? `好的${profile.mainService}做完是什么感觉？首先效果要看得见。其次整个过程要舒服，不能痛得受不了。最后做完了还有人跟进，关心你的恢复情况。这三点缺一不可。`
      : `专业和不专业的区别在哪？第一，有没有正规资质。第二，会不会根据你的情况定制方案。第三，做完以后有没有回访和追踪。很多店收完钱就不管了，这绝对不行。`;

    const servicePlug = v === 0
      ? `${profile.name}在${profile.city}做${profile.mainService}有经验了。我们用的都是正规产品，操作师持证上岗。最重要的是，每位客人做完我们都有完整的回访和效果追踪，不是收了钱就完事。`
      : v === 1
      ? `我们${profile.name}虽然不是${profile.city}最大的店，但我们对每个客人都很认真。做${profile.mainService}之前会先面诊，做完会告诉你怎么保养，下次来还会对比前后效果。`
      : `${profile.name}在${profile.city}做了这么久，靠的就是口碑。我们不做低价引流，也不做虚假宣传。每个来做${profile.mainService}的客人，我们都当自己人一样认真对待。`;

    const cta = v === 0
      ? `想了解${profile.mainService}的，评论"想了解"或直接私信我，我帮你看看你的情况适合什么方案👇`
      : v === 1
      ? `在${profile.city}想做靠谱的${profile.mainService}？来${profile.name}看看呗～私信我"体验"，给你安排面诊👇`
      : `如果你在${profile.city}正好需要${profile.mainService}，来${profile.name}找我聊聊，不买也没关系，至少你知道了怎么选不会踩坑👇`;

    const fullScript = `${hook}\n\n${painPoint}\n\n${explanation}\n\n${servicePlug}\n\n${cta}`;

    scripts.push({
      id: uid(),
      topicId: topic.id,
      version: (v + 1) as 1 | 2 | 3,
      style: styles[v],
      hook,
      painPoint,
      explanation,
      servicePlug,
      cta,
      fullScript,
      createdAt: new Date().toISOString(),
    });
  }

  return scripts;
}

// ====== Video Job (Mock) ======
export async function createVideoJob(scriptId: string, avatarStyle: string, voiceStyle: string): Promise<VideoJob> {
  return {
    id: uid(),
    scriptId,
    avatarStyle,
    voiceStyle,
    status: "queued",
    videoUrl: null,
    createdAt: new Date().toISOString(),
  };
}

export async function getVideoJob(jobId: string): Promise<VideoJob> {
  // Mock: return completed after 2 seconds
  return {
    id: jobId,
    scriptId: "mock-script",
    avatarStyle: "default",
    voiceStyle: "default",
    status: "done",
    videoUrl: `https://mock-video.example.com/${jobId}.mp4`,
    createdAt: new Date().toISOString(),
  };
}

// ====== XHS Content ======
export async function generateXHSContent(
  profile: BrandProfile,
  script: ScriptVersion
): Promise<XHSContent> {
  const titles = [
    `${script.hook.slice(0, 20)}...`,
    `${profile.city}做${profile.mainService}，看完再决定`,
    `${profile.name}揭秘：${profile.mainService}到底值不值`,
    `在${profile.city}找${profile.mainService}？先看这篇`,
    `${profile.industry}老板跟你说句实话`,
    `${script.style}分享：${profile.mainService}怎么选不踩雷`,
    `${profile.targetAudience}注意了！这条一定要看`,
    `为什么${profile.city}的${profile.targetAudience}都来${profile.name}`,
    `${profile.mainService}避坑 | 这3点没人告诉你`,
    `${profile.name}的${profile.mainService}，真的不一样`,
  ];

  const body = `${script.fullScript}

---

💬 关于${profile.mainService}还有什么想问的？评论区告诉我👇
✉️ 想预约体验？私信我"体验"获取新客福利～

#${profile.city} #${profile.industry} #${profile.mainService} #${profile.name} #${profile.city}探店`;

  const hashtags = [
    profile.city,
    profile.industry,
    profile.mainService,
    profile.name,
    `${profile.city}探店`,
    `${profile.industry}推荐`,
    "美业探店",
    "门店获客",
    "小红书获客",
    profile.targetAudience.replace(/[、，,]/g, " "),
  ];

  const commentHooks = [
    `想了解${profile.mainService}？私信我"体验"帮你看看👇`,
    `在${profile.city}的姐妹们，你们选${profile.industry}最看重什么？评论区聊聊～`,
    `收藏这篇！下次做${profile.mainService}之前翻出来看看`,
  ];

  return {
    id: uid(),
    scriptId: script.id,
    titles,
    body,
    hashtags,
    commentHooks,
    createdAt: new Date().toISOString(),
  };
}

// ====== Schedule ======
export async function generateSchedule(profile: BrandProfile, topics: Topic[]): Promise<Schedule> {
  const days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
  const categories: TopicCategory[] = ["痛点类", "种草类", "避坑类", "对比类", "成交类", "本地引流类"];
  const items: ScheduleItem[] = [];

  let catIndex = 0;
  for (let d = 0; d < 7; d++) {
    for (let slot = 0; slot < 2; slot++) {
      const cat = categories[catIndex % categories.length];
      const poolTopics = topics.filter((t) => t.category === cat);
      const topic = poolTopics[d % poolTopics.length] || topics[0];

      items.push({
        date: `第${d + 1}天`,
        dayOfWeek: days[d],
        topicId: topic.id,
        topicTitle: topic.title,
        category: cat,
        contentType: slot === 0 ? "口播视频" : "图文",
      });

      catIndex++;
    }
  }

  return {
    id: uid(),
    brandId: profile.id,
    items,
    createdAt: new Date().toISOString(),
  };
}
