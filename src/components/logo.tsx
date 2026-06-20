"use client";

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 32, showText = true, className = "" }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* 口碑 K 标志 */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 74 74"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <line
          x1="26" y1="10" x2="26" y2="62"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <line
          x1="26" y1="24" x2="60" y2="8"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
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
        <circle cx="26" cy="34" r="4.5" fill="#4DA8FF" />
        <circle cx="26" cy="34" r="10" stroke="#4DA8FF" strokeWidth="0.7" opacity="0.35" />
        <circle cx="26" cy="34" r="16" stroke="#4DA8FF" strokeWidth="0.35" opacity="0.12" />
      </svg>

      {showText && (
        <span className="font-semibold tracking-tight text-inherit whitespace-nowrap">
          口碑<span className="text-[#4DA8FF]">助手</span>
        </span>
      )}
    </div>
  );
}

/** 纯图标版本 */
export function LogoIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return <Logo size={size} showText={false} className={className} />;
}
