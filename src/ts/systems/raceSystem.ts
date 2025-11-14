/*
 * File: raceSystem.ts
 * Project: littlejs-rl
 * File Created: Thursday, 14th November 2025 11:55:00 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 14th November 2025 11:55:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import {
  addStatModifier,
  removeStatModifiersBySource,
} from './statModifierSystem';

import type ECS from '../ecs';
import { ModifierType } from '../components/statModifier';
import type { RaceComponent } from '../components/race';
import { RaceRegistry } from '../data/raceRegistry';

const RACE_MODIFIER_SOURCE = 'race';

/**
 * Apply racial stat modifiers to an entity
 *
 * Reads the entity's RaceComponent, looks up the race template,
 * and applies all racial stat bonuses as permanent modifiers.
 *
 * Call this once when an entity is created or when its race changes.
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to apply racial bonuses to
 */
export function applyRacialBonuses(ecs: ECS, entityId: number): void {
  const raceComp = ecs.getComponent<RaceComponent>(entityId, 'race');
  if (!raceComp) {
    console.warn(`[raceSystem] Entity ${entityId} has no race component`);
    return;
  }

  const raceRegistry = RaceRegistry.getInstance();
  const raceTemplate = raceRegistry.get(raceComp.raceId);

  if (!raceTemplate) {
    console.warn(
      `[raceSystem] Race "${raceComp.raceId}" not found in registry`
    );
    return;
  }

  // Remove any existing racial modifiers first
  removeStatModifiersBySource(ecs, entityId, RACE_MODIFIER_SOURCE);

  // Apply racial stat modifiers
  if (raceTemplate.statModifiers) {
    for (const [stat, modifier] of Object.entries(raceTemplate.statModifiers)) {
      if (!modifier) continue;

      // Apply flat bonus if present
      if (modifier.flat !== undefined && modifier.flat !== 0) {
        addStatModifier(
          ecs,
          entityId,
          stat,
          ModifierType.FLAT,
          modifier.flat,
          -1, // Permanent
          RACE_MODIFIER_SOURCE
        );
      }

      // Apply percentage bonus if present
      if (modifier.percent !== undefined && modifier.percent !== 0) {
        addStatModifier(
          ecs,
          entityId,
          stat,
          ModifierType.PERCENTAGE,
          modifier.percent,
          -1, // Permanent
          RACE_MODIFIER_SOURCE
        );
      }
    }
  }

  console.log(
    `[raceSystem] Applied racial bonuses for ${raceTemplate.name} to entity ${entityId}`
  );
}

/**
 * Change an entity's race
 *
 * Updates the RaceComponent and reapplies racial bonuses.
 * Removes old racial bonuses before applying new ones.
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to change race for
 * @param newRaceId - ID of the new race
 */
export function changeRace(
  ecs: ECS,
  entityId: number,
  newRaceId: string
): void {
  const raceRegistry = RaceRegistry.getInstance();
  const newRace = raceRegistry.get(newRaceId);

  if (!newRace) {
    console.error(`[raceSystem] Race "${newRaceId}" not found in registry`);
    return;
  }

  // Update or create race component
  let raceComp = ecs.getComponent<RaceComponent>(entityId, 'race');

  if (!raceComp) {
    ecs.addComponent<RaceComponent>(entityId, 'race', {
      raceId: newRaceId,
      raceName: newRace.name,
      raceType: newRace.type,
      abilities: newRace.abilities ? [...newRace.abilities] : [],
    });
  } else {
    raceComp.raceId = newRaceId;
    raceComp.raceName = newRace.name;
    raceComp.raceType = newRace.type;
    raceComp.abilities = newRace.abilities ? [...newRace.abilities] : [];
  }

  // Apply new racial bonuses
  applyRacialBonuses(ecs, entityId);
}

/**
 * Get class affinity for a race
 *
 * Returns the affinity modifier for a specific class.
 * Positive = affinity, negative = penalty, 0 = neutral.
 *
 * @param raceId - Race ID to check
 * @param classId - Class ID to check affinity for
 * @returns Affinity value, or 0 if no affinity defined
 */
export function getClassAffinity(raceId: string, classId: string): number {
  const raceRegistry = RaceRegistry.getInstance();
  const race = raceRegistry.get(raceId);

  if (!race || !race.classAffinities) return 0;

  return race.classAffinities[classId] || 0;
}
