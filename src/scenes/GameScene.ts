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
    console.log('[EPIC] GameScene.create: rendering battle scene');
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
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x1c2744);
    this.add.circle(1040, 95, 58, 0xf2c94c, 0.22);
    this.add.circle(1040, 95, 38, 0xfff2b0, 0.16);

    [0, 1, 2].forEach((layer) => {
      const color = [0x27395d, 0x33466c, 0x42536f][layer];
      const y = 290 + layer * 42;
      this.add.triangle(320 + layer * 240, y, -80, 170, 220, -55, 540, 170, color, 0.9 - layer * 0.16);
      this.add.triangle(820 + layer * 170, y + 10, -80, 170, 190, -65, 500, 170, color, 0.82 - layer * 0.14);
    });

    for (let i = 0; i < 7; i += 1) {
      const x = 130 + i * 170;
      this.add.rectangle(x, 392, 18, 92, 0xb7aa8a, 0.32).setStrokeStyle(1, 0xd8caa1, 0.35);
      this.add.rectangle(x, 343, 42, 10, 0xb7aa8a, 0.3);
    }

    this.add.rectangle(GAME_WIDTH / 2, GROUND_Y + 34, GAME_WIDTH, 90, 0x5e5039);
    this.add.rectangle(GAME_WIDTH / 2, GROUND_Y + 82, GAME_WIDTH, 28, 0x3f3022);
    this.add.line(GAME_WIDTH / 2, GROUND_Y - 8, 0, 0, GAME_WIDTH, 0, 0xf2c94c, 0.9).setLineWidth(4);
    this.add.text(640, 92, 'Campo de batalla del Olimpo', { fontSize: '20px', color: '#f7ead0' }).setOrigin(0.5);
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
      this.hud.addButton(key, `${index + 1} ${unit.name}\n${unit.cost} favor`, 120 + index * 165, () => this.spawnPlayerUnit(key));
    });

    const blast = ABILITIES.arcaneBlast;
    this.hud.addButton('blast', `Q ${blast.name}\n${blast.cost} favor`, 845, () => this.castArcaneBlast());
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
    this.showZeusLightningEffect(center.x, center.y, ability.area);

    for (const enemy of [...this.enemyUnits]) {
      if (!enemy.active || enemy.isDefeated()) {
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
    const livingEnemies = this.enemyUnits.filter((unit) => unit.active && !unit.isDefeated());

    if (livingEnemies.length === 0) {
      return { x: this.enemyBase.x, y: this.enemyBase.y };
    }

    livingEnemies.sort((a, b) => a.x - b.x);
    return { x: livingEnemies[0].x, y: livingEnemies[0].y };
  }

  private showZeusLightningEffect(x: number, y: number, radius: number): void {
    const impact = this.add.circle(x, y, radius, 0x8fb3ff, 0.18).setStrokeStyle(4, 0xf2c94c).setDepth(25);
    const lightning = this.add.image(x, y - 92, 'effect-rayo-zeus').setDisplaySize(96, 165).setDepth(27);
    const lightningGlow = this.add.image(x, y - 92, 'effect-rayo-zeus').setDisplaySize(128, 210).setAlpha(0.28).setTint(0x8fb3ff).setDepth(26);

    for (let i = 0; i < 10; i += 1) {
      const spark = this.add
        .circle(x + Phaser.Math.Between(-radius, radius), y + Phaser.Math.Between(-40, 40), 3, 0xf2c94c, 0.9)
        .setDepth(28);
      this.tweens.add({
        targets: spark,
        alpha: 0,
        y: spark.y - Phaser.Math.Between(20, 55),
        duration: 360,
        onComplete: () => spark.destroy(),
      });
    }

    this.tweens.add({
      targets: [impact, lightning, lightningGlow],
      alpha: 0,
      scale: 1.14,
      duration: 380,
      onComplete: () => {
        impact.destroy();
        lightning.destroy();
        lightningGlow.destroy();
      },
    });
  }

  private checkEndConditions(): void {
    if (this.enemyBase.isDefeated()) {
      this.finishBattle(true);
      return;
    }

    if (this.playerBase.isDefeated()) {
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
      this.hud.message.setText(`¡Victoria del Olimpo!\nHas obtenido ${LEVELS[0].rewardCoins} monedas`);
    } else {
      this.hud.message.setText('El santuario ha caído');
    }

    new Button(this, 540, 390, 200, 60, victory ? 'Volver al menú' : 'Reintentar', () =>
      victory ? this.scene.start('MenuScene') : this.scene.restart(),
    ).setDepth(40);
    new Button(this, 760, 390, 200, 60, 'Menú', () => this.scene.start('MenuScene')).setDepth(40);
    this.updateHud();
  }
}
