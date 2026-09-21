import { z } from 'zod'

export const backtestRequestSchema = z.object({
  symbol: z.string().regex(/^[A-Z0-9]{4,6}$/),
  initialCapital: z.number().positive().max(10_000_000),
  strategy: z.enum(['moving-average', 'buy-and-hold']),
})

export type BacktestRequest = z.infer<typeof backtestRequestSchema>

export type BacktestResult = {
  symbol: string
  strategy: BacktestRequest['strategy']
  initialCapital: number
  finalCapital: number
  returnPercent: number
  maxDrawdownPercent: number
  trades: number
  series: Array<{ day: number; value: number }>
  simulated: true
}

export function runBacktest(request: BacktestRequest): BacktestResult {
  const prices = [100, 101, 99, 103, 105, 104, 108, 107, 110, 112, 111, 115]
  const series: Array<{ day: number; value: number }> = [{ day: 0, value: request.initialCapital }]
  let capital = request.initialCapital
  let peak = capital
  let maxDrawdownPercent = 0
  let trades = 0

  prices.slice(1).forEach((price, index) => {
    const previousPrice = prices[index]
    const signal = request.strategy === 'buy-and-hold' || price > previousPrice
    if (signal) {
      capital *= price / previousPrice
      trades += 1
    }
    peak = Math.max(peak, capital)
    maxDrawdownPercent = Math.max(maxDrawdownPercent, ((peak - capital) / peak) * 100)
    series.push({ day: index + 1, value: Number(capital.toFixed(2)) })
  })

  return {
    symbol: request.symbol,
    strategy: request.strategy,
    initialCapital: request.initialCapital,
    finalCapital: Number(capital.toFixed(2)),
    returnPercent: Number((((capital / request.initialCapital) - 1) * 100).toFixed(2)),
    maxDrawdownPercent: Number(maxDrawdownPercent.toFixed(2)),
    trades,
    series,
    simulated: true,
  }
}