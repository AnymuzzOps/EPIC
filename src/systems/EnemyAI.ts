import { UNIT_DEFINITIONS } from '../data/units';
import { EconomySystem } from './EconomySystem';
import { SpawnSystem } from './SpawnSystem';

const ENEMY_UNIT_CHOICES = ['soldier', 'archer', 'tank'];

export class EnemyAI {
  economy = new EconomySystem();

  private decisionTimer = 2;
  private elapsed = 0;

  constructor(private spawner: SpawnSystem) {}

  update(deltaSeconds: number): void {
    this.elapsed += deltaSeconds;
    this.economy.regen = 5 + Math.floor(this.elapsed / 60) * 1.5;
    this.economy.update(deltaSeconds);

    this.decisionTimer -= deltaSeconds;

    if (this.decisionTimer > 0) {
      return;
    }

    this.decisionTimer = Math.max(1.2, 3.3 - Math.floor(this.elapsed / 60) * 0.35);
    this.trySpawnRandomUnit();
  }

  private trySpawnRandomUnit(): void {
    const key = ENEMY_UNIT_CHOICES[Math.floor(Math.random() * ENEMY_UNIT_CHOICES.length)];
    const cost = UNIT_DEFINITIONS[key].cost;

    if (this.economy.spend(cost)) {
      this.spawner.spawn(key, 'enemy');
    }
  }
}
