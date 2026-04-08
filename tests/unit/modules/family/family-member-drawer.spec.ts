// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, reactive, ref } from 'vue'
import i18n, { setLocale } from '@/locales/i18n'
import FamilyMemberDrawer from '@/modules/family/components/FamilyMemberDrawer.vue'

const mountedApps: Array<{ unmount: () => void }> = []

afterEach(() => {
  mountedApps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
})

function createBasicForm() {
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

function createPreferenceForm() {
  return {
    tasteTags: ['软烂'],
    avoidIngredients: [],
    allergyIngredients: [],
    spicyLevel: 'NONE',
    sweetLevel: 'NONE',
    oilLevel: 'LIGHT',
    saltLevel: 'LIGHT',
    nutritionGoal: '',
    extraRule: '',
  }
}

function mountDrawer() {
  const container = document.createElement('div')
  document.body.appendChild(container)

  const visible = ref(true)
  const mode = ref<'add' | 'edit'>('add')
  const detailLoading = ref(false)
  const basicForm = reactive(createBasicForm())
  const preferenceForm = reactive(createPreferenceForm())
  const events = {
    save: vi.fn(),
    delete: vi.fn(),
  }

  const Host = defineComponent({
    setup() {
      return () =>
        h(FamilyMemberDrawer, {
          'modelValue': visible.value,
          'mode': mode.value,
          'detailLoading': detailLoading.value,
          basicForm,
          preferenceForm,
          'isBabyRole': basicForm.roleType === 'BABY',
          'onUpdate:modelValue': (next: boolean) => {
            visible.value = next
          },
          'onUpdate:basicForm': (next: typeof basicForm) => Object.assign(basicForm, next),
          'onUpdate:preferenceForm': (next: typeof preferenceForm) => Object.assign(preferenceForm, next),
          'onSave': events.save,
          'onDelete': events.delete,
        })
    },
  })

  const app = createApp(Host)
  app.use(i18n)
  app.mount(container)

  const mounted = {
    visible,
    mode,
    detailLoading,
    basicForm,
    preferenceForm,
    events,
    unmount() {
      app.unmount()
      container.remove()
    },
  }
  mountedApps.push(mounted)
  return mounted
}

describe('familyMemberDrawer', () => {
  it('opens in add and edit modes', async () => {
    await setLocale('zh-CN')
    const drawer = mountDrawer()
    await nextTick()

    expect(document.body.querySelector('[data-testid="family-member-drawer-title"]')?.textContent).toContain('新增成员')

    drawer.mode.value = 'edit'
    await nextTick()

    expect(document.body.querySelector('[data-testid="family-member-drawer-title"]')?.textContent).toContain('编辑成员')
  })

  it('renders overlay mask when drawer is visible', async () => {
    await setLocale('zh-CN')
    mountDrawer()
    await nextTick()

    expect(document.body.querySelector('.el-overlay')).not.toBeNull()
  })

  it('shows detail loading state during edit fetch', async () => {
    await setLocale('zh-CN')
    const drawer = mountDrawer()
    drawer.mode.value = 'edit'
    drawer.detailLoading.value = true
    await nextTick()

    expect(document.body.querySelector('[data-testid="family-member-drawer-loading"]')?.textContent).toContain('加载中')
  })

  it('emits save with the expected payload', async () => {
    await setLocale('zh-CN')
    const drawer = mountDrawer()
    await nextTick()

    document.body.querySelector('[data-testid="family-member-drawer-save"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(drawer.events.save).toHaveBeenCalledWith({
      basicForm: expect.objectContaining({
        name: '小满',
      }),
      preferenceForm: expect.objectContaining({
        spicyLevel: 'NONE',
      }),
    })
  })
})
