/**
 * Pinia 配置和初始化
 * 创建和配置 Pinia 实例
 */

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

/**
 * 创建 Pinia 实例
 */
export function createAppPinia() {
  const pinia = createPinia()

  // 注册官方持久化插件
  pinia.use(piniaPluginPersistedstate)

  return pinia
}

/**
 * 重置所有 Store
 * 预留扩展点：模板默认无业务 Store。
 */
export async function resetStores(): Promise<void> {
  return Promise.resolve()
}

// 默认导出
export default createAppPinia
