export type PortfolioPosition = { symbol: string; quantity: number; averagePrice: number; currency: 'BRL' | 'USD' }
export type PortfolioQuote = { symbol: string; value: number; change: number; source: string; simulated: boolean }
export type PortfolioPositionView = PortfolioPosition & { currentValue: number; variationPercent: number; result: number; quoteAvailable: boolean }

export function calculatePortfolio(positions: PortfolioPosition[], quotes: PortfolioQuote[]): PortfolioPositionView[] {
  const bySymbol = new Map(quotes.map((quote) => [quote.symbol, quote]))
  return positions.map((position) => {
    const quote = bySymbol.get(position.symbol)
    const currentPrice = quote?.value ?? position.averagePrice
    const currentValue = currentPrice * position.quantity
    const invested = position.averagePrice * position.quantity
    return { ...position, currentValue, variationPercent: invested === 0 ? 0 : ((currentValue - invested) / invested) * 100, result: currentValue - invested, quoteAvailable: Boolean(quote) }
  })
}
