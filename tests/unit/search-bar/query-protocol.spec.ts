import { describe, expect, it } from 'vitest'
import { buildRouteQueryKey, stripRouteQueryNamespace } from '@/components/search-bar/query-protocol'

describe('query protocol', () => {
  it('namespaces route keys consistently', () => {
    expect(buildRouteQueryKey('filters', 'status')).toBe('filters.status')
    expect(stripRouteQueryNamespace('filters', { 'filters.status': 'draft' })).toEqual({ status: 'draft' })
  })
})
