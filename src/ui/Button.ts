export class Button extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Rectangle;
  private label: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    onClick: () => void,
  ) {
    super(scene, x, y);

    this.background = scene.add.rectangle(0, 0, width, height, 0x26364f).setStrokeStyle(2, 0x8fb3ff);
    this.label = scene.add.text(0, 0, text, { fontSize: '17px', color: '#ffffff', align: 'center' }).setOrigin(0.5);

    this.add([this.background, this.label]);
    this.setSize(width, height)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', onClick)
      .on('pointerover', () => this.background.setFillStyle(0x34527a))
      .on('pointerout', () => this.background.setFillStyle(0x26364f));

    scene.add.existing(this);
  }

  setLabel(text: string): void {
    this.label.setText(text);
  }

  setEnabled(enabled: boolean): void {
    this.setAlpha(enabled ? 1 : 0.45);
    enabled ? this.setInteractive({ useHandCursor: true }) : this.disableInteractive();
  }
}
