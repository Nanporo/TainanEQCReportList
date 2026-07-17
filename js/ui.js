// js/ui.js

function renderList(data, containerId, lang = 'zh') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ''; 

    data.forEach(item => {
        // 直接組合出例如 "level-5-minus" 這樣的 class name
        const intensityClass = `level-${item.intensityClass}`;
        
        const maxIntensityLabels = {
            'zh': '觀測最大震度',
            'en': 'Max Intensity',
            'ja': '最大震度',
            'ko': '최대 진도'
        };
        const depthLabels = {
            'zh': '深度 ',
            'en': 'Depth ',
            'ja': '深さ ',
            'ko': '깊이 '
        };
        const maxIntensityLabel = maxIntensityLabels[lang] || maxIntensityLabels['zh'];
        const depthLabel = depthLabels[lang] || depthLabels['zh'];
        
        if (item.isFeatured) {
            container.innerHTML += `
                <div class="card featured">
                    <div class="top-row">
                        <div class="intensity-box ${intensityClass}">${item.intensityText}</div>
                        <div class="info">
                            <div class="location">${item.location}</div>
                            <div class="time">${item.time}</div>
                        </div>
                    </div>
                    <div class="bottom-row">
                        <div class="label">${maxIntensityLabel}</div>
                        <div class="mag-depth">
                            <span>M ${item.mag} </span>
                            <span>${depthLabel}${item.depth} km</span>
                        </div>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML += `
                <div class="card item">
                    <div class="intensity-box ${intensityClass}">${item.intensityText}</div>
                    <div class="info">
                        <div class="location">${item.location}</div>
                        <div class="time">${item.time}</div>
                    </div>
                    <div class="mag">M ${item.mag} </div>
                </div>
            `;
        }
    });

    // 動態調整過長文字的字體大小，確保方塊大小不變
    requestAnimationFrame(() => {
        const locations = container.querySelectorAll('.location');
        locations.forEach(el => {
            el.style.fontSize = ''; // 重置字體大小
            
            const parentWidth = el.parentElement.clientWidth;
            const textWidth = el.scrollWidth;
            
            if (textWidth > parentWidth && parentWidth > 0) {
                const currentSize = parseFloat(window.getComputedStyle(el).fontSize);
                const ratio = parentWidth / textWidth;
                // 縮小字體以符合寬度，預留一點點邊距，並且設定最小字體限制
                el.style.fontSize = `${Math.max(10, currentSize * ratio * 0.98)}px`;
            }
        });
    });
}