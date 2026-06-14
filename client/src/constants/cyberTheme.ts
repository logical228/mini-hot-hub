/** 赛博朋克模式 — 平台霓虹色 */
export const CYBER_NEON = {
  weibo: '#00FFFF',
  zhihu: '#39FF14',
  bilibili: '#FF00FF',
} as const;

export const CYBER_BG = '#050810';
export const CYBER_BG_ALT = '#0A0E27';
export const CYBER_TEXT_MUTED = '#8A8A8A';

export function getPlatformNeon(source: string): string {
  return CYBER_NEON[source as keyof typeof CYBER_NEON] ?? '#00FFFF';
}

export function getPlatformColor(source: string, isCyber: boolean): string {
  if (isCyber) {
    return getPlatformNeon(source);
  }
  const classic: Record<string, string> = {
    weibo: '#E6162D',
    zhihu: '#0084FF',
    bilibili: '#FB7299',
  };
  return classic[source] ?? '#6b7280';
}
