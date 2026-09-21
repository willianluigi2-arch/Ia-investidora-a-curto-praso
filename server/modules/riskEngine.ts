import type { BacktestRequest } from './backtesting.js'

export type SimulationRisk = {
  notional: number
  maxLossAtStop: number
  riskPercentOfCapital: number
  withinLimit: boolean
  mode: 'simulation-only'
}

export function assessSimulationRisk(quantity: number, price: number, capital = 50_000, stopPercent = 2): SimulationRisk {
  const notional = quantity * price
  const maxLossAtStop = notional * (stopPercent / 100)
  return {
    notional: Number(notional.toFixed(2)),
    maxLossAtStop: Number(maxLossAtStop.toFixed(2)),
    riskPercentOfCapital: Number(((maxLossAtStop / capital) * 100).toFixed(2)),
    withinLimit: notional <= capital && maxLossAtStop <= capital * 0.02,
    mode: 'simulation-only',
  }
}

export function assessBacktestRisk(request: BacktestRequest) {
  return { capital: request.initialCapital, maxRiskPercentPerTrade: 2, mode: 'simulation-only' as const }
}