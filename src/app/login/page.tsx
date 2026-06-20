"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "登录失败");
        setLoading(false);
      } else {
        router.push("/dashboard/reviews");
        router.refresh();
      }
    } catch {
      setError("网络错误，请重试");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <Logo size={36} />
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">登录口碑助手</CardTitle>
            <CardDescription>管理门店口碑，从登录开始</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? "登录中..." : "登录"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-gray-400">快捷登录</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <a
                  href="/api/auth/wechat"
                  className="flex items-center justify-center gap-2 px-2 py-2.5 rounded-lg border border-gray-200 hover:bg-green-50 transition-colors text-sm font-medium"
                >
                  <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z"/></svg>
                  微信
                </a>
                <button
                  onClick={() => {
                    import("@/lib/supabase/client").then(m => {
                      const supabase = m.createClient();
                      supabase.auth.signInWithOAuth({
                        provider: "google",
                        options: { redirectTo: window.location.origin + "/auth/callback" },
                      });
                    });
                  }}
                  className="flex items-center justify-center gap-2 px-2 py-2.5 rounded-lg border border-gray-200 hover:bg-red-50 transition-colors text-sm font-medium"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                </button>
                <a
                  href="/api/auth/qq"
                  className="flex items-center justify-center gap-2 px-2 py-2.5 rounded-lg border border-gray-200 hover:bg-blue-50 transition-colors text-sm font-medium"
                >
                  <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M21.395 15.035a39.548 39.548 0 00-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.527 4.661 17.127 2 12.088 2S4.409 4.83 4.409 9.24c0 3.572 2.666 6.525 6.28 7.286l-.672 2.004c-.104.313-.177.548-.177.655 0 .381.295.62.689.62.168 0 .354-.073.529-.207l2.428-1.831c.998.154 2.03.232 3.065.232 1.033 0 2.053-.077 3.043-.229l2.412 1.83c.175.135.361.208.53.208.394 0 .69-.239.69-.62 0-.108-.074-.344-.179-.657l-.673-2.006z"/></svg>
                  QQ
                </a>
              </div>

              <p className="text-sm text-gray-500 text-center">
                还没有账号？{" "}
                <Link href="/register" className="text-blue-600 hover:underline">
                  免费注册
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
