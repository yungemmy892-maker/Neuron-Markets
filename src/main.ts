import { createApp } from 'vue'
import { createPinia } from 'pinia'

// ECharts global registration
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import {
  LineChart,
  BarChart,
} from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
} from 'echarts/components'

import router from '@/router'
import App from './App.vue'
import './styles/global.css'

// Register ECharts modules tree-shakably
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
])

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('VChart', VChart)

app.mount('#app')
