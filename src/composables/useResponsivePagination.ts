import { ref, watchEffect } from 'vue'
import { ITEMS_PER_PAGE } from '@/constants'
import { useBreakpoint } from './useBreakpoint'

/**
 * Composable for responsive pagination
 * @returns refreshes itemsPerPage and current screen type
 */
export function useResponsivePagination() {
  const itemsPerPage = ref<number>(ITEMS_PER_PAGE.DEFAULT)
  const currentBreakpoint = useBreakpoint().type

  watchEffect(() => {
    if (currentBreakpoint.value === 'desktop') {
      itemsPerPage.value = ITEMS_PER_PAGE.DESKTOP
    } else if (currentBreakpoint.value === 'tablet') {
      itemsPerPage.value = ITEMS_PER_PAGE.TABLET
    } else {
      itemsPerPage.value = ITEMS_PER_PAGE.MOBILE
    }
  })

  return {
    itemsPerPage,
    currentBreakpoint,
  }
}
