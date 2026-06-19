"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  FileText,
  Lightbulb,
  CheckCircle2,
  Pencil,
  Check,
  X,
} from "lucide-react";

interface MinutesDisplayProps {
  summary: string;
  decisions: string[];
  keyPoints: string[];
  editable?: boolean;
  editing?: boolean;
  editValues?: { summary: string; decisions: string; keyPoints: string };
  onEditChange?: (field: string, value: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
  onStartEdit?: () => void;
  className?: string;
}

export function MinutesDisplay({
  summary,
  decisions,
  keyPoints,
  editable = false,
  editing = false,
  editValues,
  onEditChange,
  onSave,
  onCancel,
  onStartEdit,
  className,
}: MinutesDisplayProps) {
  if (editing && editValues) {
    return (
      <div className={cn("space-y-4", className)}>
        <div>
          <label className="text-sm font-medium mb-1.5 block text-gray-700 dark:text-gray-300">
            会议摘要
          </label>
          <Textarea
            value={editValues.summary}
            onChange={(e) => onEditChange?.("summary", e.target.value)}
            rows={4}
            placeholder="输入会议摘要..."
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block text-gray-700 dark:text-gray-300">
            会议决定（每行一项）
          </label>
          <Textarea
            value={editValues.decisions}
            onChange={(e) => onEditChange?.("decisions", e.target.value)}
            rows={4}
            placeholder="输入会议决定..."
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block text-gray-700 dark:text-gray-300">
            关键要点（每行一项）
          </label>
          <Textarea
            value={editValues.keyPoints}
            onChange={(e) => onEditChange?.("keyPoints", e.target.value)}
            rows={4}
            placeholder="输入关键要点..."
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <Check className="w-4 h-4" /> 保存
          </button>
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" /> 取消
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-5", className)}>
      {/* Summary */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
              会议摘要
            </h4>
          </div>
          {editable && (
            <button
              onClick={onStartEdit}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" /> 编辑
            </button>
          )}
        </div>
        <Card className="p-4 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent border-blue-100 dark:border-blue-900/50">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {summary || (
              <span className="text-gray-400 italic">暂无摘要</span>
            )}
          </p>
        </Card>
      </div>

      {/* Decisions */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
            会议决定
          </h4>
          {decisions.length > 0 && (
            <Badge variant="gray" className="text-xs">
              {decisions.length}
            </Badge>
          )}
        </div>
        {decisions.length > 0 ? (
          <ul className="space-y-2">
            {decisions.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300"
              >
                <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center text-xs shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 italic pl-9">暂无记录</p>
        )}
      </div>

      {/* Key Points */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-purple-600" />
          </div>
          <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
            关键要点
          </h4>
          {keyPoints.length > 0 && (
            <Badge variant="gray" className="text-xs">
              {keyPoints.length}
            </Badge>
          )}
        </div>
        {keyPoints.length > 0 ? (
          <ul className="space-y-2">
            {keyPoints.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300"
              >
                <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center text-xs shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 italic pl-9">暂无记录</p>
        )}
      </div>
    </div>
  );
}
