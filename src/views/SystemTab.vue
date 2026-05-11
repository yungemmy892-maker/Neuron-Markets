<template>
  <div class="system-tab">
    <!-- System Metric Cards -->
    <div class="metrics-row">
      <MetricCard
        label="LATENCY"
        :value="store.latest?.metrics?.latency ?? '—'"
        unit="ms"
        :color="latencyColor"
        :delta="-1.2"
      />
      <MetricCard
        label="THROUGHPUT"
        :value="store.latest?.metrics?.throughput?.toLocaleString() ?? '—'"
        unit="tx/s"
        :color="theme.accent"
        :delta="2.3"
      />
      <MetricCard
        label="ERROR RATE"
        :value="store.latest?.metrics?.errorRate ?? '—'"
        unit="%"
        :color="errorColor"
        :delta="0.1"
      />
      <MetricCard
        label="ACTIVE USERS"
        :value="store.latest?.metrics?.activeUsers?.toLocaleString() ?? '—'"
        :color="theme.purple"
        :delta="0.7"
      />
    </div>

    <!-- Three system charts -->
    <div class="charts-row">
      <ChartCard title="LATENCY (ms)" class="chart-item">
        <template #header-right>
          <span class="ref-label" :style="{ color: theme.red }">⚠ threshold: 35ms</span>
        </template>
        <v-chart class="echart" :option="latencyOption" :autoresize="true" />
      </ChartCard>

      <ChartCard title="THROUGHPUT (tx/s)" class="chart-item">
        <v-chart class="echart" :option="throughputOption" :autoresize="true" />
      </ChartCard>

      <ChartCard title="ERROR RATE (%)" class="chart-item">
        <template #header-right>
          <span class="ref-label" :style="{ color: theme.yellow }">⚠ threshold: 2%</span>
        </template>
        <v-chart class="echart" :option="errorRateOption" :autoresize="true" />
      </ChartCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, MarkLineComponent } from 'echarts/components'
import MetricCard from '@/components/MetricCard.vue'
import ChartCard from '@/components/ChartCard.vue'
import { useDashboardStore } from '@/stores/dashboard'
import { theme } from '@/utils/theme'
import { useMetricAreaOptions } from '@/composables/useChartoptions'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, MarkLineComponent])

const store = useDashboardStore()

const latencyColor = computed(() =>
  (store.latest?.metrics?.latency ?? 0) > 35 ? theme.yellow : theme.green
)
const errorColor = computed(() =>
  (store.latest?.metrics?.errorRate ?? 0) > 2 ? theme.red : theme.green
)

const latencyOption = useMetricAreaOptions(computed(() => store.metricsChartData), 'latency', theme.yellow, 35)
const throughputOption = useMetricAreaOptions(computed(() => store.metricsChartData), 'throughput', theme.green)
const errorRateOption = useMetricAreaOptions(computed(() => store.metricsChartData), 'errorRate', theme.red, 2)
</script>

<style scoped>
.system-tab {
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
.chart-item {
  flex: 1;
  min-width: 240px;
}
.echart {
  width: 100%;
  height: 180px;
}
.ref-label {
  font-size: 10px;
  font-family: 'Space Mono', monospace;
}
</style>
