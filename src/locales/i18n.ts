import type { Locale } from './types'
import { createI18n } from 'vue-i18n'
import { STORAGE_KEYS } from '@/constants/storage'
import { updateLanguageAttribute } from '@/utils/initApp'
import { DEFAULT_LOCALE, LANGUAGE_CONFIGS, SUPPORTED_LOCALES } from './config'

// 重新导出配置，保持向后兼容
export { DEFAULT_LOCALE, SUPPORTED_LOCALES }

// 语言包缓存
const messageCache = new Map<Locale, any>()
const localeModuleLoaders = import.meta.glob('./*/*.json')

function mergeLocaleMessages(modules: Record<string, unknown>[]) {
  return modules.reduce<Record<string, unknown>>((merged, current) => {
    return deepMerge(merged, current)
  }, {})
}

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>) {
  const next = { ...target }

  Object.entries(source).forEach(([key, value]) => {
    const current = next[key]

    if (isPlainObject(current) && isPlainObject(value)) {
      next[key] = deepMerge(current, value)
      return
    }

    next[key] = value
  })

  return next
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// 动态加载语言包
async function loadLocaleMessages(locale: Locale) {
  // 检查缓存
  if (messageCache.has(locale)) {
    return messageCache.get(locale)
  }

  try {
    const localeEntries = Object.entries(localeModuleLoaders)
      .filter(([path]) => path.startsWith(`./${locale}/`))
      .sort(([left], [right]) => left.localeCompare(right))

    const localeModules = await Promise.all(
      localeEntries.map(async ([, load]) => {
        const module = await load()
        return (module as { default: Record<string, unknown> }).default
      }),
    )

    const messageData = mergeLocaleMessages(localeModules)

    // 缓存消息
    messageCache.set(locale, messageData)
    return messageData
  }
  catch (error) {
    console.error(`Failed to load locale messages for ${locale}:`, error)

    // 回退到默认语言
    if (locale !== DEFAULT_LOCALE) {
      return loadLocaleMessages(DEFAULT_LOCALE)
    }

    // 如果默认语言也失败，返回空对象
    return {}
  }
}

// 获取浏览器语言偏好
function getBrowserLocale(): Locale {
  const browserLocale = navigator.language || navigator.languages?.[0]

  if (!browserLocale) {
    return DEFAULT_LOCALE
  }

  // 根据配置动态匹配浏览器语言
  for (const config of LANGUAGE_CONFIGS) {
    const [langCode] = config.code.split('-')
    if (langCode && browserLocale.startsWith(langCode)) {
      return config.code as Locale
    }
  }

  // 默认返回配置中的默认语言
  return DEFAULT_LOCALE
}

// 从本地存储获取语言设置
function getStoredLocale(): Locale | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LOCALE)
    return stored && SUPPORTED_LOCALES.includes(stored as Locale)
      ? (stored as Locale)
      : null
  }
  catch {
    return null
  }
}

// 获取初始语言
function getInitialLocale(): Locale {
  return getStoredLocale() || getBrowserLocale()
}

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: getInitialLocale(), // 动态获取初始语言
  fallbackLocale: 'en-US', // 备用语言
  messages: {}, // 初始为空，动态加载
  // 全局属性
  globalInjection: true,
  // 警告模式（开发环境）
  warnHtmlMessage: import.meta.env.DEV,
})

// 语言切换函数
export async function setLocale(locale: Locale): Promise<void> {
  if (SUPPORTED_LOCALES.includes(locale)) {
    try {
      // 动态加载语言包
      const messages = await loadLocaleMessages(locale)
      i18n.global.setLocaleMessage(locale, messages)
      i18n.global.locale.value = locale

      // 保存到本地存储
      localStorage.setItem(STORAGE_KEYS.LOCALE, locale)

      // 更新 HTML lang 属性
      updateLanguageAttribute(locale)
    }
    catch (error) {
      console.error('Failed to load locale messages:', error)
    }
  }
}

// 获取当前语言
export function getCurrentLocale(): Locale {
  return i18n.global.locale.value as Locale
}

// 预加载其他语言包
async function preloadLocales() {
  const otherLocales = SUPPORTED_LOCALES.filter(locale => locale !== getInitialLocale())

  // 并行预加载其他语言包
  Promise.all(
    otherLocales.map(locale => loadLocaleMessages(locale)),
  ).catch((error) => {
    console.warn('Failed to preload some locales:', error)
  })
}

// 初始化语言包
async function initializeLocale() {
  const initialLocale = getInitialLocale()
  await setLocale(initialLocale)

  // 预加载其他语言包
  preloadLocales()
}

// 自动初始化
initializeLocale()

export default i18n
