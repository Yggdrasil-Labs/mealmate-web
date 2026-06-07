// @vitest-environment jsdom
import type { Component } from 'vue'
import type { SearchBarProps, SearchBarSearchPayload } from '@/types/search-bar'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, reactive } from 'vue'
import { createDefaultRecipeFilters } from '@/modules/recipe/constants'

const searchBarProps: SearchBarProps[] = []
let lastSearchBarEmit: ((event: string, ...args: unknown[]) => void) | null = null

vi.mock('@/components/search-bar', () => ({
  SearchBar: defineComponent({
    name: 'SearchBarStub',
    props: {
      schema: { type: Array, required: true },
      modelValue: { type: Object, required: true },
      loading: { type: Boolean, default: false },
      syncRoute: { type: Boolean, default: false },
      autoSearchOnInit: { type: Boolean, default: false },
      defaultCollapsed: { type: Boolean, default: true },
      defaultVisibleCount: { type: Number, default: 3 },
      labelWidth: { type: [String, Number], default: '88px' },
    },
    emits: ['update:modelValue', 'search', 'reset', 'valuesChange'],
    setup(props, { emit }) {
      searchBarProps.push(props as unknown as SearchBarProps)
      lastSearchBarEmit = emit
      return () => h('div', { 'data-testid': 'search-bar-stub' })
    },
  }) as Component,
  registerDefaultSearchFieldComponents: vi.fn(),
}))

const mountedApps: Array<{ unmount: () => void }> = []

beforeEach(() => {
  setActivePinia(createPinia())
})

afterEach(() => {
  mountedApps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
  searchBarProps.splice(0)
  lastSearchBarEmit = null
})

async function mountFilterBar() {
  const { default: RecipeFilterBar } = await import('@/modules/recipe/components/RecipeFilterBar.vue')
  const container = document.createElement('div')
  document.body.appendChild(container)

  const model = reactive(createDefaultRecipeFilters())
  const emitted: Array<{ event: string, args: unknown[] }> = []

  const Host = defineComponent({
    setup() {
      return () =>
        h(RecipeFilterBar, {
          'modelValue': model,
          'loading': false,
          'onUpdate:modelValue': (next: typeof model) => {
            Object.assign(model, next)
            emitted.push({ event: 'update:modelValue', args: [next] })
          },
          'onSearch': (payload: SearchBarSearchPayload) => emitted.push({ event: 'search', args: [payload] }),
          'onReset': (payload: SearchBarSearchPayload) => emitted.push({ event: 'reset', args: [payload] }),
          'onValuesChange': (changed: Record<string, unknown>, all: Record<string, unknown>) =>
            emitted.push({ event: 'valuesChange', args: [changed, all] }),
        })
    },
  })

  const app = createApp(Host)
  app.mount(container)
  mountedApps.push({
    unmount() {
      app.unmount()
      container.remove()
    },
  })

  await nextTick()
  return { model, emitted }
}

describe('recipe filter bar', () => {
  it('passes the recipe search schema to SearchBar with route sync enabled', async () => {
    await mountFilterBar()

    const props = searchBarProps[0]

    expect(props.syncRoute).toBe(true)
    expect(props.defaultCollapsed).toBe(true)
    expect(props.schema.map(field => field.meta.field)).toEqual([
      'keyword',
      'recipeType',
      'seasonTag',
      'crowdTag',
      'isBabyFriendly',
      'isWeightLossFriendly',
      'difficultyLevel',
      'maxCookingTime',
    ])
  })

  it('keeps the contract typed through explicit emits', async () => {
    const { emitted, model } = await mountFilterBar()
    const nextValues = {
      ...createDefaultRecipeFilters(),
      keyword: '南瓜',
      recipeType: 'SOUP',
    }

    lastSearchBarEmit?.('update:modelValue', nextValues)
    lastSearchBarEmit?.('valuesChange', { keyword: '南瓜' }, nextValues)
    lastSearchBarEmit?.('search', { rawValues: nextValues, serializedValues: { keyword: '南瓜' } })
    lastSearchBarEmit?.('reset', { rawValues: createDefaultRecipeFilters(), serializedValues: {} })
    await nextTick()

    expect(model.keyword).toBe('南瓜')
    expect(emitted.map(item => item.event)).toEqual([
      'update:modelValue',
      'valuesChange',
      'search',
      'reset',
    ])
  })
})
