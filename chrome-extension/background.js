// Kuki AI - Background Service Worker
// Handles API communication and token management

const API_BASE = "https://reviewai.chat";
const SUPABASE_URL = "https://rrymgmjwluifybwrgbce.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_mVDF4gwlgG18T383seuSyQ_vLXtNezR";

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "generateReply") {
    generateReply(request.data)
      .then(sendResponse)
      .catch((err) => sendResponse({ error: err.message }));
    return true; // Keep channel open for async response
  }

  if (request.action === "login") {
    login(request.email, request.password)
      .then(sendResponse)
      .catch((err) => sendResponse({ error: err.message }));
    return true;
  }

  if (request.action === "getAuth") {
    chrome.storage.local.get(["session"], (result) => {
      sendResponse({ session: result.session || null });
    });
    return true;
  }
});

async function generateReply(data) {
  const { reviewContent, rating, reviewerName, productName } = data;

  // Try local auth first
  const { session } = await chrome.storage.local.get(["session"]);

  const headers = { "Content-Type": "application/json" };
  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  const res = await fetch(`${API_BASE}/api/ai/generate-reply`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      reviewContent,
      rating,
      reviewerName,
      productName: productName || "商品",
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "生成失败");
  }

  return await res.json();
}

async function login(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.msg || err.error_description || "登录失败");
  }

  const session = await res.json();
  await chrome.storage.local.set({ session });
  return { success: true, user: session.user };
}
