export interface Platform {
  key: string;
  name: string;
  icon: string;
  type: "ecommerce" | "hotel" | "travel";
}

export var PLATFORMS: Platform[] = [
  { key: "douyin",    name: "\u6296\u97f3\u5c0f\u5e97", icon: "\ud83c\udfb5", type: "ecommerce" },
  { key: "taobao",    name: "\u6dd8\u5b9d",         icon: "\ud83d\udecd\ufe0f", type: "ecommerce" },
  { key: "pinduoduo", name: "\u62fc\u591a\u591a",     icon: "\ud83d\udcf1",   type: "ecommerce" },
  { key: "jd",        name: "\u4eac\u4e1c",         icon: "\ud83c\udfea",   type: "ecommerce" },
  { key: "ctrip",     name: "\u643a\u7a0b",         icon: "\u2708\ufe0f",   type: "travel" },
  { key: "qunar",     name: "\u53bb\u54ea\u513f",     icon: "\ud83c\udfe8",   type: "travel" },
  { key: "meituan",   name: "\u7f8e\u56e2",         icon: "\ud83c\udf5c",   type: "hotel" },
  { key: "fliggy",    name: "\u98de\u732a",         icon: "\ud83d\udc37",   type: "hotel" },
  { key: "tiktok",    name: "TikTok Shop",  icon: "\ud83c\udf0d",   type: "ecommerce" },
  { key: "shopee",    name: "Shopee",       icon: "\ud83d\udecd\ufe0f", type: "ecommerce" },
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
