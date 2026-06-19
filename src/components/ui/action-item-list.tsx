"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, User } from "lucide-react";

export interface ActionItem {
  id: string;
  content: string;
  assignee: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in_progress" | "completed" | "cancelled";
  due_date: string | null;
}

interface ActionItemListProps {
  items: ActionItem[];
  onStatusChange?: (itemId: string, newStatus: string) => void;
  className?: string;
}

const priorityConfig = {
  high: { label: "高", variant: "danger" as const },
  medium: { label: "中", variant: "warning" as const },
  low: { label: "低", variant: "gray" as const },
};

const statusConfig = {
  pending: { label: "待办", color: "bg-gray-200 dark:bg-gray-700" },
  in_progress: { label: "进行中", color: "bg-blue-200 dark:bg-blue-800" },
  completed: { label: "已完成", color: "bg-green-200 dark:bg-green-800" },
  cancelled: { label: "已取消", color: "bg-red-100 dark:bg-red-900/30" },
};

const statusCycle: Record<string, string> = {
  pending: "in_progress",
  in_progress: "completed",
  completed: "pending",
  cancelled: "pending",
};

export function ActionItemList({
  items,
  onStatusChange,
  className,
}: ActionItemListProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic py-4">暂无待办事项</p>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item) => {
        const priority = priorityConfig[item.priority];
        const status = statusConfig[item.status];
        const isDone = item.status === "completed" || item.status === "cancelled";

        return (
          <div
            key={item.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 transition-colors",
              isDone && "opacity-60"
            )}
          >
            {/* Status toggle */}
            <button
              onClick={() => {
                const next = statusCycle[item.status] || "pending";
                onStatusChange?.(item.id, next);
              }}
              className={cn(
                "w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 transition-colors",
                item.status === "completed"
                  ? "bg-green-500 border-green-500"
                  : item.status === "in_progress"
                  ? "bg-blue-500 border-blue-500"
                  : item.status === "cancelled"
                  ? "bg-red-400 border-red-400"
                  : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
              )}
              title={`状态: ${status.label}，点击切换`}
            >
              {item.status === "completed" && (
                <svg
                  className="w-3 h-3 text-white mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>

            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  "text-sm text-gray-800 dark:text-gray-200",
                  isDone && "line-through"
                )}
              >
                {item.content}
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 flex-wrap">
                <Badge variant={priority.variant} className="text-xs">
                  {priority.label}优先级
                </Badge>
                {item.assignee && (
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {item.assignee}
                  </span>
                )}
                {item.due_date && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(item.due_date).toLocaleDateString("zh-CN")}
                  </span>
                )}
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-xs",
                    status.color
                  )}
                >
                  {status.label}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
