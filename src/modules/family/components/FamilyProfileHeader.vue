<script setup lang="ts">
import type { FamilySummary } from '../types'
import { ElButton } from 'element-plus'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({ name: 'FamilyProfileHeader' })

const props = defineProps<{
  summary: FamilySummary | null
  memberCount: number
}>()

const emit = defineEmits<{
  (e: 'addMember'): void
}>()

const { t } = useI18n()

const familyName = computed(() => props.summary?.familyName ?? '-')
const region = computed(() => props.summary?.region ?? '-')
const mealGoal = computed(() => props.summary?.mealGoal ?? '-')
</script>

<template>
  <section class="family-profile-header">
    <div class="family-profile-header__copy">
      <p class="family-profile-header__eyebrow">
        {{ t('family.header.eyebrow') }}
      </p>
      <h2
        class="family-profile-header__title"
        data-testid="family-profile-title"
      >
        {{ familyName }}
      </h2>
      <p
        class="family-profile-header__meta"
        data-testid="family-profile-region"
      >
        {{ region }}
      </p>
      <p
        class="family-profile-header__description"
        data-testid="family-profile-goal"
      >
        {{ mealGoal }}
      </p>
    </div>

    <div class="family-profile-header__actions">
      <p
        class="family-profile-header__count"
        data-testid="family-profile-count"
      >
        {{ props.memberCount }}
      </p>
      <ElButton
        type="primary"
        plain
        class="family-profile-header__button"
        data-testid="family-profile-add"
        @click="emit('addMember')"
      >
        {{ t('button.add') }}
      </ElButton>
    </div>
  </section>
</template>

<style scoped>
.family-profile-header {
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-6);
  border-radius: var(--card-radius);
  background: linear-gradient(
    135deg,
    var(--color-warning-soft) 0%,
    var(--color-surface) 55%,
    var(--color-warning-soft) 100%
  );
  border: 1px solid var(--color-border);
}

.family-profile-header__copy {
  display: grid;
  gap: var(--space-2);
}

.family-profile-header__eyebrow {
  margin: 0;
  font-size: var(--text-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-warning);
}

.family-profile-header__title {
  margin: 0;
  font-size: var(--text-2xl);
  color: var(--color-text);
}

.family-profile-header__meta,
.family-profile-header__description,
.family-profile-header__count {
  margin: 0;
  color: var(--color-text-secondary);
}

.family-profile-header__actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-3);
}

.family-profile-header__button {
  min-height: var(--btn-height-lg);
}

@media (max-width: 640px) {
  .family-profile-header {
    flex-direction: column;
  }

  .family-profile-header__actions {
    align-items: stretch;
  }
}
</style>
