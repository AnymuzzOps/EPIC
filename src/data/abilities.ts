import type { AbilityConfig } from '../types/GameTypes';

export const ABILITIES: Record<string, AbilityConfig> = {
  arcaneBlast: {
    key: 'arcaneBlast',
    name: 'Arcane Blast',
    cost: 40,
    cooldown: 12,
    damage: 60,
    area: 120,
  },
};
