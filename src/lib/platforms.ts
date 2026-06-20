export interface Platform {
  key: string;
  name: string;
  icon: string;
  type: "local-life" | "ecommerce" | "travel";
}

export var PLATFORMS: Platform[] = [
  { key: "meituan",     name: "美团",       icon: "🍜", type: "local-life" },
  { key: "dianping",    name: "大众点评",   icon: "📝", type: "local-life" },
  { key: "douyin",      name: "抖音",       icon: "🎵", type: "local-life" },
  { key: "xiaohongshu", name: "小红书",     icon: "📕", type: "local-life" },
  { key: "ctrip",       name: "携程",       icon: "✈️", type: "travel" },
  { key: "meituan-hotel", name: "美团酒店", icon: "🏨", type: "local-life" },
  { key: "taobao",      name: "淘宝",       icon: "🛍️", type: "ecommerce" },
  { key: "jd",          name: "京东",       icon: "🏪", type: "ecommerce" },
];

export function getPlatformByKey(key: string): Platform | undefined {
  for (var i = 0; i < PLATFORMS.length; i++) {
    if (PLATFORMS[i].key === key) return PLATFORMS[i];
  }
  return undefined;
}

export function getPlatformNames(): string[] {
  return PLATFORMS.map(function(p) { return p.name; });
}
