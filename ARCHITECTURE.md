# Arquitetura

## Visão geral

O projeto usa TypeScript com duas fronteiras:

```text
React/Vite (porta 5173)
        |
        | /api via proxy
        v
Express/TypeScript (porta 8787)
        |
        +-- AI Gateway
        +-- Market Data
        +-- Alerts
        +-- Simulation / Risk
        +-- Backtesting (série sintética)
        +-- Persistence (a implementar)
```

O cliente mantém a experiência e o estado efêmero da sessão. O servidor é o único lugar autorizado a falar com provedores externos e secrets. Os contratos são validados na entrada antes de qualquer operação.

## Estrutura

- `src/App.tsx`: composição da aplicação e telas principais.
- `src/styles.css`: tokens visuais, componentes e breakpoints responsivos.
- `server/index.ts`: bootstrap HTTP, rotas e middleware.
- `server/modules/marketData.ts`: contrato e implementação mock de cotações.
- `server/modules/aiGateway.ts`: contrato para trocar o motor de IA.
- `server/modules/alerts.ts`: alertas educacionais.
- `server/modules/backtesting.ts`: validação e execução determinística de backtests simulados.
- `server/modules/validation.test.ts`: contratos de entrada.

## Módulos de domínio

**Market Data** normaliza cotações e timestamps por meio de `MarketDataProvider`. Um adaptador real deve lidar com limites, indisponibilidade, cache e licença do dado.

**Analytics / Analysis Engine** será responsável por indicadores, séries temporais, cenários e explicações. Deve receber dados normalizados, nunca credenciais ou componentes de apresentação.

**Risk Engine** deve calcular tamanho de posição, exposição, stop, drawdown e limites antes de uma simulação ser registrada.

**Alerts / Notifications** devem separar regra de detecção, preferência do usuário e entrega. Alertas são educacionais e precisam registrar origem, timestamp e severidade.

**Knowledge / RAG** hoje expõe apenas a superfície visual do catálogo. A ingestão de arquivos, extração de texto, chunks, embeddings e recuperação ainda devem ser implementados antes de a interface afirmar que uma fonte foi indexada.

**AI Gateway** abstrai o provedor. A implementação futura deve aplicar timeout, retry limitado, redaction de dados sensíveis, limite de custo e logging sem armazenar secrets.

**Audit** deve registrar ator, ação, recurso, resultado e timestamp para alterações de contexto e simulações. Ordens reais permanecem fora do escopo.

## Dados e persistência planejada

Hoje os dados de mercado, alertas e respostas são mock e as ordens/backtests não são persistidos. PostgreSQL é a opção recomendada para usuários, sessões, documentos, mensagens, portfolios virtuais, ordens paper, resultados de backtest e eventos de auditoria. Um storage de objetos deve guardar arquivos originais. Redis pode ser adicionado para cache e filas, sem virar fonte de verdade.

## Segurança

Validação ocorre com Zod, CORS é restrito por `CLIENT_ORIGIN`, limites de corpo evitam payloads grandes e a API não expõe variáveis de ambiente. Antes de produção ainda serão necessários autenticação, autorização por workspace, rate limiting, headers de segurança, observabilidade e revisão de retenção de dados.