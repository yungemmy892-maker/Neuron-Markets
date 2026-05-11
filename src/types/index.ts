// ─── Asset Types ─────────────────────────────────────────────────────────────

export type AssetSymbol = 'BTC/USD' | 'ETH/USD' | 'SOL/USD' | 'MATIC/USD' | 'ARB/USD'

export interface PriceMap {
  'BTC/USD': number
  'ETH/USD': number
  'SOL/USD': number
  'MATIC/USD': number
  'ARB/USD': number
}

export interface BarDataPoint {
  name: string
  volume: number
  trades: number
}

// ─── Metrics ─────────────────────────────────────────────────────────────────

export interface SystemMetrics {
  latency: number       // ms
  throughput: number    // tx/s
  errorRate: number     // %
  activeUsers: number
}

// ─── Tick / Streaming ────────────────────────────────────────────────────────

export type SeverityLevel = 'info' | 'warn' | 'critical' | 'ok'

export interface LogEntry {
  id: number
  msg: string
  sev: SeverityLevel
  ts: string
}

export interface DataTick {
  ts: string
  prices: PriceMap
  totalVolume: number
  metrics: SystemMetrics
  barData: BarDataPoint[]
  log: LogEntry
}

// ─── Chart Data Shapes ───────────────────────────────────────────────────────

export interface PriceChartPoint {
  ts: string
  BTC: number
  ETH: number
  SOL: number
  MATIC: number
  ARB: number
}

export interface MetricsChartPoint {
  ts: string
  latency: number
  throughput: number
  errorRate: number
}

// ─── UI State ────────────────────────────────────────────────────────────────

export type TabName = 'overview' | 'assets' | 'system' | 'feed'
export type TimeWindow = 15 | 30 | 60
export type FeedFilter = 'all' | 'critical' | 'warn' | 'info'
