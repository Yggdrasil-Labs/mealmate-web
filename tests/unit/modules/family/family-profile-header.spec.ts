// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import i18n, { setLocale } from '@/locales/i18n'
import FamilyProfileHeader from '@/modules/family/components/FamilyProfileHeader.vue'
import { DEFAULT_FAMILY_ID } from '@/modules/family/constants'

const mountedApps: Array<{ unmount: () => void }> = []

afterEach(() => {
  mountedApps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
})

function mountHeader() {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const onAdd = vi.fn()

  const summary = ref({
    familyId: DEFAULT_FAMILY_ID,
    familyName: 'MealMate 家庭',
    region: '杭州',
    mealGoal: '工作日晚餐均衡、周末兼顾宝宝适配',
  })
  const memberCount = ref(3)

  const Host = defineComponent({
    setup() {
      return () =>
        h(FamilyProfileHeader, {
          summary: summary.value,
          memberCount: memberCount.value,
          onAddMember: onAdd,
        })
    },
  })

  const app = createApp(Host)
  app.use(i18n)
  app.mount(container)

  const mounted = {
    onAdd,
    unmount() {
      app.unmount()
      container.remove()
    },
  }
  mountedApps.push(mounted)
  return mounted
}

describe('familyProfileHeader', () => {
  it('displays family summary fields', async () => {
    await setLocale('zh-CN')
    mountHeader()
    await nextTick()

    expect(document.body.querySelector('[data-testid="family-profile-title"]')?.textContent).toContain('MealMate 家庭')
    expect(document.body.querySelector('[data-testid="family-profile-region"]')?.textContent).toContain('杭州')
    expect(document.body.querySelector('[data-testid="family-profile-goal"]')?.textContent).toContain('工作日晚餐均衡')
    expect(document.body.querySelector('[data-testid="family-profile-count"]')?.textContent).toContain('3')
  })

  it('emits add action from the primary button', async () => {
    await setLocale('zh-CN')
    const header = mountHeader()
    await nextTick()

    document.body.querySelector('[data-testid="family-profile-add"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(header.onAdd).toHaveBeenCalledTimes(1)
  })
})
