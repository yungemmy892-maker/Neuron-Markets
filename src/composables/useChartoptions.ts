import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import { theme, assetShortColors } from '@/utils/theme'
import type { PriceChartPoint, MetricsChartPoint, BarDataPoint } from '@/types'

const GRID = { top: 16, right: 16, bottom: 28, left: 56 }

function baseAxis(data: string[]) {
  return {
    xAxis: {
      type: 'category' as const,
      data,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: theme.textMuted,
        fontSize: 9,
        fontFamily: "'Space Mono', monospace",
        interval: 'auto',
        showMaxLabel: true,
        showMinLabel: true,
      },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value' as const,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: theme.textMuted,
        fontSize: 9,
        fontFamily: "'Space Mono', monospace",
      },
      splitLine: { lineStyle: { color: theme.grid, type: 'dashed' } },
    },
  }
}

// ─── Area Price Chart ─────────────────────────────────────────────────────────

export function usePriceAreaOptions(
  data: ComputedRef<PriceChartPoint[]>,
  asset: ComputedRef<string>
) {
  return computed(() => {
    if (!data.value || data.value.length === 0) {
      return { series: [], xAxis: { type: 'category' as const, data: [] }, yAxis: { type: 'value' as const } }
    }
    const key = asset.value.split('/')[0] as keyof PriceChartPoint
    const color = assetShortColors[key as string] ?? theme.accent
    const xs = data.value.map((d) => d.ts)
    const ys = data.value.map((d) => d[key] as number)

    return {
      backgroundColor: 'transparent',
      animation: false,
      grid: GRID,
      tooltip: {
        trigger: 'axis',
        backgroundColor: theme.bgCard,
        borderColor: theme.borderGlow,
        textStyle: { color: theme.text, fontSize: 11, fontFamily: "'Space Mono', monospace" },
        formatter: (params: any[]) => {
          const p = params[0]
          return `<div style="color:${theme.textMuted};margin-bottom:4px">${p.axisValue}</div>
                  <div style="color:${color}"><b>${Number(p.value).toLocaleString(undefined, { maximumFractionDigits: 4 })}</b></div>`
        },
      },
      ...baseAxis(xs),
      series: [
        {
          type: 'line',
          data: ys,
          smooth: true,
          symbol: 'none',
          lineStyle: { color, width: 2 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: color + '55' },
                { offset: 1, color: color + '00' },
              ],
            },
          },
        },
      ],
    }
  })
}

// ─── Multi-line All Assets ────────────────────────────────────────────────────

export function useMultiLineOptions(data: ComputedRef<PriceChartPoint[]>) {
  return computed(() => {
    if (!data.value || data.value.length === 0) {
      return { series: [], xAxis: { type: 'category' as const, data: [] }, yAxis: { type: 'value' as const } }
    }
    const xs = data.value.map((d) => d.ts)
    const keys = ['BTC', 'ETH', 'SOL', 'MATIC', 'ARB']

    return {
      backgroundColor: 'transparent',
      animation: false,
      grid: { top: 16, right: 16, bottom: 28, left: 64 },
      legend: {
        bottom: 0,
        textStyle: { color: theme.textDim, fontSize: 9, fontFamily: "'Space Mono', monospace" },
        icon: 'roundRect',
        itemWidth: 12,
        itemHeight: 4,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: theme.bgCard,
        borderColor: theme.borderGlow,
        textStyle: { color: theme.text, fontSize: 11, fontFamily: "'Space Mono', monospace" },
      },
      ...baseAxis(xs),
      series: keys.map((k) => ({
        name: k,
        type: 'line',
        data: data.value.map((d) => d[k as keyof PriceChartPoint] as number),
        smooth: true,
        symbol: 'none',
        lineStyle: { color: assetShortColors[k], width: 1.5 },
      })),
    }
  })
}

// ─── Volume Bar Chart ─────────────────────────────────────────────────────────

export function useVolumeBarOptions(data: ComputedRef<BarDataPoint[]>) {
  return computed(() => {
    if (!data.value || data.value.length === 0) {
      return { series: [], xAxis: { type: 'category' as const, data: [] }, yAxis: { type: 'value' as const } }
    }
    const names = data.value.map((d) => d.name)
    return {
      backgroundColor: 'transparent',
      animation: false,
      grid: { top: 16, right: 8, bottom: 28, left: 48 },
      tooltip: {
        trigger: 'axis',
        backgroundColor: theme.bgCard,
        borderColor: theme.borderGlow,
        textStyle: { color: theme.text, fontSize: 11, fontFamily: "'Space Mono', monospace" },
      },
      legend: {
        bottom: 0,
        textStyle: { color: theme.textDim, fontSize: 9, fontFamily: "'Space Mono', monospace" },
        icon: 'roundRect',
        itemWidth: 12,
        itemHeight: 4,
      },
      xAxis: {
        type: 'category' as const,
        data: names,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: theme.textMuted, fontSize: 9, fontFamily: "'Space Mono', monospace" },
      },
      yAxis: {
        type: 'value' as const,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: theme.textMuted,
          fontSize: 9,
          fontFamily: "'Space Mono', monospace",
          formatter: (v: number) => `${(v / 1000).toFixed(0)}k`,
        },
        splitLine: { lineStyle: { color: theme.grid, type: 'dashed' } },
      },
      series: [
        {
          name: 'Volume',
          type: 'bar',
          data: data.value.map((d) => d.volume),
          itemStyle: { color: theme.accent, borderRadius: [3, 3, 0, 0] },
          barMaxWidth: 20,
        },
        {
          name: 'Trades',
          type: 'bar',
          data: data.value.map((d) => d.trades),
          itemStyle: { color: theme.purple, borderRadius: [3, 3, 0, 0] },
          barMaxWidth: 20,
        },
      ],
    }
  })
}

// ─── System Metric Area ───────────────────────────────────────────────────────

export function useMetricAreaOptions(
  data: ComputedRef<MetricsChartPoint[]>,
  key: 'latency' | 'throughput' | 'errorRate',
  color: string,
  refLine?: number
) {
  return computed(() => {
    if (!data.value || data.value.length === 0) {
      return { series: [], xAxis: { type: 'category' as const, data: [] }, yAxis: { type: 'value' as const } }
    }
    const xs = data.value.map((d) => d.ts)
    const ys = data.value.map((d) => d[key])

    const markLine = refLine
      ? {
          silent: true,
          symbol: 'none',
          lineStyle: { color: theme.red, type: 'dashed', width: 1 },
          data: [{ yAxis: refLine }],
        }
      : undefined

    return {
      backgroundColor: 'transparent',
      animation: false,
      grid: GRID,
      tooltip: {
        trigger: 'axis',
        backgroundColor: theme.bgCard,
        borderColor: theme.borderGlow,
        textStyle: { color: theme.text, fontSize: 11, fontFamily: "'Space Mono', monospace" },
      },
      ...baseAxis(xs),
      series: [
        {
          type: 'line',
          data: ys,
          smooth: true,
          symbol: 'none',
          lineStyle: { color, width: 2 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: color + '55' },
                { offset: 1, color: color + '00' },
              ],
            },
          },
          ...(markLine ? { markLine } : {}),
        },
      ],
    }
  })
}

// ─── Generic Area Chart (e.g. Pool TVL) ───────────────────────────────────────

export function useGenericAreaOptions(
  points: ComputedRef<{ ts: string; value: number }[]>,
  color: ComputedRef<string> | string,
  valueFormatter?: (v: number) => string
) {
  return computed(() => {
    const c = typeof color === 'string' ? color : color.value
    if (!points.value || points.value.length === 0) {
      return { series: [], xAxis: { type: 'category' as const, data: [] }, yAxis: { type: 'value' as const } }
    }
    const xs = points.value.map((d) => d.ts)
    const ys = points.value.map((d) => d.value)
    const fmt = valueFormatter ?? ((v: number) => v.toLocaleString(undefined, { maximumFractionDigits: 0 }))

    return {
      backgroundColor: 'transparent',
      animation: false,
      grid: GRID,
      tooltip: {
        trigger: 'axis',
        backgroundColor: theme.bgCard,
        borderColor: theme.borderGlow,
        textStyle: { color: theme.text, fontSize: 11, fontFamily: "'Space Mono', monospace" },
        formatter: (params: any[]) => {
          const p = params[0]
          return `<div style="color:${theme.textMuted};margin-bottom:4px">${p.axisValue}</div>
                  <div style="color:${c}"><b>${fmt(Number(p.value))}</b></div>`
        },
      },
      ...baseAxis(xs),
      yAxis: {
        ...baseAxis(xs).yAxis,
        axisLabel: {
          ...baseAxis(xs).yAxis.axisLabel,
          formatter: (v: number) => fmt(v),
        },
      },
      series: [
        {
          type: 'line',
          data: ys,
          smooth: true,
          symbol: 'none',
          lineStyle: { color: c, width: 2 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: c + '55' },
                { offset: 1, color: c + '00' },
              ],
            },
          },
        },
      ],
    }
  })
}

// ─── Mini Sparkline ───────────────────────────────────────────────────────────

export function useSparklineOptions(values: ComputedRef<number[]>, color: string) {
  return computed(() => ({
    backgroundColor: 'transparent',
    animation: false,
    grid: { top: 2, right: 2, bottom: 2, left: 2 },
    xAxis: { type: 'category' as const, show: false },
    yAxis: { type: 'value' as const, show: false, scale: true },
    series: [
      {
        type: 'line',
        data: values.value,
        smooth: true,
        symbol: 'none',
        lineStyle: { color, width: 1.5 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: color + '44' },
              { offset: 1, color: color + '00' },
            ],
          },
        },
      },
    ],
  }))
}
