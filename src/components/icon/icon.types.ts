/**
 * 图标语义化命名类型（页面层只使用语义，不绑定具体库）
 * 与 Notion「Icons 的最佳实践」保持一致
 */
export type SemanticIconName
  = | 'add'
    | 'edit'
    | 'delete'
    | 'search'
    | 'refresh'
    | 'close'
    | 'back'
    | 'expand'
    | 'fold'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'menu-dashboard'
    | 'menu-system'
    | 'menu-user'
    | 'status-success'
    | 'status-warning'
    | 'status-error'
    | 'tech-vue'
    | 'tech-vite'
    | 'tech-router'
    | 'tech-pinia'
    | 'tech-i18n'
    | 'tech-tools'

/** 图标来源：不传或传 default 为通用库，local 为本地 SVG */
export type IconSource
  = 'default' | 'local'
