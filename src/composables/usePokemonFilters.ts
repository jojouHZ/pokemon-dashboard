/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref, watchEffect } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { PokemonTypeName, PokemonListItem } from '@/types/pokemon'
import { usePokemonListStore } from '@/stores/pokemonListStore'
import { storeToRefs } from 'pinia'

interface UsePokemonFiltersReturn {
  searchQuery: Ref<string>
  selectedType: Ref<string | null>
  totalResults: ComputedRef<number>
  hasResults: ComputedRef<boolean>

  setSearchQuery: (query: string) => void
  setSelectedType: (type: string | null) => void
  clearFilters: () => void
}

export function usePokemonFilters(): UsePokemonFiltersReturn {
  const listStore = usePokemonListStore()
  const { searchQuery, selectedType, totalResults, hasResults } = storeToRefs(listStore)
  const setSearchQuery = (query: string) => listStore.setSearchQuery(query)
  const setSelectedType = (type: string | null) => listStore.setSelectedType(type)
  const clearFilters = () => listStore.clearFilters()

  return {
    searchQuery,
    selectedType,
    totalResults,
    hasResults,
    setSearchQuery,
    setSelectedType,
    clearFilters,
  }
}
