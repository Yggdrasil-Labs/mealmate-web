import { computed } from 'vue'
import { useAppShellStore } from '@/stores'

/** 移动端断点阈值（px） */
export const APP_MOBILE_BREAKPOINT = 768

export function useAppBreakpoint() {
  const appShellStore = useAppShellStore()

  const isMobile = computed(() => appShellStore.device === 'mobile')
  const isTablet = computed(() => appShellStore.device === 'tablet')
  const isDesktop = computed(() => appShellStore.device === 'desktop')

  return { isMobile, isTablet, isDesktop }
}
