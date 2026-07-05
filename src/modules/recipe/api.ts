import type {
  AiRecipeChatReply,
  AiRecipeChatRequest,
  AiRecipeConfirmReply,
  AiRecipeConfirmRequest,
  CreateRecipePayload,
  RecipeDetail,
  RecipeFilters,
  RecipeIngredientItem,
  RecipeNutrition,
  RecipePageResult,
  RecipeStepItem,
  RecipeSummary,
  UpdateRecipePayload,
} from './types'
import http from '@/utils/api/http'

// ============= AI 菜品解析 API =============

interface RecipeApiEnvelope<T> {
  data?: T
}

/** COLA PageResponse 对应的前端类型 */
interface PaginatedApiResponse<T> {
  success: boolean
  data?: T[]
  totalCount?: number
  pageSize?: number
  pageIndex?: number
}

interface RecipeSummaryDto {
  recipeId?: string | number
  id?: string | number
  name: string
  recipeType: RecipeSummary['recipeType']
  sourceType: RecipeSummary['sourceType']
  crowdTag: RecipeSummary['crowdTag']
  seasonTag: RecipeSummary['seasonTag']
  difficultyLevel: RecipeSummary['difficultyLevel']
  cookingTimeMin: number
  coverImageUrl?: string | null
  isBabyFriendly?: boolean | null
  babyFriendly?: boolean | null
  isWeightLossFriendly?: boolean | null
  weightLossFriendly?: boolean | null
  status: RecipeSummary['status']
}

interface RecipeDetailDto extends RecipeSummaryDto {
  tasteTags?: string[]
  ingredients?: RecipeIngredientItem[]
  steps?: RecipeStepItem[]
  nutrition?: RecipeNutrition | null
}

async function unwrapResponseData<T>(request: Promise<unknown>): Promise<T> {
  const response = await request as RecipeApiEnvelope<T>
  if (response.data !== undefined)
    return response.data as T
  throw new Error('[recipe api] API returned empty data payload.')
}

function mapRecipeSummaryFromApi(summary: RecipeSummaryDto): RecipeSummary {
  return {
    recipeId: String(summary.recipeId ?? summary.id),
    name: summary.name,
    recipeType: summary.recipeType,
    sourceType: summary.sourceType,
    crowdTag: summary.crowdTag,
    seasonTag: summary.seasonTag,
    difficultyLevel: summary.difficultyLevel,
    cookingTimeMin: summary.cookingTimeMin,
    coverImageUrl: summary.coverImageUrl ?? '',
    isBabyFriendly: summary.isBabyFriendly ?? summary.babyFriendly ?? false,
    isWeightLossFriendly: summary.isWeightLossFriendly ?? summary.weightLossFriendly ?? false,
    status: summary.status,
  }
}

function mapRecipeDetailFromApi(detail: RecipeDetailDto): RecipeDetail {
  return {
    ...mapRecipeSummaryFromApi(detail),
    tasteTags: detail.tasteTags ?? [],
    ingredients: detail.ingredients ?? [],
    steps: detail.steps ?? [],
    nutrition: detail.nutrition ?? {
      calories: null,
      protein: null,
      fat: null,
      carbohydrate: null,
      fiber: null,
      calcium: null,
      sodium: null,
    },
  }
}

export async function fetchRecipePage(filters: RecipeFilters): Promise<RecipePageResult> {
  const params: Record<string, unknown> = {}
  if (filters.keyword)
    params.keyword = filters.keyword
  if (filters.recipeType)
    params.recipeType = filters.recipeType
  if (filters.seasonTag)
    params.seasonTag = filters.seasonTag
  if (filters.crowdTag)
    params.crowdTag = filters.crowdTag
  if (filters.isBabyFriendly !== undefined)
    params.isBabyFriendly = filters.isBabyFriendly
  if (filters.isWeightLossFriendly !== undefined)
    params.isWeightLossFriendly = filters.isWeightLossFriendly
  if (filters.difficultyLevel)
    params.difficultyLevel = filters.difficultyLevel
  if (filters.maxCookingTime)
    params.maxCookingTime = filters.maxCookingTime
  params.pageNum = filters.pageNum
  params.pageSize = filters.pageSize

  const response = await http.get<RecipeSummaryDto[]>('/api/recipes', params)
  const body = response as unknown as PaginatedApiResponse<RecipeSummaryDto>

  return {
    list: (body.data ?? []).map(mapRecipeSummaryFromApi),
    total: body.totalCount ?? 0,
    pageNum: body.pageIndex ?? 1,
    pageSize: body.pageSize ?? filters.pageSize,
  }
}

export async function fetchRecipeDetail(recipeId: string): Promise<RecipeDetail> {
  const detail = await unwrapResponseData<RecipeDetailDto>(http.get(`/api/recipes/${recipeId}`))
  return mapRecipeDetailFromApi(detail)
}

export async function createRecipe(payload: CreateRecipePayload): Promise<RecipeDetail> {
  const detail = await unwrapResponseData<RecipeDetailDto>(
    http.post('/api/recipes', payload),
  )
  return mapRecipeDetailFromApi(detail)
}

export async function updateRecipe(recipeId: string, payload: UpdateRecipePayload): Promise<RecipeDetail> {
  const detail = await unwrapResponseData<RecipeDetailDto>(
    http.put(`/api/recipes/${recipeId}`, payload),
  )
  return mapRecipeDetailFromApi(detail)
}

export async function updateRecipeIngredients(recipeId: string, ingredients: RecipeIngredientItem[]): Promise<RecipeIngredientItem[]> {
  await http.put(`/api/recipes/${recipeId}/ingredients`, ingredients)
  return structuredClone(ingredients)
}

export async function updateRecipeSteps(recipeId: string, steps: RecipeStepItem[]): Promise<RecipeStepItem[]> {
  await http.put(`/api/recipes/${recipeId}/steps`, steps)
  return structuredClone(steps)
}

export async function updateRecipeNutrition(recipeId: string, nutrition: RecipeNutrition): Promise<RecipeNutrition> {
  await http.put(`/api/recipes/${recipeId}/nutrition`, nutrition)
  return structuredClone(nutrition)
}

export async function deleteRecipe(recipeId: string): Promise<void> {
  await http.delete(`/api/recipes/${recipeId}`)
}

export async function uploadRecipeStepImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  const response = await http.post<{ url: string }>('/api/recipes/step-image', formData)
  return (response as any).data?.url ?? ''
}

/** AI 对话式解析菜品 */
export async function aiRecipeChat(cmd: AiRecipeChatRequest): Promise<AiRecipeChatReply> {
  return unwrapResponseData<AiRecipeChatReply>(
    http.post('/api/ai/recipes/chat', cmd),
  )
}

/** AI 确认菜品入库 */
export async function aiRecipeConfirm(cmd: AiRecipeConfirmRequest): Promise<AiRecipeConfirmReply> {
  return unwrapResponseData<AiRecipeConfirmReply>(
    http.post('/api/ai/recipes/confirm', cmd),
  )
}
