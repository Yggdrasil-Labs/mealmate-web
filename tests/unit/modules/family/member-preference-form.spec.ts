import { createPinia, setActivePinia } from 'pinia'
// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createApp, defineComponent, h, nextTick, reactive, ref } from 'vue'
import i18n, { setLocale } from '@/locales/i18n'
import MemberPreferenceForm from '@/modules/family/components/MemberPreferenceForm.vue'

const mountedApps: Array<{ unmount: () => void }> = []

beforeEach(() => {
  setActivePinia(createPinia())
})

afterEach(() => {
  mountedApps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
})

function mountPreferenceForm(isBabyRole = false) {
  const container = document.createElement('div')
  document.body.appendChild(container)

  const model = reactive({
    tasteTags: ['软烂'],
    avoidIngredients: [],
    allergyIngredients: [],
    spicyLevel: 'NONE',
    sweetLevel: 'NONE',
    oilLevel: 'LIGHT',
    saltLevel: 'LIGHT',
    nutritionGoal: '',
    extraRule: '',
  })
  const baby = ref(isBabyRole)

  const Host = defineComponent({
    setup() {
      return () =>
        h(MemberPreferenceForm, {
          'modelValue': model,
          'isBabyRole': baby.value,
          'onUpdate:modelValue': (next: typeof model) => Object.assign(model, next),
        })
    },
  })

  const app = createApp(Host)
  app.use(i18n)
  app.mount(container)

  const mounted = {
    model,
    baby,
    unmount() {
      app.unmount()
      container.remove()
    },
  }
  mountedApps.push(mounted)
  return mounted
}

describe('memberPreferenceForm', () => {
  it('supports enter and comma tokenization for tag-like inputs', async () => {
    await setLocale('zh-CN')
    const form = mountPreferenceForm()
    await nextTick()

    const tasteInput = (document.body.querySelector('[data-testid="member-preference-taste-input"]') as HTMLInputElement | null)
      ?? (document.body.querySelector('[data-testid="member-preference-taste-input"] .el-input__inner') as HTMLInputElement | null)
    const avoidInput = (document.body.querySelector('[data-testid="member-preference-avoid-input"]') as HTMLInputElement | null)
      ?? (document.body.querySelector('[data-testid="member-preference-avoid-input"] .el-input__inner') as HTMLInputElement | null)

    expect(tasteInput).not.toBeNull()
    expect(avoidInput).not.toBeNull()

    tasteInput!.value = '汤羹'
    tasteInput!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

    avoidInput!.value = '香菜,葱'
    avoidInput!.dispatchEvent(new KeyboardEvent('keydown', { key: ',', bubbles: true }))

    expect(form.model.tasteTags).toEqual(['软烂', '汤羹'])
    expect(form.model.avoidIngredients).toEqual(['香菜', '葱'])
  })

  it('renders spicy select options and supports updates when baby lock is off', async () => {
    await setLocale('zh-CN')
    const form = mountPreferenceForm(false)
    await nextTick()

    const spicySelect = document.body.querySelector('[data-testid="member-preference-spicy"]') as any
    const spicyVm = spicySelect?.__vueParentComponent?.proxy as any

    expect(spicyVm).toBeTruthy()
    const optionCount = spicyVm?.states?.optionValues?.length ?? 0
    expect(optionCount).toBeGreaterThan(0)

    spicySelect.__vueParentComponent.emit('update:modelValue', 'MEDIUM')
    await nextTick()

    expect(form.model.spicyLevel).toBe('MEDIUM')
  })
})
