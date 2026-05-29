<script setup lang="ts">
import type { TabRecord } from '@/stores/tabs'
import { computed } from 'vue'
import AppIcon from '@/components/icon/AppIcon.vue'

const props = withDefaults(defineProps<{
  items: TabRecord[]
  activeKey?: string | null
}>(), {
  activeKey: null,
})

const emit = defineEmits<{
  select: [key: string]
  close: [key: string]
  closeOthers: [key: string]
  refresh: [key: string]
}>()

const activeItem = computed(() => {
  return props.items.find(item => item.key === props.activeKey) ?? null
})

function handleSelect(key: string) {
  emit('select', key)
}

function handleClose(key: string) {
  emit('close', key)
}

function handleCloseOthers() {
  if (activeItem.value)
    emit('closeOthers', activeItem.value.key)
}

function handleRefresh() {
  if (activeItem.value)
    emit('refresh', activeItem.value.key)
}
</script>

<template>
  <section class="app-tabs" data-spacing="inset">
    <div class="app-tabs__bar" data-layout="inline">
      <div class="app-tabs__list" role="tablist" aria-label="页面标签" data-overflow="x">
        <div
          v-for="item in items"
          :key="item.key"
          class="app-tabs__item"
          :class="{
            'is-active': item.key === activeKey,
            'is-pinned': item.pinned,
          }"
          :data-marker="item.key === activeKey ? 'active' : undefined"
          :data-marker-style="item.key === activeKey ? 'outline' : undefined"
          data-shrink="fixed"
          data-size="tab"
        >
          <button
            type="button"
            class="app-tabs__item-trigger"
            :data-testid="`tab-${item.key}`"
            role="tab"
            :aria-pressed="item.key === activeKey"
            :aria-selected="item.key === activeKey"
            :tabindex="item.key === activeKey ? 0 : -1"
            :aria-controls="`panel-${item.key}`"
            @click="handleSelect(item.key)"
          >
            <span class="app-tabs__title">{{ item.title }}</span>
            <span
              v-if="item.pinned"
              class="app-tabs__badge"
              aria-hidden="true"
            >
              <AppIcon name="success" />
            </span>
          </button>

          <button
            v-if="item.closable"
            type="button"
            class="app-tabs__close"
            :data-testid="`tab-close-${item.key}`"
            :aria-label="`关闭 ${item.title}`"
            @click="handleClose(item.key)"
          >
            <AppIcon name="close" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div class="app-tabs__actions">
        <button
          type="button"
          class="app-tabs__action"
          data-testid="tabs-refresh-current"
          data-size="tab"
          aria-label="刷新当前"
          title="刷新当前"
          :disabled="!activeItem"
          @click="handleRefresh"
        >
          <AppIcon name="refresh" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="app-tabs__action"
          data-testid="tabs-close-others"
          data-size="tab"
          aria-label="关闭其他"
          title="关闭其他"
          :disabled="!activeItem"
          @click="handleCloseOthers"
        >
          <AppIcon name="close" aria-hidden="true" />
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.app-tabs {
  display: block;
  min-height: 0;
  padding: var(--shell-space-2) var(--shell-content-gap);
}

.app-tabs__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--shell-space-3);
  padding: 0;
}

.app-tabs__actions {
  display: flex;
  flex: none;
  gap: var(--shell-space-2);
}

.app-tabs__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--shell-border);
  border-radius: var(--shell-radius-full);
  background: linear-gradient(180deg, #ffffff, var(--shell-surface-muted));
  width: var(--shell-control-height);
  height: var(--shell-control-height);
  padding: 0;
  color: var(--shell-text);
  cursor: pointer;
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.04);
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.app-tabs__action:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.app-tabs__action :deep(.app-icon) {
  font-size: 0.86rem;
}

.app-tabs__list {
  display: flex;
  flex-wrap: nowrap;
  flex: 1;
  min-width: 0;
  gap: var(--shell-space-2);
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0;
  scrollbar-width: thin;
  scrollbar-gutter: stable both-edges;
  mask-image: linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent);
}

.app-tabs__item {
  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: var(--shell-space-1);
  min-width: 0;
  border: 1px solid var(--shell-border);
  border-radius: calc(var(--shell-radius-md) - 2px);
  background: var(--shell-glass);
  min-height: var(--shell-tabs-height);
  max-width: min(18rem, 70vw);
  padding: var(--shell-space-1) var(--shell-space-1) var(--shell-space-1) var(--shell-space-3);
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.04);
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease,
    background-color 160ms ease;
}

.app-tabs__item.is-active {
  border-color: var(--shell-accent);
  background: linear-gradient(135deg, rgba(47, 111, 235, 0.12), rgba(47, 111, 235, 0.04));
  box-shadow:
    inset 0 0 0 1px rgba(47, 111, 235, 0.38),
    0 10px 20px rgba(47, 111, 235, 0.08);
}

.app-tabs__item-trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--shell-space-1);
  min-width: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
}

.app-tabs__title {
  overflow: hidden;
  max-width: 13rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
  font-size: 0.86rem;
  line-height: 1.2;
}

.app-tabs__badge {
  border-radius: var(--shell-radius-full);
  padding: 0 0.25rem;
  color: var(--shell-accent-strong);
  font-size: 0.64rem;
  font-weight: 700;
}

.app-tabs__badge :deep(.app-icon) {
  font-size: 0.72rem;
}

.app-tabs__close {
  border: 0;
  border-radius: var(--shell-radius-full);
  color: var(--shell-text-muted);
  width: 1.25rem;
  height: 1.25rem;
  padding: 0;
  font-size: 0.8rem;
  line-height: 1;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    color 160ms ease,
    transform 160ms ease;
}

.app-tabs__close:hover {
  background: rgba(239, 68, 68, 0.12);
  color: #b91c1c;
  transform: translateY(-1px);
}

.app-tabs__action:hover {
  transform: translateY(-1px);
  border-color: var(--shell-border-strong);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
}

.app-tabs__action:focus-visible,
.app-tabs__item-trigger:focus-visible,
.app-tabs__close:focus-visible {
  outline: 2px solid var(--shell-accent-soft);
  outline-offset: 2px;
}

.app-tabs__item:hover {
  transform: translateY(-1px);
  border-color: var(--shell-border-strong);
  background: rgba(255, 255, 255, 0.96);
}

.app-tabs__list::-webkit-scrollbar {
  height: 8px;
}

.app-tabs__list::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.06);
  border-radius: 999px;
}

.app-tabs__list::-webkit-scrollbar-thumb {
  background: rgba(100, 116, 139, 0.42);
  border-radius: 999px;
}

.app-tabs__list::-webkit-scrollbar-thumb:hover {
  background: rgba(71, 85, 105, 0.6);
}

@media (max-width: 768px) {
  .app-tabs__bar {
    align-items: flex-start;
    flex-direction: column;
  }

  .app-tabs__actions {
    width: 100%;
    justify-content: flex-start;
    padding-top: 0.1rem;
  }

  .app-tabs__title {
    max-width: 9rem;
  }
}
</style>
