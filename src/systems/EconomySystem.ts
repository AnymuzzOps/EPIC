import { ENERGY_REGEN, INITIAL_ENERGY, MAX_ENERGY, STARTING_COINS_KEY } from '../utils/constants';
import type { SaveData } from '../types/GameTypes';
import { clamp } from '../utils/math';

const DEFAULT_SAVE: SaveData = {
  coins: 0,
  campaignLevel: 1,
  upgrades: {},
};

export class EconomySystem {
  energy = INITIAL_ENERGY;
  maxEnergy = MAX_ENERGY;
  regen = ENERGY_REGEN;

  update(deltaSeconds: number): void {
    this.energy = clamp(this.energy + this.regen * deltaSeconds, 0, this.maxEnergy);
  }

  canSpend(amount: number): boolean {
    return this.energy >= amount;
  }

  spend(amount: number): boolean {
    if (!this.canSpend(amount)) {
      return false;
    }

    this.energy -= amount;
    return true;
  }
}

export const loadSave = (): SaveData => {
  try {
    const rawSave = localStorage.getItem(STARTING_COINS_KEY);
    const parsed = rawSave ? (JSON.parse(rawSave) as Partial<SaveData>) : {};

    return {
      ...DEFAULT_SAVE,
      ...parsed,
      upgrades: parsed.upgrades ?? {},
    };
  } catch {
    return { ...DEFAULT_SAVE };
  }
};

export const saveData = (data: SaveData): void => {
  localStorage.setItem(STARTING_COINS_KEY, JSON.stringify(data));
};

export const addCoins = (amount: number): number => {
  const save = loadSave();
  save.coins += amount;
  saveData(save);
  return save.coins;
};
