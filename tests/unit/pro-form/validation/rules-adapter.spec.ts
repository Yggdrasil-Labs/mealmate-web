import type { FormFieldSchema, ProFormContext } from '@/types/pro-form'
import { describe, expect, it } from 'vitest'
import { buildElFormRules } from '@/components/pro-form/validation'

function makeField(partial: Partial<FormFieldSchema>): FormFieldSchema {
  return {
    meta: {
      field: 'f',
      label: '字段',
      valueType: 'string',
      required: false,
      ...partial.meta,
    },
    ui: {
      component: 'Input',
      ...partial.ui,
    },
    runtime: partial.runtime,
  }
}

function runElRuleValidator(
  ruleValidator: (rule: unknown, value: unknown, callback: (error?: Error) => void) => void,
  value: unknown,
) {
  return new Promise<Error | undefined>((resolve) => {
    ruleValidator({}, value, (error?: Error) => resolve(error))
  })
}

describe('pro-form/validation/rules-adapter', () => {
  it('meta.required 会生成默认必填规则', async () => {
    const values: Record<string, unknown> = {}
    const schema = [
      makeField({
        meta: { field: 'name', label: '名称', required: true },
      }),
    ]

    const rules = buildElFormRules(schema, () => values, {})
    expect(rules.name).toBeTruthy()
    expect(rules.name.length).toBeGreaterThanOrEqual(1)

    const requiredRule = rules.name[0]
    const err = await runElRuleValidator(requiredRule.validator, '')
    expect(err).toBeInstanceOf(Error)
  })

  it('trigger 数组会透传到 Element rule', () => {
    const values: Record<string, unknown> = {}
    const schema = [
      makeField({
        meta: { field: 'status', label: '状态', required: false },
        runtime: {
          validation: {
            rules: [
              {
                trigger: ['change', 'blur'],
                message: '错误',
                validator: () => false,
              },
            ],
          },
        },
      }),
    ]

    const rules = buildElFormRules(schema, () => values, {})
    expect(rules.status[0].trigger).toEqual(['change', 'blur'])
  })

  it('when 为 false 时，该条规则放行（不报错）', async () => {
    const values: Record<string, unknown> = {}
    const schema = [
      makeField({
        meta: { field: 'a', label: 'A', required: false },
        runtime: {
          validation: {
            rules: [
              {
                when: false,
                message: '不应出现',
                validator: () => false,
              },
            ],
          },
        },
      }),
    ]

    const rules = buildElFormRules(schema, () => values, {})
    const err = await runElRuleValidator(rules.a[0].validator, 'x')
    expect(err).toBeUndefined()
  })

  it('异步 validator 返回 false 时，返回 message 对应错误', async () => {
    const values: Record<string, unknown> = {}
    const context: ProFormContext = { env: 'test' }
    const schema = [
      makeField({
        meta: { field: 'u', label: '唯一性', required: false },
        runtime: {
          validation: {
            rules: [
              {
                message: '已存在',
                validator: async (_value, _values, ctx) => {
                  expect(ctx).toEqual(context)
                  return false
                },
              },
            ],
          },
        },
      }),
    ]

    const rules = buildElFormRules(schema, () => values, context)
    const err = await runElRuleValidator(rules.u[0].validator, 'dup')
    expect(err).toBeInstanceOf(Error)
    expect(err?.message).toBe('已存在')
  })
})
