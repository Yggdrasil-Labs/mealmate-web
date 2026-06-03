import type {
  RecipeCrowdTag,
  RecipeDifficultyLevel,
  RecipeFilters,
  RecipeSourceType,
  RecipeType,
} from './types'

type Translate = (key: string) => string

export const DEFAULT_RECIPE_PAGE_NUM = 1
export const DEFAULT_RECIPE_PAGE_SIZE = 12

function createOption<T extends string>(value: T, label: string) {
  return { value, label }
}

export function getRecipeSourceTypeLabel(value: RecipeSourceType, t: Translate) {
  return t(`recipe.enums.sourceType.${value}`)
}

export function getRecipeSourceTypeOptions(t: Translate) {
  return [
    createOption('MANUAL', getRecipeSourceTypeLabel('MANUAL', t)),
    createOption('AI_GENERATED', getRecipeSourceTypeLabel('AI_GENERATED', t)),
    createOption('SYSTEM', getRecipeSourceTypeLabel('SYSTEM', t)),
  ] satisfies Array<{ value: RecipeSourceType, label: string }>
}

export function getRecipeTypeLabel(value: RecipeType, t: Translate) {
  return t(`recipe.enums.recipeType.${value}`)
}

export function getRecipeTypeOptions(t: Translate) {
  return [
    createOption('HOME_COOKING', getRecipeTypeLabel('HOME_COOKING', t)),
    createOption('SOUP', getRecipeTypeLabel('SOUP', t)),
    createOption('STAPLE', getRecipeTypeLabel('STAPLE', t)),
    createOption('SNACK', getRecipeTypeLabel('SNACK', t)),
  ] satisfies Array<{ value: RecipeType, label: string }>
}

export function getRecipeDifficultyLabel(value: RecipeDifficultyLevel, t: Translate) {
  return t(`recipe.enums.difficultyLevel.${value}`)
}

export function getRecipeDifficultyOptions(t: Translate) {
  return [
    createOption('EASY', getRecipeDifficultyLabel('EASY', t)),
    createOption('MEDIUM', getRecipeDifficultyLabel('MEDIUM', t)),
    createOption('HARD', getRecipeDifficultyLabel('HARD', t)),
  ] satisfies Array<{ value: RecipeDifficultyLevel, label: string }>
}

export function getRecipeCrowdTagLabel(value: RecipeCrowdTag, t: Translate) {
  return t(`recipe.enums.crowdTag.${value}`)
}

export function getRecipeCrowdTagOptions(t: Translate) {
  return [
    createOption('GENERAL', getRecipeCrowdTagLabel('GENERAL', t)),
    createOption('BABY', getRecipeCrowdTagLabel('BABY', t)),
    createOption('WEIGHT_LOSS', getRecipeCrowdTagLabel('WEIGHT_LOSS', t)),
  ] satisfies Array<{ value: RecipeCrowdTag, label: string }>
}

export function createDefaultRecipeFilters(): RecipeFilters {
  return {
    keyword: '',
    recipeType: '',
    seasonTag: '',
    crowdTag: '',
    isBabyFriendly: undefined,
    isWeightLossFriendly: undefined,
    difficultyLevel: '',
    maxCookingTime: undefined,
    pageNum: DEFAULT_RECIPE_PAGE_NUM,
    pageSize: DEFAULT_RECIPE_PAGE_SIZE,
  }
}
