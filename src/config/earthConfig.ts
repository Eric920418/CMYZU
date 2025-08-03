// 地球組件配置
export const EARTH_CONFIG = {
  // 使用的地球類型：'simple' | 'threejs' | 'none'
  // 'simple': 純 CSS/SVG 實現，最穩定
  // 'threejs': Three.js GLB 模型，需要確保 SSR 正確設定
  // 'none': 不顯示地球
  type: 'simple' as 'simple' | 'threejs' | 'none',

  // 是否啟用地球效果
  enabled: true,

  // 在小螢幕上是否隱藏（避免性能問題）
  hideOnMobile: true,

  // 觸發顯示的滾動位置（NewsSection 底部的偏移）
  triggerOffset: 0.5, // 50vh
} as const;

export default EARTH_CONFIG;
