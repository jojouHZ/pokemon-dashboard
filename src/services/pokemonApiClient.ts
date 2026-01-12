import axios from 'axios'
import type { Pokemon } from '@/types/pokemon'

const API_BASE = 'https://pokeapi.co/api/v2'

const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
})

interface PokeAPIResponse {
  id: number
  name: string
  height: number
  weight: number
  sprites: {
    front_default: string | null
    other?: {
      'official-artwork'?: {
        front_default: string | null
      }
    }
  }
  types: Array<{
    type: { name: string }
  }>
  stats: Array<{
    base_stat: number
    stat: { name: string }
  }>
}

export async function fetchPokemonByName(name: string): Promise<Pokemon> {
  try {
    const { data } = await axiosInstance.get<PokeAPIResponse>(`/pokemon/${name.toLowerCase()}`)

    const pokemon: Pokemon = {
      id: data.id,
      name: data.name,
      height: data.height,
      weight: data.weight,
      image:
        data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default || '',
      types: data.types.map((t) => t.type.name),
      stats: data.stats.map((s) => ({
        label: s.stat.name,
        value: s.base_stat,
      })),
    }

    return pokemon
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch pokemon "${name}": ${error.message}`)
    }
    throw error
  }
}
