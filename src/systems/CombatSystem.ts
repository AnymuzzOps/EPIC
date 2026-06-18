import type { Damageable } from '../types/GameTypes';
import { Unit } from '../entities/Unit';
import { Projectile } from '../entities/Projectile';
import { Base } from '../entities/Base';

export class CombatSystem {
  constructor(
    private playerUnits: Unit[],
    private enemyUnits: Unit[],
    private projectiles: Projectile[],
    private playerBase: Base,
    private enemyBase: Base,
  ) {}

  update(deltaSeconds: number): void {
    this.updateUnits(this.playerUnits, this.enemyUnits, this.enemyBase, deltaSeconds);
    this.updateUnits(this.enemyUnits, this.playerUnits, this.playerBase, deltaSeconds);

    for (const projectile of [...this.projectiles]) {
      projectile.update(deltaSeconds);
    }

    this.cleanupDestroyedObjects();
  }

  private updateUnits(units: Unit[], enemies: Unit[], enemyBase: Base, deltaSeconds: number): void {
    for (const unit of [...units]) {
      unit.update(deltaSeconds, enemies as Damageable[], enemyBase, this.projectiles);
    }
  }

  private cleanupDestroyedObjects(): void {
    removeInactive(this.playerUnits);
    removeInactive(this.enemyUnits);
    removeInactive(this.projectiles);
  }
}

function removeInactive<T extends Phaser.GameObjects.GameObject>(items: T[]): void {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (!items[index].active) {
      items.splice(index, 1);
    }
  }
}
