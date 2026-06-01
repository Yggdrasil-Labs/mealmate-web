<script setup lang="ts">
import type { Locale } from '@locales/types'
import { computed } from 'vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import { useI18nHelper } from '@/composables/useI18n'

interface Props {
  brand?: string
  title?: string
  device?: 'mobile' | 'tablet' | 'desktop'
  collapsed?: boolean
  drawerVisible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  brand: 'MealMate Web',
  title: 'Dashboard',
  device: 'desktop',
  collapsed: false,
  drawerVisible: false,
})

const emit = defineEmits<{
  localeChange: [Locale]
  toggleNav: []
}>()

const {
  currentLocale,
  getLocaleDisplayName,
  supportedLocales,
  switchLocale,
} = useI18nHelper()

function handleLanguageChange(locale: Locale) {
  if (locale === currentLocale.value)
    return

  switchLocale(locale)
  emit('localeChange', locale)
}

function handleToggleNav() {
  emit('toggleNav')
}

const navToggleLabel = computed(() => {
  if (props.device === 'mobile')
    return props.drawerVisible ? '关闭菜单' : '打开菜单'

  return props.collapsed ? '展开侧栏' : '收起侧栏'
})

const navToggleIcon = computed(() => {
  if (props.device === 'mobile')
    return props.drawerVisible ? 'close' : 'expand'

  return props.collapsed ? 'expand' : 'fold'
})

const showNavToggle = computed(() => props.device === 'mobile')

const brandInitial = computed(() => {
  return props.brand.trim().charAt(0).toUpperCase() || 'A'
})
</script>

<template>
  <header class="app-header" data-density="compact">
    <div class="app-header__brand">
      <RouterLink to="/" class="app-header__brand-link">
        <span class="app-header__brand-mark" aria-hidden="true">
          {{ brandInitial }}
        </span>
        <span class="app-header__brand-copy">
          <span class="app-header__brand-name">{{ brand }}</span>
          <span class="app-header__brand-meta">家庭饮食规划</span>
        </span>
      </RouterLink>
      <span class="app-header__divider" aria-hidden="true" />
      <span class="app-header__title">{{ title }}</span>
    </div>

    <div class="app-header__actions">
      <button
        v-if="showNavToggle"
        type="button"
        class="app-header__nav-toggle"
        data-testid="header-nav-toggle"
        :aria-label="navToggleLabel"
        :title="navToggleLabel"
        @click="handleToggleNav"
      >
        <AppIcon :name="navToggleIcon" aria-hidden="true" />
      </button>

      <el-dropdown trigger="click" @command="handleLanguageChange">
        <el-button type="primary" link class="app-header__locale-trigger">
          {{ getLocaleDisplayName(currentLocale) }}
          <span class="app-header__arrow">▼</span>
        </el-button>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="locale in supportedLocales"
              :key="locale"
              :command="locale"
            >
              {{ getLocaleDisplayName(locale) }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--shell-space-3);
  min-height: var(--shell-header-height);
  padding: var(--shell-space-3) var(--shell-space-4);
  border: 1px solid var(--shell-border);
  border-radius: var(--shell-radius-xl);
  background: linear-gradient(180deg, var(--shell-glass-strong), var(--shell-surface));
  box-shadow: var(--shell-shadow-soft);
  backdrop-filter: blur(18px);
}

.app-header__brand {
  display: flex;
  align-items: center;
  gap: var(--shell-space-3);
  min-width: 0;
  flex: 1;
}

.app-header__brand-link {
  display: inline-flex;
  align-items: center;
  gap: var(--shell-space-3);
  min-width: 0;
  color: inherit;
  text-decoration: none;
}

.app-header__brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, var(--shell-accent), var(--shell-accent-strong));
  box-shadow: 0 12px 22px rgba(47, 111, 235, 0.18);
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  flex: none;
  transition: transform var(--duration-fast) var(--ease-out);
}

.app-header__brand-link:hover .app-header__brand-mark {
  transform: rotate(3deg) scale(1.05);
}

.app-header__brand-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}

.app-header__brand-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.app-header__brand-meta {
  color: var(--shell-text);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.app-header__divider {
  width: 1px;
  align-self: stretch;
  background: linear-gradient(180deg, transparent, var(--shell-border-strong), transparent);
}

.app-header__title {
  overflow: hidden;
  color: var(--shell-text);
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.84rem;
  font-weight: 600;
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: var(--shell-space-2);
  flex: none;
}

.app-header__nav-toggle {
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
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.app-header__nav-toggle:hover {
  transform: translateY(-1px);
  border-color: var(--shell-border-strong);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
}

.app-header__nav-toggle:focus-visible {
  outline: 2px solid var(--shell-accent-soft);
  outline-offset: 2px;
}

.app-header__nav-toggle :deep(.app-icon) {
  font-size: 0.95rem;
}

.app-header__locale-trigger {
  min-height: var(--shell-control-height);
  padding: 0 var(--shell-space-3);
  border-radius: var(--shell-radius-full);
  color: var(--shell-text) !important;
  font-weight: 600;
}

.app-header__arrow {
  margin-left: 0.35rem;
  font-size: 0.6rem;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .app-header {
    min-height: 60px;
    padding: var(--shell-space-3);
    border-radius: calc(var(--shell-radius-lg) + 2px);
  }

  .app-header__brand-meta,
  .app-header__divider {
    display: none;
  }

  .app-header__title {
    display: none;
  }

  .app-header__nav-toggle {
    width: var(--shell-control-height);
    height: var(--shell-control-height);
  }
}
</style>
