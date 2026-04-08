<script setup lang="ts">
import type { MemberPreference } from '../types'
import type { FormFieldSchema } from '@/components/pro-form'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ProForm } from '@/components/pro-form'
import {
  getOilLevelOptions,
  getSaltLevelOptions,
  getSpicyLevelOptions,
  getSweetLevelOptions,
} from '../constants'
import { ensureFamilyFormFieldComponents } from './fields/family-form-registry'

defineOptions({ name: 'MemberPreferenceForm' })

const props = defineProps<{
  modelValue: MemberPreference
  isBabyRole?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: MemberPreference): void
}>()

ensureFamilyFormFieldComponents()

const { t } = useI18n()

watch(
  () => props.isBabyRole,
  (isBabyRole) => {
    if (!isBabyRole)
      return

    emit('update:modelValue', {
      ...props.modelValue,
      spicyLevel: 'NONE',
      saltLevel: 'LIGHT',
    })
  },
  { immediate: true, flush: 'sync' },
)

const schema = computed<FormFieldSchema[]>(() => [
  {
    meta: { field: 'tasteTags', label: t('family.form.fields.tasteTags'), valueType: 'array', required: false },
    ui: {
      component: 'FamilyTagInput',
      props: {
        inputAttrs: {
          'data-testid': 'member-preference-taste-input',
          'placeholder': t('family.form.placeholders.tasteTags'),
        },
      },
      layout: { group: t('family.form.groups.preferenceTags'), span: 24 },
    },
  },
  {
    meta: { field: 'avoidIngredients', label: t('family.form.fields.avoidIngredients'), valueType: 'array', required: false },
    ui: {
      component: 'FamilyTagInput',
      props: {
        inputAttrs: {
          'data-testid': 'member-preference-avoid-input',
          'placeholder': t('family.form.placeholders.avoidIngredients'),
        },
      },
      layout: { group: t('family.form.groups.foodRestrictions'), span: 24 },
    },
  },
  {
    meta: { field: 'allergyIngredients', label: t('family.form.fields.allergyIngredients'), valueType: 'array', required: false },
    ui: {
      component: 'FamilyTagInput',
      props: {
        inputAttrs: {
          'data-testid': 'member-preference-allergy-input',
          'placeholder': t('family.form.placeholders.allergyIngredients'),
        },
      },
      layout: { group: t('family.form.groups.foodRestrictions'), span: 24 },
    },
  },
  {
    meta: { field: 'spicyLevel', label: t('family.form.fields.spicyLevel'), valueType: 'string', required: true },
    ui: {
      component: 'Select',
      options: getSpicyLevelOptions(t),
      props: {
        'data-testid': 'member-preference-spicy',
        'placeholder': t('family.form.placeholders.spicyLevel'),
      },
      layout: { group: t('family.form.groups.seasoningLevel'), span: 24 },
    },
    runtime: {
      disabled: props.isBabyRole,
    },
  },
  {
    meta: { field: 'sweetLevel', label: t('family.form.fields.sweetLevel'), valueType: 'string', required: true },
    ui: {
      component: 'Select',
      options: getSweetLevelOptions(t),
      props: {
        'data-testid': 'member-preference-sweet',
        'placeholder': t('family.form.placeholders.sweetLevel'),
      },
      layout: { group: t('family.form.groups.seasoningLevel'), span: 24 },
    },
  },
  {
    meta: { field: 'oilLevel', label: t('family.form.fields.oilLevel'), valueType: 'string', required: true },
    ui: {
      component: 'Select',
      options: getOilLevelOptions(t),
      props: {
        'data-testid': 'member-preference-oil',
        'placeholder': t('family.form.placeholders.oilLevel'),
      },
      layout: { group: t('family.form.groups.seasoningLevel'), span: 24 },
    },
  },
  {
    meta: { field: 'saltLevel', label: t('family.form.fields.saltLevel'), valueType: 'string', required: true },
    ui: {
      component: 'Select',
      options: getSaltLevelOptions(t),
      props: {
        'data-testid': 'member-preference-salt',
        'placeholder': t('family.form.placeholders.saltLevel'),
      },
      layout: { group: t('family.form.groups.seasoningLevel'), span: 24 },
    },
    runtime: {
      disabled: props.isBabyRole,
    },
  },
  {
    meta: { field: 'nutritionGoal', label: t('family.form.fields.nutritionGoal'), valueType: 'string', required: false },
    ui: {
      component: 'Input',
      props: {
        'data-testid': 'member-preference-goal',
        'placeholder': t('family.form.placeholders.nutritionGoal'),
      },
      layout: { group: t('family.form.groups.nutritionRule'), span: 24 },
    },
  },
  {
    meta: { field: 'extraRule', label: t('family.form.fields.extraRule'), valueType: 'string', required: false },
    ui: {
      component: 'Input',
      props: {
        'data-testid': 'member-preference-extra-rule',
        'placeholder': t('family.form.placeholders.extraRule'),
      },
      layout: { group: t('family.form.groups.nutritionRule'), span: 24 },
    },
  },
])
</script>

<template>
  <ProForm
    :schema="schema"
    :model-value="props.modelValue"
    :loading="props.disabled"
    @update:model-value="emit('update:modelValue', $event as MemberPreference)"
  />
</template>
