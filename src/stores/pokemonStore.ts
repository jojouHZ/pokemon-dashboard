import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPokemon, getPokemonSpecies } from '@/services/pokemon'
import type { Pokemon } from '@/types/pokemon'
import type { PokemonSpecies } from '@/services/pokemon'
import { isPokemonApiError } from '@/types/errors'

export const usePokemonStore = defineStore('pokemon', () => {
  const current = ref<Pokemon | null>(null)
  const species = ref<PokemonSpecies | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalPokemonCount = ref(1292)

  async function loadPokemon(name: string) {
    loading.value = true
    error.value = null

    try {
      const [pokemonData, speciesData] = await Promise.all([
        getPokemon(name),
        getPokemonSpecies(name),
      ])

      current.value = pokemonData
      species.value = speciesData
    } catch (err) {
      if (isPokemonApiError(err)) {
        error.value = err.pokemon ? `Failed to load ${err.pokemon}: ${err.message}` : err.message
      } else if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'An unexpected error occurred'
      }

      current.value = null
      species.value = null

      console.error('[pokemonStore] Error loading pokemon:', err)
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
    totalPokemonCount,
  }
})
