export type KnowledgeSource = {
  id: string
  title: string
  kind: 'pdf' | 'text' | 'link'
  status: 'available-for-future-ingestion'
}

export interface KnowledgeStore {
  list(): KnowledgeSource[]
}

export class InMemoryKnowledgeStore implements KnowledgeStore {
  list(): KnowledgeSource[] {
    return [
      { id: 'source-1', title: 'Plano de trade · setembro', kind: 'pdf', status: 'available-for-future-ingestion' },
      { id: 'source-2', title: 'Anotações de análise técnica', kind: 'text', status: 'available-for-future-ingestion' },
      { id: 'source-3', title: 'Relatório Focus BCB', kind: 'link', status: 'available-for-future-ingestion' },
    ]
  }
}