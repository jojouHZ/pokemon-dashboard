<template>
  <section class="pokemon-detail">
    <div class="pokemon-detail__hero">
      <div class="pokemon-detail__hero-bg" />

      <div class="pokemon-detail__meta">
        <p class="pokemon-detail__id">#025</p>
        <h2 class="pokemon-detail__name">Pikachu</h2>
        <div class="pokemon-detail__types">
          <span class="type-badge type-badge--electric">Electric</span>
        </div>
      </div>

      <div class="pokemon-detail__image-wrap">
        <img
          class="pokemon-detail__image"
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
          alt="Pikachu"
        />
      </div>
    </div>

    <div class="pokemon-detail__body">
      <div class="pokemon-detail__info">
        <h3 class="pokemon-detail__section-title">Profile</h3>
        <dl class="pokemon-detail__info-grid">
          <div>
            <dt>Height</dt>
            <dd>0.4 m</dd>
          </div>
          <div>
            <dt>Weight</dt>
            <dd>6.0 kg</dd>
          </div>
          <div>
            <dt>Base XP</dt>
            <dd>112</dd>
          </div>
        </dl>
      </div>

      <div class="pokemon-detail__stats">
        <PokemonStatsPanel :stats="mockStats" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import PokemonStatsPanel from './PokemonStatsPanel.vue'
import type { PokemonStat } from '@/types/pokemon'

const mockStats: PokemonStat[] = [
  { key: 'hp', label: 'HP', value: 35 },
  { key: 'attack', label: 'Attack', value: 55 },
  { key: 'defense', label: 'Defense', value: 40 },
  { key: 'special-attack', label: 'Sp. Atk', value: 50 },
  { key: 'special-defense', label: 'Sp. Def', value: 50 },
  { key: 'speed', label: 'Speed', value: 90 },
]
</script>

<style scoped lang="scss">
.pokemon-detail {
  border-radius: 28px;
  padding: 18px 18px 20px;
  background:
    radial-gradient(circle at top, rgba(56, 189, 248, 0.18), transparent 55%),
    rgba(15, 23, 42, 0.96);
  border: 1px solid rgba(148, 163, 184, 0.28);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.9);
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__hero {
    position: relative;
    overflow: hidden;
    border-radius: 22px;
    padding: 18px 18px 12px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  &__hero-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 20% 0%, rgba(248, 250, 252, 0.12), transparent 55%),
      radial-gradient(circle at 80% 20%, rgba(250, 204, 21, 0.16), transparent 60%),
      radial-gradient(circle at 50% 110%, rgba(30, 64, 175, 0.7), rgba(15, 23, 42, 1));
    opacity: 0.95;
  }

  &__meta,
  &__image-wrap {
    position: relative;
    z-index: 1;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__id {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(148, 163, 184, 0.9);
  }

  &__name {
    font-size: 24px;
    letter-spacing: -0.03em;
  }

  &__types {
    display: flex;
    gap: 6px;
  }

  &__image-wrap {
    width: 150px;
    height: 150px;
    border-radius: 999px;
    background: radial-gradient(circle at 30% 20%, rgba(250, 250, 250, 0.9), transparent 60%);
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateY(8px);
  }

  &__image {
    width: 132px;
    height: auto;
    filter: drop-shadow(0 18px 28px rgba(15, 23, 42, 0.85));
  }

  &__body {
    display: grid;
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    gap: 20px;
  }

  &__section-title {
    font-size: 13px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(148, 163, 184, 0.9);
    margin-bottom: 8px;
  }

  &__info-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    font-size: 13px;

    dt {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: rgba(148, 163, 184, 0.85);
    }

    dd {
      margin: 2px 0 0;
      font-weight: 500;
    }
  }

  &__stats {
    min-height: 180px;
  }
}

.type-badge {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(248, 250, 252, 0.18);
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(12px);

  &--electric {
    background: linear-gradient(135deg, rgba(234, 179, 8, 0.4), rgba(245, 245, 245, 0.02));
    border-color: rgba(250, 204, 21, 0.6);
  }
}
</style>
