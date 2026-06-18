import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    this.load.svg('unit-hoplita', 'assets/units/hoplita.svg');
    this.load.svg('unit-arquero-delfos', 'assets/units/arquero-delfos.svg');
    this.load.svg('unit-guardian-esparta', 'assets/units/guardian-esparta.svg');
    this.load.svg('unit-oraculo-arcano', 'assets/units/oraculo-arcano.svg');
    this.load.svg('unit-campeon-olimpo', 'assets/units/campeon-olimpo.svg');
    this.load.svg('building-santuario-olimpo', 'assets/buildings/santuario-olimpo.svg');
    this.load.svg('building-templo-ares', 'assets/buildings/templo-ares.svg');
    this.load.svg('projectile-flecha', 'assets/projectiles/flecha.svg');
    this.load.svg('projectile-orbe-magico', 'assets/projectiles/orbe-magico.svg');
    this.load.svg('effect-rayo-zeus', 'assets/effects/rayo-zeus.svg');
  }

  create(): void {
    console.log('[EPIC] BootScene.create: starting MenuScene');
    this.scene.start('MenuScene');
  }
}
