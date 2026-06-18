import type { HeroStats } from '../types/GameTypes';

export const HEROES: Record<string, HeroStats> = {
  guardian: {
    key: 'guardian',
    name: 'Campeón del Olimpo',
    maxHp: 350,
    damage: 25,
    speed: 28,
    range: 50,
    attackCooldown: 1.3,
    color: 0xf2c94c,
    attackType: 'melee',
    abilityKey: 'arcaneBlast',
  },
};
