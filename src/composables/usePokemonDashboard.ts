import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePokemonStore } from '@/stores/pokemonStore'
import { usePokemonListStore } from '@/stores/pokemonListStore'
import { usePokemonFilters } from './usePokemonFilters'
import { useResponsivePagination } from './useResponsivePagination'
import { useBreakpoint } from './useBreakpoint'
import { useInfiniteScroll } from './useInfiniteScroll'
import { useScrollDirection } from './useScrollDirection'
import type { PokemonListItem } from '@/types/pokemon/list'

/**
 * Main composable for Pokemon Dashboard page
 * Orchestrates all dashboard logic: filtering, pagination, infinite scroll, header visibility
 */
export function usePokemonDashboard() {
  // ====== Stores ======
  const router = useRouter()
  const store = usePokemonStore()
  const listStore = usePokemonListStore()

  // ====== Composables ======
  const { searchQuery, selectedType, totalResults, setSearchQuery, setSelectedType, clearFilters } =
    usePokemonFilters()
  const { itemsPerPage } = useResponsivePagination()
  const { type: breakpoint } = useBreakpoint()
  const { isScrollingDown, isAtTop } = useScrollDirection({ threshold: 10 })

  // ====== Display Mode ======
  const usePagination = computed(() => breakpoint.value === 'desktop')
  const useInfinite = computed(() => breakpoint.value !== 'desktop')

  // ====== Header Visibility ======
  const headerIsSticky = computed(() => breakpoint.value !== 'desktop')
  const headerIsHidden = computed(() => {
    if (breakpoint.value === 'desktop') return false
    return !isAtTop.value && isScrollingDown.value
  })

  // ====== Initialize Pagination ======
  // Set initial items per page and reset infinite scroll
  listStore.setItemsPerPage(itemsPerPage.value)
  listStore.resetInfiniteScroll()

  // Watch for breakpoint changes and update pagination
  watch(
    itemsPerPage,
    (newValue) => {
      listStore.setItemsPerPage(newValue)
      listStore.resetInfiniteScroll()
    },
    { immediate: true },
  )

  // ====== Infinite Scroll ======
  useInfiniteScroll({
    threshold: 300,
    enabled: useInfinite.value,
    onLoadMore: () => {
      if (listStore.hasMore) {
        listStore.loadNextPage()
      }
    },
  })

  // ====== Displayed Pokemon ======
  const displayedPokemon = computed(() => {
    if (usePagination.value) {
      return listStore.displayedPokemon
    } else {
      const filtered = listStore.filteredPokemon
      return filtered.slice(0, listStore.loadedCount)
    }
  })

  // ====== Event Handlers ======
  const handleRetry = () => {
    listStore.loadPokemonList()
  }

  const handleSelectPokemon = (pokemon: PokemonListItem) => {
    router.push(`/pokemon/${pokemon.name}`)
  }

  // ====== Computed ======
  const totalPokemonCount = computed(() => store.totalPokemonCount)

  return {
    // State
    searchQuery,
    selectedType,
    totalResults,
    displayedPokemon,
    totalPokemonCount,
    usePagination,
    itemsPerPage,

    // Header
    headerIsSticky,
    headerIsHidden,

    // Store refs
    listStore,

    // Actions
    setSearchQuery,
    setSelectedType,
    clearFilters,
    handleRetry,
    handleSelectPokemon,
  }
}
