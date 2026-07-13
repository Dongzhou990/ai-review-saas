"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Video, Loader2, Play, FileText } from "lucide-react";

export default function VideoPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [script, setScript] = useState<any>(null);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const rawP = localStorage.getItem("cf_brand");
    const rawS = localStorage.getItem("cf_script");
    if (!rawP || !rawS) { router.push("/content-factory/brand"); return; }
    setProfile(JSON.parse(rawP));
    setScript(JSON.parse(rawS));
  }, []);

  const createJob = async () => {
    setLoading(true);
    const res = await fetch("/api/cf/video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scriptId: script.id, avatarStyle: "default", voiceStyle: "温柔女声" }),
    });
    const j = await res.json();
    setJob(j);
    localStorage.setItem("cf_video_job", JSON.stringify(j));

    // Mock: simulate processing → done
    setTimeout(async () => {
      const check = await fetch(`/api/cf/video?jobId=${j.id}`);
      const done = await check.json();
      setJob(done);
    }, 3000);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs mb-6">Step 4</div>
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-3">生成口播视频</h1>
      <p className="text-neutral-500 mb-8">Mock 视频任务 — 模拟数字人视频生成流程</p>

      {!job && (
        <div className="p-8 rounded-2xl bg-neutral-950 border border-neutral-800">
          <Video className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
          <p className="text-neutral-400 mb-2">选择的口播脚本已就绪</p>
          <p className="text-xs text-neutral-600 mb-6">{script?.style}风格 · {script?.fullScript?.length || 0} 字</p>
          <Button onClick={createJob} variant="primary" size="lg" disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> 创建中...</> : <><Video className="w-4 h-4" /> 创建视频任务</>}
          </Button>
        </div>
      )}

      {job && (
        <div className="space-y-4">
          <div className={`p-6 rounded-2xl border ${job.status === "done" ? "border-green-500/30 bg-green-500/5" : "border-yellow-500/30 bg-yellow-500/5"}`}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className={`w-3 h-3 rounded-full ${job.status === "done" ? "bg-green-500" : job.status === "processing" ? "bg-yellow-500 animate-pulse" : "bg-neutral-600"}`} />
              <span className="text-sm font-medium text-neutral-300">
                {job.status === "queued" ? "排队中..." : job.status === "processing" ? "生成中..." : "✅ 生成完成"}
              </span>
            </div>

            {job.status === "done" && (
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-left">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center"><Play className="w-5 h-5 text-green-400" /></div>
                  <div>
                    <div className="text-sm font-medium">口播视频</div>
                    <div className="text-xs text-neutral-500">{job.id}.mp4</div>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full w-full" />
                </div>
                <div className="text-xs text-neutral-600 mt-2 text-right">100% · Mock Data</div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/content-factory/video-preview">
              <Button variant="outline" size="lg">
                <Play className="w-4 h-4" /> 预览视频效果
              </Button>
            </Link>
            <Button onClick={() => { localStorage.setItem("cf_video_job", JSON.stringify(job)); router.push("/content-factory/content"); }} variant="primary" size="lg">
              <FileText className="w-4 h-4" /> 生成小红书内容 <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
