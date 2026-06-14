import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReviewAI - AI 电商评论管理，自动回复 + 智能客服",
  description:
    "用 AI 自动管理电商评论和客服回复。连接抖音、淘宝、拼多多等平台，节省 90% 人力，提升店铺评分。",
  keywords: [
    "AI评论回复",
    "电商客服",
    "AI客服",
    "自动回复",
    "评论管理",
    "抖音小店",
    "淘宝客服",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
