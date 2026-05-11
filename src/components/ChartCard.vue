<template>
  <div class="chart-card" :style="cardStyle">
    <div class="chart-header">
      <div class="chart-title">{{ title }}</div>
      <slot name="header-right" />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { theme } from '@/utils/theme'

defineProps<{
  title: string
}>()

const cardStyle = {
  background: theme.bgCard,
  border: `1px solid ${theme.border}`,
}
</script>

<style scoped>
.chart-card {
  border-radius: 12px;
  padding: 20px 16px 12px;
  transition: border-color 0.2s;
  min-width: 0;
}
.chart-card:hover {
  border-color: v-bind('theme.borderGlow') !important;
}
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.chart-title {
  font-size: 12px;
  color: v-bind('theme.textMuted');
  font-family: 'Space Mono', monospace;
  letter-spacing: 0.06em;
}
</style>
