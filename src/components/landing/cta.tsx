"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="bg-gradient-to-br from-indigo-950 via-blue-950 to-black py-16 sm:py-20">
      <div className="max-w-lg mx-auto px-5 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          别让差评白白劝退你的客人
        </h2>
        <p className="text-base text-neutral-400 mb-8 leading-relaxed">
          每天 3 条免费，手机就能用。不绑卡、不收费。
          <br />
          你只管试试有没有用——没用就不用了呗。
        </p>
        <Link href="/register">
          <Button variant="primary" size="xl" className="w-full text-base mb-3">
            免费开始用
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
        <p className="text-xs text-neutral-600">
          30 秒注册 · 每天 3 条免费 · 不满意可以不付费
        </p>
      </div>
    </section>
  );
}
