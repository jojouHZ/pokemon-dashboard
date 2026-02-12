<template>
  <div class="pokemon-controls-mobile">
    <div class="pokemon-controls-mobile__wrapper">
      <!-- Search Input -->
      <div class="pokemon-controls-mobile__search">
        <SearchInput v-model="localSearch" />
      </div>

      <!-- Type Filter -->
      <div class="pokemon-controls-mobile__filter">
        <TypeFilter v-model="selectedType" @update:model-value="handleTypeChange" />
      </div>

      <!-- Clear Button -->
      <button
        v-if="hasActiveFilters"
        @click="handleClearFilters"
        class="pokemon-controls-mobile__clear-btn"
      >
        ✕
      </button>
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
</script>

<style scoped lang="scss">
.pokemon-controls-mobile {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 6px 0 8px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.18);
  width: 100%;
}

.pokemon-controls-mobile__wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: nowrap;
  width: 100%;
}

.pokemon-controls-mobile__search {
  flex: 1 1 auto;
  min-width: 0;
}

.pokemon-controls-mobile__filter {
  flex: 0 0 auto;
  min-width: 110px;
}

.pokemon-controls-mobile__clear-btn {
  padding: 8px 14px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #ef4444;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex: 0 0 auto;

  &:hover {
    background: rgba(239, 68, 68, 0.25);
    border-color: rgba(239, 68, 68, 0.6);
  }

  span {
    margin-left: 4px;
  }
}
</style>
