import { useWindowSize } from '@vueuse/core'
import { computed } from 'vue'

export const APP_MOBILE_BREAKPOINT = 768

export function useAppBreakpoint() {
  const { width } = useWindowSize()

  const isMobile = computed(() => width.value <= APP_MOBILE_BREAKPOINT)

  return {
    width,
    isMobile,
  }
}
