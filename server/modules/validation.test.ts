import { describe, expect, it } from 'vitest'
import { z } from 'zod'

const chatSchema = z.object({ message: z.string().trim().min(1).max(2000) })
const orderSchema = z.object({ symbol: z.string().regex(/^[A-Z0-9]{4,6}$/), side: z.enum(['buy', 'sell']), quantity: z.number().int().positive().max(1_000_000), price: z.number().positive().max(10_000) })

describe('API input contracts', () => {
  it('accepts a valid chat message and rejects empty input', () => {
    expect(chatSchema.safeParse({ message: 'Quais os riscos de PETR4?' }).success).toBe(true)
    expect(chatSchema.safeParse({ message: '   ' }).success).toBe(false)
  })

  it('accepts paper orders and rejects unsafe symbols', () => {
    expect(orderSchema.safeParse({ symbol: 'PETR4', side: 'buy', quantity: 100, price: 38.72 }).success).toBe(true)
    expect(orderSchema.safeParse({ symbol: 'petr4', side: 'buy', quantity: 100, price: 38.72 }).success).toBe(false)
  })
})