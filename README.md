# ⚡ NEURON MARKETS — Real-Time Data Visualization Platform

A polished Vue 3 + TypeScript analytics experience for tracking simulated crypto and DeFi market activity in real time. The app now includes a launch landing page, a guided onboarding tour, a dedicated liquidity tab, and a multi-view dashboard that feels closer to a live trading terminal.

---

## ✨ What’s New

- A branded home screen with a CTA to enter the live dashboard
- A guided onboarding tour that appears on first visit and can be replayed from the header
- A new liquidity workspace for comparing pools, TVL trends, APY, and utilization
- A sticky dashboard header with live/pause state, time-window controls, and tour access
- A tabbed layout for Overview, Assets, Liquidity, System, and Feed views

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run

```bash
npm install
npm run dev
```

Other useful commands:

```bash
npm run type-check
npm run build
npm run preview
```

---

## 🗂 Project Structure

```text
src/
├── components/
│   ├── AppHeader.vue         # Sticky header with stream controls and tour replay
│   ├── AppFooter.vue         # Footer summary and live status info
│   ├── ChartCard.vue         # Generic chart container card
│   ├── MetricCard.vue        # KPI card with delta styling
│   ├── NavTabs.vue           # Main dashboard tab navigation
│   ├── OnboardingTour.vue    # Guided tour overlay for new users
│   └── SeverityBadge.vue    # Severity pill for feed entries
├── composables/
│   ├── useStream.ts          # Stream lifecycle helper
│   └── useChartoptions.ts    # ECharts option builders used by the dashboard views
├── router/
│   └── index.ts              # Route setup for home and dashboard views
├── stores/
│   └── dashboard.ts          # Pinia store for stream state, derived charts, and pool data
├── types/
│   └── index.ts              # Shared TypeScript interfaces and route/tab types
├── utils/
│   ├── dataGenerator.ts      # Simulated tick generation and seeded data
│   ├── onboarding.ts         # LocalStorage helpers for the onboarding tour
│   └── theme.ts              # Dark theme tokens and palette configuration
├── views/
│   ├── Dashboard.vue         # Root dashboard layout and tab switching
│   ├── Home.vue              # Landing experience and feature overview
│   ├── LiquidityTab.vue      # Pool comparison and TVL trend details
│   ├── OverviewTab.vue       # Overview charts and KPI cards
│   ├── AssetsTab.vue         # Multi-asset price charts and sparkline cards
│   ├── SystemTab.vue         # Latency, throughput, and error-rate views
│   └── FeedTab.vue           # Searchable live activity feed
└── main.ts                   # App bootstrap
```

---

## 🏛 Architecture Overview

The dashboard uses a thin, reactive data flow:

```text
dataGenerator.ts
  ↓
dashboard.ts (Pinia)
  ↓
computed chart/state selectors
  ↓
view components (Overview, Assets, Liquidity, System, Feed)
  ↓
ECharts + Vue rendering
```

Key ideas:
- Pinia keeps the stream state and derived data in one place
- Composables build chart options separately from the UI layer
- The app stays lightweight by using a simulated stream instead of a live backend

---

## 📡 Data Model

The store consumes a simulated tick stream every 800ms and derives:
- price history for BTC, ETH, SOL, MATIC, and ARB
- system health metrics such as latency and error rate
- pool-level TVL, APY, and utilization snapshots
- live log events for the feed view

The generator can be swapped for a real WebSocket feed later without changing the rest of the UI layer.

---

## ✅ Feature Checklist

- [x] Simulated live market stream
- [x] Multi-tab dashboard experience
- [x] Landing page and launch flow
- [x] Guided onboarding tour
- [x] Liquidity pool comparison view
- [x] Price charts for multiple assets
- [x] System health charts
- [x] Live event feed with search/filter support
- [x] Pause/resume controls and time-window selection
- [x] Responsive, dark UI styling
- [x] Type-safe Vue + TypeScript implementation

---

## 🛠 Tech Stack

| Layer | Tooling |
|-------|---------|
| Framework | Vue 3 + Composition API |
| Language | TypeScript |
| State | Pinia |
| Routing | Vue Router |
| Charts | ECharts + vue-echarts |
| Build | Vite |
| Styling | CSS variables + scoped styles |
