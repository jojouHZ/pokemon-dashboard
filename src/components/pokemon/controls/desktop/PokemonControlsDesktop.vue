<template>
  <div class="pokemon-controls-desktop">
    <div class="pokemon-controls-desktop__wrapper-top">
      <div class="pokemon-controls-desktop__info">
        <span v-if="hasActiveFilters" class="pokemon-controls-desktop__result-count">
          Found {{ totalResults }} Pokémon
        </span>
        <span v-else class="pokemon-controls-desktop__total-count">
          {{ totalResults }} Pokémon available
        </span>
      </div>
      <div class="pokemon-controls-desktop__controls">
        <button
          class="pokemon-controls-desktop__clear-btn"
          :class="{ 'pokemon-controls-desktop__clear-btn--hidden': !hasActiveFilters }"
          @click="hasActiveFilters && handleClearFilters()"
        >
          ✕ <span>Clear Filters</span>
        </button>

        <div class="pokemon-controls-desktop__search">
          <SearchInput v-model="localSearch" />
        </div>
      </div>
    </div>
    <div class="pokemon-controls-desktop__wrapper-bot">
      <div class="pokemon-controls-desktop__filter">
        <TypeFilterDesktop
          :selected-types="selectedTypes"
          :is-all-active="isAllActive"
          @toggle-type="handleTypeToggle"
          @clear-all="handleClearTypes"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SearchInput from '../SearchInput.vue'
import TypeFilterDesktop from './TypeFilterDesktop.vue'
import type { PokemonTypeName } from '@/types/pokemon'
import { DEBOUNCE_DELAYS } from '@/constants'
import { useDebounce } from '@/composables/useDebounce'

interface Props {
  searchQuery: string
  selectedTypes: PokemonTypeName[]
  isAllActive: boolean
  totalResults: number
}

interface Emits {
  (event: 'search', query: string): void
  (event: 'toggle-type', type: PokemonTypeName): void
  (event: 'clear-types'): void
  (event: 'clear'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localSearch = ref(props.searchQuery)
const selectedTypes = ref(props.selectedTypes)

const debouncedSearch = useDebounce(localSearch, DEBOUNCE_DELAYS.SEARCH)

watch(debouncedSearch, (newValue) => {
  emit('search', newValue)
})

watch(
  () => props.searchQuery,
  (newVal) => {
    localSearch.value = newVal
  },
)

watch(
  () => props.selectedTypes,
  (newVal) => {
    selectedTypes.value = newVal
  },
)

const handleTypeToggle = (type: PokemonTypeName) => {
  emit('toggle-type', type)
}

const handleClearTypes = () => {
  emit('clear-types')
}

const handleClearFilters = () => {
  localSearch.value = ''
  emit('clear')
}

const hasActiveFilters = computed(() => props.searchQuery !== '' || props.selectedTypes.length > 0)
</script>

<style scoped lang="scss">
.pokemon-controls-desktop {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 0 4px;
}

.pokemon-controls-desktop__wrapper-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 0;
  width: 100%;
}

.pokemon-controls-desktop__wrapper-bot {
  max-width: 100%;
  width: 100%;
  align-items: center;
}

.pokemon-controls-desktop__info {
  font-size: 13px;
  color: rgba(148, 163, 184, 0.8);
  font-weight: 500;
}

.pokemon-controls-desktop__result-count {
  color: rgba(56, 189, 248, 0.9);
}

.pokemon-controls-desktop__total-count {
  color: rgba(148, 163, 184, 0.7);
}

.pokemon-controls-desktop__tags {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.pokemon-controls-desktop__type-pill {
  padding: 4px 10px;
  background: rgba(56, 189, 248, 0.15);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 999px;
  font-size: 12px;
  color: rgba(56, 189, 248, 0.95);
}

.pokemon-controls-desktop__controls {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
}

.pokemon-controls-desktop__search {
  width: 280px;

  @media (max-width: 1200px) {
    width: 220px;
  }
}

.pokemon-controls-desktop__clear-btn {
  padding: 8px 14px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #ef4444;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.25);
    border-color: rgba(239, 68, 68, 0.6);
  }

  span {
    margin-left: 4px;
  }
}

.pokemon-controls-desktop__clear-btn--hidden {
  visibility: hidden;
  pointer-events: none;
}
</style>
