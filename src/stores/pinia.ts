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
 * 重置所有已注册的 Store。
 * 登出或切换用户时调用，清理跨页面状态。
 *
 * 注意：Pinia setup stores 默认无 $reset 方法，需各 store 手动暴露。
 * 未暴露 $reset 的 store 会被静默跳过。新增 store 时如需重置，须定义 $reset。
 */
export function resetStores(pinia: ReturnType<typeof createPinia>): void {
  const stores = (pinia as any)._s as Map<string, any>
  stores.forEach((store) => {
    if (typeof store.$reset === 'function') {
      store.$reset()
    }
  })
}

// 默认导出
export default createAppPinia
