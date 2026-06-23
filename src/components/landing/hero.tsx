"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-black">
      {/* Background gradient orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-600/15 to-blue-600/10 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-gradient-to-tr from-blue-600/8 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-lg mx-auto px-5 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
        {/* Trust badge */}
        <Badge className="mb-5 px-4 py-1.5 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Sparkles className="w-3 h-3 mr-1" />
          美业门店老板都在用的口碑运营助手
        </Badge>

        {/* Main headline */}
        <h1 className="text-[2rem] sm:text-[2.75rem] font-extrabold leading-[1.15] tracking-tight">
          每条差评都回得让客人
          <span className="block bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            消气、放心、愿意再来
          </span>
        </h1>

        <p className="mt-5 text-base text-neutral-400 leading-relaxed max-w-sm mx-auto">
          不是模板回复。AI 看懂差评内容，
          <strong className="text-white">10 秒</strong>{" "}
          生成让客人消气的真诚回复。还能帮你分析——最近的差评到底在说服务不行，还是技术不行。
        </p>

        {/* Trust signals */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
            ))}
          </span>
          <span>200+ 门店在用</span>
          <span className="text-neutral-700">|</span>
          <span>不用绑卡</span>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col gap-3">
          <Link href="/register">
            <Button variant="primary" size="xl" className="w-full text-base">
              免费注册，每天 3 条
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/demo">
            <Button variant="outline" size="xl" className="w-full text-base border-neutral-700 text-neutral-300 hover:bg-neutral-900">
              先看演示，不注册也能试
            </Button>
          </Link>
        </div>

        <p className="mt-4 text-xs text-neutral-600">
          免费版每天 3 条 · 不用绑卡 · 手机就能用
        </p>
      </div>
    </section>
  );
}
