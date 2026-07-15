// js/ui.js

export function renderList(data, containerId, lang = 'zh') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ''; 

    data.forEach(item => {
        // 直接組合出例如 "level-5-minus" 這樣的 class name
        const intensityClass = `level-${item.intensityClass}`;
        
        const maxIntensityLabel = lang === 'en' ? 'Max Intensity' : '觀測最大震度';
        
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
                            <span>${item.depth} km</span>
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
}