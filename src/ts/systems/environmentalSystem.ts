/*
 * File: environmentalSystem.ts
 * Project: littlejs-rl
 * File Created: Thursday, 21st November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 21st November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import ECS from '../ecs';
import { EnvironmentalComponent } from '../components/environmental';
import { PositionComponent } from '../components/position';
import { LocationComponent } from '../components/locationComponent';
import { BiomeType, getBiomeConfig } from '../biomeConfig';

/**
 * Updates environmental resistances for all entities based on their current biome
 * This system applies temperature-based resistance modifiers from the biome
 * @param ecs - Entity Component System
 * @param currentBiome - The current biome at this location
 */
export function environmentalSystem(ecs: ECS, currentBiome: BiomeType): void {
  const entities = ecs.query('environmental');

  const biomeConfig = getBiomeConfig(currentBiome);
  const biomeEnv = biomeConfig.environment;

  for (const entityId of entities) {
    const envComp = ecs.getComponent<EnvironmentalComponent>(
      entityId,
      'environmental'
    );

    if (!envComp) continue;

    // Apply biome environmental modifiers
    envComp.currentColdResistance =
      envComp.baseColdResistance + biomeEnv.coldResistanceModifier;
    envComp.currentFireResistance =
      envComp.baseFireResistance + biomeEnv.fireResistanceModifier;

    // Apply visibility and light level from biome
    envComp.visibilityModifier = biomeEnv.visibilityModifier;
    envComp.lightLevel = biomeEnv.lightLevel;

    // Clamp resistances to valid range [-1, 1]
    envComp.currentColdResistance = Math.max(
      -1,
      Math.min(1, envComp.currentColdResistance)
    );
    envComp.currentFireResistance = Math.max(
      -1,
      Math.min(1, envComp.currentFireResistance)
    );
  }
}

/**
 * Calculate damage multiplier based on environmental resistance
 * Used by combat systems to modify elemental damage
 * @param resistance - Current resistance value (-1 to +1)
 * @returns Damage multiplier (0 = immune, 1 = normal, >1 = vulnerable)
 */
export function getEnvironmentalDamageMultiplier(resistance: number): number {
  // -1 (vulnerable): 2x damage
  // 0 (normal): 1x damage
  // +1 (immune): 0x damage
  return 1 - resistance;
}

/**
 * Apply environmental damage to an entity
 * For future use with hazards and weather effects
 * @param ecs - Entity Component System
 * @param entityId - Entity to damage
 * @param damageType - Type of environmental damage ('cold' or 'fire')
 * @param baseDamage - Base damage amount
 */
export function applyEnvironmentalDamage(
  ecs: ECS,
  entityId: number,
  damageType: 'cold' | 'fire',
  baseDamage: number
): number {
  const envComp = ecs.getComponent<EnvironmentalComponent>(
    entityId,
    'environmental'
  );

  if (!envComp) {
    return baseDamage; // No resistance, full damage
  }

  const resistance =
    damageType === 'cold'
      ? envComp.currentColdResistance
      : envComp.currentFireResistance;

  const multiplier = getEnvironmentalDamageMultiplier(resistance);
  return Math.floor(baseDamage * multiplier);
}

/**
 * Get the effective visibility range for an entity
 * @param ecs - Entity Component System
 * @param entityId - Entity ID
 * @param baseRange - Base visibility range
 * @returns Effective visibility range after environmental modifiers
 */
export function getEffectiveVisibilityRange(
  ecs: ECS,
  entityId: number,
  baseRange: number
): number {
  const envComp = ecs.getComponent<EnvironmentalComponent>(
    entityId,
    'environmental'
  );

  if (!envComp) {
    return baseRange;
  }

  return Math.floor(baseRange * envComp.visibilityModifier);
}

/**
 * Check if an entity has adequate light
 * @param ecs - Entity Component System
 * @param entityId - Entity ID
 * @param requiredLightLevel - Required light level (0-1)
 * @returns True if entity has adequate light
 */
export function hasAdequateLight(
  ecs: ECS,
  entityId: number,
  requiredLightLevel: number = 0.3
): boolean {
  const envComp = ecs.getComponent<EnvironmentalComponent>(
    entityId,
    'environmental'
  );

  if (!envComp) {
    return true; // No component means no light restrictions
  }

  return envComp.lightLevel >= requiredLightLevel;
}
