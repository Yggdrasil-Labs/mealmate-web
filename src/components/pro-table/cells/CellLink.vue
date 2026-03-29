<script setup lang="ts">
import type { ProTableContext, TableColumnSchema } from '@/types/pro-table'
import { computed, watch } from 'vue'

defineOptions({ name: 'ProTableCellLink' })

const props = defineProps<{
  column: TableColumnSchema
  row: Record<string, unknown>
  value: unknown
  displayText: string
  context: ProTableContext
}>()

const p = computed(() => props.column.ui.props ?? {})

const UNSAFE_PROTOCOLS = /^(?:javascript|data|vbscript):/i

const href = computed(() => {
  const raw = p.value.href as string | undefined
  if (!raw || UNSAFE_PROTOCOLS.test(raw.trim()))
    return undefined
  return raw.trim()
})
const to = computed(() => p.value.to)
const routerTo = computed(
  () => to.value as string | Record<string, unknown> | undefined,
)
const target = computed(() => p.value.target as string | undefined)

if (import.meta.env.DEV) {
  watch(
    () => [href.value, routerTo.value] as const,
    ([h, t]) => {
      if (h && t)
        console.warn('[ProTable CellLink] href 与 to 互斥，请只配置其一', props.column.meta.field)
    },
    { immediate: true },
  )
}
</script>

<template>
  <RouterLink
    v-if="routerTo"
    class="pro-table-cell-link pro-table-cell-link--router"
    :to="routerTo"
    data-testid="pro-table-cell-link"
    @click.stop
  >
    {{ displayText }}
  </RouterLink>
  <a
    v-else-if="href"
    class="pro-table-cell-link pro-table-cell-link--external"
    :href="href"
    :target="target"
    rel="noopener noreferrer"
    data-testid="pro-table-cell-link"
    @click.stop
  >
    {{ displayText }}
  </a>
  <span v-else class="pro-table-cell-text">{{ displayText }}</span>
</template>

<style scoped lang="scss">
.pro-table-cell-link--router {
  color: var(--el-color-primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.pro-table-cell-link--external {
  color: var(--el-color-primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
