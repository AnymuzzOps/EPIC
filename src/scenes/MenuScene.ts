import Phaser from 'phaser';
import { Button } from '../ui/Button';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create(): void {
    console.log('[EPIC] MenuScene.create: rendering main menu');

    this.drawOlympusBackdrop();
    this.add
      .text(640, 130, 'Guerras del Olimpo', {
        fontSize: '68px',
        color: '#f2c94c',
        stroke: '#2b2117',
        strokeThickness: 7,
      })
      .setOrigin(0.5)
      .setDepth(3);
    this.add
      .text(640, 205, 'Invoca campeones, protege tu santuario y conquista el templo enemigo', {
        fontSize: '23px',
        color: '#f7ead0',
        stroke: '#111827',
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(3);

    new Button(this, 640, 320, 250, 62, 'Jugar', () => this.scene.start('GameScene')).setDepth(4);
    new Button(this, 640, 405, 250, 62, 'Mejoras', () => this.scene.start('UpgradeScene')).setDepth(4);
    new Button(this, 640, 490, 250, 62, 'Créditos', () => {
      this.add
        .text(640, 570, 'Gráficos procedurales originales con Phaser. Sin assets con copyright.', {
          fontSize: '20px',
          color: '#ffffff',
          stroke: '#111827',
          strokeThickness: 4,
        })
        .setOrigin(0.5)
        .setDepth(5);
    }).setDepth(4);
  }

  private drawOlympusBackdrop(): void {
    this.add.rectangle(640, 360, 1280, 720, 0x1c2744).setDepth(0);
    this.add.circle(1040, 118, 70, 0xf2c94c, 0.24).setDepth(1);
    this.add.circle(1040, 118, 44, 0xfff2b0, 0.16).setDepth(1);

    [0, 1, 2].forEach((layer) => {
      const color = [0x27395d, 0x35466b, 0x4b5870][layer];
      this.add.triangle(340 + layer * 210, 385 + layer * 30, -80, 170, 230, -80, 560, 170, color, 0.9).setDepth(1);
      this.add.triangle(820 + layer * 150, 405 + layer * 26, -70, 160, 190, -70, 520, 160, color, 0.82).setDepth(1);
    });

    this.add.rectangle(640, 590, 1280, 260, 0x5e5039).setDepth(1);
    for (let i = 0; i < 8; i += 1) {
      const x = 100 + i * 155;
      this.add.rectangle(x, 535, 22, 150, 0xd8caa1, 0.32).setStrokeStyle(1, 0xf7ead0, 0.3).setDepth(2);
      this.add.rectangle(x, 455, 58, 14, 0xd8caa1, 0.34).setDepth(2);
      this.add.rectangle(x, 616, 64, 16, 0x8b7a65, 0.4).setDepth(2);
    }
  }
}
