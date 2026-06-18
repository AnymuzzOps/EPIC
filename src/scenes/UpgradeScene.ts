import Phaser from 'phaser';
import { saveData, loadSave } from '../systems/EconomySystem';
import { Button } from '../ui/Button';

export class UpgradeScene extends Phaser.Scene {
  constructor() {
    super('UpgradeScene');
  }

  create(): void {
    const save = loadSave();
    this.add.rectangle(640, 360, 1280, 720, 0x1c2744);
    this.add.rectangle(640, 360, 820, 520, 0x111827, 0.82).setStrokeStyle(3, 0xf2c94c);
    this.add.text(640, 90, 'Mejoras', { fontSize: '52px', color: '#f2c94c' }).setOrigin(0.5);
    this.add.text(640, 155, `Monedas disponibles: ${save.coins}`, { fontSize: '26px', color: '#ffffff' }).setOrigin(0.5);

    ['Vida de unidades', 'Daño de unidades', 'Regeneración de favor divino', 'Reducción de enfriamiento'].forEach((text, index) =>
      this.add.text(380, 235 + index * 70, `🔒 ${text} - Mejoras futuras`, { fontSize: '24px', color: '#b9c7dc' }),
    );

    save.campaignLevel ||= 1;
    saveData(save);
    new Button(this, 640, 620, 240, 58, 'Volver al menú', () => this.scene.start('MenuScene'));
  }
}
