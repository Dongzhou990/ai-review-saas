"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { href: "#features", label: "能做什么" },
  { href: "#compare", label: "效果对比" },
  { href: "#pricing", label: "价格" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-neutral-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Logo size={24} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-400">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white">
                登录
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">
                免费注册
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-neutral-400 hover:text-white"
            onClick={() => setOpen(!open)}
            aria-label="菜单"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-neutral-800 py-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-2 py-2 text-sm text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900"
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-2 pt-3 border-t border-neutral-800 mt-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  登录
                </Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button variant="primary" size="sm" className="w-full">
                  免费注册
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
