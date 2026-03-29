import type { SemanticIconName } from '@/components/icon/icon.types'
import type { AppLayoutName } from '@/router/types'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: SemanticIconName
    layout?: AppLayoutName
    menu?: {
      visible?: boolean
      order?: number
      activeMenu?: string
    }
    tab?: {
      enabled?: boolean
      closable?: boolean
      pinned?: boolean
      singleton?: boolean
    }
    keepAlive?: {
      enabled?: boolean
      strategy?: 'routeName' | 'fullPath'
    }
  }
}
