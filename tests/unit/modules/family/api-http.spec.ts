import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  createFamilyMember,
  fetchFamilyMembers,
  fetchFamilySummary,
  updateFamilyMember,
  updateFamilyMemberPreference,
} from '@/modules/family/api'

const { httpMock } = vi.hoisted(() => ({
  httpMock: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('@/config/env', () => ({
  env: {
    USE_MOCK: false,
  },
}))

vi.mock('@/utils/api/http', () => ({
  default: httpMock,
}))

describe('family api backend contract', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('maps family summary from wrapped backend response', async () => {
    httpMock.get.mockResolvedValueOnce({
      data: {
        data: {
          id: 1001,
          familyName: 'Yang Family',
          region: 'Shanghai',
          mealGoal: {
            weekday: 'quick',
            weekend: 'balanced',
          },
        },
      },
    })

    await expect(fetchFamilySummary('1001')).resolves.toEqual({
      familyId: '1001',
      familyName: 'Yang Family',
      region: 'Shanghai',
      mealGoal: 'weekday: quick, weekend: balanced',
    })

    expect(httpMock.get).toHaveBeenCalledWith('/api/families/1001')
  })

  it('maps member list enums and preference summary', async () => {
    httpMock.get.mockResolvedValueOnce({
      data: {
        data: [
          {
            id: 2001,
            familyId: 1001,
            name: 'Alice',
            roleType: 'ADULT',
            gender: 'UNKNOWN',
            birthday: '2018-05-20',
            region: 'Shanghai',
            targetType: 'WEIGHT_LOSS',
            avatarUrl: 'https://cdn.example.com/avatar/alice.png',
            sortNo: 1,
            preference: {
              tasteTags: ['light', 'home-style'],
              avoidIngredients: ['celery'],
              allergyIngredients: ['shrimp', 'peanut'],
              spicyLevel: 'MILD',
              sweetLevel: 'MODERATE',
              oilLevel: 'RICH',
              saltLevel: 'SALTY',
            },
          },
        ],
      },
    })

    await expect(fetchFamilyMembers('1001')).resolves.toEqual([
      {
        memberId: '2001',
        name: 'Alice',
        roleType: 'OTHER',
        gender: 'OTHER',
        birthday: '2018-05-20',
        region: 'Shanghai',
        targetType: 'FAT_LOSS',
        avatarUrl: 'https://cdn.example.com/avatar/alice.png',
        sortNo: 1,
        preferenceSummary: {
          tasteTags: ['light', 'home-style'],
          avoidIngredientCount: 1,
          allergyIngredientCount: 2,
          spicyLevel: 'LIGHT',
          sweetLevel: 'MEDIUM',
          oilLevel: 'HEAVY',
          saltLevel: 'HEAVY',
        },
      },
    ])
  })

  it('creates a member with mapped payload and resolves created detail', async () => {
    httpMock.get
      .mockResolvedValueOnce({
        data: {
          data: [
            { id: 1, sortNo: 1 },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          data: [
            { id: 1, sortNo: 1 },
            { id: 2, sortNo: 99 },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          data: {
            id: 2,
            familyId: 1001,
            name: '奶奶',
            roleType: 'ADULT',
            gender: 'FEMALE',
            birthday: '1958-02-01',
            region: 'Hangzhou',
            targetType: 'BALANCED',
            avatarUrl: '',
            sortNo: 99,
            preference: {
              tasteTags: [],
              avoidIngredients: [],
              allergyIngredients: [],
              spicyLevel: 'NONE',
              sweetLevel: 'NONE',
              oilLevel: 'LIGHT',
              saltLevel: 'LIGHT',
              nutritionGoal: { summary: 'eat well' },
              extraRule: { summary: 'soft meals' },
            },
          },
        },
      })
    httpMock.post.mockResolvedValueOnce({
      data: {
        success: true,
      },
    })
    httpMock.put.mockResolvedValueOnce({
      data: {
        success: true,
      },
    })

    const created = await createFamilyMember('1001', {
      name: '奶奶',
      roleType: 'ELDER',
      gender: 'FEMALE',
      birthday: '1958-02-01',
      region: 'Hangzhou',
      targetType: 'BALANCED',
      avatarUrl: '',
      sortNo: 99,
      preference: {
        tasteTags: [],
        avoidIngredients: [],
        allergyIngredients: [],
        spicyLevel: 'NONE',
        sweetLevel: 'NONE',
        oilLevel: 'LIGHT',
        saltLevel: 'LIGHT',
        nutritionGoal: 'eat well',
        extraRule: 'soft meals',
      },
    })

    expect(httpMock.post).toHaveBeenCalledWith('/api/families/1001/members', {
      name: '奶奶',
      roleType: 'ADULT',
      gender: 'FEMALE',
      birthday: '1958-02-01',
      region: 'Hangzhou',
      targetType: 'BALANCED',
      avatarUrl: '',
      sortNo: 99,
    })
    expect(httpMock.put).toHaveBeenCalledWith('/api/families/1001/members/2/preference', {
      tasteTags: [],
      avoidIngredients: [],
      allergyIngredients: [],
      spicyLevel: 'NONE',
      sweetLevel: 'NONE',
      oilLevel: 'LIGHT',
      saltLevel: 'LIGHT',
      nutritionGoal: {
        summary: 'eat well',
      },
      extraRule: {
        summary: 'soft meals',
      },
    })

    expect(created).toMatchObject({
      memberId: '2',
      name: '奶奶',
      roleType: 'OTHER',
      preference: {
        nutritionGoal: 'eat well',
        extraRule: 'soft meals',
      },
    })
  })

  it('updates preference with mapped payload and returns mapped preference', async () => {
    httpMock.put.mockResolvedValueOnce({
      data: {
        success: true,
      },
    })
    httpMock.get.mockResolvedValueOnce({
      data: {
        data: {
          id: 2001,
          familyId: 1001,
          name: 'Alice',
          roleType: 'BABY',
          gender: 'UNKNOWN',
          birthday: '2023-07-01',
          region: 'Shanghai',
          targetType: 'HEALTH_MANAGEMENT',
          avatarUrl: '',
          sortNo: 3,
          preference: {
            tasteTags: ['light'],
            avoidIngredients: ['cilantro'],
            allergyIngredients: ['shrimp'],
            spicyLevel: 'MILD',
            sweetLevel: 'SWEET',
            oilLevel: 'MODERATE',
            saltLevel: 'SALTY',
            nutritionGoal: { summary: 'more protein' },
            extraRule: { summary: 'warm breakfast only' },
          },
        },
      },
    })

    const preference = await updateFamilyMemberPreference('1001', '2001', {
      tasteTags: ['light'],
      avoidIngredients: ['cilantro'],
      allergyIngredients: ['shrimp'],
      spicyLevel: 'LIGHT',
      sweetLevel: 'HEAVY',
      oilLevel: 'MEDIUM',
      saltLevel: 'HEAVY',
      nutritionGoal: 'more protein',
      extraRule: 'warm breakfast only',
    })

    expect(httpMock.put).toHaveBeenCalledWith('/api/families/1001/members/2001/preference', {
      tasteTags: ['light'],
      avoidIngredients: ['cilantro'],
      allergyIngredients: ['shrimp'],
      spicyLevel: 'MILD',
      sweetLevel: 'SWEET',
      oilLevel: 'MODERATE',
      saltLevel: 'SALTY',
      nutritionGoal: {
        summary: 'more protein',
      },
      extraRule: {
        summary: 'warm breakfast only',
      },
    })

    expect(preference).toEqual({
      tasteTags: ['light'],
      avoidIngredients: ['cilantro'],
      allergyIngredients: ['shrimp'],
      spicyLevel: 'LIGHT',
      sweetLevel: 'HEAVY',
      oilLevel: 'MEDIUM',
      saltLevel: 'HEAVY',
      nutritionGoal: 'more protein',
      extraRule: 'warm breakfast only',
    })
  })

  it('updates member basic info with mapped payload and returns mapped detail', async () => {
    httpMock.put.mockResolvedValueOnce({
      data: {
        success: true,
      },
    })
    httpMock.get.mockResolvedValueOnce({
      data: {
        data: {
          id: 2002,
          familyId: 1001,
          name: '伴侣',
          roleType: 'ADULT',
          gender: 'FEMALE',
          birthday: '1994-08-16',
          region: 'Shanghai',
          targetType: 'WEIGHT_LOSS',
          avatarUrl: '',
          sortNo: 2,
          preference: {
            tasteTags: [],
            avoidIngredients: [],
            allergyIngredients: [],
            spicyLevel: 'NONE',
            sweetLevel: 'LIGHT',
            oilLevel: 'LIGHT',
            saltLevel: 'LIGHT',
          },
        },
      },
    })

    const detail = await updateFamilyMember('1001', '2002', {
      name: '伴侣',
      roleType: 'SPOUSE',
      gender: 'FEMALE',
      birthday: '1994-08-16',
      region: 'Shanghai',
      targetType: 'FAT_LOSS',
      avatarUrl: '',
      sortNo: 2,
    })

    expect(httpMock.put).toHaveBeenCalledWith('/api/families/1001/members/2002', {
      name: '伴侣',
      roleType: 'ADULT',
      gender: 'FEMALE',
      birthday: '1994-08-16',
      region: 'Shanghai',
      targetType: 'WEIGHT_LOSS',
      avatarUrl: '',
      sortNo: 2,
    })

    expect(detail).toMatchObject({
      memberId: '2002',
      roleType: 'OTHER',
      targetType: 'FAT_LOSS',
    })
  })
})
