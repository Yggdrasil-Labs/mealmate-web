export type KeepAliveStrategy = 'routeName' | 'fullPath'

interface CacheRouteLike {
  name?: string | symbol | null
  path: string
  fullPath: string
  meta: {
    keepAlive?: {
      strategy?: KeepAliveStrategy
    }
  }
}

interface CacheTabLike {
  routeName: string
  fullPath: string
}

export function buildRouteCacheKey(route: CacheRouteLike) {
  const routeName = String(route.name ?? route.path)
  const strategy = route.meta.keepAlive?.strategy ?? 'routeName'

  return buildCacheKey({
    routeName,
    fullPath: route.fullPath,
    strategy,
  })
}

export function buildTabCacheKey(tab: CacheTabLike, strategy: KeepAliveStrategy = 'routeName') {
  return buildCacheKey({
    routeName: tab.routeName,
    fullPath: tab.fullPath,
    strategy,
  })
}

export { getKeepAliveIncludeName } from '@/utils/cache-key'

function buildCacheKey(input: { routeName: string, fullPath: string, strategy: KeepAliveStrategy }) {
  if (input.strategy === 'fullPath')
    return `${input.routeName}:${input.fullPath}`

  return input.routeName
}
