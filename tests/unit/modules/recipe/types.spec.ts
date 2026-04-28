import { describe, expect, it } from 'vitest'
import enRecipeMessages from '@/locales/en-US/recipe.json'
import zhRecipeMessages from '@/locales/zh-CN/recipe.json'
import {
  createDefaultRecipeFilters,
  getRecipeCrowdTagLabel,
  getRecipeCrowdTagOptions,
  getRecipeDifficultyLabel,
  getRecipeDifficultyOptions,
  getRecipeSourceTypeLabel,
  getRecipeSourceTypeOptions,
  getRecipeTypeLabel,
  getRecipeTypeOptions,
} from '@/modules/recipe/constants'

function createTranslator(messages: Record<string, any>) {
  return (key: string) => key.split('.').reduce<any>((current, segment) => current?.[segment], messages) ?? key
}

const tZh = createTranslator(zhRecipeMessages)
const tEn = createTranslator(enRecipeMessages)

describe('recipe module constants', () => {
  it('builds localized recipe source type options', () => {
    expect(getRecipeSourceTypeOptions(tZh)).toEqual([
      { label: '手动录入', value: 'MANUAL' },
      { label: 'AI 生成', value: 'AI_GENERATED' },
      { label: '系统预置', value: 'SYSTEM' },
    ])

    expect(getRecipeSourceTypeLabel('AI_GENERATED', tEn)).toBe('AI Generated')
  })

  it('builds localized recipe type options', () => {
    expect(getRecipeTypeOptions(tZh)).toEqual([
      { label: '家常菜', value: 'HOME_COOKING' },
      { label: '汤羹', value: 'SOUP' },
      { label: '主食', value: 'STAPLE' },
      { label: '小吃', value: 'SNACK' },
    ])

    expect(getRecipeTypeLabel('SOUP', tEn)).toBe('Soup')
  })

  it('builds localized difficulty options', () => {
    expect(getRecipeDifficultyOptions(tZh)).toEqual([
      { label: '简单', value: 'EASY' },
      { label: '中等', value: 'MEDIUM' },
      { label: '困难', value: 'HARD' },
    ])

    expect(getRecipeDifficultyLabel('HARD', tEn)).toBe('Hard')
  })

  it('builds localized crowd-tag options', () => {
    expect(getRecipeCrowdTagOptions(tZh)).toEqual([
      { label: '家庭', value: 'FAMILY' },
      { label: '儿童友好', value: 'CHILD_FRIENDLY' },
      { label: '老人友好', value: 'ELDER_FRIENDLY' },
      { label: '聚会', value: 'PARTY' },
    ])

    expect(getRecipeCrowdTagLabel('ELDER_FRIENDLY', tEn)).toBe('Elder Friendly')
  })

  it('creates stable default recipe filters', () => {
    expect(createDefaultRecipeFilters()).toEqual({
      keyword: '',
      recipeType: '',
      seasonTag: '',
      crowdTag: '',
      isBabyFriendly: undefined,
      isWeightLossFriendly: undefined,
      difficultyLevel: '',
      maxCookingTime: undefined,
      pageNum: 1,
      pageSize: 12,
    })
  })
})
