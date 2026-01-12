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
    description: 'Спецатака; влияет на урон специальных (магических/энергетических) приёмов.',
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
    description: 'Скорость; определяет порядок хода в бою (кто атакует первым при прочих равных).',
    impact: 'Влияет на инициативу в бою',
  },
}

export interface PokemonArchetype {
  name: string
  description: string
  indicators: string[]
  strengths: string[]
  weaknesses: string[]
}

export const ARCHETYPES: PokemonArchetype[] = [
  {
    name: 'Физический дамагер (Glass Cannon)',
    description: 'Высокая атака и скорость, низкая защита',
    indicators: ['Высокий Attack', 'Высокий Speed', 'Низкий Defense/Sp.Def'],
    strengths: ['Быстро наносит мощные удары', 'Может победить врага до контрудара'],
    weaknesses: ['Не переживет несколько попаданий', 'Требует правильного позиционирования'],
  },
  {
    name: 'Танк/Стоун-волл',
    description: 'Высокое HP и защита, низкая атака',
    indicators: ['Высокий HP', 'Высокий Defense/Sp.Def', 'Низкий Attack/Sp.Atk'],
    strengths: ['Может поглотить много урона', 'Отлично работает в защите'],
    weaknesses: ['Медленно наносит урон', 'Может застрять в боях'],
  },
  {
    name: 'Специальный спидстер',
    description: 'Высокая спецатака и скорость',
    indicators: ['Высокая Special Attack', 'Высокая Speed', 'Низкий Attack'],
    strengths: ['Атакует специальными приемами до хода противника', 'Игнорирует физическую защиту'],
    weaknesses: ['Уязвим к специальным атакам', 'Может быть замедлен'],
  },
  {
    name: 'Сбалансированный персонаж',
    description: 'Равномерное распределение статов',
    indicators: ['Все статы примерно на одном уровне'],
    strengths: ['Универсален в различных ситуациях', 'Хорошая гибкость в тактике'],
    weaknesses: ['Не имеет явного приоритета', 'Уступает специалистам в их сфере'],
  },
]

export function detectArchetype(stats: Record<string, number>): PokemonArchetype | null {
  const atk = stats['attack'] || 0
  const def = stats['defense'] || 0
  const spAtk = stats['special-attack'] || 0
  const spDef = stats['special-defense'] || 0
  const spd = stats['speed'] || 0
  const hp = stats['hp'] || 0

  // Физический дамагер
  if (atk > 100 && spd > 90 && def < 80 && spDef < 80) {
    return ARCHETYPES[0]
  }

  // Танк
  if (hp > 100 && (def > 100 || spDef > 100) && atk < 80 && spAtk < 80) {
    return ARCHETYPES[1]
  }

  // Специальный спидстер
  if (spAtk > 100 && spd > 90 && atk < 80) {
    return ARCHETYPES[2]
  }

  // Сбалансированный (по умолчанию)
  return ARCHETYPES[3]
}
