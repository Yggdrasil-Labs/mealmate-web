<script setup lang="ts">
import type { RecipeFilters } from '../types'
import type { SearchBarSearchPayload } from '@/types/search-bar'
import { registerDefaultSearchFieldComponents, SearchBar } from '@/components/search-bar'
import { useAppBreakpoint } from '@/composables/useAppBreakpoint'
import { recipeSearchSchema } from '../composables/useRecipeList'

defineOptions({ name: 'RecipeFilterBar' })

defineProps<{
  modelValue: RecipeFilters
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: RecipeFilters): void
  (e: 'search', payload: SearchBarSearchPayload): void
  (e: 'reset', payload: SearchBarSearchPayload): void
  (e: 'valuesChange', changedValues: Partial<RecipeFilters>, allValues: RecipeFilters): void
}>()

const { isMobile } = useAppBreakpoint()

registerDefaultSearchFieldComponents()

function handleModelUpdate(value: Record<string, unknown>) {
  emit('update:modelValue', value as RecipeFilters)
}

function handleValuesChange(changedValues: Record<string, unknown>, allValues: Record<string, unknown>) {
  emit('valuesChange', changedValues as Partial<RecipeFilters>, allValues as RecipeFilters)
}
</script>

<template>
  <SearchBar
    :schema="recipeSearchSchema"
    :model-value="modelValue"
    :loading="loading"
    :sync-route="true"
    :default-collapsed="true"
    :default-visible-count="isMobile ? 1 : 3"
    label-width="92px"
    @update:model-value="handleModelUpdate"
    @values-change="handleValuesChange"
    @search="emit('search', $event)"
    @reset="emit('reset', $event)"
  />
</template>
