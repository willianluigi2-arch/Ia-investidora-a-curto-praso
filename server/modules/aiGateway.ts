import { randomUUID } from 'node:crypto'

export type ChatRequest = { message: string; context?: string[]; capability?: 'investor' | 'developer' }
export type ChatResponse = { id: string; role: 'assistant'; content: string; provider: string; simulated: boolean; disclaimer: string }

export interface AIGateway { answer(request: ChatRequest): Promise<ChatResponse> }

const disclaimer = 'Resposta educacional. Não constitui recomendação de investimento nem autorização para alterar código ou executar operações.'

export class MockAIGateway implements AIGateway {
  async answer({ message }: ChatRequest): Promise<ChatResponse> {
    return { id: randomUUID(), role: 'assistant', provider: 'mock', simulated: true, disclaimer, content: `Resposta simulada para “${message}”. Analise contexto, liquidez, volatilidade e risco antes de testar qualquer hipótese. ${disclaimer}` }
  }
}

export type OraRequest = { message: string; capability: 'investor' | 'developer'; context?: string[] }
export type OraResponse = ChatResponse & { authorizationRequired: boolean }

/** ORA port: orchestration belongs here; financial and developer tools remain separate capabilities. */
export interface OraGateway { answer(request: OraRequest): Promise<OraResponse> }
export class MockOraGateway implements OraGateway {
  async answer({ message, capability }: OraRequest): Promise<OraResponse> {
    return { id: randomUUID(), role: 'assistant', provider: 'ora-mock', simulated: true, authorizationRequired: capability === 'developer', disclaimer, content: `ORA simulada (${capability}) recebeu: “${message}”. Nenhuma ferramenta externa foi chamada. ${disclaimer}` }
  }
}
