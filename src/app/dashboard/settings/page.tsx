"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Store,
  Plus,
  Check,
  Link as LinkIcon,
  Trash2,
  MessageSquare,
  Zap,
} from "lucide-react";

// 模拟已连接店铺
const connectedStores = [
  {
    id: 1,
    name: "数码好物旗舰店",
    platform: "抖音小店",
    status: "connected",
    reviewCount: 234,
    lastSync: "5分钟前",
  },
  {
    id: 2,
    name: "品质生活馆",
    platform: "淘宝",
    status: "connected",
    reviewCount: 156,
    lastSync: "12分钟前",
  },
];

const platformOptions = [
  { name: "抖音小店", icon: "🎵", available: true },
  { name: "淘宝", icon: "🛒", available: true },
  { name: "拼多多", icon: "📱", available: true },
  { name: "TikTok Shop", icon: "🌍", available: false },
  { name: "京东", icon: "🏪", available: false },
  { name: "Shopee", icon: "🛍️", available: false },
];

export default function SettingsPage() {
  const [showAddStore, setShowAddStore] = useState(false);

  return (
    <div className="space-y-6 max-w-3xl">
      {/* 已连接店铺 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>已连接店铺</CardTitle>
            <CardDescription>
              管理已接入 AI 评论回复的电商店铺
            </CardDescription>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddStore(true)}
          >
            <Plus className="w-4 h-4" />
            添加店铺
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {connectedStores.map((store) => (
            <div
              key={store.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Store className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{store.name}</span>
                    <Badge variant="success">已连接</Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>{store.platform}</span>
                    <span>{store.reviewCount} 条评论</span>
                    <span>同步: {store.lastSync}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 添加店铺表单 */}
      {showAddStore && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle>添加新店铺</CardTitle>
            <CardDescription>选择平台并授权连接</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>选择平台</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {platformOptions.map((platform) => (
                    <button
                      key={platform.name}
                      disabled={!platform.available}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border text-sm transition-all ${
                        platform.available
                          ? "border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
                          : "border-gray-100 dark:border-gray-800 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <span className="text-2xl">{platform.icon}</span>
                      <span className="text-xs">{platform.name}</span>
                      {!platform.available && (
                        <Badge variant="gray" className="text-[10px]">
                          即将支持
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-name">店铺名称</Label>
                <Input id="store-name" placeholder="输入你的店铺名称" />
              </div>

              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-600 dark:text-gray-400">
                <p className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  我们将跳转到平台授权页面，授权后即可自动同步评论数据。
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="primary">
                  <LinkIcon className="w-4 h-4" />
                  前往授权
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowAddStore(false)}
                >
                  取消
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI 回复设置 */}
      <Card>
        <CardHeader>
          <CardTitle>AI 回复设置</CardTitle>
          <CardDescription>自定义 AI 回复的风格和规则</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>回复风格</Label>
            <div className="grid grid-cols-4 gap-3 mt-2">
              {[
                { label: "专业礼貌", value: "professional", active: true },
                { label: "亲切温暖", value: "friendly", active: false },
                { label: "诚恳道歉", value: "apologetic", active: false },
                { label: "热情感激", value: "enthusiastic", active: false },
              ].map((style) => (
                <button
                  key={style.value}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm transition-all ${
                    style.active
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  }`}
                >
                  {style.active && <Check className="w-4 h-4" />}
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>自动发布规则</Label>
            <div className="space-y-3 mt-2">
              {[
                {
                  label: "好评自动发布",
                  desc: "4-5 星评论的 AI 回复自动发布，无需审核",
                },
                {
                  label: "中评审核后发布",
                  desc: "3 星评论的 AI 回复需要你审核后再发布",
                },
                {
                  label: "差评手动处理",
                  desc: "1-2 星评论需要你手动编写或确认 AI 回复",
                },
              ].map((rule) => (
                <div
                  key={rule.label}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <div>
                    <span className="text-sm font-medium">{rule.label}</span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {rule.desc}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API 设置 */}
      <Card>
        <CardHeader>
          <CardTitle>API 密钥</CardTitle>
          <CardDescription>管理你的 API 访问密钥，用于自定义集成</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Secret API Key</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                用于自定义集成和自动化工作流
              </p>
            </div>
            <Button variant="outline" size="sm">
              生成密钥
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
