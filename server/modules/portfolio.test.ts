import { describe, expect, it } from 'vitest'
import { calculatePortfolio } from './portfolio.js'

describe('portfolio valuation', () => {
  it('calculates current value and result from a provider quote', () => {
    const [position] = calculatePortfolio([{ symbol: 'BTC', quantity: 2, averagePrice: 100, currency: 'USD' }], [{ symbol: 'BTC', value: 125, change: 5, source: 'coingecko', simulated: false }])
    expect(position.currentValue).toBe(250)
    expect(position.result).toBe(50)
    expect(position.variationPercent).toBe(25)
    expect(position.quoteAvailable).toBe(true)
  })
})
