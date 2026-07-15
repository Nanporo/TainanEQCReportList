// js/api.js


// 翻譯轉換表，如果沒有匹配到字詞才使用英文 API
const countyMaps = {
    "基隆市": { en: "Keelung", ja: "基隆市", ko: "지룽시" },
    "台北市": { en: "Taipei", ja: "台北市", ko: "타이베이시" },
    "臺北市": { en: "Taipei", ja: "台北市", ko: "타이베이시" },
    "新北市": { en: "New Taipei", ja: "新北市", ko: "신베이시" },
    "桃園市": { en: "Taoyuan", ja: "桃園市", ko: "타오위안시" },
    "新竹縣": { en: "Hsinchu", ja: "新竹県", ko: "신주현" },
    "新竹市": { en: "Hsinchu", ja: "新竹市", ko: "신주시" },
    "苗栗縣": { en: "Miaoli", ja: "苗栗県", ko: "먀오리현" },
    "台中市": { en: "Taichung", ja: "台中市", ko: "타이중시" },
    "臺中市": { en: "Taichung", ja: "台中市", ko: "타이중시" },
    "彰化縣": { en: "Changhua", ja: "彰化県", ko: "장화현" },
    "南投縣": { en: "Nantou", ja: "南投県", ko: "난터우현" },
    "雲林縣": { en: "Yunlin", ja: "雲林県", ko: "윈린현" },
    "嘉義縣": { en: "Chiayi", ja: "嘉義県", ko: "자이현" },
    "嘉義市": { en: "Chiayi", ja: "嘉義市", ko: "자이시" },
    "台南市": { en: "Tainan", ja: "台南市", ko: "타이난시" },
    "臺南市": { en: "Tainan", ja: "台南市", ko: "타이난시" },
    "高雄市": { en: "Kaohsiung", ja: "高雄市", ko: "가오슝시" },
    "屏東縣": { en: "Pingtung", ja: "屏東県", ko: "핑둥현" },
    "宜蘭縣": { en: "Yilan", ja: "宜蘭県", ko: "이란현" },
    "花蓮縣": { en: "Hualien", ja: "花蓮県", ko: "화롄현" },
    "台東縣": { en: "Taitung", ja: "台東県", ko: "타이둥현" },
    "臺東縣": { en: "Taitung", ja: "台東県", ko: "타이둥현" },
    "澎湖縣": { en: "Penghu", ja: "澎湖県", ko: "펑후현" },
    "金門縣": { en: "Kinmen", ja: "金門県", ko: "진먼현" },
    "連江縣": { en: "Lienchiang", ja: "連江県", ko: "롄장현" },
};

const seaMaps = {
    "臺灣東部海域": { en: "Eastern Taiwan Waters", ja: "台湾東部沖", ko: "대만 동부 해역" },
    "台灣東部海域": { en: "Eastern Taiwan Waters", ja: "台湾東部沖", ko: "대만 동부 해역" },
    "臺灣西部海域": { en: "Western Taiwan Waters", ja: "台湾西部沖", ko: "대만 서부 해역" },
    "台灣西部海域": { en: "Western Taiwan Waters", ja: "台湾西部沖", ko: "대만 서부 해역" },
    "臺灣南部海域": { en: "Southern Taiwan Waters", ja: "台湾南部沖", ko: "대만 남부 해역" },
    "台灣南部海域": { en: "Southern Taiwan Waters", ja: "台湾南部沖", ko: "대만 남부 해역" },
    "臺灣北部海域": { en: "Northern Taiwan Waters", ja: "台湾北部沖", ko: "대만 북부 해역" },
    "台灣北部海域": { en: "Northern Taiwan Waters", ja: "台湾北部沖", ko: "대만 북부 해역" },
    "臺灣東北部海域": { en: "Northeastern Taiwan Waters", ja: "台湾北東沖", ko: "대만 북동부 해역" },
    "台灣東北部海域": { en: "Northeastern Taiwan Waters", ja: "台湾北東沖", ko: "대만 북동부 해역" },
    "臺灣東南部海域": { en: "Southeastern Taiwan Waters", ja: "台湾南東沖", ko: "대만 남동부 해역" },
    "台灣東南部海域": { en: "Southeastern Taiwan Waters", ja: "台湾南東沖", ko: "대만 남동부 해역" },
    "臺灣西北部海域": { en: "Northwestern Taiwan Waters", ja: "台湾北西沖", ko: "대만 북서부 해역" },
    "台灣西北部海域": { en: "Northwestern Taiwan Waters", ja: "台湾北西沖", ko: "대만 북서부 해역" },
    "臺灣西南部海域": { en: "Southwestern Taiwan Waters", ja: "台湾南西沖", ko: "대만 남서부 해역" },
    "台灣西南部海域": { en: "Southwestern Taiwan Waters", ja: "台湾南西沖", ko: "대만 남서부 해역" },
    "台灣海峽": { en: "Taiwan Strait", ja: "台湾海峡", ko: "대만해협" },
    "臺灣海峽": { en: "Taiwan Strait", ja: "台湾海峡", ko: "대만해협" },
    "巴士海峽": { en: "Bashi Channel", ja: "バシー海峡", ko: "바시해협" },
};

const offshoreTerms = {
    "en": " Offshore",
    "ja": "沖",
    "ko": " 근해"
};
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
    if (lang !== 'zh') {
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

        if (lang !== 'zh') {
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
                if (lang !== 'zh') {
                    const match = eq.ReportContent.match(/Highest intensity was ([1-7][-+]?)/);
                    if (match && intensityWeightMap[match[1]]) {
                        finalIntensity = intensityWeightMap[match[1]];
                    }
                } else {
                    const match = eq.ReportContent.match(/最大震度.*(\d[級弱強])/);
                    if (match) {
                        const val = match[1];
                        if (intensityWeightMap[val]) {
                            finalIntensity = intensityWeightMap[val];
                        } else if (intensityWeightMap[`${val}級`]) {
                            finalIntensity = intensityWeightMap[`${val}級`];
                        }
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
                let translated = false;
                const zhEq = zhDataMap[eq.EarthquakeInfo.OriginTime];
                if (zhEq && zhEq.EarthquakeInfo && zhEq.EarthquakeInfo.Epicenter) {
                    let zhLoc = zhEq.EarthquakeInfo.Epicenter.Location;
                    let hasPlaceName = false;
                    const locMatch = zhLoc.match(/位於(.*?)\)/);
                    if (locMatch) {
                        zhLoc = locMatch[1];
                        hasPlaceName = true;
                    } else {
                        const bracketMatch = zhLoc.match(/\((.*?)\)/);
                        if (bracketMatch) {
                            zhLoc = bracketMatch[1];
                            hasPlaceName = true;
                        }
                    }

                    if (hasPlaceName) {
                        const offshoreTerm = offshoreTerms[lang] ?? offshoreTerms['en'];

                        if (seaMaps[zhLoc]) {
                            locationStr = seaMaps[zhLoc][lang] ?? seaMaps[zhLoc]['en'];
                            translated = true;
                        } else {
                            for (const [zhCounty, translations] of Object.entries(countyMaps)) {
                                if (zhLoc.startsWith(zhCounty)) {
                                    const localCounty = translations[lang] ?? translations['en'];
                                    locationStr = zhLoc.includes("近海")
                                        ? localCounty + offshoreTerm
                                        : localCounty;
                                    translated = true;
                                    break;
                                }
                            }
                        }
                    }
                }

                // 若沒有對應的翻譯（例如沒有括號地名），保留英文原句，不再擷取
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