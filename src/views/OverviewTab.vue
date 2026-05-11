<template>
  <div class="overview-tab">
    <!-- Metric Cards -->
    <div class="metrics-row">
      <MetricCard
        label="ACTIVE USERS"
        :value="store.latest?.metrics?.activeUsers?.toLocaleString() ?? '—'"
        :color="theme.accent"
        :delta="0.4"
      />
      <MetricCard
        label="THROUGHPUT"
        :value="store.latest?.metrics?.throughput?.toLocaleString() ?? '—'"
        unit="tx/s"
        :color="theme.green"
        :delta="1.2"
      />
      <MetricCard
        label="LATENCY"
        :value="store.latest?.metrics?.latency ?? '—'"
        unit="ms"
        :color="latencyColor"
        :delta="-0.8"
      />
      <MetricCard
        label="ERROR RATE"
        :value="store.latest?.metrics?.errorRate ?? '—'"
        unit="%"
        :color="errorColor"
        :delta="store.latest?.metrics?.errorRate ?? 0 > 2 ? 0.5 : -0.3"
      />
      <MetricCard
        label="TOTAL VOLUME"
        :value="volumeDisplay"
        unit="USD"
        :color="theme.purple"
        :delta="2.1"
      />
    </div>

    <!-- Charts Row -->
    <div class="charts-row">
      <!-- Price Area Chart -->
      <ChartCard title="PRICE CHART" class="chart-main">
        <template #header-right>
          <div class="asset-price-header">
            <div class="asset-filters">
              <button
                v-for="asset in store.ASSETS"
                :key="asset"
                class="asset-btn"
                :class="{ active: store.selectedAsset === asset }"
                :style="store.selectedAsset === asset
                  ? { borderColor: assetColors[asset], color: assetColors[asset], background: assetColors[asset] + '22' }
                  : {}"
                @click="store.setSelectedAsset(asset)"
              >
                {{ asset.split('/')[0] }}
              </button>
            </div>
            <div class="current-price">
              <div class="price-value" :style="{ color: assetColors[store.selectedAsset] }">
                ${{ formatPrice(store.selectedAssetPrice, store.selectedAsset) }}
              </div>
              <div class="price-delta" :style="{ color: store.selectedAssetDelta >= 0 ? theme.green : theme.red }">
                {{ store.selectedAssetDelta >= 0 ? '▲' : '▼' }}
                {{ Math.abs(store.selectedAssetDelta).toFixed(3) }}%
              </div>
            </div>
          </div>
        </template>
        <v-chart
          class="echart"
          :option="priceAreaOption"
          :autoresize="true"
        />
      </ChartCard>

      <!-- Volume Bar Chart -->
      <ChartCard title="VOLUME / ASSET" class="chart-side">
        <v-chart
          class="echart"
          :option="volumeBarOption"
          :autoresize="true"
        />
      </ChartCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import MetricCard from '@/components/MetricCard.vue'
import ChartCard from '@/components/ChartCard.vue'
import { useDashboardStore } from '@/stores/dashboard'
import { theme, assetColors } from '@/utils/theme'
import { usePriceAreaOptions, useVolumeBarOptions } from '@/composables/useChartoptions'

use([CanvasRenderer, LineChart, BarChart, GridComponent, TooltipComponent, LegendComponent])

const store = useDashboardStore()

const latencyColor = computed(() =>
  (store.latest?.metrics?.latency ?? 0) > 35 ? theme.yellow : theme.green
)
const errorColor = computed(() =>
  (store.latest?.metrics?.errorRate ?? 0) > 2 ? theme.red : theme.green
)
const volumeDisplay = computed(() => {
  const v = store.latest?.totalVolume ?? 0
  return v ? `${(v / 1000).toFixed(0)}K` : '—'
})

function formatPrice(price: number, asset: string): string {
  if (!price) return '—'
  if (price >= 1000) return price.toLocaleString(undefined, { maximumFractionDigits: 0 })
  return price.toFixed(4)
}

const selectedAssetKey = computed(() => store.selectedAsset.split('/')[0] as any)
const priceAreaOption = usePriceAreaOptions(computed(() => store.priceChartData), computed(() => store.selectedAsset))

const latestBarData = computed(() => store.latest?.barData ?? [])
const volumeBarOption = useVolumeBarOptions(latestBarData)
</script>

<style scoped>
.overview-tab {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.metrics-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.charts-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.chart-main {
  flex: 2;
  min-width: 300px;
}
.chart-side {
  flex: 1;
  min-width: 220px;
}
.echart {
  width: 100%;
  height: 210px;
}
.asset-price-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
}
.asset-filters {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.asset-btn {
  background: transparent;
  border: 1px solid v-bind('theme.border');
  color: v-bind('theme.textMuted');
  border-radius: 5px;
  padding: 2px 8px;
  font-size: 10px;
  cursor: pointer;
  font-family: 'Space Mono', monospace;
  transition: all 0.15s;
}
.current-price {
  text-align: right;
}
.price-value {
  font-size: 20px;
  font-weight: 700;
  font-family: 'Space Mono', monospace;
}
.price-delta {
  font-size: 11px;
  font-family: 'Space Mono', monospace;
}
</style>
