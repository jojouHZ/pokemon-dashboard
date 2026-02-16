<template>
  <div class="type-filter-desktop">
    <div v-if="selectedCount > 0" class="type-filter-desktop__counter">
      {{ selectedCount }} {{ selectedCount === 1 ? 'type' : 'types' }} selected
    </div>
    <div class="type-filter-desktop__chips">
      <TypeChip type="all" :active="isAllActive" @click="handleAllClick" />
      <TypeChip
        v-for="type in POKEMON_TYPES"
        :key="type"
        :type="type"
        :active="isTypeSelected(type)"
        @click="handleTypeClick(type)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PokemonTypeName } from '@/types/pokemon'
import { POKEMON_TYPES } from '@/types/pokemon'
import TypeChip from '../TypeChip.vue'

interface Props {
  selectedTypes: PokemonTypeName[]
  isAllActive: boolean
}

interface Emits {
  (event: 'toggle-type', type: PokemonTypeName): void
  (event: 'clear-all'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedCount = computed(() => props.selectedTypes.length)

const isTypeSelected = (type: PokemonTypeName): boolean => {
  return props.selectedTypes.includes(type)
}

const handleTypeClick = (type: PokemonTypeName) => {
  emit('toggle-type', type)
}

const handleAllClick = () => {
  emit('clear-all')
}
</script>

<style scoped lang="scss">
.type-filter-desktop {
  width: 100%;
}

.type-filter-desktop__chips {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}
</style>
