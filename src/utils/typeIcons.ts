import type { PokemonTypeName } from '@/types/pokemon'

/**
 * Цветовая палитра для типов (синхронизирована с _variables.scss)
 */
export const TYPE_COLORS: Record<PokemonTypeName, string> = {
  normal: '#a8a29e', // из $type-rock (нейтральный серый)
  fire: '#f97316', // $type-fire
  water: '#3b82f6', // $type-water
  electric: '#eab308', // $type-electric
  grass: '#22c55e', // $type-grass
  ice: '#38bdf8', // $type-ice
  fighting: '#ef4444', // $type-fighting
  poison: '#a855f7', // $type-poison
  ground: '#ca8a04', // $type-ground
  flying: '#818cf8', // $type-flying
  psychic: '#ec4899', // $type-psychic
  bug: '#84cc16', // $type-bug
  rock: '#a8a29e', // $type-rock
  ghost: '#6366f1', // $type-ghost
  dragon: '#0ea5e9', // $type-dragon
  dark: '#111827', // $type-dark
  steel: '#9ca3af', // $type-steel
  fairy: '#fb7185', // $type-fairy
}

/**
 * Get CSS-class modifier for type
 */
export const getTypeClass = (type: PokemonTypeName): string => {
  return `type--${type}`
}

/**
 * Get the type color
 */
export const getTypeColor = (type: PokemonTypeName): string => {
  return TYPE_COLORS[type] || '#68A090'
}
