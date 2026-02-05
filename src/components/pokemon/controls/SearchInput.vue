<template>
  <div class="search-input">
    <input
      type="text"
      :value="props.modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      placeholder="Search Pokémon by name..."
      class="search-input__field"
    />
    <button
      v-if="props.modelValue"
      @click="$emit('update:modelValue', '')"
      class="search-input__clear"
      aria-label="Clear search"
    >
      ✕
    </button>
    <span class="search-input__icon">🔍</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
}

interface Emits {
  (event: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<style scoped lang="scss">
.search-input {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input__field {
  width: 100%;
  padding: 10px 36px 10px 16px;
  font-size: 14px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.9);
  color: #e5e7eb;
  transition: all 0.2s ease;

  &::placeholder {
    color: rgba(148, 163, 184, 0.6);
  }

  &:focus {
    outline: none;
    border-color: rgba(56, 189, 248, 0.6);
    box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1);
  }
}

.search-input__icon {
  position: absolute;
  right: 12px;
  pointer-events: none;
  color: rgba(148, 163, 184, 0.5);
  font-size: 16px;
}

.search-input__clear {
  position: absolute;
  right: 28px;
  background: none;
  border: none;
  color: rgba(148, 163, 184, 0.6);
  cursor: pointer;
  padding: 4px 8px;
  font-size: 16px;
  transition: color 0.2s ease;

  &:hover {
    color: rgba(148, 163, 184, 0.9);
  }
}
</style>
