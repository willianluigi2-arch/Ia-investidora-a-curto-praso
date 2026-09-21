export type MarketQuote = { symbol: string; name: string; value: number; change: number }

export interface MarketDataProvider {
  overview(): Promise<MarketQuote[]>
}

export class MockMarketDataProvider implements MarketDataProvider {
  async overview(): Promise<MarketQuote[]> {
    return [
      { symbol: 'IBOV', name: 'Ibovespa', value: 128_946, change: 1.24 },
      { symbol: 'DOL', name: 'Dólar comercial', value: 5.18, change: -0.38 },
      { symbol: 'PETR4', name: 'Petrobras PN', value: 38.72, change: 2.16 },
      { symbol: 'VALE3', name: 'Vale ON', value: 61.48, change: 0.84 },
      { symbol: 'ITUB4', name: 'Itaú Unibanco', value: 35.09, change: -0.21 },
    ]
  }
}