<template>
  <div class="type-filter-desktop">
    <div class="type-filter-desktop__chips">
      <TypeChip
        v-for="type in pokemonTypes"
        :key="type"
        :type="type"
        :active="selectedType === type"
        @click="handleTypeClick(type)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PokemonTypeName } from '@/types/pokemon'
import TypeChip from '../TypeChip.vue'

interface Props {
  modelValue: PokemonTypeName | null
}

interface Emits {
  (event: 'update:modelValue', value: PokemonTypeName | null): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedType = ref(props.modelValue)

const pokemonTypes: PokemonTypeName[] = [
  'normal',
  'fire',
  'water',
  'grass',
  'electric',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
]

watch(
  () => props.modelValue,
  (newVal) => {
    selectedType.value = newVal
  },
)

const handleTypeClick = (type: PokemonTypeName) => {
  // Toggle: если уже выбран — deselect
  if (selectedType.value === type) {
    selectedType.value = null
    emit('update:modelValue', null)
  } else {
    selectedType.value = type
    emit('update:modelValue', type)
  }
}
</script>

<style scoped lang="scss">
.type-filter-desktop {
  width: 100%;
}

.type-filter-desktop__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}
</style>
