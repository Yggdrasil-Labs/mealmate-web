<script setup lang="ts">
import type { MenuNode } from '@/stores/menu'
import AppIcon from '@/components/icon/AppIcon.vue'

const props = withDefaults(defineProps<{
  tree: MenuNode[]
  activeKey?: string | null
  openKeys?: string[]
  collapsed?: boolean
  mobile?: boolean
  drawerVisible?: boolean
}>(), {
  activeKey: null,
  openKeys: () => [],
  collapsed: false,
  mobile: false,
  drawerVisible: true,
})

const emit = defineEmits<{
  select: [key: string]
  toggleCollapse: []
  closeDrawer: []
}>()

function isOpen(key: string) {
  return props.openKeys.includes(key)
}

function handleSelect(key: string) {
  emit('select', key)
}
</script>

<template>
  <aside
    class="app-sider"
    :class="{
      'is-collapsed': collapsed,
      'is-mobile': mobile,
      'is-hidden': mobile && !drawerVisible,
    }"
    :data-device="mobile ? 'mobile' : 'desktop'"
    data-density="compact"
    data-motion="collapsible"
    data-testid="layout-sider"
  >
    <div class="app-sider__toolbar" data-density="compact">
      <button
        type="button"
        class="app-sider__toggle"
        data-testid="sider-toggle"
        :aria-pressed="collapsed"
        :title="collapsed ? '展开菜单' : '收起菜单'"
        :aria-label="collapsed ? '展开菜单' : '收起菜单'"
        @click="emit('toggleCollapse')"
      >
        <AppIcon
          :name="collapsed ? 'expand' : 'fold'"
          :data-testid="collapsed ? 'sider-toggle-expand' : 'sider-toggle-fold'"
          class="app-sider__toggle-icon"
          aria-hidden="true"
        />
      </button>
    </div>

    <nav class="app-sider__nav" aria-label="主导航">
      <ul class="app-sider__list">
        <li
          v-for="item in tree"
          :key="item.key"
          class="app-sider__node"
        >
          <button
            type="button"
            class="app-sider__item"
            :class="{ 'is-active': item.key === activeKey }"
            data-density="compact"
            :title="collapsed ? item.title : undefined"
            :aria-label="collapsed ? item.title : undefined"
            :aria-current="item.key === activeKey ? 'page' : undefined"
            @click="handleSelect(item.key)"
          >
            <span
              v-if="item.icon"
              class="app-sider__icon"
              aria-hidden="true"
            >
              <AppIcon :name="item.icon" />
            </span>
            <span
              v-if="!collapsed"
              class="app-sider__title"
            >
              {{ item.title }}
            </span>
            <span
              v-if="item.children?.length && !collapsed"
              class="app-sider__chevron"
              aria-hidden="true"
            >
              {{ isOpen(item.key) ? '▾' : '▸' }}
            </span>
          </button>

          <ul
            v-if="item.children?.length && isOpen(item.key)"
            class="app-sider__children"
          >
            <li
              v-for="child in item.children"
              :key="child.key"
            >
              <button
                type="button"
                class="app-sider__item app-sider__item--child"
                :class="{ 'is-active': child.key === activeKey }"
                data-density="compact"
                :title="collapsed ? child.title : undefined"
                :aria-label="collapsed ? child.title : undefined"
                :aria-current="child.key === activeKey ? 'page' : undefined"
                @click="handleSelect(child.key)"
              >
                <span
                  v-if="child.icon"
                  class="app-sider__icon"
                  aria-hidden="true"
                >
                  <AppIcon :name="child.icon" />
                </span>
                <span
                  v-if="!collapsed"
                  class="app-sider__title"
                >
                  {{ child.title }}
                </span>
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped lang="scss">
.app-sider {
  display: flex;
  flex-direction: column;
  gap: var(--shell-space-3);
  width: var(--shell-sider-width);
  min-width: var(--shell-sider-width);
  padding: var(--shell-space-3);
  border: 1px solid var(--shell-border);
  border-radius: var(--shell-radius-xl);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.84), var(--shell-surface));
  box-shadow: var(--shell-shadow-soft);
  backdrop-filter: blur(18px);
  transition:
    width 220ms ease,
    min-width 220ms ease,
    padding 220ms ease,
    border-radius 220ms ease,
    box-shadow 220ms ease;
}

.app-sider.is-mobile {
  position: fixed;
  top: calc(var(--shell-frame-padding) + var(--shell-header-height) + var(--shell-panel-gap));
  left: var(--shell-frame-padding);
  bottom: var(--shell-frame-padding);
  z-index: 20;
  width: min(88vw, 332px);
  min-width: min(88vw, 332px);
  overflow-y: auto;
  border-radius: calc(var(--shell-radius-xl) - 2px);
  box-shadow: 0 22px 48px rgba(15, 23, 42, 0.18);
}

.app-sider.is-collapsed {
  width: var(--shell-sider-collapsed-width);
  min-width: var(--shell-sider-collapsed-width);
  padding-inline: var(--shell-space-2);
}

.app-sider.is-collapsed .app-sider__toolbar {
  justify-content: center;
}

.app-sider.is-collapsed .app-sider__toggle {
  width: var(--shell-control-height);
}

.app-sider.is-collapsed .app-sider__item {
  justify-content: center;
  padding-inline: var(--shell-space-2);
}

.app-sider.is-collapsed .app-sider__item::before {
  left: 50%;
  top: auto;
  bottom: 0.45rem;
  transform: translateX(-50%);
}

.app-sider.is-collapsed .app-sider__item--child {
  margin-left: 0;
}

.app-sider.is-hidden {
  display: none;
}

.app-sider__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--shell-space-2);
  transition: justify-content 220ms ease;
}

.app-sider__toggle {
  display: inline-flex;
  border: 1px solid var(--shell-border);
  border-radius: var(--shell-radius-full);
  background: linear-gradient(180deg, #ffffff, var(--shell-surface-muted));
  align-items: center;
  justify-content: center;
  width: var(--shell-control-height);
  height: var(--shell-control-height);
  padding: 0;
  color: var(--shell-text);
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 12px rgba(15, 23, 42, 0.04);
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.app-sider__toggle--ghost {
  background: rgba(15, 23, 42, 0.03);
}

.app-sider__toggle:hover {
  transform: translateY(-1px);
  border-color: var(--shell-border-strong);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
}

.app-sider__toggle:focus-visible {
  outline: 2px solid var(--shell-accent-soft);
  outline-offset: 2px;
}

.app-sider__toggle-icon {
  font-size: 1rem;
  transition: transform 160ms ease;
}

.app-sider__toggle-icon.is-collapsed {
  transform: rotate(180deg);
}

.app-sider__nav,
.app-sider__list,
.app-sider__children {
  min-width: 0;
}

.app-sider__list,
.app-sider__children {
  display: flex;
  flex-direction: column;
  gap: var(--shell-space-1);
  list-style: none;
  margin: 0;
  padding: 0;
}

.app-sider__node {
  display: flex;
  flex-direction: column;
  gap: var(--shell-space-1);
}

.app-sider__item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--shell-space-2);
  border: 1px solid transparent;
  border-radius: var(--shell-radius-md);
  background: var(--shell-glass);
  min-height: 44px;
  padding: 0.625rem var(--shell-space-3) 0.625rem var(--shell-space-4);
  color: var(--shell-text);
  text-align: left;
  cursor: pointer;
  font: inherit;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.26);
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease,
    transform 160ms ease;
}

.app-sider__item::before {
  content: '';
  position: absolute;
  top: 50%;
  left: var(--shell-space-2);
  width: 0.35rem;
  height: 0.35rem;
  border-radius: 999px;
  background: transparent;
  transform: translateY(-50%);
  transition:
    box-shadow 160ms ease,
    background-color 160ms ease;
}

.app-sider__item.is-active {
  padding-left: calc(var(--shell-space-4) + 4px);
  border-color: var(--shell-border-strong);
  background: linear-gradient(135deg, rgba(47, 111, 235, 0.12), rgba(47, 111, 235, 0.04));
  color: var(--shell-text);
  box-shadow: 0 8px 16px rgba(47, 111, 235, 0.08);
}

.app-sider__item.is-active::before {
  width: 3px;
  height: 60%;
  border-radius: 9999px;
  background: var(--shell-accent);
}

.app-sider__item.is-active .app-sider__icon {
  color: var(--shell-accent);
}

.app-sider__item--child {
  margin-left: var(--shell-space-3);
  border-radius: calc(var(--shell-radius-md) - 2px);
  min-height: 40px;
  padding: 0.5rem var(--shell-space-3) 0.5rem var(--shell-space-4);
}

.app-sider__item--child::before {
  left: 6px;
}

.app-sider__icon {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 1.1rem;
  height: 1.1rem;
  color: var(--shell-text-soft);
  transition:
    color 220ms ease,
    transform 220ms ease;
}

.app-sider__title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transform-origin: left center;
  transition:
    opacity 160ms ease,
    transform 220ms ease;
}

.app-sider__chevron {
  flex: none;
  color: var(--shell-text-soft);
  transition:
    opacity 160ms ease,
    transform 220ms ease,
    color 220ms ease;
}

.app-sider__item:hover {
  transform: translateX(1px);
  border-color: var(--shell-border);
  background: rgba(255, 255, 255, 0.92);
}

.app-sider.is-collapsed .app-sider__hero {
  gap: 0.15rem;
}

.app-sider.is-collapsed .app-sider__eyebrow,
.app-sider.is-collapsed .app-sider__copy {
  display: none;
}

.app-sider.is-collapsed .app-sider__headline {
  font-size: 0.95rem;
}

.app-sider.is-collapsed .app-sider__item {
  justify-content: center;
  padding-inline: var(--shell-space-3);
}

.app-sider.is-collapsed .app-sider__item::before {
  left: var(--shell-space-2);
}

.app-sider.is-collapsed .app-sider__title {
  max-width: 100%;
  text-align: center;
}

.app-sider.is-collapsed .app-sider__chevron {
  display: none;
}

@media (max-width: 768px) {
  .app-sider {
    width: auto;
    min-width: 0;
    border-radius: calc(var(--shell-radius-lg) + 2px);
  }

  .app-sider.is-mobile {
    top: calc(var(--shell-frame-padding) + 60px + var(--shell-panel-gap));
  }
}
</style>
