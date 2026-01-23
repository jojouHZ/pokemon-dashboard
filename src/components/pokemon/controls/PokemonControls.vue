<template>
  <div class="pokemon-controls">
    <div class="pokemon-controls__wrapper">
      <!-- Search Input -->
      <div class="pokemon-controls__search">
        <SearchInput v-model="localSearch" @update:model-value="handleSearch" />
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

interface Props {
  searchQuery: string
  selectedType: string | null
  totalResults: number
}

interface Emits {
  search: [query: string]
  filter: [type: string | null]
  clear: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Local state for search (for debouncing)
const localSearch = ref(props.searchQuery)
const selectedType = ref(props.selectedType)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Watch prop changes
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

const handleSearch = (query: string) => {
  // Clear previous debounce
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  // Debounce search (300ms)
  debounceTimer = setTimeout(() => {
    emit('search', query)
  }, 300)
}

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
  gap: 16px;
  padding: 24px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.pokemon-controls__wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
}

.pokemon-controls__search {
  flex: 1;
  min-width: 200px;

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
  padding: 10px 16px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #ef4444;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(239, 68, 68, 0.25);
    border-color: rgba(239, 68, 68, 0.6);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
}

.pokemon-controls__info {
  font-size: 14px;
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
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.pokemon-controls__filter-badge {
  padding: 6px 12px;
  background: rgba(56, 189, 248, 0.15);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 999px;
  font-size: 13px;
  color: rgba(56, 189, 248, 0.95);
}
</style>
