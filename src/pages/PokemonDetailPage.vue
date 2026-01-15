<template>
  <div class="pokemon-detail-page">
    <div class="pokemon-detail-page__container">
      <PokemonDetailView />
    </div>
  </div>
</template>

<script setup lang="ts">
import PokemonDetailView from '@/views/pokemon/PokemonDetailView.vue'
</script>

<style scoped lang="scss">
.pokemon-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

.pokemon-detail-page__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
</style>
