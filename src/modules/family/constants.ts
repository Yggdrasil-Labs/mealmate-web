import type {
  FamilyRoleType,
  FamilyTargetType,
  OilLevel,
  SaltLevel,
  SpicyLevel,
  SweetLevel,
} from './types'

type Translate = (key: string) => string

export const DEFAULT_FAMILY_ID = '1000000000001'

function createOption<T extends string>(value: T, label: string) {
  return { value, label }
}

export function getFamilyRoleTypeLabel(value: FamilyRoleType, t: Translate) {
  return t(`family.enums.roleType.${value}`)
}

export function getFamilyRoleTypeOptions(t: Translate) {
  return [
    createOption('SELF', getFamilyRoleTypeLabel('SELF', t)),
    createOption('SPOUSE', getFamilyRoleTypeLabel('SPOUSE', t)),
    createOption('CHILD', getFamilyRoleTypeLabel('CHILD', t)),
    createOption('BABY', getFamilyRoleTypeLabel('BABY', t)),
    createOption('ELDER', getFamilyRoleTypeLabel('ELDER', t)),
    createOption('OTHER', getFamilyRoleTypeLabel('OTHER', t)),
  ] satisfies Array<{ value: FamilyRoleType, label: string }>
}

export function getFamilyTargetTypeLabel(value: FamilyTargetType, t: Translate) {
  return t(`family.enums.targetType.${value}`)
}

export function getFamilyTargetTypeOptions(t: Translate) {
  return [
    createOption('BALANCED', getFamilyTargetTypeLabel('BALANCED', t)),
    createOption('FAT_LOSS', getFamilyTargetTypeLabel('FAT_LOSS', t)),
    createOption('MUSCLE_GAIN', getFamilyTargetTypeLabel('MUSCLE_GAIN', t)),
    createOption('BABY_FRIENDLY', getFamilyTargetTypeLabel('BABY_FRIENDLY', t)),
  ] satisfies Array<{ value: FamilyTargetType, label: string }>
}

export function getSpicyLevelLabel(value: SpicyLevel, t: Translate) {
  return t(`family.enums.spicyLevel.${value}`)
}

export function getSpicyLevelOptions(t: Translate) {
  return [
    createOption('NONE', getSpicyLevelLabel('NONE', t)),
    createOption('LIGHT', getSpicyLevelLabel('LIGHT', t)),
    createOption('MEDIUM', getSpicyLevelLabel('MEDIUM', t)),
    createOption('HEAVY', getSpicyLevelLabel('HEAVY', t)),
  ] satisfies Array<{ value: SpicyLevel, label: string }>
}

export function getSweetLevelLabel(value: SweetLevel, t: Translate) {
  return t(`family.enums.sweetLevel.${value}`)
}

export function getSweetLevelOptions(t: Translate) {
  return [
    createOption('NONE', getSweetLevelLabel('NONE', t)),
    createOption('LIGHT', getSweetLevelLabel('LIGHT', t)),
    createOption('MEDIUM', getSweetLevelLabel('MEDIUM', t)),
    createOption('HEAVY', getSweetLevelLabel('HEAVY', t)),
  ] satisfies Array<{ value: SweetLevel, label: string }>
}

export function getOilLevelLabel(value: OilLevel, t: Translate) {
  return t(`family.enums.oilLevel.${value}`)
}

export function getOilLevelOptions(t: Translate) {
  return [
    createOption('LIGHT', getOilLevelLabel('LIGHT', t)),
    createOption('MEDIUM', getOilLevelLabel('MEDIUM', t)),
    createOption('HEAVY', getOilLevelLabel('HEAVY', t)),
  ] satisfies Array<{ value: OilLevel, label: string }>
}

export function getSaltLevelLabel(value: SaltLevel, t: Translate) {
  return t(`family.enums.saltLevel.${value}`)
}

export function getSaltLevelOptions(t: Translate) {
  return [
    createOption('LIGHT', getSaltLevelLabel('LIGHT', t)),
    createOption('MEDIUM', getSaltLevelLabel('MEDIUM', t)),
    createOption('HEAVY', getSaltLevelLabel('HEAVY', t)),
  ] satisfies Array<{ value: SaltLevel, label: string }>
}
