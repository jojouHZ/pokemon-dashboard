import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Options for infinite scroll behavior
 */
interface UseInfiniteScrollOptions {
  /** Distance from bottom of page to trigger load (in pixels, default: 300) */
  threshold?: number
  /** Callback to execute when threshold is reached */
  onLoadMore: () => void | Promise<void>
  /** Whether infinite scroll is enabled (default: true) */
  enabled?: boolean
}

/**
 * Composable for implementing infinite scroll functionality
 * Automatically triggers data loading when user scrolls near the bottom of the page
 *
 * @example
 * const { isLoading } = useInfiniteScroll({
 *   threshold: 300,
 *   onLoadMore: async () => {
 *     await store.loadNextPage()
 *   },
 *   enabled: breakpoint.value !== 'desktop'
 * })
 */
export function useInfiniteScroll(options: UseInfiniteScrollOptions) {
  const { threshold = 300, onLoadMore, enabled = true } = options

  const isLoading = ref(false)

  const handleScroll = async () => {
    if (!enabled || isLoading.value) return

    const scrollTop = window.scrollY
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    const distanceFromBottom = documentHeight - (scrollTop + windowHeight)

    if (distanceFromBottom < threshold) {
      isLoading.value = true
      try {
        await onLoadMore()
      } catch (error) {
        console.error('Error loading more items:', error)
      } finally {
        isLoading.value = false
      }
    }
  }

  onMounted(() => {
    if (enabled) {
      window.addEventListener('scroll', handleScroll, { passive: true })
    }
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    isLoading,
  }
}
