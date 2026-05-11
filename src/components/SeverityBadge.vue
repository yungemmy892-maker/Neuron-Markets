<template>
  <span class="badge" :style="badgeStyle">{{ config.label }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { severityConfig } from '@/utils/theme'
import type { SeverityLevel } from '@/types'

const props = defineProps<{ sev: SeverityLevel | string }>()

const config = computed(() =>
  severityConfig[props.sev as SeverityLevel] ?? {
    bg: '#ffffff11',
    color: '#94a3b8',
    label: props.sev.toUpperCase().slice(0, 4),
  }
)

const badgeStyle = computed(() => ({
  background: config.value.bg,
  color: config.value.color,
}))
</script>

<style scoped>
.badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Space Mono', monospace;
  letter-spacing: 0.05em;
  white-space: nowrap;
}
</style>
