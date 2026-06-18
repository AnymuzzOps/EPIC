import Phaser from 'phaser';
import type { Faction } from '../types/GameTypes';

const HEALTH_BAR_WIDTH = 132;

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

    const isPlayer = faction === 'player';
    const name = isPlayer ? 'Santuario del Olimpo' : 'Templo de Ares';
    const gold = isPlayer ? 0xf2c94c : 0xff6b3a;
    const temple = scene.add
      .image(0, -5, isPlayer ? 'building-santuario-olimpo' : 'building-templo-ares')
      .setOrigin(0.5, 0.72)
      .setDisplaySize(190, 190);

    this.healthBar = scene.add.rectangle(-HEALTH_BAR_WIDTH / 2, -112, HEALTH_BAR_WIDTH, 14, 0x2ecc71).setOrigin(0, 0.5);
    const healthBack = scene.add.rectangle(0, -112, HEALTH_BAR_WIDTH + 4, 18, 0x2b2117).setStrokeStyle(2, gold);
    this.healthLabel = scene.add.text(0, -139, `${name}\n${this.getHealthText()}`, {
      fontSize: '14px',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5);

    this.add([temple, healthBack, this.healthBar, this.healthLabel]);
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
    const name = this.faction === 'player' ? 'Santuario del Olimpo' : 'Templo de Ares';
    this.healthLabel.setText(`${name}\n${this.getHealthText()}`);
  }

  private getHealthText(): string {
    return `${Math.ceil(this.hp)}/${this.maxHp}`;
  }
}
