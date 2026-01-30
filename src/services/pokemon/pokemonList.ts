import axios from 'axios'
import type { Pokemon } from '@/types/pokemon'
import { isPokemon } from '@/types/pokemon/guards'
import { PokemonApiError } from '@/types/errors'

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

    if (!isPokemon(pokemon)) {
      throw new PokemonApiError('Invalid pokemon data structure', 500)
    }

    return pokemon
  } catch (error) {
    if (error instanceof PokemonApiError) {
      throw error
    }

    if (axios.isAxiosError(error)) {
      throw new PokemonApiError(
        `Failed to fetch pokemon from ${url}: ${error.message}`,
        error.response?.status,
      )
    }

    throw new PokemonApiError(`Unexpected error fetching from ${url}`, 500)
  }
}

/**
 * Get complete pokemon list with full data
 * Loads all pokemon (1292 total) with types, stats, images
 * For dashboard list filtering/searching
 */
export async function getPokemonListFull(): Promise<Pokemon[]> {
  try {
    const { data } = await axiosInstance.get<PokeAPIListResponse>('/pokemon?limit=1292&offset=0')

    const pokemonPromises = data.results.map((item) => getPokemonFromUrl(item.url))
    const pokemonList = await Promise.all(pokemonPromises)

    return pokemonList
  } catch (error) {
    if (error instanceof PokemonApiError) {
      throw error
    }

    if (axios.isAxiosError(error)) {
      throw new PokemonApiError(
        `Failed to fetch complete pokemon list: ${error.message}`,
        error.response?.status,
      )
    }

    throw new PokemonApiError('Unexpected error fetching pokemon list', 500)
  }
}

/**
 * Get paginated pokemon list with full data
 * For future use (if we want server-side pagination - !big question)
 */
export async function getPokemonListPaginated(
  limit: number = 24,
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
    if (error instanceof PokemonApiError) {
      throw error
    }

    if (axios.isAxiosError(error)) {
      throw new PokemonApiError(
        `Failed to fetch pokemon list (limit=${limit}, offset=${offset}): ${error.message}`,
        error.response?.status,
      )
    }

    throw new PokemonApiError(
      `Unexpected error fetching pokemon list (limit=${limit}, offset=${offset})`,
      500,
    )
  }
}
