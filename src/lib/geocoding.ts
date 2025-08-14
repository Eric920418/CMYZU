// 地理編碼服務 - 幫助用戶自動獲取學校座標
export interface GeocodingResult {
  latitude: number;
  longitude: number;
  displayName: string;
  country: string;
  countryCode: string;
}

/**
 * 使用免費的 Nominatim API (OpenStreetMap) 進行地理編碼查詢
 * @param query 查詢字串 (學校名稱 + 城市/國家)
 * @returns 座標資訊
 */
export async function geocodeLocation(
  query: string
): Promise<GeocodingResult[]> {
  if (!query.trim()) {
    throw new Error('請輸入查詢內容');
  }

  try {
    // 使用 Nominatim API (免費，無需 API Key)
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&limit=5&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'CMYZU-WorldMap-Manager/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`地理編碼查詢失敗: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error(
        '找不到相關位置，請嘗試更具體的搜尋詞彙（如：\"學校名稱 城市 國家\"）'
      );
    }

    return data.map((item: any) => ({
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      displayName: item.display_name,
      country: item.address?.country || '',
      countryCode: item.address?.country_code?.toUpperCase() || '',
    }));
  } catch (error) {
    console.error('地理編碼查詢錯誤:', error);
    throw error;
  }
}

/**
 * 根據國家代碼獲取對應的旗幟 emoji
 * @param countryCode 國家代碼 (如: US, JP, GB)
 * @returns 旗幟 emoji
 */
export function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) {
    return '🏳️';
  }

  // 將國家代碼轉換為旗幟 emoji
  // 每個字母對應的 Unicode 偏移量是 0x1F1E6 - 0x1F1FF (A-Z)
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 0x1f1e6 + char.charCodeAt(0) - 65);

  return String.fromCodePoint(...codePoints);
}

/**
 * 一些常見的國家代碼到旗幟的映射
 */
export const commonCountryFlags: Record<string, string> = {
  US: '🇺🇸', // 美國
  JP: '🇯🇵', // 日本
  GB: '🇬🇧', // 英國
  AU: '🇦🇺', // 澳洲
  CA: '🇨🇦', // 加拿大
  DE: '🇩🇪', // 德國
  FR: '🇫🇷', // 法國
  KR: '🇰🇷', // 韓國
  CN: '🇨🇳', // 中國
  TW: '🇹🇼', // 台灣
  SG: '🇸🇬', // 新加坡
  MY: '🇲🇾', // 馬來西亞
  TH: '🇹🇭', // 泰國
  VN: '🇻🇳', // 越南
  IN: '🇮🇳', // 印度
  NL: '🇳🇱', // 荷蘭
  CH: '🇨🇭', // 瑞士
  IT: '🇮🇹', // 義大利
  ES: '🇪🇸', // 西班牙
  PT: '🇵🇹', // 葡萄牙
};
