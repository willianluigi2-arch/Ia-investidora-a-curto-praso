import { randomUUID } from 'node:crypto'

export type ChatRequest = { message: string; context?: string[] }
export type ChatResponse = { id: string; role: 'assistant'; content: string; provider: 'mock'; simulated: true; disclaimer: string }

export interface AIGateway {
  answer(request: ChatRequest): Promise<ChatResponse>
}

const disclaimer = 'Resposta simulada e educacional. Não constitui recomendação de investimento.'

/** Safe baseline adapter. Real providers must be added behind this interface. */
export class MockAIGateway implements AIGateway {
  async answer({ message }: ChatRequest): Promise<ChatResponse> {
    return {
      id: randomUUID(),
      role: 'assistant',
      provider: 'mock',
      simulated: true,
      disclaimer,
      content: `Resposta simulada para “${message}”. Analise contexto, liquidez, volatilidade e risco antes de testar qualquer hipótese. ${disclaimer}`,
    }
  }
}
