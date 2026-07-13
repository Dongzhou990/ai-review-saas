// ===== 品牌画像 =====
export interface BrandProfile {
  id: string;
  name: string;
  city: string;
  industry: "美甲美睫" | "皮肤管理" | "美容院" | "轻医美";
  mainService: string;
  targetAudience: string;
  style: "专业" | "温柔" | "老板娘" | "专家";
  createdAt: string;
}

// ===== 选题 =====
export type TopicCategory =
  | "痛点类"
  | "种草类"
  | "避坑类"
  | "对比类"
  | "成交类"
  | "本地引流类";

export interface Topic {
  id: string;
  brandId: string;
  category: TopicCategory;
  title: string;
  hook: string;
  goal: "涨粉" | "私信" | "成交" | "引流到店";
  createdAt: string;
}

// ===== 口播脚本 =====
export interface ScriptVersion {
  id: string;
  topicId: string;
  version: 1 | 2 | 3;
  style: string;
  hook: string; // 3秒钩子
  painPoint: string;
  explanation: string;
  servicePlug: string;
  cta: string;
  fullScript: string;
  createdAt: string;
}

// ===== 视频任务 (Mock) =====
export interface VideoJob {
  id: string;
  scriptId: string;
  avatarStyle: string;
  voiceStyle: string;
  status: "queued" | "processing" | "done";
  videoUrl: string | null;
  createdAt: string;
}

// ===== 小红书内容 =====
export interface XHSContent {
  id: string;
  scriptId: string;
  titles: string[]; // 10个
  body: string;
  hashtags: string[];
  commentHooks: string[];
  createdAt: string;
}

// ===== 发布计划 =====
export interface ScheduleItem {
  date: string;
  dayOfWeek: string;
  topicId: string;
  topicTitle: string;
  category: TopicCategory;
  contentType: "口播视频" | "图文";
}

export interface Schedule {
  id: string;
  brandId: string;
  items: ScheduleItem[];
  createdAt: string;
}

// ===== 内容库 =====
export interface ContentLibraryItem {
  id: string;
  type: "topic" | "script" | "video" | "xhs_content" | "schedule";
  data: any;
  createdAt: string;
}
