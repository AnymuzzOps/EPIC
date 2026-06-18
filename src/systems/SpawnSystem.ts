import { Unit } from '../entities/Unit';
import type { Faction } from '../types/GameTypes';
import { UNIT_DEFINITIONS } from '../data/units';
import { ENEMY_SPAWN_X, PLAYER_SPAWN_X } from '../utils/constants';

export class SpawnSystem {
  constructor(
    private scene: Phaser.Scene,
    private playerUnits: Unit[],
    private enemyUnits: Unit[],
  ) {}

  spawn(key: string, faction: Faction): Unit | undefined {
    const stats = UNIT_DEFINITIONS[key];

    if (!stats) {
      return undefined;
    }

    const unit = new Unit(this.scene, faction === 'player' ? PLAYER_SPAWN_X : ENEMY_SPAWN_X, faction, stats);
    const collection = faction === 'player' ? this.playerUnits : this.enemyUnits;
    collection.push(unit);

    return unit;
  }
}
