export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">服务条款</h1>
        <p className="text-sm text-gray-500 mb-6">最后更新：2026 年 6 月</p>

        <div className="prose dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. 服务说明</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Kuki AI 提供基于人工智能的电商评论管理服务，包括自动生成评论回复、
              评论数据分析等功能。服务按订阅制收费，具体价格以网站公示为准。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. 账号管理</h2>
            <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-1">
              <li>您需提供真实有效的邮箱注册账号</li>
              <li>您对账号下的所有活动负责</li>
              <li>禁止将账号转借他人使用</li>
              <li>我们保留因违规行为暂停或终止服务的权利</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. 付费与退款</h2>
            <p className="text-gray-600 dark:text-gray-400">
              订阅费用按月收取，到期自动续费。您可随时取消订阅，取消后将
              在当前付费周期结束时停止服务。已支付的费用不予退还，除非法律另有规定。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. AI生成内容免责声明</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Kuki AI 使用AI模型生成评论回复，生成内容仅供参考。
              您应审核AI生成的内容后再发布，对最终发布的回复内容承担全部责任。
              我们不保证AI生成内容100%准确、适当或符合特定场景需求。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. 服务可用性</h2>
            <p className="text-gray-600 dark:text-gray-400">
              我们尽力保证服务的稳定运行，但不对因不可抗力、第三方服务故障、
              系统维护等原因导致的服务中断承担责任。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. 知识产权</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Kuki AI 平台的所有技术、设计、代码等知识产权归我们所有。
              您保留对您发布内容的所有权利。
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
