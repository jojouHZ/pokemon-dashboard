import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, computed, nextTick } from 'vue'
import { useResponsivePagination } from '@/composables/useResponsivePagination'
import { ITEMS_PER_PAGE } from '@/constants'
import type { Breakpoint } from '@/composables/useBreakpoint'

const currentBreakpointRef = ref<Breakpoint>('desktop')

vi.mock('@/composables/useBreakpoint', () => {
  return {
    useBreakpoint: () => ({
      // ComputedRef<Breakpoint>
      type: computed(() => currentBreakpointRef.value),
    }),
  }
})

describe('useResponsivePagination', () => {
  beforeEach(() => {
    currentBreakpointRef.value = 'desktop'
  })

  it('returns 24 items for desktop breakpoint', () => {
    const { itemsPerPage, currentBreakpoint } = useResponsivePagination()

    expect(currentBreakpoint.value).toBe('desktop')
    expect(itemsPerPage.value).toBe(ITEMS_PER_PAGE.DESKTOP) // 24
  })
  it('returns 18 items for tablet breakpoint', () => {
    currentBreakpointRef.value = 'tablet'

    const { itemsPerPage, currentBreakpoint } = useResponsivePagination()

    expect(currentBreakpoint.value).toBe('tablet')
    expect(itemsPerPage.value).toBe(ITEMS_PER_PAGE.TABLET) // 18
  })

  it('returns 12 items for mobile breakpoint', () => {
    currentBreakpointRef.value = 'mobile'

    const { itemsPerPage, currentBreakpoint } = useResponsivePagination()

    expect(currentBreakpoint.value).toBe('mobile')
    expect(itemsPerPage.value).toBe(ITEMS_PER_PAGE.MOBILE) // 12
  })

  it('updates itemsPerPage when breakpoint changes', async () => {
    const { itemsPerPage, currentBreakpoint } = useResponsivePagination()

    expect(currentBreakpoint.value).toBe('desktop')
    expect(itemsPerPage.value).toBe(ITEMS_PER_PAGE.DESKTOP)

    currentBreakpointRef.value = 'tablet'
    await nextTick()

    expect(currentBreakpoint.value).toBe('tablet')
    expect(itemsPerPage.value).toBe(ITEMS_PER_PAGE.TABLET)

    currentBreakpointRef.value = 'mobile'
    await nextTick()

    expect(currentBreakpoint.value).toBe('mobile')
    expect(itemsPerPage.value).toBe(ITEMS_PER_PAGE.MOBILE)
  })
})
