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
 * Stats Component - Contains entity combat and movement statistics
 *
 * Used by entities for combat calculations and movement.
 */
export interface StatsComponent {
  /** Attack power */
  strength: number;
  /** Agility and accuracy */
  dexterity: number;
  intelligence: number;
  charisma: number;
  willpower: number;
  toughness: number;
  attractiveness: number;
  /** Damage reduction */
  defense: number;
  dodge: number;
  mindDefense: number;
  magicalDefense: number;
  /** Movement speed multiplier */
  speed: number;
}
