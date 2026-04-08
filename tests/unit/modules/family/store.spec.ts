import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createFamilyMember } from '@/modules/family/api'
import { DEFAULT_FAMILY_ID } from '@/modules/family/constants'
import { createDefaultFamilyMemberFormValues, resetFamilyMockData } from '@/modules/family/mock'
import { useFamilyStore } from '@/modules/family/store'

vi.mock('@/config/env', () => ({
  env: {
    USE_MOCK: true,
  },
}))

const familyId = DEFAULT_FAMILY_ID

beforeEach(() => {
  setActivePinia(createPinia())
  resetFamilyMockData()
})

describe('useFamilyStore', () => {
  it('starts with the preset family id from backend seed data', () => {
    const store = useFamilyStore()

    expect(store.activeFamilyId).toBe(familyId)
    expect(store.familySummary).toBeNull()
    expect(store.memberList).toEqual([])
  })

  it('fetches family summary into shared state', async () => {
    const store = useFamilyStore()

    const summary = await store.fetchFamilySummary()

    expect(summary.familyId).toBe(familyId)
    expect(store.familySummary?.familyName).toBe('MealMate 家庭')
    expect(store.loading).toBe(false)
  })

  it('fetches member list into shared state', async () => {
    const store = useFamilyStore()

    const members = await store.fetchFamilyMembers()

    expect(members).toHaveLength(3)
    expect(store.memberList[0]?.memberId).toBe('member-self')
    expect(store.loading).toBe(false)
  })

  it('refreshes family profile after upstream changes', async () => {
    const store = useFamilyStore()

    await createFamilyMember(familyId, {
      ...createDefaultFamilyMemberFormValues(),
      name: '奶奶',
      roleType: 'ELDER',
      targetType: 'BALANCED',
    })

    await store.refreshFamilyProfile()

    expect(store.familySummary?.familyId).toBe(familyId)
    expect(store.memberList).toHaveLength(4)
    expect(store.memberList.at(-1)?.name).toBe('奶奶')
  })
})
