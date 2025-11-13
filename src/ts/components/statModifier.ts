/*
 * File: statModifier.ts
 * Project: littlejs-rl
 * File Created: Wednesday, 13th November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Wednesday, 13th November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

/**
 * Modifier Type - Defines how a stat modifier is applied
 */
export enum ModifierType {
  /** Adds a flat value to the stat */
  FLAT = 'flat',
  /** Multiplies the stat by a percentage (e.g., 0.5 = 50% increase) */
  PERCENTAGE = 'percentage',
}

/**
 * Stat Modifier - Individual modifier that affects a specific stat
 */
export interface StatModifier {
  /** Name/identifier of the stat to modify (e.g., 'strength', 'defense', 'speed') */
  stat: string;
  /** The type of modification to apply */
  type: ModifierType;
  /** The value of the modification */
  value: number;
  /** Optional duration in game turns/ticks (-1 for permanent, 0 for expired) */
  duration?: number;
  /** Optional source identifier (e.g., 'potion_of_strength', 'curse_of_weakness') */
  source?: string;
}

/**
 * StatModifier Component - Contains active stat modifiers for an entity
 *
 * Modifiers can be temporary (with duration) or permanent (duration = -1).
 * Used for buffs, debuffs, equipment bonuses, curses, blessings, etc.
 */
export interface StatModifierComponent {
  /** Array of active modifiers affecting this entity */
  modifiers: StatModifier[];
}
