import type {
  CreateFamilyMemberPayload,
  FamilyMemberDetail,
  FamilyMemberSummary,
  FamilySummary,
  MemberPreference,
  UpdateFamilyMemberPayload,
  UpdateFamilyMemberPreferencePayload,
} from './types'
import http from '@/utils/api/http'

type FamilyApiRoleType = 'ADULT' | 'BABY' | 'GUEST'
type FamilyApiGender = 'MALE' | 'FEMALE' | 'UNKNOWN'
type FamilyApiTargetType = 'BALANCED' | 'WEIGHT_LOSS' | 'MUSCLE_GAIN' | 'HEALTH_MANAGEMENT'
type FamilyApiSpicyLevel = 'NONE' | 'MILD' | 'MEDIUM' | 'HOT'
type FamilyApiSweetLevel = 'NONE' | 'LIGHT' | 'MODERATE' | 'SWEET'
type FamilyApiOilLevel = 'LIGHT' | 'MODERATE' | 'RICH'
type FamilyApiSaltLevel = 'LIGHT' | 'MODERATE' | 'SALTY'

type FamilyApiStructuredText = Record<string, unknown>

interface FamilyApiResponseEnvelope<T> {
  data?: T
}

interface FamilyProfileResponseDto {
  id: number
  familyName: string
  region: string
  mealGoal?: FamilyApiStructuredText | string | null
}

interface MemberPreferenceResponseDto {
  tasteTags?: string[]
  avoidIngredients?: string[]
  allergyIngredients?: string[]
  spicyLevel?: FamilyApiSpicyLevel
  sweetLevel?: FamilyApiSweetLevel
  oilLevel?: FamilyApiOilLevel
  saltLevel?: FamilyApiSaltLevel
  nutritionGoal?: FamilyApiStructuredText | string | null
  extraRule?: FamilyApiStructuredText | string | null
}

interface FamilyMemberResponseDto {
  id: number
  familyId: number
  name: string
  roleType: FamilyApiRoleType
  gender: FamilyApiGender
  birthday: string
  region: string
  targetType: FamilyApiTargetType
  avatarUrl: string
  sortNo: number
  preference?: MemberPreferenceResponseDto
}

interface AddFamilyMemberRequestDto {
  name: string
  roleType: FamilyApiRoleType
  gender: FamilyApiGender
  birthday: string
  region: string
  targetType: FamilyApiTargetType
  avatarUrl: string
  sortNo: number
}

type UpdateFamilyMemberRequestDto = AddFamilyMemberRequestDto

interface UpdateMemberPreferenceRequestDto {
  tasteTags?: string[]
  avoidIngredients?: string[]
  allergyIngredients?: string[]
  spicyLevel?: FamilyApiSpicyLevel
  sweetLevel?: FamilyApiSweetLevel
  oilLevel?: FamilyApiOilLevel
  saltLevel?: FamilyApiSaltLevel
  nutritionGoal?: FamilyApiStructuredText
  extraRule?: FamilyApiStructuredText
}

async function unwrapResponseData<T>(request: Promise<unknown>): Promise<T> {
  const response = await request as FamilyApiResponseEnvelope<FamilyApiResponseEnvelope<T> | T>
  const payload = response.data

  if (payload && typeof payload === 'object' && 'data' in payload)
    return (payload as FamilyApiResponseEnvelope<T>).data as T

  if (payload !== undefined)
    return payload as T

  throw new Error('Family API returned empty data payload')
}

function stringifyStructuredValue(value: FamilyApiStructuredText | string | null | undefined): string {
  if (typeof value === 'string')
    return value
  if (!value || typeof value !== 'object')
    return ''

  if (typeof value.summary === 'string')
    return value.summary

  const entries = Object.entries(value)
    .filter(([, item]) => item !== undefined && item !== null && item !== '')
    .map(([key, item]) => `${key}: ${String(item)}`)

  return entries.join(', ')
}

function toStructuredText(value: string): FamilyApiStructuredText | undefined {
  const trimmedValue = value.trim()
  if (!trimmedValue)
    return undefined
  return { summary: trimmedValue }
}

function mapRoleTypeToApi(roleType: UpdateFamilyMemberPayload['roleType']): FamilyApiRoleType {
  if (roleType === 'BABY')
    return 'BABY'
  if (roleType === 'OTHER')
    return 'GUEST'
  return 'ADULT'
}

function mapRoleTypeFromApi(roleType: FamilyApiRoleType): FamilyMemberDetail['roleType'] {
  if (roleType === 'BABY')
    return 'BABY'
  return 'OTHER'
}

function mapGenderToApi(gender: UpdateFamilyMemberPayload['gender']): FamilyApiGender {
  if (gender === 'OTHER')
    return 'UNKNOWN'
  return gender
}

function mapGenderFromApi(gender: FamilyApiGender): FamilyMemberDetail['gender'] {
  if (gender === 'UNKNOWN')
    return 'OTHER'
  return gender
}

function mapTargetTypeToApi(targetType: UpdateFamilyMemberPayload['targetType']): FamilyApiTargetType {
  switch (targetType) {
    case 'FAT_LOSS':
      return 'WEIGHT_LOSS'
    case 'BABY_FRIENDLY':
      return 'HEALTH_MANAGEMENT'
    default:
      return targetType
  }
}

function mapTargetTypeFromApi(targetType: FamilyApiTargetType): FamilyMemberDetail['targetType'] {
  switch (targetType) {
    case 'WEIGHT_LOSS':
      return 'FAT_LOSS'
    case 'HEALTH_MANAGEMENT':
      return 'BABY_FRIENDLY'
    default:
      return targetType
  }
}

function mapSpicyLevelToApi(level: MemberPreference['spicyLevel']): FamilyApiSpicyLevel {
  switch (level) {
    case 'LIGHT':
      return 'MILD'
    case 'HEAVY':
      return 'HOT'
    default:
      return level
  }
}

function mapSpicyLevelFromApi(level: FamilyApiSpicyLevel): MemberPreference['spicyLevel'] {
  switch (level) {
    case 'MILD':
      return 'LIGHT'
    case 'HOT':
      return 'HEAVY'
    default:
      return level
  }
}

function mapSweetLevelToApi(level: MemberPreference['sweetLevel']): FamilyApiSweetLevel {
  switch (level) {
    case 'MEDIUM':
      return 'MODERATE'
    case 'HEAVY':
      return 'SWEET'
    default:
      return level
  }
}

function mapSweetLevelFromApi(level: FamilyApiSweetLevel): MemberPreference['sweetLevel'] {
  switch (level) {
    case 'MODERATE':
      return 'MEDIUM'
    case 'SWEET':
      return 'HEAVY'
    default:
      return level
  }
}

function mapOilLevelToApi(level: MemberPreference['oilLevel']): FamilyApiOilLevel {
  switch (level) {
    case 'MEDIUM':
      return 'MODERATE'
    case 'HEAVY':
      return 'RICH'
    default:
      return level
  }
}

function mapOilLevelFromApi(level: FamilyApiOilLevel): MemberPreference['oilLevel'] {
  switch (level) {
    case 'MODERATE':
      return 'MEDIUM'
    case 'RICH':
      return 'HEAVY'
    default:
      return level
  }
}

function mapSaltLevelToApi(level: MemberPreference['saltLevel']): FamilyApiSaltLevel {
  switch (level) {
    case 'MEDIUM':
      return 'MODERATE'
    case 'HEAVY':
      return 'SALTY'
    default:
      return level
  }
}

function mapSaltLevelFromApi(level: FamilyApiSaltLevel): MemberPreference['saltLevel'] {
  switch (level) {
    case 'MODERATE':
      return 'MEDIUM'
    case 'SALTY':
      return 'HEAVY'
    default:
      return level
  }
}

function mapPreferenceFromApi(preference?: MemberPreferenceResponseDto): MemberPreference {
  return {
    tasteTags: preference?.tasteTags ?? [],
    avoidIngredients: preference?.avoidIngredients ?? [],
    allergyIngredients: preference?.allergyIngredients ?? [],
    spicyLevel: mapSpicyLevelFromApi(preference?.spicyLevel ?? 'NONE'),
    sweetLevel: mapSweetLevelFromApi(preference?.sweetLevel ?? 'NONE'),
    oilLevel: mapOilLevelFromApi(preference?.oilLevel ?? 'LIGHT'),
    saltLevel: mapSaltLevelFromApi(preference?.saltLevel ?? 'LIGHT'),
    nutritionGoal: stringifyStructuredValue(preference?.nutritionGoal),
    extraRule: stringifyStructuredValue(preference?.extraRule),
  }
}

function mapPreferenceToApi(preference: MemberPreference): UpdateMemberPreferenceRequestDto {
  return {
    tasteTags: preference.tasteTags,
    avoidIngredients: preference.avoidIngredients,
    allergyIngredients: preference.allergyIngredients,
    spicyLevel: mapSpicyLevelToApi(preference.spicyLevel),
    sweetLevel: mapSweetLevelToApi(preference.sweetLevel),
    oilLevel: mapOilLevelToApi(preference.oilLevel),
    saltLevel: mapSaltLevelToApi(preference.saltLevel),
    nutritionGoal: toStructuredText(preference.nutritionGoal),
    extraRule: toStructuredText(preference.extraRule),
  }
}

function mapFamilySummaryFromApi(summary: FamilyProfileResponseDto): FamilySummary {
  return {
    familyId: String(summary.id),
    familyName: summary.familyName,
    region: summary.region,
    mealGoal: stringifyStructuredValue(summary.mealGoal),
  }
}

function mapFamilyMemberDetailFromApi(detail: FamilyMemberResponseDto): FamilyMemberDetail {
  return {
    memberId: String(detail.id),
    name: detail.name,
    roleType: mapRoleTypeFromApi(detail.roleType),
    gender: mapGenderFromApi(detail.gender),
    birthday: detail.birthday,
    region: detail.region,
    targetType: mapTargetTypeFromApi(detail.targetType),
    avatarUrl: detail.avatarUrl,
    sortNo: detail.sortNo,
    preference: mapPreferenceFromApi(detail.preference),
  }
}

function mapFamilyMemberSummaryFromApi(detail: FamilyMemberResponseDto): FamilyMemberSummary {
  const preference = mapPreferenceFromApi(detail.preference)
  return {
    memberId: String(detail.id),
    name: detail.name,
    roleType: mapRoleTypeFromApi(detail.roleType),
    gender: mapGenderFromApi(detail.gender),
    birthday: detail.birthday,
    region: detail.region,
    targetType: mapTargetTypeFromApi(detail.targetType),
    avatarUrl: detail.avatarUrl,
    sortNo: detail.sortNo,
    preferenceSummary: {
      tasteTags: preference.tasteTags,
      avoidIngredientCount: preference.avoidIngredients.length,
      allergyIngredientCount: preference.allergyIngredients.length,
      spicyLevel: preference.spicyLevel,
      sweetLevel: preference.sweetLevel,
      oilLevel: preference.oilLevel,
      saltLevel: preference.saltLevel,
    },
  }
}

function mapBasicPayloadToApi(payload: UpdateFamilyMemberPayload): UpdateFamilyMemberRequestDto {
  return {
    name: payload.name,
    roleType: mapRoleTypeToApi(payload.roleType),
    gender: mapGenderToApi(payload.gender),
    birthday: payload.birthday,
    region: payload.region,
    targetType: mapTargetTypeToApi(payload.targetType),
    avatarUrl: payload.avatarUrl,
    sortNo: payload.sortNo,
  }
}

async function fetchFamilySummaryDto(familyId: string): Promise<FamilyProfileResponseDto> {
  return unwrapResponseData<FamilyProfileResponseDto>(http.get(`/api/families/${familyId}`))
}

async function fetchFamilyMembersDto(familyId: string): Promise<FamilyMemberResponseDto[]> {
  return unwrapResponseData<FamilyMemberResponseDto[]>(http.get(`/api/families/${familyId}/members`))
}

async function fetchFamilyMemberDetailDto(familyId: string, memberId: string): Promise<FamilyMemberResponseDto> {
  return unwrapResponseData<FamilyMemberResponseDto>(http.get(`/api/families/${familyId}/members/${memberId}`))
}

async function submitCreateFamilyMember(familyId: string, payload: CreateFamilyMemberPayload): Promise<void> {
  await http.post(`/api/families/${familyId}/members`, mapBasicPayloadToApi(payload))
}

async function submitUpdateFamilyMember(
  familyId: string,
  memberId: string,
  payload: UpdateFamilyMemberPayload,
): Promise<void> {
  await http.put(`/api/families/${familyId}/members/${memberId}`, mapBasicPayloadToApi(payload))
}

async function submitUpdateFamilyMemberPreference(
  familyId: string,
  memberId: string,
  payload: UpdateFamilyMemberPreferencePayload,
): Promise<void> {
  await http.put(`/api/families/${familyId}/members/${memberId}/preference`, mapPreferenceToApi(payload))
}

async function resolveCreatedMemberId(familyId: string, previousIds: Set<string>): Promise<string> {
  const nextMembers = await fetchFamilyMembersDto(familyId)
  const createdMember = nextMembers.find(member => !previousIds.has(String(member.id)))

  if (!createdMember)
    throw new Error('Created family member could not be resolved from backend response')

  return String(createdMember.id)
}

export async function fetchFamilySummary(familyId: string): Promise<FamilySummary> {
  return mapFamilySummaryFromApi(await fetchFamilySummaryDto(familyId))
}

export async function fetchFamilyMembers(familyId: string): Promise<FamilyMemberSummary[]> {
  const members = await fetchFamilyMembersDto(familyId)
  return members.map(mapFamilyMemberSummaryFromApi)
}

export async function fetchFamilyMemberDetail(familyId: string, memberId: string): Promise<FamilyMemberDetail> {
  return mapFamilyMemberDetailFromApi(await fetchFamilyMemberDetailDto(familyId, memberId))
}

export async function createFamilyMember(
  familyId: string,
  payload: CreateFamilyMemberPayload,
): Promise<FamilyMemberDetail> {
  const previousMembers = await fetchFamilyMembersDto(familyId)
  const previousIds = new Set(previousMembers.map(member => String(member.id)))

  await submitCreateFamilyMember(familyId, payload)

  const createdMemberId = await resolveCreatedMemberId(familyId, previousIds)
  await submitUpdateFamilyMemberPreference(familyId, createdMemberId, payload.preference)

  return fetchFamilyMemberDetail(familyId, createdMemberId)
}

export async function updateFamilyMember(
  familyId: string,
  memberId: string,
  payload: UpdateFamilyMemberPayload,
): Promise<FamilyMemberDetail> {
  await submitUpdateFamilyMember(familyId, memberId, payload)
  return fetchFamilyMemberDetail(familyId, memberId)
}

export async function updateFamilyMemberPreference(
  familyId: string,
  memberId: string,
  payload: UpdateFamilyMemberPreferencePayload,
): Promise<MemberPreference> {
  await submitUpdateFamilyMemberPreference(familyId, memberId, payload)
  const detail = await fetchFamilyMemberDetail(familyId, memberId)
  return detail.preference
}

export async function deleteFamilyMember(familyId: string, memberId: string): Promise<void> {
  await http.delete(`/api/families/${familyId}/members/${memberId}`)
}
