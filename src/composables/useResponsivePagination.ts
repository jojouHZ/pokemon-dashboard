import { ref, watchEffect } from 'vue'
import { ITEMS_PER_PAGE } from '@/constants'
import { useBreakpoint, type Breakpoint } from './useBreakpoint'
import type { Ref } from 'vue'

interface UseResponsivePaginationReturn {
  itemsPerPage: Ref<number>
  currentBreakpoint: Ref<Breakpoint | undefined>
}

export function useResponsivePagination(): UseResponsivePaginationReturn {
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
