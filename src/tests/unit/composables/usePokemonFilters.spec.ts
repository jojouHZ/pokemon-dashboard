import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { usePokemonFilters } from '@/composables/usePokemonFilters'
import type { PokemonTypeName } from '@/types/pokemon'

const mockSetSearchQuery = vi.fn()
const mockToggleSelectedType = vi.fn()
const mockClearSelectedTypes = vi.fn()
const mockClearFilters = vi.fn()

const searchQueryRef = ref('')
const selectedTypesRef = ref<PokemonTypeName[]>([])
let totalResults = 0
let hasResults = false

vi.mock('@/stores/pokemonListStore', () => {
  return {
    usePokemonListStore: () => ({
      searchQuery: searchQueryRef,
      selectedTypes: selectedTypesRef,
      totalResults,
      hasResults,
      setSearchQuery: mockSetSearchQuery,
      toggleSelectedType: mockToggleSelectedType,
      clearSelectedTypes: mockClearSelectedTypes,
      clearFilters: mockClearFilters,
    }),
  }
})

describe('usePokemonFilters', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    searchQueryRef.value = ''
    selectedTypesRef.value = []
    totalResults = 0
    hasResults = false
  })

  it('delegates setSearchQuery to store.setSearchQuery', () => {
    const filters = usePokemonFilters()

    filters.setSearchQuery('pikachu')

    expect(mockSetSearchQuery).toHaveBeenCalledTimes(1)
    expect(mockSetSearchQuery).toHaveBeenCalledWith('pikachu')
  })

  it('delegates toggleSelectedType to store.toggleSelectedType', () => {
    const filters = usePokemonFilters()

    filters.toggleSelectedType('ice')
    expect(mockToggleSelectedType).toHaveBeenCalledTimes(1)
    expect(mockToggleSelectedType).toHaveBeenCalledWith('ice')
  })

  it('delegates clearFilters to store.clearFilters', () => {
    const filters = usePokemonFilters()

    filters.clearFilters()
    expect(mockClearFilters).toHaveBeenCalledTimes(1)
    expect(mockClearFilters).toHaveBeenCalledWith()
  })

  it('reactively proxies searchQuery from the store', async () => {
    const filters = usePokemonFilters()

    expect(filters.searchQuery.value).toBe('')
    searchQueryRef.value = 'pikachu'
    expect(filters.searchQuery.value).toBe('pikachu')
  })

  it('reactively proxies selectedType from the store', async () => {
    const filters = usePokemonFilters()

    expect(filters.selectedTypes.value).toEqual([])

    selectedTypesRef.value = ['water']

    expect(filters.selectedTypes.value).toEqual(['water'])
  })

  it('proxies initial totalResults and hasResults from the store', () => {
    totalResults = 42
    hasResults = true
    const filters = usePokemonFilters()

    expect(filters.totalResults).toBe(42)
    expect(filters.hasResults).toBe(true)
  })
})
