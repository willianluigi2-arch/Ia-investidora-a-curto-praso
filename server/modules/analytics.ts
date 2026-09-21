export type Candle = { timestamp: string; close: number }
export type Analytics = { returnPercent: number; volatilityPercent: number; high: number; low: number; observations: number }

export function calculateAnalytics(candles: Candle[]): Analytics {
  if (!candles.length) return { returnPercent: 0, volatilityPercent: 0, high: 0, low: 0, observations: 0 }
  const prices = candles.map((c) => c.close)
  const first = prices[0]
  const returns = prices.slice(1).map((price, index) => first === 0 ? 0 : ((price - prices[index]) / prices[index]) * 100)
  const mean = returns.length ? returns.reduce((sum, value) => sum + value, 0) / returns.length : 0
  const variance = returns.length ? returns.reduce((sum, value) => sum + (value - mean) ** 2, 0) / returns.length : 0
  return { returnPercent: first === 0 ? 0 : ((prices.at(-1)! - first) / first) * 100, volatilityPercent: Math.sqrt(variance), high: Math.max(...prices), low: Math.min(...prices), observations: prices.length }
}
