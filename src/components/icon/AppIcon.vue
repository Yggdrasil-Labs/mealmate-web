<script setup lang="ts">
import type { IconSource, SemanticIconName } from './icon.types'
import { computed } from 'vue'
import { getIconComponent } from './icon-provider'
import SvgIcon from './SvgIcon.vue'

interface Props {
  /** 语义化图标名，不绑定具体库 */
  name: SemanticIconName
  /** 不传或 default：通用库；local：本地 assets/icons 下的 SVG */
  source?: IconSource
}

const props = withDefaults(defineProps<Props>(), {
  source: 'default',
})

const iconComponent = computed(() => {
  if (props.source === 'local') {
    // 本地 SVG 由 SvgIcon 渲染，此处可返回 SvgIcon 并传 name
    return undefined
  }
  return getIconComponent(props.name, props.source)
})
</script>

<template>
  <component
    :is="iconComponent"
    v-if="iconComponent"
    class="app-icon"
  />
  <SvgIcon
    v-else-if="source === 'local'"
    :name="name"
    class="app-icon"
  />
</template>

<style scoped>
.app-icon {
  display: inline-block;
  vertical-align: middle;
}
</style>
