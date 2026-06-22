<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="not-found">
    <h1 class="not-found__code">
      404
    </h1>
    <p class="not-found__message">
      页面不存在
    </p>
    <button type="button" class="not-found__btn" @click="router.push('/')">
      返回首页
    </button>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: var(--space-3);
}

.not-found__code {
  font-size: 4rem;
  font-weight: 700;
  color: var(--color-text-secondary);
}

.not-found__message {
  font-size: 1.25rem;
  color: var(--color-text-secondary);
}

.not-found__btn {
  padding: 0.5rem 1.5rem;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: #fff;
  border: none;
  cursor: pointer;
}
</style>
