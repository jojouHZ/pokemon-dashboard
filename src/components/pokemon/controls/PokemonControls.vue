<template>
  <div class="pokemon-controls">
    <div class="pokemon-controls__wrapper">
      <!-- Search Input -->
      <div class="pokemon-controls__search">
        <SearchInput v-model="localSearch" />
      </div>

      <!-- Type Filter -->
      <div class="pokemon-controls__filter">
        <TypeFilter v-model="selectedType" @update:model-value="handleTypeChange" />
      </div>

      <!-- Clear Button -->
      <button
        v-if="hasActiveFilters"
        @click="handleClearFilters"
        class="pokemon-controls__clear-btn"
      >
        ✕ Clear Filters
      </button>
    </div>

    <!-- Results Info -->
    <div class="pokemon-controls__info">
      <span v-if="hasActiveFilters" class="pokemon-controls__result-count">
        Found {{ totalResults }} Pokémon
      </span>
      <span v-else class="pokemon-controls__total-count">
        {{ totalResults }} Pokémon available
      </span>
    </div>

    <!-- Active Filters Display -->
    <div v-if="hasActiveFilters" class="pokemon-controls__active-filters">
      <span v-if="searchQuery" class="pokemon-controls__filter-badge">
        🔍 "{{ searchQuery }}"
      </span>
      <span v-if="selectedType" class="pokemon-controls__filter-badge">
        🏷️ {{ capitalize(selectedType) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SearchInput from './SearchInput.vue'
import TypeFilter from './TypeFilter.vue'
import { DEBOUNCE_DELAYS } from '@/constants'

import { useDebounce } from '@/composables/useDebounce'

interface Props {
  searchQuery: string
  selectedType: string | null
  totalResults: number
}

interface Emits {
  (event: 'search', query: string): void
  (event: 'filter', type: string | null): void
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

const handleTypeChange = (type: string | null) => {
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
.pokemon-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 8px 0 10px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.18);

  @media (max-width: 768px) {
    padding: 6px 0 10px;
    gap: 8px;
  }
}

.pokemon-controls__wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    gap: 10px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.pokemon-controls__search {
  flex: 1;
  min-width: 220px;

  @media (max-width: 768px) {
    width: 100%;
  }
}

.pokemon-controls__filter {
  min-width: 200px;

  @media (max-width: 768px) {
    width: 100%;
  }
}

.pokemon-controls__clear-btn {
  padding: 9px 14px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #ef4444;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(239, 68, 68, 0.25);
    border-color: rgba(239, 68, 68, 0.6);
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
}

.pokemon-controls__info {
  font-size: 13px;
  color: rgba(148, 163, 184, 0.8);
  font-weight: 500;
}

.pokemon-controls__result-count {
  color: rgba(56, 189, 248, 0.9);
}

.pokemon-controls__total-count {
  color: rgba(148, 163, 184, 0.7);
}

.pokemon-controls__active-filters {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
}

.pokemon-controls__filter-badge {
  padding: 4px 10px;
  background: rgba(56, 189, 248, 0.15);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 999px;
  font-size: 12px;
  color: rgba(56, 189, 248, 0.95);
}
</style>
