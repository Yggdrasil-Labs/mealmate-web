/**
 * API 响应相关类型定义
 * 符合 cola5.0 标准返回结果格式
 */

/**
 * 基础 API 响应类型（后端实际返回格式）
 * @template T - 响应数据类型
 */
export interface ApiResponse<T = any> {
  /** 请求是否成功 */
  success: boolean
  /** 错误码（仅在失败时返回） */
  errCode?: string
  /** 错误信息（仅在失败时返回） */
  errMessage?: string
  /** 响应数据（可能不存在、可能是对象、可能是数组） */
  data?: T
}

/**
 * 分页响应类型
 * @template T - 列表项数据类型
 */
export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  /** 总记录数 */
  totalCount?: number
  /** 每页数量 */
  pageSize?: number
  /** 当前页码（从 1 开始） */
  pageIndex?: number
  /** 总页数 */
  totalPages?: number
  /** 是否非空 */
  notEmpty?: boolean
  /** 是否为空 */
  empty?: boolean
}

/**
 * 分页查询参数
 */
export interface PaginationParams {
  /** 页码（从 1 开始，默认 1） */
  pageNum?: number
  /** 每页数量（默认 10） */
  pageSize?: number
}

/**
 * 列表查询参数（带分页）
 * @template T - 查询条件类型
 */
export type ListParams<T = Record<string, any>> = T & PaginationParams
