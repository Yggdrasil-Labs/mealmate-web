import type { LocationQueryRaw } from 'vue-router'
import type {
  RecipeCrowdTag,
  RecipeDifficultyLevel,
  RecipeFilters,
  RecipeSeasonTag,
  RecipeSummary,
  RecipeType,
} from '../types'
import type { SearchBarSearchPayload, SearchFieldSchema, SearchRouteQuery } from '@/types/search-bar'
import { computed, getCurrentInstance, onBeforeUnmount, reactive, shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { deserializeSearchValues } from '@/components/search-bar/search-bar.utils'
import { fetchRecipePage } from '../api'
import {
  createDefaultRecipeFilters,
  getRecipeCrowdTagLabel,
  getRecipeDifficultyLabel,
  getRecipeTypeLabel,
} from '../constants'

const FILTER_DEBOUNCE_MS = 300

type RecipeFilterValues = Omit<RecipeFilters, 'pageNum' | 'pageSize'>
type RecipeListSearchPayload = Pick<SearchBarSearchPayload, 'rawValues'>

export interface UseRecipeListOptions {
  routeQuery?: SearchRouteQuery
  replaceRouteQuery?: (query: LocationQueryRaw) => Promise<unknown> | unknown
}

function label(key: string) {
  return key
}

function getSeasonTagLabel(value: RecipeSeasonTag) {
  const labels: Record<RecipeSeasonTag, string> = {
    SPRING: '春季',
    SUMMER: '夏季',
    AUTUMN: '秋季',
    WINTER: '冬季',
    ALL_SEASON: '四季',
  }
  return labels[value]
}

function createOption<T>(value: T, optionLabel: string) {
  return { value, label: optionLabel }
}

function parsePositiveInteger(value: unknown, fallback: number) {
  const rawValue = Array.isArray(value) ? value[0] : value
  const parsed = Number(rawValue)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

function parseBooleanQueryValue(value: unknown) {
  const rawValue = Array.isArray(value) ? value[0] : value
  if (rawValue === true || rawValue === 'true')
    return true
  if (rawValue === false || rawValue === 'false')
    return false
  return undefined
}

function parseNumberQueryValue(value: unknown) {
  const rawValue = Array.isArray(value) ? value[0] : value
  if (rawValue === '' || rawValue == null)
    return undefined

  const parsed = Number(rawValue)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

function createBooleanTransform(field: keyof RecipeFilterValues) {
  // SearchBar route sync only deals in query strings; list filters keep booleans for API calls.
  return {
    serialize(value: unknown) {
      return typeof value === 'boolean' ? String(value) : undefined
    },
    deserialize(query: SearchRouteQuery) {
      return parseBooleanQueryValue(query[field])
    },
  }
}

function createNumberTransform(field: keyof RecipeFilterValues) {
  // Numeric route values are accepted only when they can safely round-trip into filter state.
  return {
    serialize(value: unknown) {
      return typeof value === 'number' && Number.isFinite(value) && value > 0
        ? String(value)
        : undefined
    },
    deserialize(query: SearchRouteQuery) {
      return parseNumberQueryValue(query[field])
    },
  }
}

export const recipeSearchSchema: SearchFieldSchema[] = [
  {
    meta: {
      field: 'keyword',
      label: '关键词',
      valueType: 'string',
      defaultValue: '',
    },
    ui: {
      component: 'Input',
      props: { placeholder: '搜索菜品名称', clearable: true },
      layout: { group: 'basic', span: 8 },
    },
  },
  {
    meta: {
      field: 'recipeType',
      label: '类型',
      valueType: 'string',
      defaultValue: '',
    },
    ui: {
      component: 'Select',
      props: { placeholder: '全部类型', clearable: true },
      layout: { group: 'basic', span: 8 },
      options: [
        createOption('', '全部类型'),
        ...(['HOME_COOKING', 'SOUP', 'STAPLE', 'SNACK'] as RecipeType[])
          .map(value => createOption(value, getRecipeTypeLabel(value, label))),
      ],
    },
  },
  {
    meta: {
      field: 'seasonTag',
      label: '季节',
      valueType: 'string',
      defaultValue: '',
    },
    ui: {
      component: 'Select',
      props: { placeholder: '全部季节', clearable: true },
      layout: { group: 'basic', span: 8 },
      options: [
        createOption('', '全部季节'),
        ...(['SPRING', 'SUMMER', 'AUTUMN', 'WINTER', 'ALL_SEASON'] as RecipeSeasonTag[])
          .map(value => createOption(value, getSeasonTagLabel(value))),
      ],
    },
  },
  {
    meta: {
      field: 'crowdTag',
      label: '人群',
      valueType: 'string',
      defaultValue: '',
    },
    ui: {
      component: 'Select',
      props: { placeholder: '全部人群', clearable: true },
      layout: { group: 'advanced', span: 8 },
      options: [
        createOption('', '全部人群'),
        ...(['GENERAL', 'BABY', 'WEIGHT_LOSS'] as RecipeCrowdTag[])
          .map(value => createOption(value, getRecipeCrowdTagLabel(value, label))),
      ],
    },
  },
  {
    meta: {
      field: 'isBabyFriendly',
      label: '宝宝友好',
      valueType: 'boolean',
    },
    ui: {
      component: 'Select',
      props: { placeholder: '不限', clearable: true },
      layout: { group: 'advanced', span: 8 },
      options: [
        createOption('', '不限'),
        createOption(true, '是'),
        createOption(false, '否'),
      ],
    },
    runtime: {
      transform: createBooleanTransform('isBabyFriendly'),
    },
  },
  {
    meta: {
      field: 'isWeightLossFriendly',
      label: '控脂友好',
      valueType: 'boolean',
    },
    ui: {
      component: 'Select',
      props: { placeholder: '不限', clearable: true },
      layout: { group: 'advanced', span: 8 },
      options: [
        createOption('', '不限'),
        createOption(true, '是'),
        createOption(false, '否'),
      ],
    },
    runtime: {
      transform: createBooleanTransform('isWeightLossFriendly'),
    },
  },
  {
    meta: {
      field: 'difficultyLevel',
      label: '难度',
      valueType: 'string',
      defaultValue: '',
    },
    ui: {
      component: 'Select',
      props: { placeholder: '全部难度', clearable: true },
      layout: { group: 'advanced', span: 8 },
      options: [
        createOption('', '全部难度'),
        ...(['EASY', 'MEDIUM', 'HARD'] as RecipeDifficultyLevel[])
          .map(value => createOption(value, getRecipeDifficultyLabel(value, label))),
      ],
    },
  },
  {
    meta: {
      field: 'maxCookingTime',
      label: '最长耗时',
      valueType: 'number',
    },
    ui: {
      component: 'InputNumber',
      props: { min: 1, max: 240, controlsPosition: 'right', placeholder: '分钟' },
      layout: { group: 'advanced', span: 8 },
    },
    runtime: {
      transform: createNumberTransform('maxCookingTime'),
    },
  },
]

function createFiltersFromRoute(query: SearchRouteQuery): RecipeFilters {
  const defaults = createDefaultRecipeFilters()
  const routeFilters = deserializeSearchValues(recipeSearchSchema, query, {}) as Partial<RecipeFilterValues>

  // 分页不是 SearchBar 字段，必须在列表 composable 中单独从 route query 恢复。
  const pageNum = parsePositiveInteger(query.pageNum, defaults.pageNum)
  const pageSize = parsePositiveInteger(query.pageSize, defaults.pageSize)

  return {
    ...defaults,
    ...routeFilters,
    pageNum,
    pageSize,
  }
}

function createFilterValues(filters: RecipeFilters): RecipeFilterValues {
  return {
    keyword: filters.keyword,
    recipeType: filters.recipeType,
    seasonTag: filters.seasonTag,
    crowdTag: filters.crowdTag,
    isBabyFriendly: filters.isBabyFriendly,
    isWeightLossFriendly: filters.isWeightLossFriendly,
    difficultyLevel: filters.difficultyLevel,
    maxCookingTime: filters.maxCookingTime,
  }
}

function applyFilters(target: RecipeFilters, source: Partial<RecipeFilters>) {
  Object.assign(target, {
    ...target,
    ...source,
  })
}

function normalizeFilterValues(values: Record<string, unknown>): Partial<RecipeFilters> {
  return {
    keyword: typeof values.keyword === 'string' ? values.keyword : '',
    recipeType: (values.recipeType ?? '') as RecipeFilters['recipeType'],
    seasonTag: (values.seasonTag ?? '') as RecipeFilters['seasonTag'],
    crowdTag: (values.crowdTag ?? '') as RecipeFilters['crowdTag'],
    isBabyFriendly: typeof values.isBabyFriendly === 'boolean' ? values.isBabyFriendly : undefined,
    isWeightLossFriendly: typeof values.isWeightLossFriendly === 'boolean' ? values.isWeightLossFriendly : undefined,
    difficultyLevel: (values.difficultyLevel ?? '') as RecipeFilters['difficultyLevel'],
    maxCookingTime: typeof values.maxCookingTime === 'number' ? values.maxCookingTime : undefined,
  }
}

export function useRecipeList(options: UseRecipeListOptions = {}) {
  // 防御式获取路由：允许 composable 在非组件上下文（如单元测试）中运行
  const instance = getCurrentInstance()
  const route = instance ? useRoute() : undefined
  const router = instance ? useRouter() : undefined
  const initialQuery = options.routeQuery ?? route?.query ?? {}
  const filters = reactive<RecipeFilters>(createFiltersFromRoute(initialQuery as SearchRouteQuery))

  const items = shallowRef<RecipeSummary[]>([])
  const total = shallowRef(0)
  const loading = shallowRef(false)
  const error = shallowRef<Error | null>(null)
  // 请求 token 避免较慢的旧请求覆盖较新的筛选结果。
  const requestToken = shallowRef(0)
  let debounceTimer: ReturnType<typeof setTimeout> | undefined

  const filterValues = computed(() => createFilterValues(filters))

  async function syncPageQuery() {
    // SearchBar 负责筛选字段的 query 同步；这里仅维护分页字段，避免职责重叠。
    const nextQuery = {
      ...(options.routeQuery ?? route?.query ?? {}),
      pageNum: filters.pageNum === 1 ? undefined : String(filters.pageNum),
      pageSize: filters.pageSize === createDefaultRecipeFilters().pageSize ? undefined : String(filters.pageSize),
    } as LocationQueryRaw

    if (options.replaceRouteQuery) {
      await options.replaceRouteQuery(nextQuery)
      return
    }

    if (router)
      await router.replace({ query: nextQuery })
  }

  async function load() {
    const currentToken = requestToken.value + 1
    requestToken.value = currentToken
    loading.value = true
    error.value = null

    try {
      const result = await fetchRecipePage({ ...filters })
      if (currentToken !== requestToken.value)
        return

      items.value = result.list
      total.value = result.total
      filters.pageNum = result.pageNum
      filters.pageSize = result.pageSize
      await syncPageQuery()
    }
    catch (loadError) {
      if (currentToken !== requestToken.value)
        return

      error.value = loadError instanceof Error ? loadError : new Error('菜品列表加载失败')
    }
    finally {
      if (currentToken === requestToken.value)
        loading.value = false
    }
  }

  function clearPendingLoad() {
    if (!debounceTimer)
      return
    clearTimeout(debounceTimer)
    debounceTimer = undefined
  }

  function scheduleLoad() {
    clearPendingLoad()
    debounceTimer = setTimeout(() => {
      debounceTimer = undefined
      void load()
    }, FILTER_DEBOUNCE_MS)
  }

  function handleFilterValuesChange(_changedValues: Record<string, unknown>, allValues: Record<string, unknown>) {
    // 字段编辑先回到第一页，再防抖刷新，避免用户连续输入时产生多次列表请求。
    applyFilters(filters, {
      ...normalizeFilterValues(allValues),
      pageNum: 1,
    })
    scheduleLoad()
  }

  async function handleFilterSearch(payload: RecipeListSearchPayload) {
    // 显式查询按钮跳过防抖，立即用当前 SearchBar 值刷新列表。
    clearPendingLoad()
    applyFilters(filters, {
      ...normalizeFilterValues(payload.rawValues),
      pageNum: 1,
    })
    await load()
  }

  async function handleFilterReset(payload: RecipeListSearchPayload) {
    // Reset 使用 SearchBar 返回的 rawValues，确保 preserve/default 规则只在一个地方定义。
    clearPendingLoad()
    applyFilters(filters, {
      ...createDefaultRecipeFilters(),
      ...normalizeFilterValues(payload.rawValues),
      pageNum: 1,
    })
    await load()
  }

  async function setPage(pageNum: number, pageSize = filters.pageSize) {
    clearPendingLoad()
    filters.pageNum = pageNum > 0 ? pageNum : 1
    filters.pageSize = pageSize > 0 ? pageSize : createDefaultRecipeFilters().pageSize
    await load()
  }

  if (instance)
    onBeforeUnmount(clearPendingLoad)

  const ready = load()

  return {
    schema: recipeSearchSchema,
    filters,
    filterValues,
    items,
    total,
    loading,
    error,
    ready,
    reload: load,
    setPage,
    handleFilterValuesChange,
    handleFilterSearch,
    handleFilterReset,
  }
}
