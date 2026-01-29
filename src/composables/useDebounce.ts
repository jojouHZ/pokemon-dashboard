import { ref, watch, type Ref } from 'vue'

const DEFAULT_DEBOUNCE_DELAY_MS = 300

/**
 * Composable for debounce values
 * @param value - reactive debounce value
 * @param delay - delay in ms
 * @returns - debounced value
 */

export function useDebounce<T>(value: Ref<T>, delay: number = DEFAULT_DEBOUNCE_DELAY_MS) {
  const debouncedValue = ref(value.value) as Ref<T>
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  watch(value, (newValue) => {
    if (timeoutId) clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })
  return debouncedValue
}

/**
 * Composable for debounce function
 * @param fn - function
 * @param delay - delay in ms
 * @returns debounced function
 */
export function useDebounceFn<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number = DEFAULT_DEBOUNCE_DELAY_MS,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
