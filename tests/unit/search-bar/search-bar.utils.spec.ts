import type { SearchFieldSchema } from '@/types/search-bar'
import { describe, expect, it } from 'vitest'
import {
  collectSearchRouteQueryKeys,
  deserializeSearchValues,
  mergeSearchDefaults,
  resolveVisibleFields,
  routeQueryContainsAnyKey,
  serializeSearchValues,
  splitSchemaGroups,
} from '@/components/search-bar/search-bar.utils'

const schema: SearchFieldSchema[] = [
  {
    meta: {
      field: 'keyword',
      label: '关键词',
      valueType: 'string',
      defaultValue: '',
    },
    ui: {
      component: 'Input',
      layout: { group: 'basic', span: 8 },
    },
  },
  {
    meta: {
      field: 'status',
      label: '状态',
      valueType: 'string',
      defaultValue: 'draft',
    },
    ui: {
      component: 'Select',
      layout: { group: 'basic', span: 8 },
      options: [
        { label: '草稿', value: 'draft' },
        { label: '已发布', value: 'published' },
      ],
    },
  },
  {
    meta: {
      field: 'dateRange',
      label: '创建时间',
      valueType: 'dateRange',
    },
    ui: {
      component: 'DatePicker',
      layout: { group: 'advanced', span: 12 },
      props: { type: 'daterange' },
    },
    runtime: {
      transform: {
        serialize(value) {
          if (!Array.isArray(value) || value.length !== 2)
            return undefined
          return {
            startDate: value[0],
            endDate: value[1],
          }
        },
        deserialize(query) {
          const startDate = query.startDate
          const endDate = query.endDate
          if (typeof startDate !== 'string' || typeof endDate !== 'string')
            return undefined
          return [startDate, endDate]
        },
      },
    },
  },
]

describe('search-bar utils', () => {
  it('只填充缺失的默认值，保留已有字段值', () => {
    const values = mergeSearchDefaults(schema, {
      keyword: 'mealmate',
      status: 'published',
    })

    expect(values).toEqual({
      keyword: 'mealmate',
      status: 'published',
    })
  })

  it('会为缺失字段补上默认值', () => {
    const values = mergeSearchDefaults(schema, {
      keyword: 'mealmate',
    })

    expect(values).toEqual({
      keyword: 'mealmate',
      status: 'draft',
    })
  })

  it('会按字段 transform 序列化查询参数并忽略空值', () => {
    const params = serializeSearchValues(schema, {
      keyword: '',
      status: 'published',
      dateRange: ['2026-03-01', '2026-03-27'],
    }, {})

    expect(params).toEqual({
      status: 'published',
      startDate: '2026-03-01',
      endDate: '2026-03-27',
    })
  })

  it('会从路由 query 反序列化查询值', () => {
    const values = deserializeSearchValues(schema, {
      keyword: 'table',
      status: 'draft',
      startDate: '2026-03-01',
      endDate: '2026-03-27',
    }, {})

    expect(values).toEqual({
      keyword: 'table',
      status: 'draft',
      dateRange: ['2026-03-01', '2026-03-27'],
    })
  })

  it('支持带 routeKey 命名空间的 query 反序列化', () => {
    const values = deserializeSearchValues(schema, {
      'filters.keyword': 'vue',
      'filters.status': 'published',
      'filters.startDate': '2026-03-10',
      'filters.endDate': '2026-03-27',
      'page': '2',
    }, {}, 'filters')

    expect(values).toEqual({
      keyword: 'vue',
      status: 'published',
      dateRange: ['2026-03-10', '2026-03-27'],
    })
  })

  it('会收集 transform 实际产出的 query keys', () => {
    // 这里断言的是展开后的键，而不是原字段名 dateRange。
    const keys = collectSearchRouteQueryKeys(schema, {
      status: 'published',
      dateRange: ['2026-03-10', '2026-03-27'],
    }, {})

    expect(keys).toEqual(['status', 'startDate', 'endDate'])
  })

  it('能判断 query 中是否仍包含当前 SearchBar 追踪的参数键', () => {
    expect(routeQueryContainsAnyKey({
      keyword: 'vue',
      page: '2',
    }, ['startDate', 'endDate'])).toBe(false)

    expect(routeQueryContainsAnyKey({
      keyword: 'vue',
      endDate: '2026-03-27',
    }, ['startDate', 'endDate'])).toBe(true)
  })

  it('会按 basic 和 advanced 分组', () => {
    const groups = splitSchemaGroups(schema)

    expect(groups.basic.map(item => item.meta.field)).toEqual(['keyword', 'status'])
    expect(groups.advanced.map(item => item.meta.field)).toEqual(['dateRange'])
  })

  it('收起态下只展示限定数量的 basic 字段，展开后展示全部字段', () => {
    const collapsed = resolveVisibleFields(schema, false, 1)
    const expanded = resolveVisibleFields(schema, true, 1)

    expect(collapsed.map(item => item.meta.field)).toEqual(['keyword'])
    expect(expanded.map(item => item.meta.field)).toEqual(['keyword', 'status', 'dateRange'])
  })
})
