import type { Metadata, Viewport } from "next";
import "./globals.css";
import Script from "next/script";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "口碑助手 - AI门店口碑运营助手：管好评、回差评、懂问题",
  description:
    "打开看一眼，就知道门店口碑好不好、问题出在哪。餐饮、酒店、美容门店老板都在用的口碑运营助手。",
  keywords: [
    "口碑助手",
    "AI差评回复",
    "门店口碑管理",
    "差评自动回复",
    "好评邀约",
    "酒店差评回复",
    "餐饮差评回复",
    "门店运营工具",
    "美容院差评回复",
    "差评回复模板",
    "大众点评差评回复",
    "美团差评怎么回",
    "AI差评回复工具",
    "门店口碑管理系统",
    "差评自动回复软件",
  ],
  openGraph: {
    title: "打开看一眼，就知道门店口碑好不好 | 口碑助手",
    description: "AI分析差评、自动生成回复、每周口碑汇报。餐饮、酒店、美容门店老板都在用。",
    url: "https://reviewai.chat",
    siteName: "口碑助手",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "口碑助手 - AI门店口碑运营助手",
    description: "AI帮你回差评、分析问题、生成邀评文案、每周口碑汇报。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <head>
        <Script defer data-domain="reviewai.chat" src="https://plausible.io/js/script.js" strategy="afterInteractive" />
      </head>
      <body className="min-h-full flex flex-col bg-black text-white">
        {children}
      </body>
    </html>
  );
}
