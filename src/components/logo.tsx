"use client";

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 32, showText = true, className = "" }: LogoProps) {
  const s = size / 32; // scale factor based on 32px base

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Reply-K Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 74 74"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* 竖线主干 */}
        <line
          x1="26" y1="10" x2="26" y2="62"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* 上斜线 */}
        <line
          x1="26" y1="24" x2="60" y2="8"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* 下斜线 + 折回箭头 */}
        <path
          d="M 26 44 L 60 62"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <polyline
          points="54,56 60,62 54,68"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* AI 节点 */}
        <circle cx="26" cy="34" r="4.5" fill="#4DA8FF" />
        {/* 脉冲环 */}
        <circle cx="26" cy="34" r="10" stroke="#4DA8FF" strokeWidth="0.7" opacity="0.35" />
        <circle cx="26" cy="34" r="16" stroke="#4DA8FF" strokeWidth="0.35" opacity="0.12" />
      </svg>

      {showText && (
        <span className="font-semibold tracking-tight text-inherit whitespace-nowrap">
          Kuki <span className="text-[#4DA8FF]">AI</span>
        </span>
      )}
    </div>
  );
}

/** 纯图标版本，用于小尺寸场景 */
export function LogoIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return <Logo size={size} showText={false} className={className} />;
}
