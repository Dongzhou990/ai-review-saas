// Kuki AI - Popup Script v2.0 (Web Login)

// Login via web
document.getElementById("btn-login-web").addEventListener("click", () => {
  chrome.tabs.create({ url: "https://reviewai.chat/login" });
});

// Open dashboard
document.getElementById("btn-open-app").addEventListener("click", () => {
  chrome.tabs.create({ url: "https://reviewai.chat/dashboard" });
});

// Reload extension
document.getElementById("btn-reload").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab) {
    chrome.tabs.reload(tab.id);
    window.close();
  }
});

// Check login status via web API
(async function() {
  try {
    var res = await fetch("https://reviewai.chat/api/auth/me", {
      credentials: "include",
    });
    if (res.ok) {
      var data = await res.json();
      if (data.authenticated) {
        var btn = document.getElementById("btn-login-web");
        btn.textContent = "\u2705 \u5df2\u767b\u5f55";
        btn.style.opacity = "0.7";
        document.getElementById("btn-open-app").style.display = "block";
      }
    }
  } catch (e) {
    // Not logged in, keep default state
  }
})();
