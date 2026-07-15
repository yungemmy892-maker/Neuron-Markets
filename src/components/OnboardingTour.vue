<template>
  <Teleport to="body">
    <Transition name="tour-fade">
      <div v-if="modelValue" class="tour-backdrop" @click.self="skip">
        <Transition name="tour-pop" mode="out-in">
          <div class="tour-card" :key="step">
            <div class="tour-icon" :style="{ background: current.color + '22', color: current.color }">
              {{ current.icon }}
            </div>

            <div class="tour-step-label">STEP {{ step + 1 }} OF {{ steps.length }}</div>
            <h3 class="tour-title">{{ current.title }}</h3>
            <p class="tour-desc">{{ current.desc }}</p>

            <div class="tour-dots">
              <span
                v-for="(s, i) in steps"
                :key="i"
                class="dot"
                :class="{ active: i === step }"
                @click="step = i"
              />
            </div>

            <div class="tour-actions">
              <button class="tour-skip" @click="skip">Skip tour</button>
              <div class="tour-nav">
                <button v-if="step > 0" class="tour-btn ghost" @click="step--">Back</button>
                <button class="tour-btn primary" @click="next">
                  {{ step === steps.length - 1 ? "Got it, let's go" : 'Next' }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { theme } from '@/utils/theme'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; finished: [] }>()

const step = ref(0)

const steps = [
  {
    icon: '👋',
    color: theme.accent,
    title: 'Welcome to NEURON MARKETS',
    desc: "This is a live-updating dashboard — prices, pools, and system metrics refresh automatically. Here's a 60-second tour of what everything does.",
  },
  {
    icon: '⏸',
    color: theme.green,
    title: 'Live status & controls',
    desc: 'The top-right of the header shows if the stream is LIVE or PAUSED. Use the 15s / 30s / 60s pills to change how much history your charts show, and PAUSE anytime to freeze the screen for a closer look.',
  },
  {
    icon: '☰',
    color: theme.purple,
    title: 'Five focused tabs',
    desc: 'Overview gives you the big picture. Assets compares every coin side by side. Liquidity lets you explore pools. System tracks platform health. Feed is a live log of market events.',
  },
  {
    icon: '◎',
    color: theme.accent,
    title: 'Switch between coins',
    desc: 'On the Overview and Assets tabs, click any coin — BTC, ETH, SOL, MATIC, ARB — to switch which one the price chart is tracking.',
  },
  {
    icon: '⬡',
    color: theme.purple,
    title: 'Switch between liquidity pools',
    desc: 'The new Liquidity tab lists multiple pools. Click a pool card to see its TVL trend, APY, 24h volume and utilization update instantly.',
  },
  {
    icon: '☰',
    color: theme.yellow,
    title: 'Search & filter the feed',
    desc: 'On the Feed tab, search by keyword or filter by severity (info, warn, critical) to zero in on the events you care about.',
  },
]

const current = computed(() => steps[step.value]!)

function next() {
  if (step.value < steps.length - 1) {
    step.value++
  } else {
    finish()
  }
}

function finish() {
  emit('update:modelValue', false)
  emit('finished')
}

function skip() {
  emit('update:modelValue', false)
  emit('finished')
}
</script>

<style scoped>
.tour-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(6, 8, 15, 0.72);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
}
.tour-card {
  width: 100%;
  max-width: 420px;
  background: v-bind('theme.bgCard');
  border: 1px solid v-bind('theme.borderGlow');
  border-radius: 16px;
  padding: 28px 26px 22px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
}
.tour-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 16px;
}
.tour-step-label {
  font-size: 10.5px;
  color: v-bind('theme.textMuted');
  font-family: 'Space Mono', monospace;
  letter-spacing: 0.1em;
  margin-bottom: 6px;
}
.tour-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
  color: v-bind('theme.text');
}
.tour-desc {
  font-size: 13.5px;
  line-height: 1.6;
  color: v-bind('theme.textDim');
  margin-bottom: 22px;
}
.tour-dots {
  display: flex;
  gap: 6px;
  margin-bottom: 22px;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: v-bind('theme.border');
  cursor: pointer;
  transition: background 0.15s, transform 0.15s;
}
.dot.active {
  background: v-bind('theme.accent');
  transform: scale(1.3);
}
.tour-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.tour-skip {
  background: none;
  border: none;
  color: v-bind('theme.textMuted');
  font-size: 12.5px;
  cursor: pointer;
  padding: 8px 0;
}
.tour-skip:hover {
  color: v-bind('theme.textDim');
}
.tour-nav {
  display: flex;
  gap: 8px;
}
.tour-btn {
  border-radius: 8px;
  padding: 9px 18px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
}
.tour-btn.ghost {
  background: transparent;
  border-color: v-bind('theme.border');
  color: v-bind('theme.text');
}
.tour-btn.ghost:hover {
  border-color: v-bind('theme.borderGlow');
}
.tour-btn.primary {
  background: v-bind('theme.accent');
  color: #06080f;
}
.tour-btn.primary:hover {
  filter: brightness(1.08);
}

/* Transitions */
.tour-fade-enter-active,
.tour-fade-leave-active {
  transition: opacity 0.2s ease;
}
.tour-fade-enter-from,
.tour-fade-leave-to {
  opacity: 0;
}
.tour-pop-enter-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}
.tour-pop-leave-active {
  transition: opacity 0.1s ease;
}
.tour-pop-enter-from {
  opacity: 0;
  transform: translateY(6px) scale(0.98);
}
.tour-pop-leave-to {
  opacity: 0;
}
</style>
