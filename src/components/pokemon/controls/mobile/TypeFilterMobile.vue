<template>
  <div class="type-filter-mobile">
    <!-- Спойлер-кнопка -->
    <button
      @click="toggleExpanded"
      class="type-filter-mobile__toggle"
      :class="{ 'type-filter-mobile__toggle--open': isExpanded }"
    >
      <span class="type-filter-mobile__toggle-label">
        🏷️ Types
        <span v-if="selectedType" class="type-filter-mobile__badge">
          {{ capitalize(selectedType) }}
        </span>
      </span>
      <svg
        class="type-filter-mobile__arrow"
        :class="{ 'type-filter-mobile__arrow--rotated': isExpanded }"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>

    <!-- Horizontal scroll с чипсами -->
    <Transition name="slide-down">
      <div v-if="isExpanded" class="type-filter-mobile__chips-wrapper">
        <div class="type-filter-mobile__chips">
          <TypeChip
            v-for="type in POKEMON_TYPES"
            :key="type"
            :type="type"
            :active="selectedType === type"
            @click="handleTypeClick(type)"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, capitalize } from 'vue'
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
const isExpanded = ref(false)

watch(
  () => props.modelValue,
  (newVal) => {
    selectedType.value = newVal
  },
)

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const handleTypeClick = (type: PokemonTypeName) => {
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
.type-filter-mobile {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.type-filter-mobile__toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 14px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 8px;
  color: #e5e7eb;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(56, 189, 248, 0.5);
  }

  &--open {
    border-color: rgba(56, 189, 248, 0.6);
    background: rgba(56, 189, 248, 0.05);
  }
}

.type-filter-mobile__toggle-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.type-filter-mobile__badge {
  padding: 2px 8px;
  background: rgba(56, 189, 248, 0.2);
  border-radius: 999px;
  font-size: 12px;
  color: #38bdf8;
}

.type-filter-mobile__arrow {
  flex-shrink: 0;
  transition: transform 0.2s ease;

  &--rotated {
    transform: rotate(180deg);
  }
}

.type-filter-mobile__chips-wrapper {
  margin-top: 8px;
  width: 100%;
  max-width: 100%;
}

.type-filter-mobile__chips {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px 0;
}

/* Slide down animation */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-down-enter-from {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.slide-down-enter-to {
  opacity: 1;
  max-height: 200px;
  transform: translateY(0);
}

.slide-down-leave-from {
  opacity: 1;
  max-height: 200px;
  transform: translateY(0);
}

.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}
</style>
