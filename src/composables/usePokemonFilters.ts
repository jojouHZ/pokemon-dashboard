/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref, watchEffect } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { PokemonTypeName } from '@/types/pokemon'
import { usePokemonListStore } from '@/stores/pokemonListStore'
import { storeToRefs } from 'pinia'

interface UsePokemonFiltersReturn {
  searchQuery: Ref<string>
  selectedTypes: Ref<PokemonTypeName[]>
  totalResults: number
  hasResults: boolean

  setSearchQuery: (query: string) => void
  toggleSelectedType: (type: PokemonTypeName) => void
  clearSelectedTypes: () => void
  clearFilters: () => void
}
/**
 * Facade over pokemonListStore for filter-related state.
 *
 * Exposes search query, type filter and derived total results,
 * while delegating all writes to pokemonListStore actions.
 *
 * @returns {UsePokemonFiltersReturn} Filter refs, derived values and update helpers.
 */
export function usePokemonFilters(): UsePokemonFiltersReturn {
  const listStore = usePokemonListStore()
  const { searchQuery, selectedTypes } = storeToRefs(listStore)
  const totalResults = listStore.totalResults
  const hasResults = listStore.hasResults
  const setSearchQuery = (query: string) => listStore.setSearchQuery(query)
  const clearFilters = () => listStore.clearFilters()

  return {
    // State
    searchQuery,
    selectedTypes,
    totalResults,
    hasResults,

    // Actions
    setSearchQuery,
    toggleSelectedType: listStore.toggleSelectedType,
    clearSelectedTypes: listStore.clearSelectedTypes,
    clearFilters,
  }
}
