"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/input";
import { Input } from "@/components/ui/input";
import {
  Star,
  Sparkles,
  Send,
  Edit3,
  Check,
  X,
  Loader2,
  RefreshCw,
  Plus,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getPlatformNames } from "@/lib/platforms";
const PLATFORMS = getPlatformNames();

interface Review {
  id: string;
  buyer_name: string;
  rating: number;
  content: string;
  product_name: string;
  platform: string;
  status: "pending" | "replied" | "ignored";
  created_at: string;
  reply?: {
    id: string;
    content: string;
    status: string;
    is_ai_generated: boolean;
  };
}

export default function ReviewsPage() {
  const supabase = createClient();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "replied">("all");
  const [error, setError] = useState("");
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>("all");

  // Add review modal
  const [showAdd, setShowAdd] = useState(false);
  const [newReview, setNewReview] = useState({
    buyer_name: "",
    rating: 5,
    content: "",
    product_name: "",
    platform: "抖音小店",
  });
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Load stores for filter
    const { data: storeList } = await supabase
      .from("stores")
      .select("*")
      .eq("user_id", user.id);
    if (storeList) setStores(storeList);

    let query = supabase
      .from("reviews")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (filter === "pending") query = query.eq("status", "pending");
    if (filter === "replied") query = query.eq("status", "replied");
    if (selectedStore !== "all") query = query.eq("store_id", selectedStore);

    const { data } = await query;

    // Also load replies for each review
    if (data) {
      const reviewIds = data.map((r) => r.id);
      const { data: replies } = await supabase
        .from("replies")
        .select("*")
        .in("review_id", reviewIds)
        .eq("user_id", user.id);

      const reviewsWithReplies = data.map((review) => ({
        ...review,
        reply: replies?.find((r) => r.review_id === review.id),
      }));

      setReviews(reviewsWithReplies);
    }
    setLoading(false);
  }, [supabase, filter, selectedStore]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleGenerateReply = async (review: Review) => {
    setGenerating(review.id);
    setError("");

    try {
      const res = await fetch("/api/ai/generate-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewContent: review.content,
          rating: review.rating,
          reviewerName: review.buyer_name,
          productName: review.product_name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402 && data.upgrade) {
          setError("免费版今日次数已用完，请升级到 Pro 版获取无限次数");
        } else if (res.status === 401) {
          setError("请先登录后再使用 AI 回复");
        } else {
          setError(data.error || "AI 生成失败");
        }
        setGenerating(null);
        return;
      }

      // Save reply to Supabase
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: newReply } = await supabase
        .from("replies")
        .insert({
          review_id: review.id,
          user_id: user.id,
          content: data.reply,
          tone: "professional",
          status: "draft",
          is_ai_generated: true,
        })
        .select()
        .single();

      // Update review status
      await supabase
        .from("reviews")
        .update({ status: "replied" })
        .eq("id", review.id);

      setReviews((prev) =>
        prev.map((r) =>
          r.id === review.id
            ? { ...r, reply: newReply, status: "replied" }
            : r
        )
      );
    } catch {
      setError("网络错误，请稍后重试");
    }
    setGenerating(null);
  };

  const handleEditStart = (reviewId: string, currentReply: string) => {
    setEditing(reviewId);
    setEditText(currentReply);
  };

  const handleEditSave = async (review: Review) => {
    if (!review.reply) return;

    await supabase
      .from("replies")
      .update({ content: editText, edited_by_user: true, updated_at: new Date().toISOString() })
      .eq("id", review.reply.id);

    setReviews((prev) =>
      prev.map((r) =>
        r.id === review.id
          ? { ...r, reply: { ...review.reply!, content: editText } }
          : r
      )
    );
    setEditing(null);
  };

  const handlePublishReply = async (review: Review) => {
    if (!review.reply) return;

    await supabase
      .from("replies")
      .update({ status: "published", published_at: new Date().toISOString() })
      .eq("id", review.reply.id);

    setReviews((prev) =>
      prev.map((r) =>
        r.id === review.id
          ? { ...r, reply: { ...review.reply!, status: "published" } }
          : r
      )
    );
  };

  const handleAddReview = async () => {
    if (!newReview.buyer_name.trim() || !newReview.content.trim()) return;
    setSubmitting(true);
    setError("");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("请先登录");
      setSubmitting(false);
      return;
    }

    // 1. Save review (link to selected store if any)
    const storeId = selectedStore !== "all" ? selectedStore : (stores[0]?.id || null);
    const platform = newReview.platform || (storeId ? stores.find(s => s.id === storeId)?.platform : "抖音小店") || "抖音小店";

    const { data: review, error: insertError } = await supabase
      .from("reviews")
      .insert({
        user_id: user.id,
        store_id: storeId,
        buyer_name: newReview.buyer_name.trim(),
        rating: newReview.rating,
        content: newReview.content.trim(),
        product_name: newReview.product_name.trim() || "商品",
        platform,
        status: "pending",
        reviewed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      setError("导入失败: " + insertError.message);
      setSubmitting(false);
      return;
    }

    setShowAdd(false);
    setNewReview({ buyer_name: "", rating: 5, content: "", product_name: "", platform: "抖音小店" });
    setSubmitting(false);

    // 2. Auto-generate AI reply
    if (review) {
      setGenerating(review.id);
      try {
        const res = await fetch("/api/ai/generate-reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reviewContent: review.content,
            rating: review.rating,
            reviewerName: review.buyer_name,
            productName: review.product_name,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          await supabase.from("replies").insert({
            review_id: review.id,
            user_id: user.id,
            content: data.reply,
            status: "draft",
            is_ai_generated: true,
          });
          await supabase.from("reviews").update({ status: "replied" }).eq("id", review.id);
        } else {
          setError(data.error || "AI 生成失败，可稍后点击'AI生成回复'重试");
        }
      } catch (err: any) {
        setError("AI 生成失败: " + (err?.message || "网络错误"));
      }
      setGenerating(null);
      loadReviews();
    }
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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold">评论管理</h1>
        <div className="flex gap-2 items-center">
          <select
            className="h-9 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm"
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
          >
            <option value="all">全部店铺</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>{s.platform} - {s.name}</option>
            ))}
          </select>
          <Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4" /> 导入评论
          </Button>
          <Button
            variant={filter === "all" ? "outline" : "ghost"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            全部
          </Button>
          <Button
            variant={filter === "pending" ? "outline" : "ghost"}
            size="sm"
            onClick={() => setFilter("pending")}
          >
            待回复
          </Button>
          <Button
            variant={filter === "replied" ? "outline" : "ghost"}
            size="sm"
            onClick={() => setFilter("replied")}
          >
            已回复
          </Button>
          <Button variant="ghost" size="sm" onClick={loadReviews}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Add Review Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">导入评论</h2>
              <button onClick={() => setShowAdd(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              粘贴买家评论，AI 会自动生成回复
            </p>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">买家昵称</label>
                  <Input
                    placeholder="如：张先生"
                    value={newReview.buyer_name}
                    onChange={(e) => setNewReview({ ...newReview, buyer_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">平台</label>
                  <select
                    className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm"
                    value={newReview.platform}
                    onChange={(e) => setNewReview({ ...newReview, platform: e.target.value })}
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">评分</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className={`text-2xl transition-colors ${
                          star <= newReview.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">商品名称</label>
                  <Input
                    placeholder="如：蓝牙耳机"
                    value={newReview.product_name}
                    onChange={(e) => setNewReview({ ...newReview, product_name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">评论内容</label>
                <Textarea
                  placeholder="粘贴买家评论内容..."
                  rows={4}
                  value={newReview.content}
                  onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <Button variant="ghost" onClick={() => setShowAdd(false)}>取消</Button>
                <Button
                  variant="primary"
                  onClick={handleAddReview}
                  disabled={!newReview.buyer_name.trim() || !newReview.content.trim() || submitting}
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> 导入中...</>
                  ) : (
                    <><Plus className="w-4 h-4" /> 导入并生成回复</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">
          {error}
          <button className="ml-2 underline" onClick={() => setError("")}>
            关闭
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            <MessageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">暂无评论</p>
            <p className="text-sm mt-1">
              连接店铺后，评论会自动同步到这里
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium">
                    {review.buyer_name[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{review.buyer_name}</span>
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
                      <span>{review.product_name}</span>
                      <span>
                        {new Date(review.created_at).toLocaleDateString("zh-CN")}
                      </span>
                    </div>

                    {/* AI Reply */}
                    {review.reply && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg border border-blue-100 dark:border-blue-900">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-medium text-blue-600">
                            {review.reply.is_ai_generated ? "AI 生成回复" : "回复"}
                          </span>
                          <Badge variant="success" className="text-xs">
                            {review.reply.status === "published"
                              ? "已发布"
                              : "草稿"}
                          </Badge>
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
                                onClick={() => handleEditSave(review)}
                              >
                                <Check className="w-4 h-4" /> 保存
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditing(null)}
                              >
                                <X className="w-4 h-4" /> 取消
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {review.reply.content}
                            </p>
                            <div className="flex gap-2 mt-3">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleEditStart(
                                    review.id,
                                    review.reply!.content
                                  )
                                }
                              >
                                <Edit3 className="w-3 h-3" /> 编辑
                              </Button>
                              {review.reply.status !== "published" && (
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={() => handlePublishReply(review)}
                                >
                                  <Send className="w-3 h-3" /> 发布回复
                                </Button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Generate button for unreplied */}
                {!review.reply && (
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleGenerateReply(review)}
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
      )}
    </div>
  );
}

function MessageIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
      />
    </svg>
  );
}
