<script setup lang="ts">
import type { UpdateFamilyMemberPayload } from '../types'
import type { FormFieldSchema } from '@/components/pro-form'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ProForm } from '@/components/pro-form'
import { getFamilyRoleTypeOptions, getFamilyTargetTypeOptions } from '../constants'
import { ensureFamilyFormFieldComponents } from './fields/family-form-registry'

defineOptions({ name: 'FamilyMemberForm' })

const props = defineProps<{
  modelValue: UpdateFamilyMemberPayload
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: UpdateFamilyMemberPayload): void
}>()

ensureFamilyFormFieldComponents()

const { t } = useI18n()

const schema = computed<FormFieldSchema[]>(() => [
  {
    meta: { field: 'name', label: t('family.form.fields.name'), valueType: 'string', required: true },
    ui: {
      component: 'Input',
      props: {
        'data-testid': 'family-member-form-name',
        'placeholder': t('family.form.placeholders.name'),
      },
      layout: { group: t('family.form.groups.identity'), span: 24 },
    },
  },
  {
    meta: { field: 'roleType', label: t('family.form.fields.roleType'), valueType: 'string', required: true },
    ui: {
      component: 'Select',
      options: getFamilyRoleTypeOptions(t),
      props: {
        'data-testid': 'family-member-form-role',
        'placeholder': t('family.form.placeholders.roleType'),
      },
      layout: { group: t('family.form.groups.identity'), span: 24 },
    },
  },
  {
    meta: { field: 'gender', label: t('family.form.fields.gender'), valueType: 'string', required: true },
    ui: {
      component: 'Select',
      options: [
        { label: t('family.enums.gender.MALE'), value: 'MALE' },
        { label: t('family.enums.gender.FEMALE'), value: 'FEMALE' },
        { label: t('family.enums.gender.OTHER'), value: 'OTHER' },
      ],
      props: {
        'data-testid': 'family-member-form-gender',
        'placeholder': t('family.form.placeholders.gender'),
      },
      layout: { group: t('family.form.groups.identity'), span: 24 },
    },
  },
  {
    meta: { field: 'birthday', label: t('family.form.fields.birthday'), valueType: 'string', required: true },
    ui: {
      component: 'DatePicker',
      props: {
        'type': 'date',
        'data-testid': 'family-member-form-birthday',
        'placeholder': t('family.form.placeholders.birthday'),
      },
      layout: { group: t('family.form.groups.identity'), span: 24 },
    },
  },
  {
    meta: { field: 'region', label: t('family.form.fields.region'), valueType: 'string', required: true },
    ui: {
      component: 'Input',
      props: {
        'data-testid': 'family-member-form-region',
        'placeholder': t('family.form.placeholders.region'),
      },
      layout: { group: t('family.form.groups.goal'), span: 24 },
    },
  },
  {
    meta: { field: 'targetType', label: t('family.form.fields.targetType'), valueType: 'string', required: true },
    ui: {
      component: 'Select',
      options: getFamilyTargetTypeOptions(t),
      props: {
        'data-testid': 'family-member-form-target',
        'placeholder': t('family.form.placeholders.targetType'),
      },
      layout: { group: t('family.form.groups.goal'), span: 24 },
    },
  },
])
</script>

<template>
  <ProForm
    :schema="schema"
    :model-value="props.modelValue"
    :loading="props.disabled"
    @update:model-value="emit('update:modelValue', $event as UpdateFamilyMemberPayload)"
  />
</template>
