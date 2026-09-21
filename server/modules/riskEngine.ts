export type RiskInput = { capital: number; riskPercent: number; entryPrice: number; stopPrice: number; quantity?: number }
export type RiskResult = { riskAmount: number; unitRisk: number; suggestedQuantity: number; exposure: number; riskRatio: number; withinLimit: boolean; reasons: string[] }

export function assessRisk(input: RiskInput): RiskResult {
  const riskAmount = input.capital * (input.riskPercent / 100)
  const unitRisk = Math.abs(input.entryPrice - input.stopPrice)
  const suggestedQuantity = unitRisk === 0 ? 0 : Math.floor(riskAmount / unitRisk)
  const quantity = input.quantity ?? suggestedQuantity
  const exposure = quantity * input.entryPrice
  const riskRatio = input.capital === 0 ? Infinity : (quantity * unitRisk) / input.capital
  const reasons: string[] = []
  if (unitRisk === 0) reasons.push('Preço de entrada e stop precisam ser diferentes.')
  if (input.riskPercent <= 0 || input.riskPercent > 5) reasons.push('O risco por operação deve ficar entre 0 e 5%.')
  if (exposure > input.capital) reasons.push('A exposição supera o capital informado.')
  return { riskAmount, unitRisk, suggestedQuantity, exposure, riskRatio, withinLimit: reasons.length === 0 && quantity <= suggestedQuantity, reasons }
}
