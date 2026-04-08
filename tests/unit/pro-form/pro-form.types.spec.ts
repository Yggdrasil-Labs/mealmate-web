import type { UpdateFamilyMemberPayload } from '@/modules/family/types'
import type { ProFormProps } from '@/types/pro-form'
import { describe, expectTypeOf, it } from 'vitest'

function createFamilyMemberPayload(): UpdateFamilyMemberPayload {
  return {
    name: '小满',
    roleType: 'BABY',
    gender: 'OTHER',
    birthday: '2023-07-01',
    region: '杭州',
    targetType: 'BABY_FRIENDLY',
    avatarUrl: '',
    sortNo: 3,
  }
}

describe('proForm types', () => {
  it('accepts typed business payloads as modelValue', () => {
    const payload = createFamilyMemberPayload()
    const modelValue: ProFormProps['modelValue'] = payload

    const props = {
      schema: [],
      modelValue,
    } satisfies ProFormProps

    expectTypeOf(props.modelValue).toEqualTypeOf<UpdateFamilyMemberPayload>()
  })
})
