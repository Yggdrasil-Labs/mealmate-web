export type FamilyRoleType
  = | 'SELF'
    | 'SPOUSE'
    | 'CHILD'
    | 'BABY'
    | 'ELDER'
    | 'OTHER'

export type FamilyTargetType
  = | 'BALANCED'
    | 'FAT_LOSS'
    | 'MUSCLE_GAIN'
    | 'BABY_FRIENDLY'

export type SpicyLevel = 'NONE' | 'LIGHT' | 'MEDIUM' | 'HEAVY'
export type SweetLevel = 'NONE' | 'LIGHT' | 'MEDIUM' | 'HEAVY'
export type OilLevel = 'LIGHT' | 'MEDIUM' | 'HEAVY'
export type SaltLevel = 'LIGHT' | 'MEDIUM' | 'HEAVY'

export interface FamilySummary {
  familyId: string
  familyName: string
  region: string
  mealGoal: string
}

export interface FamilyMemberPreferenceSummary {
  tasteTags: string[]
  avoidIngredientCount: number
  allergyIngredientCount: number
  spicyLevel: SpicyLevel
  sweetLevel: SweetLevel
  oilLevel: OilLevel
  saltLevel: SaltLevel
}

export interface FamilyMemberSummary {
  memberId: string
  name: string
  roleType: FamilyRoleType
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  birthday: string
  region: string
  targetType: FamilyTargetType
  avatarUrl: string
  sortNo: number
  preferenceSummary: FamilyMemberPreferenceSummary
}

export interface MemberPreference {
  tasteTags: string[]
  avoidIngredients: string[]
  allergyIngredients: string[]
  spicyLevel: SpicyLevel
  sweetLevel: SweetLevel
  oilLevel: OilLevel
  saltLevel: SaltLevel
  nutritionGoal: string
  extraRule: string
}

export interface FamilyMemberDetail extends Omit<FamilyMemberSummary, 'preferenceSummary'> {
  preference: MemberPreference
}

export interface CreateFamilyMemberPayload {
  name: string
  roleType: FamilyRoleType
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  birthday: string
  region: string
  targetType: FamilyTargetType
  avatarUrl: string
  sortNo: number
  preference: MemberPreference
}

export interface UpdateFamilyMemberPayload {
  name: string
  roleType: FamilyRoleType
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  birthday: string
  region: string
  targetType: FamilyTargetType
  avatarUrl: string
  sortNo: number
}

export type UpdateFamilyMemberPreferencePayload = MemberPreference

export interface FamilyMemberFormValues extends CreateFamilyMemberPayload {}
