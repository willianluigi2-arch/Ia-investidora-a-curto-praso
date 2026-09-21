# Arquitetura

## Fronteiras

```text
React/Vite :5173 -- /api proxy --> Express :8787
                                      |
        +-- Market Data Gateway (mock ou CoinGecko real)
        +-- Analytics / Analysis Engine
        +-- Risk Engine
        +-- Paper simulations / Backtests
        +-- Alerts (educacionais)
        +-- AI Gateway (investidor)
        +-- ORA Gateway (orquestração futura)
        |      +-- developer tools (autorização separada)
        +-- Trade/Execution Gateway (fail-closed, desativado)
        +-- Knowledge status (RAG preparado)
```

## Market Data Gateway

`MarketDataProvider` é o port. `MockMarketDataProvider` é o fallback explícito. `CoinGeckoMarketDataProvider` consulta o endpoint público de preços de cripto e retorna `simulated: false`, `source: coingecko` e `asOf`. A seleção é feita por `MARKET_DATA_PROVIDER=coingecko`. Para ações brasileiras, adicione um adapter licenciado (por exemplo, um fornecedor que exija `BRAPI_TOKEN`) sem colocar o token no frontend; nenhum token é fornecido pelo projeto.

Falhas do provider real resultam em erro HTTP e não em dados silenciosamente falsos. Dados reais devem carregar origem, timestamp, moeda, licença e limites do provider.

## Trade/Execution Gateway

`TradeExecutionGateway` é separado do market data. A implementação atual `DisabledTradeExecutionGateway` falha fechado e responde `realExecution: false`. A rota `/api/trade/submit` devolve 403. Uma implementação futura exige autenticação, permissões, idempotência, auditoria, limites de risco e aprovação explícita. Nunca reutilize credenciais de Market Data para execução.

## ORA e IA Desenvolvedora

`OraGateway` é uma fronteira independente do `AIGateway`. A capacidade `investor` não recebe acesso a execução; `developer` exige autorização humana. `DeveloperToolGateway` deve futuramente encapsular GitHub, filesystem, publicação web, criação de jogos e projetos 3D. As ações planejadas são auditáveis e permanecem desabilitadas no baseline.

## Contratos

- `MarketDataProvider`: dados reais ou simulados, sempre identificados.
- `AIGateway`: respostas educacionais, sem secrets e sem ferramentas financeiras implícitas.
- `OraGateway`: orquestração futura, separada por capacidade.
- `TradeExecutionGateway`: execução futura, fail-closed.
- `DeveloperToolGateway`: ferramentas de código/projeto/publicação, sempre com autorização.

## Segurança

Secrets só no backend via ambiente; `.env` está ignorado. CORS é restrito, body é limitado, entradas são schemas Zod estritos e a rota de execução real permanece bloqueada. Ainda são necessários autenticação, autorização por workspace, rate limiting, headers de segurança, observabilidade, auditoria persistente, retenção e revisão de compliance antes de qualquer execução real.
