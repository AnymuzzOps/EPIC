import Phaser from 'phaser';
import { Button } from '../ui/Button';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create(): void {
    console.log('[EPIC] MenuScene.create: rendering main menu');

    this.add.rectangle(640, 360, 1280, 720, 0x121826).setDepth(0);
    this.add.text(640, 140, 'Arkaius Game', { fontSize: '64px', color: '#f2c94c' }).setOrigin(0.5).setDepth(1);
    this.add
      .text(640, 205, 'Defensa lateral 2D original - MVP', { fontSize: '22px', color: '#dfe6f3' })
      .setOrigin(0.5)
      .setDepth(1);

    new Button(this, 640, 310, 240, 60, 'Jugar', () => this.scene.start('GameScene')).setDepth(2);
    new Button(this, 640, 390, 240, 60, 'Mejoras', () => this.scene.start('UpgradeScene')).setDepth(2);
    new Button(this, 640, 470, 240, 60, 'Créditos', () => {
      this.add
        .text(640, 545, 'Creado con Phaser 3, TypeScript y figuras simples originales.', {
          fontSize: '20px',
          color: '#ffffff',
        })
        .setOrigin(0.5)
        .setDepth(3);
    }).setDepth(2);
  }
}
