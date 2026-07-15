<template>
  <div class="home" :style="{ background: theme.bg }">
    <!-- Ambient background glow -->
    <div class="bg-glow bg-glow-1" />
    <div class="bg-glow bg-glow-2" />
    <div class="bg-grid" />

    <!-- Top bar -->
    <header class="home-header">
      <div class="brand-row">
        <div class="logo-icon">⚡</div>
        <span class="brand">NEURON</span>
        <span class="brand-sub">/ MARKETS</span>
      </div>
      <button class="ghost-btn" @click="enterDashboard">
        Launch Dashboard <span class="arrow">→</span>
      </button>
    </header>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-badge">
        <span class="dot" /> Live simulated market data · updates every 800ms
      </div>
      <h1 class="hero-title">
        Real-time markets,<br />
        <span class="gradient-text">read at a glance.</span>
      </h1>
      <p class="hero-sub">
        Track prices across five assets, monitor liquidity pools, watch system health,
        and follow the live event feed — all in one fast, focused dashboard.
      </p>
      <div class="hero-actions">
        <button class="cta-btn" @click="enterDashboard">
          {{ isReturning ? 'Back to Dashboard' : 'Launch Dashboard' }}
        </button>
        <span class="hero-hint" v-if="!isReturning">No sign-up needed — it's a live demo</span>
        <span class="hero-hint" v-else>Welcome back — your tour is saved</span>
      </div>

      <!-- Ticker strip -->
      <div class="ticker-wrap">
        <div class="ticker-track">
          <span v-for="(a, i) in tickerAssets.concat(tickerAssets)" :key="i" class="ticker-item">
            <b :style="{ color: assetColors[a.symbol] }">{{ a.symbol.split('/')[0] }}</b>
            <span class="ticker-price">${{ a.price }}</span>
            <span class="ticker-delta" :style="{ color: a.up ? theme.green : theme.red }">
              {{ a.up ? '▲' : '▼' }} {{ a.delta }}%
            </span>
          </span>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features">
      <h2 class="section-title">Everything you need in one view</h2>
      <p class="section-sub">
        First time here? The dashboard walks you through each of these the moment you arrive.
      </p>

      <div class="feature-grid">
        <div v-for="f in features" :key="f.title" class="feature-card">
          <div class="feature-icon" :style="{ background: f.color + '22', color: f.color }">{{ f.icon }}</div>
          <h3 class="feature-title">{{ f.title }}</h3>
          <p class="feature-desc">{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Secondary CTA -->
    <section class="bottom-cta">
      <div class="bottom-cta-card">
        <div>
          <h3>Ready to see it live?</h3>
          <p>Jump into the dashboard — a quick guided tour will point out what everything does.</p>
        </div>
        <button class="cta-btn" @click="enterDashboard">Launch Dashboard</button>
      </div>
    </section>

    <footer class="home-footer">
      <span>NEURON MARKETS · REAL-TIME ANALYTICS DEMO</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { theme, assetColors } from '@/utils/theme'
import { BASE_PRICES, ASSETS } from '@/utils/dataGenerator'
import { ONBOARDING_KEY } from '@/utils/onboarding'

const router = useRouter()

const isReturning = ref(typeof localStorage !== 'undefined' && !!localStorage.getItem(ONBOARDING_KEY))

function enterDashboard() {
  router.push('/dashboard')
}

const tickerAssets = ASSETS.map((symbol, i) => {
  const price = BASE_PRICES[symbol]
  const up = i % 2 === 0
  return {
    symbol,
    price: price >= 1000 ? price.toLocaleString(undefined, { maximumFractionDigits: 0 }) : price.toFixed(3),
    up,
    delta: (Math.random() * 2.2 + 0.1).toFixed(2),
  }
})

const features = [
  {
    icon: '◎',
    color: theme.accent,
    title: 'Multi-Asset Price Feed',
    desc: 'Switch between BTC, ETH, SOL, MATIC and ARB instantly and watch live price charts update in real time.',
  },
  {
    icon: '⬡',
    color: theme.purple,
    title: 'Liquidity Pools',
    desc: 'Browse multiple liquidity pools, compare TVL and APY, and switch which pool you\'re tracking with one click.',
  },
  {
    icon: '▤',
    color: theme.green,
    title: 'System Health',
    desc: 'Keep an eye on latency, throughput and error rate so you always know the platform is running smoothly.',
  },
  {
    icon: '☰',
    color: theme.yellow,
    title: 'Live Event Feed',
    desc: 'A searchable, filterable stream of market events — from whale alerts to liquidations — as they happen.',
  },
  {
    icon: '⏱',
    color: theme.red,
    title: 'Adjustable Time Window',
    desc: 'Zoom your charts to the last 15, 30 or 60 seconds of activity to focus on exactly what matters right now.',
  },
  {
    icon: '⏸',
    color: theme.accent,
    title: 'Pause Anytime',
    desc: 'Freeze the live stream whenever you need a closer look, then resume right where you left off.',
  },
]
</script>

<style scoped>
.home {
  min-height: 100vh;
  color: v-bind('theme.text');
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* Ambient background */
.bg-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
  z-index: 0;
}
.bg-glow-1 {
  width: 480px;
  height: 480px;
  top: -160px;
  left: -120px;
  background: v-bind('theme.accent + "22"');
}
.bg-glow-2 {
  width: 420px;
  height: 420px;
  top: 120px;
  right: -140px;
  background: v-bind('theme.purple + "22"');
}
.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(v-bind('theme.grid') 1px, transparent 1px),
    linear-gradient(90deg, v-bind('theme.grid') 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 65%);
  pointer-events: none;
  z-index: 0;
}

.home-header,
.hero,
.features,
.bottom-cta,
.home-footer {
  position: relative;
  z-index: 1;
}

/* Header */
.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px;
}
.brand-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: linear-gradient(135deg, v-bind('theme.accent'), v-bind('theme.purple'));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 800;
  flex-shrink: 0;
}
.brand {
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 0.02em;
}
.brand-sub {
  color: v-bind('theme.textMuted');
  font-size: 13px;
  letter-spacing: 0.05em;
}
.ghost-btn {
  background: transparent;
  border: 1px solid v-bind('theme.border');
  color: v-bind('theme.text');
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}
.ghost-btn:hover {
  border-color: v-bind('theme.accent');
  color: v-bind('theme.accent');
  background: v-bind('theme.accentGlow');
}
.arrow {
  transition: transform 0.15s;
}
.ghost-btn:hover .arrow {
  transform: translateX(2px);
}

/* Hero */
.hero {
  max-width: 780px;
  margin: 0 auto;
  padding: 64px 24px 40px;
  text-align: center;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid v-bind('theme.border');
  background: v-bind('theme.bgCard + "aa"');
  color: v-bind('theme.textDim');
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 11.5px;
  font-family: 'Space Mono', monospace;
  margin-bottom: 28px;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: v-bind('theme.green');
  box-shadow: 0 0 6px v-bind('theme.green');
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.hero-title {
  font-size: 46px;
  line-height: 1.15;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 20px;
}
.gradient-text {
  background: linear-gradient(90deg, v-bind('theme.accent'), v-bind('theme.purple'));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.hero-sub {
  color: v-bind('theme.textDim');
  font-size: 16px;
  line-height: 1.6;
  max-width: 560px;
  margin: 0 auto 32px;
}
.hero-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 52px;
}
.cta-btn {
  background: linear-gradient(90deg, v-bind('theme.accent'), v-bind('theme.purple'));
  border: none;
  color: #06080f;
  font-weight: 700;
  font-size: 15px;
  padding: 13px 30px;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 8px 24px v-bind('theme.accent + "33"');
  transition: transform 0.15s, box-shadow 0.15s;
}
.cta-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 28px v-bind('theme.accent + "44"');
}
.hero-hint {
  font-size: 12px;
  color: v-bind('theme.textMuted');
  font-family: 'Space Mono', monospace;
}

/* Ticker */
.ticker-wrap {
  overflow: hidden;
  border: 1px solid v-bind('theme.border');
  background: v-bind('theme.bgCard + "aa"');
  border-radius: 12px;
  padding: 14px 0;
  mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
}
.ticker-track {
  display: flex;
  width: max-content;
  gap: 36px;
  animation: scroll-ticker 22s linear infinite;
}
@keyframes scroll-ticker {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.ticker-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  white-space: nowrap;
}
.ticker-price {
  color: v-bind('theme.text');
}
.ticker-delta {
  font-size: 11px;
}

/* Features */
.features {
  max-width: 1080px;
  margin: 0 auto;
  padding: 40px 24px 20px;
  text-align: center;
}
.section-title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 8px;
}
.section-sub {
  color: v-bind('theme.textMuted');
  font-size: 14px;
  margin-bottom: 36px;
}
.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  text-align: left;
}
.feature-card {
  background: v-bind('theme.bgCard');
  border: 1px solid v-bind('theme.border');
  border-radius: 14px;
  padding: 22px;
  transition: border-color 0.2s, transform 0.2s;
}
.feature-card:hover {
  border-color: v-bind('theme.borderGlow');
  transform: translateY(-2px);
}
.feature-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-bottom: 14px;
}
.feature-title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 8px;
}
.feature-desc {
  font-size: 13px;
  color: v-bind('theme.textMuted');
  line-height: 1.55;
}

/* Bottom CTA */
.bottom-cta {
  max-width: 1080px;
  margin: 24px auto 0;
  padding: 0 24px 64px;
}
.bottom-cta-card {
  background: linear-gradient(135deg, v-bind('theme.bgCard'), v-bind('theme.bgCardHover'));
  border: 1px solid v-bind('theme.border');
  border-radius: 16px;
  padding: 32px 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}
.bottom-cta-card h3 {
  font-size: 19px;
  margin-bottom: 6px;
}
.bottom-cta-card p {
  color: v-bind('theme.textMuted');
  font-size: 13.5px;
  max-width: 420px;
}

.home-footer {
  text-align: center;
  padding: 20px 24px 32px;
  font-size: 10.5px;
  color: v-bind('theme.textMuted');
  font-family: 'Space Mono', monospace;
  border-top: 1px solid v-bind('theme.border');
}

/* Responsive */
@media (max-width: 860px) {
  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .hero-title {
    font-size: 36px;
  }
}
@media (max-width: 560px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }
  .hero-title {
    font-size: 30px;
  }
  .hero-sub {
    font-size: 14.5px;
  }
  .home-header {
    padding: 16px;
  }
  .bottom-cta-card {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
