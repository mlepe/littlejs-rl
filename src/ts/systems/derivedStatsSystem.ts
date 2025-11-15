/*
 * File: derivedStatsSystem.ts
 * Project: littlejs-rl
 * File Created: Thursday, 14th November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 14th November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import type {
  BaseStats,
  DerivedStats,
  StatsComponent,
} from '../components/stats';

import type ECS from '../ecs';

/**
 * Derived Stat Formulas
 *
 * These functions calculate derived stats from base stats and other factors.
 * Modify these formulas to adjust game balance.
 */

/**
 * Calculate defense from toughness
 * Formula: defense = toughness * 0.5
 *
 * @param base - Base stats
 * @param equipmentWeight - Optional equipment weight penalty (future)
 * @returns Calculated defense value
 */
export function calculateDefense(base: BaseStats, equipmentWeight = 0): number {
  const baseDefense = base.toughness * 0.5;
  // Future: Apply equipment bonuses/penalties
  return Math.max(0, Math.floor(baseDefense));
}

/**
 * Calculate dodge from dexterity and equipment weight
 * Formula: dodge = dexterity * 0.8 - (equipmentWeight * 0.1)
 *
 * Higher dexterity increases dodge, heavy equipment reduces it
 *
 * @param base - Base stats
 * @param equipmentWeight - Optional equipment weight penalty
 * @returns Calculated dodge value
 */
export function calculateDodge(base: BaseStats, equipmentWeight = 0): number {
  const baseDodge = base.dexterity * 0.8;
  const weightPenalty = equipmentWeight * 0.1;
  return Math.max(0, Math.floor(baseDodge - weightPenalty));
}

/**
 * Calculate mind defense from willpower and intelligence
 * Formula: mindDefense = (willpower * 0.6) + (intelligence * 0.4)
 *
 * @param base - Base stats
 * @returns Calculated mind defense value
 */
export function calculateMindDefense(base: BaseStats): number {
  const willpowerComponent = base.willpower * 0.6;
  const intelligenceComponent = base.intelligence * 0.4;
  return Math.max(0, Math.floor(willpowerComponent + intelligenceComponent));
}

/**
 * Calculate magical defense from willpower
 * Formula: magicalDefense = willpower * 0.7
 *
 * @param base - Base stats
 * @returns Calculated magical defense value
 */
export function calculateMagicalDefense(base: BaseStats): number {
  const baseMagicalDefense = base.willpower * 0.7;
  return Math.max(0, Math.floor(baseMagicalDefense));
}

/**
 * Calculate movement speed from dexterity and equipment weight
 * Formula: speed = 1.0 + (dexterity * 0.02) - (equipmentWeight * 0.05)
 *
 * Base speed is 1.0, dexterity increases it, heavy equipment slows it down
 *
 * @param base - Base stats
 * @param equipmentWeight - Optional equipment weight penalty
 * @returns Calculated speed multiplier (minimum 0.5)
 */
export function calculateSpeed(base: BaseStats, equipmentWeight = 0): number {
  const baseSpeed = 1.0;
  const dexterityBonus = base.dexterity * 0.02;
  const weightPenalty = equipmentWeight * 0.05;
  return Math.max(0.5, baseSpeed + dexterityBonus - weightPenalty);
}

/**
 * Calculate carry capacity from strength
 * Formula: carryCapacity = strength * 10
 *
 * Base formula: 10 pounds per point of strength
 * This determines max inventory weight before penalties
 *
 * @param base - Base stats
 * @returns Calculated carry capacity in pounds
 */
export function calculateCarryCapacity(base: BaseStats): number {
  return base.strength * 10;
}

/**
 * Calculate all derived stats from base stats
 *
 * This is the main function to use when you need to recalculate derived stats.
 * Call this whenever base stats change or equipment changes.
 *
 * @param base - Base stats
 * @param equipmentWeight - Optional total weight of equipped items
 * @returns Complete derived stats object
 */
export function calculateDerivedStats(
  base: BaseStats,
  equipmentWeight = 0
): DerivedStats {
  return {
    defense: calculateDefense(base, equipmentWeight),
    dodge: calculateDodge(base, equipmentWeight),
    mindDefense: calculateMindDefense(base),
    magicalDefense: calculateMagicalDefense(base),
    speed: calculateSpeed(base, equipmentWeight),
    carryCapacity: calculateCarryCapacity(base),
  };
}

/**
 * Derived Stats System - Recalculates derived stats for all entities with stats
 *
 * Call this system whenever base stats change (level up, permanent modifiers, etc.)
 * This ensures derived stats stay synchronized with base stats.
 *
 * Note: For temporary modifiers (buffs/debuffs), use the stat modifier system instead.
 *
 * @param ecs - The ECS instance
 */
export function derivedStatsSystem(ecs: ECS): void {
  const entities = ecs.query('stats');

  for (const entityId of entities) {
    const stats = ecs.getComponent<StatsComponent>(entityId, 'stats');

    if (stats) {
      // Recalculate derived stats from current base stats
      // TODO: Add equipment weight calculation when inventory system is implemented
      const equipmentWeight = 0;
      stats.derived = calculateDerivedStats(stats.base, equipmentWeight);
    }
  }
}
