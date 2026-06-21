import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "浏览器插件 - 口碑助手",
  description: "口碑助手Chrome浏览器插件，在美团、大众点评、携程后台一键AI生成差评回复，无需复制粘贴。",
};

export default function PluginPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-sm mb-6">
            🧩 Chrome 浏览器插件
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            装个插件，告别复制粘贴
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            在美团、大众点评、携程的商家后台，每条评价旁边自动出现 AI 回复按钮。
            点一下，AI 生成回复，自动填入回复框。
          </p>
        </div>

        {/* How it works */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📦</span>
            </div>
            <h3 className="text-xl font-bold mb-2">安装插件</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              下载口碑助手 Chrome 扩展包，30 秒加载到浏览器。无需注册账号即可安装。
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🌐</span>
            </div>
            <h3 className="text-xl font-bold mb-2">打开商家后台</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              像往常一样进入美团、大众点评、携程的评价管理页面。插件会自动识别。
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🤖</span>
            </div>
            <h3 className="text-xl font-bold mb-2">一键 AI 回复</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              每条评价右上角出现 AI 回复按钮。点一下选风格，AI 生成后自动填入回复框。
            </p>
          </div>
        </div>

        {/* Platforms */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">支持的平台</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "美团商家中心", icon: "🍜", url: "e.meituan.com", desc: "餐饮、酒店、休闲娱乐商家后台" },
              { name: "大众点评商家后台", icon: "📝", url: "e.dianping.com", desc: "本地生活门店评价管理" },
              { name: "携程ebooking", icon: "🏨", url: "ebooking.ctrip.com", desc: "酒店民宿订单与评价管理" },
              { name: "飞猪商家后台", icon: "✈️", url: "travel.fliggy.com", desc: "旅游酒店商家管理" },
              { name: "去哪儿商家", icon: "🎒", url: "ebooking.qunar.com", desc: "酒店民宿商家后台" },
              { name: "小红书专业号", icon: "📕", url: "creator.xiaohongshu.com", desc: "内容创作者商家管理" },
            ].map(p => (
              <div key={p.name} className="p-5 rounded-xl bg-slate-800/50 border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{p.icon}</span>
                  <span className="font-bold">{p.name}</span>
                </div>
                <p className="text-xs text-slate-500 mb-1">{p.url}</p>
                <p className="text-sm text-slate-400">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature comparison */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">插件版 vs 网页版</h2>
          <div className="overflow-hidden rounded-2xl border border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800">
                  <th className="p-4 text-left text-slate-400 w-1/3">对比</th>
                  <th className="p-4 text-center text-indigo-400">🧩 插件版</th>
                  <th className="p-4 text-center text-slate-400">🌐 网页版</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {[
                  ["使用方式", "在商家后台直接操作", "打开网页粘贴评论"],
                  ["复制粘贴", "不需要", "需要手动复制粘贴"],
                  ["AI 回复", "一键填入回复框", "生成后复制粘贴回去"],
                  ["支持平台", "美团/点评/携程等 6 个", "任何平台（粘贴即可）"],
                  ["安装", "需装Chrome扩展", "打开浏览器即可"],
                  ["适用场景", "日常批量回复", "偶尔处理差评"],
                ].map(([label, plugin, web]) => (
                  <tr key={label} className="hover:bg-slate-800/50">
                    <td className="p-4 font-medium text-slate-300">{label}</td>
                    <td className="p-4 text-center text-indigo-300">{plugin}</td>
                    <td className="p-4 text-center text-slate-400">{web}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Install guide */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">📥 如何安装</h2>
          <div className="space-y-4 max-w-lg mx-auto">
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">1</span>
              <div>
                <p className="font-medium">打开 Chrome 扩展管理页</p>
                <p className="text-sm text-slate-400">在地址栏输入 chrome://extensions，回车</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">2</span>
              <div>
                <p className="font-medium">开启开发者模式</p>
                <p className="text-sm text-slate-400">右上角打开"开发者模式"开关</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">3</span>
              <div>
                <p className="font-medium">加载扩展</p>
                <p className="text-sm text-slate-400">点击"加载已解压的扩展程序"，选择 chrome-extension 文件夹</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">4</span>
              <div>
                <p className="font-medium">搞定！</p>
                <p className="text-sm text-slate-400">去美团或点评商家后台，评价旁边就会出现 AI 回复按钮</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-slate-400 mb-4">还没注册？注册即可使用插件 + 网页版全套功能</p>
          <div className="flex justify-center gap-4">
            <Link href="/register" className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity">
              免费注册
            </Link>
            <Link href="/#plugin" className="px-8 py-3 rounded-xl border border-slate-600 text-slate-300 font-medium hover:bg-slate-800 transition-colors">
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
