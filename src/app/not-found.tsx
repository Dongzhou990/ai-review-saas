import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">404</p>
        <h1 className="text-xl font-bold mb-2">页面找不到了</h1>
        <p className="text-gray-500 mb-6">这个页面可能已被删除或链接有误。别担心，换个姿势再来。</p>
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
          返回首页
        </Link>
      </div>
    </div>
  );
}
