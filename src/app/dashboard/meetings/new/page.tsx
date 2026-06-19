"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea, Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  Mic,
  FileText,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function NewMeetingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("请输入会议内容");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("请先登录");
        setSubmitting(false);
        return;
      }

      // Step 1: Insert meeting record with processing status
      const { data: meeting, error: insertError } = await supabase
        .from("meetings")
        .insert({
          user_id: user.id,
          title: title.trim() || "未命名会议",
          raw_content: content.trim(),
          content_type: "text",
          status: "processing",
        })
        .select()
        .single();

      if (insertError || !meeting) {
        setError("创建会议失败: " + (insertError?.message || "未知错误"));
        setSubmitting(false);
        return;
      }

      // Step 2: Call AI to generate minutes
      const res = await fetch("/api/ai/generate-meeting-minutes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          title: title.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Mark meeting as failed
        await supabase
          .from("meetings")
          .update({ status: "failed" })
          .eq("id", meeting.id);

        if (res.status === 402 && data.upgrade) {
          setError("免费版今日次数已用完，请升级到 Pro 版获取无限次数");
        } else {
          setError(data.error || "AI 生成失败");
        }
        setSubmitting(false);
        return;
      }

      // Step 3: Update meeting with AI results
      const { meeting: aiResult } = data;

      await supabase
        .from("meetings")
        .update({
          title: aiResult.title || meeting.title,
          summary: aiResult.summary || "",
          decisions: JSON.stringify(aiResult.decisions || []),
          key_points: JSON.stringify(aiResult.keyPoints || []),
          status: "completed",
        })
        .eq("id", meeting.id);

      // Step 4: Insert action items
      if (aiResult.actionItems && aiResult.actionItems.length > 0) {
        const actionItems = aiResult.actionItems.map(
          (item: {
            content: string;
            assignee: string;
            priority: string;
            dueDate: string;
          }) => ({
            meeting_id: meeting.id,
            user_id: user.id,
            content: item.content,
            assignee: item.assignee || "待定",
            priority: item.priority || "medium",
            due_date: item.dueDate || null,
          })
        );

        await supabase.from("meeting_action_items").insert(actionItems);
      }

      // Redirect to detail page
      router.push(`/dashboard/meetings/${meeting.id}`);
    } catch (err: any) {
      setError("网络错误: " + (err?.message || "请稍后重试"));
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" /> 返回
        </Button>
        <h1 className="text-2xl font-bold">新建会议纪要</h1>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">
          {error}
          <button className="ml-2 underline" onClick={() => setError("")}>
            关闭
          </button>
        </div>
      )}

      {/* Title input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">会议标题</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="输入会议标题，留空将自动生成..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Content input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            会议内容
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-3">
            粘贴会议录音转写文本或会议笔记，AI 将自动生成结构化会议纪要
          </p>
          <Textarea
            placeholder={`请输入会议内容，例如：

张三：今天我们讨论一下Q2的产品规划。
李四：好的，我先说一下目前的进度。Q1的目标基本都完成了...
王五：我觉得Q2的重点应该放在移动端优化上。
张三：同意。那李四你来负责移动端的整体规划，王五协助UI设计。
李四：没问题，我下周五之前出一份详细计划。
王五：好的，我配合李四。`}
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={!content.trim() || submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              AI 生成中...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              AI 生成会议纪要
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={() => router.back()}
          disabled={submitting}
        >
          取消
        </Button>
      </div>
    </div>
  );
}
