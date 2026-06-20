import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://reviewai.chat";
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: baseUrl + "/login", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: baseUrl + "/register", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: baseUrl + "/privacy", lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: baseUrl + "/terms", lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: baseUrl + "/taobao-demo.html", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: baseUrl + "/hotel-demo.html", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
  ];
}
