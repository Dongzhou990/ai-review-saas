// Kuki AI - Popup Script

const loggedOutEl = document.getElementById("logged-out");
const loggedInEl = document.getElementById("logged-in");

// Check auth state on open
document.addEventListener("DOMContentLoaded", async () => {
  const stored = await chrome.storage.local.get(["session"]);
  if (stored.session) {
    showLoggedIn(stored.session);
  }
});

// Login
document.getElementById("btn-login").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("请输入邮箱和密码");
    return;
  }

  const btn = document.getElementById("btn-login");
  btn.textContent = "登录中...";
  btn.disabled = true;

  try {
    const response = await chrome.runtime.sendMessage({
      action: "login",
      email,
      password,
    });
    if (response.error) throw new Error(response.error);
    showLoggedIn(response);
  } catch (err) {
    alert(err.message || "登录失败");
  } finally {
    btn.textContent = "登录";
    btn.disabled = false;
  }
});

// Logout
document.getElementById("btn-logout").addEventListener("click", async () => {
  await chrome.storage.local.remove(["session"]);
  loggedInEl.style.display = "none";
  loggedOutEl.style.display = "block";
});

// Open dashboard
document.getElementById("btn-open-app").addEventListener("click", () => {
  chrome.tabs.create({ url: "https://reviewai.chat/dashboard" });
});

function showLoggedIn(data) {
  loggedOutEl.style.display = "none";
  loggedInEl.style.display = "block";

  const user = data.user || data;
  document.getElementById("user-email").textContent = user.email || "-";
}

// Enter key to login
document.getElementById("password").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("btn-login").click();
});
