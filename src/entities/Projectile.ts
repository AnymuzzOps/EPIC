import Phaser from 'phaser';
import type { AttackType, Damageable, Faction } from '../types/GameTypes';

const IMPACT_DISTANCE = 12;

export class Projectile extends Phaser.GameObjects.Container {
  target: Damageable;
  damage: number;
  speed: number;
  faction: Faction;

  private sprite: Phaser.GameObjects.Image;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    target: Damageable,
    damage: number,
    _color: number,
    faction: Faction,
    attackType: AttackType = 'ranged',
    speed = 330,
  ) {
    super(scene, x, y);

    this.target = target;
    this.damage = damage;
    this.speed = speed;
    this.faction = faction;

    const texture = attackType === 'ranged' ? 'projectile-flecha' : 'projectile-orbe-magico';
    this.sprite = scene.add.image(0, 0, texture).setOrigin(0.5);
    this.sprite.setDisplaySize(attackType === 'ranged' ? 48 : 28, attackType === 'ranged' ? 12 : 28);
    this.sprite.setFlipX(faction === 'enemy');
    this.add(this.sprite);

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
