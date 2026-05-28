import type { AppRouteRecord } from './types'

export const appRouteSchema: AppRouteRecord[] = [
  {
    name: 'Home',
    path: '/',
    component: 'index',
    meta: {
      title: '首页',
      icon: 'menu-dashboard',
      layout: 'default',
      tab: { enabled: true, closable: false, pinned: true, singleton: true },
      keepAlive: { enabled: false, strategy: 'routeName' },
    },
  },
  {
    name: 'FamilyProfile',
    path: '/family/profile',
    component: 'family-profile',
    meta: {
      title: '家庭画像',
      icon: 'menu-user',
    },
  },
  {
    name: 'RecipeLibrary',
    path: '/recipes',
    component: 'recipe-library',
    meta: {
      title: '菜品库',
      icon: 'menu-recipe',
    },
  },
  {
    name: 'WeeklyMealPlan',
    path: '/weekly-meal-plan',
    component: 'weekly-meal-plan',
    meta: {
      title: '周计划',
      icon: 'menu-plan',
    },
  },
  {
    name: 'PrepPlan',
    path: '/prep-plan',
    component: 'prep-plan',
    meta: {
      title: '备菜计划',
      icon: 'menu-prep',
    },
  },
  {
    name: 'ShoppingList',
    path: '/shopping-list',
    component: 'shopping-list',
    meta: {
      title: '采购清单',
      icon: 'menu-shopping',
    },
  },
]
