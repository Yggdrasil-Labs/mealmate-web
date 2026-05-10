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
      class="recipe-grid__list"
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
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr));
}

.recipe-grid__empty {
  display: grid;
  gap: 1rem;
  place-items: center;
  padding: 2rem 1.5rem;
  border: 1px dashed rgba(100, 116, 139, 0.7);
  border-radius: 8px;
  background: #f8fafc;
  text-align: center;
}

.recipe-grid__empty-copy {
  display: grid;
  gap: 0.4rem;
}

.recipe-grid__empty-title,
.recipe-grid__empty-description {
  margin: 0;
}

.recipe-grid__empty-title {
  color: #0f172a;
  font-size: 1.05rem;
}

.recipe-grid__empty-description {
  color: #475569;
  line-height: 1.6;
}

.recipe-grid__empty-button {
  min-height: 44px;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1rem;
  background: #0f766e;
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
