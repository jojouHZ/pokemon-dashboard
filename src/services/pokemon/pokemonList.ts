import axios from 'axios'
import type { PokemonListItem } from '@/types/pokemon/list'
import { PokemonApiError } from '@/types/errors'

const API_BASE = 'https://pokeapi.co/api/v2'
const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
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

/**
 * Lightweight response for pokemon summary (only needed fields)
 */
interface PokeAPISummaryResponse {
  id: number
  name: string
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
}

/**
 * Load lightweight pokemon summary from URL
 * Only includes: id, name, image, types (for dashboard list)
 */
async function getPokemonSummaryFromUrl(url: string): Promise<PokemonListItem> {
  try {
    const { data } = await axiosInstance.get<PokeAPISummaryResponse>(url)

    const pokemon: PokemonListItem = {
      id: data.id,
      name: data.name,
      image:
        data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default || '',
      types: data.types.map((t) => t.type.name),
    }

    return pokemon
  } catch (error) {
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
 * Get complete pokemon list with lightweight data
 * Loads all pokemon (1292 total) with id, name, image, types
 * For dashboard list filtering/searching
 */
export async function getPokemonListFull(): Promise<PokemonListItem[]> {
  try {
    const { data } = await axiosInstance.get<PokeAPIListResponse>('/pokemon?limit=1292&offset=0')

    const pokemonPromises = data.results.map((item) => getPokemonSummaryFromUrl(item.url))
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
 * Get paginated pokemon list with lightweight data
 * For chunked loading strategy
 */
export async function getPokemonListPaginated(
  limit: number = 24,
  offset: number = 0,
): Promise<PokemonListItem[]> {
  try {
    const { data } = await axiosInstance.get<PokeAPIListResponse>(
      `/pokemon?limit=${limit}&offset=${offset}`,
    )

    const pokemonPromises = data.results.map((item) => getPokemonSummaryFromUrl(item.url))
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

/**
 * Options for background chunked loading
 */
interface ChunkedLoadOptions {
  /** Initial chunk size to load immediately (default: 24) */
  initialChunkSize?: number
  /** Background chunk size for subsequent loads (default: 100) */
  backgroundChunkSize?: number
  /** Callback invoked after each chunk is loaded */
  onChunkLoaded?: (chunk: PokemonListItem[], totalLoaded: number) => void
  /** Callback invoked when all chunks are loaded */
  onComplete?: (allPokemon: PokemonListItem[]) => void
}

/**
 * Load pokemon list in chunks with background loading
 * First loads initial chunk (default: 24) for immediate display,
 * then continues loading remaining pokemon in background chunks (default: 100 per chunk)
 *
 * @param options - Options for chunked loading
 * @returns Promise with initial chunk of pokemon
 *
 * @example
 * const initial = await getPokemonListChunked({
 *   initialChunkSize: 24,
 *   backgroundChunkSize: 100,
 *   onChunkLoaded: (chunk, total) => console.log(`Loaded ${total} pokemon`),
 *   onComplete: (all) => console.log('All pokemon loaded!')
 * })
 */
export async function getPokemonListChunked(
  options: ChunkedLoadOptions = {},
): Promise<PokemonListItem[]> {
  const { initialChunkSize = 24, backgroundChunkSize = 100, onChunkLoaded, onComplete } = options

  const TOTAL_POKEMON = 1292

  try {
    // Load initial chunk immediately
    const initialPokemon = await getPokemonListPaginated(initialChunkSize, 0)

    // Start background loading for remaining pokemon
    loadRemainingChunks(
      initialChunkSize,
      backgroundChunkSize,
      TOTAL_POKEMON,
      initialPokemon,
      onChunkLoaded,
      onComplete,
    )

    return initialPokemon
  } catch (error) {
    if (error instanceof PokemonApiError) {
      throw error
    }

    if (axios.isAxiosError(error)) {
      throw new PokemonApiError(
        `Failed to fetch initial pokemon chunk: ${error.message}`,
        error.response?.status,
      )
    }

    throw new PokemonApiError('Unexpected error fetching pokemon chunk', 500)
  }
}

/**
 * Background function to load remaining pokemon chunks
 * Does not block main thread, loads chunks sequentially
 */
async function loadRemainingChunks(
  offset: number,
  chunkSize: number,
  total: number,
  accumulator: PokemonListItem[],
  onChunkLoaded?: (chunk: PokemonListItem[], totalLoaded: number) => void,
  onComplete?: (allPokemon: PokemonListItem[]) => void,
): Promise<void> {
  // Run in background (non-blocking)
  setTimeout(async () => {
    try {
      let currentOffset = offset
      const allPokemon = [...accumulator]

      while (currentOffset < total) {
        const remaining = total - currentOffset
        const currentChunkSize = Math.min(chunkSize, remaining)

        try {
          // Retry logic for background chunks (3 attempts with backoff)
          let chunk: PokemonListItem[] = []
          let attempt = 0
          const maxAttempts = 3

          while (attempt < maxAttempts) {
            try {
              chunk = await getPokemonListPaginated(currentChunkSize, currentOffset)
              break // Success, exit retry loop
            } catch (error) {
              attempt++
              if (attempt >= maxAttempts) {
                throw error // All retries exhausted
              }
              // Exponential backoff: 1s, 3s
              const delay = attempt === 1 ? 1000 : 3000
              await new Promise((resolve) => setTimeout(resolve, delay))
            }
          }

          allPokemon.push(...chunk)
          onChunkLoaded?.(chunk, allPokemon.length)

          currentOffset += currentChunkSize

          // Small delay between chunks to avoid overwhelming the API
          await new Promise((resolve) => setTimeout(resolve, 100))
        } catch (error) {
          console.error(`Failed to load chunk at offset ${currentOffset} after 3 attempts:`, error)
          // Skip this chunk and continue with next one
          currentOffset += currentChunkSize
        }
      }

      onComplete?.(allPokemon)
    } catch (error) {
      console.error('Error loading background pokemon chunks:', error)
    }
  }, 0)
}
