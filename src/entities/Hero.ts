import type { Faction, HeroStats } from '../types/GameTypes';
import { Unit } from './Unit';

export class Hero extends Unit {
  abilityKey: string;

  constructor(scene: Phaser.Scene, x: number, faction: Faction, stats: HeroStats) {
    super(scene, x, faction, { ...stats, cost: 0 });
    this.abilityKey = stats.abilityKey;
    this.setScale(1.18);
  }
}
