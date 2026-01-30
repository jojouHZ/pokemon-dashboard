/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import { isPokemon, isPokemonArray } from '@/types/pokemon'
import type { Pokemon } from '@/types/pokemon'
import { PokemonApiError } from '@/types/errors'

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

interface PokeAPISpeciesResponse {
  flavor_text_entries: Array<{
    flavor_text: string
    language: { name: string }
    version: { name: string }
  }>
  genera: Array<{
    genus: string
    language: { name: string }
  }>
}

export interface PokemonSpecies {
  description: string
  genus: string
}

/**
 * Get pokemon by name with full details
 * For detail page
 */
export async function getPokemon(name: string): Promise<Pokemon> {
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

    if (!isPokemon(pokemon)) {
      throw new PokemonApiError('Invalid pokemon data structure received from API', 500, name)
    }

    return pokemon
  } catch (error) {
    if (error instanceof PokemonApiError) throw error
    if (axios.isAxiosError(error)) {
      throw new PokemonApiError(
        `Failed to fetch pokemon "${name}": ${error.message}`,
        error.response?.status,
        name,
      )
    }
    throw new PokemonApiError(`Unexpected error fetching pokemon "${name}"`, 500, name)
  }
}

/**
 * Get pokemon species data (description, genus)
 * For detail page
 */
export async function getPokemonSpecies(name: string): Promise<PokemonSpecies> {
  try {
    const { data } = await axiosInstance.get<PokeAPISpeciesResponse>(
      `/pokemon-species/${name.toLowerCase()}`,
    )

    // Try to get Russian description, fallback to English
    const engDesc = data.flavor_text_entries.find(
      (entry) => entry.language.name === 'en' && entry.version.name === 'ultra-sun',
    )
    const ruDesc = data.flavor_text_entries.find((entry) => entry.language.name === 'ru')
    const description = ruDesc?.flavor_text || engDesc?.flavor_text || 'Описание недоступно'
    const genus = data.genera.find((g) => g.language.name === 'en')?.genus || 'Неизвестно'

    return {
      description: description.replace(/\n/g, ' ').replace(/\f/g, ' '),
      genus,
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new PokemonApiError(
        `Failed to fetch species data for "${name}": ${error.message}`,
        error.response?.status,
        name,
      )
    }
    throw new PokemonApiError(`Unexpected error fetching species for "${name}"`, 500, name)
  }
}
