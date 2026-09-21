# Guia de desenvolvimento

## Como continuar

1. Rode `npm install` e `npm run dev`.
2. Verifique `/api/health`, `/api/market/overview` e `/api/alerts` antes de investigar problemas no cliente.
3. Faça alterações pequenas por módulo e rode `npm run typecheck` logo depois.
4. Cubra contratos de API, backtesting e cálculos de risco com testes antes de conectar dados reais.
5. Rode `npm ci && npm run lint && npm run typecheck && npm run test && npm run build` antes de abrir um pull request.

## Convenções

- TypeScript estrito; não introduza `any` para contornar contratos.
- Variáveis e funções em inglês no código, textos da interface em português do Brasil.
- Segredos apenas em variáveis de ambiente; nunca no React ou em commits.
- Use adaptadores para fornecedores externos e mantenha o domínio independente deles.
- Toda operação financeira continua simulada até existir uma decisão explícita de produto, segurança e compliance.
- Prefira componentes pequenos e estados explícitos; não esconda falhas de API com dados silenciosamente falsos.

## Como adicionar um provedor real

Implemente `MarketDataProvider` ou `AIGateway` em `server/modules`, leia apenas a configuração necessária do ambiente, valide a resposta externa e trate timeout e indisponibilidade. Injete a implementação em `server/index.ts` com base em `MARKET_DATA_PROVIDER` ou `AI_PROVIDER`.

## Próxima trilha recomendada

1. Adicionar autenticação e PostgreSQL com migrações.
2. Extrair rotas para controllers/services e adicionar testes HTTP.
3. Implementar ingestão real de PDF, imagem, texto e URL com fila.
4. Adicionar embeddings e recuperação com citações de fonte.
5. Evoluir o backtesting sintético para séries históricas versionadas e licenciadas.
6. Construir o Risk Engine com limites antes de registrar simulações.
7. Criar observabilidade, auditoria persistente e controles de acesso.
8. Integrar a IA ORA atrás do AI Gateway, com feature flag e avaliação offline.

## Smoke test manual

Com os servidores rodando:

```bash
curl http://localhost:8787/api/health
curl http://localhost:8787/api/market/overview
curl http://localhost:8787/api/alerts
curl -X POST http://localhost:8787/api/ai/chat \
  -H 'content-type: application/json' \
  -d '{"message":"Como ler a abertura?"}'
curl -X POST http://localhost:8787/api/backtests \
  -H 'content-type: application/json' \
  -d '{"symbol":"PETR4","initialCapital":10000,"strategy":"moving-average"}'
```

No navegador, verifique navegação lateral, envio de chat, notificações carregadas da API, envio de ordem simulada, backtesting, favoritos e layout em largura móvel. Knowledge Center é atualmente um catálogo visual e não deve ser tratado como ingestão RAG persistente.