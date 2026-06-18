export type Faction = 'player' | 'enemy';
export type UnitState = 'moving' | 'attacking' | 'dead';
export type AttackType = 'melee' | 'ranged' | 'magic';

export interface UnitStats {
  key: string;
  name: string;
  cost: number;
  maxHp: number;
  damage: number;
  speed: number;
  range: number;
  attackCooldown: number;
  color: number;
  attackType: AttackType;
  projectileColor?: number;
}

export interface HeroStats extends Omit<UnitStats, 'cost'> {
  abilityKey: string;
}

export interface AbilityConfig {
  key: string;
  name: string;
  cost: number;
  cooldown: number;
  damage: number;
  area: number;
}

export interface LevelConfig {
  key: string;
  name: string;
  enemyBaseHp: number;
  playerBaseHp: number;
  rewardCoins: number;
}

export interface SaveData {
  coins: number;
  campaignLevel: number;
  upgrades: Record<string, number>;
}

export interface Damageable {
  active: boolean;
  x: number;
  y: number;
  faction: Faction;
  receiveDamage(amount: number): void;
  isDefeated(): boolean;
}
