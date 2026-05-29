<script setup lang="ts">
import type { AppRouteRecord } from '@/router/types'
import type { MenuNode } from '@/stores/menu'
import { useWindowSize } from '@vueuse/core'
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppPageRenderer from '@/app/shell/AppPageRenderer.vue'
import { buildTabCacheKey } from '@/app/shell/route-cache'
import { normalizedAppRouteSchema } from '@/router/app-route-tree'
import { useAppShellStore, useKeepAliveStore, useMenuStore, useTabsStore } from '@/stores'
import AppHeader from './components/AppHeader.vue'
import AppSider from './components/AppSider.vue'
import AppTabs from './components/AppTabs.vue'

const route = useRoute()
const router = useRouter()
const { width } = useWindowSize()

const appShellStore = useAppShellStore()
const keepAliveStore = useKeepAliveStore()
const menuStore = useMenuStore()
const tabsStore = useTabsStore()

const currentPageTitle = computed(() => {
  return String(route.meta.title ?? 'MealMate Web')
})

const menuTree = computed<MenuNode[]>(() => {
  return normalizedAppRouteSchema
    .map(routeItem => toMenuNode(routeItem))
    .filter((item): item is MenuNode => Boolean(item))
})

const isMobile = computed(() => appShellStore.device === 'mobile')
const isDrawerVisible = computed(() => appShellStore.drawerVisible)
const isCollapsed = computed(() => appShellStore.siderCollapsed)

onMounted(() => {
  menuStore.setTree(menuTree.value)
})

watch(width, (nextWidth) => {
  appShellStore.setViewportWidth(nextWidth)
}, { immediate: true })

function handleMenuSelect(key: string) {
  const target = findRouteByKey(normalizedAppRouteSchema, key)
  if (!target)
    return

  router.push(target.path)
  if (isMobile.value)
    appShellStore.closeDrawer()
}

function handleTabSelect(key: string) {
  const target = tabsStore.items.find(item => item.key === key)
  if (target)
    router.push(target.path)
}

function handleTabClose(key: string) {
  const target = tabsStore.items.find(item => item.key === key)
  const wasActive = tabsStore.activeKey === key

  tabsStore.close(key)
  if (target)
    keepAliveStore.invalidate(getTabCacheKey(target.routeName, target.fullPath))

  if (wasActive) {
    const fallback = tabsStore.items.find(item => item.key !== key) ?? null
    if (fallback)
      router.push(fallback.path)
  }

  if (!tabsStore.items.length && target)
    router.push(target.path)
}

function handleTabCloseOthers(key: string) {
  const remainingCacheKeys = tabsStore.items
    .filter(item => item.pinned || item.key === key)
    .map(item => getTabCacheKey(item.routeName, item.fullPath))

  tabsStore.closeOthers(key)
  keepAliveStore.retain(remainingCacheKeys)

  const target = tabsStore.items.find(item => item.key === key)
  if (target)
    router.push(target.path)
}

function handleTabRefresh(key: string) {
  const target = tabsStore.items.find(item => item.key === key)
  if (target)
    keepAliveStore.invalidate(getTabCacheKey(target.routeName, target.fullPath))
  tabsStore.refresh(key)
}

function handleSiderToggle() {
  if (isMobile.value) {
    appShellStore.toggleDrawer()
    return
  }

  appShellStore.toggleSiderCollapsed()
}

function handleHeaderToggle() {
  handleSiderToggle()
}

function toMenuNode(routeItem: AppRouteRecord): MenuNode | null {
  if (routeItem.meta.menu?.visible === false)
    return null

  return {
    key: routeItem.name,
    path: routeItem.path,
    title: routeItem.meta.title,
    icon: routeItem.meta.icon,
    order: routeItem.meta.menu?.order,
    hidden: false,
    children: routeItem.children?.map(child => toMenuNode(child)).filter((item): item is MenuNode => Boolean(item)),
  }
}

function findRouteByKey(routes: AppRouteRecord[], key: string): AppRouteRecord | null {
  for (const routeItem of routes) {
    if (routeItem.name === key)
      return routeItem

    if (routeItem.children) {
      const nested = findRouteByKey(routeItem.children, key)
      if (nested)
        return nested
    }
  }

  return null
}

function getTabCacheKey(routeName: string, fullPath: string) {
  const routeItem = findRouteByKey(normalizedAppRouteSchema, routeName)
  const strategy = routeItem?.meta.keepAlive?.strategy ?? 'routeName'

  return buildTabCacheKey({ routeName, fullPath }, strategy)
}
</script>

<template>
  <div class="default-layout" data-scroll-boundary="viewport" data-density="compact">
    <div class="default-layout__shell" data-scroll-boundary="viewport" data-density="compact">
      <AppHeader
        :title="currentPageTitle"
        :device="appShellStore.device"
        :collapsed="isCollapsed"
        :drawer-visible="isDrawerVisible"
        @toggle-nav="handleHeaderToggle"
      />

      <div class="default-layout__body" data-scroll-boundary="viewport" data-density="compact">
        <AppSider
          :tree="menuStore.tree"
          :active-key="menuStore.activeKey"
          :open-keys="menuStore.openKeys"
          :collapsed="isCollapsed"
          :mobile="isMobile"
          :drawer-visible="isDrawerVisible"
          @select="handleMenuSelect"
          @toggle-collapse="handleSiderToggle"
          @close-drawer="appShellStore.closeDrawer()"
        />

        <div class="default-layout__content" data-scroll-boundary="viewport" data-density="compact">
          <AppTabs
            v-if="!isMobile"
            :items="tabsStore.items"
            :active-key="tabsStore.activeKey"
            @select="handleTabSelect"
            @close="handleTabClose"
            @close-others="handleTabCloseOthers"
            @refresh="handleTabRefresh"
          />

          <main class="default-layout__main" data-scroll-boundary="main" data-density="compact">
            <div class="default-layout__main-surface" data-density="compact">
              <div class="default-layout__page-container" data-layout="page">
                <AppPageRenderer />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.default-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  padding: var(--shell-frame-padding);
  background:
    radial-gradient(circle at top left, rgba(47, 111, 235, 0.08), transparent 28%),
    radial-gradient(circle at top right, rgba(15, 118, 110, 0.06), transparent 24%),
    linear-gradient(180deg, var(--shell-bg) 0%, var(--shell-bg-strong) 100%);
  color: var(--shell-text);
}

.default-layout__shell {
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
  height: 100%;
  flex-direction: column;
  gap: var(--shell-panel-gap);
}

.default-layout__body {
  display: flex;
  flex: 1;
  min-height: 0;
  min-width: 0;
  gap: var(--shell-panel-gap);
}

.default-layout__content {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--shell-border);
  border-radius: var(--shell-radius-xl);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.64), rgba(255, 255, 255, 0.9));
  box-shadow: var(--shell-shadow);
}

.default-layout__main {
  flex: 1;
  min-height: 0;
  padding: var(--shell-space-2) var(--shell-content-gap);
  overflow: auto;
}

.default-layout__main-surface {
  min-height: 100%;
  border-radius: var(--shell-radius-md);
  background: var(--shell-surface-strong);
}

.default-layout__page-container {
  display: flex;
  min-height: 100%;
  width: 100%;
  max-width: var(--shell-page-max-width);
  margin: 0 auto;
  padding: var(--shell-page-padding-block) var(--shell-page-padding-inline);
  justify-content: center;
}

@media (max-width: 768px) {
  .default-layout__body {
    flex-direction: column;
  }

  .default-layout__content {
    border-radius: var(--shell-radius-lg);
  }

  .default-layout__main {
    padding: var(--shell-space-2) var(--shell-content-gap);
  }

  .default-layout__main-surface {
    border-radius: var(--shell-radius-lg);
  }
}
</style>
