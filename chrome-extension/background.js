// 口碑助手 - Background Service Worker v2.0
const API_BASE = "https://reviewai.chat";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getApiBase") {
    sendResponse({ apiBase: API_BASE });
    return true;
  }
});

// 点击插件图标时，检查是否在支持的平台上
chrome.action.onClicked.addListener(function (tab) {
  // 不做额外操作，popup 会自动检测
});
