import { ref, onMounted, onUnmounted } from 'vue'

interface UseScrollDirectionOptions {
  /** Threshold in pixels to trigger direction change */
  threshold?: number
}

/**
 * Composable to detect scroll direction and position
 * Returns whether scrolling down and current scroll position
 */
export function useScrollDirection(options: UseScrollDirectionOptions = {}) {
  const { threshold = 10 } = options

  const isScrollingDown = ref(false)
  const scrollY = ref(0)
  const isAtTop = ref(true)

  let lastScrollY = 0
  let ticking = false

  const updateScrollDirection = () => {
    const currentScrollY = window.scrollY

    // Check if at top
    isAtTop.value = currentScrollY < 10

    // Only update direction if scrolled more than threshold
    if (Math.abs(currentScrollY - lastScrollY) < threshold) {
      ticking = false
      return
    }

    isScrollingDown.value = currentScrollY > lastScrollY && currentScrollY > 100
    lastScrollY = currentScrollY
    scrollY.value = currentScrollY
    ticking = false
  }

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollDirection)
      ticking = true
    }
  }

  onMounted(() => {
    lastScrollY = window.scrollY
    scrollY.value = window.scrollY
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return {
    /** True if scrolling down, false if scrolling up */
    isScrollingDown,
    /** Current scroll Y position */
    scrollY,
    /** True if at the top of the page */
    isAtTop,
  }
}
