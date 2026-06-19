import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Kuki AI - AI \u7535\u5546\u8bc4\u8bba\u7ba1\u7406\uff0c\u81ea\u52a8\u56de\u590d + \u667a\u80fd\u5ba2\u670d",
  description:
    "\u7528 AI \u81ea\u52a8\u7ba1\u7406\u7535\u5546\u8bc4\u8bba\u548c\u5ba2\u670d\u56de\u590d\u3002\u8fde\u63a5\u6296\u97f3\u3001\u6dd8\u5b9d\u3001\u62fc\u591a\u591a\u7b49\u5e73\u53f0\uff0c\u8282\u7701 90% \u4eba\u529b\uff0c\u63d0\u5347\u5e97\u94fa\u8bc4\u5206\u3002",
  keywords: [
    "Kuki AI",
    "AI\u8bc4\u8bba\u56de\u590d",
    "\u7535\u5546\u5ba2\u670d",
    "AI\u5ba2\u670d",
    "\u81ea\u52a8\u56de\u590d",
    "\u8bc4\u8bba\u7ba1\u7406",
    "\u6296\u97f3\u5c0f\u5e97",
    "\u6dd8\u5b9d\u5ba2\u670d",
  ],
  openGraph: {
    title: "Kuki AI - AI \u7535\u5546\u8bc4\u8bba\u7ba1\u7406",
    description: "\u7528 AI \u81ea\u52a8\u7ba1\u7406\u7535\u5546\u8bc4\u8bba\u548c\u5ba2\u670d\u56de\u590d\u3002",
    url: "https://reviewai.chat",
    siteName: "Kuki AI",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kuki AI - AI \u7535\u5546\u8bc4\u8bba\u7ba1\u7406",
    description: "\u7528 AI \u81ea\u52a8\u7ba1\u7406\u7535\u5546\u8bc4\u8bba\u548c\u5ba2\u670d\u56de\u590d\u3002",
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
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
