"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowUpRight, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // 用 RPC 或者直接查 subscriptions + user_settings
    const { data: subs } = await supabase
      .from("subscriptions")
      .select("*")
      .order("created_at", { ascending: false });

    if (subs) {
      const enriched = await Promise.all(
        subs.map(async (sub) => {
          // Get user email from auth (approximate via settings or store)
          const { data: settings } = await supabase
            .from("user_settings")
            .select("*")
            .eq("user_id", sub.user_id)
            .single();
          return { ...sub, settings };
        })
      );
      setUsers(enriched);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleUpgrade = async (userId: string, plan: string) => {
    setUpgrading(userId);
    await supabase
      .from("subscriptions")
      .update({
        plan,
        daily_reply_limit: plan === "enterprise" ? 999999 : 999999,
        store_limit: plan === "enterprise" ? 999 : 5,
        status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);
    setUpgrading(null);
    loadUsers();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">订阅管理</h1>
          <Button variant="outline" size="sm" onClick={loadUsers}>
            刷新
          </Button>
        </div>

        {users.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              还没有用户注册
            </CardContent>
          </Card>
        ) : (
          users.map((u) => (
            <Card key={u.user_id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{u.user_id.slice(0, 12)}...</span>
                    <Badge variant={u.plan === "pro" ? "success" : u.plan === "enterprise" ? "success" : "warning"}>
                      {u.plan}
                    </Badge>
                    <Badge variant={u.status === "active" ? "success" : "danger"}>
                      {u.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    每日限额: {u.daily_reply_limit} · 店铺: {u.store_limit} ·
                    到期: {new Date(u.current_period_end).toLocaleDateString("zh-CN")}
                  </div>
                </div>
                <div className="flex gap-2">
                  {u.plan !== "pro" && (
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={upgrading === u.user_id}
                      onClick={() => handleUpgrade(u.user_id, "pro")}
                    >
                      {upgrading === u.user_id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <ArrowUpRight className="w-4 h-4" /> 升级 Pro
                        </>
                      )}
                    </Button>
                  )}
                  {u.plan !== "enterprise" && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={upgrading === u.user_id}
                      onClick={() => handleUpgrade(u.user_id, "enterprise")}
                    >
                      升级 企业版
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
