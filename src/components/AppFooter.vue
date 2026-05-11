<template>
  <footer class="app-footer" :style="{ borderTop: `1px solid ${theme.border}` }">
    <span class="footer-brand">NEURON MARKETS · REAL-TIME ANALYTICS · {{ today }}</span>
    <span class="footer-meta">
      {{ store.history.length }} ticks · {{ store.timeWindow }}s window · 800ms interval
    </span>
  </footer>
</template>

<script setup lang="ts">
import { useDashboardStore } from '@/stores/dashboard'
import { theme } from '@/utils/theme'

const store = useDashboardStore()
const today = new Date().toLocaleDateString()
</script>

<style scoped>
.app-footer {
  margin-top: 24px;
  padding-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.footer-brand,
.footer-meta {
  font-size: 10px;
  color: v-bind('theme.textMuted');
  font-family: 'Space Mono', monospace;
}
</style>
