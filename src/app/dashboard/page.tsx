"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// 模拟数据
const stats = [
  {
    label: "今日新评论",
    value: 48,
    change: "+12%",
    trend: "up",
    icon: MessageSquare,
  },
  {
    label: "平均评分",
    value: 4.8,
    change: "+0.2",
    trend: "up",
    icon: Star,
  },
  {
    label: "AI 回复率",
    value: "94%",
    change: "+5%",
    trend: "up",
    icon: CheckCircle,
  },
  {
    label: "待处理差评",
    value: 3,
    change: "-2",
    trend: "down",
    icon: AlertTriangle,
  },
];

const ratingTrend = [
  { date: "6/7", rating: 4.6 },
  { date: "6/8", rating: 4.7 },
  { date: "6/9", rating: 4.5 },
  { date: "6/10", rating: 4.8 },
  { date: "6/11", rating: 4.7 },
  { date: "6/12", rating: 4.9 },
  { date: "6/13", rating: 4.8 },
];

const sentimentData = [
  { name: "好评", value: 78, color: "#22c55e" },
  { name: "中评", value: 15, color: "#eab308" },
  { name: "差评", value: 7, color: "#ef4444" },
];

const recentReviews = [
  {
    id: 1,
    buyer: "张先生",
    rating: 5,
    content: "质量非常好，物流也很快，已经是第二次购买了！",
    product: "智能蓝牙耳机",
    time: "10分钟前",
    status: "replied",
  },
  {
    id: 2,
    buyer: "李女士",
    rating: 2,
    content: "收到的商品和描述不符，颜色有偏差，而且有轻微划痕。",
    product: "USB-C 充电线",
    time: "25分钟前",
    status: "pending",
  },
  {
    id: 3,
    buyer: "王同学",
    rating: 4,
    content: "还不错，就是包装可以再加强一下，运输途中盒子有点压扁了。",
    product: "无线鼠标",
    time: "1小时前",
    status: "replied",
  },
  {
    id: 4,
    buyer: "赵女士",
    rating: 5,
    content: "性价比超高！推荐给朋友了，朋友也买了一个。",
    product: "手机支架",
    time: "2小时前",
    status: "replied",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    stat.trend === "up"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-red-100 dark:bg-red-900/30"
                  }`}
                >
                  <stat.icon
                    className={`w-5 h-5 ${
                      stat.trend === "up"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1">
                {stat.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={`text-xs ${
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stat.change} 较昨日
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>评分趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={ratingTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis domain={[4, 5]} stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="url(#gradient)"
                  strokeWidth={2}
                  dot={{ fill: "#6366f1", r: 4 }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#9333ea" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>评论情感分布</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 ml-4">
              {sentimentData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.name} {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>最新评论</CardTitle>
          <a
            href="/dashboard/reviews"
            className="text-sm text-blue-600 hover:underline"
          >
            查看全部
          </a>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div
                key={review.id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                  {review.buyer[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{review.buyer}</span>
                    <span className="text-yellow-500 text-sm">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                    <Badge
                      variant={
                        review.status === "replied" ? "success" : "warning"
                      }
                      className="text-xs"
                    >
                      {review.status === "replied" ? "已回复" : "待回复"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                    {review.content}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span>{review.product}</span>
                    <span>{review.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
