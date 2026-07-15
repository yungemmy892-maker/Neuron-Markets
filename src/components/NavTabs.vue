<template>
  <nav class="nav-tabs">
    <button
      v-for="tab in TABS"
      :key="tab.name"
      class="tab-btn"
      :class="{ active: modelValue === tab.name }"
      @click="$emit('update:modelValue', tab.name)"
    >
      <span class="tab-icon">{{ tab.icon }}</span>
      {{ tab.name }}
    </button>
  </nav>
</template>

<script setup lang="ts">
import type { TabName } from '@/types'
import { theme } from '@/utils/theme'

defineProps<{ modelValue: TabName }>()
defineEmits<{ 'update:modelValue': [tab: TabName] }>()

const TABS: { name: TabName; icon: string }[] = [
  { name: 'overview', icon: '◱' },
  { name: 'assets', icon: '◎' },
  { name: 'liquidity', icon: '⬡' },
  { name: 'system', icon: '▤' },
  { name: 'feed', icon: '☰' },
]
</script>

<style scoped>
.nav-tabs {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid v-bind('theme.border');
  margin-bottom: 20px;
  overflow-x: auto;
}
.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: v-bind('theme.textMuted');
  padding: 8px 18px;
  font-size: 12px;
  cursor: pointer;
  font-family: 'Space Mono', monospace;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: all 0.15s;
  margin-bottom: -1px;
  white-space: nowrap;
}
.tab-icon {
  font-size: 13px;
}
.tab-btn:hover {
  background: rgba(255,255,255,0.04);
}
.tab-btn.active {
  background: v-bind('theme.accentGlow');
  border-bottom-color: v-bind('theme.accent');
  color: v-bind('theme.accent');
}
</style>
