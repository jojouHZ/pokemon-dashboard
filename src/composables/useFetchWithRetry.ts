import { ref } from 'vue'

/**
 * Options for retry logic
 */
interface RetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number
  /** Array of delays between attempts in ms (default: [0, 1000, 3000]) */
  delayMs?: number[]
  /** Callback invoked before each retry attempt */
  onRetry?: (attempt: number) => void
}

/**
 * Composable for executing fetch requests with automatic retry
 * on network errors using exponential backoff
 *
 * @example
 * const { fetchWithRetry, isRetrying, currentAttempt } = useFetchWithRetry()
 *
 * const data = await fetchWithRetry(
 *   () => getPokemonList(),
 *   { maxRetries: 3, delayMs: [0, 1000, 3000] }
 * )
 */
export function useFetchWithRetry() {
  const isRetrying = ref(false)
  const currentAttempt = ref(0)

  /**
   * Executes a fetcher function with automatic retry on errors
   *
   * @param fetcher - Function returning a Promise with data
   * @param options - Retry logic options
   * @returns Promise with fetcher result
   * @throws Last error if all attempts are exhausted
   */
  async function fetchWithRetry<T>(
    fetcher: () => Promise<T>,
    options: RetryOptions = {},
  ): Promise<T> {
    const { maxRetries = 3, delayMs = [0, 1000, 3000], onRetry } = options

    currentAttempt.value = 0

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        currentAttempt.value = attempt + 1

        if (attempt > 0) {
          isRetrying.value = true
          onRetry?.(attempt)

          const delay = delayMs[attempt] || delayMs[delayMs.length - 1] || 3000
          await new Promise((resolve) => setTimeout(resolve, delay))
        }

        const result = await fetcher()

        isRetrying.value = false
        currentAttempt.value = 0
        return result
      } catch (error) {
        if (attempt === maxRetries - 1) {
          isRetrying.value = false
          currentAttempt.value = 0
          throw error
        }
      }
    }

    // unreachable, but required for TypeScript
    throw new Error('Max retries exceeded')
  }

  return {
    fetchWithRetry,
    isRetrying,
    currentAttempt,
  }
}
