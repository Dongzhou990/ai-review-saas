"use client";

import { LogoIcon } from "@/components/logo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-black py-8 pb-20 md:pb-8">
      <div className="max-w-lg mx-auto px-5 text-center">
        <div className="flex justify-center mb-3">
          <LogoIcon size={24} />
        </div>
        <p className="text-xs text-neutral-500">
          © 2026 口碑助手 · 美业门店口碑运营助手
        </p>
        <p className="text-xs text-neutral-400 mt-1 mb-3">
          帮皮肤管理·美甲美睫·美容美发老板管好线上口碑
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/privacy"
            className="text-xs text-neutral-500 hover:text-neutral-300"
          >
            隐私政策
          </Link>
          <Link
            href="/terms"
            className="text-xs text-neutral-500 hover:text-neutral-300"
          >
            服务条款
          </Link>
        </div>
      </div>
    </footer>
  );
}
