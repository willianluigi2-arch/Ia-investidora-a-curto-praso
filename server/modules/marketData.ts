export type MarketQuote = {
  symbol: string
  name: string
  value: number
  change: number
  currency: 'BRL' | 'USD' | 'index'
  source: 'mock' | 'coingecko' | 'brapi'
  simulated: boolean
  asOf: string
}

export interface MarketDataProvider { overview(): Promise<MarketQuote[]> }

const cryptoAssets = [{ id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' }, { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' }]

export class MockMarketDataProvider implements MarketDataProvider {
  async overview(): Promise<MarketQuote[]> {
    const asOf = new Date().toISOString()
    return [
      { symbol: 'IBOV', name: 'Ibovespa (simulado)', value: 128946, change: 1.24, currency: 'index', source: 'mock', simulated: true, asOf },
      { symbol: 'PETR4', name: 'Petrobras PN (simulado)', value: 38.72, change: 2.16, currency: 'BRL', source: 'mock', simulated: true, asOf },
      { symbol: 'BTC', name: 'Bitcoin (simulado)', value: 0, change: 0, currency: 'USD', source: 'mock', simulated: true, asOf },
    ]
  }
}

export class CoinGeckoMarketDataProvider implements MarketDataProvider {
  constructor(private readonly baseUrl = 'https://api.coingecko.com/api/v3', private readonly fetcher = fetch) {}
  async overview(): Promise<MarketQuote[]> {
    const ids = cryptoAssets.map((asset) => asset.id).join(',')
    const response = await this.fetcher(`${this.baseUrl}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`, { signal: AbortSignal.timeout(8_000), headers: { accept: 'application/json' } })
    if (!response.ok) throw new Error(`CoinGecko returned ${response.status}`)
    const payload = await response.json() as Record<string, { usd?: number; usd_24h_change?: number }>
    const asOf = new Date().toISOString()
    return cryptoAssets.map((asset) => {
      const quote = payload[asset.id]
      if (typeof quote?.usd !== 'number' || typeof quote.usd_24h_change !== 'number') throw new Error(`Invalid CoinGecko quote for ${asset.id}`)
      return { symbol: asset.symbol, name: asset.name, value: quote.usd, change: quote.usd_24h_change, currency: 'USD', source: 'coingecko', simulated: false, asOf }
    })
  }
}

export class BrapiMarketDataProvider implements MarketDataProvider {
  constructor(private readonly token: string, private readonly baseUrl = 'https://brapi.dev/api', private readonly fetcher = fetch) {}
  async overview(): Promise<MarketQuote[]> {
    const symbols = 'PETR4,VALE3,ITUB4,IBOV'
    const url = `${this.baseUrl}/quote/${symbols}${this.token ? `?token=${encodeURIComponent(this.token)}` : ''}`
    const response = await this.fetcher(url, { signal: AbortSignal.timeout(8_000), headers: { accept: 'application/json' } })
    if (!response.ok) throw new Error(`Brapi returned ${response.status}`)
    const payload = await response.json() as { results?: Array<{ symbol?: string; longName?: string; shortName?: string; regularMarketPrice?: number; regularMarketChangePercent?: number }> }
    if (!Array.isArray(payload.results) || payload.results.length === 0) throw new Error('Brapi returned no quotes')
    const asOf = new Date().toISOString()
    return payload.results.map((quote) => {
      if (!quote.symbol || typeof quote.regularMarketPrice !== 'number' || typeof quote.regularMarketChangePercent !== 'number') throw new Error('Invalid Brapi quote')
      return { symbol: quote.symbol, name: quote.longName ?? quote.shortName ?? quote.symbol, value: quote.regularMarketPrice, change: quote.regularMarketChangePercent, currency: quote.symbol === 'IBOV' ? 'index' : 'BRL', source: 'brapi', simulated: false, asOf }
    })
  }
}

export class CompositeMarketDataProvider implements MarketDataProvider {
  constructor(private readonly providers: MarketDataProvider[]) {}
  async overview(): Promise<MarketQuote[]> {
    const results = await Promise.all(this.providers.map((provider) => provider.overview()))
    return results.flat()
  }
}

export function createMarketDataProvider(provider = process.env.MARKET_DATA_PROVIDER ?? 'mock'): MarketDataProvider {
  if (provider === 'coingecko') return new CoinGeckoMarketDataProvider(process.env.COINGECKO_BASE_URL)
  if (provider === 'brapi') return new BrapiMarketDataProvider(process.env.BRAPI_TOKEN ?? '', process.env.BRAPI_BASE_URL)
  if (provider === 'real') return new CompositeMarketDataProvider([
    new CoinGeckoMarketDataProvider(process.env.COINGECKO_BASE_URL),
    new BrapiMarketDataProvider(process.env.BRAPI_TOKEN ?? '', process.env.BRAPI_BASE_URL),
  ])
  return new MockMarketDataProvider()
}
