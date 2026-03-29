import type { SemanticIconName } from '@/components/icon/icon.types'

export type AppLayoutName = 'default' | 'blank'

export interface AppRouteMeta extends Record<PropertyKey, unknown> {
  title: string
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

export interface AppRouteRecord {
  name: string
  path: string
  component: string
  children?: AppRouteRecord[]
  meta: AppRouteMeta
}
