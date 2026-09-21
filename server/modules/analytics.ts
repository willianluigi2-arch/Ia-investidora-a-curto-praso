import type { MarketQuote } from './marketData.js'

export type MarketAnalytics = {
  marketMode: 'simulated'
  breadth: { advancing: number; declining: number }
  averageChange: number
  riskNote: string
}

export function summarizeMarket(quotes: MarketQuote[]): MarketAnalytics {
  const advancing = quotes.filter((quote) => quote.change >= 0).length
  const declining = quotes.length - advancing
  const averageChange = quotes.length === 0 ? 0 : quotes.reduce((total, quote) => total + quote.change, 0) / quotes.length
  return {
    marketMode: 'simulated',
    breadth: { advancing, declining },
    averageChange: Number(averageChange.toFixed(2)),
    riskNote: Math.abs(averageChange) > 1 ? 'Amplitude elevada: reduza o tamanho da posição na simulação.' : 'Amplitude moderada: mantenha o limite de risco configurado.',
  }
}