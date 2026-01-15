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

export async function fetchPokemonSpecies(name: string): Promise<PokemonSpecies> {
  try {
    const { data } = await axiosInstance.get<PokeAPISpeciesResponse>(
      `/pokemon-species/${name.toLowerCase()}`,
    )

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
    throw new Error(`Failed to fetch species data for "${name}": ${error}`)
  }
}

import type { PokemonListItem, PokemonListResponse } from '@/types/pokemon'

export async function fetchPokemonList(
  limit: number = 20,
  offset: number = 0,
): Promise<PokemonListResponse> {
  try {
    const { data } = await axiosInstance.get<PokemonListResponse>(
      `/pokemon?limit=${limit}&offset=${offset}`,
    )
    return data
  } catch (error) {
    throw new Error(`Failed to fetch pokemon list: ${error}`)
  }
}

interface PokeAPISummaryResponse {
  id: number
  name: string
  sprites: {
    front_default: string | null
  }
  types: Array<{
    type: {
      name: string
    }
  }>
}

export async function fetchPokemonSummary(url: string): Promise<PokemonListItem> {
  try {
    const { data } = await axiosInstance.get<PokeAPISummaryResponse>(url)
    return {
      id: data.id,
      name: data.name,
      image: data.sprites.front_default || '',
      types: data.types.map((t) => t.type.name),
    }
  } catch (error) {
    throw new Error(`Failed to fetch pokemon summary: ${error}`)
  }
}
