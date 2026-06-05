<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ProDialog } from '@/components/pro-dialog'

/**
 * FamilyMemberDeleteDialog — 删除家庭成员确认对话框
 *
 * 使用 ProDialog confirm 模式，统一删除确认交互。
 */

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

function handleConfirm() {
  emit('confirm')
  emit('update:modelValue', false)
}

function handleCancel() {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>

<template>
  <ProDialog
    :model-value="props.modelValue"
    mode="confirm"
    :title="t('family.deleteDialog.title')"
    width="420px"
    confirm-type="danger"
    :confirm-text="t('button.delete')"
    :cancel-text="t('button.cancel')"
    :show-close="false"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <p style="margin: 0;">
      {{ t('family.deleteDialog.confirmWithName', { name: props.memberName }) }}
    </p>
  </ProDialog>
</template>
