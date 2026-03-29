import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@/types/api'
import axios from 'axios'
import { env } from '@/config/env'

// 创建axios实例
const request: AxiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      }
    }

    console.log('请求发送:', {
      url: config.url,
      method: config.method,
      params: config.params,
      data: config.data,
    })

    return config
  },
  (error: AxiosError) => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response

    console.log('响应接收:', {
      url: response.config.url,
      status: response.status,
      data,
    })

    // cola5.0 统一处理响应数据
    if (data.success === true) {
      // 请求成功，直接返回响应
      return response
    }
    else {
      // 业务错误处理
      const errorMessage = data.errMessage || '请求失败'
      const errorCode = data.errCode || 'UNKNOWN_ERROR'

      console.error('业务错误:', {
        errCode: errorCode,
        errMessage: errorMessage,
      })

      // 可以在这里添加全局错误提示
      // ElMessage.error(errorMessage)

      // 创建带错误码的错误对象
      const error = new Error(errorMessage)
      ;(error as any).code = errorCode
      ;(error as any).response = response

      return Promise.reject(error)
    }
  },
  (error: AxiosError) => {
    console.error('响应拦截器错误:', error)

    let errorMessage = '网络错误，请稍后重试'
    let errorCode = 'NETWORK_ERROR'

    if (error.response) {
      const { status, data } = error.response
      const apiData = data as ApiResponse

      // 优先使用后端返回的错误信息
      if (apiData?.errMessage) {
        errorMessage = apiData.errMessage
        errorCode = apiData.errCode || 'UNKNOWN_ERROR'
      }
      else {
        // HTTP 状态码错误处理
        switch (status) {
          case 401:
            errorMessage = '未授权'
            errorCode = 'UNAUTHORIZED'
            break
          case 403:
            errorMessage = '拒绝访问'
            errorCode = 'FORBIDDEN'
            break
          case 404:
            errorMessage = '请求的资源不存在'
            errorCode = 'NOT_FOUND'
            break
          case 500:
            errorMessage = '服务器内部错误'
            errorCode = 'INTERNAL_SERVER_ERROR'
            break
          case 502:
            errorMessage = '网关错误'
            errorCode = 'BAD_GATEWAY'
            break
          case 503:
            errorMessage = '服务不可用'
            errorCode = 'SERVICE_UNAVAILABLE'
            break
          case 504:
            errorMessage = '网关超时'
            errorCode = 'GATEWAY_TIMEOUT'
            break
          default:
            errorMessage = apiData?.errMessage || `请求失败 (${status})`
            errorCode = 'HTTP_ERROR'
        }
      }
    }
    else if (error.request) {
      errorMessage = '网络连接失败，请检查网络'
      errorCode = 'NETWORK_ERROR'
    }
    else if (error.code === 'ECONNABORTED') {
      errorMessage = '请求超时'
      errorCode = 'TIMEOUT'
    }

    // 可以在这里添加全局错误提示
    // ElMessage.error(errorMessage)

    // 创建带错误码的错误对象
    const customError = new Error(errorMessage)
    ;(customError as any).code = errorCode
    ;(customError as any).originalError = error

    return Promise.reject(customError)
  },
)

export default request
