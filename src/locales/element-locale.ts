/**
 * Element Plus 语言包与项目 locale 映射
 * 项目使用 zh-CN / en-US，EP 使用 zh-cn / en
 */
import type { Locale } from './config'
import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const localeMap: Record<Locale, typeof zhCn> = {
  'zh-CN': zhCn,
  'en-US': en,
}

/**
 * 根据项目当前 locale 返回 Element Plus 的 locale 对象，供 ElConfigProvider 使用
 */
export function getElementLocale(locale: Locale): typeof zhCn {
  return localeMap[locale] ?? zhCn
}
