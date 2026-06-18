import Phaser from 'phaser';
import type { Damageable, Faction, UnitState, UnitStats } from '../types/GameTypes';
import { GROUND_Y } from '../utils/constants';
import { Projectile } from './Projectile';

const UNIT_WIDTH = 34;
const UNIT_HEIGHT = 46;
const HEALTH_BAR_WIDTH = 42;
const BASE_RANGE_PADDING = 24;

export class Unit extends Phaser.GameObjects.Container implements Damageable {
  faction: Faction;
  stats: UnitStats;
  hp: number;
  state: UnitState = 'moving';
  target?: Damageable;

  private healthBar: Phaser.GameObjects.Rectangle;
  private attackTimer = 0;

  constructor(scene: Phaser.Scene, x: number, faction: Faction, stats: UnitStats) {
    super(scene, x, GROUND_Y - 30);

    this.faction = faction;
    this.stats = stats;
    this.hp = stats.maxHp;

    const body = scene.add.rectangle(0, 0, UNIT_WIDTH, UNIT_HEIGHT, stats.color).setStrokeStyle(2, 0x111111);
    const healthBack = scene.add.rectangle(0, -32, HEALTH_BAR_WIDTH + 2, 8, 0x111111);
    this.healthBar = scene.add.rectangle(-HEALTH_BAR_WIDTH / 2, -32, HEALTH_BAR_WIDTH, 6, 0x2ecc71).setOrigin(0, 0.5);
    const initial = scene.add.text(0, 31, stats.name[0], { fontSize: '14px', color: '#ffffff' }).setOrigin(0.5);

    this.add([body, healthBack, this.healthBar, initial]);
    scene.add.existing(this);
  }

  update(deltaSeconds: number, enemies: Damageable[], enemyBase: Damageable, projectiles: Projectile[]): void {
    if (this.state === 'dead' || this.isDefeated()) {
      return;
    }

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
      this.destroy();
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
      target.receiveDamage(this.stats.damage);
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
      ),
    );
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
