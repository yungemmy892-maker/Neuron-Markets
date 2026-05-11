<template>
  <div class="feed-tab">
    <!-- Controls -->
    <div class="feed-controls">
      <input
        v-model="searchQuery"
        placeholder="Search logs..."
        class="search-input"
        :style="{ background: theme.bgCard, border: `1px solid ${theme.border}`, color: theme.text }"
      />
      <button
        v-for="f in FILTERS"
        :key="f"
        class="filter-btn"
        :class="{ active: activeFilter === f }"
        @click="activeFilter = f"
      >
        {{ f }}
      </button>
      <span class="event-count">{{ filteredLogs.length }} events</span>
    </div>

    <!-- Log Table -->
    <div class="log-card" :style="{ background: theme.bgCard, border: `1px solid ${theme.border}` }">
      <!-- Header row -->
      <div class="log-header" :style="{ borderBottom: `1px solid ${theme.border}` }">
        <span class="col-time">TIME</span>
        <span class="col-sev">SEV</span>
        <span class="col-msg">MESSAGE</span>
      </div>

      <!-- Scrollable rows -->
      <div class="log-body" ref="logBodyRef">
        <div v-if="filteredLogs.length === 0" class="empty-state">
          No events match the current filter
        </div>
        <TransitionGroup name="log-row" tag="div">
          <div
            v-for="(log, i) in filteredLogs"
            :key="log.id"
            class="log-row"
            :style="{
              background: i % 2 === 0 ? 'transparent' : '#ffffff04',
              borderBottom: `1px solid ${theme.grid}`,
            }"
          >
            <span class="col-time log-ts">{{ log.ts }}</span>
            <span class="col-sev"><SeverityBadge :sev="log.sev" /></span>
            <span class="col-msg log-msg" :style="{ color: msgColor(log.sev) }">
              {{ log.msg }}
            </span>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SeverityBadge from '@/components/SeverityBadge.vue'
import { useDashboardStore } from '@/stores/dashboard'
import { theme } from '@/utils/theme'
import type { FeedFilter, SeverityLevel } from '@/types'

const store = useDashboardStore()
const FILTERS: FeedFilter[] = ['all', 'critical', 'warn', 'info']

const activeFilter = ref<FeedFilter>('all')
const searchQuery = ref('')
const logBodyRef = ref<HTMLElement | null>(null)

const filteredLogs = computed(() =>
  store.logs.filter((log) => {
    const matchesSev = activeFilter.value === 'all' || log.sev === activeFilter.value
    const matchesSearch =
      !searchQuery.value ||
      log.msg.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesSev && matchesSearch
  })
)

function msgColor(sev: SeverityLevel | string): string {
  if (sev === 'critical') return theme.red
  if (sev === 'warn') return theme.yellow
  return theme.textDim
}
</script>

<style scoped>
.feed-tab {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.feed-controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}
.search-input {
  border-radius: 7px;
  padding: 7px 12px;
  font-size: 12px;
  outline: none;
  font-family: 'Space Mono', monospace;
  width: 220px;
  transition: border-color 0.2s;
}
.search-input:focus {
  border-color: v-bind('theme.accent') !important;
}
.filter-btn {
  background: transparent;
  border: 1px solid v-bind('theme.border');
  color: v-bind('theme.textMuted');
  border-radius: 6px;
  padding: 5px 12px;
  font-size: 11px;
  cursor: pointer;
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  transition: all 0.15s;
}
.filter-btn:hover {
  background: rgba(255,255,255,0.04);
}
.filter-btn.active {
  background: v-bind('theme.accentGlow');
  border-color: v-bind('theme.accent');
  color: v-bind('theme.accent');
}
.event-count {
  margin-left: auto;
  font-size: 11px;
  color: v-bind('theme.textMuted');
  font-family: 'Space Mono', monospace;
}
.log-card {
  border-radius: 12px;
  overflow: hidden;
}
.log-header {
  display: grid;
  grid-template-columns: 80px 70px 1fr;
  padding: 10px 16px;
}
.col-time, .col-sev, .col-msg {
  font-size: 10px;
  color: v-bind('theme.textMuted');
  font-family: 'Space Mono', monospace;
  letter-spacing: 0.08em;
}
.log-body {
  max-height: 480px;
  overflow-y: auto;
}
.log-row {
  display: grid;
  grid-template-columns: 80px 70px 1fr;
  padding: 9px 16px;
  align-items: center;
}
.log-ts {
  font-size: 10px;
  color: v-bind('theme.textMuted');
  font-family: 'Space Mono', monospace;
}
.log-msg {
  font-size: 12px;
}
.empty-state {
  padding: 40px 16px;
  text-align: center;
  color: v-bind('theme.textMuted');
  font-size: 12px;
  font-family: 'Space Mono', monospace;
}

/* Row entrance animation */
.log-row-enter-active {
  transition: all 0.25s ease;
}
.log-row-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
.log-row-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
