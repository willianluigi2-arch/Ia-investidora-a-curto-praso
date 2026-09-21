# Arquitetura

## Fronteiras

```text
React/Vite :5173 -- /api proxy --> Express :8787
                                      |
        +-- Market Data Gateway (CoinGecko/Brapi/mock)
        +-- Portfolio valuation (quotes + positions)
        +-- Analytics / Analysis Engine
        +-- Risk Engine
        +-- Paper simulations / Backtests
        +-- Alerts (educacionais)
        +-- AI Gateway (sem integração ORA nesta etapa)
        +-- Trade/Execution Gateway (desativado)
```

`MarketDataProvider` é o port único para quotes. Os adapters validam resposta externa, aplicam timeout e retornam `source`, `asOf` e `simulated`. A API não faz fallback silencioso de uma fonte real para mock: falhas são reportadas para que o usuário não confunda ausência de dados com cotação.

`/api/portfolio/valuation` calcula valor atual, preço médio, variação percentual e resultado por posição usando somente as quotes do provider configurado. A gestão atual é stateless e deve ganhar autenticação/persistência antes de uso como carteira de corretora.

## Providers e secrets

- CoinGecko: cripto; endpoint público, sem chave no baseline.
- Brapi: ações/índices brasileiros; `BRAPI_TOKEN` apenas no backend quando exigido pelo plano.
- `MARKET_DATA_PROVIDER=real` combina os dois adapters.
- Nenhuma credencial é enviada ao React.

## Trade

`TradeExecutionGateway` permanece separado do Market Data e fail-closed. A rota `/api/trade/submit` retorna 403. Paper Trading e Backtesting usam dados fornecidos/configurados e não executam ordens reais.

## Segurança

CORS restrito, body limitado, Zod estrito, timeout de rede, validação de resposta externa e erros sem stack trace. Antes de produção: autenticação, autorização, rate limiting, headers, observabilidade, auditoria e revisão de licença/compliance.
