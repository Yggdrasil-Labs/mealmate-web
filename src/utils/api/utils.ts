/**
 * API 工具函数
 * 提供通用的响应数据提取和处理功能
 */

import type { AxiosResponse } from 'axios'
import type { ApiResponse, PaginatedResponse } from '@/types/api'

/**
 * 从 Axios 响应中提取 data 字段
 * @param response - Axios 响应对象
 * @returns 响应数据
 */
export function extractData<T>(response: AxiosResponse<ApiResponse<T>>): T | undefined {
  return response.data.data
}

/**
 * 从 Axios 响应中提取 data 字段（非空）
 * @param response - Axios 响应对象
 * @param defaultValue - 默认值（当 data 为空时返回）
 * @returns 响应数据
 */
export function extractDataOrDefault<T>(
  response: AxiosResponse<ApiResponse<T>>,
  defaultValue: T,
): T {
  return response.data.data ?? defaultValue
}

/**
 * 从分页响应中提取数据
 * @param response - 分页响应对象
 * @returns 分页数据对象
 */
export function extractPaginatedData<T>(response: AxiosResponse<PaginatedResponse<T>>) {
  const { data, totalCount, pageSize, pageIndex, totalPages, notEmpty, empty } = response.data

  return {
    /** 列表数据 */
    data: data ?? [],
    /** 总记录数 */
    totalCount: totalCount ?? 0,
    /** 每页数量 */
    pageSize: pageSize ?? 10,
    /** 当前页码 */
    pageIndex: pageIndex ?? 1,
    /** 总页数 */
    totalPages: totalPages ?? 0,
    /** 是否非空 */
    notEmpty: notEmpty ?? false,
    /** 是否为空 */
    empty: empty ?? true,
  }
}

/**
 * 检查响应是否成功
 * @param response - API 响应对象
 * @returns 是否成功
 */
export function isSuccess(response: ApiResponse): boolean {
  return response.success === true
}

/**
 * 获取错误信息
 * @param error - 错误对象
 * @returns 错误信息
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return '未知错误'
}

/**
 * 获取错误码
 * @param error - 错误对象
 * @returns 错误码
 */
export function getErrorCode(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    return String((error as any).code)
  }
  return 'UNKNOWN_ERROR'
}
