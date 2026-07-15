import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DataTick, LogEntry, PriceChartPoint, MetricsChartPoint, TimeWindow, PoolPair } from '@/types'
import { generateTick, seedHistory, ASSETS, POOLS } from '@/utils/dataGenerator'

const STREAM_INTERVAL_MS = 800
const MAX_LOGS = 100

export const useDashboardStore = defineStore('dashboard', () => {
  // ─── State ──────────────────────────────────────────────────────────────────

  const history = ref<DataTick[]>(seedHistory(30))
  const logs = ref<LogEntry[]>([])
  const paused = ref(false)
  const timeWindow = ref<TimeWindow>(60)
  const selectedAsset = ref('BTC/USD')
  const selectedPool = ref<PoolPair>('BTC/USDT')

  let intervalId: ReturnType<typeof setInterval> | null = null

  // ─── Derived ────────────────────────────────────────────────────────────────

  const latest = computed<DataTick | null>(() =>
    history.value.length > 0 ? history.value[history.value.length - 1]! : null
  )

  const windowedHistory = computed<DataTick[]>(() =>
    history.value.slice(-timeWindow.value)
  )

  /** Flat price chart data: { ts, BTC, ETH, SOL, MATIC, ARB } */
  const priceChartData = computed<PriceChartPoint[]>(() =>
    windowedHistory.value.map((t) => ({
      ts: t.ts,
      BTC: parseFloat(t.prices['BTC/USD'].toFixed(2)),
      ETH: parseFloat(t.prices['ETH/USD'].toFixed(2)),
      SOL: parseFloat(t.prices['SOL/USD'].toFixed(4)),
      MATIC: parseFloat(t.prices['MATIC/USD'].toFixed(4)),
      ARB: parseFloat(t.prices['ARB/USD'].toFixed(4)),
    }))
  )

  /** System metrics chart data */
  const metricsChartData = computed<MetricsChartPoint[]>(() =>
    windowedHistory.value.map((t) => ({
      ts: t.ts,
      latency: t.metrics.latency,
      throughput: t.metrics.throughput,
      errorRate: t.metrics.errorRate,
    }))
  )

  /** Price delta % for selected asset (last 2 ticks) */
  const selectedAssetDelta = computed<number>(() => {
    const h = history.value
    if (h.length < 2) return 0
    const prev = h[h.length - 2]?.prices[selectedAsset.value as keyof typeof h[0]['prices']] ?? 0
    const curr = h[h.length - 1]?.prices[selectedAsset.value as keyof typeof h[0]['prices']] ?? 0
    return prev === 0 ? 0 : ((curr - prev) / prev) * 100
  })

  /** Short key for selected asset (e.g. "BTC") */
  const selectedAssetKey = computed(() => selectedAsset.value.split('/')[0])

  /** Latest pools snapshot */
  const poolsData = computed(() => latest.value?.pools ?? [])

  /** Currently selected pool's latest data */
  const selectedPoolData = computed(() =>
    poolsData.value.find((p) => p.id === selectedPool.value) ?? null
  )

  /** TVL history for the selected pool, across the current time window */
  const selectedPoolTvlHistory = computed(() =>
    windowedHistory.value.map((t) => ({
      ts: t.ts,
      tvl: t.pools.find((p) => p.id === selectedPool.value)?.tvl ?? 0,
    }))
  )

  /** TVL delta % for selected pool (last 2 ticks) */
  const selectedPoolDelta = computed<number>(() => {
    const h = history.value
    if (h.length < 2) return 0
    const prev = h[h.length - 2]?.pools.find((p) => p.id === selectedPool.value)?.tvl ?? 0
    const curr = h[h.length - 1]?.pools.find((p) => p.id === selectedPool.value)?.tvl ?? 0
    return prev === 0 ? 0 : ((curr - prev) / prev) * 100
  })

  /** Combined TVL across all pools (protocol total) */
  const totalTvl = computed(() =>
    poolsData.value.reduce((sum, p) => sum + p.tvl, 0)
  )

  /** Latest price for the selected asset */
  const selectedAssetPrice = computed(() =>
    latest.value?.prices[selectedAsset.value as keyof typeof latest.value.prices] ?? 0
  )

  // ─── Actions ────────────────────────────────────────────────────────────────

  function startStream() {
    if (intervalId) return
    intervalId = setInterval(() => {
      if (paused.value) return
      const prev = history.value[history.value.length - 1] ?? null
      const tick = generateTick(prev)
      history.value = [...history.value.slice(-(timeWindow.value * 2)), tick]
      logs.value = [tick.log, ...logs.value].slice(0, MAX_LOGS)
    }, STREAM_INTERVAL_MS)
  }

  function stopStream() {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function togglePause() {
    paused.value = !paused.value
  }

  function setTimeWindow(w: TimeWindow) {
    timeWindow.value = w
  }

  function setSelectedAsset(asset: string) {
    selectedAsset.value = asset
  }

  function setSelectedPool(pool: PoolPair) {
    selectedPool.value = pool
  }

  return {
    // state
    history,
    logs,
    paused,
    timeWindow,
    selectedAsset,
    selectedPool,
    // derived
    latest,
    windowedHistory,
    priceChartData,
    metricsChartData,
    selectedAssetDelta,
    selectedAssetKey,
    selectedAssetPrice,
    poolsData,
    selectedPoolData,
    selectedPoolTvlHistory,
    selectedPoolDelta,
    totalTvl,
    // actions
    startStream,
    stopStream,
    togglePause,
    setTimeWindow,
    setSelectedAsset,
    setSelectedPool,
    ASSETS,
    POOLS,
  }
})
