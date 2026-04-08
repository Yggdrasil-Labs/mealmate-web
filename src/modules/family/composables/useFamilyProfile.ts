import { computed, shallowRef } from 'vue'
import { useFamilyStore } from '../store'

export function useFamilyProfile() {
  const store = useFamilyStore()
  const loading = shallowRef(true)
  const error = shallowRef<Error | null>(null)

  async function load() {
    loading.value = true
    error.value = null

    try {
      await store.fetchFamilySummary()
      await store.fetchFamilyMembers()
    }
    catch (loadError) {
      error.value = loadError instanceof Error ? loadError : new Error('家庭画像加载失败')
    }
    finally {
      loading.value = false
    }
  }

  async function refresh() {
    loading.value = true
    error.value = null

    try {
      await store.refreshFamilyProfile()
    }
    catch (loadError) {
      error.value = loadError instanceof Error ? loadError : new Error('家庭画像刷新失败')
    }
    finally {
      loading.value = false
    }
  }

  const ready = load()
  const isEmpty = computed(() => !loading.value && store.memberList.length === 0)

  return {
    familySummary: computed(() => store.familySummary),
    memberList: computed(() => store.memberList),
    loading,
    error,
    isEmpty,
    ready,
    retry: load,
    refresh,
  }
}
