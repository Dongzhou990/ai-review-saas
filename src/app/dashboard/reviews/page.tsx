"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/input";
import {
  Star,
  Sparkles,
  Send,
  Edit3,
  Check,
  X,
  Loader2,
} from "lucide-react";

// 模拟评论数据
const mockReviews = [
  {
    id: 1,
    buyer: "张先生",
    rating: 5,
    content:
      "质量非常好，物流也很快，已经是第二次购买了！音质比预期的好很多，续航也很给力。",
    product: "智能蓝牙耳机",
    time: "10分钟前",
    platform: "抖音小店",
    status: "replied" as const,
    reply:
      "感谢张先生的支持和好评！很高兴您对耳机的音质和续航都满意。期待您的再次光临~",
  },
  {
    id: 2,
    buyer: "李女士",
    rating: 2,
    content:
      "收到的商品和描述不符，颜色有偏差，而且充电口有轻微划痕。希望卖家能给个合理的解释和处理方案。",
    product: "USB-C 充电线",
    time: "25分钟前",
    platform: "淘宝",
    status: "pending" as const,
  },
  {
    id: 3,
    buyer: "王同学",
    rating: 4,
    content:
      "鼠标手感不错，反应也灵敏。就是包装可以再加强一下，运输途中盒子有点压扁了，还好鼠标本身没坏。",
    product: "无线鼠标",
    time: "1小时前",
    platform: "拼多多",
    status: "pending" as const,
  },
  {
    id: 4,
    buyer: "赵女士",
    rating: 5,
    content:
      "性价比超高！推荐给朋友了，朋友也买了一个。支架很稳，角度调节也很方便。",
    product: "手机支架",
    time: "2小时前",
    platform: "抖音小店",
    status: "replied" as const,
    reply: "感谢赵女士的推荐！我们会继续努力提供高性价比的好产品~",
  },
  {
    id: 5,
    buyer: "刘先生",
    rating: 1,
    content:
      "用了不到一周就坏了，质量太差了！要求退货退款，不然就给差评投诉。",
    product: "智能蓝牙耳机",
    time: "3小时前",
    platform: "淘宝",
    status: "pending" as const,
  },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(mockReviews);
  const [generating, setGenerating] = useState<number | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const handleGenerateReply = async (reviewId: number) => {
    setGenerating(reviewId);
    // 模拟 AI 生成延迟
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const review = reviews.find((r) => r.id === reviewId);
    if (!review) return;

    let aiReply = "";
    if (review.rating >= 4) {
      aiReply = `感谢${review.buyer}的好评！很高兴您对我们的${review.product}感到满意。我们会继续努力提供优质的产品和服务，期待您的再次光临！`;
    } else if (review.rating >= 3) {
      aiReply = `感谢${review.buyer}的反馈和建议！我们会认真考虑改进包装。如有任何问题，欢迎随时联系我们，为您妥善处理。`;
    } else {
      aiReply = `非常抱歉给您带来了不好的体验，${review.buyer}。我们已收到您的反馈，客服会在24小时内联系您处理退换货事宜。您也可以联系我们的客服热线获取更快服务。我们一定会给您一个满意的解决方案。`;
    }

    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, reply: aiReply, status: "replied" as const } : r))
    );
    setGenerating(null);
  };

  const handleEditStart = (reviewId: number, currentReply: string) => {
    setEditing(reviewId);
    setEditText(currentReply);
  };

  const handleEditSave = (reviewId: number) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, reply: editText, status: "replied" as const }
          : r
      )
    );
    setEditing(null);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-500";
    if (rating >= 3) return "text-yellow-500";
    return "text-red-500";
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 4) return { label: "好评", variant: "success" as const };
    if (rating >= 3) return { label: "中评", variant: "warning" as const };
    return { label: "差评", variant: "danger" as const };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">评论管理</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            全部 (48)
          </Button>
          <Button variant="ghost" size="sm">
            待回复 (12)
          </Button>
          <Button variant="ghost" size="sm">
            已回复 (36)
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* 买家头像 */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium">
                  {review.buyer[0]}
                </div>

                {/* 评论内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{review.buyer}</span>
                    <span className={getRatingColor(review.rating)}>
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                    <Badge variant={getRatingBadge(review.rating).variant}>
                      {getRatingBadge(review.rating).label}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {review.platform}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {review.content}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>{review.product}</span>
                    <span>{review.time}</span>
                  </div>

                  {/* AI 回复区 */}
                  {review.reply && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg border border-blue-100 dark:border-blue-900">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-medium text-blue-600">
                          AI 生成回复
                        </span>
                        {review.status === "replied" && (
                          <Badge variant="success" className="text-xs">
                            已回复
                          </Badge>
                        )}
                      </div>
                      {editing === review.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="text-sm"
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleEditSave(review.id)}
                            >
                              <Check className="w-4 h-4" />
                              保存
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditing(null)}
                            >
                              <X className="w-4 h-4" />
                              取消
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {review.reply}
                          </p>
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleEditStart(review.id, review.reply!)
                              }
                            >
                              <Edit3 className="w-3 h-3" />
                              编辑
                            </Button>
                            <Button size="sm" variant="primary">
                              <Send className="w-3 h-3" />
                              发布回复
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 操作按钮 - 未回复的评论 */}
              {!review.reply && (
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleGenerateReply(review.id)}
                    disabled={generating === review.id}
                  >
                    {generating === review.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        AI 生成中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        AI 生成回复
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
