<script setup lang="ts">
/**
 * 本地 SVG 图标渲染（assets/icons/ 下）
 * 约定：name 为 kebab-case 如 menu-dashboard，对应 assets/icons/menu/dashboard.svg
 */
import type { SemanticIconName } from './icon.types'
import { computed } from 'vue'

interface Props {
  name: SemanticIconName
}

const props = defineProps<Props>()

const DASH_RE = /-/g

// 构建时收集 assets/icons/**/*.svg，name 如 menu-dashboard → menu/dashboard.svg
const iconModules = import.meta.glob<{ default: string }>('@/assets/icons/**/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
})

const iconUrl = computed(() => {
  const pathSuffix = `${props.name.replace(DASH_RE, '/')}.svg`
  const fullKey = Object.keys(iconModules).find(k => k.endsWith(pathSuffix))
  if (!fullKey)
    return ''
  const mod = iconModules[fullKey]
  return (typeof mod === 'string' ? mod : (mod as { default?: string })?.default) ?? ''
})
</script>

<template>
  <img
    v-if="iconUrl"
    :src="iconUrl"
    :alt="name"
    class="svg-icon"
  >
</template>

<style scoped>
.svg-icon {
  display: inline-block;
  vertical-align: middle;
  width: 1em;
  height: 1em;
}
</style>
