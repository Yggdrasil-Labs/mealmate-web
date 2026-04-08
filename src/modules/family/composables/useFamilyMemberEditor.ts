import type {
  CreateFamilyMemberPayload,
  FamilyMemberDetail,
  MemberPreference,
  UpdateFamilyMemberPayload,
} from '../types'
import { reactive, shallowRef, watch } from 'vue'
import {
  createFamilyMember,
  deleteFamilyMember,
  fetchFamilyMemberDetail,
  updateFamilyMember,
  updateFamilyMemberPreference,
} from '../api'
import { createDefaultFamilyMemberFormValues } from '../mock'
import { useFamilyStore } from '../store'

type EditorMode = 'add' | 'edit'

function clonePreference(preference: MemberPreference): MemberPreference {
  return {
    tasteTags: [...preference.tasteTags],
    avoidIngredients: [...preference.avoidIngredients],
    allergyIngredients: [...preference.allergyIngredients],
    spicyLevel: preference.spicyLevel,
    sweetLevel: preference.sweetLevel,
    oilLevel: preference.oilLevel,
    saltLevel: preference.saltLevel,
    nutritionGoal: preference.nutritionGoal,
    extraRule: preference.extraRule,
  }
}

function createBasicPayload(payload: CreateFamilyMemberPayload): UpdateFamilyMemberPayload {
  return {
    name: payload.name,
    roleType: payload.roleType,
    gender: payload.gender,
    birthday: payload.birthday,
    region: payload.region,
    targetType: payload.targetType,
    avatarUrl: payload.avatarUrl,
    sortNo: payload.sortNo,
  }
}

function applyBasicPayload(target: UpdateFamilyMemberPayload, payload: UpdateFamilyMemberPayload) {
  Object.assign(target, payload)
}

function applyPreferencePayload(target: MemberPreference, payload: MemberPreference) {
  Object.assign(target, clonePreference(payload))
}

function isSameValue(left: unknown, right: unknown) {
  return JSON.stringify(left) === JSON.stringify(right)
}

export function useFamilyMemberEditor() {
  const store = useFamilyStore()
  const defaults = createDefaultFamilyMemberFormValues()

  const mode = shallowRef<EditorMode>('add')
  const memberId = shallowRef<string | null>(null)
  const loading = shallowRef(false)
  const error = shallowRef<Error | null>(null)

  const basicForm = reactive<UpdateFamilyMemberPayload>(createBasicPayload(defaults))
  const preferenceForm = reactive<MemberPreference>(clonePreference(defaults.preference))

  const originalBasic = shallowRef<UpdateFamilyMemberPayload | null>(null)
  const originalPreference = shallowRef<MemberPreference | null>(null)

  function enforceBabyPreferenceRule() {
    if (basicForm.roleType !== 'BABY')
      return

    preferenceForm.spicyLevel = 'NONE'
    preferenceForm.saltLevel = 'LIGHT'
  }

  function resetToAddDefaults() {
    const nextDefaults = createDefaultFamilyMemberFormValues()
    applyBasicPayload(basicForm, createBasicPayload(nextDefaults))
    applyPreferencePayload(preferenceForm, nextDefaults.preference)
    originalBasic.value = null
    originalPreference.value = null
    memberId.value = null
    mode.value = 'add'
    error.value = null
  }

  function selectMember(nextMemberId: string) {
    memberId.value = nextMemberId
    mode.value = 'edit'
    error.value = null
  }

  function applyDetail(detail: FamilyMemberDetail) {
    const nextBasic = createBasicPayload(detail)
    const nextPreference = clonePreference(detail.preference)

    applyBasicPayload(basicForm, nextBasic)
    applyPreferencePayload(preferenceForm, nextPreference)

    originalBasic.value = structuredClone(nextBasic)
    originalPreference.value = clonePreference(nextPreference)
    memberId.value = detail.memberId
    mode.value = 'edit'
    error.value = null
  }

  async function openEdit(nextMemberId: string) {
    loading.value = true
    error.value = null

    try {
      const detail = await fetchFamilyMemberDetail(store.activeFamilyId, nextMemberId)
      applyDetail(detail)
    }
    catch (loadError) {
      error.value = loadError instanceof Error ? loadError : new Error('成员详情加载失败')
      throw error.value
    }
    finally {
      loading.value = false
    }
  }

  async function save() {
    loading.value = true
    error.value = null

    try {
      if (mode.value === 'add') {
        const created = await createFamilyMember(store.activeFamilyId, {
          ...basicForm,
          preference: clonePreference(preferenceForm),
        })

        await store.refreshFamilyProfile()
        applyDetail(created)
        return created
      }

      if (!memberId.value)
        throw new Error('编辑模式缺少成员 ID')

      const basicChanged = !isSameValue(basicForm, originalBasic.value)
      const preferenceChanged = !isSameValue(preferenceForm, originalPreference.value)

      if (basicChanged) {
        await updateFamilyMember(store.activeFamilyId, memberId.value, {
          ...basicForm,
        })
      }

      if (preferenceChanged) {
        await updateFamilyMemberPreference(store.activeFamilyId, memberId.value, clonePreference(preferenceForm))
      }

      await store.refreshFamilyProfile()
      originalBasic.value = structuredClone({ ...basicForm })
      originalPreference.value = clonePreference(preferenceForm)

      return {
        basicChanged,
        preferenceChanged,
      }
    }
    catch (saveError) {
      error.value = saveError instanceof Error ? saveError : new Error('成员保存失败')
      throw error.value
    }
    finally {
      loading.value = false
    }
  }

  async function remove() {
    if (!memberId.value)
      throw new Error('删除成员前缺少成员 ID')

    loading.value = true
    error.value = null

    try {
      await deleteFamilyMember(store.activeFamilyId, memberId.value)
      await store.refreshFamilyProfile()
      resetToAddDefaults()
    }
    catch (removeError) {
      error.value = removeError instanceof Error ? removeError : new Error('成员删除失败')
      throw error.value
    }
    finally {
      loading.value = false
    }
  }

  watch(() => basicForm.roleType, enforceBabyPreferenceRule, { flush: 'sync' })

  resetToAddDefaults()

  return {
    mode,
    memberId,
    loading,
    error,
    basicForm,
    preferenceForm,
    openAdd: resetToAddDefaults,
    selectMember,
    openEdit,
    save,
    remove,
  }
}
