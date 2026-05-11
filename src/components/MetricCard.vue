<template>
  <div class="metric-card" :style="cardStyle">
    <div class="top-bar" :style="{ background: topBarGradient }" />
    <div class="label">{{ label }}</div>
    <div class="value-row">
      <span class="value" :style="{ color }">{{ value }}</span>
      <span v-if="unit" class="unit">{{ unit }}</span>
    </div>
    <div v-if="sub" class="sub">{{ sub }}</div>
    <div v-if="delta !== undefined" class="delta" :style="{ color: deltaColor }">
      {{ delta >= 0 ? '▲' : '▼' }} {{ Math.abs(delta).toFixed(2) }}%
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { theme } from '@/utils/theme'

const props = defineProps<{
  label: string
  value: string | number
  unit?: string
  delta?: number
  color: string
  sub?: string
}>()

const cardStyle = computed(() => ({
  background: theme.bgCard,
  border: `1px solid ${theme.border}`,
}))

const topBarGradient = computed(
  () => `linear-gradient(90deg, ${props.color}00, ${props.color}, ${props.color}00)`
)

const deltaColor = computed(() =>
  props.delta !== undefined && props.delta >= 0 ? theme.green : theme.red
)
</script>

<style scoped>
.metric-card {
  flex: 1;
  min-width: 140px;
  border-radius: 12px;
  padding: 18px 20px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s;
}
.metric-card:hover {
  border-color: v-bind('theme.borderGlow') !important;
}
.top-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
}
.label {
  font-size: 11px;
  color: v-bind('theme.textMuted');
  font-family: 'Space Mono', monospace;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}
.value-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}
.value {
  font-size: 26px;
  font-weight: 700;
  font-family: 'Space Mono', monospace;
  letter-spacing: -0.02em;
}
.unit {
  font-size: 12px;
  color: v-bind('theme.textMuted');
}
.sub {
  font-size: 11px;
  color: v-bind('theme.textMuted');
  margin-top: 4px;
}
.delta {
  font-size: 12px;
  margin-top: 6px;
  font-family: 'Space Mono', monospace;
}
</style>
