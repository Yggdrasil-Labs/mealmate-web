import { computed } from 'vue'
import { useAppShellStore } from '@/stores'

export function useAppBreakpoint() {
  const appShellStore = useAppShellStore()

  const isMobile = computed(() => appShellStore.device === 'mobile')
  const isTablet = computed(() => appShellStore.device === 'tablet')
  const isDesktop = computed(() => appShellStore.device === 'desktop')

  return { isMobile, isTablet, isDesktop }
}
