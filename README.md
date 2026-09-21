# IA Investidora — Desenvolvimento a Curto Prazo

Plataforma de gestão e análise financeira educacional. Market Data pode usar adapters reais para cripto (CoinGecko) e ações/índices brasileiros (Brapi), mantendo a origem e o timestamp em cada quote. Paper Trading, Backtesting e execução real permanecem separados e simulados; nenhuma ordem é enviada a corretoras.

## Execução

```bash
cp .env.example .env
npm ci
npm run dev
```

Cliente: `http://localhost:5173` · API: `http://localhost:8787`.

### Dados de mercado

- `MARKET_DATA_PROVIDER=mock`: fallback seguro, sempre `simulated: true`.
- `MARKET_DATA_PROVIDER=coingecko`: cripto real via endpoint público; não exige secret.
- `MARKET_DATA_PROVIDER=brapi`: ações/índices brasileiros; use `BRAPI_TOKEN` se sua cota/plano exigir.
- `MARKET_DATA_PROVIDER=real`: combina CoinGecko e Brapi; uma falha não é mascarada por mock.

Todos os resultados carregam `source`, `asOf` e `simulated`. Nunca trate `source=mock` como cotação real.

## Gestão de carteira

`POST /api/portfolio/valuation` recebe posições com `symbol`, `quantity`, `averagePrice` e `currency`, consulta o provider configurado e retorna valor atual, variação, resultado e disponibilidade da cotação. Ainda é uma avaliação sem persistência/autenticação; não representa saldo de corretora.

Exemplo:

```bash
curl -fsS -X POST http://localhost:8787/api/portfolio/valuation \
  -H 'content-type: application/json' \
  -d '{"positions":[{"symbol":"BTC","quantity":0.1,"averagePrice":50000,"currency":"USD"}]}'
```

## Segurança e limites

Secrets ficam exclusivamente no backend. `BRAPI_TOKEN` é opcional no plano público e nunca é exposto ao cliente. Execução real está desativada; `/api/trade/submit` é bloqueado. Dados reais dependem da disponibilidade, licença e limites do provedor.

## Verificação

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

A aplicação deve ser validada no Codespace com `MARKET_DATA_PROVIDER=coingecko` ou `brapi` antes de declarar o provider operacional. Sem rede, use `mock` e mantenha o rótulo simulado.
