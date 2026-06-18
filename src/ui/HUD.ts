import Phaser from 'phaser';
import { Button } from './Button';
import { formatTime } from '../utils/math';

interface HudData {
  playerHp: number;
  playerMaxHp: number;
  enemyHp: number;
  enemyMaxHp: number;
  energy: number;
  maxEnergy: number;
  coins: number;
  time: number;
  abilityCooldown: number;
}

export class HUD {
  message: Phaser.GameObjects.Text;
  buttons: Record<string, Button> = {};

  private baseText: Phaser.GameObjects.Text;
  private economyText: Phaser.GameObjects.Text;
  private energyBar: Phaser.GameObjects.Rectangle;
  private abilityText: Phaser.GameObjects.Text;

  constructor(private scene: Phaser.Scene) {
    scene.add.rectangle(640, 32, 1280, 64, 0x0d1322, 0.82).setDepth(19);
    scene.add.rectangle(640, 668, 1280, 104, 0x0d1322, 0.82).setDepth(19);

    this.baseText = scene.add.text(20, 10, '', { fontSize: '18px', color: '#ffffff' }).setDepth(20);
    this.economyText = scene.add.text(20, 36, '', { fontSize: '18px', color: '#ffffff' }).setDepth(20);
    scene.add.rectangle(400, 46, 210, 16, 0x17233a).setOrigin(0, 0.5).setDepth(20);
    this.energyBar = scene.add.rectangle(400, 46, 210, 16, 0x3498db).setOrigin(0, 0.5).setDepth(21);
    this.abilityText = scene.add.text(630, 36, '', { fontSize: '18px', color: '#d7a6ff' }).setDepth(20);
    this.message = scene.add
      .text(640, 250, '', { fontSize: '46px', color: '#ffffff', align: 'center' })
      .setOrigin(0.5)
      .setDepth(30);
  }

  addButton(key: string, label: string, x: number, onClick: () => void): Button {
    const button = new Button(this.scene, x, 665, 150, 54, label, onClick).setDepth(20) as Button;
    this.buttons[key] = button;
    return button;
  }

  update(data: HudData): void {
    this.baseText.setText(
      `Base jugador: ${Math.ceil(data.playerHp)}/${data.playerMaxHp}  |  Base enemiga: ${Math.ceil(data.enemyHp)}/${data.enemyMaxHp}`,
    );
    this.economyText.setText(
      `Energía: ${Math.floor(data.energy)}/${data.maxEnergy}  |  Monedas: ${data.coins}  |  Tiempo: ${formatTime(data.time)}`,
    );
    this.energyBar.width = 210 * Phaser.Math.Clamp(data.energy / data.maxEnergy, 0, 1);
    this.abilityText.setText(data.abilityCooldown > 0 ? `Arcane Blast CD: ${data.abilityCooldown.toFixed(1)}s` : 'Arcane Blast listo');
  }
}
