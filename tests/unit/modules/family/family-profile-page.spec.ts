// @vitest-environment jsdom
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick } from 'vue'

import i18n, { setLocale } from '@/locales/i18n'
import { DEFAULT_FAMILY_ID } from '@/modules/family/constants'
import { resetFamilyMockData } from '@/modules/family/mock'
import { useFamilyStore } from '@/modules/family/store'
import FamilyProfilePage from '@/pages/family-profile.vue'

vi.mock('@/config/env', () => ({
  env: {
    USE_MOCK: true,
  },
}))

const mountedApps: Array<{ unmount: () => void }> = []

afterEach(() => {
  mountedApps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
})

async function flush(times = 2) {
  for (let index = 0; index < times; index += 1)
    await Promise.resolve().then(() => nextTick())
}

function mountPage() {
  const container = document.createElement('div')
  document.body.appendChild(container)

  const Host = defineComponent({
    setup() {
      return () => h(FamilyProfilePage)
    },
  })

  const app = createApp(Host)
  const pinia = createPinia()
  setActivePinia(pinia)
  const store = useFamilyStore()
  store.activeFamilyId = DEFAULT_FAMILY_ID
  app.use(pinia)
  app.use(i18n)
  app.mount(container)

  const mounted = {
    async flush() {
      await flush(4)
    },
    unmount() {
      app.unmount()
      container.remove()
    },
  }
  mountedApps.push(mounted)
  return mounted
}

describe('family profile page', () => {
  it('loads summary and member grid', async () => {
    await setLocale('zh-CN')
    resetFamilyMockData()
    const page = mountPage()
    await page.flush()

    expect(document.body.querySelector('[data-testid="family-profile-title"]')?.textContent).toContain('MealMate 家庭')
    expect(document.body.querySelector('[data-testid="family-member-name"]')?.textContent).toContain('杨阳')
  })

  it('clicking add opens the drawer', async () => {
    await setLocale('zh-CN')
    resetFamilyMockData()
    const page = mountPage()
    await page.flush()

    document.body.querySelector('[data-testid="family-profile-add"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await page.flush()

    expect(document.body.querySelector('[data-testid="family-member-drawer-title"]')?.textContent).toContain('新增成员')
  })

  it('clicking edit opens the drawer in edit mode', async () => {
    await setLocale('zh-CN')
    resetFamilyMockData()
    const page = mountPage()
    await page.flush()

    document.body.querySelector('[data-testid="family-member-edit"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await page.flush()

    expect(document.body.querySelector('[data-testid="family-member-drawer-title"]')?.textContent).toContain('编辑成员')
  })

  it('clicking delete opens confirmation', async () => {
    await setLocale('zh-CN')
    resetFamilyMockData()
    const page = mountPage()
    await page.flush()

    document.body.querySelector('[data-testid="family-member-delete"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await page.flush()

    expect(document.body.querySelector('[data-testid="family-member-delete-confirm"]')).not.toBeNull()
  })
})
