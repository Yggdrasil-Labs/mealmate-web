<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { resolveLayout } from './layout-registry'

const route = useRoute()

const layoutComponent = computed(() => {
  return resolveLayout(typeof route.meta.layout === 'string' ? route.meta.layout : undefined)
})
</script>

<template>
  <component :is="layoutComponent" />
</template>
