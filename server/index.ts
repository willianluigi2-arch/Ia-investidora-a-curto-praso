import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { z } from 'zod'
import { MockAIGateway } from './modules/aiGateway.js'
import { educationalAlerts } from './modules/alerts.js'
import { calculateAnalytics } from './modules/analytics.js'
import { MockMarketDataProvider } from './modules/marketData.js'
import { runBacktest } from './modules/backtest.js'
import { assessRisk } from './modules/riskEngine.js'

const app = express()
const port = Number(process.env.PORT ?? 8787)
const allowedOrigin = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173'
app.use(cors({ origin: allowedOrigin }))
app.use(express.json({ limit: '256kb' }))
const marketData = new MockMarketDataProvider()
const aiGateway = new MockAIGateway()
const chatSchema = z.object({ message: z.string().trim().min(1).max(2000), context: z.array(z.string().max(500)).max(10).optional() }).strict()
const orderSchema = z.object({ symbol: z.string().regex(/^[A-Z][A-Z0-9]{3,5}$/), side: z.enum(['buy', 'sell']), quantity: z.number().int().positive().max(1_000_000), price: z.number().finite().positive().max(10_000), stopPrice: z.number().finite().positive().max(10_000).optional() }).strict()

app.get('/api/health', (_req, res) => res.json({ status: 'ok', environment: process.env.NODE_ENV ?? 'development', mode: 'simulation-only', providers: { ai: process.env.AI_PROVIDER ?? 'mock', marketData: process.env.MARKET_DATA_PROVIDER ?? 'mock' } }))
app.get('/api/market/overview', async (_req, res, next) => { try { res.json({ asOf: new Date().toISOString(), source: 'mock', simulated: true, data: await marketData.overview() }) } catch (error) { next(error) } })
app.get('/api/alerts', (_req, res) => res.json({ simulated: true, data: educationalAlerts }))
app.post('/api/ai/chat', async (req, res, next) => { const parsed = chatSchema.safeParse(req.body); if (!parsed.success) return res.status(400).json({ error: 'Mensagem inválida.', details: parsed.error.flatten().fieldErrors }); try { res.json(await aiGateway.answer(parsed.data)) } catch (error) { next(error) } })
app.post('/api/simulations/orders', (req, res) => { const parsed = orderSchema.safeParse(req.body); if (!parsed.success) return res.status(400).json({ error: 'Ordem de simulação inválida.', details: parsed.error.flatten().fieldErrors }); const data = parsed.data; const risk = data.stopPrice ? assessRisk({ capital: data.quantity * data.price, riskPercent: 1, entryPrice: data.price, stopPrice: data.stopPrice, quantity: data.quantity }) : null; if (risk && !risk.withinLimit) return res.status(422).json({ error: 'A simulação excede os limites de risco.', risk }); res.status(201).json({ ...data, id: crypto.randomUUID(), status: 'paper-simulated', simulated: true, createdAt: new Date().toISOString(), risk }) })
app.post('/api/analytics', (req, res) => { const parsed = z.object({ candles: z.array(z.object({ timestamp: z.string().datetime(), close: z.number().finite().positive() })).min(1).max(10_000) }).safeParse(req.body); if (!parsed.success) return res.status(400).json({ error: 'Série inválida.' }); res.json({ simulated: true, data: calculateAnalytics(parsed.data.candles) }) })
app.post('/api/backtests', (req, res) => { const parsed = z.object({ candles: z.array(z.object({ timestamp: z.string().datetime(), close: z.number().finite().positive() })).min(1).max(10_000), initialCapital: z.number().finite().positive().max(100_000_000), quantity: z.number().finite().positive().max(1_000_000) }).safeParse(req.body); if (!parsed.success) return res.status(400).json({ error: 'Parâmetros de backtest inválidos.' }); res.json(runBacktest(parsed.data)) })
app.get('/api/knowledge/status', (_req, res) => res.json({ mode: 'prepared', indexedDocuments: 0, retrieval: 'not-configured', simulated: true, message: 'Nenhum documento foi ingerido; respostas não usam RAG.' }))
app.use((_req, res) => res.status(404).json({ error: 'Rota não encontrada.' }))
app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => { console.error('api_error', error); res.status(500).json({ error: 'Erro interno. Tente novamente.' }) })
app.listen(port, '0.0.0.0', () => console.log(`API disponível em http://localhost:${port}`))
