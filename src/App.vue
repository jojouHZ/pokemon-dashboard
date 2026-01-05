<template>
  <div class="app">
    <aside class="app__sidebar">
      <div class="app__logo">
        <span class="app__logo-dot" />
        <span class="app__logo-text">Pokedex Dashboard</span>
      </div>
      <nav class="app__nav">
        <button class="app__nav-item app__nav-item--active">
          Dashboard
        </button>
        <button class="app__nav-item">
          Pokédex
        </button>
      </nav>
    </aside>

    <main class="app__main">
      <header class="app__header">
        <div>
          <h1 class="app__title">Pokémon Dashboard</h1>
          <p class="app__subtitle">
            Explore Pokémon stats and build your own layout.
          </p>
        </div>
      </header>

      <section class="app__content">
        <!-- Widgets/pages here -->
        <RouterView />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.app {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  min-height: 100vh;
  background: transparent;

  &__sidebar {
    padding: 20px 16px;
    border-right: 1px solid rgba(148, 163, 184, 0.22);
    backdrop-filter: blur(18px);
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.88));
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 24px;

    &-dot {
      width: 14px;
      height: 14px;
      border-radius: 999px;
      background: radial-gradient(circle at 30% 30%, #f97316, #7c2d12);
      box-shadow: 0 0 18px rgba(248, 113, 113, 0.8);
    }

    &-text {
      font-size: 14px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: rgba(226, 232, 240, 0.86);
    }
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__nav-item {
    text-align: left;
    border-radius: 999px;
    border: 1px solid transparent;
    padding: 7px 12px;
    font-size: 12px;
    color: rgba(148, 163, 184, 0.9);
    background: transparent;
    cursor: pointer;
    transition: 0.15s border-color ease, 0.15s background-color ease, 0.15s color ease;

    &--active {
      border-color: rgba(148, 163, 184, 0.4);
      background: radial-gradient(circle at top left, rgba(56, 189, 248, 0.3), transparent 50%),
        rgba(15, 23, 42, 0.9);
      color: #e5e7eb;
    }

    &:hover:not(&--active) {
      border-color: rgba(148, 163, 184, 0.3);
      background: rgba(15, 23, 42, 0.7);
    }
  }

  &__main {
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  &__title {
    font-size: 24px;
    letter-spacing: -0.03em;
  }

  &__subtitle {
    margin-top: 4px;
    font-size: 13px;
    color: rgba(148, 163, 184, 0.9);
  }

  &__content {
    margin-top: 8px;
  }
}
</style>