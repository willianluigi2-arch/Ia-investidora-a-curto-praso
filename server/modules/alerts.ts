export type EducationalAlert = { id: string; title: string; text: string; severity: 'attention' | 'info' | 'warning'; time: string }

export const educationalAlerts: EducationalAlert[] = [
  { id: 'alert-1', title: 'Volatilidade acima da média', text: 'O Ibovespa abriu com amplitude maior que a média de 20 dias.', severity: 'attention', time: 'há 8 min' },
  { id: 'alert-2', title: 'Ponto de atenção em PETR4', text: 'Preço se aproxima da resistência de R$ 39,10.', severity: 'info', time: 'há 32 min' },
  { id: 'alert-3', title: 'Proteção de capital', text: 'Sua simulação atingiu 70% do limite de perda configurado.', severity: 'warning', time: 'ontem' },
]