import { calculateAnalytics, type Candle } from './analytics.js'

export type BacktestInput = { candles: Candle[]; initialCapital: number; quantity: number }
export type BacktestResult = { initialCapital: number; finalCapital: number; returnPercent: number; trades: number; simulated: true; disclaimer: string }

/** Simple buy-and-hold simulation over supplied, versioned historical input. */
export function runBacktest(input: BacktestInput): BacktestResult {
  const first = input.candles[0]?.close ?? 0
  const last = input.candles.at(-1)?.close ?? 0
  const result = input.initialCapital + (last - first) * input.quantity
  const analytics = calculateAnalytics(input.candles)
  return { initialCapital: input.initialCapital, finalCapital: result, returnPercent: input.initialCapital === 0 ? 0 : ((result - input.initialCapital) / input.initialCapital) * 100, trades: input.candles.length > 1 ? 1 : 0, simulated: true, disclaimer: `Backtest educacional sobre ${analytics.observations} observações; não representa execução real.` }
}
