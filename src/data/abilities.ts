import type { AbilityConfig } from '../types/GameTypes';

export const ABILITIES: Record<string, AbilityConfig> = {
  arcaneBlast: {
    key: 'arcaneBlast',
    name: 'Rayo de Zeus',
    cost: 40,
    cooldown: 12,
    damage: 60,
    area: 120,
  },
};
