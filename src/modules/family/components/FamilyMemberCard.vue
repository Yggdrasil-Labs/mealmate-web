<script setup lang="ts">
import type { FamilyMemberSummary } from '../types'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  getFamilyRoleTypeLabel,
  getFamilyTargetTypeLabel,
  getOilLevelLabel,
  getSaltLevelLabel,
  getSpicyLevelLabel,
  getSweetLevelLabel,
} from '../constants'

defineOptions({ name: 'FamilyMemberCard' })

const props = defineProps<{
  member: FamilyMemberSummary
}>()

const emit = defineEmits<{
  (e: 'edit', memberId: string): void
  (e: 'delete', memberId: string): void
}>()

const { t } = useI18n()

const roleLabel = computed(() => getFamilyRoleTypeLabel(props.member.roleType, t))
const targetLabel = computed(() => getFamilyTargetTypeLabel(props.member.targetType, t))
const preferenceSummary = computed(() => {
  const preference = props.member.preferenceSummary
  const levelSummary = [
    getSpicyLevelLabel(preference.spicyLevel, t),
    getSweetLevelLabel(preference.sweetLevel, t),
    getOilLevelLabel(preference.oilLevel, t),
    getSaltLevelLabel(preference.saltLevel, t),
  ].join(' / ')

  return [
    ...preference.tasteTags,
    `${preference.avoidIngredientCount}${t('label.count')}`,
    `${preference.allergyIngredientCount}${t('label.count')}`,
    levelSummary,
  ].join(' · ')
})
</script>

<template>
  <article class="family-member-card">
    <div class="family-member-card__header">
      <div class="family-member-card__avatar">
        {{ props.member.name.slice(0, 1) }}
      </div>
      <div class="family-member-card__identity">
        <h3
          class="family-member-card__name"
          data-testid="family-member-name"
        >
          {{ props.member.name }}
        </h3>
        <p
          class="family-member-card__role"
          data-testid="family-member-role"
        >
          {{ roleLabel }}
        </p>
      </div>
    </div>

    <p
      class="family-member-card__target"
      data-testid="family-member-target"
    >
      {{ targetLabel }}
    </p>

    <p
      class="family-member-card__preference"
      data-testid="family-member-preference"
    >
      {{ preferenceSummary }}
    </p>

    <div class="family-member-card__actions">
      <button
        type="button"
        class="family-member-card__button family-member-card__button--secondary"
        data-testid="family-member-edit"
        @click="emit('edit', props.member.memberId)"
      >
        {{ t('button.edit') }}
      </button>
      <button
        type="button"
        class="family-member-card__button family-member-card__button--danger"
        data-testid="family-member-delete"
        @click="emit('delete', props.member.memberId)"
      >
        {{ t('button.delete') }}
      </button>
    </div>
  </article>
</template>

<style scoped>
.family-member-card {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-4);
  border-radius: var(--card-radius);
  background: var(--color-surface);
  border: var(--card-border);
  box-shadow: var(--card-shadow);
  transition:
    transform var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
}

.family-member-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.1);
}

.family-member-card__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.family-member-card__avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--color-warning-soft);
  color: var(--color-warning);
  font-weight: 700;
}

.family-member-card__identity {
  display: grid;
  gap: var(--space-1);
}

.family-member-card__name,
.family-member-card__role,
.family-member-card__target,
.family-member-card__preference {
  margin: 0;
}

.family-member-card__name {
  color: var(--color-text);
}

.family-member-card__role,
.family-member-card__target {
  color: var(--color-text-secondary);
}

.family-member-card__preference {
  line-height: 1.65;
  color: var(--color-text);
}

.family-member-card__actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);
}

.family-member-card__button {
  min-height: var(--btn-height-lg);
  border-radius: var(--card-radius);
  border: none;
  font: inherit;
  cursor: pointer;
  transition:
    transform var(--duration-fast) var(--ease-out),
    opacity var(--duration-fast) var(--ease-out);
}

.family-member-card__button:hover {
  opacity: 0.85;
}

.family-member-card__button:active {
  transform: scale(0.97);
}

.family-member-card__button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.family-member-card__button--secondary {
  background: var(--color-surface-muted);
  color: var(--color-text);
}

.family-member-card__button--danger {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}
</style>
