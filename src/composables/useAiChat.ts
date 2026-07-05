import type {
  AiChatMessage,
  AiParsedRecipeData,
  AiParseStatus,
} from '@/modules/recipe/types'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { aiRecipeChat, aiRecipeConfirm } from '@/modules/recipe/api'

/**
 * AI 对话式菜品解析 composable。
 *
 * 管理 sessionId、消息列表、解析数据、状态和 loading，
 * 提供 send（发送消息）和 confirm（确认入库）两个动作。
 */
export function useAiChat() {
  const sessionId = ref<string | null>(null)
  const messages = ref<AiChatMessage[]>([])
  const parsed = ref<AiParsedRecipeData | null>(null)
  const status = ref<AiParseStatus>('PARSING')
  const suggestions = ref<string[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 发送用户消息，调用 AI 解析 API。
   */
  async function send(userMessage: string) {
    if (!userMessage.trim())
      return

    loading.value = true
    error.value = null
    // 乐观追加用户消息
    messages.value.push({ role: 'user', content: userMessage })

    try {
      const reply = await aiRecipeChat({
        sessionId: sessionId.value,
        message: userMessage,
      })

      sessionId.value = reply.sessionId
      messages.value.push({ role: 'assistant', content: reply.reply })
      parsed.value = reply.parsed
      status.value = reply.status
      suggestions.value = reply.suggestions
    }
    catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'AI 服务暂不可用'
      error.value = msg
      // 移除乐观追加的用户消息
      messages.value.pop()
      ElMessage.error(msg)
    }
    finally {
      loading.value = false
    }
  }

  /**
   * 确认入库。可传入编辑后的 parsed 数据。
   * @returns 入库成功的 recipeId，失败返回 null
   */
  async function confirm(editedParsed?: AiParsedRecipeData): Promise<number | null> {
    if (!sessionId.value || !parsed.value)
      return null

    loading.value = true
    error.value = null

    try {
      const result = await aiRecipeConfirm({
        sessionId: sessionId.value,
        recipe: editedParsed ?? parsed.value,
      })
      status.value = 'READY_TO_CONFIRM' // 确认后保持
      return result.recipeId
    }
    catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '确认入库失败'
      error.value = msg
      ElMessage.error(msg)
      return null
    }
    finally {
      loading.value = false
    }
  }

  /** 重置状态，开始新会话 */
  function reset() {
    sessionId.value = null
    messages.value = []
    parsed.value = null
    status.value = 'PARSING'
    suggestions.value = []
    loading.value = false
    error.value = null
  }

  return {
    sessionId,
    messages,
    parsed,
    status,
    suggestions,
    loading,
    error,
    send,
    confirm,
    reset,
  }
}
