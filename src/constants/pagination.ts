/**
 * Constants for pagination
 */

/**
 * Конфигурация количества элементов на странице для разных размеров экрана
 */

/**
 * Pagination config
 */
export const PAGINATION_CONFIG = {
  MAX_VISIBLE_PAGES: 5,
  PAGES_AROUND_CURRENT: 2,
} as const

/**
 * Initial value for current page (1st by default)
 */
export const CURRENT_PAGE_INITIAL = {
  DEFAULT: 1,
}

export const ITEMS_PER_PAGE = {
  /** Desktop (>1024px) */
  DESKTOP: 24,
  /** Tablet (768px - 1024px) */
  TABLET: 18,
  /** Mobile (<768px) */
  MOBILE: 12,
  /** Initial Default */
  DEFAULT: 20,
} as const

/**
 * Min width breakpoints for responsive pagination (px)
 */
export const PAGINATION_BREAKPOINTS = {
  DESKTOP: 1024,
  TABLET: 768,
  MOBILE: 0,
} as const

/**
 * Delays (ms)
 */
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  FILTER: 200,
  RESIZE: 150,
} as const

/**
 * Animation speed settings (ms)
 */
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 400,
} as const
