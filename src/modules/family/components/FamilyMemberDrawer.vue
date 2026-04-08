<script setup lang="ts">
import type { MemberPreference, UpdateFamilyMemberPayload } from '../types'
import { ElButton, ElDrawer } from 'element-plus'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppBreakpoint } from '@/composables'
import FamilyMemberForm from './FamilyMemberForm.vue'
import MemberPreferenceForm from './MemberPreferenceForm.vue'

defineOptions({ name: 'FamilyMemberDrawer' })

const props = defineProps<{
  modelValue: boolean
  mode: 'add' | 'edit'
  detailLoading?: boolean
  basicForm: UpdateFamilyMemberPayload
  preferenceForm: MemberPreference
  isBabyRole?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'update:basicForm', value: UpdateFamilyMemberPayload): void
  (e: 'update:preferenceForm', value: MemberPreference): void
  (e: 'save', payload: { basicForm: UpdateFamilyMemberPayload, preferenceForm: MemberPreference }): void
  (e: 'delete'): void
}>()

const { t } = useI18n()
const { isMobile } = useAppBreakpoint()
const title = computed(() => props.mode === 'add' ? t('family.drawer.titleAdd') : t('family.drawer.titleEdit'))
const drawerSize = computed(() => (isMobile.value ? '100%' : '720px'))
</script>

<template>
  <ElDrawer
    :model-value="props.modelValue"
    :size="drawerSize"
    :append-to-body="true"
    :with-header="false"
    :show-close="false"
    :modal="true"
    :close-on-click-modal="true"
    modal-class="family-member-drawer__mask"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <section
      class="family-member-drawer"
      data-testid="family-member-drawer"
    >
      <header class="family-member-drawer__header">
        <h2
          class="family-member-drawer__title"
          data-testid="family-member-drawer-title"
        >
          {{ title }}
        </h2>
        <ElButton
          type="info"
          plain
          class="family-member-drawer__close"
          @click="emit('update:modelValue', false)"
        >
          {{ t('button.close') }}
        </ElButton>
      </header>

      <p
        v-if="props.detailLoading"
        class="family-member-drawer__loading"
        data-testid="family-member-drawer-loading"
      >
        {{ t('status.loading') }}
      </p>

      <div
        v-else
        class="family-member-drawer__body"
      >
        <FamilyMemberForm
          :model-value="props.basicForm"
          :disabled="props.disabled"
          @update:model-value="emit('update:basicForm', $event)"
        />

        <MemberPreferenceForm
          :model-value="props.preferenceForm"
          :is-baby-role="props.isBabyRole"
          :disabled="props.disabled"
          @update:model-value="emit('update:preferenceForm', $event)"
        />
      </div>

      <footer class="family-member-drawer__footer">
        <ElButton
          v-if="props.mode === 'edit'"
          type="danger"
          plain
          data-testid="family-member-drawer-delete"
          @click="emit('delete')"
        >
          {{ t('button.delete') }}
        </ElButton>
        <ElButton
          type="primary"
          data-testid="family-member-drawer-save"
          @click="emit('save', { basicForm: props.basicForm, preferenceForm: props.preferenceForm })"
        >
          {{ t('family.drawer.saveAll') }}
        </ElButton>
      </footer>
    </section>
  </ElDrawer>
</template>

<style scoped>
.family-member-drawer {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
  padding: 1rem 1.25rem;
  overflow: auto;
}

.family-member-drawer__header,
.family-member-drawer__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.family-member-drawer__title,
.family-member-drawer__loading {
  margin: 0;
}

.family-member-drawer__title {
  font-size: 1.2rem;
}

.family-member-drawer__body {
  display: grid;
  gap: 1rem;
}

/* .family-member-drawer__close {
  min-height: 40px;
} */

@media (max-width: 640px) {
  .family-member-drawer {
    padding: 1rem;
  }
}

:deep(.el-drawer__body) {
  padding: 0;
}

:deep(.family-member-drawer__mask) {
  background: rgba(15, 23, 42, 0.52);
  backdrop-filter: blur(1px);
}
</style>
