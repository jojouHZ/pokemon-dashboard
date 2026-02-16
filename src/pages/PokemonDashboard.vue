<template>
  <div class="pokemon-dashboard">
    <!-- ===== MOBILE/TABLET: sticky header + mobile controls ===== -->
    <div
      v-if="headerIsSticky"
      class="pokemon-dashboard__sticky-container pokemon-dashboard__sticky-container--sticky"
      :class="{
        'pokemon-dashboard__sticky-container--hidden': headerIsHidden,
      }"
    >
      <DashboardHeader
        title="Pokémon Dashboard"
        :subtitle="`Explore all ${totalPokemonCount} Pokémon`"
        :is-sticky="false"
        :is-hidden="false"
      />

      <div class="pokemon-dashboard__controls-wrapper pokemon-dashboard__controls-wrapper--mobile">
        <PokemonControlsMobile
          :search-query="searchQuery"
          :selected-types="selectedTypes"
          :is-all-active="listStore.isAllActive"
          @search="setSearchQuery"
          @toggle-type="toggleSelectedType"
          @clear-types="clearSelectedTypes"
          @clear="clearFilters"
        />
      </div>
    </div>

    <!-- Spacer для sticky header + mobile controls -->
    <div v-if="headerIsSticky" class="pokemon-dashboard__sticky-spacer"></div>

    <!-- ===== DESKTOP: common header ===== -->
    <DashboardHeader
      v-if="!headerIsSticky"
      title="Pokémon Dashboard"
      :subtitle="`Explore all ${totalPokemonCount} Pokémon`"
      :is-sticky="false"
      :is-hidden="false"
    />
    <!-- ===== DESKTOP: controls ===== -->
    <div
      v-if="!headerIsSticky"
      class="pokemon-dashboard__controls-wrapper pokemon-dashboard__controls-wrapper--desktop"
    >
      <PokemonControlsDesktop
        :search-query="searchQuery"
        :selected-types="selectedTypes"
        :is-all-active="listStore.isAllActive"
        :total-results="totalResults"
        @search="setSearchQuery"
        @toggle-type="toggleSelectedType"
        @clear-types="clearSelectedTypes"
        @clear="clearFilters"
      />
    </div>

    <main class="pokemon-dashboard__main">
      <section class="pokemon-dashboard__content">
        <PokemonList
          :items="displayedPokemon"
          :loading="listStore.loading"
          :error="listStore.error"
          @retry="handleRetry"
          @select="handleSelectPokemon"
        />
      </section>

      <section v-if="usePagination">
        <PokemonPagination
          :current-page="listStore.currentPage"
          :total-pages="listStore.totalPages"
          :total-items="totalResults"
          :items-per-page="itemsPerPage"
          @page-change="listStore.setPage"
        />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  PokemonControlsDesktop,
  PokemonControlsMobile,
  PokemonList,
  PokemonPagination,
  DashboardHeader,
} from '@/components/pokemon'
import { usePokemonDashboard } from '@/composables'

const {
  searchQuery,
  selectedTypes,
  totalResults,
  displayedPokemon,
  totalPokemonCount,
  usePagination,
  itemsPerPage,
  headerIsSticky,
  headerIsHidden,
  listStore,
  setSearchQuery,
  toggleSelectedType,
  clearSelectedTypes,
  clearFilters,
  handleRetry,
  handleSelectPokemon,
} = usePokemonDashboard()
</script>

<style scoped lang="scss">
.pokemon-dashboard {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;

  @media (min-width: 1024px) and (min-height: 750px) {
    max-height: 100vh;
    overflow: hidden;
  }
}

/* Sticky header + mobile controls */
.pokemon-dashboard__sticky-container {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.pokemon-dashboard__sticky-container--sticky {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(15, 23, 42, 0.98);
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
}

.pokemon-dashboard__sticky-container--hidden {
  transform: translateY(-100%);
}

.pokemon-dashboard__controls-wrapper {
  &--mobile {
    padding: 0 16px 10px;

    @media (max-width: 768px) {
      padding: 0 12px 8px;
    }
  }

  &--desktop {
    max-width: 1600px;
    width: 100%;
    align-self: center;
    padding: 0 16px 8px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.18);
  }
}

.pokemon-dashboard__sticky-spacer {
  height: 210px;

  @media (max-width: 768px) {
    height: 210px;
  }
}

.pokemon-dashboard__main {
  max-width: 1600px;
  width: 100%;
  align-self: center;
  padding: 0 16px 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 768px) {
    padding: 0 12px 12px;
  }
}

.pokemon-dashboard__content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;

  @media (min-width: 1024px) and (min-height: 750px) {
    overflow-y: auto;
    padding-right: 4px;
  }
}
</style>
