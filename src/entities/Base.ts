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
    const marble = isPlayer ? 0xd8e6f5 : 0x5a4a4a;
    const accent = isPlayer ? 0x2d6cdf : 0x9b2d2d;
    const gold = isPlayer ? 0xf2c94c : 0xff6b3a;
    const name = isPlayer ? 'Santuario del Olimpo' : 'Templo de Ares';

    const platform = scene.add.rectangle(0, 58, 132, 18, 0x6d5a42).setStrokeStyle(2, 0x2d2217);
    const roof = scene.add.triangle(0, -74, -76, 28, 76, 28, 0, -38, accent).setStrokeStyle(3, gold);
    const frieze = scene.add.rectangle(0, -42, 132, 18, gold).setStrokeStyle(2, 0x47351b);
    const door = scene.add.rectangle(0, 22, 34, 74, isPlayer ? 0x172c4b : 0x281313).setStrokeStyle(2, gold);
    const columns = [-45, -18, 18, 45].map((cx) => scene.add.rectangle(cx, 10, 16, 92, marble).setStrokeStyle(2, 0x8b7a65));
    const flameColor = isPlayer ? 0x8fb3ff : 0xff3b2f;
    const flames = [
      scene.add.circle(-60, -16, 7, flameColor, 0.75),
      scene.add.circle(60, -16, 7, flameColor, 0.75),
    ];
    this.healthBar = scene.add.rectangle(-HEALTH_BAR_WIDTH / 2, -112, HEALTH_BAR_WIDTH, 14, 0x2ecc71).setOrigin(0, 0.5);
    const healthBack = scene.add.rectangle(0, -112, HEALTH_BAR_WIDTH + 4, 18, 0x1c1410).setStrokeStyle(2, gold);
    this.healthLabel = scene.add.text(0, -139, `${name}\n${this.getHealthText()}`, {
      fontSize: '14px',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5);

    this.add([platform, roof, frieze, door, ...columns, ...flames, healthBack, this.healthBar, this.healthLabel]);
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
