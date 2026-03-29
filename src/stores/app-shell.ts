import { acceptHMRUpdate, defineStore } from 'pinia'

export type AppDeviceType = 'mobile' | 'tablet' | 'desktop'

export const useAppShellStore = defineStore('app-shell', () => {
  const device = shallowRef<AppDeviceType>('desktop')
  const siderCollapsed = shallowRef(false)
  const drawerVisible = shallowRef(false)

  function setDevice(nextDevice: AppDeviceType) {
    device.value = nextDevice
  }

  function setViewportWidth(width: number) {
    if (width < 768) {
      device.value = 'mobile'
      siderCollapsed.value = false
      drawerVisible.value = false
      return
    }

    if (width < 1200) {
      device.value = 'tablet'
      siderCollapsed.value = true
      drawerVisible.value = false
      return
    }

    device.value = 'desktop'
    siderCollapsed.value = false
    drawerVisible.value = false
  }

  function setSiderCollapsed(collapsed: boolean) {
    siderCollapsed.value = collapsed
  }

  function toggleSiderCollapsed() {
    siderCollapsed.value = !siderCollapsed.value
  }

  function setDrawerVisible(visible: boolean) {
    drawerVisible.value = visible
  }

  function openDrawer() {
    drawerVisible.value = true
  }

  function closeDrawer() {
    drawerVisible.value = false
  }

  function toggleDrawer() {
    drawerVisible.value = !drawerVisible.value
  }

  function $reset() {
    device.value = 'desktop'
    siderCollapsed.value = false
    drawerVisible.value = false
  }

  return {
    device,
    siderCollapsed,
    drawerVisible,
    setDevice,
    setViewportWidth,
    setSiderCollapsed,
    toggleSiderCollapsed,
    setDrawerVisible,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    $reset,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppShellStore, import.meta.hot))
