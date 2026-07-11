import type {
  AiChatMessage,
  AiParsedRecipeData,
  AiParseStatus,
} from '@/modules/recipe/types'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { AI_RECIPE_CHAT_STREAM_URL } from '@/modules/recipe/api'
import { useAiStream } from './useAiStream'

/**
 * AI 对话式菜品解析 composable（流式版本）。
 *
 * 管理 sessionId、消息列表、解析数据、状态和 loading，
 * 提供 send（流式发送消息）、confirm（确认入库）、abort（中断流）和 reset 动作。
 *
 * send() 调用流式端点，逐步追加 assistant 消息实现打字机效果。
 */
export function useAiChat() {
  const sessionId = ref<string | null>(null)
  const messages = ref<AiChatMessage[]>([])
  const parsed = ref<AiParsedRecipeData | null>(null)
  const status = ref<AiParseStatus>('PARSING')
  const suggestions = ref<string[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const { stream, abort: abortStream } = useAiStream()

  /**
   * 发送用户消息，调用 AI 流式解析端点。
   * assistant 消息内容通过 onChunk 逐步追加，实现打字机效果。
   */
  async function send(userMessage: string) {
    if (!userMessage.trim())
      return

    loading.value = true
    error.value = null
    // 乐观追加用户消息
    messages.value.push({ role: 'user', content: userMessage })
    // 追加空 assistant 消息，后续通过 onChunk 逐步填充
    const assistantIdx = messages.value.length
    messages.value.push({ role: 'assistant', content: '' })

    // 流式请求走相对路径（通过 Vite dev proxy 或生产 nginx 代理）
    const streamBase = ''
    await stream(`${streamBase}${AI_RECIPE_CHAT_STREAM_URL}`, {
      sessionId: sessionId.value,
      message: userMessage,
    }, {
      onChunk: (chunk) => {
        // 逐步追加文本，实现打字机效果
        messages.value[assistantIdx].content += chunk
      },
      onResult: (data: unknown) => {
        const result = data as {
          sessionId?: string
          reply?: string
          parsed?: AiParsedRecipeData | null
          status?: AiParseStatus
          suggestions?: string[]
        }
        if (result.sessionId)
          sessionId.value = result.sessionId
        if (result.parsed !== undefined)
          parsed.value = result.parsed
        if (result.status)
          status.value = result.status
        suggestions.value = result.suggestions ?? []
        // 确保最终 reply 完整（覆盖 chunk 拼接）
        if (result.reply) {
          messages.value[assistantIdx].content = result.reply
        }
      },
      onError: (err) => {
        error.value = err.message
        // 移除乐观追加的 assistant 和 user 消息
        messages.value.splice(assistantIdx, 1)
        messages.value.pop()
        ElMessage.error(err.message)
      },
    })
    loading.value = false
  }

  /** 中断当前流式请求 */
  function abort() {
    abortStream()
    loading.value = false
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
      const { aiRecipeConfirm } = await import('@/modules/recipe/api')
      const result = await aiRecipeConfirm({
        sessionId: sessionId.value,
        recipe: editedParsed ?? parsed.value,
      })
      status.value = 'READY_TO_CONFIRM'
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
    abort,
    reset,
  }
}
