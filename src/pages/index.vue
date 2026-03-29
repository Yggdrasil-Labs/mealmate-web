<script setup lang="ts">
const cleanHighlights = [
  {
    label: '当前状态',
    value: '页面内容已清理，当前仅保留正式项目所需的基础占位。',
  },
  {
    label: '下一步',
    value: '可以在这里继续接入真实业务模块与正式数据。',
  },
]
</script>

<template>
  <div class="demo-clean">
    <div class="demo-clean__card">
      <p class="demo-clean__eyebrow">
        项目首页
      </p>
      <h1>内容已整理</h1>
      <p class="demo-clean__subtitle">
        当前页面仅保留基础布局，原先的展示模块和测试文案已被移除。你可以在此基础上继续搭建正式内容。
      </p>
      <div class="demo-clean__highlights">
        <div
          v-for="item in cleanHighlights"
          :key="item.label"
          class="demo-clean__highlight"
        >
          <p class="demo-clean__label">
            {{ item.label }}
          </p>
          <p class="demo-clean__value">
            {{ item.value }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-clean {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
}

.demo-clean__card {
  width: min(680px, 100%);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 20px;
  padding: 2.5rem;
  background: #fff;
  box-shadow: 0 24px 50px rgba(15, 23, 42, 0.08);
}

.demo-clean__eyebrow {
  margin: 0;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
  color: #94a3b8;
}

.demo-clean h1 {
  margin: 0.6rem 0 0;
  font-size: clamp(2rem, 3vw, 2.6rem);
  font-weight: 600;
  color: #111827;
}

.demo-clean__subtitle {
  margin: 0.75rem 0 1.8rem;
  color: #475569;
  line-height: 1.7;
}

.demo-clean__highlights {
  display: grid;
  gap: 1rem;
}

.demo-clean__highlight {
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 14px;
  padding: 1rem 1.25rem;
  background: #f8fafc;
}

.demo-clean__label {
  margin: 0;
  font-size: 0.8rem;
  color: #64748b;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.demo-clean__value {
  margin: 0.35rem 0 0;
  color: #0f172a;
}

@media (max-width: 640px) {
  .demo-clean__card {
    padding: 2rem;
  }

  .demo-clean__highlight {
    padding: 0.9rem 1rem;
  }
}
</style>
