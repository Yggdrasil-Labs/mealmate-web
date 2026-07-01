<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed, nextTick, ref, watch } from 'vue'
import { useAiChat } from '@/composables/useAiChat'

/**
 * AI 菜品录入抽屉组件。
 *
 * 包含对话消息列表、输入框、结构化预览卡片和确认按钮。
 * 多轮对话 composable 管理 sessionId / 消息列表 / loading 状态。
 */

const props = defineProps<{
  /** 抽屉可见性（v-model） */
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  /** 确认入库成功，携带 recipeId */
  'confirmed': [recipeId: number]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const { messages, parsed, status, suggestions, loading, error, send, confirm, reset } = useAiChat()

// 输入框绑定
const inputMessage = ref('')
const chatContainerRef = ref<HTMLElement | null>(null)

/** 发送消息 */
async function handleSend() {
  const msg = inputMessage.value.trim()
  if (!msg || loading.value)
    return
  inputMessage.value = ''
  await send(msg)
  // 滚动到底部
  await nextTick()
  scrollToBottom()
}

/** 确认入库 */
async function handleConfirm() {
  const recipeId = await confirm()
  if (recipeId !== null) {
    ElMessage.success('菜品录入成功')
    emit('confirmed', recipeId)
    visible.value = false
  }
}

/** 关闭时重置状态 */
function handleClose() {
  reset()
}

/** 滚动消息列表到底部 */
function scrollToBottom() {
  if (chatContainerRef.value) {
    chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight
  }
}

/** 确认按钮是否可用 */
const canConfirm = computed(() => status.value === 'READY_TO_CONFIRM' && !loading.value)

/** 输入框是否禁用 */
const inputDisabled = computed(() => loading.value || status.value === 'READY_TO_CONFIRM')

// 抽屉关闭时重置
watch(visible, (val) => {
  if (!val)
    handleClose()
})
</script>

<template>
  <el-drawer
    v-model="visible"
    title="AI 智能录入菜品"
    size="560px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="ai-chat-drawer">
      <!-- 对话消息列表 -->
      <div ref="chatContainerRef" class="ai-chat-drawer__messages">
        <div v-if="messages.length === 0" class="ai-chat-drawer__empty">
          <el-text type="info">
            请用自然语言描述您想录入的菜品，例如：「番茄炒蛋，2个番茄3个鸡蛋，10分钟」
          </el-text>
        </div>
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          class="ai-chat-drawer__bubble" :class="[`ai-chat-drawer__bubble--${msg.role}`]"
        >
          <div class="ai-chat-drawer__bubble-content">
            {{ msg.content }}
          </div>
        </div>
        <div v-if="loading" class="ai-chat-drawer__bubble ai-chat-drawer__bubble--assistant">
          <div class="ai-chat-drawer__bubble-content ai-chat-drawer__loading">
            AI 正在解析...
          </div>
        </div>
      </div>

      <!-- 结构化预览卡片 -->
      <div v-if="parsed && parsed.name" class="ai-chat-drawer__preview">
        <el-card shadow="never">
          <template #header>
            <div class="ai-chat-drawer__preview-header">
              <span>解析预览</span>
              <el-tag :type="status === 'READY_TO_CONFIRM' ? 'success' : 'warning'" size="small">
                {{ status === 'READY_TO_CONFIRM' ? '可确认' : '需补充' }}
              </el-tag>
            </div>
          </template>
          <el-descriptions :column="2" size="small" border>
            <el-descriptions-item label="菜名">
              {{ parsed.name }}
            </el-descriptions-item>
            <el-descriptions-item label="类型">
              {{ parsed.recipeType ?? '—' }}
            </el-descriptions-item>
            <el-descriptions-item label="时间">
              {{ parsed.cookingTimeMin ? `${parsed.cookingTimeMin}分钟` : '—' }}
            </el-descriptions-item>
            <el-descriptions-item label="难度">
              {{ parsed.difficultyLevel ?? '—' }}
            </el-descriptions-item>
            <el-descriptions-item label="食材" :span="2">
              <template v-if="parsed.ingredients?.length">
                {{ parsed.ingredients.map(i => i.ingredientName).join('、') }}
              </template>
              <template v-else>
                —
              </template>
            </el-descriptions-item>
            <el-descriptions-item label="步骤" :span="2">
              <template v-if="parsed.steps?.length">
                {{ parsed.steps.length }} 步
              </template>
              <template v-else>
                <el-text type="warning">
                  未填写
                </el-text>
              </template>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </div>

      <!-- 补充建议 -->
      <div v-if="suggestions.length > 0" class="ai-chat-drawer__suggestions">
        <el-tag
          v-for="(s, idx) in suggestions"
          :key="idx"
          size="small"
          type="info"
          effect="plain"
          class="ai-chat-drawer__suggestion-tag"
          @click="inputMessage = s"
        >
          {{ s }}
        </el-tag>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="ai-chat-drawer__error">
        <el-alert :title="error" type="error" show-icon :closable="false" />
      </div>

      <!-- 底部输入区域 -->
      <div class="ai-chat-drawer__footer">
        <el-input
          v-model="inputMessage"
          placeholder="描述菜品信息..."
          :disabled="inputDisabled"
          clearable
          @keyup.enter="handleSend"
        >
          <template #append>
            <el-button
              :icon="loading ? '' : undefined"
              :loading="loading"
              :disabled="!inputMessage.trim() || loading"
              @click="handleSend"
            >
              发送
            </el-button>
          </template>
        </el-input>
        <el-button
          type="primary"
          :disabled="!canConfirm"
          class="ai-chat-drawer__confirm-btn"
          @click="handleConfirm"
        >
          确认录入
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<style lang="scss" scoped>
.ai-chat-drawer {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;

  &__messages {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 24px;
    text-align: center;
  }

  &__bubble {
    max-width: 85%;
    padding: 10px 14px;
    border-radius: 12px;
    line-height: 1.5;
    word-break: break-word;

    &--user {
      align-self: flex-end;
      background-color: var(--el-color-primary-light-9);
      border-bottom-right-radius: 4px;
    }

    &--assistant {
      align-self: flex-start;
      background-color: var(--el-fill-color-light);
      border-bottom-left-radius: 4px;
    }
  }

  &__loading {
    color: var(--el-text-color-secondary);
    font-style: italic;
  }

  &__preview {
    flex-shrink: 0;
  }

  &__preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  &__suggestion-tag {
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }

  &__error {
    flex-shrink: 0;
  }

  &__footer {
    flex-shrink: 0;
    display: flex;
    gap: 8px;
    align-items: center;
    padding-top: 8px;
    border-top: 1px solid var(--el-border-color-lighter);
  }

  &__confirm-btn {
    flex-shrink: 0;
  }
}
</style>
