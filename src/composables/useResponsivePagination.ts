import { ref, watchEffect } from 'vue'
import { ITEMS_PER_PAGE } from '@/constants'
import { useBreakpoint, type Breakpoint } from './useBreakpoint'
import type { ComputedRef, Ref } from 'vue'

interface UseResponsivePaginationReturn {
  itemsPerPage: Ref<number>
  currentBreakpoint: ComputedRef<Breakpoint>
}

export function useResponsivePagination(): UseResponsivePaginationReturn {
  const { type: currentBreakpoint } = useBreakpoint()
  const getItemsForBreakpoint = (breakpoint: Breakpoint) => {
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
