<template>
  <div class="dashboard" :style="{ background: theme.bg }">
    <AppHeader @restart-tour="openTour" />

    <div class="dashboard-body">
      <NavTabs v-model="activeTab" />

      <Transition name="tab-fade" mode="out-in">
        <OverviewTab  v-if="activeTab === 'overview'"  key="overview" />
        <AssetsTab    v-else-if="activeTab === 'assets'"    key="assets" />
        <LiquidityTab v-else-if="activeTab === 'liquidity'" key="liquidity" />
        <SystemTab    v-else-if="activeTab === 'system'"    key="system" />
        <FeedTab      v-else-if="activeTab === 'feed'"      key="feed" />
      </Transition>

      <AppFooter />
    </div>

    <OnboardingTour v-model="showTour" @finished="onTourFinished" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppHeader   from '@/components/AppHeader.vue'
import NavTabs     from '@/components/NavTabs.vue'
import AppFooter   from '@/components/AppFooter.vue'
import OnboardingTour from '@/components/OnboardingTour.vue'
import OverviewTab  from '@/views/OverviewTab.vue'
import AssetsTab    from '@/views/AssetsTab.vue'
import LiquidityTab from '@/views/LiquidityTab.vue'
import SystemTab    from '@/views/SystemTab.vue'
import FeedTab       from '@/views/FeedTab.vue'
import { useStream } from '@/composables/useStream'
import { theme } from '@/utils/theme'
import type { TabName } from '@/types'
import { hasCompletedOnboarding, markOnboardingComplete } from '@/utils/onboarding'

const activeTab = ref<TabName>('overview')
const showTour = ref(false)

// Start/stop the data stream with lifecycle awareness
useStream()

onMounted(() => {
  if (!hasCompletedOnboarding()) {
    // Slight delay so the dashboard renders behind the tour first
    setTimeout(() => { showTour.value = true }, 350)
  }
})

function openTour() {
  showTour.value = true
}

function onTourFinished() {
  markOnboardingComplete()
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  color: v-bind('theme.text');
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
  padding-bottom: 40px;
}
.dashboard-body {
  padding: 20px 24px 0;
}

/* Tab transition */
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
