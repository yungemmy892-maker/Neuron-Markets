<template>
  <div class="assets-tab">
    <!-- Multi-line comparison chart -->
    <ChartCard title="ALL ASSETS — PRICE COMPARISON" class="full-width">
      <v-chart class="echart-tall" :option="multiLineOption" :autoresize="true" />
    </ChartCard>

    <!-- Asset sparkline cards -->
    <div class="asset-grid">
      <div
        v-for="asset in store.ASSETS"
        :key="asset"
        class="asset-card"
        :style="{ borderColor: hoveredAsset === asset ? assetColors[asset] + '88' : theme.border }"
        @mouseenter="hoveredAsset = asset"
        @mouseleave="hoveredAsset = null"
        @click="onAssetClick(asset)"
      >
        <div class="asset-symbol" :style="{ color: theme.textMuted }">{{ asset }}</div>
        <div class="asset-price" :style="{ color: assetColors[asset] }">
          ${{ formatPrice(store.latest?.prices[asset] ?? 0, asset) }}
        </div>
        <div class="asset-delta" :style="{ color: getAssetDelta(asset) >= 0 ? theme.green : theme.red }">
          {{ getAssetDelta(asset) >= 0 ? '▲' : '▼' }} {{ Math.abs(getAssetDelta(asset)).toFixed(3) }}%
        </div>
        <v-chart
          class="echart-spark"
          :option="sparklineOptions[asset]"
          :autoresize="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import ChartCard from '@/components/ChartCard.vue'
import { useDashboardStore } from '@/stores/dashboard'
import { theme, assetColors } from '@/utils/theme'
import { useMultiLineOptions, useSparklineOptions } from '@/composables/useChartoptions'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent])

const store = useDashboardStore()
const hoveredAsset = ref<string | null>(null)

const multiLineOption = useMultiLineOptions(computed(() => store.priceChartData))

// Sparklines per asset (last 20 ticks)
const sparklineOptions = computed(() => {
  const result: Record<string, any> = {}
  store.ASSETS.forEach((asset) => {
    const values = store.windowedHistory.slice(-20).map((t) => t.prices[asset])
    const color = assetColors[asset]
    result[asset] = {
      backgroundColor: 'transparent',
      animation: false,
      grid: { top: 2, right: 2, bottom: 2, left: 2 },
      xAxis: { type: 'category', show: false },
      yAxis: { type: 'value', show: false, scale: true },
      series: [{
        type: 'line',
        data: values,
        smooth: true,
        symbol: 'none',
        lineStyle: { color, width: 1.5 },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: color + '44' },
              { offset: 1, color: color + '00' },
            ],
          },
        },
      }],
    }
  })
  return result
})

function formatPrice(price: number, asset: string): string {
  if (!price) return '—'
  return price >= 1000
    ? price.toLocaleString(undefined, { maximumFractionDigits: 0 })
    : price.toFixed(4)
}

function getAssetDelta(asset: string): number {
  const h = store.history
  if (h.length < 2) return 0
  const prev = h[h.length - 2]?.prices[asset as keyof typeof h[0]['prices']] ?? 1
  const curr = h[h.length - 1]?.prices[asset as keyof typeof h[0]['prices']] ?? 1
  return ((curr - prev) / prev) * 100
}

function onAssetClick(asset: string) {
  store.setSelectedAsset(asset)
}
</script>

<style scoped>
.assets-tab {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.full-width {
  width: 100%;
}
.echart-tall {
  width: 100%;
  height: 250px;
}
.asset-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.asset-card {
  flex: 1;
  min-width: 150px;
  background: v-bind('theme.bgCard');
  border: 1px solid v-bind('theme.border');
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.asset-card:hover {
  background: v-bind('theme.bgCardHover');
}
.asset-symbol {
  font-size: 10px;
  font-family: 'Space Mono', monospace;
  margin-bottom: 6px;
}
.asset-price {
  font-size: 18px;
  font-weight: 700;
  font-family: 'Space Mono', monospace;
}
.asset-delta {
  font-size: 11px;
  font-family: 'Space Mono', monospace;
  margin-top: 4px;
  margin-bottom: 8px;
}
.echart-spark {
  width: 100%;
  height: 44px;
}
</style>
