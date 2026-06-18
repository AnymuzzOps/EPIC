import Phaser from 'phaser';
import type { Faction, UnitStats } from '../types/GameTypes';

const UNIT_TEXTURES: Record<string, string> = {
  soldier: 'unit-hoplita',
  archer: 'unit-arquero-delfos',
  tank: 'unit-guardian-esparta',
  mage: 'unit-oraculo-arcano',
  guardian: 'unit-campeon-olimpo',
};

export function createGreekUnitVisual(scene: Phaser.Scene, stats: UnitStats, faction: Faction): Phaser.GameObjects.Container {
  const textureKey = UNIT_TEXTURES[stats.key] ?? UNIT_TEXTURES.soldier;
  const visual = scene.add.container(0, 0);
  const sprite = scene.add.image(0, 0, textureKey).setOrigin(0.5, 0.78);

  sprite.setDisplaySize(stats.key === 'guardian' ? 70 : stats.key === 'tank' ? 58 : 50, stats.key === 'guardian' ? 84 : 70);
  sprite.setFlipX(faction === 'enemy');
  sprite.setTint(faction === 'enemy' ? 0xffd6d6 : 0xffffff);
  visual.add(sprite);

  return visual;
}

export function updateGreekUnitVisual(visual: Phaser.GameObjects.Container, elapsed: number, state: string): void {
  const bob = state === 'moving' ? Math.sin(elapsed * 10) * 2.2 : state === 'attacking' ? Math.sin(elapsed * 24) * 1.6 : 0;
  visual.y = bob;
  visual.rotation = state === 'attacking' ? Math.sin(elapsed * 20) * 0.04 : 0;
}
