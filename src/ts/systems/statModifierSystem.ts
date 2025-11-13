/*
 * File: statModifierSystem.ts
 * Project: littlejs-rl
 * File Created: Wednesday, 13th November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Wednesday, 13th November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import type {
  ModifierType,
  StatModifier,
  StatModifierComponent,
} from '../components/statModifier';

import type ECS from '../ecs';
import type { StatsComponent } from '../components/stats';

/**
 * Add a stat modifier to an entity
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to add modifier to
 * @param stat - Name of stat to modify (e.g., 'strength', 'defense', 'speed')
 * @param type - Type of modification (flat or percentage)
 * @param value - Value of modification
 * @param duration - Optional duration in turns (-1 for permanent, undefined for permanent)
 * @param source - Optional source identifier
 */
export function addStatModifier(
  ecs: ECS,
  entityId: number,
  stat: string,
  type: ModifierType,
  value: number,
  duration?: number,
  source?: string
): void {
  let modifierComp = ecs.getComponent<StatModifierComponent>(
    entityId,
    'statModifier'
  );

  // If entity doesn't have StatModifierComponent, add it
  if (!modifierComp) {
    ecs.addComponent<StatModifierComponent>(entityId, 'statModifier', {
      modifiers: [],
    });
    modifierComp = ecs.getComponent<StatModifierComponent>(
      entityId,
      'statModifier'
    );
  }

  if (modifierComp) {
    const modifier: StatModifier = {
      stat,
      type,
      value,
      duration: duration ?? -1, // Default to permanent
      source,
    };
    modifierComp.modifiers.push(modifier);
  }
}

/**
 * Remove stat modifiers by source
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to remove modifiers from
 * @param source - Source identifier to match
 */
export function removeStatModifiersBySource(
  ecs: ECS,
  entityId: number,
  source: string
): void {
  const modifierComp = ecs.getComponent<StatModifierComponent>(
    entityId,
    'statModifier'
  );

  if (modifierComp) {
    modifierComp.modifiers = modifierComp.modifiers.filter(
      (mod) => mod.source !== source
    );
  }
}

/**
 * Calculate the final value of a stat after applying all modifiers
 *
 * @param baseValue - The base stat value before modifiers
 * @param modifiers - Array of modifiers to apply
 * @returns Final calculated stat value
 */
function calculateModifiedStat(
  baseValue: number,
  modifiers: StatModifier[]
): number {
  let flatBonus = 0;
  let percentageMultiplier = 1;

  // Apply all flat modifiers first
  for (const mod of modifiers) {
    if (mod.type === 'flat') {
      flatBonus += mod.value;
    }
  }

  // Then apply all percentage modifiers
  for (const mod of modifiers) {
    if (mod.type === 'percentage') {
      percentageMultiplier += mod.value;
    }
  }

  // Calculate final value: (base + flat) * percentage
  return (baseValue + flatBonus) * percentageMultiplier;
}

/**
 * Get the effective stat value for an entity, including all modifiers
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to get stat for
 * @param stat - Name of stat to retrieve (e.g., 'strength', 'defense', 'speed')
 * @returns Effective stat value, or undefined if entity doesn't have stats
 */
export function getEffectiveStat(
  ecs: ECS,
  entityId: number,
  stat: string
): number | undefined {
  const statsComp = ecs.getComponent<StatsComponent>(entityId, 'stats');
  if (!statsComp) return undefined;

  // Get base stat value
  const baseValue = (statsComp as any)[stat];
  if (baseValue === undefined) return undefined;

  const modifierComp = ecs.getComponent<StatModifierComponent>(
    entityId,
    'statModifier'
  );

  // If no modifiers, return base value
  if (!modifierComp || modifierComp.modifiers.length === 0) {
    return baseValue;
  }

  // Filter modifiers that affect this specific stat
  const relevantModifiers = modifierComp.modifiers.filter(
    (mod) => mod.stat === stat
  );

  return calculateModifiedStat(baseValue, relevantModifiers);
}

/**
 * Stat Modifier System - Updates stat modifier durations and removes expired modifiers
 *
 * Call this once per game turn/tick to decrement durations.
 * Does NOT automatically apply modifiers - use getEffectiveStat() when you need stat values.
 *
 * @param ecs - The ECS instance
 */
export function statModifierSystem(ecs: ECS): void {
  const entities = ecs.query('statModifier');

  for (const entityId of entities) {
    const modifierComp = ecs.getComponent<StatModifierComponent>(
      entityId,
      'statModifier'
    );

    if (modifierComp) {
      // Update durations and filter out expired modifiers
      modifierComp.modifiers = modifierComp.modifiers.filter((mod) => {
        // Permanent modifiers (duration = -1) are never removed
        if (mod.duration === -1 || mod.duration === undefined) return true;

        // Decrement duration
        mod.duration--;

        // Remove if expired (duration <= 0)
        return mod.duration > 0;
      });
    }
  }
}
