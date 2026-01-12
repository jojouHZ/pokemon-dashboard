import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchPokemonByName } from '@/services/pokemonApiClient'
import type { Pokemon } from '@/types/pokemon'

export const usePokemonStore = defineStore('pokemon', () => {
  const current = ref<Pokemon | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadPokemon(name: string) {
    loading.value = true
    error.value = null

    try {
      current.value = await fetchPokemonByName(name)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      current.value = null
    } finally {
      loading.value = false
    }
  }

  return {
    current,
    loading,
    error,
    loadPokemon,
  }
})
