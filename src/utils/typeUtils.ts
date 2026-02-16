import type { PokemonTypeName } from '@/types/pokemon'

export const isAllTypeSelected = (selectedTypes: PokemonTypeName[]): boolean => {
  return selectedTypes.length === 0
}

export const createTypeSet = (selectedTypes: PokemonTypeName[]): Set<PokemonTypeName> => {
  return new Set(selectedTypes)
}

export const toggleType = (
  selectedTypes: PokemonTypeName[],
  type: PokemonTypeName,
): PokemonTypeName[] => {
  const index = selectedTypes.indexOf(type)

  if (index > -1) {
    return selectedTypes.filter((_, i) => i !== index)
  } else {
    return [...selectedTypes, type]
  }
}

export const clearAllTypes = (): PokemonTypeName[] => {
  return []
}
