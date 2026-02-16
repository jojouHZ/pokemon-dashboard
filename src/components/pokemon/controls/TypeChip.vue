<template>
  <button
    class="type-chip"
    :class="[`type-chip--${type}`, { 'type-chip--active': active }]"
    @click="$emit('click')"
  >
    <TypeIcon :type="type" :size="size" />
    <span class="type-chip__label">{{ capitalize(type) }}</span>
  </button>
</template>

<script setup lang="ts">
import { capitalize } from 'vue'
import type { PokemonTypeName } from '@/types/pokemon'
import { TypeIcon } from '@/components/pokemon/icons'

interface Props {
  type: PokemonTypeName
  active?: boolean
  size?: 'small' | 'medium'
}

withDefaults(defineProps<Props>(), {
  active: false,
  size: 'small',
})

defineEmits<{
  (event: 'click'): void
}>()
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
}

.type-chip__label {
  line-height: 1;
}

/* Touch optimization for mobile */
@media (max-width: 768px) {
  .type-chip {
    padding: 8px 12px; // на mobile можно больше для тача
    font-size: 13px;
    min-height: 40px; /* iOS touch target */
  }
}
</style>
