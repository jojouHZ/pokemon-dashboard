import type { Pokemon } from './detail'
import type { PokemonListItem } from './list'
import type { PokemonStat } from './detail'

export function isPokemonStat(data: unknown): data is PokemonStat {
  return (
    typeof data === 'object' &&
    data !== null &&
    'label' in data &&
    'value' in data &&
    typeof (data as PokemonStat).label === 'string' &&
    typeof (data as PokemonStat).value === 'number'
  )
}

export function isPokemon(data: unknown): data is Pokemon {
  if (typeof data !== 'object' || data === null) return false

  const pokemon = data as Pokemon

  return (
    typeof pokemon.id === 'number' &&
    typeof pokemon.name === 'string' &&
    typeof pokemon.height === 'number' &&
    typeof pokemon.weight === 'number' &&
    typeof pokemon.image === 'string' &&
    Array.isArray(pokemon.types) &&
    pokemon.types.every((type) => typeof type === 'string') &&
    Array.isArray(pokemon.stats) &&
    pokemon.stats.every(isPokemonStat)
  )
}

export function isPokemonListItem(data: unknown): data is PokemonListItem {
  if (typeof data !== 'object' || data === null) return false

  const item = data as PokemonListItem

  return (
    typeof item.id === 'number' &&
    typeof item.name === 'string' &&
    typeof item.image === 'string' &&
    Array.isArray(item.types) &&
    item.types.every((type) => typeof type === 'string')
  )
}

export function isPokemonArray(data: unknown): data is Pokemon[] {
  return Array.isArray(data) && data.every(isPokemon)
}

export function isPokemonListItemArray(data: unknown): data is PokemonListItem[] {
  return Array.isArray(data) && data.every(isPokemonListItem)
}
