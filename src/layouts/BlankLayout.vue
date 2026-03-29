<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="blank-layout">
    <main class="blank-layout__main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped lang="scss">
.blank-layout {
  min-height: 100vh;
  background:
    radial-gradient(circle at top right, rgba(118, 75, 162, 0.1), transparent 38%),
    linear-gradient(180deg, #ffffff 0%, #f7f8fc 100%);
}

.blank-layout__main {
  min-height: 100vh;
}
</style>
