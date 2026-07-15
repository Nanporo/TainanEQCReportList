// js/api.js


// 翻譯轉換表，如果沒有匹配到字詞才使用英文 API
const countyMaps = {
    "en": { "基隆市": "Keelung", "台北市": "Taipei", "臺北市": "Taipei", "新北市": "New Taipei", "桃園市": "Taoyuan", "新竹縣": "Hsinchu", "新竹市": "Hsinchu", "苗栗縣": "Miaoli", "台中市": "Taichung", "臺中市": "Taichung", "彰化縣": "Changhua", "南投縣": "Nantou", "雲林縣": "Yunlin", "嘉義縣": "Chiayi", "嘉義市": "Chiayi", "台南市": "Tainan", "臺南市": "Tainan", "高雄市": "Kaohsiung", "屏東縣": "Pingtung", "宜蘭縣": "Yilan", "花蓮縣": "Hualien", "台東縣": "Taitung", "臺東縣": "Taitung", "澎湖縣": "Penghu", "金門縣": "Kinmen", "連江縣": "Lienchiang" },
    "ja": { "基隆市": "基隆市", "台北市": "台北市", "臺北市": "台北市", "新北市": "新北市", "桃園市": "桃園市", "新竹縣": "新竹県", "新竹市": "新竹市", "苗栗縣": "苗栗県", "台中市": "台中市", "臺中市": "台中市", "彰化縣": "彰化県", "南投縣": "南投県", "雲林縣": "雲林県", "嘉義縣": "嘉義県", "嘉義市": "嘉義市", "台南市": "台南市", "臺南市": "台南市", "高雄市": "高雄市", "屏東縣": "屏東県", "宜蘭縣": "宜蘭県", "花蓮縣": "花蓮県", "台東縣": "台東県", "臺東縣": "台東県", "澎湖縣": "澎湖県", "金門縣": "金門県", "連江縣": "連江県" },
    "ko": { "基隆市": "지룽시", "台北市": "타이베이시", "臺北市": "타이베이시", "新北市": "신베이시", "桃園市": "타오위안시", "新竹縣": "신주현", "新竹市": "신주시", "苗栗縣": "먀오리현", "台中市": "타이중시", "臺中市": "타이중시", "彰化縣": "장화현", "南投縣": "난터우현", "雲林縣": "윈린현", "嘉義縣": "자이현", "嘉義市": "자이시", "台南市": "타이난시", "臺南市": "타이난시", "高雄市": "가오슝시", "屏東縣": "핑둥현", "宜蘭縣": "이란현", "花蓮縣": "화롄현", "台東縣": "타이둥현", "臺東縣": "타이둥현", "澎湖縣": "펑후현", "金門縣": "진먼현", "連江縣": "롄장현" }
};

const seaMaps = {
    "en": { "臺灣東部海域": "Eastern Taiwan Waters", "台灣東部海域": "Eastern Taiwan Waters", "臺灣西部海域": "Western Taiwan Waters", "台灣西部海域": "Western Taiwan Waters", "臺灣南部海域": "Southern Taiwan Waters", "台灣南部海域": "Southern Taiwan Waters", "臺灣北部海域": "Northern Taiwan Waters", "台灣北部海域": "Northern Taiwan Waters", "臺灣東北部海域": "Northeastern Taiwan Waters", "台灣東北部海域": "Northeastern Taiwan Waters", "臺灣東南部海域": "Southeastern Taiwan Waters", "台灣東南部海域": "Southeastern Taiwan Waters", "臺灣西北部海域": "Northwestern Taiwan Waters", "台灣西北部海域": "Northwestern Taiwan Waters", "臺灣西南部海域": "Southwestern Taiwan Waters", "台灣西南部海域": "Southwestern Taiwan Waters", "台灣海峽": "Taiwan Strait", "臺灣海峽": "Taiwan Strait", "巴士海峽": "Bashi Channel" },
    "ja": { "臺灣東部海域": "台湾東部沖", "台灣東部海域": "台湾東部沖", "臺灣西部海域": "台湾西部沖", "台灣西部海域": "台湾西部沖", "臺灣南部海域": "台湾南部沖", "台灣南部海域": "台湾南部沖", "臺灣北部海域": "台湾北部沖", "台灣北部海域": "台湾北部沖", "臺灣東北部海域": "台湾北東沖", "台灣東北部海域": "台湾北東沖", "臺灣東南部海域": "台湾南東沖", "台灣東南部海域": "台湾南東沖", "臺灣西北部海域": "台湾北西沖", "台灣西北部海域": "台湾北西沖", "臺灣西南部海域": "台湾南西沖", "台灣西南部海域": "台湾南西沖", "台灣海峽": "台湾海峡", "臺灣海峽": "台湾海峡", "巴士海峽": "バシー海峡" },
    "ko": { "臺灣東部海域": "대만 동부 해역", "台灣東部海域": "대만 동부 해역", "臺灣西部海域": "대만 서부 해역", "台灣西部海域": "대만 서부 해역", "臺灣南部海域": "대만 남부 해역", "台灣南部 해역": "대만 남부 해역", "臺灣北部海域": "대만 북부 해역", "台灣北部海域": "대만 북부 해역", "臺灣東北部海域": "대만 북동부 해역", "台灣東北部海域": "대만 북동부 해역", "臺灣東南部海域": "대만 남동부 해역", "台灣東南部海域": "대만 남동부 해역", "臺灣西北部海域": "대만 북서부 해역", "台灣西北部海域": "대만 북서부 해역", "臺灣西南部海域": "대만 남서부 해역", "台灣西南部海域": "대만 남서부 해역", "台灣海峽": "대만해협", "臺灣海峽": "대만해협", "巴士海峽": "바시해협" }
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
                        const currentSeaMap = seaMaps[lang] || seaMaps['en'];
                        const currentCountyMap = countyMaps[lang] || countyMaps['en'];
                        const offshoreTerm = offshoreTerms[lang] || offshoreTerms['en'];

                        if (currentSeaMap[zhLoc]) {
                            locationStr = currentSeaMap[zhLoc];
                            translated = true;
                        } else {
                            for (const [zhCounty, localCounty] of Object.entries(currentCountyMap)) {
                                if (zhLoc.startsWith(zhCounty)) {
                                    if (zhLoc.includes("近海")) {
                                        locationStr = localCounty + offshoreTerm;
                                    } else {
                                        locationStr = localCounty;
                                    }
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