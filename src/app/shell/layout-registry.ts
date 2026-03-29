import type { Component } from 'vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

export const layoutRegistry: Record<string, Component> = {
  default: DefaultLayout,
  blank: BlankLayout,
}

export function resolveLayout(name?: string) {
  return layoutRegistry[name ?? 'default'] ?? DefaultLayout
}
