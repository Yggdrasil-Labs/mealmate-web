<script setup lang="ts">
import type { SemanticIconName } from '@components/icon/icon.types'
import env from '@/config/env'
import { showSuccess } from '@/utils/message'

const { width, height } = useWindowSize()
const { x, y } = useMouse()
const isDark = useDark()

const techStack: { icon: SemanticIconName, name: string, desc: string }[] = [
  { icon: 'tech-vue', name: 'Vue 3', desc: '组合式 API' },
  { icon: 'tech-vite', name: 'Vite', desc: '极速构建' },
  { icon: 'tech-router', name: 'Vue Router', desc: '路由管理' },
  { icon: 'tech-pinia', name: 'Pinia', desc: '状态管理' },
  { icon: 'tech-i18n', name: 'Vue I18n', desc: '国际化支持' },
  { icon: 'tech-tools', name: 'VueUse', desc: '组合式工具集' },
]

interface EnvItem {
  label: string
  value: string
  success?: boolean
}

interface StatItem {
  label: string
  value: string
  hint: string
  icon: SemanticIconName
}

const envItems: EnvItem[] = [
  { label: '运行模式', value: env.MODE },
  { label: '应用环境', value: env.APP_ENV },
  { label: '应用名称', value: env.APP_NAME },
  { label: '应用版本', value: env.APP_VERSION },
  { label: 'API 地址', value: env.API_BASE_URL },
  { label: '开发模式', value: env.isDev ? '是' : '否', success: env.isDev },
  { label: '生产模式', value: env.isProd ? '是' : '否', success: env.isProd },
  { label: '测试模式', value: env.isTest ? '是' : '否', success: env.isTest },
]

const statItems: StatItem[] = [
  {
    label: '响应式信号',
    value: '3 组',
    hint: '窗口、鼠标、深色模式',
    icon: 'refresh',
  },
  {
    label: '技术栈基线',
    value: `${techStack.length} 项`,
    hint: 'Vue / Vite / Router / Pinia',
    icon: 'menu-dashboard',
  },
  {
    label: '环境变量',
    value: `${envItems.length} 项`,
    hint: '运行模式与 API 配置',
    icon: 'info',
  },
]

function handleDemoClick() {
  showSuccess('Element Plus 与 AppIcon 运行正常')
}
</script>

<template>
  <div class="home-page">
    <header class="navbar">
      <div class="nav-brand">
        <p class="nav-brand__eyebrow">
          Enterprise Control Panel
        </p>
        <h1>Asgard Frontend Template</h1>
      </div>

      <div class="nav-status">
        <span class="nav-status__dot" />
        <span>运行中</span>
      </div>
    </header>

    <section class="hero-section">
      <div class="hero-shell">
        <div class="hero-content">
          <div class="hero-badge">
            <AppIcon name="menu-dashboard" class="hero-badge__icon" />
            控制台欢迎页
          </div>

          <h2 class="hero-title">
            <span class="hero-subtitle-small">面向通用场景的</span>
            <span class="gradient-text">Vue 3 模板工程</span>
          </h2>

          <p class="hero-subtitle">
            仅保留基础能力，不预置登录与用户业务。当前首页采用控制台式信息架构，方便直接挂接真实业务。
          </p>

          <div class="hero-actions">
            <el-button type="primary" @click="handleDemoClick">
              <AppIcon name="success" class="hero-demo-icon" />
              Element Plus 已就绪
            </el-button>
            <span class="hero-actions__hint">
              适配桌面与移动端，保留运行时可视化信息
            </span>
          </div>
        </div>

        <aside class="hero-panel">
          <div
            v-for="item in statItems"
            :key="item.label"
            class="hero-panel__item"
          >
            <div class="hero-panel__icon">
              <AppIcon :name="item.icon" />
            </div>
            <div class="hero-panel__text">
              <div class="hero-panel__label">
                {{ item.label }}
              </div>
              <strong class="hero-panel__value">
                {{ item.value }}
              </strong>
              <p class="hero-panel__hint">
                {{ item.hint }}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section class="features-section">
      <div class="container">
        <el-card class="feature-card" shadow="never">
          <template #header>
            <div class="card-header">
              <AppIcon name="success" class="card-header-icon" />
              <div>
                <h2>技术栈基线</h2>
                <p>可直接扩展到你的业务项目</p>
              </div>
            </div>
          </template>

          <div class="tech-grid">
            <div
              v-for="item in techStack"
              :key="item.name"
              class="tech-item"
            >
              <div class="tech-icon">
                <AppIcon :name="item.icon" />
              </div>
              <div class="tech-text">
                <h4>{{ item.name }}</h4>
                <p>{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </el-card>

        <div class="content-grid">
          <el-card class="feature-card" shadow="never">
            <template #header>
              <div class="card-header">
                <AppIcon name="refresh" class="card-header-icon" />
                <div>
                  <h2>运行时演示</h2>
                  <p>VueUse 响应式能力示例</p>
                </div>
              </div>
            </template>

            <div class="demo-grid">
              <div class="demo-item">
                <AppIcon name="info" class="demo-item-icon" />
                <div class="demo-content">
                  <h4>窗口尺寸</h4>
                  <p>{{ width }} × {{ height }}</p>
                </div>
              </div>
              <div class="demo-item">
                <AppIcon name="info" class="demo-item-icon" />
                <div class="demo-content">
                  <h4>鼠标位置</h4>
                  <p>({{ x }}, {{ y }})</p>
                </div>
              </div>
              <div class="demo-item">
                <AppIcon name="info" class="demo-item-icon" />
                <div class="demo-content">
                  <h4>深色模式</h4>
                  <p>{{ isDark ? '开启' : '关闭' }}</p>
                </div>
              </div>
            </div>
          </el-card>

          <el-card class="feature-card" shadow="never">
            <template #header>
              <div class="card-header">
                <AppIcon name="info" class="card-header-icon" />
                <div>
                  <h2>环境信息</h2>
                  <p>当前运行环境配置</p>
                </div>
              </div>
            </template>

            <el-descriptions :column="1" border>
              <el-descriptions-item
                v-for="item in envItems"
                :key="item.label"
                :label="item.label"
              >
                <template #label>
                  <span class="env-key">{{ item.label }}</span>
                </template>

                <span :class="{ 'env-value-success': item.success }">{{ item.value }}</span>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  --home-bg: #f5f7fb;
  --home-surface: rgba(255, 255, 255, 0.84);
  --home-surface-strong: rgba(255, 255, 255, 0.94);
  --home-border: rgba(15, 23, 42, 0.08);
  --home-text: #0f172a;
  --home-text-muted: #5b6475;
  --home-accent: #2f5cff;
  --home-accent-soft: rgba(47, 92, 255, 0.1);

  position: relative;
  display: grid;
  gap: var(--shell-page-section-gap);
  min-height: 100%;
  overflow: hidden;
  padding: var(--shell-space-4);
  border-radius: calc(var(--shell-radius-xl) - 10px);
  background:
    radial-gradient(circle at 12% 12%, rgba(47, 92, 255, 0.08), transparent 28%),
    radial-gradient(circle at 88% 8%, rgba(14, 165, 233, 0.08), transparent 22%),
    linear-gradient(180deg, #fbfcff 0%, var(--home-bg) 100%);
}

.home-page::before {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(15, 23, 42, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(15, 23, 42, 0.02) 1px, transparent 1px);
  background-position: center;
  background-size: 48px 48px;
  opacity: 0.45;
  content: '';
  pointer-events: none;
}

.navbar,
.hero-section,
.features-section {
  position: relative;
  z-index: 1;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--shell-space-4);
}

.nav-brand {
  min-width: 0;
}

.nav-brand__eyebrow {
  margin: 0 0 0.3rem;
  color: var(--home-text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.72rem;
  font-weight: 700;
}

.nav-brand h1 {
  margin: 0;
  color: var(--home-text);
  font-size: clamp(1.2rem, 1.6vw, 1.45rem);
  font-weight: 700;
  letter-spacing: 0.01em;
}

.nav-status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--home-border);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  padding: 0.45rem 0.8rem;
  color: var(--home-text-muted);
  font-size: 0.9rem;
  font-weight: 600;
  backdrop-filter: blur(14px);
}

.nav-status__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.14);
}

.hero-section {
  padding: 0;
}

.hero-shell {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.85fr);
  gap: var(--shell-space-5);
}

.hero-content,
.hero-panel,
.feature-card {
  border: 1px solid var(--home-border);
  border-radius: 20px;
  background: var(--home-surface);
  backdrop-filter: blur(16px);
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.06);
}

.hero-content {
  padding: clamp(1.5rem, 3vw, 2.5rem);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid rgba(47, 92, 255, 0.14);
  border-radius: 999px;
  background: var(--home-accent-soft);
  padding: 0.4rem 0.75rem;
  color: #2443a8;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.hero-badge__icon {
  font-size: 0.95rem;
}

.hero-title {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin: 1rem 0 0.85rem;
  color: var(--home-text);
  font-size: clamp(2rem, 4vw, 3.3rem);
  font-weight: 750;
  line-height: 1.08;
  letter-spacing: -0.03em;
}

.hero-subtitle-small {
  color: var(--home-text-muted);
  font-size: clamp(1rem, 1.8vw, 1.28rem);
  font-weight: 600;
}

.gradient-text {
  background: linear-gradient(135deg, #0f172a 0%, #2443a8 46%, #2f5cff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-subtitle {
  max-width: 60ch;
  margin: 0;
  color: var(--home-text-muted);
  font-size: 1rem;
  line-height: 1.75;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.hero-demo-icon {
  margin-right: 0.3rem;
  vertical-align: middle;
}

.hero-actions__hint {
  color: var(--home-text-muted);
  font-size: 0.88rem;
}

.hero-panel {
  display: grid;
  gap: 0.9rem;
  padding: 1rem;
}

.hero-panel__item {
  display: flex;
  gap: 0.85rem;
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 16px;
  background: var(--home-surface-strong);
  padding: 0.9rem;
}

.hero-panel__icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 14px;
  background: var(--home-accent-soft);
  color: #2443a8;
}

.hero-panel__text {
  min-width: 0;
}

.hero-panel__label {
  color: var(--home-text-muted);
  font-size: 0.8rem;
  font-weight: 600;
}

.hero-panel__value {
  display: block;
  margin-top: 0.2rem;
  color: var(--home-text);
  font-size: 1.05rem;
  font-weight: 700;
}

.hero-panel__hint {
  margin: 0.2rem 0 0;
  color: var(--home-text-muted);
  font-size: 0.86rem;
  line-height: 1.6;
}

.features-section {
  padding: 0;
}

.container {
  display: grid;
  gap: var(--shell-space-5);
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
  gap: var(--shell-space-5);
}

.feature-card {
  overflow: hidden;
}

.feature-card :deep(.el-card__header) {
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  background: rgba(248, 250, 252, 0.86);
  padding: 1.15rem 1.25rem;
}

.feature-card :deep(.el-card__body) {
  padding: 1.25rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.card-header-icon {
  flex-shrink: 0;
  color: var(--home-accent);
  font-size: 1.35rem;
}

.card-header h2 {
  margin: 0 0 0.2rem;
  color: var(--home-text);
  font-size: 1rem;
  font-weight: 700;
}

.card-header p {
  margin: 0;
  color: var(--home-text-muted);
  font-size: 0.86rem;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 0.9rem;
}

.tech-item,
.demo-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.74);
  padding: 0.9rem;
}

.tech-icon,
.demo-item-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 14px;
  background: rgba(47, 92, 255, 0.08);
  color: #2443a8;
  font-size: 1rem;
}

.tech-text,
.demo-content {
  min-width: 0;
}

.tech-text h4,
.demo-content h4 {
  margin: 0;
  color: var(--home-text);
  font-size: 0.95rem;
  font-weight: 700;
}

.tech-text p,
.demo-content p {
  margin: 0.2rem 0 0;
  color: var(--home-text-muted);
  font-size: 0.86rem;
  line-height: 1.55;
}

.demo-grid {
  display: grid;
  gap: 0.85rem;
}

.env-value-success {
  color: #0f9d58;
  font-weight: 600;
}

:deep(.el-button--primary) {
  border-color: var(--home-accent);
  background: linear-gradient(135deg, #2f5cff 0%, #2443a8 100%);
  box-shadow: 0 10px 22px rgba(47, 92, 255, 0.18);
}

:deep(.el-button--primary:hover) {
  border-color: #2443a8;
  background: linear-gradient(135deg, #395fff 0%, #1e3c8d 100%);
}

@media (max-width: 1024px) {
  .home-page {
    padding: var(--shell-space-3);
  }

  .hero-shell,
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .home-page {
    padding: var(--shell-space-2);
  }

  .navbar {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--shell-space-3);
  }

  .hero-content,
  .hero-panel,
  .feature-card {
    border-radius: 18px;
  }

  .hero-actions {
    align-items: flex-start;
  }

  .tech-grid {
    grid-template-columns: 1fr;
  }

  .feature-card :deep(.el-card__header),
  .feature-card :deep(.el-card__body) {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
