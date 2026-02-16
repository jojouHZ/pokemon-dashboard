export interface Pokemon {
  id: number
  name: string
  height: number
  weight: number
  image: string
  types: string[]
  stats: PokemonStat[]
}

export type StatKey = 'hp' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed'

export type PokemonStat = {
  label: string
  value: number
}

export type PokemonTypeName =
  | 'normal'
  | 'fire'
  | 'water'
  | 'grass'
  | 'electric'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy'

export const POKEMON_TYPES: readonly PokemonTypeName[] = [
  'normal',
  'fire',
  'water',
  'grass',
  'electric',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
] as const
