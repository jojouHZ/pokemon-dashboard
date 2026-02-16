<template>
  <button
    class="type-chip"
    :class="{
      [`type-chip--${type}`]: !isAll,
      'type-chip--all': isAll,
      'type-chip--active': active,
    }"
    @click="$emit('click')"
  >
    <TypeIcon v-if="!isAll && pokemonType" :type="pokemonType" :size="size" />
    <span class="type-chip__label">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PokemonTypeName } from '@/types/pokemon'
import { TypeIcon } from '@/components/pokemon/icons'

interface Props {
  type: PokemonTypeName | 'all'
  active?: boolean
  size?: 'small' | 'medium'
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  size: 'small',
})

defineEmits<{
  (event: 'click'): void
}>()

const isAll = computed(() => props.type === 'all')

const pokemonType = computed(() => {
  return props.type !== 'all' ? props.type : undefined
})

const label = computed(() => {
  if (isAll.value) return 'All'
  return props.type.charAt(0).toUpperCase() + props.type.slice(1)
})
</script>

<style scoped lang="scss">
.type-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(148, 163, 184, 0.1);
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 999px;
  color: #e5e7eb;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  user-select: none;
  width: auto;
  flex-shrink: 0;

  &:hover {
    background: rgba(148, 163, 184, 0.15);
    border-color: rgba(148, 163, 184, 0.4);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &--all {
    background: rgba(99, 102, 241, 0.15);
    border-color: rgba(99, 102, 241, 0.3);
    color: #818cf8;
    font-weight: 600;

    &:hover {
      background: rgba(99, 102, 241, 0.2);
      border-color: rgba(99, 102, 241, 0.4);
    }
  }

  &--active {
    background: rgba(56, 189, 248, 0.2);
    border-color: rgba(56, 189, 248, 0.5);
    color: #38bdf8;
    box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1);

    &:hover {
      background: rgba(56, 189, 248, 0.25);
      border-color: rgba(56, 189, 248, 0.6);
    }
  }

  &--all.type-chip--active {
    background: rgba(99, 102, 241, 0.25);
    border-color: rgba(99, 102, 241, 0.6);
    color: #a5b4fc;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }

  &__label {
    line-height: 1;
  }

  // Touch optimization for mobile
  @media (max-width: 768px) {
    padding: 8px 12px; // mobile
    font-size: 13px;
    min-height: 40px; // iOS touch target
  }
}
</style>
