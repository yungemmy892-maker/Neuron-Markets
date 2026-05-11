# ⚡ NEURON MARKETS — Real-Time Data Visualization Platform

A production-grade real-time analytics dashboard built with **Vue 3**, **TypeScript**, **Pinia**, and **ECharts**. Simulates a live crypto/financial monitoring terminal with streaming data, interactive charts, and a polished dark UI.

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Install & Run

```bash
# Install dependencies
npm install

# Start dev server (opens at http://localhost:5173)
npm run dev

# Type-check
npm run type-check

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 🗂 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AppHeader.vue    # Sticky header: brand, status, controls
│   ├── AppFooter.vue    # Footer: tick/window stats
│   ├── ChartCard.vue    # Generic chart container card
│   ├── MetricCard.vue   # KPI metric card with delta indicator
│   ├── NavTabs.vue      # Tab navigation bar
│   └── SeverityBadge.vue# Colored severity pill
│
├── composables/         # Reusable Vue composition logic
│   ├── useStream.ts     # Lifecycle-aware stream start/stop
│   └── useChartOptions.ts # ECharts option builders (pure computed)
│
├── stores/
│   └── dashboard.ts     # Pinia store: all state + derived data
│
├── types/
│   └── index.ts         # TypeScript interfaces and types
│
├── utils/
│   ├── dataGenerator.ts # Tick generator, seed, validator
│   └── theme.ts         # Design tokens, asset colors, severity config
│
├── views/
│   ├── Dashboard.vue    # Root layout: header + tabs + footer
│   ├── OverviewTab.vue  # Metric cards + area chart + bar chart
│   ├── AssetsTab.vue    # Multi-line chart + sparkline asset cards
│   ├── SystemTab.vue    # Latency / throughput / error rate charts
│   └── FeedTab.vue      # Live activity feed with search + filter
│
├── router/
│   └── index.ts         # Vue Router config
│
├── styles/
│   └── global.css       # Reset, scrollbar, animations
│
├── App.vue              # Root shell
├── main.ts              # App bootstrap
└── env.d.ts             # Vite/Vue type declarations
```

---

## 🏛 Architecture

### Component Philosophy
- **Single responsibility**: each component does exactly one thing
- **Presentational vs Smart**: `ChartCard`, `MetricCard`, `SeverityBadge` are pure presentational. Views (`OverviewTab`, etc.) are smart and connect to the store
- **Composables** encapsulate reusable logic: `useStream` handles lifecycle, `useChartOptions` builds ECharts config as pure `computed()` refs

### Data Flow
```
dataGenerator.ts (generateTick)
        ↓
dashboard.ts (Pinia store — setInterval)
        ↓
Computed properties (priceChartData, metricsChartData, etc.)
        ↓
View components (read-only reactive bindings)
        ↓
ECharts (vue-echarts) — option prop updates re-render chart
```

---

## 📦 State Management

**Pinia** (`src/stores/dashboard.ts`) is the single source of truth:

| State | Type | Description |
|-------|------|-------------|
| `history` | `DataTick[]` | Sliding window of raw ticks |
| `logs` | `LogEntry[]` | Last 100 log entries |
| `paused` | `boolean` | Stream pause state |
| `timeWindow` | `15 \| 30 \| 60` | Visible tick count |
| `selectedAsset` | `string` | Active asset for price chart |

All chart-ready data is derived via `computed()`:
- `priceChartData` — flattened `{ ts, BTC, ETH, ... }[]`
- `metricsChartData` — `{ ts, latency, throughput, errorRate }[]`
- `selectedAssetDelta` — % change over last 2 ticks
- `windowedHistory` — sliced to `timeWindow`

---

## 🎯 Rendering Optimization

| Technique | Where applied |
|-----------|---------------|
| `animation: false` on all ECharts | Eliminates re-render jank on frequent updates |
| `computed()` for all derived data | Vue only re-evaluates when dependencies change |
| History capped at `timeWindow * 2` | Prevents unbounded memory growth |
| `isAnimationActive={false}` | All chart series |
| `autoresize` on vue-echarts | ResizeObserver-based; no polling |
| `TransitionGroup` on log rows | GPU-composited CSS transforms only |
| `clearInterval` on unmount | Zero memory leaks |
| Pinia action batches state | One reactive update per tick |

---

## 📡 Data Streaming Approach

**Mocked streaming generator** (`src/utils/dataGenerator.ts`):
- `setInterval` at 800ms in the Pinia store
- `generateTick(prev)` uses Gaussian-like random walk per asset
- Price drift is relative (`± 0.25–0.5% per tick`) to simulate realistic volatility
- System metrics (latency, throughput, error rate) are independently randomized
- Log events are randomly selected from a 20-entry catalog with severity levels

To switch to **real WebSockets**, replace the `setInterval` in `startStream()` with:
```ts
const ws = new WebSocket('wss://your-feed-url')
ws.onmessage = (e) => {
  const tick = validateTick(JSON.parse(e.data))
  if (tick) { history.value = [...history.value.slice(-timeWindow.value * 2), tick] }
}
```
`validateTick()` is already implemented to sanitize incoming data.

---

## ⚖️ Trade-offs

| Decision | Reason |
|----------|--------|
| ECharts over D3 | Much simpler Vue integration via `vue-echarts`; handles canvas efficiently |
| Mocked stream over WebSocket | Self-contained demo; trivially swappable |
| Pinia over Vuex | Simpler API, full TypeScript inference, Vue 3-native |
| CSS `v-bind()` for theme | Keeps design tokens in TS, applied via CSS vars per component |
| History capped (not virtualized) | Dataset stays small enough; virtualization added complexity for no gain |
| No Web Workers | Tick generation is O(n) lightweight; workers would add IPC overhead |

---

## ✅ Features Checklist

- [x] Real-time streaming (mocked, 800ms interval)
- [x] Line chart (Assets tab)
- [x] Area chart (Overview + System tabs)
- [x] Bar chart (Overview volume chart)
- [x] Sparkline mini-charts (Assets tab)
- [x] Real-time metric cards
- [x] Live activity feed with timestamps
- [x] Pause / resume streaming
- [x] Time window selector (15s / 30s / 60s)
- [x] Asset selector + per-asset price delta
- [x] Log search and severity filter
- [x] Smooth chart updates (no flicker)
- [x] Responsive layout (flex-wrap)
- [x] No memory leaks (interval cleanup on unmount)
- [x] Data validation (`validateTick`)
- [x] TypeScript throughout
- [x] Pinia centralized state
- [x] Modular folder structure
- [x] Dark mode (only mode — matches brief aesthetic)

---

## 🛠 Tech Stack

| Layer | Library |
|-------|---------|
| Framework | Vue 3 (Composition API) |
| Language | TypeScript |
| State | Pinia 2 |
| Routing | Vue Router 4 |
| Charts | ECharts 5 + vue-echarts 6 |
| Build | Vite 5 |
| Fonts | Space Mono, DM Sans (Google Fonts) |
