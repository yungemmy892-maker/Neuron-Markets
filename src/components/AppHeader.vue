<template>
  <header class="app-header">
    <div class="header-left">
      <div class="logo-icon">⚡</div>
      <span class="brand">NEURON</span>
      <span class="brand-sub">/ MARKETS</span>
      <div class="status-dot" :class="{ paused: store.paused }" />
      <span class="status-label" :style="{ color: store.paused ? theme.yellow : theme.green }">
        {{ store.paused ? 'PAUSED' : 'LIVE' }}
      </span>
    </div>

    <div class="header-right">
      <button
        v-for="w in TIME_WINDOWS"
        :key="w"
        class="pill-btn"
        :class="{ active: store.timeWindow === w }"
        @click="store.setTimeWindow(w)"
      >
        {{ w }}s
      </button>

      <button
        class="pill-btn"
        :class="store.paused ? 'pill-green' : 'pill-red'"
        @click="store.togglePause"
      >
        {{ store.paused ? '▶ RESUME' : '⏸ PAUSE' }}
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useDashboardStore } from '@/stores/dashboard'
import { theme } from '@/utils/theme'

const store = useDashboardStore()
const TIME_WINDOWS = [15, 30, 60] as const
</script>

<style scoped>
.app-header {
  border-bottom: 1px solid v-bind('theme.border');
  padding: 0 24px;
  background: v-bind('theme.bgCard + "cc"');
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 58px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.logo-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, v-bind('theme.accent'), v-bind('theme.purple'));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
  flex-shrink: 0;
}
.brand {
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.02em;
  color: v-bind('theme.text');
}
.brand-sub {
  color: v-bind('theme.textMuted');
  font-size: 13px;
  letter-spacing: 0.05em;
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: v-bind('theme.green');
  box-shadow: 0 0 8px v-bind('theme.green');
  animation: pulse 2s infinite;
}
.status-dot.paused {
  background: v-bind('theme.yellow');
  box-shadow: 0 0 8px v-bind('theme.yellow');
  animation: none;
}
.status-label {
  font-size: 11px;
  font-family: 'Space Mono', monospace;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.pill-btn {
  background: transparent;
  border: 1px solid v-bind('theme.border');
  color: v-bind('theme.textMuted');
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 11px;
  cursor: pointer;
  font-family: 'Space Mono', monospace;
  transition: all 0.15s;
}
.pill-btn:hover {
  background: rgba(255,255,255,0.05);
}
.pill-btn.active {
  background: v-bind('theme.accentGlow');
  border-color: v-bind('theme.accent');
  color: v-bind('theme.accent');
}
.pill-green {
  background: rgba(0, 229, 160, 0.1) !important;
  border-color: v-bind('theme.green') !important;
  color: v-bind('theme.green') !important;
}
.pill-red {
  background: rgba(255, 68, 102, 0.1) !important;
  border-color: v-bind('theme.red') !important;
  color: v-bind('theme.red') !important;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>
