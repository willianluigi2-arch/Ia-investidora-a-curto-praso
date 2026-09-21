# Desenvolvimento e handoff

## Comandos

```bash
npm ci
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

Node 20+ e npm 10+ são esperados. Copie `.env.example`; `AI_PROVIDER=mock` e `MARKET_DATA_PROVIDER=mock` são intencionais. Não comite `.env` ou tokens.

## Smoke test

Com `npm run dev` em execução:

```bash
curl -fsS http://localhost:8787/api/health
curl -fsS http://localhost:8787/api/market/overview
curl -fsS http://localhost:8787/api/alerts
curl -fsS http://localhost:8787/api/knowledge/status
curl -fsS -X POST http://localhost:8787/api/ai/chat -H 'content-type: application/json' -d '{"message":"Explique risco"}'
curl -fsS -X POST http://localhost:8787/api/simulations/orders -H 'content-type: application/json' -d '{"symbol":"PETR4","side":"buy","quantity":10,"price":38.72,"stopPrice":37}'
```

Esperado: JSON com `simulated: true`; nenhuma chamada externa ou ordem real.

## Handoff para outra IA

Leia primeiro `README.md`, `ARCHITECTURE.md`, `package.json` e `server/index.ts`. Faça mudanças incrementais, preserve os ports e escreva testes de domínio antes de adapters externos. Para ORA, adicione implementação substituível de `AIGateway`, nunca acople o cliente a uma chave. Para RAG, implemente ingestão e isolamento por workspace antes de exibir “indexado”.

## Checklist de PR

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] smoke tests HTTP
- [ ] nenhum secret ou dado de mercado inventado
- [ ] operações reais continuam impossíveis
- [ ] documentação atualizada
