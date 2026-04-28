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

export interface RecipePageResult {
  list: RecipeSummary[]
  total: number
  pageNum: number
  pageSize: number
}

function createEmptyNutrition(): RecipeNutrition {
  return {
    calories: null,
    protein: null,
    fat: null,
    carbohydrate: null,
    fiber: null,
    calcium: null,
    sodium: null,
  }
}

function createRecipeSummary(detail: RecipeDetail): RecipeSummary {
  return {
    recipeId: detail.recipeId,
    name: detail.name,
    recipeType: detail.recipeType,
    sourceType: detail.sourceType,
    crowdTag: detail.crowdTag,
    seasonTag: detail.seasonTag,
    difficultyLevel: detail.difficultyLevel,
    cookingTimeMin: detail.cookingTimeMin,
    coverImageUrl: detail.coverImageUrl,
    isBabyFriendly: detail.isBabyFriendly,
    isWeightLossFriendly: detail.isWeightLossFriendly,
    status: detail.status,
  }
}

function cloneIngredients(items: RecipeIngredientItem[]): RecipeIngredientItem[] {
  return structuredClone(items)
}

function cloneSteps(items: RecipeStepItem[]): RecipeStepItem[] {
  return structuredClone(items)
}

function cloneNutrition(nutrition: RecipeNutrition): RecipeNutrition {
  return structuredClone(nutrition)
}

function cloneDetail(detail: RecipeDetail): RecipeDetail {
  return {
    ...detail,
    tasteTags: [...detail.tasteTags],
    ingredients: cloneIngredients(detail.ingredients),
    steps: cloneSteps(detail.steps),
    nutrition: cloneNutrition(detail.nutrition),
  }
}

function createInitialRecipeDetails(): RecipeDetail[] {
  return [
    {
      recipeId: 'recipe-manual-braised-beef',
      name: '番茄牛腩煲',
      recipeType: 'HOME_COOKING',
      sourceType: 'MANUAL',
      crowdTag: 'FAMILY',
      seasonTag: 'AUTUMN',
      difficultyLevel: 'MEDIUM',
      cookingTimeMin: 60,
      coverImageUrl: '',
      isBabyFriendly: false,
      isWeightLossFriendly: false,
      status: 'PUBLISHED',
      tasteTags: ['酸香', '下饭'],
      ingredients: [
        {
          ingredientId: 'ingredient-beef',
          ingredientName: '牛腩',
          ingredientType: 'protein',
          quantity: '500',
          unit: 'g',
          isMain: true,
          sortNo: 1,
        },
        {
          ingredientId: 'ingredient-tomato',
          ingredientName: '番茄',
          ingredientType: 'vegetable',
          quantity: '3',
          unit: '个',
          isMain: true,
          sortNo: 2,
        },
      ],
      steps: [
        {
          stepId: 'step-beef-1',
          stepNo: 1,
          content: '牛腩焯水备用。',
          imageUrl: '',
        },
        {
          stepId: 'step-beef-2',
          stepNo: 2,
          content: '与番茄一起炖煮 40 分钟。',
          imageUrl: '',
        },
      ],
      nutrition: {
        calories: 420,
        protein: 28,
        fat: 22,
        carbohydrate: 18,
        fiber: 4,
        calcium: 56,
        sodium: 380,
      },
    },
    {
      recipeId: 'recipe-manual-pumpkin-porridge',
      name: '南瓜小米粥',
      recipeType: 'SOUP',
      sourceType: 'MANUAL',
      crowdTag: 'CHILD_FRIENDLY',
      seasonTag: 'AUTUMN',
      difficultyLevel: 'EASY',
      cookingTimeMin: 35,
      coverImageUrl: '',
      isBabyFriendly: true,
      isWeightLossFriendly: false,
      status: 'PUBLISHED',
      tasteTags: ['软糯', '清甜'],
      ingredients: [
        {
          ingredientId: 'ingredient-pumpkin',
          ingredientName: '南瓜',
          ingredientType: 'vegetable',
          quantity: '200',
          unit: 'g',
          isMain: true,
          sortNo: 1,
        },
      ],
      steps: [
        {
          stepId: 'step-porridge-1',
          stepNo: 1,
          content: '小米与南瓜同煮至软烂。',
          imageUrl: '',
        },
      ],
      nutrition: {
        calories: 180,
        protein: 5,
        fat: 2,
        carbohydrate: 34,
        fiber: 3,
        calcium: 28,
        sodium: 40,
      },
    },
    {
      recipeId: 'recipe-ai-chicken-bento',
      name: '香煎鸡胸便当',
      recipeType: 'STAPLE',
      sourceType: 'AI_GENERATED',
      crowdTag: 'FAMILY',
      seasonTag: 'ALL',
      difficultyLevel: 'EASY',
      cookingTimeMin: 25,
      coverImageUrl: '',
      isBabyFriendly: false,
      isWeightLossFriendly: true,
      status: 'PUBLISHED',
      tasteTags: ['高蛋白', '便当'],
      ingredients: [
        {
          ingredientId: 'ingredient-chicken',
          ingredientName: '鸡胸肉',
          ingredientType: 'protein',
          quantity: '180',
          unit: 'g',
          isMain: true,
          sortNo: 1,
        },
      ],
      steps: [
        {
          stepId: 'step-bento-1',
          stepNo: 1,
          content: '鸡胸肉调味后煎熟。',
          imageUrl: '',
        },
      ],
      nutrition: {
        calories: 310,
        protein: 30,
        fat: 10,
        carbohydrate: 22,
        fiber: 4,
        calcium: 44,
        sodium: 350,
      },
    },
    {
      recipeId: 'recipe-system-cod',
      name: '清蒸鳕鱼',
      recipeType: 'HOME_COOKING',
      sourceType: 'SYSTEM',
      crowdTag: 'ELDER_FRIENDLY',
      seasonTag: 'SPRING',
      difficultyLevel: 'EASY',
      cookingTimeMin: 20,
      coverImageUrl: '',
      isBabyFriendly: true,
      isWeightLossFriendly: true,
      status: 'PUBLISHED',
      tasteTags: ['清淡', '鲜嫩'],
      ingredients: [
        {
          ingredientId: 'ingredient-cod',
          ingredientName: '鳕鱼',
          ingredientType: 'protein',
          quantity: '220',
          unit: 'g',
          isMain: true,
          sortNo: 1,
        },
      ],
      steps: [
        {
          stepId: 'step-cod-1',
          stepNo: 1,
          content: '鳕鱼蒸 8 分钟后调味。',
          imageUrl: '',
        },
      ],
      nutrition: {
        calories: 240,
        protein: 26,
        fat: 9,
        carbohydrate: 8,
        fiber: 1,
        calcium: 36,
        sodium: 180,
      },
    },
  ]
}

let recipeDetailState = createInitialRecipeDetails()

function findRecipeDetail(recipeId: string) {
  const detail = recipeDetailState.find(recipe => recipe.recipeId === recipeId)
  if (!detail)
    throw new Error(`Recipe not found: ${recipeId}`)
  return detail
}

function ensureEditable(detail: RecipeDetail) {
  if (detail.sourceType === 'SYSTEM')
    throw new Error('System recipes are read-only.')
}

function ensureDeletable(detail: RecipeDetail) {
  if (detail.sourceType !== 'MANUAL')
    throw new Error('Only manual recipes can be deleted.')
}

function filterRecipes(detail: RecipeDetail, filters: RecipeFilters) {
  const normalizedKeyword = filters.keyword.trim().toLowerCase()
  if (normalizedKeyword && !detail.name.toLowerCase().includes(normalizedKeyword))
    return false

  if (filters.recipeType && detail.recipeType !== filters.recipeType)
    return false
  if (filters.seasonTag && detail.seasonTag !== filters.seasonTag)
    return false
  if (filters.crowdTag && detail.crowdTag !== filters.crowdTag)
    return false
  if (filters.difficultyLevel && detail.difficultyLevel !== filters.difficultyLevel)
    return false
  if (typeof filters.isBabyFriendly === 'boolean' && detail.isBabyFriendly !== filters.isBabyFriendly)
    return false
  if (typeof filters.isWeightLossFriendly === 'boolean' && detail.isWeightLossFriendly !== filters.isWeightLossFriendly)
    return false
  if (typeof filters.maxCookingTime === 'number' && detail.cookingTimeMin > filters.maxCookingTime)
    return false

  return true
}

export function resetRecipeMockData() {
  recipeDetailState = createInitialRecipeDetails()
}

export async function mockFetchRecipePage(filters: RecipeFilters): Promise<RecipePageResult> {
  const filtered = recipeDetailState
    .filter(detail => filterRecipes(detail, filters))
    .map(createRecipeSummary)

  const startIndex = (filters.pageNum - 1) * filters.pageSize
  const endIndex = startIndex + filters.pageSize

  return {
    list: filtered.slice(startIndex, endIndex),
    total: filtered.length,
    pageNum: filters.pageNum,
    pageSize: filters.pageSize,
  }
}

export async function mockFetchRecipeDetail(recipeId: string): Promise<RecipeDetail> {
  return cloneDetail(findRecipeDetail(recipeId))
}

export async function mockCreateRecipe(payload: CreateRecipePayload): Promise<RecipeDetail> {
  const created: RecipeDetail = {
    ...payload,
    recipeId: `recipe-${crypto.randomUUID()}`,
    sourceType: 'MANUAL',
    tasteTags: [],
    ingredients: [],
    steps: [],
    nutrition: createEmptyNutrition(),
  }

  recipeDetailState = [...recipeDetailState, created]
  return cloneDetail(created)
}

export async function mockUpdateRecipe(recipeId: string, payload: UpdateRecipePayload): Promise<RecipeDetail> {
  const detail = findRecipeDetail(recipeId)
  ensureEditable(detail)
  Object.assign(detail, payload)
  return cloneDetail(detail)
}

export async function mockUpdateRecipeIngredients(recipeId: string, ingredients: RecipeIngredientItem[]): Promise<RecipeIngredientItem[]> {
  const detail = findRecipeDetail(recipeId)
  ensureEditable(detail)
  detail.ingredients = cloneIngredients(ingredients)
  return cloneIngredients(detail.ingredients)
}

export async function mockUpdateRecipeSteps(recipeId: string, steps: RecipeStepItem[]): Promise<RecipeStepItem[]> {
  const detail = findRecipeDetail(recipeId)
  ensureEditable(detail)
  detail.steps = cloneSteps(steps)
  return cloneSteps(detail.steps)
}

export async function mockUpdateRecipeNutrition(recipeId: string, nutrition: RecipeNutrition): Promise<RecipeNutrition> {
  const detail = findRecipeDetail(recipeId)
  ensureEditable(detail)
  detail.nutrition = cloneNutrition(nutrition)
  return cloneNutrition(detail.nutrition)
}

export async function mockDeleteRecipe(recipeId: string): Promise<void> {
  const detail = findRecipeDetail(recipeId)
  ensureDeletable(detail)
  recipeDetailState = recipeDetailState.filter(recipe => recipe.recipeId !== recipeId)
}

export async function mockUploadRecipeStepImage(file: File): Promise<string> {
  const fileName = file.name || 'recipe-step.png'
  return `https://mock.mealmate.local/uploads/${crypto.randomUUID()}-${fileName}`
}
