import Phaser from 'phaser';
import type { Faction } from '../types/GameTypes';

const BASE_WIDTH = 86;
const BASE_HEIGHT = 180;
const HEALTH_BAR_WIDTH = 112;

export class Base extends Phaser.GameObjects.Container {
  faction: Faction;
  maxHp: number;
  hp: number;

  private healthBar: Phaser.GameObjects.Rectangle;
  private healthLabel: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, faction: Faction, maxHp: number) {
    super(scene, x, y);

    this.faction = faction;
    this.maxHp = maxHp;
    this.hp = maxHp;

    const color = faction === 'player' ? 0x2d6cdf : 0xc0392b;
    const baseBody = scene.add.rectangle(0, 0, BASE_WIDTH, BASE_HEIGHT, color).setStrokeStyle(3, 0xffffff);
    const healthBack = scene.add.rectangle(0, -110, HEALTH_BAR_WIDTH, 14, 0x2b1515);
    this.healthBar = scene.add.rectangle(-HEALTH_BAR_WIDTH / 2, -110, HEALTH_BAR_WIDTH, 14, 0x2ecc71).setOrigin(0, 0.5);
    this.healthLabel = scene.add.text(0, -140, this.getHealthText(), { fontSize: '16px', color: '#ffffff' }).setOrigin(0.5);

    this.add([baseBody, healthBack, this.healthBar, this.healthLabel]);
    scene.add.existing(this);
  }

  receiveDamage(amount: number): void {
    if (this.isDefeated() || amount <= 0) {
      return;
    }

    this.hp = Math.max(0, this.hp - amount);
    this.refreshHealthBar();
  }

  isDefeated(): boolean {
    return this.hp <= 0 || !this.active;
  }

  private refreshHealthBar(): void {
    const ratio = Phaser.Math.Clamp(this.hp / this.maxHp, 0, 1);
    this.healthBar.width = HEALTH_BAR_WIDTH * ratio;
    this.healthBar.fillColor = ratio < 0.3 ? 0xe74c3c : 0x2ecc71;
    this.healthLabel.setText(this.getHealthText());
  }

  private getHealthText(): string {
    return `${Math.ceil(this.hp)}/${this.maxHp}`;
  }
}
