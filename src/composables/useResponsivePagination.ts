import { ref, watchEffect } from 'vue'
import type { Ref } from 'vue'
import { ITEMS_PER_PAGE } from '@/constants'
import { useBreakpoint } from './useBreakpoint'

/**
 * Composable for responsive pagination
 * @returns itemsPerPage and currentBreakpoint (screen type)
 */
export function useResponsivePagination() {
  type Breakpoint = 'desktop' | 'tablet' | 'mobile'

  const currentBreakpoint = useBreakpoint().type as Ref<Breakpoint | undefined>
  const getItemsForBreakpoint = (breakpoint: Breakpoint | undefined) => {
    switch (breakpoint) {
      case 'desktop':
        return ITEMS_PER_PAGE.DESKTOP
      case 'tablet':
        return ITEMS_PER_PAGE.TABLET
      case 'mobile':
        return ITEMS_PER_PAGE.MOBILE
      default:
        console.warn(
          `[useResponsivePagination] Invalid breakpoint: "${breakpoint}". Using DEFAULT.`,
        )
        return ITEMS_PER_PAGE.DEFAULT
    }
  }

  const itemsPerPage = ref<number>(getItemsForBreakpoint(currentBreakpoint.value))

  watchEffect(() => {
    itemsPerPage.value = getItemsForBreakpoint(currentBreakpoint.value)
  })

  return {
    itemsPerPage,
    currentBreakpoint,
  }
}
