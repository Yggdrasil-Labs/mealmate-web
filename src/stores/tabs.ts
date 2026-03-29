import { acceptHMRUpdate, defineStore } from 'pinia'

export interface TabRecord {
  key: string
  routeName: string
  path: string
  fullPath: string
  title: string
  closable: boolean
  pinned?: boolean
  activeTime?: number
}

export interface TabOpenInput {
  key: string
  routeName: string
  path: string
  fullPath: string
  title: string
  closable?: boolean
  pinned?: boolean
}

function sortTabs(items: TabRecord[]) {
  return [...items].sort((a, b) => {
    if (a.pinned === b.pinned)
      return (a.activeTime ?? 0) - (b.activeTime ?? 0)
    return a.pinned ? -1 : 1
  })
}

export const useTabsStore = defineStore('tabs', () => {
  const items = ref<TabRecord[]>([])
  const activeKey = ref<string | null>(null)
  const refreshVersions = ref<Record<string, number>>({})

  function open(tab: TabOpenInput) {
    const existingTab = items.value.find(item => item.key === tab.key)
    const nextTab: TabRecord = {
      ...tab,
      closable: tab.pinned ? false : tab.closable ?? true,
      pinned: tab.pinned ?? false,
      activeTime: existingTab?.activeTime ?? Date.now(),
    }

    const existingIndex = items.value.findIndex(item => item.key === tab.key)
    if (existingIndex >= 0) {
      items.value.splice(existingIndex, 1, nextTab)
    }
    else {
      items.value.push(nextTab)
    }

    items.value = sortTabs(items.value)
    activeKey.value = tab.key
  }

  function syncRoute(tab: TabOpenInput) {
    open(tab)
  }

  function close(key: string) {
    const index = items.value.findIndex(item => item.key === key)
    if (index < 0)
      return

    const target = items.value[index]
    if (!target.closable || target.pinned)
      return

    items.value = items.value.filter(item => item.key !== key)
    if (activeKey.value === key)
      activeKey.value = items.value[0]?.key ?? null
  }

  function refresh(key: string) {
    const target = items.value.find(item => item.key === key)
    if (!target)
      return

    target.activeTime = Date.now()
    refreshVersions.value = {
      ...refreshVersions.value,
      [key]: (refreshVersions.value[key] ?? 0) + 1,
    }
    items.value = sortTabs(items.value)
    activeKey.value = key
  }

  function getRefreshVersion(key: string) {
    return refreshVersions.value[key] ?? 0
  }

  function closeOthers(key: string) {
    items.value = items.value.filter(item => item.pinned || item.key === key)
    activeKey.value = key
  }

  function clear() {
    items.value = []
    activeKey.value = null
    refreshVersions.value = {}
  }

  return {
    items,
    activeKey,
    open,
    syncRoute,
    close,
    refresh,
    getRefreshVersion,
    closeOthers,
    clear,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useTabsStore, import.meta.hot))
