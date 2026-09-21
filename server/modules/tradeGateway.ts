export type TradeOrder = { symbol: string; side: 'buy' | 'sell'; quantity: number; price?: number }
export type ExecutionResult = TradeOrder & { id: string; status: 'disabled'; realExecution: false; reason: string }
export interface TradeExecutionGateway { submit(order: TradeOrder, authorization: { actorId: string; permissions: string[] }): Promise<ExecutionResult> }

/** Deliberate fail-closed boundary. Market data must never gain execution permissions. */
export class DisabledTradeExecutionGateway implements TradeExecutionGateway {
  async submit(order: TradeOrder, _authorization: { actorId: string; permissions: string[] }): Promise<ExecutionResult> {
    return { ...order, id: crypto.randomUUID(), status: 'disabled', realExecution: false, reason: 'Execução real desativada; use /api/simulations/orders.' }
  }
}
