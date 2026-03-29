import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed } from 'vue'
import { getKeepAliveIncludeName } from '@/app/shell/route-cache'

export const useKeepAliveStore = defineStore('keep-alive', () => {
  const keys = ref<string[]>([])
  const bustVersions = ref<Record<string, number>>({})
  const includeNames = computed(() => {
    return Array.from(new Set(keys.value.map(key => getKeepAliveIncludeName(key))))
  })

  function bumpBustVersion(key: string) {
    bustVersions.value = {
      ...bustVersions.value,
      [key]: (bustVersions.value[key] ?? 0) + 1,
    }
  }

  function register(key: string) {
    if (!keys.value.includes(key))
      keys.value = [...keys.value, key]
  }

  function findRelatedKeys(targetKey: string) {
    const includeName = getKeepAliveIncludeName(targetKey)
    return keys.value.filter(key => getKeepAliveIncludeName(key) === includeName)
  }

  function remove(key: string) {
    const relatedKeys = findRelatedKeys(key)
    if (!relatedKeys.length)
      return

    relatedKeys.forEach(bumpBustVersion)
    keys.value = keys.value.filter(item => !relatedKeys.includes(item))
  }

  function invalidate(key?: string) {
    if (key) {
      remove(key)
      return
    }

    keys.value.forEach(bumpBustVersion)
    keys.value = []
  }

  function retain(keepKeys: string[]) {
    const keepIncludeNames = new Set(keepKeys.map(key => getKeepAliveIncludeName(key)))
    const evictedKeys = keys.value.filter((key) => {
      const includeName = getKeepAliveIncludeName(key)
      const groupKeys = findRelatedKeys(key)
      const shouldKeepGroup = keepIncludeNames.has(includeName)
        && groupKeys.every(groupKey => keepKeys.includes(groupKey))

      return !shouldKeepGroup
    })

    evictedKeys.forEach(bumpBustVersion)
    keys.value = keys.value.filter(key => !evictedKeys.includes(key))
  }

  function syncRoute(key: string, cacheable: boolean) {
    if (cacheable) {
      register(key)
      return
    }

    remove(key)
  }

  function getBustVersion(key: string) {
    return bustVersions.value[key] ?? 0
  }

  return {
    keys,
    includeNames,
    register,
    remove,
    invalidate,
    retain,
    syncRoute,
    getBustVersion,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useKeepAliveStore, import.meta.hot))
