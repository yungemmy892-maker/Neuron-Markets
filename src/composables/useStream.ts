import { onMounted, onUnmounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'

/**
 * Composable that starts the data stream on mount and cleans up on unmount.
 * Use this once at the root Dashboard component level.
 */
export function useStream() {
  const store = useDashboardStore()

  onMounted(() => {
    store.startStream()
  })

  onUnmounted(() => {
    store.stopStream()
  })

  return { store }
}
