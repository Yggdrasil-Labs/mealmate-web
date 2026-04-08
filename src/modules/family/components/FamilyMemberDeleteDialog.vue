<script setup lang="ts">
import { ElButton, ElDialog } from 'element-plus'
import { useI18n } from 'vue-i18n'

defineOptions({ name: 'FamilyMemberDeleteDialog' })

const props = defineProps<{
  modelValue: boolean
  memberName: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const { t } = useI18n()

function handleCancel() {
  emit('cancel')
  emit('update:modelValue', false)
}

function handleConfirm() {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>

<template>
  <ElDialog
    :model-value="props.modelValue"
    :append-to-body="true"
    :show-close="false"
    :title="t('family.deleteDialog.title')"
    width="420px"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <p class="family-member-delete-dialog__copy">
      {{ t('family.deleteDialog.confirmWithName', { name: props.memberName }) }}
    </p>

    <template #footer>
      <div class="family-member-delete-dialog__actions">
        <ElButton
          class="family-member-delete-dialog__button"
          data-testid="family-member-delete-cancel"
          @click="handleCancel"
        >
          {{ t('button.cancel') }}
        </ElButton>
        <ElButton
          type="danger"
          class="family-member-delete-dialog__button"
          data-testid="family-member-delete-confirm"
          @click="handleConfirm"
        >
          {{ t('button.delete') }}
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<style scoped>
.family-member-delete-dialog__copy {
  margin: 0;
}

.family-member-delete-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
</style>
