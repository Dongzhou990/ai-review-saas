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
    if (host.includes("ctrip.com")) return "ctrip";
    if (host.includes("qunar.com")) return "qunar";
    if (host.includes("meituan.com")) return "meituan";
    if (host.includes("fliggy.com")) return "fliggy";
    return "unknown";
  }

  const platform = detectPlatform();

  // ============================================
  // Review Extraction Strategies by Platform
  // ============================================
  function findReviewContainers() {
    var hotelSelectors = {
      ctrip: ["[class*=\"comment_detail\"]", "[class*=\"commentItem\"]", "[class*=\"hotel_comment\"]", "[class*=\"comment_mod\"]"],
      qunar: ["[class*=\"e_comment\"]", "[class*=\"comment_list\"] [class*=\"item\"]", "[class*=\"review-item\"]"],
      meituan: ["[class*=\"review-item\"]", "[class*=\"poi-review-item\"]", "[class*=\"comment-item\"]"],
      fliggy: ["[class*=\"rate-item\"]", "[class*=\"comment-item-wrap\"]", "[class*=\"review-con\"]"],
    };

    var selectors = [];

    // Platform-specific selectors first (higher priority)
    if (hotelSelectors[platform]) {
      selectors = selectors.concat(hotelSelectors[platform]);
    }

    // Generic selectors for all platforms
    selectors = selectors.concat([
      "[class*=\"review\"]",
      "[class*=\"comment\"]",
      "[class*=\"evaluate\"]",
      "[class*=\"feedback\"]",
      "[class*=\"rate-item\"]",
      "[class*=\"comment-item\"]",
      "[class*=\"review-item\"]",
      "[class*=\"\u8bc4\u4ef7\"]",
      // Platform-specific fallbacks
      ".rate-item", ".tb-rate-item", ".mod-rate-item",
      ".comment-item", ".mc-comment-item",
      ".evaluate-item", ".comment-detail",
    ]);

    for (var i = 0; i < selectors.length; i++) {
      var sel = selectors[i];
      var elements = document.querySelectorAll(sel);
      if (elements.length > 0) {
        return Array.from(elements).filter(function(el) {
          var text = (el.textContent || "").trim();
          return text.length > 15;
        });
      }
    }

    // Fallback: scan all visible text blocks for review patterns
    var allTextBlocks = document.querySelectorAll("div, section, article, li, p");
    return Array.from(allTextBlocks).filter(function(el) {
      var text = (el.textContent || "").trim();
      var hasStars = text.indexOf("\u2605") !== -1 || text.indexOf("\u2b50") !== -1 || text.indexOf("\u8bc4\u5206") !== -1;
      return hasStars && text.length > 30;
    });
  }
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

    // Hotel-specific: extract room type and check-in details
    var hotelPlatforms = ["ctrip", "qunar", "meituan", "fliggy"];
    if (hotelPlatforms.indexOf(platform) !== -1) {
      var roomEl = container.querySelector("[class*=\"room\"], [class*=\"\u623f\u578b\"]");
      var checkinEl = container.querySelector("[class*=\"checkin\"], [class*=\"\u5165\u4f4f\"], [class*=\"date\"]");
      if (roomEl) {
        var roomText = (roomEl.textContent || "").trim().slice(0, 30);
        productName = roomText || productName;
      }
      if (checkinEl) {
        var dateText = (checkinEl.textContent || "").trim().slice(0, 20);
        if (dateText) productName = productName + " " + dateText;
      }
    }

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

    const originalHTML = btn.innerHTML;
    btn.innerHTML = `<span class="kuki-spinner"></span> 生成中...`;
    btn.disabled = true;

    try {
      const response = await fetch("https://reviewai.chat/api/ai/generate-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          reviewContent: reviewData.text,
          rating: reviewData.rating,
          reviewerName: reviewData.buyerName,
          productName: reviewData.productName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          showLoginPrompt(container, "请先登录 Kuki AI");
        } else if (response.status === 402) {
          showLoginPrompt(container, "免费版次数已用完，请升级 Pro");
        } else {
          showError(container, data.error || "AI 生成失败，请重试");
        }
        return;
      }

      showReplyPanel(container, data.reply, reviewData);
    } catch (err) {
      showLoginPrompt(container, "网络异常或未登录");
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

  function showLoginPrompt(container, msg) {
    const toast = document.createElement("div");
    toast.className = "kuki-toast";
    toast.style.whiteSpace = "nowrap";
    toast.style.fontSize = "13px";
    toast.textContent = msg;
    toast.style.cursor = "pointer";
    toast.addEventListener("click", function() {
      window.open("https://reviewai.chat/login", "_blank");
    });
    container.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 6000);
  }
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
