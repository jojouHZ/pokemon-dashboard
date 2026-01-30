import { ref, computed, onMounted, onUnmounted } from 'vue'
import { PAGINATION_BREAKPOINTS, DEBOUNCE_DELAYS } from '@/constants'
import { useDebounceFn } from './useDebounce'

/**
 * Global state width - shared between all components
 * Uses single listener for whole App
 */
const width = ref<number>(
  typeof window !== 'undefined' ? window.innerWidth : PAGINATION_BREAKPOINTS.DESKTOP,
)
let listenerCount = 0

const updateWidth = () => {
  width.value = window.innerWidth
}

const debouncedUpdate = useDebounceFn(updateWidth, DEBOUNCE_DELAYS.RESIZE)

/**
 * Composable for definition of current breakpoint for pagination
 * @returns screen width (px), screen type <'desktop' | 'tablet' | 'mobile'>
 */
export const useBreakpoint = () => {
  const type = computed(() => {
    if (width.value >= PAGINATION_BREAKPOINTS.DESKTOP) return 'desktop' as const
    if (width.value >= PAGINATION_BREAKPOINTS.TABLET) return 'tablet' as const
    return 'mobile' as const
  })

  onMounted(() => {
    if (listenerCount === 0) {
      updateWidth() // initial
      window.addEventListener('resize', debouncedUpdate)
    }
    listenerCount++
  })

  onUnmounted(() => {
    listenerCount--
    if (listenerCount === 0) {
      window.removeEventListener('resize', debouncedUpdate)
    }
  })

  return {
    width,
    type,
  }
}
