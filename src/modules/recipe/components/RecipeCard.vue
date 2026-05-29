<script setup lang="ts">
import type { RecipeSummary } from '../types'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  getRecipeCrowdTagLabel,
  getRecipeDifficultyLabel,
  getRecipeSourceTypeLabel,
  getRecipeTypeLabel,
} from '../constants'

defineOptions({ name: 'RecipeCard' })

const props = defineProps<{
  recipe: RecipeSummary
}>()

const emit = defineEmits<{
  (e: 'view', recipeId: string): void
  (e: 'edit', recipeId: string): void
  (e: 'delete', recipeId: string): void
}>()

const { t } = useI18n()

const sourceLabel = computed(() => getRecipeSourceTypeLabel(props.recipe.sourceType, t))
const typeLabel = computed(() => getRecipeTypeLabel(props.recipe.recipeType, t))
const difficultyLabel = computed(() => getRecipeDifficultyLabel(props.recipe.difficultyLevel, t))
const crowdLabel = computed(() => getRecipeCrowdTagLabel(props.recipe.crowdTag, t))

const canEdit = computed(() => props.recipe.sourceType !== 'SYSTEM')
const canDelete = computed(() => props.recipe.sourceType === 'MANUAL')
const coverInitial = computed(() => props.recipe.name.slice(0, 1))
const friendlyBadges = computed(() => {
  const badges: string[] = []

  if (props.recipe.isBabyFriendly)
    badges.push(t('recipe.cards.babyFriendly'))

  if (props.recipe.isWeightLossFriendly)
    badges.push(t('recipe.cards.weightLossFriendly'))

  return badges
})
</script>

<template>
  <article class="recipe-card">
    <div class="recipe-card__cover" :class="{ 'recipe-card__cover--no-image': !props.recipe.coverImageUrl }">
      <img
        v-if="props.recipe.coverImageUrl"
        class="recipe-card__image"
        :src="props.recipe.coverImageUrl"
        :alt="props.recipe.name"
      >
      <span
        v-else
        class="recipe-card__initial"
        aria-hidden="true"
      >
        {{ coverInitial }}
      </span>
    </div>

    <div class="recipe-card__body">
      <div class="recipe-card__heading">
        <h3
          class="recipe-card__name"
          data-testid="recipe-card-name"
        >
          {{ props.recipe.name }}
        </h3>
        <p
          class="recipe-card__source"
          data-testid="recipe-card-source"
        >
          {{ sourceLabel }}
        </p>
      </div>

      <dl class="recipe-card__meta">
        <div class="recipe-card__meta-item">
          <dt class="recipe-card__meta-label">
            {{ t('recipe.cards.recipeType') }}
          </dt>
          <dd
            class="recipe-card__meta-value"
            data-testid="recipe-card-type"
          >
            {{ typeLabel }}
          </dd>
        </div>
        <div class="recipe-card__meta-item">
          <dt class="recipe-card__meta-label">
            {{ t('recipe.cards.difficultyLevel') }}
          </dt>
          <dd
            class="recipe-card__meta-value"
            data-testid="recipe-card-difficulty"
          >
            {{ difficultyLabel }}
          </dd>
        </div>
        <div class="recipe-card__meta-item">
          <dt class="recipe-card__meta-label">
            {{ t('recipe.cards.crowdTag') }}
          </dt>
          <dd
            class="recipe-card__meta-value"
            data-testid="recipe-card-crowd"
          >
            {{ crowdLabel }}
          </dd>
        </div>
        <div class="recipe-card__meta-item">
          <dt class="recipe-card__meta-label">
            {{ t('recipe.cards.cookingTimeMin') }}
          </dt>
          <dd
            class="recipe-card__meta-value"
            data-testid="recipe-card-time"
          >
            {{ props.recipe.cookingTimeMin }} min
          </dd>
        </div>
      </dl>

      <div
        class="recipe-card__badges"
        data-testid="recipe-card-badges"
        aria-label="recipe friendly badges"
      >
        <span
          v-for="badge in friendlyBadges"
          :key="badge"
          class="recipe-card__badge"
        >
          {{ badge }}
        </span>
      </div>
    </div>

    <div class="recipe-card__actions">
      <button
        type="button"
        class="recipe-card__button recipe-card__button--primary"
        data-testid="recipe-card-view"
        @click="emit('view', props.recipe.recipeId)"
      >
        {{ t('recipe.actions.view') }}
      </button>
      <button
        v-if="canEdit"
        type="button"
        class="recipe-card__button recipe-card__button--secondary"
        data-testid="recipe-card-edit"
        @click="emit('edit', props.recipe.recipeId)"
      >
        {{ t('recipe.actions.edit') }}
      </button>
      <button
        v-if="canDelete"
        type="button"
        class="recipe-card__button recipe-card__button--danger"
        data-testid="recipe-card-delete"
        @click="emit('delete', props.recipe.recipeId)"
      >
        {{ t('recipe.actions.delete') }}
      </button>
    </div>
  </article>
</template>

<style scoped>
.recipe-card {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-width: 0;
  overflow: hidden;
  border: var(--card-border);
  border-radius: var(--card-radius);
  background: var(--color-surface);
  box-shadow: var(--card-shadow);
  transition:
    transform var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
}

.recipe-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.1);
}

.recipe-card__cover {
  display: grid;
  place-items: center;
  aspect-ratio: 16 / 9;
  background: linear-gradient(
    135deg,
    var(--color-surface-muted) 0%,
    var(--color-info-soft) 55%,
    var(--color-warning-soft) 100%
  );
}

.recipe-card__cover--no-image {
  aspect-ratio: 4 / 3;
}

.recipe-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recipe-card__initial {
  display: grid;
  place-items: center;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 50%;
  background: var(--color-surface);
  color: var(--color-success);
  font-size: 1.4rem;
  font-weight: 700;
}

.recipe-card__body {
  display: grid;
  gap: var(--space-4);
  padding: var(--card-padding);
}

.recipe-card__heading {
  display: grid;
  gap: var(--space-1);
  min-width: 0;
}

.recipe-card__name,
.recipe-card__source,
.recipe-card__meta,
.recipe-card__meta-value {
  margin: 0;
}

.recipe-card__name {
  overflow-wrap: anywhere;
  color: var(--color-text);
  font-size: var(--text-base);
  line-height: 1.35;
}

.recipe-card__source {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

.recipe-card__meta {
  display: grid;
  gap: var(--space-3);
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.recipe-card__meta-item {
  display: grid;
  gap: var(--space-1);
  min-width: 0;
}

.recipe-card__meta-label {
  color: var(--color-text-muted);
  font-size: var(--text-xs);
}

.recipe-card__meta-value {
  overflow-wrap: anywhere;
  color: var(--color-text);
  font-weight: 600;
}

.recipe-card__badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  min-height: var(--badge-height);
}

.recipe-card__badge {
  display: inline-flex;
  align-items: center;
  min-height: var(--badge-height);
  border-radius: var(--badge-radius);
  padding: var(--badge-padding);
  background: var(--color-success-soft);
  color: var(--color-success);
  font-size: var(--badge-font-size);
  font-weight: 600;
}

.recipe-card__actions {
  display: grid;
  gap: var(--space-3);
  grid-template-columns: repeat(auto-fit, minmax(6.5rem, 1fr));
  padding: 0 var(--card-padding) var(--card-padding);
}

.recipe-card__button {
  min-height: var(--btn-height-lg);
  border: none;
  border-radius: var(--btn-radius);
  padding: var(--space-3);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition:
    opacity var(--duration-fast) var(--ease-out),
    transform var(--duration-fast) var(--ease-out);
}

.recipe-card__button:hover {
  opacity: 0.85;
}

.recipe-card__button:active {
  transform: scale(0.97);
}

.recipe-card__button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.recipe-card__button--primary {
  background: var(--color-primary);
  color: #fff;
}

.recipe-card__button--secondary {
  background: var(--color-surface-muted);
  color: var(--color-text);
}

.recipe-card__button--danger {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

@media (max-width: 420px) {
  .recipe-card__meta {
    grid-template-columns: 1fr;
  }
}
</style>
