import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "\u535a\u5ba2 - Kuki AI \u7535\u5546\u8bc4\u8bba\u7ba1\u7406",
  description: "\u4e86\u89e3 AI \u7535\u5546\u8bc4\u8bba\u7ba1\u7406\u3001\u81ea\u52a8\u56de\u590d\u3001\u5dee\u8bc4\u631d\u6551\u7b49\u5b9e\u7528\u6280\u5de7\u3002",
};

const posts = [
  {
    slug: "ai-review-reply-guide",
    title: "AI \u81ea\u52a8\u56de\u590d\u7535\u5546\u8bc4\u8bba\u5b8c\u6574\u6307\u5357\uff082026\u7248\uff09",
    date: "2026-06-15",
    excerpt: "\u4e86\u89e3\u5982\u4f55\u7528 AI \u81ea\u52a8\u56de\u590d\u6dd8\u5b9d\u3001\u6296\u97f3\u3001\u62fc\u591a\u591a\u7b49\u5e73\u53f0\u7684\u4e70\u5bb6\u8bc4\u8bba\uff0c\u63d0\u5347\u5e97\u94fa\u8bc4\u5206\u3002",
  },
  {
    slug: "ecommerce-review-management",
    title: "\u7535\u5546\u5356\u5bb6\u8bc4\u8bba\u7ba1\u7406\u6700\u4f73\u5b9e\u8df5\uff1a\u5dee\u8bc4\u5982\u4f55\u53d8\u597d\u8bc4",
    date: "2026-06-10",
    excerpt: "\u5dee\u8bc4\u4e0d\u53ef\u6015\uff0c\u5173\u952e\u662f\u56de\u590d\u65b9\u5f0f\u3002\u672c\u6587\u5206\u4eab\u9152\u5e97\u548c\u7535\u5546\u5356\u5bb6\u5904\u7406\u5dee\u8bc4\u7684\u5b9e\u6218\u6280\u5de7\u3002",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <Link href="/" className="text-sm text-blue-600 hover:underline mb-6 inline-block">\u2190 \u8fd4\u56de\u9996\u9875</Link>
        <h1 className="text-4xl font-bold mb-4">\u535a\u5ba2</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">AI \u7535\u5546\u8bc4\u8bba\u7ba1\u7406\u3001\u5dee\u8bc4\u631d\u6551\u3001\u5e97\u94fa\u8bc4\u5206\u63d0\u5347\u7b49\u5b9e\u7528\u6280\u5de7\u3002</p>
        <div className="space-y-10">
          {posts.map(function(post) {
            return (
              <article key={post.slug}>
                <p className="text-sm text-gray-400 mb-1">{post.date}</p>
                <Link href={`/blog/${post.slug}`} className="text-xl font-semibold hover:text-blue-600 transition-colors">{post.title}</Link>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{post.excerpt}</p>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
