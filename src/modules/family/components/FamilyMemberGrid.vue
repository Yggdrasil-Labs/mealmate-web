<script setup lang="ts">
import type { FamilyMemberSummary } from '../types'
import { useI18n } from 'vue-i18n'
import FamilyMemberCard from './FamilyMemberCard.vue'

defineOptions({ name: 'FamilyMemberGrid' })

const props = defineProps<{
  members: FamilyMemberSummary[]
}>()

const emit = defineEmits<{
  (e: 'addMember'): void
  (e: 'editMember', memberId: string): void
  (e: 'deleteMember', memberId: string): void
}>()

const { t } = useI18n()
</script>

<template>
  <section class="family-member-grid">
    <div
      v-if="!props.members.length"
      class="family-member-grid__empty"
    >
      <p class="family-member-grid__empty-copy">
        {{ t('message.noData') }}
      </p>
      <button
        type="button"
        class="family-member-grid__empty-button"
        @click="emit('addMember')"
      >
        {{ t('button.add') }}
      </button>
    </div>

    <div
      v-else
      class="family-member-grid__list"
      data-testid="family-member-grid-list"
    >
      <FamilyMemberCard
        v-for="member in props.members"
        :key="member.memberId"
        :member="member"
        @edit="emit('editMember', $event)"
        @delete="emit('deleteMember', $event)"
      />
    </div>
  </section>
</template>

<style scoped>
.family-member-grid__list {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.family-member-grid__empty {
  display: grid;
  gap: var(--space-4);
  place-items: center;
  padding: var(--space-8) var(--space-6);
  border-radius: var(--card-radius);
  border: 1px dashed var(--color-border-strong);
  background: var(--color-surface-muted);
}

.family-member-grid__empty-copy {
  margin: 0;
  color: var(--color-text-secondary);
}

.family-member-grid__empty-button {
  min-height: var(--btn-height-lg);
  border: none;
  border-radius: var(--btn-radius-pill);
  padding: var(--space-3) var(--space-6);
  background: var(--color-success);
  color: #fff;
  font: inherit;
  cursor: pointer;
}

@media (max-width: 640px) {
  .family-member-grid__list {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 641px) and (max-width: 1023px) {
  .family-member-grid__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
