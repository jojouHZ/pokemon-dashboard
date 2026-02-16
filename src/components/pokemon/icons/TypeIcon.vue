<template>
  <svg
    class="type-icon"
    :class="`type-icon--${size}`"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path :d="iconData.path" :fill="iconData.fill" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PokemonTypeName } from '@/types/pokemon'
import { POKEMON_ICON_DATA } from '@/data/pokemonIconPaths'

interface Props {
  type: PokemonTypeName
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'small',
})

const iconData = computed(() => POKEMON_ICON_DATA[props.type])
</script>

<style scoped lang="scss">
.type-icon {
  display: inline-block;
  vertical-align: middle;

  &--small {
    width: 16px;
    height: 16px;
  }

  &--medium {
    width: 20px;
    height: 20px;
  }

  &--large {
    width: 24px;
    height: 24px;
  }
}
</style>
