import { createPinia, setActivePinia } from 'pinia'
// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createApp, defineComponent, h, nextTick, reactive } from 'vue'
import i18n, { setLocale } from '@/locales/i18n'
import FamilyMemberForm from '@/modules/family/components/FamilyMemberForm.vue'

const mountedApps: Array<{ unmount: () => void }> = []

beforeEach(() => {
  setActivePinia(createPinia())
})

afterEach(() => {
  mountedApps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
})

function mountForm() {
  const container = document.createElement('div')
  document.body.appendChild(container)

  const model = reactive({
    name: '小满',
    roleType: 'BABY',
    gender: 'OTHER',
    birthday: '2023-07-01',
    region: '杭州',
    targetType: 'BABY_FRIENDLY',
    avatarUrl: '',
    sortNo: 3,
  })

  const Host = defineComponent({
    setup() {
      return () =>
        h(FamilyMemberForm, {
          'modelValue': model,
          'onUpdate:modelValue': (next: typeof model) => Object.assign(model, next),
        })
    },
  })

  const app = createApp(Host)
  app.use(i18n)
  app.mount(container)

  const mounted = {
    model,
    unmount() {
      app.unmount()
      container.remove()
    },
  }
  mountedApps.push(mounted)
  return mounted
}

describe('familyMemberForm', () => {
  it('renders role/target selects with options and supports select updates', async () => {
    await setLocale('zh-CN')
    const form = mountForm()
    await nextTick()

    const targetSelect = document.body.querySelector('[data-testid="family-member-form-target"]') as any
    const targetVm = targetSelect?.__vueParentComponent?.proxy as any

    expect(targetVm).toBeTruthy()
    const optionCount = targetVm?.states?.optionValues?.length ?? 0
    expect(optionCount).toBeGreaterThan(0)

    targetSelect.__vueParentComponent.emit('update:modelValue', 'BALANCED')
    await nextTick()

    expect(form.model.targetType).toBe('BALANCED')
  })
})
