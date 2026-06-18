import Phaser from 'phaser';
import type { AttackType, Damageable, Faction } from '../types/GameTypes';

const IMPACT_DISTANCE = 12;

export class Projectile extends Phaser.GameObjects.Container {
  target: Damageable;
  damage: number;
  speed: number;
  faction: Faction;

  private projectileShape: Phaser.GameObjects.Shape;
  private trail?: Phaser.GameObjects.Shape;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    target: Damageable,
    damage: number,
    color: number,
    faction: Faction,
    attackType: AttackType = 'ranged',
    speed = 330,
  ) {
    super(scene, x, y);

    this.target = target;
    this.damage = damage;
    this.speed = speed;
    this.faction = faction;

    const direction = faction === 'player' ? 1 : -1;
    if (attackType === 'ranged') {
      this.projectileShape = scene.add.line(0, 0, -12 * direction, 0, 14 * direction, 0, color).setLineWidth(3);
      this.trail = scene.add.triangle(-18 * direction, 0, -5 * direction, -5, -5 * direction, 5, -15 * direction, 0, 0xf4e6bd, 0.9);
      this.add([this.projectileShape, this.trail]);
    } else {
      this.trail = scene.add.circle(-9 * direction, 0, 8, color, 0.25);
      this.projectileShape = scene.add.circle(0, 0, 7, color, 0.95).setStrokeStyle(2, 0xf2c94c);
      this.add([this.trail, this.projectileShape]);
    }

    scene.add.existing(this);
  }

  update(deltaSeconds: number): void {
    if (!this.active) {
      return;
    }

    if (!this.target.active || this.target.isDefeated()) {
      this.destroy();
      return;
    }

    const distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);

    if (distance <= IMPACT_DISTANCE) {
      this.target.receiveDamage(this.damage);
      this.showImpact();
      this.destroy();
      return;
    }

    if (distance === 0) {
      return;
    }

    const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
    this.rotation = angle;
    const step = Math.min(this.speed * deltaSeconds, distance);
    this.x += Math.cos(angle) * step;
    this.y += Math.sin(angle) * step;
  }

  private showImpact(): void {
    const impact = this.scene.add.circle(this.x, this.y, 14, 0xf2c94c, 0.3).setStrokeStyle(2, 0xffffff).setDepth(15);
    this.scene.tweens.add({ targets: impact, alpha: 0, scale: 1.7, duration: 180, onComplete: () => impact.destroy() });
  }
}
