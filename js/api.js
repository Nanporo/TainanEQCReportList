// js/api.js

// 定義震度對照表，用來比較大小與轉換顯示文字
const intensityWeightMap = {
    "1級": { text: "1", weight: 1, classSuffix: "1" },
    "1": { text: "1", weight: 1, classSuffix: "1" },
    "2級": { text: "2", weight: 2, classSuffix: "2" },
    "2": { text: "2", weight: 2, classSuffix: "2" },
    "3級": { text: "3", weight: 3, classSuffix: "3" },
    "3": { text: "3", weight: 3, classSuffix: "3" },
    "4級": { text: "4", weight: 4, classSuffix: "4" },
    "4": { text: "4", weight: 4, classSuffix: "4" },
    "5弱": { text: "5-", weight: 5, classSuffix: "5-minus" },
    "5-": { text: "5-", weight: 5, classSuffix: "5-minus" },
    "5強": { text: "5+", weight: 6, classSuffix: "5-plus" },
    "5+": { text: "5+", weight: 6, classSuffix: "5-plus" },
    "6弱": { text: "6-", weight: 7, classSuffix: "6-minus" },
    "6-": { text: "6-", weight: 7, classSuffix: "6-minus" },
    "6強": { text: "6+", weight: 8, classSuffix: "6-plus" },
    "6+": { text: "6+", weight: 8, classSuffix: "6-plus" },
    "7級": { text: "7", weight: 9, classSuffix: "7" },
    "7": { text: "7", weight: 9, classSuffix: "7" }
};

export async function fetchEarthquakeData(apiKey, lang = 'zh') {
    if (!apiKey) throw new Error("尚未設定 API 授權碼");

    let urls = [];
    if (lang === 'en') {
        urls = [
            `https://opendata.cwa.gov.tw/api/v1/rest/datastore/E-A0015-002?Authorization=${apiKey}&limit=10&format=JSON`,
            `https://opendata.cwa.gov.tw/api/v1/rest/datastore/E-A0016-002?Authorization=${apiKey}&limit=10&format=JSON`,
            `https://opendata.cwa.gov.tw/api/v1/rest/datastore/E-A0015-001?Authorization=${apiKey}&limit=10&format=JSON`, // Fetch ZH for fallback checking
            `https://opendata.cwa.gov.tw/api/v1/rest/datastore/E-A0016-001?Authorization=${apiKey}&limit=10&format=JSON`
        ];
    } else {
        urls = [
            `https://opendata.cwa.gov.tw/api/v1/rest/datastore/E-A0015-001?Authorization=${apiKey}&limit=10&format=JSON`,
            `https://opendata.cwa.gov.tw/api/v1/rest/datastore/E-A0016-001?Authorization=${apiKey}&limit=10&format=JSON`
        ];
    }

    try {
        const responses = await Promise.all(urls.map(url => fetch(url)));
        const jsonResults = await Promise.all(responses.map(res => {
            if (!res.ok) throw new Error("API 請求失敗，請檢查授權碼");
            return res.json();
        }));

        let combinedData = [];
        let zhDataMap = {}; // To store Chinese data for cross-referencing in EN mode

        if (lang === 'en') {
            // First two are EN, next two are ZH
            const enResults = jsonResults.slice(0, 2);
            const zhResults = jsonResults.slice(2, 4);

            enResults.forEach(data => {
                if (data.records && data.records.Earthquake) {
                    combinedData = combinedData.concat(data.records.Earthquake);
                }
            });

            zhResults.forEach(data => {
                if (data.records && data.records.Earthquake) {
                    data.records.Earthquake.forEach(eq => {
                        const originTime = eq.EarthquakeInfo.OriginTime;
                        zhDataMap[originTime] = eq;
                    });
                }
            });
        } else {
            jsonResults.forEach(data => {
                if (data.records && data.records.Earthquake) {
                    combinedData = combinedData.concat(data.records.Earthquake);
                }
            });
        }

        // 按時間降冪排序
        combinedData.sort((a, b) => {
            return new Date(b.EarthquakeInfo.OriginTime).getTime() - new Date(a.EarthquakeInfo.OriginTime).getTime();
        });

        const top10Data = combinedData.slice(0, 10);

        return top10Data.map((eq, index) => {
            const info = eq.EarthquakeInfo;
            
            // 1. 處理最大震度與權重
            let maxWeight = 0;
            let finalIntensity = { text: "0", classSuffix: "default" };

            // 掃描所有觀測區域，找出最大震度
            if (eq.Intensity && eq.Intensity.ShakingArea) {
                eq.Intensity.ShakingArea.forEach(area => {
                    const rawIntensity = area.AreaIntensity; // 例如 "5弱"
                    const mapped = intensityWeightMap[rawIntensity];
                    if (mapped && mapped.weight > maxWeight) {
                        maxWeight = mapped.weight;
                        finalIntensity = mapped;
                    }
                });
            }
            
            // 如果 API 結構異常，備用從內文抓取 ( fallback )
            if (maxWeight === 0 && eq.ReportContent) {
                if (lang === 'en') {
                    const match = eq.ReportContent.match(/Highest intensity was (\d+)/);
                    if (match && intensityWeightMap[match[1]]) {
                        finalIntensity = intensityWeightMap[match[1]];
                    }
                } else {
                    const match = eq.ReportContent.match(/最大震度.*?(\d+)級/);
                    if (match && intensityWeightMap[`${match[1]}級`]) {
                        finalIntensity = intensityWeightMap[`${match[1]}級`];
                    }
                }
            }

            // 2. 處理地點
            let locationStr = info.Epicenter.Location;
            if (lang === 'zh') {
                const locMatch = locationStr.match(/位於(.*?)\)/);
                if (locMatch) locationStr = locMatch[1];
                else {
                    const bracketMatch = locationStr.match(/\((.*?)\)/);
                    if (bracketMatch) locationStr = bracketMatch[1];
                }
            } else {
                const enMatch = locationStr.match(/of\s+(.*?)\s+(County|City)/i);
                if (enMatch) {
                    locationStr = enMatch[1];
                }
                
                // 檢查對應的中文資料是否包含「海」
                const zhEq = zhDataMap[eq.EarthquakeInfo.OriginTime];
                if (zhEq && zhEq.EarthquakeInfo && zhEq.EarthquakeInfo.Epicenter) {
                    if (zhEq.EarthquakeInfo.Epicenter.Location.includes("海")) {
                        locationStr += " Offshore"; // 或依據需求改成其他字眼
                    }
                }
            }

            // 3. 處理時間與規模
            const timeStr = info.OriginTime.substring(0, 16).replace('T', ' ');
            const formattedMag = Number(info.EarthquakeMagnitude.MagnitudeValue).toFixed(1);

            return {
                isFeatured: index === 0, 
                intensityText: finalIntensity.text,       // 顯示用的字 (例如 "5-")
                intensityClass: finalIntensity.classSuffix, // CSS Class (例如 "5-minus")
                location: locationStr,
                time: timeStr,
                mag: formattedMag,
                depth: info.FocalDepth
            };
        });

    } catch (error) {
        console.error("獲取地震資料發生錯誤:", error);
        throw error;
    }
}