import type { SemanticIconName } from '@/components/icon/icon.types'
import { acceptHMRUpdate, defineStore } from 'pinia'

export interface MenuNode {
  key: string
  path: string
  title: string
  icon?: SemanticIconName
  order?: number
  hidden?: boolean
  children?: MenuNode[]
}

function findAncestorKeys(nodes: MenuNode[], targetKey: string, parents: string[] = []): string[] {
  for (const node of nodes) {
    if (node.key === targetKey)
      return parents

    if (node.children?.length) {
      const nested = findAncestorKeys(node.children, targetKey, [...parents, node.key])
      if (nested.length > 0)
        return nested

      if (node.children.some(child => child.key === targetKey))
        return [...parents, node.key]
    }
  }

  return []
}

export const useMenuStore = defineStore('menu', () => {
  const tree = ref<MenuNode[]>([])
  const activeKey = ref<string | null>(null)
  const openKeys = ref<string[]>([])

  function setTree(nextTree: MenuNode[]) {
    tree.value = nextTree
  }

  function setActiveKey(key: string | null) {
    activeKey.value = key
  }

  function setOpenKeys(keys: string[]) {
    openKeys.value = [...keys]
  }

  function syncRoute(nextActiveKey: string | null, nextOpenKeys?: string[]) {
    activeKey.value = nextActiveKey
    openKeys.value = nextOpenKeys
      ? [...nextOpenKeys]
      : nextActiveKey
        ? findAncestorKeys(tree.value, nextActiveKey)
        : []
  }

  function clear() {
    tree.value = []
    activeKey.value = null
    openKeys.value = []
  }

  return {
    tree,
    activeKey,
    openKeys,
    setTree,
    setActiveKey,
    setOpenKeys,
    syncRoute,
    clear,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot))
