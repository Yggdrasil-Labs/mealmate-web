// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import i18n, { setLocale } from '@/locales/i18n'
import FamilyMemberCard from '@/modules/family/components/FamilyMemberCard.vue'

const mountedApps: Array<{ unmount: () => void }> = []

afterEach(() => {
  mountedApps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
})

function mountCard() {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const onEdit = vi.fn()
  const onDelete = vi.fn()

  const member = ref({
    memberId: 'member-baby',
    name: '小满',
    roleType: 'BABY',
    gender: 'OTHER',
    birthday: '2023-07-01',
    region: '杭州',
    targetType: 'BABY_FRIENDLY',
    avatarUrl: '',
    sortNo: 3,
    preferenceSummary: {
      tasteTags: ['软烂', '原味'],
      avoidIngredientCount: 1,
      allergyIngredientCount: 1,
      spicyLevel: 'NONE',
      sweetLevel: 'NONE',
      oilLevel: 'LIGHT',
      saltLevel: 'LIGHT',
    },
  })

  const Host = defineComponent({
    setup() {
      return () =>
        h(FamilyMemberCard, {
          member: member.value,
          onEdit,
          onDelete,
        })
    },
  })

  const app = createApp(Host)
  app.use(i18n)
  app.mount(container)

  const mounted = {
    onEdit,
    onDelete,
    unmount() {
      app.unmount()
      container.remove()
    },
  }
  mountedApps.push(mounted)
  return mounted
}

describe('familyMemberCard', () => {
  it('renders role, target type, and preference summary', async () => {
    await setLocale('zh-CN')
    mountCard()
    await nextTick()

    expect(document.body.querySelector('[data-testid="family-member-name"]')?.textContent).toContain('小满')
    expect(document.body.querySelector('[data-testid="family-member-role"]')?.textContent).toContain('宝宝')
    expect(document.body.querySelector('[data-testid="family-member-target"]')?.textContent).toContain('宝宝适配')
    expect(document.body.querySelector('[data-testid="family-member-preference"]')?.textContent).toContain('软烂')
    expect(document.body.querySelector('[data-testid="family-member-preference"]')?.textContent).toContain('少盐')
  })

  it('emits edit and delete actions', async () => {
    await setLocale('zh-CN')
    const card = mountCard()
    await nextTick()

    document.body.querySelector('[data-testid="family-member-edit"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.body.querySelector('[data-testid="family-member-delete"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(card.onEdit).toHaveBeenCalledTimes(1)
    expect(card.onDelete).toHaveBeenCalledTimes(1)
    expect(card.onEdit).toHaveBeenCalledWith('member-baby')
    expect(card.onDelete).toHaveBeenCalledWith('member-baby')
  })
})
