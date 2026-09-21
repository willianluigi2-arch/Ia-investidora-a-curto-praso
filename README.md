# IA Investidora — Desenvolvimento a Curto Prazo

Workspace educacional para leitura de mercado, análise assistida por IA e simulação de operações. O produto apoia decisões conscientes no curto prazo sem enviar ordens reais para corretoras.

## O que já funciona

- Assistente de IA com histórico de conversa, sugestões e favoritos.
- Visão geral com indicadores, gráfico intraday, radar de ativos e insights.
- Área de análises com viés, confiança, checklist e score de risco.
- Paper trading com compra/venda simulada, carteira virtual e histórico.
- Knowledge Center com materiais indexados visualmente e estado de contexto/RAG.
- Central de notificações e alertas educacionais.
- API com validação Zod para chat e ordens simuladas.
- Interfaces `MarketDataProvider` e `AIGateway` prontas para provedores reais.

## Requisitos

- Node.js 20 ou superior
- npm 10 ou superior

## Instalação e execução

```bash
cp .env.example .env
npm install
npm run dev
```

O cliente inicia em `http://localhost:5173` e a API em `http://localhost:8787`. No Codespace, encaminhe a porta 5173 para abrir a aplicação. O proxy do Vite encaminha `/api` para o servidor local.

## Scripts

| Comando | Uso |
| --- | --- |
| `npm run dev` | Inicia cliente e API em modo desenvolvimento |
| `npm run build` | Gera o cliente em `dist` e o servidor em `dist-server` |
| `npm run start` | Executa o servidor compilado |
| `npm run lint` | Executa ESLint sem warnings |
| `npm run typecheck` | Valida tipos do cliente e servidor |
| `npm run test` | Executa os testes Vitest |

## Segurança e limites atuais

O `.env` é ignorado pelo Git e `.env.example` documenta apenas nomes de variáveis. A chave de IA, quando existir, deve ser consumida exclusivamente pelo backend. O modo atual usa dados e respostas mock; não há integração com corretora, envio de ordem real, recomendação personalizada ou garantia de retorno financeiro.

## Próximos incrementos

Persistir usuários, conversas, documentos, embeddings, simulações e auditoria em PostgreSQL; conectar um provedor de dados licenciado; implementar fila para ingestão de documentos; e substituir `MockAIGateway` por um adaptador seguro para o provedor escolhido, incluindo a futura IA Desenvolvedora ORA.

Mais detalhes estão em [ARCHITECTURE.md](ARCHITECTURE.md) e [DEVELOPMENT.md](DEVELOPMENT.md).