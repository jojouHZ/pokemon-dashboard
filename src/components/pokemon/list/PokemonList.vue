<template>
  <div class="pokemon-list">
    <!-- Loading state -->
    <div v-if="listStore.loading" class="pokemon-list__loading">
      <div class="spinner"></div>
      <p>Loading Pokémon...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="listStore.error" class="pokemon-list__error">
      <p>❌ {{ listStore.error }}</p>
      <button @click="listStore.loadPokemonList()" class="pokemon-list__retry">Try Again</button>
    </div>

    <!-- Empty state -->
    <div v-else-if="listStore.displayedPokemon.length === 0" class="pokemon-list__empty">
      <p>No Pokémon found</p>
    </div>

    <!-- Main grid -->
    <div v-else class="pokemon-list__content">
      <div class="pokemon-list__grid">
        <PokemonListItem
          v-for="pokemon in listStore.displayedPokemon"
          :key="pokemon.id"
          :pokemon="pokemon"
          @select="selectPokemon"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PokemonListItem as PokemonListItemType } from '@/types/pokemon'
import { usePokemonListStore } from '@/stores/pokemonListStore'
import { PokemonListItem } from '@/components/pokemon/list'
import { useRouter } from 'vue-router'

const listStore = usePokemonListStore()
const router = useRouter()

const selectPokemon = (pokemon: PokemonListItemType) => {
  router.push(`/pokemon/${pokemon.name}`)
}
</script>

<style scoped lang="scss">
.pokemon-list {
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 14px;
  }
}
.pokemon-list__content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pokemon-list__loading,
.pokemon-list__error,
.pokemon-list__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  color: rgba(148, 163, 184, 0.8);
  font-size: 15px;

  @media (max-width: 768px) {
    padding: 40px 16px;
    font-size: 14px;
  }
}

.pokemon-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  padding: 4px 0 8px;
}
</style>
