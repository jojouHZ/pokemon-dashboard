import { defineStore } from 'pinia'
import { ref, computed, readonly, watch } from 'vue'
import { getPokemonListChunked } from '@/services/pokemon/pokemonList'
import { isPokemonApiError } from '@/types/errors'
import type { PokemonListItem } from '@/types/pokemon/list'
import type { PokemonTypeName } from '@/types/pokemon/detail'
import { ITEMS_PER_PAGE, CURRENT_PAGE_INITIAL } from '@/constants'
import { useFetchWithRetry } from '@/composables/useFetchWithRetry'
import { useLocalCache } from '@/composables/useLocalCache'

export const usePokemonListStore = defineStore('pokemonList', () => {
  const pokemonList = ref<PokemonListItem[]>([])
  const searchQuery = ref('')
  const selectedType = ref<PokemonTypeName | null>(null)
  const currentPage = ref(CURRENT_PAGE_INITIAL.DEFAULT)
  const itemsPerPage = ref<number>(ITEMS_PER_PAGE.DEFAULT)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { fetchWithRetry, isRetrying, currentAttempt } = useFetchWithRetry()

  // Local cache (24 hours TTL)
  const cache = useLocalCache<PokemonListItem[]>({
    key: 'pokemon-list-cache',
    defaultValue: [],
    ttl: 1000 * 60 * 60 * 24, // 24 hours
  })
  const backgroundLoadingProgress = ref(0) // 0-100%
  const isBackgroundLoading = ref(false)

  // Actions
  /**
   * Load pokemon list with retry logic and background chunked loading
   * First loads initial 24 pokemon from cache or API,
   * then loads remaining pokemon in background chunks
   */
  async function loadPokemonList() {
    try {
      loading.value = true
      error.value = null

      // Try to load from cache first
      if (!cache.isExpired() && cache.data.value.length > 0) {
        pokemonList.value = cache.data.value
        loading.value = false
        return
      }

      // Load with retry logic and chunked strategy
      const initialPokemon = await fetchWithRetry(
        () =>
          getPokemonListChunked({
            initialChunkSize: 24,
            backgroundChunkSize: 100,
            onChunkLoaded: (chunk, totalLoaded) => {
              pokemonList.value = [...pokemonList.value, ...chunk]

              // Update progress (1292 total pokemon)
              backgroundLoadingProgress.value = Math.round((totalLoaded / 1292) * 100)

              // Save to cache after each chunk
              cache.save(pokemonList.value)
            },
            onComplete: (allPokemon) => {
              pokemonList.value = allPokemon
              cache.save(allPokemon)
              isBackgroundLoading.value = false
              backgroundLoadingProgress.value = 100
            },
          }),
        {
          maxRetries: 3,
          delayMs: [0, 1000, 3000],
          onRetry: (attempt) => {
            console.log(`Retry attempt ${attempt}/3`)
          },
        },
      )

      // Set initial chunk immediately
      pokemonList.value = initialPokemon
      isBackgroundLoading.value = true

      // Save initial chunk to cache
      cache.save(initialPokemon)
    } catch (err) {
      if (isPokemonApiError(err)) {
        error.value = err.message
      } else {
        error.value = 'Failed to load Pokémon list'
        console.error('Unexpected error:', err)
      }
    } finally {
      loading.value = false
    }
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query.toLowerCase()
    currentPage.value = CURRENT_PAGE_INITIAL.DEFAULT
  }

  function setSelectedType(type: PokemonTypeName | null) {
    selectedType.value = type
    currentPage.value = CURRENT_PAGE_INITIAL.DEFAULT
  }

  function clearFilters() {
    searchQuery.value = ''
    selectedType.value = null
    currentPage.value = CURRENT_PAGE_INITIAL.DEFAULT
  }

  function setPage(page: number) {
    currentPage.value = page
  }

  function setItemsPerPage(items: number) {
    itemsPerPage.value = items
    currentPage.value = CURRENT_PAGE_INITIAL.DEFAULT
  }

  // Getters
  const filteredPokemon = readonly(
    computed(() => {
      let filtered = pokemonList.value

      // Filter by search
      if (searchQuery.value) {
        filtered = filtered.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(searchQuery.value),
        )
      }

      // Filter by type
      if (selectedType.value) {
        filtered = filtered.filter((pokemon) =>
          pokemon.types.some((type) => type.toLowerCase() === selectedType.value?.toLowerCase()),
        )
      }

      return filtered
    }),
  )

  const totalPages = readonly(
    computed(() => {
      const count = filteredPokemon.value.length
      return Math.ceil(count / itemsPerPage.value)
    }),
  )

  const displayedPokemon = readonly(
    computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredPokemon.value.slice(start, end)
    }),
  )

  const totalResults = readonly(computed(() => filteredPokemon.value.length))
  const hasResults = readonly(computed(() => totalResults.value > 0))

  // Infinite scroll support
  const loadedCount = ref(0) // For infinite scroll mode

  const hasMore = computed(() => {
    return loadedCount.value < filteredPokemon.value.length
  })

  function loadNextPage() {
    const increment = itemsPerPage.value
    loadedCount.value = Math.min(loadedCount.value + increment, filteredPokemon.value.length)
  }

  function resetInfiniteScroll() {
    loadedCount.value = itemsPerPage.value
  }

  // Watch filters to reset infinite scroll
  watch([searchQuery, selectedType], () => {
    resetInfiniteScroll()
  })

  // Init
  loadPokemonList()

  return {
    // State
    pokemonList,
    searchQuery,
    selectedType,
    currentPage,
    itemsPerPage,
    loading,
    error,

    // Retry state
    isRetrying,
    currentAttempt,

    // Background loading state
    isBackgroundLoading,
    backgroundLoadingProgress,

    // Infinite scroll state
    loadedCount,
    hasMore,

    // Getters
    filteredPokemon,
    displayedPokemon,
    totalPages,
    totalResults,
    hasResults,

    // Actions
    loadPokemonList,
    setSearchQuery,
    setSelectedType,
    clearFilters,
    setPage,
    setItemsPerPage,

    // Infinite scroll actions
    loadNextPage,
    resetInfiniteScroll,
  }
})
