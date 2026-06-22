/** 从缓存 key 中提取 KeepAlive include name（冒号前部分）。 */
export function getKeepAliveIncludeName(cacheKey: string) {
  return cacheKey.split(':', 1)[0] ?? cacheKey
}
