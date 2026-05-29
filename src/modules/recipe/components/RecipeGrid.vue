<script setup lang="ts">
import type { RecipeSummary } from '../types'
import { useI18n } from 'vue-i18n'
import RecipeCard from './RecipeCard.vue'

defineOptions({ name: 'RecipeGrid' })

const props = defineProps<{
  recipes: RecipeSummary[]
}>()

const emit = defineEmits<{
  (e: 'addRecipe'): void
  (e: 'viewRecipe', recipeId: string): void
  (e: 'editRecipe', recipeId: string): void
  (e: 'deleteRecipe', recipeId: string): void
}>()

const { t } = useI18n()
</script>

<template>
  <section class="recipe-grid">
    <div
      v-if="!props.recipes.length"
      class="recipe-grid__empty"
      data-testid="recipe-grid-empty"
    >
      <div class="recipe-grid__empty-copy">
        <h3 class="recipe-grid__empty-title">
          {{ t('recipe.empty.title') }}
        </h3>
        <p class="recipe-grid__empty-description">
          {{ t('recipe.empty.description') }}
        </p>
      </div>
      <button
        type="button"
        class="recipe-grid__empty-button"
        data-testid="recipe-grid-add"
        @click="emit('addRecipe')"
      >
        {{ t('recipe.actions.create') }}
      </button>
    </div>

    <div
      v-else
      class="recipe-grid__list stagger-enter"
      data-testid="recipe-grid-list"
    >
      <RecipeCard
        v-for="recipe in props.recipes"
        :key="recipe.recipeId"
        :recipe="recipe"
        @view="emit('viewRecipe', $event)"
        @edit="emit('editRecipe', $event)"
        @delete="emit('deleteRecipe', $event)"
      />
    </div>
  </section>
</template>

<style scoped>
.recipe-grid {
  min-width: 0;
}

.recipe-grid__list {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr));
}

.recipe-grid__empty {
  display: grid;
  gap: var(--space-4);
  place-items: center;
  padding: var(--space-8) var(--space-6);
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--btn-radius);
  background: var(--color-surface-muted);
  text-align: center;
}

.recipe-grid__empty-copy {
  display: grid;
  gap: var(--space-1);
}

.recipe-grid__empty-title,
.recipe-grid__empty-description {
  margin: 0;
}

.recipe-grid__empty-title {
  color: var(--color-text);
  font-size: var(--text-base);
}

.recipe-grid__empty-description {
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.recipe-grid__empty-button {
  min-height: var(--btn-height-lg);
  border: none;
  border-radius: var(--btn-radius);
  padding: var(--space-3) var(--space-4);
  background: var(--color-primary);
  color: #fff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 640px) {
  .recipe-grid__list {
    grid-template-columns: 1fr;
  }
}
</style>
