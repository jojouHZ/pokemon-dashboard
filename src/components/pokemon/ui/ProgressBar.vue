<template>
  <Transition name="toast">
    <div v-if="visible" class="toast-notification">
      <div class="toast-notification__content">
        <div v-if="!isComplete" class="toast-notification__loading">
          <div class="toast-notification__progress">
            <div class="toast-notification__progress-fill" :style="{ width: `${progress}%` }"></div>
          </div>
          <p class="toast-notification__text">
            {{ label }}
          </p>
        </div>
        <div v-else class="toast-notification__success">
          <span class="toast-notification__icon">✓</span>
          <p class="toast-notification__text">All Pokémon loaded successfully!</p>
        </div>
      </div>
      <button
        class="toast-notification__close"
        @click="$emit('close')"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Progress value (0-100) */
  progress: number
  /** Optional label text */
  label?: string
  /** Whether notification is visible */
  visible?: boolean
}

interface Emits {
  (event: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  visible: true,
})

defineEmits<Emits>()

const isComplete = computed(() => props.progress >= 100)
</script>

<style scoped lang="scss">
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.98);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 12px;
  padding: 16px 20px;
  min-width: 320px;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  display: flex;
  gap: 12px;
  align-items: flex-start;

  @media (max-width: 768px) {
    top: 12px;
    right: 12px;
    left: 12px;
    min-width: auto;
    max-width: none;
    padding: 14px 16px;
  }
}

.toast-notification__content {
  flex: 1;
}

.toast-notification__loading,
.toast-notification__success {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast-notification__success {
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.toast-notification__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(34, 197, 94, 0.2);
  border: 1px solid rgba(34, 197, 94, 0.4);
  border-radius: 50%;
  color: #22c55e;
  font-size: 16px;
  font-weight: bold;
  flex-shrink: 0;
}

.toast-notification__progress {
  width: 100%;
  height: 4px;
  background: rgba(148, 163, 184, 0.2);
  border-radius: 999px;
  overflow: hidden;
}

.toast-notification__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #56bdf8 100%);
  border-radius: 999px;
  transition: width 0.3s ease-out;
}

.toast-notification__text {
  color: rgba(148, 163, 184, 0.95);
  font-size: 13px;
  margin: 0;
  font-weight: 500;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 12px;
  }
}

.toast-notification__close {
  background: none;
  border: none;
  color: rgba(148, 163, 184, 0.6);
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(148, 163, 184, 0.1);
    color: rgba(148, 163, 184, 0.9);
  }
}

// Transition animations
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
