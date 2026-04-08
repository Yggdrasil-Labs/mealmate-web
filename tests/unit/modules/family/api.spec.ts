import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  createFamilyMember,
  deleteFamilyMember,
  fetchFamilyMemberDetail,
  fetchFamilyMembers,
  fetchFamilySummary,
  updateFamilyMember,
  updateFamilyMemberPreference,
} from '@/modules/family/api'
import { DEFAULT_FAMILY_ID } from '@/modules/family/constants'
import { createDefaultFamilyMemberFormValues, resetFamilyMockData } from '@/modules/family/mock'

vi.mock('@/config/env', () => ({
  env: {
    USE_MOCK: true,
  },
}))

const familyId = DEFAULT_FAMILY_ID

beforeEach(() => {
  resetFamilyMockData()
})

describe('family api', () => {
  it('fetches family summary', async () => {
    const summary = await fetchFamilySummary(familyId)

    expect(summary).toMatchObject({
      familyId,
      familyName: 'MealMate 家庭',
      region: '杭州',
    })
  })

  it('fetches member list', async () => {
    const members = await fetchFamilyMembers(familyId)

    expect(members).toHaveLength(3)
    expect(members[0]).toMatchObject({
      memberId: 'member-self',
      name: '杨阳',
      roleType: 'SELF',
    })
  })

  it('fetches member detail', async () => {
    const detail = await fetchFamilyMemberDetail(familyId, 'member-baby')

    expect(detail).toMatchObject({
      memberId: 'member-baby',
      roleType: 'BABY',
      preference: {
        spicyLevel: 'NONE',
        saltLevel: 'LIGHT',
      },
    })
  })

  it('adds a member', async () => {
    const created = await createFamilyMember(familyId, {
      ...createDefaultFamilyMemberFormValues(),
      name: '奶奶',
      roleType: 'ELDER',
      targetType: 'BALANCED',
    })

    const members = await fetchFamilyMembers(familyId)

    expect(created.name).toBe('奶奶')
    expect(members).toHaveLength(4)
    expect(members.at(-1)?.memberId).toBe(created.memberId)
  })

  it('updates member basic info', async () => {
    const updated = await updateFamilyMember(familyId, 'member-spouse', {
      name: '伴侣',
      roleType: 'SPOUSE',
      gender: 'FEMALE',
      birthday: '1994-08-16',
      region: '上海',
      targetType: 'FAT_LOSS',
      avatarUrl: '',
      sortNo: 2,
    })

    expect(updated.name).toBe('伴侣')
    expect(updated.region).toBe('上海')
    expect(updated.targetType).toBe('FAT_LOSS')
  })

  it('updates member preference', async () => {
    const updated = await updateFamilyMemberPreference(familyId, 'member-self', {
      tasteTags: ['清淡', '汤羹'],
      avoidIngredients: ['香菜'],
      allergyIngredients: [],
      spicyLevel: 'LIGHT',
      sweetLevel: 'NONE',
      oilLevel: 'LIGHT',
      saltLevel: 'LIGHT',
      nutritionGoal: '减少晚餐油脂摄入',
      extraRule: '晚餐优先蒸煮',
    })

    expect(updated.tasteTags).toEqual(['清淡', '汤羹'])
    expect(updated.oilLevel).toBe('LIGHT')

    const detail = await fetchFamilyMemberDetail(familyId, 'member-self')
    expect(detail.preference.extraRule).toBe('晚餐优先蒸煮')
  })

  it('deletes a member', async () => {
    await deleteFamilyMember(familyId, 'member-baby')

    const members = await fetchFamilyMembers(familyId)

    expect(members).toHaveLength(2)
    expect(members.some(member => member.memberId === 'member-baby')).toBe(false)
  })
})
