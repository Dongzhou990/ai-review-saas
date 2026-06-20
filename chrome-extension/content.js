// 口碑助手 - Content Script v2.0
// 在美团/大众点评/携程后台页面注入AI回复按钮
(function () {
  "use strict";

  const AI_BTN_CLASS = "kb-ai-reply-btn";
  const API_BASE = "https://reviewai.chat"; // 本地开发；部署后改为 https://reviewai.chat

  const REPLY_STYLES = [
    { value: "professional", label: "诚恳道歉" },
    { value: "friendly", label: "真诚安抚" },
    { value: "apologetic", label: "私下沟通" },
  ];

  // ============================================
  // 平台检测
  // ============================================
  function detectPlatform() {
    const host = location.hostname;
    if (host.includes("meituan.com")) return "meituan";
    if (host.includes("dianping.com")) return "dianping";
    if (host.includes("ctrip.com")) return "ctrip";
    if (host.includes("qunar.com")) return "qunar";
    if (host.includes("fliggy.com")) return "fliggy";
    if (host.includes("xiaohongshu.com")) return "xiaohongshu";
    if (host.includes("taobao.com") || host.includes("tmall.com")) return "taobao";
    if (host.includes("jinritemai.com")) return "douyin";
    return "unknown";
  }

  const PLATFORM = detectPlatform();
  console.log("[口碑助手] 检测到平台:", PLATFORM);

  // ============================================
  // 平台选择器配置
  // ============================================
  const SELECTORS = {
    meituan: {
      reviewBlock: [
        ".review-item", ".comment-item", ".poi-review-item",
        "[class*=review]", "[class*=comment-list] li",
        ".unreply-item", ".wait-reply-item"
      ],
      replyTextarea: [
        "textarea", "[contenteditable=true]",
        ".reply-input textarea", ".reply-box textarea",
        "[class*=reply] textarea", "[class*=reply] [contenteditable]"
      ],
      reviewContent: (el) => (el.textContent || "").trim(),
      reviewerName: (el) => {
        const m = (el.textContent || "").match(/([^\s]{2,6})(?:用户|会员|客人)/);
        return m ? m[1] : "顾客";
      },
      rating: (el) => {
        const stars = (el.textContent || "").match(/★/g) || [];
        return Math.min(5, Math.max(1, stars.length || 3));
      }
    },
    dianping: {
      reviewBlock: [
        ".review-item", ".comment-item", ".J_comment-item",
        "[class*=review]", "[class*=comment-list] li",
        ".unreply-item"
      ],
      replyTextarea: [
        "textarea", "[contenteditable=true]",
        ".reply-content textarea", ".J_reply-input"
      ],
      reviewContent: (el) => (el.textContent || "").trim(),
      reviewerName: (el) => {
        const m = (el.textContent || "").match(/([^\s]{2,6})(?:用户|会员)/);
        return m ? m[1] : "顾客";
      },
      rating: (el) => {
        const stars = (el.textContent || "").match(/★/g) || [];
        return Math.min(5, Math.max(1, stars.length || 3));
      }
    },
    ctrip: {
      reviewBlock: [
        ".comment_detail", ".commentItem", ".hotel_comment",
        "[class*=comment-mod]", ".review-item-wrap"
      ],
      replyTextarea: [
        "textarea", "[contenteditable=true]",
        ".reply-input textarea", ".reply-container textarea"
      ],
      reviewContent: (el) => (el.textContent || "").trim(),
      reviewerName: (el) => {
        const m = (el.textContent || "").match(/([^\s]{1,4})(?:先生|女士|小姐)/);
        return m ? m[1] + m[2] : "客人";
      },
      rating: (el) => (el.querySelectorAll(".star-full, .star-on, [class*=star]").length || 3)
    }
  };

  // 通用选择器回退
  const GENERIC = {
    reviewBlock: [
      "[class*=review]", "[class*=comment]", "[class*=evaluate]",
      "[class*=feedback]", "[class*=rate-item]",
    ],
    replyTextarea: ["textarea", "[contenteditable=true]"],
    reviewContent: (el) => (el.textContent || "").trim(),
    reviewerName: () => "顾客",
    rating: () => 3,
  };

  function getSelectors() {
    return SELECTORS[PLATFORM] || GENERIC;
  }

  // ============================================
  // 找到页面中的评论区块
  // ============================================
  function findReviewBlocks() {
    const sel = getSelectors();
    const all = sel.reviewBlock;

    for (const s of all) {
      const els = document.querySelectorAll(s);
      if (els.length > 0) {
        return Array.from(els).filter(el => (el.textContent || "").trim().length > 20);
      }
    }
    return [];
  }

  // ============================================
  // 找到回复输入框
  // ============================================
  function findReplyTextarea(nearEl) {
    const sel = getSelectors();
    const all = sel.replyTextarea;

    // 先在附近找
    if (nearEl) {
      for (const s of all) {
        const found = nearEl.querySelector(s) || nearEl.parentElement?.querySelector(s);
        if (found) return found;
      }
    }

    // 全局找
    for (const s of all) {
      const found = document.querySelector(s);
      if (found) return found;
    }
    return null;
  }

  // ============================================
  // 提取评论数据
  // ============================================
  function extractReview(el) {
    const sel = getSelectors();
    return {
      content: sel.reviewContent(el),
      reviewerName: sel.reviewerName(el),
      rating: sel.rating(el),
    };
  }

  // ============================================
  // 注入AI回复按钮
  // ============================================
  function injectAIButton(container, reviewData) {
    // 避免重复注入
    if (container.querySelector("." + AI_BTN_CLASS)) return;

    const btn = document.createElement("button");
    btn.className = AI_BTN_CLASS;
    btn.innerHTML = "🤖 AI 回复";
    btn.title = "点击用AI生成回复";
    btn.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      showStylePicker(container, reviewData);
    };

    // 插入到评论区块末尾
    container.style.position = "relative";
    container.appendChild(btn);
  }

  // ============================================
  // 显示风格选择面板
  // ============================================
  function showStylePicker(container, reviewData) {
    // 移除已有面板
    const existing = document.querySelector(".kb-style-panel");
    if (existing) existing.remove();

    const panel = document.createElement("div");
    panel.className = "kb-style-panel";
    panel.innerHTML = `
      <div class="kb-panel-header">
        <span>选择回复风格</span>
        <button class="kb-panel-close">✕</button>
      </div>
      <div class="kb-styles">
        ${REPLY_STYLES.map(s =>
          `<button class="kb-style-btn" data-tone="${s.value}">${s.label}</button>`
        ).join("")}
      </div>
      <div class="kb-panel-result" style="display:none">
        <div class="kb-result-text"></div>
        <div class="kb-result-actions">
          <button class="kb-btn-fill">填入回复框</button>
          <button class="kb-btn-retry">换一种</button>
        </div>
      </div>
    `;

    container.appendChild(panel);

    // 关闭按钮
    panel.querySelector(".kb-panel-close").onclick = () => panel.remove();

    // 风格选择 → 调用API
    panel.querySelectorAll(".kb-style-btn").forEach(b => {
      b.onclick = async function () {
        const tone = this.dataset.tone;
        panel.querySelector(".kb-styles").innerHTML = '<div class="kb-loading">⏳ AI 生成中...</div>';

        const reply = await callGenerateAPI(reviewData, tone);

        const resultDiv = panel.querySelector(".kb-panel-result");
        const textDiv = panel.querySelector(".kb-result-text");

        if (reply) {
          textDiv.textContent = reply;
          resultDiv.style.display = "block";
        } else {
          textDiv.textContent = "生成失败，请重试";
          resultDiv.style.display = "block";
        }
      };
    });

    // 填入回复框
    panel.querySelector(".kb-btn-fill").onclick = function () {
      const text = panel.querySelector(".kb-result-text").textContent;
      const textarea = findReplyTextarea(container);
      if (textarea) {
        if (textarea.tagName === "TEXTAREA" || textarea.tagName === "INPUT") {
          textarea.value = text;
          textarea.dispatchEvent(new Event("input", { bubbles: true }));
        } else {
          textarea.textContent = text;
        }
        panel.remove();
      } else {
        // 找不到输入框，复制到剪贴板
        navigator.clipboard.writeText(text).then(() => {
          alert("回复已复制到剪贴板，请粘贴到回复框中");
          panel.remove();
        });
      }
    };

    // 重新生成
    panel.querySelector(".kb-btn-retry").onclick = function () {
      panel.querySelector(".kb-panel-result").style.display = "none";
      panel.querySelector(".kb-styles").innerHTML = REPLY_STYLES.map(s =>
        `<button class="kb-style-btn" data-tone="${s.value}">${s.label}</button>`
      ).join("");
      // 重新绑定
      panel.querySelectorAll(".kb-style-btn").forEach(b2 => {
        b2.onclick = b.onclick;
      });
    };
  }

  // ============================================
  // 调用API生成回复
  // ============================================
  async function callGenerateAPI(reviewData, tone) {
    try {
      const res = await fetch(`${API_BASE}/api/ai/generate-reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewContent: reviewData.content,
          rating: reviewData.rating,
          reviewerName: reviewData.reviewerName,
          tone: tone,
        }),
      });

      const data = await res.json();
      if (data.reply) return data.reply;
      if (data.error) {
        console.error("[口碑助手] API错误:", data.error);
        return null;
      }
      return null;
    } catch (err) {
      console.error("[口碑助手] 网络错误:", err);
      return null;
    }
  }

  // ============================================
  // 主扫描逻辑
  // ============================================
  function scanAndInject() {
    const blocks = findReviewBlocks();
    console.log("[口碑助手] 找到", blocks.length, "个评论区块");

    blocks.forEach(block => {
      const reviewData = extractReview(block);
      if (reviewData.content.length > 20) {
        injectAIButton(block, reviewData);
      }
    });
  }

  // ============================================
  // 初始化
  // ============================================
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(scanAndInject, 1500));
  } else {
    setTimeout(scanAndInject, 1500);
  }

  // 监听DOM变化（SPA页面切换）
  const observer = new MutationObserver(() => {
    if (!document.querySelector("." + AI_BTN_CLASS)) {
      scanAndInject();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  console.log("[口碑助手] 插件已加载，监控平台:", PLATFORM);
})();
