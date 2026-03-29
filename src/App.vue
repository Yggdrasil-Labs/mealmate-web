<script setup lang="ts">
import type { Locale } from '@/locales/config'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppLayoutRenderer from '@/app/shell/AppLayoutRenderer.vue'
import { getElementLocale } from '@/locales/element-locale'

const { locale } = useI18n()
const elementLocale = computed(() => getElementLocale(locale.value as Locale))
</script>

<template>
  <ElConfigProvider :locale="elementLocale">
    <div class="app">
      <AppLayoutRenderer class="app-layout-renderer" />
    </div>
  </ElConfigProvider>
</template>

<style lang="scss" scoped>
.app {
  min-height: 100vh;
}

.app-layout-renderer {
  display: block;
  min-height: 100vh;
}
</style>
