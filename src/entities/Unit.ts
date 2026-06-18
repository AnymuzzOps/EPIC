import Phaser from 'phaser';
import type { Damageable, Faction, UnitState, UnitStats } from '../types/GameTypes';
import { GROUND_Y } from '../utils/constants';
import { Projectile } from './Projectile';
import { createGreekUnitVisual, updateGreekUnitVisual } from '../visuals/GreekUnitVisualFactory';

const HEALTH_BAR_WIDTH = 52;
const BASE_RANGE_PADDING = 24;

export class Unit extends Phaser.GameObjects.Container implements Damageable {
  faction: Faction;
  stats: UnitStats;
  hp: number;
  state: UnitState = 'moving';
  target?: Damageable;

  private healthBar: Phaser.GameObjects.Rectangle;
  private visual: Phaser.GameObjects.Container;
  private attackTimer = 0;
  private animationTime = 0;

  constructor(scene: Phaser.Scene, x: number, faction: Faction, stats: UnitStats) {
    super(scene, x, GROUND_Y - 30);

    this.faction = faction;
    this.stats = stats;
    this.hp = stats.maxHp;

    this.visual = createGreekUnitVisual(scene, stats, faction);
    const healthBack = scene.add.rectangle(0, -48, HEALTH_BAR_WIDTH + 2, 8, 0x1c1410).setStrokeStyle(1, 0xf2c94c);
    this.healthBar = scene.add.rectangle(-HEALTH_BAR_WIDTH / 2, -48, HEALTH_BAR_WIDTH, 6, 0x2ecc71).setOrigin(0, 0.5);
    const namePlate = scene.add.text(0, 38, stats.name, { fontSize: '10px', color: '#f7ead0' }).setOrigin(0.5);

    this.add([this.visual, healthBack, this.healthBar, namePlate]);
    scene.add.existing(this);
  }

  update(deltaSeconds: number, enemies: Damageable[], enemyBase: Damageable, projectiles: Projectile[]): void {
    if (this.state === 'dead' || this.isDefeated()) {
      return;
    }

    this.animationTime += deltaSeconds;
    updateGreekUnitVisual(this.visual, this.animationTime, this.state);

    this.attackTimer = Math.max(0, this.attackTimer - deltaSeconds);
    this.target = this.pickTarget(enemies, enemyBase);

    if (this.target) {
      this.state = 'attacking';
      this.attack(this.target, projectiles);
      return;
    }

    this.state = 'moving';
    this.x += this.getDirection() * this.stats.speed * deltaSeconds;
  }

  receiveDamage(amount: number): void {
    if (this.isDefeated() || amount <= 0) {
      return;
    }

    this.hp = Math.max(0, this.hp - amount);
    this.refreshHealthBar();

    if (this.hp <= 0) {
      this.state = 'dead';
      this.setActive(false);
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        angle: this.faction === 'player' ? -18 : 18,
        scale: this.scale * 0.75,
        duration: 260,
        onComplete: () => this.destroy(),
      });
    }
  }

  isDefeated(): boolean {
    return this.hp <= 0 || !this.active;
  }

  protected pickTarget(enemies: Damageable[], enemyBase: Damageable): Damageable | undefined {
    const livingEnemies = enemies.filter((enemy) => enemy.active && !enemy.isDefeated());
    const candidates = [...livingEnemies, enemyBase].filter((enemy) => this.isTargetInRange(enemy));

    candidates.sort((a, b) => this.distanceTo(a) - this.distanceTo(b));
    return candidates[0];
  }

  protected attack(target: Damageable, projectiles: Projectile[]): void {
    if (this.attackTimer > 0 || !target.active || target.isDefeated()) {
      return;
    }

    this.attackTimer = this.stats.attackCooldown;

    if (this.stats.attackType === 'melee') {
      this.playAttackMotion();
      target.receiveDamage(this.stats.damage);
      this.showDamageText(target);
      return;
    }

    projectiles.push(
      new Projectile(
        this.scene,
        this.x,
        this.y - 10,
        target,
        this.stats.damage,
        this.stats.projectileColor ?? 0xffffff,
        this.faction,
        this.stats.attackType,
      ),
    );
  }


  private playAttackMotion(): void {
    this.scene.tweens.add({
      targets: this.visual,
      x: this.getDirection() * 6,
      yoyo: true,
      duration: 90,
    });
  }

  private showDamageText(target: Damageable): void {
    const text = this.scene.add
      .text(target.x, target.y - 58, `-${this.stats.damage}`, { fontSize: '16px', color: '#ffe08a' })
      .setOrigin(0.5)
      .setDepth(30);
    this.scene.tweens.add({ targets: text, y: text.y - 24, alpha: 0, duration: 520, onComplete: () => text.destroy() });
  }

  private refreshHealthBar(): void {
    const ratio = Phaser.Math.Clamp(this.hp / this.stats.maxHp, 0, 1);
    this.healthBar.width = HEALTH_BAR_WIDTH * ratio;
    this.healthBar.fillColor = ratio < 0.35 ? 0xe74c3c : 0x2ecc71;
  }

  private isTargetInRange(target: Damageable): boolean {
    return this.distanceTo(target) <= this.stats.range + BASE_RANGE_PADDING;
  }

  private distanceTo(target: Damageable): number {
    return Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);
  }

  private getDirection(): number {
    return this.faction === 'player' ? 1 : -1;
  }
}
