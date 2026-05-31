export type RecipeSourceType = 'MANUAL' | 'AI_GENERATED' | 'SYSTEM'

export type RecipeType = 'HOME_COOKING' | 'MAIN_DISH' | 'SIDE_DISH' | 'SOUP' | 'STAPLE' | 'SNACK' | 'DESSERT' | 'OTHER'

export type RecipeDifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD'

export type RecipeCrowdTag = 'FAMILY' | 'GENERAL' | 'CHILD_FRIENDLY' | 'ELDER_FRIENDLY' | 'BABY' | 'WEIGHT_LOSS' | 'PARTY'

export type RecipeSeasonTag = 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER' | 'ALL' | 'ALL_SEASON'

export type RecipeStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'ACTIVE'

export interface RecipeIngredientItem {
  ingredientId?: string
  ingredientName: string
  ingredientType: string
  quantity: string
  unit: string
  isMain: boolean
  sortNo: number
}

export interface RecipeStepItem {
  stepId?: string
  stepNo: number
  content: string
  imageUrl: string
}

export interface RecipeNutrition {
  calories: number | null
  protein: number | null
  fat: number | null
  carbohydrate: number | null
  fiber: number | null
  calcium: number | null
  sodium: number | null
}

export interface RecipeSummary {
  recipeId: string
  name: string
  recipeType: RecipeType
  sourceType: RecipeSourceType
  crowdTag: RecipeCrowdTag
  seasonTag: RecipeSeasonTag
  difficultyLevel: RecipeDifficultyLevel
  cookingTimeMin: number
  coverImageUrl: string
  isBabyFriendly: boolean
  isWeightLossFriendly: boolean
  status: RecipeStatus
}

export interface RecipeDetail extends RecipeSummary {
  tasteTags: string[]
  ingredients: RecipeIngredientItem[]
  steps: RecipeStepItem[]
  nutrition: RecipeNutrition
}

export interface RecipeFilters {
  keyword: string
  recipeType: RecipeType | ''
  seasonTag: RecipeSeasonTag | ''
  crowdTag: RecipeCrowdTag | ''
  isBabyFriendly?: boolean
  isWeightLossFriendly?: boolean
  difficultyLevel: RecipeDifficultyLevel | ''
  maxCookingTime?: number
  pageNum: number
  pageSize: number
}

export interface RecipeBaseFormValues {
  name: string
  recipeType: RecipeType | ''
  sourceType: RecipeSourceType
  crowdTag: RecipeCrowdTag | ''
  seasonTag: RecipeSeasonTag | ''
  difficultyLevel: RecipeDifficultyLevel | ''
  cookingTimeMin: number | null
  coverImageUrl: string
  isBabyFriendly: boolean
  isWeightLossFriendly: boolean
  status: RecipeStatus | ''
}

export interface RecipeFormValues extends RecipeBaseFormValues {
  tasteTags: string[]
  ingredients: RecipeIngredientItem[]
  steps: RecipeStepItem[]
  nutrition: RecipeNutrition
}

export interface CreateRecipePayload {
  name: string
  recipeType: RecipeType | ''
  crowdTag?: RecipeCrowdTag | ''
  seasonTag?: RecipeSeasonTag | ''
  difficultyLevel?: RecipeDifficultyLevel | ''
  cookingTimeMin?: number | null
  coverImageUrl?: string
  babyFriendly?: boolean
  weightLossFriendly?: boolean
  ingredients?: Array<{
    ingredientName: string
    ingredientType?: string
    quantity?: number
    unit?: string
    mainIngredient?: boolean
    sortNo?: number
  }>
}

export interface UpdateRecipePayload extends CreateRecipePayload {}

export type UpdateRecipeIngredientsPayload = RecipeIngredientItem[]

export type UpdateRecipeStepsPayload = RecipeStepItem[]

export type UpdateRecipeNutritionPayload = RecipeNutrition
