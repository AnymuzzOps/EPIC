import Phaser from 'phaser';
import type { Damageable, Faction } from '../types/GameTypes';

const IMPACT_DISTANCE = 12;

export class Projectile extends Phaser.GameObjects.Arc {
  target: Damageable;
  damage: number;
  speed: number;
  faction: Faction;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    target: Damageable,
    damage: number,
    color: number,
    faction: Faction,
    speed = 330,
  ) {
    super(scene, x, y, 6, 0, 360, false, color);

    this.target = target;
    this.damage = damage;
    this.speed = speed;
    this.faction = faction;

    scene.add.existing(this);
  }

  update(deltaSeconds: number): void {
    if (!this.active) {
      return;
    }

    if (!this.target.active || this.target.isDestroyed()) {
      this.destroy();
      return;
    }

    const distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);

    if (distance <= IMPACT_DISTANCE) {
      this.target.receiveDamage(this.damage);
      this.destroy();
      return;
    }

    if (distance === 0) {
      return;
    }

    const step = Math.min(this.speed * deltaSeconds, distance);
    this.x += ((this.target.x - this.x) / distance) * step;
    this.y += ((this.target.y - this.y) / distance) * step;
  }
}
