export type ChatRequest = { message: string }
export type ChatResponse = { id: string; role: 'assistant'; content: string }

export interface AIGateway {
  answer(request: ChatRequest): Promise<ChatResponse>
}

export class MockAIGateway implements AIGateway {
  async answer({ message }: ChatRequest): Promise<ChatResponse> {
    return {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `Entendi sua pergunta sobre “${message}”. Para uma leitura de curto prazo, eu começaria pelo contexto do índice, volume relativo e pelo risco definido antes da entrada. Esta análise é educacional e não representa recomendação de investimento.`,
    }
  }
}