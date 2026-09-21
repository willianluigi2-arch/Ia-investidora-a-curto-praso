import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { z } from 'zod'
import { MockAIGateway } from './modules/aiGateway.js'
import { educationalAlerts } from './modules/alerts.js'
import { backtestRequestSchema, runBacktest } from './modules/backtesting.js'
import { MockMarketDataProvider } from './modules/marketData.js'
import { summarizeMarket } from './modules/analytics.js'
import { InMemoryAuditStore } from './modules/persistence.js'
import { assessSimulationRisk } from './modules/riskEngine.js'
import { InMemoryKnowledgeStore } from './modules/knowledge.js'

const app = express()
const port = Number(process.env.PORT ?? 8787)
app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }))
app.use(express.json({ limit: '1mb' }))

const marketData = new MockMarketDataProvider()
const aiGateway = new MockAIGateway()
const auditStore = new InMemoryAuditStore()
const knowledgeStore = new InMemoryKnowledgeStore()

app.get('/api/health', (_req, res) => res.json({ status: 'ok', environment: process.env.NODE_ENV ?? 'development' }))
app.get('/api/market/overview', async (_req, res) => res.json({ asOf: new Date().toISOString(), data: await marketData.overview() }))
app.get('/api/alerts', (_req, res) => res.json({ data: educationalAlerts }))
app.get('/api/analytics/summary', async (_req, res) => res.json(summarizeMarket(await marketData.overview())))
app.get('/api/knowledge/sources', (_req, res) => res.json({ data: knowledgeStore.list(), ingestion: 'disabled-until-persistence-is-configured' }))
app.get('/api/audit', (_req, res) => res.json({ data: auditStore.list(), mode: 'simulation-only' }))

const chatSchema = z.object({ message: z.string().trim().min(1).max(2000) })
app.post('/api/ai/chat', async (req, res) => {
  const parsed = chatSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Mensagem inválida.' })
  try {
    const answer = await aiGateway.answer({ message: parsed.data.message })
    auditStore.append({ action: 'ai.chat', resource: 'conversation', mode: 'simulation-only', createdAt: new Date().toISOString() })
    return res.json(answer)
  } catch { return res.status(502).json({ error: 'Gateway de IA indisponível.' }) }
})

const simulationSchema = z.object({ symbol: z.string().regex(/^[A-Z0-9]{4,6}$/), side: z.enum(['buy', 'sell']), quantity: z.number().int().positive().max(1_000_000), price: z.number().positive().max(10_000) })
app.post('/api/simulations/orders', (req, res) => {
  const parsed = simulationSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Ordem de simulação inválida.' })
  const risk = assessSimulationRisk(parsed.data.quantity, parsed.data.price)
  auditStore.append({ action: 'simulation.order', resource: parsed.data.symbol, mode: 'simulation-only', createdAt: new Date().toISOString() })
  return res.status(201).json({ id: crypto.randomUUID(), ...parsed.data, risk, status: 'paper', createdAt: new Date().toISOString() })
})

app.post('/api/backtests', (req, res) => {
  const parsed = backtestRequestSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Parâmetros de backtesting inválidos.' })
  const result = runBacktest(parsed.data)
  auditStore.append({ action: 'simulation.backtest', resource: parsed.data.symbol, mode: 'simulation-only', createdAt: new Date().toISOString() })
  return res.status(200).json(result)
})

app.use((_req, res) => res.status(404).json({ error: 'Rota não encontrada.' }))
app.listen(port, '0.0.0.0', () => console.log(`API disponível em http://localhost:${port}`))