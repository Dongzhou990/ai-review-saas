// Kuki AI - Content Script
// Injects AI reply buttons into e-commerce platform review pages

(function () {
  "use strict";

  const AI_BUTTON_CLASS = "kuki-ai-reply-btn";
  const AI_PANEL_CLASS = "kuki-ai-panel";
  let isProcessing = false;

  // ============================================
  // Platform Detection
  // ============================================
  function detectPlatform() {
    const host = location.hostname;
    if (host.includes("taobao.com") || host.includes("tmall.com"))
      return "taobao";
    if (host.includes("jd.com")) return "jd";
    if (host.includes("douyin.com") || host.includes("jinritemai.com"))
      return "douyin";
    if (host.includes("pinduoduo.com") || host.includes("yangkeduo.com"))
      return "pinduoduo";
    return "unknown";
  }

  const platform = detectPlatform();

  // ============================================
  // Review Extraction Strategies by Platform
  // ============================================
  function findReviewContainers() {
    // Generic approach: find review-like elements
    // These selectors work for most Chinese e-commerce backends
    const selectors = [
      // Generic review containers
      '[class*="review"]',
      '[class*="comment"]',
      '[class*="evaluate"]',
      '[class*="feedback"]',
      '[class*="rate-item"]',
      '[class*="comment-item"]',
      '[class*="review-item"]',
      '[class*="评价"]',
      // Taobao-specific
      ".rate-item",
      ".tb-rate-item",
      ".mod-rate-item",
      // JD-specific
      ".comment-item",
      ".mc-comment-item",
      // Douyin-specific (Feishou / JinriTemai)
      ".evaluate-item",
      ".comment-detail",
    ];

    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        return Array.from(elements).filter((el) => {
          // Filter: element should contain text (likely a review)
          const text = el.textContent?.trim() || "";
          return text.length > 15; // Reviews have meaningful content
        });
      }
    }

    // Fallback: scan all visible text blocks for review patterns
    const allTextBlocks = document.querySelectorAll(
      "div, section, article, li, p"
    );
    return Array.from(allTextBlocks).filter((el) => {
      const text = el.textContent?.trim() || "";
      // Look for review patterns like star ratings
      const hasStars =
        text.includes("★") || text.includes("⭐") || text.includes("评分");
      return hasStars && text.length > 30;
    });
  }

  // ============================================
  // Extract Review Data from Container
  // ============================================
  function extractReviewData(container) {
    const text = container.textContent?.trim() || "";
    const stars = (text.match(/★/g) || text.match(/⭐/g) || []).length;
    const rating = stars || 3; // Default to 3 if can't detect

    // Try to find buyer name
    const nameMatch = text.match(
      /([一-龥]{2,4})(?:先生|女士|小姐|同学|老板)/
    );
    const buyerName = nameMatch ? nameMatch[0] : "买家";

    // Try to find product name
    const productEl = container.querySelector('[class*="product"], [class*="item"], [class*="goods"], [class*="商品"]');
    const productName = productEl?.textContent?.trim()?.slice(0, 30) || "";

    return {
      container,
      text: text.slice(0, 500), // Limit review text
      rating: Math.min(5, Math.max(1, rating)),
      buyerName,
      productName,
    };
  }

  // ============================================
  // Inject AI Button
  // ============================================
  function injectAIButton(container, reviewData) {
    // Check if already injected
    if (container.querySelector(`.${AI_BUTTON_CLASS}`)) return;

    const btn = document.createElement("button");
    btn.className = AI_BUTTON_CLASS;
    btn.innerHTML = `<span>✨ AI回复</span>`;
    btn.title = "Kuki AI 智能生成回复";
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleGenerateReply(container, reviewData, btn);
    };

    container.style.position =
      container.style.position || "relative";
    container.appendChild(btn);
  }

  // ============================================
  // Generate Reply
  // ============================================
  async function handleGenerateReply(container, reviewData, btn) {
    if (isProcessing) return;
    isProcessing = true;

    // Show loading
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `<span class="kuki-spinner"></span> 生成中...`;
    btn.disabled = true;

    try {
      const response = await chrome.runtime.sendMessage({
        action: "generateReply",
        data: {
          reviewContent: reviewData.text,
          rating: reviewData.rating,
          reviewerName: reviewData.buyerName,
          productName: reviewData.productName,
        },
      });

      if (response.error) {
        showError(container, response.error);
        return;
      }

      showReplyPanel(container, response.reply, reviewData);
    } catch (err) {
      showError(container, "请先登录 Kuki AI 账号");
    } finally {
      btn.innerHTML = originalHTML;
      btn.disabled = false;
      isProcessing = false;
    }
  }

  // ============================================
  // UI: Reply Panel
  // ============================================
  function showReplyPanel(container, replyText, reviewData) {
    // Remove existing panel
    const existing = container.querySelector(`.${AI_PANEL_CLASS}`);
    if (existing) existing.remove();

    const panel = document.createElement("div");
    panel.className = AI_PANEL_CLASS;
    panel.innerHTML = `
      <div class="kuki-panel-header">
        <span>✨ AI 生成回复</span>
        <div class="kuki-panel-actions">
          <button class="kuki-btn-copy" title="复制">📋</button>
          <button class="kuki-btn-edit" title="编辑">✏️</button>
          <button class="kuki-btn-close" title="关闭">✕</button>
        </div>
      </div>
      <div class="kuki-panel-body">${escapeHtml(replyText)}</div>
      <div class="kuki-panel-footer">
        <button class="kuki-btn-primary">📋 一键复制回复</button>
        <span class="kuki-badge">好评感谢</span>
        ${reviewData.rating <= 2 ? '<span class="kuki-badge kuki-badge-warn">差评挽回</span>' : ""}
      </div>
    `;

    // Event handlers
    panel.querySelector(".kuki-btn-primary").onclick = () => {
      navigator.clipboard.writeText(replyText);
      const btn = panel.querySelector(".kuki-btn-primary");
      btn.textContent = "✅ 已复制！";
      setTimeout(() => (btn.textContent = "📋 一键复制回复"), 2000);
    };

    panel.querySelector(".kuki-btn-copy").onclick = () => {
      navigator.clipboard.writeText(replyText);
    };

    panel.querySelector(".kuki-btn-edit").onclick = () => {
      const body = panel.querySelector(".kuki-panel-body");
      const currentText = body.textContent;
      body.innerHTML = `<textarea class="kuki-edit-area">${escapeHtml(currentText)}</textarea>`;
      panel.querySelector(".kuki-btn-edit").textContent = "💾";
      panel.querySelector(".kuki-btn-edit").onclick = () => {
        const edited = body.querySelector("textarea").value;
        body.textContent = edited;
        panel.querySelector(".kuki-btn-edit").textContent = "✏️";
      };
    };

    panel.querySelector(".kuki-btn-close").onclick = () => panel.remove();

    container.appendChild(panel);
  }

  // ============================================
  // UI: Error Toast
  // ============================================
  function showError(container, msg) {
    const toast = document.createElement("div");
    toast.className = "kuki-toast";
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // ============================================
  // Helpers
  // ============================================
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================
  // Initialize
  // ============================================
  function init() {
    if (platform === "unknown") {
      console.log("[Kuki AI] 当前页面非电商平台，插件未激活");
      return;
    }

    console.log(`[Kuki AI] 检测到平台: ${platform}，正在注入AI回复功能...`);

    // Debounced scan for reviews
    let scanTimer;
    function scan() {
      const containers = findReviewContainers();
      containers.forEach((container) => {
        const data = extractReviewData(container);
        injectAIButton(container, data);
      });
    }

    // Initial scan after DOM settles
    setTimeout(scan, 2000);

    // Re-scan on DOM changes
    const observer = new MutationObserver(() => {
      clearTimeout(scanTimer);
      scanTimer = setTimeout(scan, 1000);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Start
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
