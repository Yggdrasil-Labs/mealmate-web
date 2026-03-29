import type { ProFormContext } from '@/types/pro-form'
import type {
  SearchFieldSchema,
  SearchRouteQuery,
  SearchSerializedValues,
} from '@/types/search-bar'
import { buildRouteQueryKey, stripRouteQueryNamespace } from './query-protocol'

function isEmptySearchValue(value: unknown): boolean {
  if (value == null)
    return true
  if (typeof value === 'string')
    return value.trim() === ''
  if (Array.isArray(value))
    return value.length === 0 || value.every(item => isEmptySearchValue(item))
  return false
}

function normalizeQueryValue(value: unknown): unknown {
  if (Array.isArray(value))
    return value.length <= 1 ? value[0] : value
  return value
}

function filterEmptyEntries(source: SearchSerializedValues): SearchSerializedValues {
  const entries = Object.entries(source).filter(([, value]) => !isEmptySearchValue(value))
  return Object.fromEntries(entries)
}

function withRouteNamespace(source: SearchSerializedValues, routeKey?: string): SearchSerializedValues {
  if (!routeKey)
    return source
  // 命名空间用于一个页面放多个 SearchBar 时隔离 query，避免同名字段互相覆盖。
  return Object.fromEntries(
    Object.entries(source).map(([key, value]) => [buildRouteQueryKey(routeKey, key), value]),
  )
}

function stripRouteNamespace(query: SearchRouteQuery, routeKey?: string): SearchRouteQuery {
  if (!routeKey)
    return query
  return stripRouteQueryNamespace(routeKey, query)
}

export function collectSearchRouteQueryKeys(
  schema: SearchFieldSchema[],
  values: Record<string, unknown>,
  context: ProFormContext,
  routeKey?: string,
): string[] {
  return Object.keys(serializeSearchValues(schema, values, context, routeKey))
}

export function routeQueryContainsAnyKey(
  query: SearchRouteQuery,
  keys: string[],
): boolean {
  return keys.some(key => key in query)
}

export function mergeSearchDefaults(
  schema: SearchFieldSchema[],
  modelValue: Record<string, unknown>,
): Record<string, unknown> {
  const nextValue = { ...modelValue }

  for (const field of schema) {
    const fieldKey = field.meta.field
    if (!(fieldKey in nextValue) && field.meta.defaultValue !== undefined)
      nextValue[fieldKey] = field.meta.defaultValue
  }

  return nextValue
}

export function serializeSearchValues(
  schema: SearchFieldSchema[],
  values: Record<string, unknown>,
  context: ProFormContext,
  routeKey?: string,
): SearchSerializedValues {
  const serialized: SearchSerializedValues = {}

  for (const field of schema) {
    const fieldKey = field.meta.field
    const rawValue = values[fieldKey]

    if (isEmptySearchValue(rawValue))
      continue

    const transform = field.runtime?.transform?.serialize
    const result = transform
      ? transform(rawValue, values, context)
      : rawValue

    if (isEmptySearchValue(result))
      continue

    if (result && typeof result === 'object' && !Array.isArray(result)) {
      // 允许一个字段展开成多个 query 参数，例如日期范围 => startDate / endDate。
      Object.assign(serialized, filterEmptyEntries(result as SearchSerializedValues))
      continue
    }

    serialized[fieldKey] = result
  }

  return withRouteNamespace(filterEmptyEntries(serialized), routeKey)
}

export function deserializeSearchValues(
  schema: SearchFieldSchema[],
  query: SearchRouteQuery,
  context: ProFormContext,
  routeKey?: string,
): Record<string, unknown> {
  const scopedQuery = stripRouteNamespace(query, routeKey)
  const values: Record<string, unknown> = {}

  for (const field of schema) {
    const fieldKey = field.meta.field
    const transform = field.runtime?.transform?.deserialize

    if (transform) {
      const transformed = transform(scopedQuery, context)
      if (!isEmptySearchValue(transformed))
        values[fieldKey] = transformed
      continue
    }

    const rawValue = normalizeQueryValue(scopedQuery[fieldKey])
    if (!isEmptySearchValue(rawValue))
      values[fieldKey] = rawValue
  }

  return values
}

export function splitSchemaGroups(schema: SearchFieldSchema[]) {
  const basic: SearchFieldSchema[] = []
  const advanced: SearchFieldSchema[] = []

  for (const field of schema) {
    if (field.runtime?.visible === false)
      continue

    const group = field.ui.layout?.group ?? 'basic'
    if (group === 'advanced')
      advanced.push(field)
    else
      basic.push(field)
  }

  return { basic, advanced }
}

export function resolveVisibleFields(
  schema: SearchFieldSchema[],
  expanded: boolean,
  defaultVisibleCount: number,
): SearchFieldSchema[] {
  const { basic, advanced } = splitSchemaGroups(schema)

  if (expanded)
    return [...basic, ...advanced]

  if (defaultVisibleCount <= 0)
    return []

  // 收起态只截取 basic 分组，advanced 字段统一通过“展开”进入视图。
  return basic.slice(0, defaultVisibleCount)
}
