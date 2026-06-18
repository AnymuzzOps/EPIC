import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    this.load.image('unit-hoplita', 'assets/units/hoplita.svg');
    this.load.image('unit-arquero-delfos', 'assets/units/arquero-delfos.svg');
    this.load.image('unit-guardian-esparta', 'assets/units/guardian-esparta.svg');
    this.load.image('unit-oraculo-arcano', 'assets/units/oraculo-arcano.svg');
    this.load.image('unit-campeon-olimpo', 'assets/units/campeon-olimpo.svg');
    this.load.image('building-santuario-olimpo', 'assets/buildings/santuario-olimpo.svg');
    this.load.image('building-templo-ares', 'assets/buildings/templo-ares.svg');
    this.load.image('projectile-flecha', 'assets/projectiles/flecha.svg');
    this.load.image('projectile-orbe-magico', 'assets/projectiles/orbe-magico.svg');
    this.load.image('effect-rayo-zeus', 'assets/effects/rayo-zeus.svg');
  }

  create(): void {
    console.log('[EPIC] BootScene.create: starting MenuScene');
    this.scene.start('MenuScene');
  }
}
