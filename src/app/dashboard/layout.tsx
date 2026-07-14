"use client";

import {
  Rocket, useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Rocket, usePathname } from "next/navigation";
import {
  Rocket, createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  Rocket, Logo, LogoIcon } from "@/components/logo";
import {
  Rocket,
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  ClipboardList,
  X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "口碑总览", icon: LayoutDashboard },
  { href: "/dashboard/reviews", label: "差评处理", icon: MessageSquare },
  { href: "/dashboard/analysis", label: "差评分析", icon: BarChart3 },
  { href: "/dashboard/invite", label: "好评邀约", icon: Sparkles },
  { href: "/dashboard/weekly", label: "每周周报", icon: ClipboardList },
  { href: "/dashboard/acquisition", label: "AI 获客", icon: Rocket },
  { href: "/dashboard/settings", label: "门店设置", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const supabaseRef = useRef<SupabaseClient>(null as any);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function checkAuth() {
      try {
        const supabase = createClient();
        supabaseRef.current = supabase;
        const { data } = await supabase.auth.getUser();
        if (!cancelled) {
          if (!data?.user) {
            window.location.href = "/login";
          } else {
            setAuthReady(true);
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        if (!cancelled) setAuthReady(true); // show page anyway
      }
    }
    checkAuth();
    return () => { cancelled = true; };
  }, []);

  const handleLogout = async () => {
    try {
      await supabaseRef.current?.auth.signOut();
    } catch { /* ignore */ }
    window.location.href = "/";
  };

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (!authReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black relative">
      {/* ====== Desktop Sidebar ====== */}
      <aside
        className={`hidden md:flex flex-col bg-neutral-900 border-r border-neutral-800 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex items-center h-16 px-4 border-b border-neutral-800">
          {collapsed ? <LogoIcon size={24} /> : <Logo size={28} />}
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? "bg-blue-500/10 text-blue-400 font-medium" : "text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-800 space-y-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-neutral-400 hover:bg-neutral-800 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-5 h-5 shrink-0" /> : <><ChevronLeft className="w-5 h-5 shrink-0" /><span>收起菜单</span></>}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>退出登录</span>}
          </button>
        </div>
      </aside>

      {/* ====== Mobile Menu Overlay ====== */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60"
          onClick={closeMobileMenu}
        />
      )}

      {/* ====== Mobile Menu Drawer ====== */}
      {mobileMenuOpen && (
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col">
          <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-800">
            <Logo size={28} />
            <button
              onClick={closeMobileMenu}
              className="p-2 text-neutral-400 active:text-white"
              aria-label="关闭菜单"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors ${
                    isActive ? "bg-blue-500/10 text-blue-400 font-medium" : "text-neutral-300 active:bg-neutral-800"
                  }`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-neutral-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm text-red-400 active:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span>退出登录</span>
            </button>
          </div>
        </div>
      )}

      {/* ====== Main Content ====== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="border-b border-neutral-800 bg-neutral-950 flex items-center px-4 md:px-6 shrink-0" style={{ height: "auto", minHeight: "3.5rem", paddingTop: "max(0.5rem, env(safe-area-inset-top, 0px))", paddingBottom: "0.5rem" }}>
          {/* Mobile hamburger — simplest possible implementation */}
          <button
            onPointerDown={() => setMobileMenuOpen(true)}
            className="md:hidden flex items-center justify-center w-12 h-12 rounded-lg text-neutral-300"
            aria-label="打开菜单"
          >
            <svg className="w-6 h-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h1 className="text-lg font-semibold truncate">
            {navItems.find((item) => item.href === pathname)?.label || "口碑总览"}
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
