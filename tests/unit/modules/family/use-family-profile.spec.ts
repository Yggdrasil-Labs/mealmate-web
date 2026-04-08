import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useFamilyProfile } from '@/modules/family/composables/useFamilyProfile'
import { DEFAULT_FAMILY_ID } from '@/modules/family/constants'
import { resetFamilyMockData } from '@/modules/family/mock'
import { useFamilyStore } from '@/modules/family/store'

vi.mock('@/config/env', () => ({
  env: {
    USE_MOCK: true,
  },
}))

beforeEach(() => {
  setActivePinia(createPinia())
  resetFamilyMockData()
})

describe('useFamilyProfile', () => {
  it('loads family summary and member list on creation', async () => {
    const store = useFamilyStore()
    const fetchSummarySpy = vi.spyOn(store, 'fetchFamilySummary')
    const fetchMembersSpy = vi.spyOn(store, 'fetchFamilyMembers')

    const profile = useFamilyProfile()
    await profile.ready

    expect(fetchSummarySpy).toHaveBeenCalledTimes(1)
    expect(fetchMembersSpy).toHaveBeenCalledTimes(1)
    expect(profile.familySummary.value?.familyId).toBe(DEFAULT_FAMILY_ID)
    expect(profile.error.value).toBeNull()
    expect(profile.isEmpty.value).toBe(false)
  })

  it('retries after a failed initial load', async () => {
    const store = useFamilyStore()
    let shouldFail = true
    const originalFetchSummary = store.fetchFamilySummary

    vi.spyOn(store, 'fetchFamilySummary').mockImplementation(async () => {
      if (shouldFail)
        throw new Error('summary failed')
      return originalFetchSummary()
    })

    const fetchMembersSpy = vi.spyOn(store, 'fetchFamilyMembers')
    const profile = useFamilyProfile()

    await profile.ready

    expect(profile.error.value?.message).toBe('summary failed')
    expect(profile.loading.value).toBe(false)

    shouldFail = false
    await profile.retry()

    expect(fetchMembersSpy).toHaveBeenCalledTimes(1)
    expect(profile.error.value).toBeNull()
    expect(profile.loading.value).toBe(false)
  })

  it('exposes empty, loading, error, retry, and refresh state', async () => {
    useFamilyStore()
    const profile = useFamilyProfile()

    expect(profile.loading.value).toBe(true)
    expect(profile.retry).toBeTypeOf('function')
    expect(profile.refresh).toBeTypeOf('function')

    await profile.ready

    expect(profile.loading.value).toBe(false)
    expect(profile.error.value).toBeNull()
    expect(profile.isEmpty.value).toBe(false)

    await profile.refresh()

    expect(profile.error.value).toBeNull()
  })
})
