"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { ArrowLeft, Sparkles } from "lucide-react";

const steps = [
  { href: "/content-factory/brand", label: "门店画像" },
  { href: "/content-factory/topics", label: "选题" },
  { href: "/content-factory/scripts", label: "脚本" },
  { href: "/content-factory/video", label: "视频" },
  { href: "/content-factory/content", label: "小红书内容" },
  { href: "/content-factory/schedule", label: "发布计划" },
  { href: "/content-factory/library", label: "内容库" },
];

export default function ContentFactoryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentIndex = steps.findIndex((s) => pathname.startsWith(s.href));

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-950">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/content-factory" className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span className="font-bold">美业内容工厂</span>
            </Link>
          </div>
          <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-300 flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> 回首页
          </Link>
        </div>

        {/* Step indicator */}
        {currentIndex >= 0 && (
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-1 overflow-x-auto text-xs">
            {steps.map((step, i) => (
              <div key={step.href} className="flex items-center gap-1 shrink-0">
                <Link
                  href={step.href}
                  className={`px-2 py-1 rounded-full whitespace-nowrap transition-colors ${
                    i === currentIndex
                      ? "bg-blue-500/20 text-blue-400 font-medium"
                      : i < currentIndex
                      ? "text-neutral-500 hover:text-neutral-300"
                      : "text-neutral-700"
                  }`}
                >
                  {i + 1}. {step.label}
                </Link>
                {i < steps.length - 1 && <span className="text-neutral-800">→</span>}
              </div>
            ))}
          </div>
        )}
      </header>

      {children}
    </div>
  );
}
