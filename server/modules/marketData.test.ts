import { describe, expect, it } from 'vitest'
import { BrapiMarketDataProvider, CoinGeckoMarketDataProvider } from './marketData.js'

describe('real market adapters', () => {
  it('normalizes CoinGecko crypto data as real', async () => {
    const fetcher = async () => new Response(JSON.stringify({ bitcoin: { usd: 100, usd_24h_change: 2 }, ethereum: { usd: 50, usd_24h_change: -1 } }), { status: 200 })
    const data = await new CoinGeckoMarketDataProvider('https://example.test', fetcher).overview()
    expect(data.every((quote) => quote.simulated === false && quote.source === 'coingecko')).toBe(true)
  })
  it('normalizes Brapi equity data as real', async () => {
    const fetcher = async () => new Response(JSON.stringify({ results: [{ symbol: 'PETR4', longName: 'Petrobras', regularMarketPrice: 40, regularMarketChangePercent: 1.5 }] }), { status: 200 })
    const data = await new BrapiMarketDataProvider('', 'https://example.test', fetcher).overview()
    expect(data[0]).toMatchObject({ symbol: 'PETR4', value: 40, simulated: false, source: 'brapi' })
  })
})
