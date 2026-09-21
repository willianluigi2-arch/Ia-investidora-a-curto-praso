import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { z } from 'zod'
import { MockAIGateway } from './modules/aiGateway.js'
import { educationalAlerts } from './modules/alerts.js'
import { MockMarketDataProvider } from './modules/marketData.js'

const app = express()
const port = Number(process.env.PORT ?? 8787)
app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }))
app.use(express.json({ limit: '1mb' }))

const marketData = new MockMarketDataProvider()
const aiGateway = new MockAIGateway()

app.get('/api/health', (_req, res) => res.json({ status: 'ok', environment: process.env.NODE_ENV ?? 'development' }))
app.get('/api/market/overview', async (_req, res) => res.json({ asOf: new Date().toISOString(), data: await marketData.overview() }))
app.get('/api/alerts', (_req, res) => res.json({ data: educationalAlerts }))

const chatSchema = z.object({ message: z.string().trim().min(1).max(2000) })
app.post('/api/ai/chat', (req, res) => {
  const parsed = chatSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Mensagem inválida.' })
  return aiGateway.answer({ message: parsed.data.message }).then((answer) => res.json(answer))
})

const simulationSchema = z.object({ symbol: z.string().regex(/^[A-Z0-9]{4,6}$/), side: z.enum(['buy', 'sell']), quantity: z.number().int().positive().max(1_000_000), price: z.number().positive().max(10_000) })
app.post('/api/simulations/orders', (req, res) => {
  const parsed = simulationSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Ordem de simulação inválida.' })
  return res.status(201).json({ id: crypto.randomUUID(), ...parsed.data, status: 'paper', createdAt: new Date().toISOString() })
})

app.use((_req, res) => res.status(404).json({ error: 'Rota não encontrada.' }))
app.listen(port, '0.0.0.0', () => console.log(`API disponível em http://localhost:${port}`))