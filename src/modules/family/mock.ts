import type {
  CreateFamilyMemberPayload,
  FamilyMemberDetail,
  FamilyMemberSummary,
  FamilySummary,
  MemberPreference,
  UpdateFamilyMemberPayload,
  UpdateFamilyMemberPreferencePayload,
} from './types'
import { DEFAULT_FAMILY_ID } from './constants'

const DEMO_FAMILY_ID = DEFAULT_FAMILY_ID

function createPreferenceSummary(preference: MemberPreference) {
  return {
    tasteTags: preference.tasteTags,
    avoidIngredientCount: preference.avoidIngredients.length,
    allergyIngredientCount: preference.allergyIngredients.length,
    spicyLevel: preference.spicyLevel,
    sweetLevel: preference.sweetLevel,
    oilLevel: preference.oilLevel,
    saltLevel: preference.saltLevel,
  }
}

export function createDefaultFamilyMemberFormValues(): CreateFamilyMemberPayload {
  return {
    name: '',
    roleType: 'OTHER',
    gender: 'OTHER',
    birthday: '',
    region: '杭州',
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
      nutritionGoal: '',
      extraRule: '',
    },
  }
}

function createInitialFamilySummary(): FamilySummary {
  return {
    familyId: DEMO_FAMILY_ID,
    familyName: 'MealMate 家庭',
    region: '杭州',
    mealGoal: '工作日晚餐均衡、周末兼顾宝宝适配',
  }
}

function createInitialMemberDetails(): FamilyMemberDetail[] {
  return [
    {
      memberId: 'member-self',
      name: '杨阳',
      roleType: 'SELF',
      gender: 'MALE',
      birthday: '1992-09-01',
      region: '杭州',
      targetType: 'BALANCED',
      avatarUrl: '',
      sortNo: 1,
      preference: {
        tasteTags: ['清淡', '汤羹'],
        avoidIngredients: ['肥肉'],
        allergyIngredients: [],
        spicyLevel: 'LIGHT',
        sweetLevel: 'NONE',
        oilLevel: 'LIGHT',
        saltLevel: 'LIGHT',
        nutritionGoal: '控制工作日晚餐负担',
        extraRule: '每周至少两次炖汤',
      },
    },
    {
      memberId: 'member-spouse',
      name: '沐沐',
      roleType: 'SPOUSE',
      gender: 'FEMALE',
      birthday: '1994-08-16',
      region: '杭州',
      targetType: 'FAT_LOSS',
      avatarUrl: '',
      sortNo: 2,
      preference: {
        tasteTags: ['鲜香', '低脂'],
        avoidIngredients: ['动物内脏'],
        allergyIngredients: [],
        spicyLevel: 'NONE',
        sweetLevel: 'LIGHT',
        oilLevel: 'LIGHT',
        saltLevel: 'LIGHT',
        nutritionGoal: '减少精制糖和油炸菜',
        extraRule: '午餐可适当加粗粮',
      },
    },
    {
      memberId: 'member-baby',
      name: '小满',
      roleType: 'BABY',
      gender: 'OTHER',
      birthday: '2023-07-01',
      region: '杭州',
      targetType: 'BABY_FRIENDLY',
      avatarUrl: '',
      sortNo: 3,
      preference: {
        tasteTags: ['软烂', '原味'],
        avoidIngredients: ['整粒坚果'],
        allergyIngredients: ['虾'],
        spicyLevel: 'NONE',
        sweetLevel: 'NONE',
        oilLevel: 'LIGHT',
        saltLevel: 'LIGHT',
        nutritionGoal: '优先补铁和优质蛋白',
        extraRule: '避免辛辣和大块食材',
      },
    },
  ]
}

let familySummaryState = createInitialFamilySummary()
let familyMemberDetailState = createInitialMemberDetails()

function ensureFamilyId(familyId: string) {
  if (familyId !== DEMO_FAMILY_ID)
    throw new Error(`Family not found: ${familyId}`)
}

function clonePreference(preference: MemberPreference): MemberPreference {
  return structuredClone(preference)
}

function cloneMemberDetail(detail: FamilyMemberDetail): FamilyMemberDetail {
  return {
    ...detail,
    preference: clonePreference(detail.preference),
  }
}

function toMemberSummary(detail: FamilyMemberDetail): FamilyMemberSummary {
  return {
    memberId: detail.memberId,
    name: detail.name,
    roleType: detail.roleType,
    gender: detail.gender,
    birthday: detail.birthday,
    region: detail.region,
    targetType: detail.targetType,
    avatarUrl: detail.avatarUrl,
    sortNo: detail.sortNo,
    preferenceSummary: createPreferenceSummary(detail.preference),
  }
}

function findMemberDetail(memberId: string) {
  const detail = familyMemberDetailState.find(member => member.memberId === memberId)
  if (!detail)
    throw new Error(`Family member not found: ${memberId}`)
  return detail
}

export function resetFamilyMockData() {
  familySummaryState = createInitialFamilySummary()
  familyMemberDetailState = createInitialMemberDetails()
}

export async function mockFetchFamilySummary(familyId: string): Promise<FamilySummary> {
  ensureFamilyId(familyId)
  return { ...familySummaryState }
}

export async function mockFetchFamilyMembers(familyId: string): Promise<FamilyMemberSummary[]> {
  ensureFamilyId(familyId)
  return familyMemberDetailState
    .slice()
    .sort((left, right) => left.sortNo - right.sortNo)
    .map(toMemberSummary)
}

export async function mockFetchFamilyMemberDetail(familyId: string, memberId: string): Promise<FamilyMemberDetail> {
  ensureFamilyId(familyId)
  return cloneMemberDetail(findMemberDetail(memberId))
}

export async function mockCreateFamilyMember(
  familyId: string,
  payload: CreateFamilyMemberPayload,
): Promise<FamilyMemberDetail> {
  ensureFamilyId(familyId)

  const member: FamilyMemberDetail = {
    ...payload,
    memberId: `member-${crypto.randomUUID()}`,
    preference: clonePreference(payload.preference),
  }

  familyMemberDetailState = [...familyMemberDetailState, member]
  return cloneMemberDetail(member)
}

export async function mockUpdateFamilyMember(
  familyId: string,
  memberId: string,
  payload: UpdateFamilyMemberPayload,
): Promise<FamilyMemberDetail> {
  ensureFamilyId(familyId)

  const detail = findMemberDetail(memberId)
  Object.assign(detail, payload)

  return cloneMemberDetail(detail)
}

export async function mockUpdateFamilyMemberPreference(
  familyId: string,
  memberId: string,
  payload: UpdateFamilyMemberPreferencePayload,
): Promise<MemberPreference> {
  ensureFamilyId(familyId)

  const detail = findMemberDetail(memberId)
  detail.preference = clonePreference(payload)

  return clonePreference(detail.preference)
}

export async function mockDeleteFamilyMember(familyId: string, memberId: string): Promise<void> {
  ensureFamilyId(familyId)
  findMemberDetail(memberId)
  familyMemberDetailState = familyMemberDetailState.filter(member => member.memberId !== memberId)
}
