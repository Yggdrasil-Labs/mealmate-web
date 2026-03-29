import type { DetailFieldSchema } from '@/components/pro-detail/types'
import { describe, expect, it } from 'vitest'

describe('detail field schema', () => {
  it('keeps detail-only display extensions', () => {
    const schema: DetailFieldSchema = {
      meta: { field: 'status', label: '状态', valueType: 'string', required: true },
      ui: { component: 'Tag', copyable: true },
    }

    expect(schema.ui.copyable).toBe(true)
  })
})
