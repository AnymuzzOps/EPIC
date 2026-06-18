import Phaser from 'phaser';
import type { Faction, UnitStats } from '../types/GameTypes';

type VisualKind = 'hoplite' | 'archer' | 'spartan' | 'oracle' | 'champion';

function getKind(key: string): VisualKind {
  if (key === 'archer') return 'archer';
  if (key === 'tank') return 'spartan';
  if (key === 'mage') return 'oracle';
  if (key === 'guardian') return 'champion';
  return 'hoplite';
}

export function createGreekUnitVisual(scene: Phaser.Scene, stats: UnitStats, faction: Faction): Phaser.GameObjects.Container {
  const kind = getKind(stats.key);
  const dir = faction === 'player' ? 1 : -1;
  const visual = scene.add.container(0, 0);
  const enemyTint = faction === 'enemy' ? 0x6d1f1f : undefined;

  const addRect = (x: number, y: number, w: number, h: number, color: number) =>
    scene.add.rectangle(x, y, w, h, enemyTint ?? color).setStrokeStyle(2, 0x2b2117);
  const addCircle = (x: number, y: number, r: number, color: number) =>
    scene.add.circle(x, y, r, color).setStrokeStyle(2, 0x2b2117);

  if (kind === 'champion') {
    visual.add(scene.add.circle(0, -8, 34, 0xf2c94c, 0.16).setStrokeStyle(2, 0x8fb3ff, 0.45));
    visual.add(addRect(0, 0, 26, 44, 0x2d6cdf));
    visual.add(addCircle(0, -31, 11, 0xf0c7a5));
    visual.add(scene.add.triangle(0, -42, -16, 8, 16, 8, 0, -12, 0xf2c94c).setStrokeStyle(2, 0x7d5520));
    visual.add(addCircle(-15 * dir, -2, 13, 0xf2c94c));
    visual.add(scene.add.line(17 * dir, -4, 0, 18, 0, -28, 0xd7e8ff).setLineWidth(4).setStrokeStyle(4, 0xd7e8ff));
  } else if (kind === 'spartan') {
    visual.add(addRect(0, 1, 30, 42, 0x7f858f));
    visual.add(addCircle(0, -27, 10, 0xf0c7a5));
    visual.add(scene.add.rectangle(0, -38, 24, 9, 0xb33a2f).setStrokeStyle(2, 0x4a1712));
    visual.add(addCircle(-15 * dir, -1, 17, 0x9b3d2f));
    visual.add(scene.add.line(18 * dir, -3, 0, 18, 0, -21, 0xc69c6d).setLineWidth(3));
  } else if (kind === 'archer') {
    visual.add(scene.add.triangle(-7 * dir, 0, -8, -16, -23, 16, 2, 18, 0x536b35, 0.8).setStrokeStyle(1, 0x2b351a));
    visual.add(addRect(0, 4, 21, 36, 0x638047));
    visual.add(addCircle(0, -24, 9, 0xf0c7a5));
    visual.add(scene.add.arc(14 * dir, -3, 18, -70, 70, false, 0x8b5a2b).setStrokeStyle(3, 0x8b5a2b));
    visual.add(scene.add.line(17 * dir, -3, 0, -13, 0, 13, 0xf4e6bd).setLineWidth(1));
  } else if (kind === 'oracle') {
    visual.add(scene.add.circle(0, -9, 28, 0xd7a6ff, 0.16));
    visual.add(scene.add.triangle(0, 6, -17, 24, 17, 24, 0, -23, 0x7f3fb2).setStrokeStyle(2, 0xf2c94c));
    visual.add(addCircle(0, -27, 9, 0xf0c7a5));
    visual.add(scene.add.line(17 * dir, 0, 0, 21, 0, -26, 0xf2c94c).setLineWidth(3));
    visual.add(scene.add.circle(17 * dir, -29, 5, 0xd7a6ff, 0.85));
  } else {
    visual.add(addRect(0, 4, 23, 38, 0x2f80ed));
    visual.add(addCircle(0, -24, 9, 0xf0c7a5));
    visual.add(scene.add.triangle(0, -35, -13, 7, 13, 7, 0, -10, 0xc69c6d).setStrokeStyle(2, 0x6b4b20));
    visual.add(addCircle(-14 * dir, 0, 14, 0x2f80ed));
    visual.add(scene.add.line(17 * dir, -4, 0, 16, 0, -24, 0xc69c6d).setLineWidth(3));
  }

  visual.add(scene.add.rectangle(-7, 25, 8, 14, 0x4b2f20));
  visual.add(scene.add.rectangle(7, 25, 8, 14, 0x4b2f20));
  return visual;
}

export function updateGreekUnitVisual(visual: Phaser.GameObjects.Container, elapsed: number, state: string): void {
  const bob = state === 'moving' ? Math.sin(elapsed * 10) * 2.2 : state === 'attacking' ? Math.sin(elapsed * 24) * 1.6 : 0;
  visual.y = bob;
  visual.rotation = state === 'attacking' ? Math.sin(elapsed * 20) * 0.04 : 0;
}
