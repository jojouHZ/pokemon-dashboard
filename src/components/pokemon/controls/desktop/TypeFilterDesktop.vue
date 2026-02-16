<template>
  <div class="type-filter-desktop">
    <div class="type-filter-desktop__chips">
      <TypeChip
        v-for="type in POKEMON_TYPES"
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
import { POKEMON_TYPES } from '@/types/pokemon'
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
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}
</style>
