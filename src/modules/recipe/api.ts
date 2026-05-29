import type { RecipePageResult } from './mock'
import type {
  CreateRecipePayload,
  RecipeDetail,
  RecipeFilters,
  RecipeIngredientItem,
  RecipeNutrition,
  RecipeStepItem,
  RecipeSummary,
  UpdateRecipePayload,
} from './types'
import { env } from '@/config/env'
import http from '@/utils/api/http'
import {
  mockCreateRecipe,
  mockDeleteRecipe,
  mockFetchRecipeDetail,
  mockFetchRecipePage,
  mockUpdateRecipe,
  mockUpdateRecipeIngredients,
  mockUpdateRecipeNutrition,
  mockUpdateRecipeSteps,
  mockUploadRecipeStepImage,
} from './mock'

const USE_RECIPE_MOCK = env.USE_MOCK

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

const recipeRealModeAssumptions = {
  updateRecipeSteps: 'Recipe step update backend contract is not frozen yet.',
  uploadRecipeStepImage: 'Recipe step image upload backend contract is not frozen yet.',
} as const

function createAdapterAssumptionError(message: string) {
  return new Error(`[recipe api assumption] ${message}`)
}

function assertResolvedRealMode<K extends keyof typeof recipeRealModeAssumptions>(key: K): never {
  throw createAdapterAssumptionError(recipeRealModeAssumptions[key])
}

async function unwrapResponseData<T>(request: Promise<unknown>): Promise<T> {
  const response = await request as RecipeApiEnvelope<RecipeApiEnvelope<T> | T>
  const payload = response.data

  if (payload && typeof payload === 'object' && 'data' in payload)
    return (payload as RecipeApiEnvelope<T>).data as T

  if (payload !== undefined)
    return payload as T

  throw createAdapterAssumptionError('Recipe API returned empty data payload.')
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
  if (USE_RECIPE_MOCK)
    return mockFetchRecipePage(filters)

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
  const body = (response as unknown as { data: PaginatedApiResponse<RecipeSummaryDto> }).data ?? response as unknown as PaginatedApiResponse<RecipeSummaryDto>

  return {
    list: (body.data ?? []).map(mapRecipeSummaryFromApi),
    total: body.totalCount ?? 0,
    pageNum: body.pageIndex ?? 1,
    pageSize: body.pageSize ?? filters.pageSize,
  }
}

export async function fetchRecipeDetail(recipeId: string): Promise<RecipeDetail> {
  if (USE_RECIPE_MOCK)
    return mockFetchRecipeDetail(recipeId)

  const detail = await unwrapResponseData<RecipeDetailDto>(http.get(`/api/recipes/${recipeId}`))
  return mapRecipeDetailFromApi(detail)
}

export async function createRecipe(payload: CreateRecipePayload): Promise<RecipeDetail> {
  if (USE_RECIPE_MOCK)
    return mockCreateRecipe(payload)

  const detail = await unwrapResponseData<RecipeDetailDto>(
    http.post('/api/recipes', payload),
  )

  return mapRecipeDetailFromApi(detail)
}

export async function updateRecipe(recipeId: string, payload: UpdateRecipePayload): Promise<RecipeDetail> {
  if (USE_RECIPE_MOCK)
    return mockUpdateRecipe(recipeId, payload)

  const detail = await unwrapResponseData<RecipeDetailDto>(
    http.put(`/api/recipes/${recipeId}`, payload),
  )

  return mapRecipeDetailFromApi(detail)
}

export async function updateRecipeIngredients(recipeId: string, ingredients: RecipeIngredientItem[]): Promise<RecipeIngredientItem[]> {
  if (USE_RECIPE_MOCK)
    return mockUpdateRecipeIngredients(recipeId, ingredients)

  await http.put(`/api/recipes/${recipeId}/ingredients`, ingredients)
  return structuredClone(ingredients)
}

export async function updateRecipeSteps(recipeId: string, steps: RecipeStepItem[]): Promise<RecipeStepItem[]> {
  if (USE_RECIPE_MOCK)
    return mockUpdateRecipeSteps(recipeId, steps)

  void recipeId
  void steps
  assertResolvedRealMode('updateRecipeSteps')
}

export async function updateRecipeNutrition(recipeId: string, nutrition: RecipeNutrition): Promise<RecipeNutrition> {
  if (USE_RECIPE_MOCK)
    return mockUpdateRecipeNutrition(recipeId, nutrition)

  await http.put(`/api/recipes/${recipeId}/nutrition`, nutrition)
  return structuredClone(nutrition)
}

export async function deleteRecipe(recipeId: string): Promise<void> {
  if (USE_RECIPE_MOCK)
    return mockDeleteRecipe(recipeId)

  await http.delete(`/api/recipes/${recipeId}`)
}

export async function uploadRecipeStepImage(file: File): Promise<string> {
  if (USE_RECIPE_MOCK)
    return mockUploadRecipeStepImage(file)

  void file
  assertResolvedRealMode('uploadRecipeStepImage')
}
