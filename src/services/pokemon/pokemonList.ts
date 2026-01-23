import axios from 'axios'
import type { Pokemon } from '@/types/pokemon'

const API_BASE = 'https://pokeapi.co/api/v2'
const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
})

interface PokeAPIListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Array<{
    name: string
    url: string
  }>
}

interface PokeAPISummaryResponse {
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

/**
 * Load single pokemon from URL with full data
 * (id, name, types, stats, image, height, weight)
 */
async function getPokemonFromUrl(url: string): Promise<Pokemon> {
  try {
    const { data } = await axiosInstance.get<PokeAPISummaryResponse>(url)

    return {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error(`Failed to fetch pokemon from ${url}`)
  }
}

/**
 * Get complete pokemon list with full data
 * Loads all pokemon (1292 total) with types, stats, images
 * For dashboard list filtering/searching
 */
export async function getPokemonListFull(): Promise<Pokemon[]> {
  try {
    // Get list of all pokemon URLs
    const { data } = await axiosInstance.get<PokeAPIListResponse>('/pokemon?limit=1292&offset=0')

    // Load full data for each pokemon in parallel
    const pokemonPromises = data.results.map((item) => getPokemonFromUrl(item.url))
    const pokemonList = await Promise.all(pokemonPromises)

    return pokemonList
  } catch (error) {
    throw new Error(`Failed to fetch complete pokemon list: ${error}`)
  }
}

/**
 * Get paginated pokemon list with full data
 * For future use (if we want server-side pagination)
 */
export async function getPokemonListPaginated(
  limit: number = 20,
  offset: number = 0,
): Promise<Pokemon[]> {
  try {
    const { data } = await axiosInstance.get<PokeAPIListResponse>(
      `/pokemon?limit=${limit}&offset=${offset}`,
    )

    const pokemonPromises = data.results.map((item) => getPokemonFromUrl(item.url))
    const pokemonList = await Promise.all(pokemonPromises)

    return pokemonList
  } catch (error) {
    throw new Error(`Failed to fetch pokemon list (limit=${limit}, offset=${offset}): ${error}`)
  }
}
