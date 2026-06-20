"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ClipboardList,
  Lightbulb,
  AlertTriangle,
  ThumbsUp,
  Sparkles,
  FileText,
  Share2,
} from "lucide-react";

export default function WeeklyPage() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setReport(null);

    try {
      const res = await fetch("/api/ai/weekly-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "生成失败");
      } else {
        setReport(data);
      }
    } catch {
      setError("网络错误，请重试");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">每周口碑周报</h2>
            <p className="text-sm text-gray-500">AI 自动分析本周差评，帮你总结问题、给建议</p>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> AI 正在分析本周评论...</>
          ) : (
            <><FileText className="w-5 h-5" /> 生成本周周报</>
          )}
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Report */}
      {report && (
        <>
          {/* Summary */}
          <Card className="border-blue-200 bg-blue-50/30">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-sm mb-1">📊 本周口碑概况</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{report.summary}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card><CardContent className="p-4 text-center">
              <p className="text-3xl font-bold">{report.weeklyReviews}</p>
              <p className="text-xs text-gray-500">本周评论数</p>
            </CardContent></Card>
            <Card><CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-green-600">{report.weeklyGood}</p>
              <p className="text-xs text-gray-500">本周好评</p>
            </CardContent></Card>
            <Card><CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-red-600">{report.weeklyBad}</p>
              <p className="text-xs text-gray-500">本周差评</p>
            </CardContent></Card>
            <Card><CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-amber-600">{report.badRate}%</p>
              <p className="text-xs text-gray-500">差评占比</p>
            </CardContent></Card>
          </div>

          {/* Top Issues */}
          {report.topIssues && report.topIssues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  本周突出问题
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {report.topIssues.map((issue: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center font-bold">{i + 1}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{issue.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{issue.count} 条差评 · 占比 {issue.percentage}%</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Suggestions */}
          {report.suggestions && report.suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  改进建议
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {report.suggestions.map((s: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 text-xs flex items-center justify-center font-bold">{i + 1}</span>
                    <p className="text-sm text-gray-700">{s}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Reply Suggestions */}
          {report.replyExamples && report.replyExamples.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  差评回复参考
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {report.replyExamples.map((r: any, i: number) => (
                  <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <p className="text-xs text-gray-400 mb-2">
                      {r.scenario}
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {r.reply}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Invite Suggestion */}
          {report.inviteSuggestion && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5 text-green-500" />
                  本周邀评建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {report.inviteSuggestion}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action */}
          <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
            <p className="font-bold text-lg mb-2">生成好了，去看看差评吧</p>
            <p className="text-gray-600 mb-4 text-sm">根据周报建议，去处理待回差评</p>
            <a href="/dashboard/reviews">
              <Button variant="primary">去处理差评</Button>
            </a>
          </div>
        </>
      )}

      {/* Empty state */}
      {!report && !loading && (
        <div className="text-center py-12 text-gray-400">
          <ClipboardList className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">还没有生成过周报</p>
          <p className="text-sm">导入评论后，点击上方按钮生成本周口碑周报</p>
        </div>
      )}
    </div>
  );
}
