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
  const hp = stats['hp'] ?? 0
  const atk = stats['attack'] ?? 0
  const def = stats['defense'] ?? 0
  const spAtk = stats['special-attack'] ?? 0
  const spDef = stats['special-defense'] ?? 0
  const spd = stats['speed'] ?? 0

  if (!hp && !atk && !def && !spAtk && !spDef && !spd) {
    return null
  }

  const allStats = [hp, atk, def, spAtk, spDef, spd]
  const average = allStats.reduce((a, b) => a + b, 0) / allStats.length

  const getDeviation = (stat: number): number => {
    if (average === 0) return 0
    return ((stat - average) / average) * 100
  }

  const hpDev = getDeviation(hp)
  const atkDev = getDeviation(atk)
  const defDev = getDeviation(def)
  const spAtkDev = getDeviation(spAtk)
  const spDefDev = getDeviation(spDef)
  const spdDev = getDeviation(spd)

  if (atkDev > 5 && spdDev > 5 && defDev < -5) return ARCHETYPES[0] ?? null
  if (hpDev > 5 && (defDev > 5 || spDefDev > 5) && atkDev < 0) return ARCHETYPES[1] ?? null
  if (spAtkDev > 5 && spdDev > 5) return ARCHETYPES[2] ?? null
  return ARCHETYPES[3] ?? null
}
