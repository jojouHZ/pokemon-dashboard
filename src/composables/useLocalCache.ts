import { ref } from 'vue'
import type { Ref } from 'vue'

interface CacheOptions<T> {
  key: string
  defaultValue: T
  ttl?: number
}

/**
 * Cached data with metadata
 */
interface CachedData<T> {
  data: T
  timestamp: number
}

/**
 * Composable for managing localStorage cache with automatic serialization
 * and optional TTL (time to live)
 *
 * @example
 * const { data, save, load, clear, isExpired } = useLocalCache({
 *   key: 'pokemon-list',
 *   defaultValue: [],
 *   ttl: 1000 * 60 * 60 // 1 hour
 * })
 *
 * // Auto-save on change
 * watch(pokemonList, () => save(pokemonList.value))
 */
export function useLocalCache<T>(options: CacheOptions<T>) {
  const { key, defaultValue, ttl } = options

  const data = ref<T>(defaultValue) as Ref<T>

  /**
   * Loads data from localStorage
   * @returns Loaded data or default value if cache is empty/expired
   */
  const load = (): T => {
    try {
      const cached = localStorage.getItem(key)
      if (!cached) return defaultValue

      const parsed: CachedData<T> = JSON.parse(cached)

      // Check TTL expiration
      if (ttl && Date.now() - parsed.timestamp > ttl) {
        clear()
        return defaultValue
      }

      data.value = parsed.data
      return parsed.data
    } catch (error) {
      console.error(`Error loading cache for key "${key}":`, error)
      return defaultValue
    }
  }

  /**
   * Saves data to localStorage with timestamp
   * @param value - Data to cache
   */
  const save = (value: T): void => {
    try {
      const cached: CachedData<T> = {
        data: value,
        timestamp: Date.now(),
      }
      localStorage.setItem(key, JSON.stringify(cached))
      data.value = value
    } catch (error) {
      console.error(`Error saving cache for key "${key}":`, error)
    }
  }

  const clear = (): void => {
    try {
      localStorage.removeItem(key)
      data.value = defaultValue
    } catch (error) {
      console.error(`Error clearing cache for key "${key}":`, error)
    }
  }

  /**
   * Checks if cached data is expired (based on TTL)
   * @returns True if cache is expired or doesn't exist
   */
  const isExpired = (): boolean => {
    if (!ttl) return false

    try {
      const cached = localStorage.getItem(key)
      if (!cached) return true

      const parsed: CachedData<T> = JSON.parse(cached)
      return Date.now() - parsed.timestamp > ttl
    } catch {
      return true
    }
  }

  // Auto-load on initialization
  load()

  return {
    data,
    save,
    load,
    clear,
    isExpired,
  }
}
