import { describe, expect, it } from 'vitest'
import enFamilyMessages from '@/locales/en-US/family.json'
import zhFamilyMessages from '@/locales/zh-CN/family.json'
import {
  getFamilyRoleTypeLabel,
  getFamilyRoleTypeOptions,
  getFamilyTargetTypeLabel,
  getFamilyTargetTypeOptions,
  getOilLevelLabel,
  getOilLevelOptions,
  getSaltLevelLabel,
  getSaltLevelOptions,
  getSpicyLevelLabel,
  getSpicyLevelOptions,
  getSweetLevelLabel,
  getSweetLevelOptions,
} from '@/modules/family/constants'

function createTranslator(messages: Record<string, any>) {
  return (key: string) => {
    return key.split('.').reduce<any>((current, segment) => current?.[segment], messages) ?? key
  }
}

const tZh = createTranslator(zhFamilyMessages)
const tEn = createTranslator(enFamilyMessages)

describe('family module constants', () => {
  it('builds localized family role type options', () => {
    expect(getFamilyRoleTypeOptions(tZh)).toEqual([
      { label: '本人', value: 'SELF' },
      { label: '配偶', value: 'SPOUSE' },
      { label: '儿童', value: 'CHILD' },
      { label: '宝宝', value: 'BABY' },
      { label: '老人', value: 'ELDER' },
      { label: '其他成员', value: 'OTHER' },
    ])

    expect(getFamilyRoleTypeLabel('BABY', tEn)).toBe('Baby')
  })

  it('builds localized family target type options', () => {
    expect(getFamilyTargetTypeOptions(tZh)).toEqual([
      { label: '均衡饮食', value: 'BALANCED' },
      { label: '减脂控卡', value: 'FAT_LOSS' },
      { label: '增肌补能', value: 'MUSCLE_GAIN' },
      { label: '宝宝适配', value: 'BABY_FRIENDLY' },
    ])

    expect(getFamilyTargetTypeLabel('FAT_LOSS', tEn)).toBe('Fat Loss')
  })

  it('builds localized spicy, sweet, oil, and salt level options', () => {
    expect(getSpicyLevelOptions(tZh)).toEqual([
      { label: '不辣', value: 'NONE' },
      { label: '微辣', value: 'LIGHT' },
      { label: '中辣', value: 'MEDIUM' },
      { label: '重辣', value: 'HEAVY' },
    ])
    expect(getSweetLevelOptions(tZh)).toEqual([
      { label: '无糖', value: 'NONE' },
      { label: '微甜', value: 'LIGHT' },
      { label: '适中', value: 'MEDIUM' },
      { label: '偏甜', value: 'HEAVY' },
    ])
    expect(getOilLevelOptions(tZh)).toEqual([
      { label: '少油', value: 'LIGHT' },
      { label: '适中', value: 'MEDIUM' },
      { label: '偏油', value: 'HEAVY' },
    ])
    expect(getSaltLevelOptions(tZh)).toEqual([
      { label: '少盐', value: 'LIGHT' },
      { label: '适中', value: 'MEDIUM' },
      { label: '偏咸', value: 'HEAVY' },
    ])
  })

  it('reads display labels from different locale resources', () => {
    expect(getSpicyLevelLabel('NONE', tEn)).toBe('No Spice')
    expect(getSweetLevelLabel('LIGHT', tEn)).toBe('Light')
    expect(getOilLevelLabel('MEDIUM', tZh)).toBe('适中')
    expect(getSaltLevelLabel('HEAVY', tEn)).toBe('Salty')
  })
})
