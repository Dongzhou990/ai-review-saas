"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils";

export interface MeetingCardData {
  id: string;
  title: string;
  summary: string;
  status: "processing" | "completed" | "failed" | "deleted";
  duration_minutes: number | null;
  created_at: string;
  decisions?: string[];
  actionItems?: { id: string; content: string; status: string }[];
}

interface MeetingCardProps {
  meeting: MeetingCardData;
  onClick?: () => void;
  className?: string;
}

const statusConfig = {
  processing: { label: "生成中", variant: "warning" as const },
  completed: { label: "已完成", variant: "success" as const },
  failed: { label: "生成失败", variant: "danger" as const },
  deleted: { label: "已删除", variant: "gray" as const },
};

export function MeetingCard({ meeting, onClick, className }: MeetingCardProps) {
  const status = statusConfig[meeting.status] || statusConfig.processing;
  const completedCount =
    meeting.actionItems?.filter((i) => i.status === "completed").length || 0;
  const totalCount = meeting.actionItems?.length || 0;

  return (
    <Card
      className={cn(
        "hover:shadow-md transition-shadow cursor-pointer",
        meeting.status === "deleted" && "opacity-50",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {meeting.title}
              </h3>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>

            {meeting.summary && (
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                {meeting.summary}
              </p>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {timeAgo(meeting.created_at)}
              </span>
              {meeting.duration_minutes && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {meeting.duration_minutes} 分钟
                </span>
              )}
              {totalCount > 0 && (
                <span>
                  待办 {completedCount}/{totalCount}
                </span>
              )}
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-gray-300 shrink-0 mt-1" />
        </div>
      </CardContent>
    </Card>
  );
}
