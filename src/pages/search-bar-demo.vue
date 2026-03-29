<script setup lang="ts">
import type {
  ProTablePaginationState,
  ProTableSortState,
  TableColumnSchema,
} from '@/types/pro-table'
import type { SearchFieldSchema } from '@/types/search-bar'
import { computed, ref, watch } from 'vue'
import { ProTable, registerDefaultColumnComponents } from '@/components/pro-table'
import { registerDefaultSearchFieldComponents, SearchBar } from '@/components/search-bar'

definePage({
  name: 'SearchBarDemo',
  meta: { title: 'SearchBar 示例' },
})

registerDefaultSearchFieldComponents()
registerDefaultColumnComponents()

interface DemoRow {
  id: number
  name: string
  status: 'draft' | 'published' | 'archived'
  category: string
  owner: string
  createdAt: string
}

const baseRows: DemoRow[] = Array.from({ length: 42 }, (_, index) => {
  const status = index % 3 === 0 ? 'draft' : index % 3 === 1 ? 'published' : 'archived'
  const category = status === 'draft'
    ? 'planning'
    : status === 'published'
      ? (index % 2 === 0 ? 'release' : 'growth')
      : 'history'

  return {
    id: index + 1,
    name: `搜索场景 ${index + 1}`,
    status,
    category,
    owner: ['阿青', '北辰', '临川'][index % 3],
    createdAt: `2026-03-${String((index % 27) + 1).padStart(2, '0')}`,
  }
})

const searchValues = ref<Record<string, unknown>>({})
const lastPayload = ref<Record<string, unknown>>({})
const loading = ref(false)

const pagination = ref<ProTablePaginationState>({
  page: 1,
  pageSize: 8,
  total: baseRows.length,
})

const sort = ref<ProTableSortState>({
  field: null,
  order: null,
})

const categoryOptionsMap = computed(() => ({
  draft: [
    { label: '规划中', value: 'planning' },
    { label: '待评审', value: 'review' },
  ],
  published: [
    { label: '正式发布', value: 'release' },
    { label: '增长活动', value: 'growth' },
  ],
  archived: [
    { label: '历史归档', value: 'history' },
  ],
}))

const searchSchema = computed<SearchFieldSchema[]>(() => [
  {
    meta: {
      field: 'keyword',
      label: '关键词',
      valueType: 'string',
      defaultValue: '',
    },
    ui: {
      component: 'Input',
      props: {
        placeholder: '按名称或负责人搜索，回车可查询',
        clearable: true,
      },
      layout: { group: 'basic', span: 8 },
    },
  },
  {
    meta: {
      field: 'status',
      label: '状态',
      valueType: 'string',
      defaultValue: 'published',
    },
    ui: {
      component: 'Select',
      props: { clearable: true, placeholder: '请选择状态' },
      layout: { group: 'basic', span: 8 },
      options: [
        { label: '草稿', value: 'draft' },
        { label: '已发布', value: 'published' },
        { label: '已归档', value: 'archived' },
      ],
    },
  },
  {
    meta: {
      field: 'category',
      label: '分类',
      valueType: 'string',
      defaultValue: '',
    },
    ui: {
      component: 'Select',
      props: { clearable: true, placeholder: '依状态动态切换选项' },
      layout: { group: 'basic', span: 8 },
    },
    runtime: {
      dependencies: ['status'],
      options: async (values) => {
        // 用依赖字段驱动分类选项，展示 SearchBarField 的异步联动能力。
        const status = String(values.status || 'published') as keyof typeof categoryOptionsMap.value
        return categoryOptionsMap.value[status] ?? []
      },
    },
  },
  {
    meta: {
      field: 'owner',
      label: '负责人',
      valueType: 'string',
      defaultValue: '',
    },
    ui: {
      component: 'Select',
      props: { clearable: true, placeholder: '高级筛选中的负责人' },
      layout: { group: 'advanced', span: 8 },
      options: [
        { label: '阿青', value: '阿青' },
        { label: '北辰', value: '北辰' },
        { label: '临川', value: '临川' },
      ],
    },
  },
  {
    meta: {
      field: 'createdRange',
      label: '创建日期',
      valueType: 'dateRange',
    },
    ui: {
      component: 'DatePicker',
      props: {
        type: 'daterange',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        valueFormat: 'YYYY-MM-DD',
      },
      layout: { group: 'advanced', span: 16 },
      tooltip: {
        content: '会被序列化成 startDate / endDate',
        placement: 'top',
      },
    },
    runtime: {
      transform: {
        serialize(value) {
          if (!Array.isArray(value) || value.length !== 2)
            return undefined
          // 日期范围在路由/接口层拆成两个独立参数，更方便后端和链接分享消费。
          return {
            startDate: value[0],
            endDate: value[1],
          }
        },
        deserialize(query) {
          const startDate = query.startDate
          const endDate = query.endDate
          if (typeof startDate !== 'string' || typeof endDate !== 'string')
            return undefined
          return [startDate, endDate]
        },
      },
    },
  },
])

const filteredRows = computed(() => {
  const keyword = String(searchValues.value.keyword ?? '').trim().toLowerCase()
  const status = String(searchValues.value.status ?? '')
  const category = String(searchValues.value.category ?? '')
  const owner = String(searchValues.value.owner ?? '')
  const range = searchValues.value.createdRange as string[] | undefined

  return baseRows.filter((row) => {
    const matchKeyword = !keyword
      || row.name.toLowerCase().includes(keyword)
      || row.owner.toLowerCase().includes(keyword)
    const matchStatus = !status || row.status === status
    const matchCategory = !category || row.category === category
    const matchOwner = !owner || row.owner === owner
    const matchRange = !Array.isArray(range) || range.length !== 2
      || (row.createdAt >= range[0] && row.createdAt <= range[1])

    return matchKeyword && matchStatus && matchCategory && matchOwner && matchRange
  })
})

const sortedRows = computed(() => {
  const rows = [...filteredRows.value]
  if (!sort.value.field || !sort.value.order)
    return rows

  // Demo 统一转成字符串排序，保证不同列类型在示例里都能稳定演示排序交互。
  return rows.sort((a, b) => {
    const left = String(a[sort.value.field as keyof DemoRow] ?? '')
    const right = String(b[sort.value.field as keyof DemoRow] ?? '')
    const result = left.localeCompare(right, 'zh-Hans-CN')
    return sort.value.order === 'asc' ? result : -result
  })
})

const pagedRows = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return sortedRows.value.slice(start, end)
})

watch(
  () => filteredRows.value.length,
  (total) => {
    // 筛选条件变化后只更新 total，保留当前 page/pageSize 由表格组件继续接管。
    pagination.value = {
      ...pagination.value,
      total,
    }
  },
  { immediate: true },
)

const columns = computed<TableColumnSchema[]>(() => [
  {
    meta: { field: 'name', label: '名称', valueType: 'string' },
    ui: { component: 'Text', minWidth: 180, sortable: true, ellipsis: true },
  },
  {
    meta: { field: 'status', label: '状态', valueType: 'enum' },
    ui: { component: 'Tag', width: 100, align: 'center' },
    runtime: {
      formatter: (value) => {
        if (value === 'draft')
          return '草稿'
        if (value === 'published')
          return '已发布'
        return '已归档'
      },
      tagType: (value) => {
        if (value === 'published')
          return 'success'
        if (value === 'archived')
          return 'info'
        return 'warning'
      },
    },
  },
  {
    meta: { field: 'category', label: '分类', valueType: 'string' },
    ui: { component: 'Text', width: 120 },
  },
  {
    meta: { field: 'owner', label: '负责人', valueType: 'string' },
    ui: { component: 'Text', width: 100 },
  },
  {
    meta: { field: 'createdAt', label: '创建日期', valueType: 'date' },
    ui: { component: 'Text', width: 120, sortable: true },
  },
])

async function loadData() {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 180))
  loading.value = false
}

async function handleSearch(payload: { rawValues: Record<string, unknown>, serializedValues: Record<string, unknown> }) {
  searchValues.value = { ...payload.rawValues }
  lastPayload.value = { ...payload.serializedValues }
  pagination.value = {
    ...pagination.value,
    page: 1,
  }
  await loadData()
}

async function handleReset(payload: { rawValues: Record<string, unknown>, serializedValues: Record<string, unknown> }) {
  searchValues.value = { ...payload.rawValues }
  lastPayload.value = { ...payload.serializedValues }
  pagination.value = {
    ...pagination.value,
    page: 1,
  }
  await loadData()
}

async function handlePageChange(nextValue: ProTablePaginationState) {
  pagination.value = nextValue
  await loadData()
}

async function handleSortChange(nextValue: ProTableSortState) {
  sort.value = nextValue
  pagination.value = {
    ...pagination.value,
    page: 1,
  }
  await loadData()
}
</script>

<template>
  <div class="search-bar-demo">
    <section class="search-bar-demo__hero">
      <div>
        <p class="search-bar-demo__eyebrow">
          SearchBar / ProTable
        </p>
        <h1>列表筛选与表格联动示例</h1>
        <p>
          这个页面演示了默认条件、展开收起、动态选项、URL 参数恢复，以及筛选条件与分页排序的组合方式。
        </p>
      </div>
    </section>

    <SearchBar
      v-model="searchValues"
      :schema="searchSchema"
      :loading="loading"
      :default-visible-count="2"
      sync-route
      route-key="filters"
      auto-search-on-init
      @search="handleSearch"
      @reset="handleReset"
    >
      <template #searchbar-actions-extra>
        <el-tag type="info" effect="plain">
          当前结果 {{ filteredRows.length }} 条
        </el-tag>
      </template>
    </SearchBar>

    <section class="search-bar-demo__panel">
      <el-card shadow="never">
        <template #header>
          <div class="search-bar-demo__panel-header">
            <span>最近一次序列化参数</span>
            <el-tag type="success" effect="plain">
              route-key: filters
            </el-tag>
          </div>
        </template>
        <pre class="search-bar-demo__payload">{{ JSON.stringify(lastPayload, null, 2) }}</pre>
      </el-card>
    </section>

    <section class="search-bar-demo__panel">
      <ProTable
        row-key="id"
        :columns="columns"
        :data="pagedRows as unknown as Record<string, unknown>[]"
        :pagination="pagination"
        :sort="sort"
        :loading="loading"
        @update:pagination="handlePageChange"
        @update:sort="handleSortChange"
      />
    </section>
  </div>
</template>

<style scoped lang="scss">
.search-bar-demo {
  display: grid;
  gap: 1.25rem;
  padding: 1.5rem;
  background:
    radial-gradient(circle at top right, rgba(14, 165, 233, 0.12), transparent 30%),
    linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
  min-height: 100%;
}

.search-bar-demo__hero {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 24px;
  color: #0f172a;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(224, 242, 254, 0.92) 100%);
  border: 1px solid rgba(14, 165, 233, 0.14);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}

.search-bar-demo__hero h1 {
  margin: 0.25rem 0 0.75rem;
  font-size: 2rem;
}

.search-bar-demo__hero p {
  margin: 0;
  max-width: 760px;
  line-height: 1.7;
  color: #334155;
}

.search-bar-demo__eyebrow {
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0284c7;
}

.search-bar-demo__panel {
  border-radius: 24px;
  overflow: hidden;
}

.search-bar-demo__panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.search-bar-demo__payload {
  margin: 0;
  padding: 1rem;
  border-radius: 16px;
  background: #0f172a;
  color: #e2e8f0;
  overflow: auto;
}

@media (max-width: 768px) {
  .search-bar-demo {
    padding: 1rem;
  }

  .search-bar-demo__hero {
    padding: 1.25rem;
  }

  .search-bar-demo__hero h1 {
    font-size: 1.5rem;
  }
}
</style>
