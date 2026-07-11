import { createParser } from 'eventsource-parser'
import { ref } from 'vue'

/**
 * SSE 流式请求回调配置。
 *
 * - onChunk: 收到 event: chunk 时触发，data 为文本片段
 * - onResult: 收到 event: result 时触发，data 为 JSON 或原始字符串
 * - onError: 收到 event: error 或网络异常时触发
 * - onDone: 收到 event: done 时触发，表示流结束
 */
export interface StreamOptions {
  onChunk?: (text: string) => void
  onResult?: (data: unknown) => void
  onError?: (err: { code: string, message: string }) => void
  onDone?: () => void
}

/**
 * AI 流式请求 composable。
 *
 * 基于 fetch + ReadableStream + eventsource-parser 解析 SSE 事件，
 * 支持 chunk/done/result/error 四种事件类型和 abort 取消。
 */
export function useAiStream() {
  /** 是否正在接收流 */
  const streaming = ref(false)
  /** 错误信息，无错误时为 null */
  const error = ref<string | null>(null)
  /** 当前 AbortController，用于取消请求 */
  let abortController: AbortController | null = null

  /**
   * 发起 SSE 流式 POST 请求。
   *
   * @param url - 流式端点 URL（完整路径）
   * @param body - POST JSON 请求体
   * @param options - 事件回调
   */
  async function stream(
    url: string,
    body: Record<string, unknown>,
    options: StreamOptions = {},
  ): Promise<void> {
    streaming.value = true
    error.value = null
    abortController = new AbortController()

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: abortController.signal,
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || `HTTP ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader)
        throw new Error('No response body')

      const decoder = new TextDecoder()

      // eventsource-parser v3: createParser 接受 config 对象
      const parser = createParser({
        onEvent: (event) => {
          const { event: eventName, data } = event
          switch (eventName) {
            case 'chunk':
              options.onChunk?.(data)
              break
            case 'done':
              options.onDone?.()
              break
            case 'result':
              try {
                options.onResult?.(JSON.parse(data))
              }
              catch {
                options.onResult?.(data)
              }
              break
            case 'error':
              try {
                options.onError?.(JSON.parse(data))
              }
              catch {
                options.onError?.({ code: 'UNKNOWN', message: data })
              }
              break
          }
        },
      })

      // 逐块读取流并交给 parser 解析
      while (true) {
        const { done, value } = await reader.read()
        if (done)
          break
        parser.feed(decoder.decode(value, { stream: true }))
      }
    }
    catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // 用户主动取消，不设置 error
      }
      else {
        const msg = err instanceof Error ? err.message : 'Stream failed'
        error.value = msg
        options.onError?.({ code: 'STREAM_ERROR', message: msg })
      }
    }
    finally {
      streaming.value = false
      abortController = null
    }
  }

  /** 中断当前流式请求 */
  function abort() {
    abortController?.abort()
  }

  return { streaming, error, stream, abort }
}
