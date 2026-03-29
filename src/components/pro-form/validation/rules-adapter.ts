import type {
  FormFieldSchema,
  ProFormContext,
  ValidationRule,
  ValidationRuleValidator,
} from '@/types/pro-form'

interface ElFormRule {
  trigger?: string | string[]
  message?: string
  validator: (rule: unknown, value: unknown, callback: (error?: Error) => void) => void
}

type FormValuesGetter = () => Record<string, unknown>

function isEmptyValue(value: unknown) {
  if (value === null || value === undefined)
    return true
  if (typeof value === 'string')
    return value.trim().length === 0
  if (Array.isArray(value))
    return value.length === 0
  return false
}

async function runValidator(
  validator: ValidationRuleValidator,
  value: unknown,
  formValues: Record<string, unknown>,
  context: ProFormContext,
) {
  // callback 风格：validator(value, formValues, context, done)
  if (validator.length >= 4) {
    return await new Promise<boolean>((resolve, reject) => {
      let settled = false
      const done = (ok: boolean) => {
        if (settled)
          return
        settled = true
        resolve(ok)
      }
      try {
        ;(validator as (v: unknown, fv: Record<string, unknown>, c: ProFormContext, d: (ok: boolean) => void) => void)(
          value,
          formValues,
          context,
          done,
        )
      }
      catch (e) {
        reject(e)
      }
    })
  }

  // 同步/异步返回 boolean | Promise<boolean>
  return await Promise.resolve(
    (validator as (v: unknown, fv: Record<string, unknown>, c: ProFormContext) => boolean | Promise<boolean>)(
      value,
      formValues,
      context,
    ),
  )
}

function resolveWhen(
  when: ValidationRule['when'],
  formValues: Record<string, unknown>,
  context: ProFormContext,
) {
  if (when === undefined)
    return true
  if (typeof when === 'boolean')
    return when
  return when(formValues, context)
}

function buildRuleValidator(
  rule: ValidationRule,
  getValues: FormValuesGetter,
  context: ProFormContext,
): ElFormRule['validator'] {
  return async (_rule, value, callback) => {
    const formValues = getValues()

    let enabled = true
    try {
      enabled = resolveWhen(rule.when, formValues, context)
    }
    catch (e) {
      callback(e instanceof Error ? e : new Error(String(e)))
      return
    }

    if (!enabled) {
      callback()
      return
    }

    try {
      const ok = await runValidator(rule.validator, value, formValues, context)
      if (ok)
        callback()
      else callback(new Error(rule.message))
    }
    catch (e) {
      callback(e instanceof Error ? e : new Error(String(e)))
    }
  }
}

function buildRequiredRule(
  field: FormFieldSchema,
  getValues: FormValuesGetter,
  _context: ProFormContext,
): ElFormRule {
  const label = field.meta.label || field.meta.field
  return {
    trigger: ['blur', 'change'],
    message: `${label}为必填项`,
    validator: (_rule, value, callback) => {
      const formValues = getValues()
      void formValues
      if (isEmptyValue(value))
        callback(new Error(`${label}为必填项`))
      else callback()
    },
  }
}

function shouldBuildRulesForField(field: FormFieldSchema) {
  const visible = field.runtime?.visible
  if (visible !== false)
    return true
  return field.runtime?.validation?.validateWhenHidden === true
}

/**
 * 将 ProForm runtime.validation 适配为 Element Plus ElForm rules。
 *
 * - 支持 trigger（change/blur/submit）
 * - 支持 when（boolean 或函数），在触发时动态判断是否启用
 * - 支持 validator：同步/异步返回 boolean，或 callback 风格 done(ok)
 * - 隐藏字段（visible === false）且未 validateWhenHidden 的字段不生成 rules
 *
 * 注意：validateFirst 不在 adapter 内处理，由调用侧决定是否只展示/执行第一条失败规则。
 */
export function buildElFormRules(
  schema: FormFieldSchema[],
  getValues: FormValuesGetter,
  context: ProFormContext = {},
): Record<string, ElFormRule[]> {
  const rules: Record<string, ElFormRule[]> = {}

  for (const field of schema) {
    if (!shouldBuildRulesForField(field))
      continue

    const fieldKey = field.meta.field
    if (!fieldKey)
      continue

    const fieldRules: ElFormRule[] = []

    if (field.meta.required) {
      fieldRules.push(buildRequiredRule(field, getValues, context))
    }

    const runtimeRules = field.runtime?.validation?.rules ?? []
    for (const r of runtimeRules) {
      const elRule: ElFormRule = {
        trigger: r.trigger,
        message: r.message,
        validator: buildRuleValidator(r, getValues, context),
      }
      fieldRules.push(elRule)
    }

    if (fieldRules.length > 0) {
      rules[fieldKey] = fieldRules
    }
  }

  return rules
}
