import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPokemon, getPokemonSpecies } from '@/services/pokemon'
import type { Pokemon } from '@/types/pokemon'
import type { PokemonSpecies } from '@/services/pokemon'

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
    totalPokemonCount,
  }
})
