/*
 * File: stats.ts
 * Project: littlejs-rl
 * File Created: Monday, 11th November 2025 11:30:00 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Monday, 11th November 2025 11:30:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

export enum StatType {
  BASE = 'base',
  DERIVED = 'derived',
}

/**
 * Base Stats - Core attributes that are set directly
 * These are the foundation for all derived calculations
 */
export interface BaseStats {
  /** Physical power and melee damage */
  strength: number;
  /** Agility, accuracy, and evasion base */
  dexterity: number;
  /** Magical power and mental acuity */
  intelligence: number;
  /** Social influence and negotiation */
  charisma: number;
  /** Mental resistance and focus */
  willpower: number;
  /** Physical endurance and health */
  toughness: number;
  /** Physical appeal */
  attractiveness: number;
}

/**
 * Derived Stats - Calculated from base stats and other factors
 * These are computed dynamically and should not be set directly
 */
export interface DerivedStats {
  /** Physical damage reduction (from toughness, armor) */
  defense: number;
  /** Chance to avoid attacks (from dexterity, equipment weight) */
  dodge: number;
  /** Mental/magical damage reduction (from willpower, intelligence) */
  mindDefense: number;
  /** Magical attack resistance (from willpower) */
  magicalDefense: number;
  /** Movement speed multiplier (from dexterity, equipment weight) */
  speed: number;
}

/**
 * Stats Component - Contains entity combat and movement statistics
 *
 * Separates base stats (directly set) from derived stats (calculated).
 * Use `calculateDerivedStats()` to compute derived values from base stats.
 */
export interface StatsComponent {
  /** Base attributes set directly on the entity */
  base: BaseStats;
  /** Calculated stats derived from base stats and other factors */
  derived: DerivedStats;
}
