"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Play, Pause, SkipBack, SkipForward, Volume2, Mic, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function VideoPreviewPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [script, setScript] = useState<any>(null);
  const [playing, setPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const rawP = localStorage.getItem("cf_brand");
    const rawS = localStorage.getItem("cf_script");
    if (!rawP || !rawS) { router.push("/content-factory/brand"); return; }
    setProfile(JSON.parse(rawP));
    setScript(JSON.parse(rawS));
  }, []);

  if (!script) {
    return <div className="flex items-center justify-center py-20"><svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>;
  }

  const lines = script.fullScript.split("\n").filter((l: string) => l.trim());
  const totalLines = lines.length;

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    setPlaying(true);
    let line = currentLine;
    const interval = setInterval(() => {
      line++;
      if (line >= totalLines) {
        clearInterval(interval);
        setPlaying(false);
        setCurrentLine(totalLines - 1);
        setProgress(100);
        return;
      }
      setCurrentLine(line);
      setProgress(Math.round((line / totalLines) * 100));
    }, 2500);
    (window as any).__playInterval = interval;
  };

  const stopPlay = () => {
    setPlaying(false);
    clearInterval((window as any).__playInterval);
  };

  const reset = () => { stopPlay(); setCurrentLine(0); setProgress(0); };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-8">
      <Link href="/content-factory/video" className="absolute top-4 left-4 flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-300">
        <ChevronLeft className="w-4 h-4" /> 返回
      </Link>

      {/* Phone frame */}
      <div className="w-[375px] max-w-full">
        {/* Video player */}
        <div className="relative bg-gradient-to-b from-neutral-900 to-black rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl aspect-[9/16]">
          {/* Mock avatar area */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-500/30 mx-auto mb-4 flex items-center justify-center">
                <Mic className="w-10 h-10 text-blue-400" />
              </div>
              <div className="text-sm font-medium text-blue-400">{profile?.name}</div>
              <div className="text-xs text-neutral-500">{profile?.city} · {script.style}风格</div>
            </div>
          </div>

          {/* Subtitles */}
          <div className="absolute bottom-24 left-4 right-4">
            <div className="bg-black/80 backdrop-blur rounded-xl p-4 border border-white/10 min-h-[80px]">
              <p className="text-white text-sm leading-relaxed text-center transition-opacity duration-300">
                {lines[currentLine] || lines[0]}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-20 left-4 right-4 h-1 bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-500 rounded-full" style={{ width: `${progress}%` }} />
          </div>

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-12 pb-6 px-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500">{profile?.name} · 口播视频</span>
              <div className="flex items-center gap-4">
                <button onClick={reset} className="p-2 text-neutral-400 hover:text-white transition-colors">
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-neutral-200 transition-colors"
                >
                  {playing ? <Pause className="w-5 h-5 text-black fill-black" /> : <Play className="w-5 h-5 text-black fill-black ml-0.5" />}
                </button>
                <button className="p-2 text-neutral-400 hover:text-white transition-colors">
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
              <Volume2 className="w-4 h-4 text-neutral-500" />
            </div>
          </div>

          {/* Top overlay */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Mic className="w-3 h-3 text-blue-400" />
              </div>
              <span className="text-xs text-neutral-400">{profile?.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">{script.style}</span>
              <span className="text-[10px] text-neutral-600">{Math.round(totalLines * 2.5)}s</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-neutral-300">📋 完整脚本</span>
            <span className="text-[10px] text-neutral-600">{totalLines} 段 · 约{Math.round(totalLines * 2.5)}秒</span>
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {lines.map((l: string, i: number) => (
              <div key={i} className={`text-xs p-2 rounded-lg transition-colors ${i === currentLine ? "bg-blue-500/10 text-blue-300 border border-blue-500/20" : "text-neutral-500"}`}>
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
