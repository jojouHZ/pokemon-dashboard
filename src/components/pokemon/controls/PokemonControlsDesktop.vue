<template>
  <div class="pokemon-controls-desktop">
    <div class="pokemon-controls-desktop__info">
      <span v-if="hasActiveFilters" class="pokemon-controls-desktop__result-count">
        Found {{ totalResults }} Pokémon
      </span>
      <span v-else class="pokemon-controls-desktop__total-count">
        {{ totalResults }} Pokémon available
      </span>
    </div>

    <div class="pokemon-controls-desktop__selected-types">
      <div class="pokemon-controls-desktop__tags">
        <span v-if="selectedType" class="pokemon-controls-desktop__type-pill">
          🏷️ {{ capitalize(selectedType) }}
        </span>
      </div>
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

      <div class="pokemon-controls-desktop__filter">
        <TypeFilter v-model="selectedType" @update:model-value="handleTypeChange" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SearchInput from './SearchInput.vue'
import TypeFilter from './TypeFilter.vue'
import type { PokemonTypeName } from '@/types/pokemon'
import { DEBOUNCE_DELAYS } from '@/constants'
import { useDebounce } from '@/composables/useDebounce'

interface Props {
  searchQuery: string
  selectedType: PokemonTypeName | null
  totalResults: number
}

interface Emits {
  (event: 'search', query: string): void
  (event: 'filter', type: PokemonTypeName | null): void
  (event: 'clear'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localSearch = ref(props.searchQuery)
const selectedType = ref(props.selectedType)

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
  () => props.selectedType,
  (newVal) => {
    selectedType.value = newVal
  },
)

const handleTypeChange = (type: PokemonTypeName | null) => {
  selectedType.value = type
  emit('filter', type)
}

const handleClearFilters = () => {
  localSearch.value = ''
  selectedType.value = null
  emit('clear')
}

const hasActiveFilters = computed(() => props.searchQuery !== '' || props.selectedType !== null)

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<style scoped lang="scss">
.pokemon-controls-desktop {
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  align-items: center;
  gap: 8px;
  padding: 8px 0 4px;
  width: 100%;
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

.pokemon-controls-desktop__selected-types {
  min-height: 24px;
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
  display: grid;
  grid-template-columns: auto auto 1fr;
  column-gap: 8px;
  align-items: center;
  justify-content: end;
}

.pokemon-controls-desktop__search {
  width: 100%;
}

.pokemon-controls-desktop__filter {
  width: 100%;
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
