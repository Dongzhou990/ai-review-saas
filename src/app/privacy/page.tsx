export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">隐私政策</h1>
        <p className="text-sm text-gray-500 mb-6">最后更新：2026 年 6 月</p>

        <div className="prose dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. 我们收集的信息</h2>
            <p className="text-gray-600 dark:text-gray-400">
              我们仅收集为您提供服务所必需的信息：邮箱地址（用于账号注册）、
              店铺信息（用于AI评论管理）、评论数据（用于生成AI回复）。
              我们不收集任何个人身份信息以外的敏感数据。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. 信息使用方式</h2>
            <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-1">
              <li>提供AI评论回复生成服务</li>
              <li>发送服务相关的通知（如套餐变更）</li>
              <li>改进和优化我们的AI模型</li>
              <li>遵守法律法规要求</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. 数据安全</h2>
            <p className="text-gray-600 dark:text-gray-400">
              我们采用业界标准的安全措施保护您的数据。所有数据传输均通过加密协议进行。
              您的评论数据存储在Supabase提供的安全数据库中，AI API调用仅传输
              生成回复所必需的评论内容，不包含您的个人信息。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. 第三方服务</h2>
            <p className="text-gray-600 dark:text-gray-400">
              我们使用以下第三方服务：Supabase（数据库和认证）、Stripe（支付处理）、
              DeepSeek/Anthropic（AI模型）。这些服务提供商有各自的隐私政策。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. 联系我们</h2>
            <p className="text-gray-600 dark:text-gray-400">
              如果您对隐私政策有任何疑问，请通过我们的客服渠道联系。
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
