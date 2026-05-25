import type { AxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@/types/api'
import request from './request'

// HTTP方法封装类
class Http {
  get<T = any>(
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return request.get(url, { params, ...config })
  }

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return request.post(url, data, config)
  }

  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return request.put(url, data, config)
  }

  delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return request.delete(url, config)
  }

  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return request.patch(url, data, config)
  }

  upload<T = any>(
    url: string,
    file: File | FormData,
    onProgress?: (progressEvent: any) => void,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const formData = file instanceof FormData ? file : new FormData()
    if (file instanceof File) {
      formData.append('file', file)
    }

    return request.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress,
      ...config,
    })
  }

  download(
    url: string,
    filename?: string,
    config?: AxiosRequestConfig,
  ): Promise<void> {
    return request.get(url, {
      responseType: 'blob',
      ...config,
    }).then((response) => {
      const blob = new Blob([response.data])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    })
  }

  all<T = any>(requests: Array<Promise<ApiResponse<T>>>): Promise<ApiResponse<T>[]> {
    return Promise.all(requests)
  }
}

// 创建实例
const http = new Http()

// 导出实例和类
export default http
export { Http }

// 导出类型
export type { ApiResponse }
