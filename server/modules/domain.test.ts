import { describe, expect, it } from 'vitest'
import { calculateAnalytics } from './analytics.js'
import { runBacktest } from './backtest.js'
import { assessRisk } from './riskEngine.js'

const candles = [{ timestamp: '2026-01-01', close: 100 }, { timestamp: '2026-01-02', close: 110 }]

describe('simulation domain', () => {
  it('calculates bounded position risk', () => {
    const result = assessRisk({ capital: 10000, riskPercent: 1, entryPrice: 100, stopPrice: 95, quantity: 20 })
    expect(result.withinLimit).toBe(true)
    expect(result.riskAmount).toBe(100)
  })
  it('calculates analytics without market claims', () => {
    expect(calculateAnalytics(candles).returnPercent).toBe(10)
  })
  it('runs an explicitly simulated backtest', () => {
    const result = runBacktest({ candles, initialCapital: 10000, quantity: 10 })
    expect(result.finalCapital).toBe(10100)
    expect(result.simulated).toBe(true)
  })
})
