<template>
  <div class="liquidity-tab">
    <!-- Protocol summary -->
    <div class="summary-row">
      <MetricCard
        label="TOTAL VALUE LOCKED"
        :value="formatUsd(store.totalTvl)"
        :color="theme.purple"
        :delta="store.selectedPoolDelta"
      />
      <MetricCard
        label="POOLS AVAILABLE"
        :value="store.POOLS.length"
        :color="theme.accent"
      />
      <MetricCard
        label="SELECTED POOL APY"
        :value="store.selectedPoolData ? store.selectedPoolData.apy.toFixed(2) : '—'"
        unit="%"
        :color="theme.green"
      />
      <MetricCard
        label="SELECTED POOL UTILIZATION"
        :value="store.selectedPoolData ? store.selectedPoolData.utilization.toFixed(0) : '—'"
        unit="%"
        :color="theme.yellow"
      />
    </div>

    <!-- Pool switcher -->
    <div class="pool-grid">
      <button
        v-for="pool in store.poolsData"
        :key="pool.id"
        class="pool-card"
        :class="{ active: store.selectedPool === pool.id }"
        :style="store.selectedPool === pool.id
          ? { borderColor: poolColors[pool.id], background: poolColors[pool.id] + '14' }
          : {}"
        @click="store.setSelectedPool(pool.id)"
      >
        <div class="pool-top">
          <span class="pool-dot" :style="{ background: poolColors[pool.id] }" />
          <span class="pool-name">{{ pool.id }}</span>
        </div>
        <div class="pool-tvl">{{ formatUsd(pool.tvl) }}</div>
        <div class="pool-stats">
          <span :style="{ color: theme.green }">{{ pool.apy.toFixed(1) }}% APY</span>
          <span class="dim">{{ pool.fee }}% fee</span>
        </div>
        <div class="pool-util-bar">
          <div class="pool-util-fill" :style="{ width: pool.utilization + '%', background: poolColors[pool.id] }" />
        </div>
        <div class="pool-util-label">{{ pool.utilization.toFixed(0) }}% utilized</div>
      </button>
    </div>

    <!-- Detail chart for selected pool -->
    <ChartCard :title="`${store.selectedPool} — TVL TREND`" class="full-width">
      <template #header-right>
        <div class="detail-price">
          <div class="detail-value" :style="{ color: poolColors[store.selectedPool] }">
            {{ store.selectedPoolData ? formatUsd(store.selectedPoolData.tvl) : '—' }}
          </div>
          <div class="detail-delta" :style="{ color: store.selectedPoolDelta >= 0 ? theme.green : theme.red }">
            {{ store.selectedPoolDelta >= 0 ? '▲' : '▼' }} {{ Math.abs(store.selectedPoolDelta).toFixed(3) }}%
          </div>
        </div>
      </template>
      <v-chart class="echart-tall" :option="tvlChartOption" :autoresize="true" />
    </ChartCard>

    <!-- Pool details footer -->
    <div class="pool-meta" v-if="store.selectedPoolData">
      <div class="meta-item">
        <span class="meta-label">24H VOLUME</span>
        <span class="meta-value">{{ formatUsd(store.selectedPoolData.volume24h) }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">SWAP FEE</span>
        <span class="meta-value">{{ store.selectedPoolData.fee }}%</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">EST. DAILY YIELD</span>
        <span class="meta-value" :style="{ color: theme.green }">
          {{ formatUsd((store.selectedPoolData.tvl * store.selectedPoolData.apy) / 100 / 365) }}
        </span>
      </div>
      <div class="meta-item">
        <span class="meta-label">POOL RANK BY TVL</span>
        <span class="meta-value">#{{ poolRank }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import MetricCard from '@/components/MetricCard.vue'
import ChartCard from '@/components/ChartCard.vue'
import { useDashboardStore } from '@/stores/dashboard'
import { theme, poolColors } from '@/utils/theme'
import { useGenericAreaOptions } from '@/composables/useChartoptions'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent])

const store = useDashboardStore()

function formatUsd(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`
  return `$${v.toFixed(0)}`
}

const tvlPoints = computed(() =>
  store.selectedPoolTvlHistory.map((p) => ({ ts: p.ts, value: p.tvl }))
)
const tvlColor = computed(() => poolColors[store.selectedPool] ?? theme.accent)
const tvlChartOption = useGenericAreaOptions(tvlPoints, tvlColor, (v) => formatUsd(v))

const poolRank = computed(() => {
  const sorted = [...store.poolsData].sort((a, b) => b.tvl - a.tvl)
  const idx = sorted.findIndex((p) => p.id === store.selectedPool)
  return idx === -1 ? '—' : idx + 1
})
</script>

<style scoped>
.liquidity-tab {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.summary-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.pool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 12px;
}
.pool-card {
  text-align: left;
  background: v-bind('theme.bgCard');
  border: 1px solid v-bind('theme.border');
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  color: v-bind('theme.text');
  transition: all 0.15s;
  font-family: 'DM Sans', sans-serif;
}
.pool-card:hover {
  border-color: v-bind('theme.borderGlow');
}
.pool-card.active {
  box-shadow: 0 0 0 1px currentColor inset;
}
.pool-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.pool-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.pool-name {
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  color: v-bind('theme.textDim');
}
.pool-tvl {
  font-size: 20px;
  font-weight: 700;
  font-family: 'Space Mono', monospace;
  margin-bottom: 8px;
}
.pool-stats {
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
  font-family: 'Space Mono', monospace;
  margin-bottom: 10px;
}
.dim {
  color: v-bind('theme.textMuted');
}
.pool-util-bar {
  height: 4px;
  border-radius: 2px;
  background: v-bind('theme.border');
  overflow: hidden;
  margin-bottom: 6px;
}
.pool-util-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}
.pool-util-label {
  font-size: 10px;
  color: v-bind('theme.textMuted');
  font-family: 'Space Mono', monospace;
}
.full-width {
  width: 100%;
}
.echart-tall {
  width: 100%;
  height: 260px;
}
.detail-price {
  text-align: right;
}
.detail-value {
  font-size: 18px;
  font-weight: 700;
  font-family: 'Space Mono', monospace;
}
.detail-delta {
  font-size: 11px;
  font-family: 'Space Mono', monospace;
}
.pool-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  background: v-bind('theme.bgCard');
  border: 1px solid v-bind('theme.border');
  border-radius: 12px;
  padding: 16px 20px;
}
.meta-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.meta-label {
  font-size: 10px;
  color: v-bind('theme.textMuted');
  font-family: 'Space Mono', monospace;
  letter-spacing: 0.08em;
}
.meta-value {
  font-size: 15px;
  font-weight: 700;
  font-family: 'Space Mono', monospace;
}
</style>
