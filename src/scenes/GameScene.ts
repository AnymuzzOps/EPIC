import Phaser from 'phaser';
import { ABILITIES } from '../data/abilities';
import { HEROES } from '../data/heroes';
import { LEVELS } from '../data/levels';
import { UNIT_DEFINITIONS } from '../data/units';
import { Base } from '../entities/Base';
import { Hero } from '../entities/Hero';
import { Projectile } from '../entities/Projectile';
import { Unit } from '../entities/Unit';
import { CombatSystem } from '../systems/CombatSystem';
import { EconomySystem, addCoins, loadSave } from '../systems/EconomySystem';
import { EnemyAI } from '../systems/EnemyAI';
import { SpawnSystem } from '../systems/SpawnSystem';
import { WaveSystem } from '../systems/WaveSystem';
import { Button } from '../ui/Button';
import { HUD } from '../ui/HUD';
import {
  BASE_Y,
  ENEMY_BASE_X,
  GAME_HEIGHT,
  GAME_WIDTH,
  GROUND_Y,
  PLAYER_BASE_X,
  PLAYER_SPAWN_X,
} from '../utils/constants';

const PLAYER_UNIT_KEYS = ['soldier', 'archer', 'tank', 'mage'];

export class GameScene extends Phaser.Scene {
  private playerBase!: Base;
  private enemyBase!: Base;
  private playerUnits: Unit[] = [];
  private enemyUnits: Unit[] = [];
  private projectiles: Projectile[] = [];
  private economy!: EconomySystem;
  private hud!: HUD;
  private spawner!: SpawnSystem;
  private enemyAI!: EnemyAI;
  private combat!: CombatSystem;
  private wave!: WaveSystem;
  private elapsed = 0;
  private ended = false;
  private abilityCooldown = 0;
  private coins = 0;

  constructor() {
    super('GameScene');
  }

  create(): void {
    this.resetState();
    this.drawBattlefield();
    this.createBasesAndSystems();
    this.createHero();
    this.createHudAndControls();
  }

  update(_time: number, deltaMs: number): void {
    if (this.ended) {
      return;
    }

    const deltaSeconds = deltaMs / 1000;
    this.elapsed += deltaSeconds;
    this.abilityCooldown = Math.max(0, this.abilityCooldown - deltaSeconds);

    this.economy.update(deltaSeconds);
    this.enemyAI.update(deltaSeconds);
    this.wave.update(deltaSeconds);
    this.combat.update(deltaSeconds);
    this.updateHud();
    this.checkEndConditions();
  }

  private resetState(): void {
    this.playerUnits = [];
    this.enemyUnits = [];
    this.projectiles = [];
    this.economy = new EconomySystem();
    this.wave = new WaveSystem();
    this.elapsed = 0;
    this.ended = false;
    this.abilityCooldown = 0;
    this.coins = loadSave().coins;
  }

  private drawBattlefield(): void {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x162033);
    this.add.rectangle(GAME_WIDTH / 2, GROUND_Y + 34, GAME_WIDTH, 90, 0x33402f);
    this.add.line(GAME_WIDTH / 2, GROUND_Y - 8, 0, 0, GAME_WIDTH, 0, 0x87a96b).setLineWidth(4);
    this.add.text(640, 92, 'Arkaius Battlefield', { fontSize: '18px', color: '#8fb3ff' }).setOrigin(0.5);
  }

  private createBasesAndSystems(): void {
    const level = LEVELS[0];
    this.playerBase = new Base(this, PLAYER_BASE_X, BASE_Y, 'player', level.playerBaseHp);
    this.enemyBase = new Base(this, ENEMY_BASE_X, BASE_Y, 'enemy', level.enemyBaseHp);
    this.spawner = new SpawnSystem(this, this.playerUnits, this.enemyUnits);
    this.enemyAI = new EnemyAI(this.spawner);
    this.combat = new CombatSystem(this.playerUnits, this.enemyUnits, this.projectiles, this.playerBase, this.enemyBase);
  }

  private createHero(): void {
    this.playerUnits.push(new Hero(this, PLAYER_SPAWN_X + 55, 'player', HEROES.guardian));
  }

  private createHudAndControls(): void {
    this.hud = new HUD(this);

    PLAYER_UNIT_KEYS.forEach((key, index) => {
      const unit = UNIT_DEFINITIONS[key];
      this.hud.addButton(key, `${index + 1} ${unit.name}\n${unit.cost} EN`, 120 + index * 165, () => this.spawnPlayerUnit(key));
    });

    const blast = ABILITIES.arcaneBlast;
    this.hud.addButton('blast', `Q ${blast.name}\n${blast.cost} EN`, 845, () => this.castArcaneBlast());
    new Button(this, 1135, 665, 150, 54, 'Menú', () => this.scene.start('MenuScene')).setDepth(20);

    this.input.keyboard?.on('keydown-ONE', () => this.spawnPlayerUnit('soldier'));
    this.input.keyboard?.on('keydown-TWO', () => this.spawnPlayerUnit('archer'));
    this.input.keyboard?.on('keydown-THREE', () => this.spawnPlayerUnit('tank'));
    this.input.keyboard?.on('keydown-FOUR', () => this.spawnPlayerUnit('mage'));
    this.input.keyboard?.on('keydown-Q', () => this.castArcaneBlast());

    this.updateHud();
  }

  private updateHud(): void {
    this.hud.update({
      playerHp: this.playerBase.hp,
      playerMaxHp: this.playerBase.maxHp,
      enemyHp: this.enemyBase.hp,
      enemyMaxHp: this.enemyBase.maxHp,
      energy: this.economy.energy,
      maxEnergy: this.economy.maxEnergy,
      coins: this.coins,
      time: this.elapsed,
      abilityCooldown: this.abilityCooldown,
    });
  }

  private spawnPlayerUnit(key: string): void {
    const unit = UNIT_DEFINITIONS[key];

    if (this.ended || !unit || !this.economy.spend(unit.cost)) {
      return;
    }

    this.spawner.spawn(key, 'player');
    this.updateHud();
  }

  private castArcaneBlast(): void {
    const ability = ABILITIES.arcaneBlast;

    if (this.ended || this.abilityCooldown > 0 || !this.economy.spend(ability.cost)) {
      return;
    }

    this.abilityCooldown = ability.cooldown;
    const center = this.findArcaneBlastCenter();
    this.showArcaneBlastEffect(center.x, center.y, ability.area);

    for (const enemy of [...this.enemyUnits]) {
      if (!enemy.active || enemy.isDestroyed()) {
        continue;
      }

      const distance = Phaser.Math.Distance.Between(center.x, center.y, enemy.x, enemy.y);
      if (distance <= ability.area) {
        enemy.receiveDamage(ability.damage);
      }
    }

    this.updateHud();
  }

  private findArcaneBlastCenter(): { x: number; y: number } {
    const livingEnemies = this.enemyUnits.filter((unit) => unit.active && !unit.isDestroyed());

    if (livingEnemies.length === 0) {
      return { x: this.enemyBase.x, y: this.enemyBase.y };
    }

    livingEnemies.sort((a, b) => a.x - b.x);
    return { x: livingEnemies[0].x, y: livingEnemies[0].y };
  }

  private showArcaneBlastEffect(x: number, y: number, radius: number): void {
    const effect = this.add.circle(x, y, radius, 0x9b51e0, 0.22).setStrokeStyle(3, 0xd7a6ff).setDepth(10);
    this.tweens.add({
      targets: effect,
      alpha: 0,
      scale: 1.15,
      duration: 280,
      onComplete: () => effect.destroy(),
    });
  }

  private checkEndConditions(): void {
    if (this.enemyBase.isDestroyed()) {
      this.finishBattle(true);
      return;
    }

    if (this.playerBase.isDestroyed()) {
      this.finishBattle(false);
    }
  }

  private finishBattle(victory: boolean): void {
    if (this.ended) {
      return;
    }

    this.ended = true;

    if (victory) {
      this.coins = addCoins(LEVELS[0].rewardCoins);
      this.hud.message.setText(`¡VICTORIA!\n+${LEVELS[0].rewardCoins} monedas`);
    } else {
      this.hud.message.setText('DERROTA');
    }

    new Button(this, 540, 390, 200, 60, victory ? 'Volver al menú' : 'Reintentar', () =>
      victory ? this.scene.start('MenuScene') : this.scene.restart(),
    ).setDepth(40);
    new Button(this, 760, 390, 200, 60, 'Menú', () => this.scene.start('MenuScene')).setDepth(40);
    this.updateHud();
  }
}
