<script setup lang="ts">
/**
 * PageHeader - 统一页面标题区域组件
 *
 * 保证各页面标题区的视觉节奏一致：标题 + 可选副标题 + 可选操作区。
 */
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <header class="page-header">
    <div class="page-header__copy">
      <h1 class="page-header__title">
        {{ title }}
      </h1>
      <p
        v-if="subtitle"
        class="page-header__subtitle"
      >
        {{ subtitle }}
      </p>
    </div>
    <div
      v-if="$slots.actions"
      class="page-header__actions"
    >
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.page-header__copy {
  display: grid;
  gap: var(--space-1);
  min-width: 0;
}

.page-header__title {
  margin: 0;
  font-size: var(--page-title-size, var(--text-2xl));
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.2;
}

.page-header__subtitle {
  margin: 0;
  max-width: 52ch;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: 1.6;
}

.page-header__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}
</style>
