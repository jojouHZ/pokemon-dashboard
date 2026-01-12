<template>
  <div class="pokemon-detail">
    <div v-if="store.loading" class="pokemon-detail__loading">Loading...</div>

    <div v-else-if="store.error" class="pokemon-detail__error">
      {{ store.error }}
    </div>

    <div v-else-if="store.current" class="pokemon-detail__content">
      <PokemonDetailCard :pokemon="store.current" />
      <PokemonStatsPanel :stats="store.current.stats" />
    </div>

    <div v-else class="pokemon-detail__empty">No Pokemon loaded</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { usePokemonStore } from '@/stores/pokemonStore'
import PokemonDetailCard from '@/components/pokemon/PokemonDetailCard.vue'
import PokemonStatsPanel from '@/components/pokemon/PokemonStatsPanel.vue'

const store = usePokemonStore()

onMounted(() => {
  store.loadPokemon('Bulbasaur')
})
</script>

<style scoped lang="scss">
.pokemon-detail {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__loading,
  &__error,
  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    font-size: 16px;
    color: rgba(148, 163, 184, 0.9);
  }

  &__error {
    color: #ff6b6b;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
</style>
