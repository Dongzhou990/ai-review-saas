// Kuki AI - Background Service Worker (minimal)
// Auth now handled via web login; API calls go directly from content script

const API_BASE = "https://reviewai.chat";

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getAuth") {
    chrome.storage.local.get(["session"], function(result) {
      sendResponse({ session: result.session || null });
    });
    return true;
  }
});
