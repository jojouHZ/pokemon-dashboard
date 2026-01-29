import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getPokemonListFull } from '@/services/pokemon'
import type { Pokemon } from '@/types/pokemon'
import { ITEMS_PER_PAGE, CURRENT_PAGE_INITIAL } from '@/constants'

export const usePokemonListStore = defineStore('pokemonList', () => {
  // State
  const pokemonList = ref<Pokemon[]>([])
  const searchQuery = ref('')
  const selectedType = ref<string | null>(null)
  const currentPage = ref(CURRENT_PAGE_INITIAL.DEFAULT)
  const itemsPerPage = ref(ITEMS_PER_PAGE.DEFAULT)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function loadPokemonList() {
    try {
      loading.value = true
      error.value = null

      const data = await getPokemonListFull()
      pokemonList.value = data
    } catch (err) {
      error.value = 'Failed to load Pokémon list'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query.toLowerCase()
    currentPage.value = CURRENT_PAGE_INITIAL.DEFAULT
  }

  function setSelectedType(type: string | null) {
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

  // Getters
  const filteredPokemon = computed(() => {
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
  })

  const totalPages = computed(() => {
    const count = filteredPokemon.value.length
    return Math.ceil(count / itemsPerPage.value)
  })

  const displayedPokemon = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredPokemon.value.slice(start, end)
  })

  const totalResults = computed(() => filteredPokemon.value.length)
  const hasResults = computed(() => totalResults.value > 0)

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
  }
})
