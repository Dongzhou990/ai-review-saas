"use client";

const steps = [
  {
    step: 1,
    emoji: "📋",
    title: "粘贴差评",
    desc: "从大众点评/美团复制差评，粘贴进来",
  },
  {
    step: 2,
    emoji: "🤖",
    title: "AI 生成回复",
    desc: "选语气，点生成，10 秒出真诚回复",
  },
  {
    step: 3,
    emoji: "📤",
    title: "复制发布",
    desc: "复制回复，回到平台粘贴，搞定",
  },
];

export function StepsSection() {
  return (
    <section className="bg-black py-16 sm:py-20">
      <div className="max-w-lg mx-auto px-5">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">
            简单到手机就行
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold">
            3 步搞定，<span className="text-neutral-400">不到 1 分钟</span>
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {steps.map((item, i) => (
            <div
              key={item.step}
              className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-800/50"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-2xl shrink-0 shadow-lg shadow-indigo-500/20">
                {item.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                    第 {item.step} 步
                  </span>
                </div>
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden sm:block text-neutral-500 text-xl">↓</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
