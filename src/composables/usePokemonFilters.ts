/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref, watchEffect } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { PokemonTypeName } from '@/types/pokemon'
import { usePokemonListStore } from '@/stores/pokemonListStore'
import { storeToRefs } from 'pinia'

interface UsePokemonFiltersReturn {
  searchQuery: Ref<string>
  selectedType: Ref<PokemonTypeName | null>

  totalResults: number
  hasResults: boolean

  setSearchQuery: (query: string) => void
  setSelectedType: (type: PokemonTypeName | null) => void
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
  const { searchQuery, selectedType } = storeToRefs(listStore)
  const totalResults = listStore.totalResults
  const hasResults = listStore.hasResults
  const setSearchQuery = (query: string) => listStore.setSearchQuery(query)
  const setSelectedType = (type: PokemonTypeName | null) => listStore.setSelectedType(type)
  const clearFilters = () => listStore.clearFilters()

  return {
    searchQuery,
    selectedType: selectedType as Ref<PokemonTypeName | null>,
    totalResults,
    hasResults,
    setSearchQuery,
    setSelectedType,
    clearFilters,
  }
}
