// 口碑助手 - Popup Script v2.0
(function () {
  "use strict";

  const WEB_APP = "http://localhost:3459";

  // 检测当前标签页平台
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    if (!tab || !tab.url) return;

    const host = new URL(tab.url).hostname;
    const statusEl = document.getElementById("statusText");
    const dotEl = document.querySelector(".status-dot");

    const supported = [
      { host: "meituan.com", name: "美团" },
      { host: "dianping.com", name: "大众点评" },
      { host: "ctrip.com", name: "携程" },
      { host: "qunar.com", name: "去哪儿" },
      { host: "fliggy.com", name: "飞猪" },
      { host: "xiaohongshu.com", name: "小红书" },
      { host: "taobao.com", name: "淘宝" },
      { host: "jinritemai.com", name: "抖音小店" },
    ];

    const match = supported.find(s => host.includes(s.host));
    if (match) {
      statusEl.textContent = "已在 " + match.name + " 平台，可以使用";
      dotEl.classList.add("active");
    } else {
      statusEl.textContent = "当前页面不支持，请打开美团/点评/携程后台";
      dotEl.classList.remove("active");
    }
  });

  document.getElementById("btnOpenApp").onclick = function () {
    chrome.tabs.create({ url: WEB_APP });
  };

  document.getElementById("btnHowTo").onclick = function () {
    chrome.tabs.create({ url: WEB_APP + "/dashboard/reviews" });
  };
})();
