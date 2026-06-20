"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Logo, LogoIcon } from "@/components/logo";
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  ClipboardList,
} from "lucide-react";

const navItems = [
  {
    href: "/dashboard",
    label: "口碑总览",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/reviews",
    label: "差评处理",
    icon: MessageSquare,
  },
  {
    href: "/dashboard/analysis",
    label: "差评分析",
    icon: BarChart3,
  },
  {
    href: "/dashboard/invite",
    label: "好评邀约",
    icon: Sparkles,
  },
  {
    href: "/dashboard/weekly",
    label: "每周周报",
    icon: ClipboardList,
  },
  {
    href: "/dashboard/settings",
    label: "门店设置",
    icon: Settings,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabaseRef = useRef<SupabaseClient>(null as any);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = getSupabase();
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        router.push("/login");
      } else {
        setAuthReady(true);
      }
    };
    checkAuth();
  }, []);

  const getSupabase = () => {
    if (!supabaseRef.current) {
      supabaseRef.current = createClient();
    }
    return supabaseRef.current!;
  };

  const handleLogout = async () => {
    await getSupabase().auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (!authReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
      </div>
    );
  }
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } ${"hidden md:flex"}`}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          {collapsed ? (
            <LogoIcon size={24} />
          ) : (
            <Logo size={28} />
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Mobile overlay */}
        {!collapsed && (
          <div className="md:hidden fixed inset-0 bg-black/20 z-10" onClick={() => setCollapsed(true)} />
        )}

        {/* Mobile overlay */}
        {!collapsed && (
          <div className="md:hidden fixed inset-0 bg-black/20 z-10" onClick={() => setCollapsed(true)} />
        )}

        {/* Bottom */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 shrink-0" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5 shrink-0" />
                <span>收起菜单</span>
              </>
            )}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>退出登录</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="菜单"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold">
              {navItems.find((item) => item.href === pathname)?.label || "口碑总览"}
            </h1>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
