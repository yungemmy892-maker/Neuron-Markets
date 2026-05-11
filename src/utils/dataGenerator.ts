import type { DataTick, PriceMap, SeverityLevel } from '@/types'

// ─── Constants ────────────────────────────────────────────────────────────────

export const ASSETS = ['BTC/USD', 'ETH/USD', 'SOL/USD', 'MATIC/USD', 'ARB/USD'] as const

export const BASE_PRICES: PriceMap = {
  'BTC/USD': 67420,
  'ETH/USD': 3540,
  'SOL/USD': 178,
  'MATIC/USD': 0.92,
  'ARB/USD': 1.14,
}

const LOG_MSGS: [string, SeverityLevel][] = [
  ['Arbitrage opportunity detected', 'warn'],
  ['Whale alert: 500 BTC moved', 'critical'],
  ['Order book depth anomaly', 'warn'],
  ['Flash loan detected on ETH', 'critical'],
  ['New ATH approached on SOL', 'info'],
  ['Liquidity pool rebalanced', 'info'],
  ['CEX withdrawal surge: BTC', 'warn'],
  ['Smart contract call spike', 'info'],
  ['Network fee spike: 340 gwei', 'warn'],
  ['Validator slashing event', 'critical'],
  ['DeFi protocol paused', 'critical'],
  ['Cross-chain bridge transfer', 'info'],
  ['MEV bot activity: high', 'warn'],
  ['Stablecoin depeg warning', 'critical'],
  ['Options expiry approaching', 'info'],
  ['Funding rate anomaly detected', 'warn'],
  ['Large OI change on ETH perps', 'info'],
  ['Liquidation cascade: SOL', 'critical'],
  ['New wallet cluster identified', 'info'],
  ['Gas limit hit on Ethereum L1', 'warn'],
]

// ─── Generator ────────────────────────────────────────────────────────────────

/**
 * Generates a realistic streaming data tick, optionally derived from a previous tick.
 * Uses a Gaussian-like random walk for price simulation.
 */
export function generateTick(prev: DataTick | null): DataTick {
  const now = Date.now()
  const ts = new Date(now).toLocaleTimeString('en-US', { hour12: false })

  // Price random walk with momentum
  const prices = {} as PriceMap
  ASSETS.forEach((asset) => {
    const base = prev?.prices?.[asset] ?? BASE_PRICES[asset]
    const volatility = asset === 'BTC/USD' ? 0.0025 : asset === 'ETH/USD' ? 0.003 : 0.005
    const drift = (Math.random() - 0.495) * base * volatility
    prices[asset] = Math.max(base * 0.5, base + drift)
  })

  const totalVolume = Math.floor(150_000 + Math.random() * 80_000)

  const metrics = {
    latency: Math.floor(8 + Math.random() * 40),
    throughput: Math.floor(1200 + Math.random() * 800),
    errorRate: parseFloat((Math.random() * 2.5).toFixed(2)),
    activeUsers: Math.floor(4200 + Math.random() * 1800),
  }

  const barData = ASSETS.map((asset) => ({
    name: asset.split('/')[0],
    volume: Math.floor(10_000 + Math.random() * 50_000),
    trades: Math.floor(200 + Math.random() * 800),
  }))

  const [msg, sev] = LOG_MSGS[Math.floor(Math.random() * LOG_MSGS.length)]

  return {
    ts,
    prices,
    totalVolume,
    metrics,
    barData,
    log: {
      id: now + Math.random(),
      msg,
      sev,
      ts,
    },
  }
}

/**
 * Seed initial history so the dashboard loads with data.
 */
export function seedHistory(count = 30): DataTick[] {
  const ticks: DataTick[] = []
  let prev: DataTick | null = null
  for (let i = 0; i < count; i++) {
    prev = generateTick(prev)
    ticks.push(prev)
  }
  return ticks
}

/**
 * Sanitize / validate an incoming tick to prevent bad data from crashing UI.
 */
export function validateTick(raw: unknown): DataTick | null {
  try {
    if (!raw || typeof raw !== 'object') return null
    const tick = raw as Partial<DataTick>
    if (!tick.ts || !tick.prices || !tick.metrics) return null
    return tick as DataTick
  } catch {
    return null
  }
}
