import { describe, expect, it } from 'vitest'
import { CoinGeckoMarketDataProvider, MockMarketDataProvider } from './marketData.js'
import { DisabledTradeExecutionGateway } from './tradeGateway.js'

describe('gateway boundaries', () => {
  it('keeps fallback data explicitly simulated', async () => {
    const data = await new MockMarketDataProvider().overview()
    expect(data.every((quote) => quote.simulated && quote.source === 'mock')).toBe(true)
  })
  it('normalizes a real provider response without secrets in the client contract', async () => {
    const originalFetch = globalThis.fetch
    globalThis.fetch = (async () => new Response(JSON.stringify({ bitcoin: { usd: 100, usd_24h_change: 2 }, ethereum: { usd: 50, usd_24h_change: -1 } }), { status: 200 })) as typeof fetch
    const data = await new CoinGeckoMarketDataProvider('https://example.test').overview()
    expect(data.map((quote) => quote.symbol)).toEqual(['BTC', 'ETH'])
    expect(data.every((quote) => !quote.simulated && quote.source === 'coingecko')).toBe(true)
    globalThis.fetch = originalFetch
  })
  it('fails closed for trade execution', async () => {
    const result = await new DisabledTradeExecutionGateway().submit({ symbol: 'BTC', side: 'buy', quantity: 1 }, { actorId: 'test', permissions: [] })
    expect(result.realExecution).toBe(false)
    expect(result.status).toBe('disabled')
  })
})
