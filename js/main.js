// js/main.js

import { fetchEarthquakeData } from './api.js';
import { renderList } from './ui.js';

const apiKeyInput = document.getElementById('api-key-input');
const saveBtn = document.getElementById('save-btn');
const saveStatus = document.getElementById('save-status');

let updateInterval = null;

// 初始化與執行
async function refreshData() {
    const apiKey = localStorage.getItem('cwa_api_key');
    if (!apiKey) {
        console.warn("未找到 API Key，暫停自動更新");
        return;
    }

    try {
        const data = await fetchEarthquakeData(apiKey);
        // 渲染到畫面 (我們在 HTML 宣告的容器 ID 是 earthquake-list)
        renderList(data, 'earthquake-list');
        console.log("資料已更新:", new Date().toLocaleTimeString());
    } catch (error) {
        // 如果 API 報錯，可以在畫面提示或處理
        console.error("更新地震資料失敗:", error);
    }
}

// 儲存按鈕事件
saveBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key) {
        localStorage.setItem('cwa_api_key', key);
        saveStatus.style.color = '#00FF00';
        saveStatus.textContent = '儲存成功！正在獲取資料...';
        refreshData(); // 立即跑一次
    } else {
        localStorage.removeItem('cwa_api_key');
        saveStatus.style.color = '#FF5555';
        saveStatus.textContent = '已清除！';
    }
});

// 啟動應用
function initApp() {
    // 填入已儲存的 key
    const savedKey = localStorage.getItem('cwa_api_key');
    if (savedKey) {
        apiKeyInput.value = savedKey;
        refreshData();
    }

    // 設定定時更新 (每 60 秒檢查一次)
    if (updateInterval) clearInterval(updateInterval);
    updateInterval = setInterval(refreshData, 60000);
}

initApp();