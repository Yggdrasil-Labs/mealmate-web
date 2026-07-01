export type RecipeSourceType = 'MANUAL' | 'AI_GENERATED' | 'SYSTEM'

export type RecipeType = 'HOME_COOKING' | 'MAIN_DISH' | 'SIDE_DISH' | 'SOUP' | 'STAPLE' | 'SNACK' | 'DESSERT' | 'OTHER'

export type RecipeDifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD'

export type RecipeCrowdTag = 'GENERAL' | 'BABY' | 'WEIGHT_LOSS'

export type RecipeSeasonTag = 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER' | 'ALL_SEASON'

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

export interface RecipePageResult {
  list: RecipeSummary[]
  total: number
  pageNum: number
  pageSize: number
}

// ============= AI 菜品解析相关类型 =============

/** AI 解析会话状态 */
export type AiParseStatus = 'PARSING' | 'REFINING' | 'READY_TO_CONFIRM'

/** AI 对话消息 */
export interface AiChatMessage {
  role: 'user' | 'assistant'
  content: string
}

/** AI 解析返回的原始菜品数据（所有字段可空，渐进填充） */
export interface AiParsedRecipeData {
  name?: string | null
  recipeType?: string | null
  seasonTag?: string | null
  crowdTag?: string | null
  tasteTags?: string[] | null
  difficultyLevel?: string | null
  cookingTimeMin?: number | null
  babyFriendly?: boolean | null
  weightLossFriendly?: boolean | null
  ingredients?: Array<{
    ingredientName: string
    ingredientType?: string
    quantity?: number
    unit?: string
    mainIngredient?: boolean
  }> | null
  steps?: Array<{
    stepNo: number
    content: string
  }> | null
  nutritionFact?: {
    calories?: number
    protein?: number
    fat?: number
    carbohydrate?: number
  } | null
}

/** POST /api/ai/recipes/chat 请求体 */
export interface AiRecipeChatRequest {
  sessionId: string | null
  message: string
}

/** POST /api/ai/recipes/chat 响应 data */
export interface AiRecipeChatReply {
  sessionId: string
  reply: string
  parsed: AiParsedRecipeData | null
  status: AiParseStatus
  suggestions: string[]
}

/** POST /api/ai/recipes/confirm 请求体 */
export interface AiRecipeConfirmRequest {
  sessionId: string
  recipe: AiParsedRecipeData
}

/** POST /api/ai/recipes/confirm 响应 data */
export interface AiRecipeConfirmReply {
  recipeId: number
}
