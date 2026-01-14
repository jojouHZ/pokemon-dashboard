export interface PokemonArchetype {
  name: string
  description: string
  indicators: string[]
  strengths: string[]
  weaknesses: string[]
}

export interface StatDescription {
  name: string
  shortName: string
  description: string
  impact: string
}

export const STAT_DESCRIPTIONS: Record<string, StatDescription> = {
  hp: {
    name: 'HP (Hit Points)',
    shortName: 'HP',
    description:
      'Количество здоровья; определяет, сколько урона покемон может получить до нокаута.',
    impact: 'Влияет на общую выносливость в бою',
  },
  attack: {
    name: 'Attack',
    shortName: 'ATK',
    description: 'Физическая атака; влияет на урон физических приёмов.',
    impact: 'Определяет мощь физических ударов',
  },
  defense: {
    name: 'Defense',
    shortName: 'DEF',
    description: 'Физическая защита; снижает урон от физических приёмов соперника.',
    impact: 'Смягчает входящий физический урон',
  },
  'special-attack': {
    name: 'Special Attack',
    shortName: 'SP.ATK',
    description: 'Спецатака; влияет на урон специальных приёмов.',
    impact: 'Определяет мощь специальных приёмов',
  },
  'special-defense': {
    name: 'Special Defense',
    shortName: 'SP.DEF',
    description: 'Спецзащита; снижает урон от специальных приёмов.',
    impact: 'Смягчает входящий специальный урон',
  },
  speed: {
    name: 'Speed',
    shortName: 'SPD',
    description: 'Скорость; определяет порядок хода в бою.',
    impact: 'Влияет на инициативу в бою',
  },
}

export const ARCHETYPES: PokemonArchetype[] = [
  {
    name: 'Физический дамагер',
    description: 'Высокая атака и скорость, низкая защита',
    indicators: ['Высокий ATK', 'Высокий SPD', 'Низкий DEF'],
    strengths: ['Мощные удары', 'Быстрый урон'],
    weaknesses: ['Низкая защита'],
  },
  {
    name: 'Танк',
    description: 'Высокое HP и защита, низкая атака',
    indicators: ['Высокий HP', 'Высокий DEF/SP.DEF'],
    strengths: ['Высокая выживаемость'],
    weaknesses: ['Малый урон'],
  },
  {
    name: 'Специальный спидстер',
    description: 'Спецатака и скорость',
    indicators: ['Высокий SP.ATK', 'Высокий SPD'],
    strengths: ['Сильная магия'],
    weaknesses: ['Физическая слабость'],
  },
  {
    name: 'Сбалансированный',
    description: 'Равномерное распределение статов',
    indicators: ['Все статы средние'],
    strengths: ['Универсальность'],
    weaknesses: ['Нет специализации'],
  },
]

export function detectArchetype(stats: Record<string, number>): PokemonArchetype | null {
  const atk = stats['attack'] || 0
  const def = stats['defense'] || 0
  const spAtk = stats['special-attack'] || 0
  const spd = stats['speed'] || 0
  const hp = stats['hp'] || 0

  const a0 = ARCHETYPES[0]
  const a1 = ARCHETYPES[1]
  const a2 = ARCHETYPES[2]

  if (atk >= 100 && spd >= 90 && def <= 80 && a0) return a0
  if (hp >= 100 && def >= 100 && atk <= 80 && a1) return a1
  if (spAtk >= 100 && spd >= 90 && a2) return a2

  return null
}
