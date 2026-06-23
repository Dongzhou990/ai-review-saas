export default function XiaohongshuPage() {
  return (
    <div className="bg-black text-white">
      {/* ============================================ */}
      {/* CARD 1: 封面 - 大标题 + 核心价值             */}
      {/* ============================================ */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center px-6 py-16 bg-black relative overflow-hidden">
        {/* 光晕 */}
        <div className="absolute top-20 -right-20 w-80 h-80 bg-indigo-500/8 rounded-full blur-[100px]" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/6 rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-sm">
          {/* 标签 */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/8 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span className="text-xs font-medium text-neutral-400">美业门店口碑运营助手</span>
          </div>

          {/* 主标题 */}
          <h1 className="text-[2.5rem] font-black leading-[1.1] tracking-tight">
            <span className="text-white">差评来了</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              10秒回好
            </span>
          </h1>

          <p className="mt-5 text-sm text-neutral-400 leading-relaxed max-w-xs">
            AI 看懂每条差评，生成不一样的真诚回复
          </p>

          {/* 三大数字 */}
          <div className="mt-10 grid grid-cols-3 gap-4 w-full">
            {[
              { num: "10s", label: "生成回复" },
              { num: "200+", label: "门店在用" },
              { num: "3条/天", label: "免费使用" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-2xl font-extrabold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                  {item.num}
                </div>
                <div className="text-[11px] text-neutral-500 mt-1">{item.label}</div>
              </div>
            ))}
          </div>

          {/* 底部文案 */}
          <div className="mt-10 pt-6 border-t border-white/5 w-full">
            <p className="text-[13px] font-semibold text-white">
              口碑助手
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">
              不绑卡 · 不收费 · 每天3条免费
            </p>
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-neutral-800 text-[10px]">
          — 1/5 —
        </div>
      </section>

      {/* ============================================ */}
      {/* CARD 2: 痛点 - 你是不是也这样？              */}
      {/* ============================================ */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center px-6 py-16 bg-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/4 rounded-full blur-[120px]" />

        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-sm">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/8 mb-6">
            <span className="text-xs font-medium text-neutral-400">😫 你是不是也这样？</span>
          </div>

          <h2 className="text-3xl font-extrabold leading-tight">
            差评躺在那
            <br />
            <span className="text-neutral-400">不知道怎么回</span>
          </h2>

          <div className="mt-10 space-y-3 w-full">
            {[
              {
                emoji: "😰",
                title: "新客看到差评，划走找别家",
                desc: "一条差评劝退的不止一个人",
              },
              {
                emoji: "😫",
                title: "每条都想写不一样的回复",
                desc: "老板真没这个精力，一拖就是半天",
              },
              {
                emoji: "😩",
                title: "回得不好反而火上浇油",
                desc: "模板式回复，客人一眼就看穿",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-left"
              >
                <span className="text-3xl shrink-0">{item.emoji}</span>
                <div>
                  <div className="font-semibold text-sm">{item.title}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-sm font-bold text-blue-400">
            别急，往下看 👇
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-neutral-800 text-[10px]">
          — 2/5 —
        </div>
      </section>

      {/* ============================================ */}
      {/* CARD 3: 功能 - 核心能力                       */}
      {/* ============================================ */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center px-6 py-16 bg-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/6 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/4 rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-sm">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/8 mb-6">
            <span className="text-xs font-medium text-neutral-400">🤖 口碑助手能帮你什么</span>
          </div>

          <h2 className="text-3xl font-extrabold leading-tight mb-2">
            3 个核心能力
          </h2>
          <p className="text-sm text-neutral-500 mb-10">
            打开手机就能用，1 分钟搞定
          </p>

          <div className="space-y-4 w-full">
            {[
              {
                step: "01",
                emoji: "💬",
                title: "差评来了，10 秒回好",
                desc: "粘贴差评，AI 看懂内容自动生成真诚回复。\n不是那种「亲亲抱歉哦」的模板。",
                accent: "border-l-blue-500",
              },
              {
                step: "02",
                emoji: "🔍",
                title: "AI 分析，看懂问题在哪",
                desc: "最近的差评是服务问题还是技术问题？\nAI 帮你归因，不凭感觉拍脑袋。",
                accent: "border-l-indigo-500",
              },
              {
                step: "03",
                emoji: "📊",
                title: "每周口碑周报，2 分钟看完",
                desc: "差评汇总 + 主要问题 + 改进建议。\n老板扫一眼就够了。",
                accent: "border-l-purple-500",
              },
            ].map((item) => (
              <div
                key={item.step}
                className={`flex gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] border-l-2 ${item.accent} text-left`}
              >
                <span className="text-3xl shrink-0">{item.emoji}</span>
                <div>
                  <div className="text-[10px] font-bold text-neutral-600 mb-1 tracking-wider">
                    {item.step}
                  </div>
                  <div className="font-bold text-base mb-1.5">{item.title}</div>
                  <div className="text-xs text-neutral-400 leading-relaxed whitespace-pre-line">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-neutral-800 text-[10px]">
          — 3/5 —
        </div>
      </section>

      {/* ============================================ */}
      {/* CARD 4: 对比 - 有 vs 没有                       */}
      {/* ============================================ */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center px-6 py-16 bg-black relative overflow-hidden">
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-red-500/3 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-green-500/3 rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-sm">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/8 mb-6">
            <span className="text-xs font-medium text-neutral-400">⚡ 有口碑助手 vs 没有</span>
          </div>

          <h2 className="text-3xl font-extrabold leading-tight mb-8">
            差别有多大？
          </h2>

          <div className="w-full space-y-2">
            {/* 表头 */}
            <div className="grid grid-cols-2 gap-2 mb-1">
              <div className="text-center py-2 rounded-lg bg-red-500/[0.04] border border-red-500/[0.08]">
                <span className="text-[11px] font-semibold text-red-400">❌ 没有口碑助手</span>
              </div>
              <div className="text-center py-2 rounded-lg bg-green-500/[0.04] border border-green-500/[0.08]">
                <span className="text-[11px] font-semibold text-green-400">✅ 有口碑助手</span>
              </div>
            </div>

            {[
              { bad: "憋半小时想回复", good: "10秒生成，复制就发" },
              { bad: "每条回复都一样", good: "AI看懂内容，每条都不同" },
              { bad: "不知道哪出问题", good: "AI归因分析，一目了然" },
              { bad: "好评越来越少", good: "AI写邀评，好评变多" },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-red-500/[0.03] border border-red-500/[0.06]">
                  <div className="text-[11px] text-neutral-500">{row.bad}</div>
                </div>
                <div className="p-3 rounded-xl bg-green-500/[0.03] border border-green-500/[0.06]">
                  <div className="text-[11px] text-neutral-200 font-medium">{row.good}</div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm font-bold text-blue-400">
            少丢一个新客就回本了 💰
          </p>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-neutral-800 text-[10px]">
          — 4/5 —
        </div>
      </section>

      {/* ============================================ */}
      {/* CARD 5: 行动号召 - 免费开始                     */}
      {/* ============================================ */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center px-6 py-16 bg-black relative overflow-hidden">
        {/* 聚焦光晕 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/8 via-blue-500/5 to-purple-500/4 rounded-full blur-[120px]" />

        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-sm">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-xs font-medium text-neutral-300">不绑卡 · 不收费</span>
          </div>

          <h2 className="text-4xl font-black leading-tight">
            每天
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              {" "}3 条{" "}
            </span>
            免费
          </h2>
          <p className="mt-3 text-base text-neutral-400">
            觉得有用再升级
          </p>

          <p className="mt-6 text-sm text-neutral-500 leading-relaxed max-w-xs">
            你只管试试有没有用
            <br />
            没用就不用了呗，又不花钱
          </p>

          {/* 三步 */}
          <div className="mt-8 flex items-center gap-2 text-[11px] text-neutral-500">
            {["粘贴差评", "AI生成", "复制发布"].map((step, i) => (
              <div key={step} className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-neutral-300">
                  {i + 1}
                </span>
                <span>{step}</span>
                {i < 2 && <span className="text-neutral-700 ml-0.5">→</span>}
              </div>
            ))}
          </div>

          {/* 搜索卡片 */}
          <div className="mt-8 w-full p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div className="text-[10px] text-neutral-600 mb-2 tracking-wider uppercase">
              🔍 微信搜索
            </div>
            <div className="text-2xl font-extrabold tracking-wide">
              口碑助手
            </div>
            <div className="mt-3 flex items-center gap-3">
              {/* 二维码 */}
              <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
                <img
                  src="/qrcode.jpg"
                  alt="QR"
                  className="w-14 h-14 rounded object-cover"
                />
              </div>
              <div className="text-left">
                <div className="text-xs text-neutral-400">或扫码使用</div>
                <div className="text-[10px] text-neutral-600 mt-0.5">
                  手机就能用 · 无需下载
                </div>
              </div>
            </div>
          </div>

          {/* 底部标语 */}
          <p className="mt-8 text-[13px] font-semibold text-white/80">
            让每一条差评，都变成客人回来的理由
          </p>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-neutral-800 text-[10px]">
          — 5/5 —
        </div>
      </section>
    </div>
  );
}
