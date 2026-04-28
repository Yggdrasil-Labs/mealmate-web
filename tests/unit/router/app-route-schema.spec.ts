import { describe, expect, it } from 'vitest'
import { appRouteSchema } from '@/router/app-route-schema'

describe('app route schema', () => {
  it('declares home route', () => {
    expect(appRouteSchema.some(route => route.path === '/')).toBe(true)
  })

  it('declares family profile route', () => {
    const familyProfile = appRouteSchema.find(route => route.name === 'FamilyProfile')

    expect(familyProfile).toMatchObject({
      name: 'FamilyProfile',
      path: '/family/profile',
      component: 'family-profile',
      meta: {
        title: '家庭画像',
      },
    })
  })

  it('declares recipe library route', () => {
    const recipeLibrary = appRouteSchema.find(route => route.name === 'RecipeLibrary')

    expect(recipeLibrary).toMatchObject({
      name: 'RecipeLibrary',
      path: '/recipes',
      component: 'recipe-library',
      meta: {
        title: '菜品库',
        icon: 'menu-recipe',
      },
    })
  })

  it('marks home as pinned tab', () => {
    const home = appRouteSchema.find(route => route.path === '/')
    expect(home?.meta.tab?.pinned).toBe(true)
  })

  it('declares semantic icons for menu routes', () => {
    expect(appRouteSchema.every(route => typeof route.meta.icon === 'string' && route.meta.icon.length > 0)).toBe(true)
  })
})
