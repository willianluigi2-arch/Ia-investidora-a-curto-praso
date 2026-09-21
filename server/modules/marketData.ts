export type MarketQuote = {
  symbol: string
  name: string
  value: number
  change: number
  currency: 'BRL' | 'index'
  source: 'mock'
  simulated: true
  asOf: string
}

export interface MarketDataProvider { overview(): Promise<MarketQuote[]> }

/** Deliberately simulated dataset. It must never be presented as live market data. */
export class MockMarketDataProvider implements MarketDataProvider {
  async overview(): Promise<MarketQuote[]> {
    const asOf = new Date().toISOString()
    return [
      { symbol: 'IBOV', name: 'Ibovespa (simulado)', value: 128946, change: 1.24, currency: 'index', source: 'mock', simulated: true, asOf },
      { symbol: 'DOL', name: 'Dólar comercial (simulado)', value: 5.18, change: -0.38, currency: 'BRL', source: 'mock', simulated: true, asOf },
      { symbol: 'PETR4', name: 'Petrobras PN (simulado)', value: 38.72, change: 2.16, currency: 'BRL', source: 'mock', simulated: true, asOf },
      { symbol: 'VALE3', name: 'Vale ON (simulado)', value: 61.48, change: 0.84, currency: 'BRL', source: 'mock', simulated: true, asOf },
      { symbol: 'ITUB4', name: 'Itaú Unibanco (simulado)', value: 35.09, change: -0.21, currency: 'BRL', source: 'mock', simulated: true, asOf },
    ]
  }
}
