<script setup lang="ts">
import { computed, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { buildRouteCacheKey } from '@/app/shell/route-cache'
import { useKeepAliveStore, useTabsStore } from '@/stores'

const route = useRoute()
const keepAliveStore = useKeepAliveStore()
const tabsStore = useTabsStore()

const routeKey = computed(() => String(route.name ?? route.path))
const cacheKey = computed(() => buildRouteCacheKey(route))
const isCacheable = computed(() => route.meta.keepAlive?.enabled === true)
const refreshVersion = computed(() => tabsStore.getRefreshVersion(routeKey.value))
const bustVersion = computed(() => keepAliveStore.getBustVersion(cacheKey.value))
const renderKey = computed(() => `${cacheKey.value}:${bustVersion.value}:${refreshVersion.value}`)

const includeNames = computed(() => keepAliveStore.includeNames)

watch(
  [cacheKey, isCacheable, refreshVersion],
  ([nextCacheKey, cacheable]) => {
    keepAliveStore.syncRoute(nextCacheKey, cacheable)
  },
  { immediate: true },
)
</script>

<template>
  <RouterView v-slot="{ Component }">
    <KeepAlive :include="includeNames">
      <component
        :is="Component"
        v-if="Component"
        :key="renderKey"
      />
    </KeepAlive>
  </RouterView>
</template>
