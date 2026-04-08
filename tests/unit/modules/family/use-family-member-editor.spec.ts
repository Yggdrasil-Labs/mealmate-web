import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as familyApi from '@/modules/family/api'
import { useFamilyMemberEditor } from '@/modules/family/composables/useFamilyMemberEditor'
import { DEFAULT_FAMILY_ID } from '@/modules/family/constants'
import { createDefaultFamilyMemberFormValues, resetFamilyMockData } from '@/modules/family/mock'
import { useFamilyStore } from '@/modules/family/store'

vi.mock('@/config/env', () => ({
  env: {
    USE_MOCK: true,
  },
}))

beforeEach(() => {
  setActivePinia(createPinia())
  resetFamilyMockData()
})

function createEditorWithExistingFamily() {
  const store = useFamilyStore()
  store.activeFamilyId = DEFAULT_FAMILY_ID
  return useFamilyMemberEditor()
}

describe('useFamilyMemberEditor', () => {
  it('uses safe default values in add mode', () => {
    const editor = useFamilyMemberEditor()

    editor.openAdd()

    const defaults = createDefaultFamilyMemberFormValues()
    expect(editor.mode.value).toBe('add')
    expect(editor.memberId.value).toBeNull()
    expect(editor.basicForm.roleType).toBe(defaults.roleType)
    expect(editor.preferenceForm.spicyLevel).toBe(defaults.preference.spicyLevel)
    expect(editor.preferenceForm.saltLevel).toBe(defaults.preference.saltLevel)
  })

  it('loads member detail in edit mode', async () => {
    const editor = createEditorWithExistingFamily()

    await editor.openEdit('member-baby')

    expect(editor.mode.value).toBe('edit')
    expect(editor.memberId.value).toBe('member-baby')
    expect(editor.basicForm.name).toBe('小满')
    expect(editor.preferenceForm.extraRule).toBe('避免辛辣和大块食材')
  })

  it('forces baby-safe spicy and salt levels when role is BABY', () => {
    const editor = useFamilyMemberEditor()

    editor.openAdd()
    editor.preferenceForm.spicyLevel = 'HEAVY'
    editor.preferenceForm.saltLevel = 'HEAVY'

    editor.basicForm.roleType = 'BABY'

    expect(editor.preferenceForm.spicyLevel).toBe('NONE')
    expect(editor.preferenceForm.saltLevel).toBe('LIGHT')
  })

  it('save-all only calls changed endpoints in edit mode', async () => {
    const editor = createEditorWithExistingFamily()
    const updateMemberSpy = vi.spyOn(familyApi, 'updateFamilyMember')
    const updatePreferenceSpy = vi.spyOn(familyApi, 'updateFamilyMemberPreference')

    await editor.openEdit('member-self')

    editor.preferenceForm.extraRule = '晚餐继续优先蒸煮'

    await editor.save()

    expect(updateMemberSpy).not.toHaveBeenCalled()
    expect(updatePreferenceSpy).toHaveBeenCalledTimes(1)
    expect(updatePreferenceSpy).toHaveBeenCalledWith(
      DEFAULT_FAMILY_ID,
      'member-self',
      expect.objectContaining({
        extraRule: '晚餐继续优先蒸煮',
      }),
    )
  })

  it('delete flow refreshes shared family data', async () => {
    const store = useFamilyStore()
    store.activeFamilyId = DEFAULT_FAMILY_ID
    const refreshSpy = vi.spyOn(store, 'refreshFamilyProfile')
    const editor = useFamilyMemberEditor()

    await editor.openEdit('member-baby')
    await editor.remove()

    expect(refreshSpy).toHaveBeenCalledTimes(1)
    expect(store.memberList.some(member => member.memberId === 'member-baby')).toBe(false)
  })

  it('supports delete without requiring detail request', async () => {
    const store = useFamilyStore()
    store.activeFamilyId = DEFAULT_FAMILY_ID
    const refreshSpy = vi.spyOn(store, 'refreshFamilyProfile')
    const detailSpy = vi.spyOn(familyApi, 'fetchFamilyMemberDetail')
    const editor = useFamilyMemberEditor()

    editor.selectMember('member-baby')
    await editor.remove()

    expect(detailSpy).not.toHaveBeenCalled()
    expect(refreshSpy).toHaveBeenCalledTimes(1)
    expect(store.memberList.some(member => member.memberId === 'member-baby')).toBe(false)
  })
})
