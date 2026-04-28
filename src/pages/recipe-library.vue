<script setup lang="ts">
import { ElButton } from 'element-plus'
import { onMounted, shallowRef } from 'vue'

const route = useRoute()
const loading = shallowRef(true)
const error = shallowRef<Error | null>(null)
const shouldSimulateInitialError = shallowRef(route.query.recipeShellError === '1')

async function bootstrapRecipeLibraryPage() {
  await Promise.resolve()

  // 保留一个可手动触发的失败入口，便于在真正接入模块前验证页面级错误与重试壳层。
  if (shouldSimulateInitialError.value) {
    shouldSimulateInitialError.value = false
    throw new Error('菜品库壳层加载失败，请重试。')
  }
}

async function loadPage() {
  loading.value = true
  error.value = null

  try {
    await bootstrapRecipeLibraryPage()
  }
  catch (err) {
    error.value = err instanceof Error ? err : new Error('Failed to load recipe library')
  }
  finally {
    loading.value = false
  }
}

async function retry() {
  await loadPage()
}

onMounted(() => {
  void loadPage()
})
</script>

<template>
  <section class="recipe-library-page">
    <div class="recipe-library-page__shell">
      <div
        v-if="loading"
        class="recipe-library-page__state"
      >
        <p class="recipe-library-page__state-label">
          菜品库
        </p>
        <p class="recipe-library-page__state-copy">
          正在准备页面壳层...
        </p>
      </div>

      <div
        v-else-if="error"
        class="recipe-library-page__state"
      >
        <p class="recipe-library-page__state-label">
          菜品库
        </p>
        <p class="recipe-library-page__state-copy">
          {{ error.message }}
        </p>
        <ElButton
          type="primary"
          class="recipe-library-page__state-button"
          @click="retry"
        >
          重试
        </ElButton>
      </div>

      <template v-else>
        <header class="recipe-library-page__hero">
          <div>
            <p class="recipe-library-page__eyebrow">
              菜品库
            </p>
            <h1 class="recipe-library-page__title">
              菜品库
            </h1>
            <p class="recipe-library-page__subtitle">
              后续的筛选栏、卡片网格、抽屉和删除确认会在这里继续接入。
            </p>
          </div>
        </header>

        <section class="recipe-library-page__section">
          <div class="recipe-library-page__section-head">
            <h2>筛选栏占位</h2>
            <p>这里会放搜索、分类和筛选条件。</p>
          </div>
          <div class="recipe-library-page__placeholder recipe-library-page__placeholder--bar" />
        </section>

        <section class="recipe-library-page__section">
          <div class="recipe-library-page__section-head">
            <h2>菜品网格占位</h2>
            <p>这里会渲染菜品卡片和空状态。</p>
          </div>
          <div class="recipe-library-page__grid-placeholder">
            <div
              v-for="index in 6"
              :key="index"
              class="recipe-library-page__placeholder recipe-library-page__placeholder--card"
            />
          </div>
        </section>

        <section class="recipe-library-page__section recipe-library-page__section--supporting">
          <div class="recipe-library-page__section-head">
            <h2>抽屉与对话框占位</h2>
            <p>详情抽屉、编辑抽屉和删除对话框会在这里挂载。</p>
          </div>
          <div class="recipe-library-page__supporting">
            <div class="recipe-library-page__placeholder recipe-library-page__placeholder--panel" />
            <div class="recipe-library-page__placeholder recipe-library-page__placeholder--panel" />
            <div class="recipe-library-page__placeholder recipe-library-page__placeholder--dialog" />
          </div>
        </section>
      </template>
    </div>
  </section>
</template>

<style scoped>
.recipe-library-page {
  min-height: 100%;
  padding: 1.5rem;
  background:
    radial-gradient(circle at top right, rgba(251, 191, 36, 0.16), transparent 26%),
    linear-gradient(180deg, #fffdf7 0%, #fff 100%);
}

.recipe-library-page__shell {
  width: min(1180px, 100%);
  margin: 0 auto;
  display: grid;
  gap: 1.25rem;
}

.recipe-library-page__state,
.recipe-library-page__hero,
.recipe-library-page__section {
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.06);
}

.recipe-library-page__state {
  display: grid;
  gap: 0.8rem;
  place-items: center;
  padding: 2rem;
  text-align: center;
}

.recipe-library-page__state-label,
.recipe-library-page__eyebrow {
  margin: 0;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
  color: #94a3b8;
  text-transform: uppercase;
}

.recipe-library-page__state-copy {
  margin: 0;
  color: #475569;
}

.recipe-library-page__state-button {
  min-height: 44px;
  border: none;
  border-radius: 999px;
  padding: 0.8rem 1.2rem;
  background: #0f766e;
  color: #fff;
  font: inherit;
}

.recipe-library-page__hero {
  padding: 1.5rem;
}

.recipe-library-page__title {
  margin: 0.55rem 0 0;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  line-height: 1.1;
  color: #0f172a;
}

.recipe-library-page__subtitle {
  max-width: 52ch;
  margin: 0.75rem 0 0;
  color: #475569;
  line-height: 1.7;
}

.recipe-library-page__section {
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
}

.recipe-library-page__section-head h2 {
  margin: 0;
  font-size: 1.05rem;
  color: #0f172a;
}

.recipe-library-page__section-head p {
  margin: 0.35rem 0 0;
  color: #64748b;
}

.recipe-library-page__placeholder {
  border-radius: 16px;
  border: 1px dashed rgba(148, 163, 184, 0.55);
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.9), rgba(255, 255, 255, 0.75));
}

.recipe-library-page__placeholder--bar {
  min-height: 72px;
}

.recipe-library-page__grid-placeholder {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.recipe-library-page__placeholder--card {
  min-height: 180px;
}

.recipe-library-page__section--supporting {
  margin-bottom: 0.25rem;
}

.recipe-library-page__supporting {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.recipe-library-page__placeholder--panel {
  min-height: 160px;
}

.recipe-library-page__placeholder--dialog {
  min-height: 112px;
}

@media (max-width: 960px) {
  .recipe-library-page__grid-placeholder,
  .recipe-library-page__supporting {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .recipe-library-page {
    padding: 1rem;
  }

  .recipe-library-page__hero,
  .recipe-library-page__section,
  .recipe-library-page__state {
    padding: 1rem;
  }
}
</style>
