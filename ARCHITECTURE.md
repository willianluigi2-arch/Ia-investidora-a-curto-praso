# Arquitetura

## Fronteiras

```text
React/Vite :5173 -- /api proxy --> Express :8787
                                      |
        +-- AI Gateway (mock explícito; adapter futuro ORA)
        +-- Market Data (mock explícito; fonte licenciada futura)
        +-- Analytics / Analysis Engine
        +-- Risk Engine (limites antes de simulação)
        +-- Paper simulations / Backtests
        +-- Alerts (educacionais)
        +-- Knowledge status (RAG preparado, sem ingestão)
```

`src/App.tsx` mantém a composição visual e estado efêmero. `server/index.ts` é a fronteira HTTP: valida entradas com Zod, chama módulos de domínio e nunca expõe secrets ao browser. Módulos de domínio não importam React e podem ser testados isoladamente.

## Contratos e honestidade de dados

`MarketDataProvider` e `AIGateway` são ports. Os adapters mock retornam `source: mock`, `provider: mock` e `simulated: true`. Qualquer provider real deve validar payload externo, registrar `asOf`, respeitar licença, timeout e indisponibilidade, e manter o mesmo contrato.

`analytics.ts` calcula retorno, máxima, mínima e volatilidade sobre uma série fornecida pelo usuário. `riskEngine.ts` calcula risco monetário, exposição, quantidade sugerida e rejeita limites básicos. `backtest.ts` é uma simulação buy-and-hold deliberadamente simples; não deve ser chamado de resultado histórico real sem candles versionados e custos configurados.

## Segurança

- Secrets somente no backend via `.env`; nunca em `src`.
- CORS limitado a `CLIENT_ORIGIN` e body JSON limitado a 256 KB.
- Schemas Zod estritos, números finitos e limites de quantidade/tamanho.
- Nenhuma rota de corretora ou ordem real existe.
- Erros internos não vazam stack trace ao cliente; logs do servidor não incluem payloads completos.

Antes de produção ainda são necessários autenticação, autorização por workspace, rate limiting, headers de segurança, observabilidade, auditoria persistente, retenção de dados, CSRF conforme mecanismo de sessão e revisão de compliance.

## Preparação para ORA e RAG

ORA deve entrar somente como implementação de `AIGateway`, atrás de feature flag e avaliação offline. O gateway deverá receber contexto já redigido, aplicar timeout/retry limitado e devolver referências e origem. RAG requer ingestão segura, extração, chunking, embeddings, busca com filtros de workspace e citações; texto recuperado é dado não confiável e nunca instrução de sistema.
