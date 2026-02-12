<template>
  <header
    class="dashboard-header"
    :class="{
      'dashboard-header--sticky': isSticky,
      'dashboard-header--hidden': isHidden,
    }"
  >
    <div class="dashboard-header__content">
      <span class="dashboard-header__emoji">{{ emoji }}</span>
      <div class="dashboard-header__text">
        <h1 class="dashboard-header__title">{{ title }}</h1>
        <p v-if="subtitle" class="dashboard-header__subtitle">{{ subtitle }}</p>
      </div>
    </div>
  </header>

  <!-- Spacer to prevent content jump when header becomes fixed -->
  <div v-if="isSticky" class="dashboard-header__spacer"></div>
</template>

<script setup lang="ts">
interface Props {
  /** Header title */
  title: string
  /** Optional subtitle */
  subtitle?: string
  /** Emoji icon */
  emoji?: string
  /** Whether header should be sticky */
  isSticky?: boolean
  /** Whether header should be hidden (when scrolling down) */
  isHidden?: boolean
}

withDefaults(defineProps<Props>(), {
  emoji: '🐾',
  isSticky: false,
  isHidden: false,
})
</script>

<style scoped lang="scss">
.dashboard-header {
  max-width: 1600px;
  margin: 0 auto 16px;
  padding: 24px 24px 12px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    padding: 12px 16px 8px;
    margin: 0 auto 8px;
  }
}

.dashboard-header__content {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;

  @media (max-width: 768px) {
    align-items: center;
    gap: 8px;
  }
}

.dashboard-header__emoji {
  font-size: 2.5rem;
  display: inline-block;
  flex-shrink: 0;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
}

.dashboard-header__text {
  display: flex;
  flex-direction: column;
  gap: 2px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: baseline;
    gap: 8px;
  }
}

.dashboard-header__title {
  font-size: clamp(2.2rem, 3.5vw, 3rem);
  font-weight: 700;
  background: linear-gradient(135deg, #56bdf8 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 6px 0;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin: 0;
  }
}

.dashboard-header__subtitle {
  color: rgba(148, 163, 184, 0.85);
  font-size: 1rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
}
</style>
