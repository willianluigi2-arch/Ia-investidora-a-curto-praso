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

Node 20+ e npm 10+ são esperados. `MARKET_DATA_PROVIDER=mock` é o fallback seguro. Para cripto real, use `MARKET_DATA_PROVIDER=coingecko`; o adapter usa endpoint público e não exige secret. Para futuros adapters de ações, documente o secret no `.env.example` e consuma-o somente no backend.

## Smoke test

Com `npm run dev` em execução:

```bash
curl -fsS http://localhost:8787/api/health
curl -fsS http://localhost:8787/api/market/overview
curl -fsS http://localhost:8787/api/alerts
curl -fsS http://localhost:8787/api/knowledge/status
curl -fsS -X POST http://localhost:8787/api/ai/chat -H 'content-type: application/json' -d '{"message":"Explique risco"}'
curl -fsS -X POST http://localhost:8787/api/ora/chat -H 'content-type: application/json' -d '{"message":"Quais arquivos devo ler?","capability":"developer"}'
curl -fsS -X POST http://localhost:8787/api/trade/submit -H 'content-type: application/json' -d '{"symbol":"PETR4","side":"buy","quantity":10,"price":38.72}' # esperado 403
```

Para o provider real, confirme `source: coingecko` e `simulated: false`; se a API estiver indisponível, a resposta deve falhar, não retornar mock silenciosamente.

## Handoff para ORA

Leia `README.md`, `ARCHITECTURE.md`, `package.json` e `server/index.ts`. ORA deve ser integrada através de `OraGateway`, nunca diretamente às exchanges. Qualquer ferramenta de desenvolvimento passa por `DeveloperToolGateway`, exige aprovação humana, escopo mínimo, auditoria e dry-run. O gateway de mercado fornece dados; o gateway de trade é a única futura fronteira de execução.

## Checklist de PR

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] smoke tests HTTP
- [ ] nenhum secret ou dado inventado
- [ ] dados real/simulado identificados
- [ ] execução real continua desativada
- [ ] documentação atualizada
