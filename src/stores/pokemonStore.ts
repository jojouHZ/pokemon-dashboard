import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchPokemonByName, fetchPokemonSpecies } from '@/services/pokemonApiClient'
import type { PokemonSpecies } from '@/services/pokemonApiClient'
import type { Pokemon } from '@/types/pokemon'

export const usePokemonStore = defineStore('pokemon', () => {
  const current = ref<Pokemon | null>(null)
  const species = ref<PokemonSpecies | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadPokemon(name: string) {
    loading.value = true
    error.value = null

    try {
      const [pokemonData, speciesData] = await Promise.all([
        fetchPokemonByName(name),
        fetchPokemonSpecies(name),
      ])

      current.value = pokemonData
      species.value = speciesData
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      current.value = null
      species.value = null
    } finally {
      loading.value = false
    }
  }

  return {
    current,
    species,
    loading,
    error,
    loadPokemon,
  }
})
