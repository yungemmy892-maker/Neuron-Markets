<template>
  <nav class="nav-tabs">
    <button
      v-for="tab in TABS"
      :key="tab"
      class="tab-btn"
      :class="{ active: modelValue === tab }"
      @click="$emit('update:modelValue', tab)"
    >
      {{ tab }}
    </button>
  </nav>
</template>

<script setup lang="ts">
import type { TabName } from '@/types'
import { theme } from '@/utils/theme'

defineProps<{ modelValue: TabName }>()
defineEmits<{ 'update:modelValue': [tab: TabName] }>()

const TABS: TabName[] = ['overview', 'assets', 'system', 'feed']
</script>

<style scoped>
.nav-tabs {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid v-bind('theme.border');
  margin-bottom: 20px;
}
.tab-btn {
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
