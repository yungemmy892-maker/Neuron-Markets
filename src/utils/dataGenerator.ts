import type { DataTick, PriceMap, SeverityLevel, LiquidityPool, PoolPair } from '@/types'

// ─── Constants ────────────────────────────────────────────────────────────────

export const ASSETS = ['BTC/USD', 'ETH/USD', 'SOL/USD', 'MATIC/USD', 'ARB/USD'] as const

export const POOLS = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'ARB/ETH', 'MATIC/USDT'] as const

export const BASE_POOLS: Record<PoolPair, { tvl: number; apy: number; volume24h: number; fee: number; utilization: number }> = {
  'BTC/USDT':   { tvl: 42_500_000, apy: 6.2,  volume24h: 18_400_000, fee: 0.30, utilization: 61 },
  'ETH/USDT':   { tvl: 31_800_000, apy: 8.4,  volume24h: 15_100_000, fee: 0.30, utilization: 68 },
  'SOL/USDT':   { tvl: 14_200_000, apy: 11.7, volume24h: 9_200_000,  fee: 0.25, utilization: 74 },
  'ARB/ETH':    { tvl: 6_900_000,  apy: 14.3, volume24h: 3_100_000,  fee: 0.30, utilization: 55 },
  'MATIC/USDT': { tvl: 4_100_000,  apy: 9.8,  volume24h: 1_800_000,  fee: 0.25, utilization: 47 },
}

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
    name: asset.split('/')[0]!,
    volume: Math.floor(10_000 + Math.random() * 50_000),
    trades: Math.floor(200 + Math.random() * 800),
  }))

  const [msg, sev] = LOG_MSGS[Math.floor(Math.random() * LOG_MSGS.length)]!

  const pools: LiquidityPool[] = POOLS.map((id) => {
    const base = prev?.pools?.find((p) => p.id === id) ?? { id, ...BASE_POOLS[id] }
    const tvlDrift = (Math.random() - 0.5) * base.tvl * 0.004
    const apyDrift = (Math.random() - 0.5) * 0.15
    const utilDrift = (Math.random() - 0.5) * 1.5
    return {
      id,
      tvl: Math.max(base.tvl * 0.5, base.tvl + tvlDrift),
      apy: Math.max(0.5, base.apy + apyDrift),
      volume24h: Math.max(0, BASE_POOLS[id].volume24h + (Math.random() - 0.5) * BASE_POOLS[id].volume24h * 0.05),
      fee: BASE_POOLS[id].fee,
      utilization: Math.min(98, Math.max(10, base.utilization + utilDrift)),
    }
  })

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
    pools,
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
