# IA Investidora — Desenvolvimento a Curto Prazo

Workspace educacional para análise de mercado, explicações assistidas e simulações. **Não envia ordens reais, não se conecta a corretoras e não apresenta dados mock como dados ao vivo.**

## Estado atual

A branch `audit/hardening` mantém React/Vite no cliente e Express/TypeScript no servidor. O baseline possui telas de chat, visão geral, análises, paper trading e Knowledge Center; esta evolução adiciona contratos de domínio para risco, analytics e backtesting, além de metadados explícitos de simulação e erros HTTP consistentes.

## Executar no Codespace

```bash
cp .env.example .env
npm ci
npm run dev
```

Cliente: `http://localhost:5173` · API: `http://localhost:8787`. O proxy Vite encaminha `/api` para a API.

## Verificação

```bash
npm run lint
npm run typecheck
npm run test
npm run build
curl http://localhost:8787/api/health
curl http://localhost:8787/api/market/overview
curl -X POST http://localhost:8787/api/ai/chat -H 'content-type: application/json' -d '{"message":"Como estudar risco?"}'
```

Os comandos devem ser executados no Codespace; esta integração não possui shell para executar processos. Smoke tests adicionais: `GET /api/alerts`, `GET /api/knowledge/status`, `POST /api/analytics`, `POST /api/backtests` e `POST /api/simulations/orders`.

## Limites honestos

- Market Data e AI usam adapters `mock` e retornam `simulated: true`.
- Paper trading é validação de intenção e cálculo; não há persistência, matching real, saldo confiável ou corretora.
- RAG está preparado por contrato, mas não há ingestão, OCR, embeddings, vector store ou documentos indexados.
- Favoritos, histórico e notificações continuam estado efêmero do React até uma camada de persistência/autenticação.
- Não há recomendação personalizada, promessa de retorno ou operação financeira real.

## Como outra IA assume o projeto

1. Leia `ARCHITECTURE.md` e `DEVELOPMENT.md`.
2. Preserve `MarketDataProvider`, `AIGateway`, os metadados `simulated` e o bloqueio de operações reais.
3. Antes de integrar ORA, crie um adapter versionado para `AIGateway`, feature flag, timeout, limites de custo, redaction e testes offline.
4. Adicione persistência/migrações antes de afirmar que histórico, paper trading ou Knowledge Center são permanentes.
5. Use dados históricos licenciados e versionados para backtests; nunca substitua a origem por números inventados.
6. Abra PRs pequenos na branch de trabalho e não faça merge automático em `main`.
