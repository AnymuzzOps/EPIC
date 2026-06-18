import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create(): void {
    console.log('[EPIC] BootScene.create: starting MenuScene');
    this.scene.start('MenuScene');
  }
}
