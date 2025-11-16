/*
 * File: deathSystem.ts
 * Project: littlejs-rl
 * File Created: Saturday, 16th November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Saturday, 16th November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import ECS from '../ecs';
import { HealthComponent } from '../components/health';
import { PlayerComponent } from '../components/player';
import { generateLoot } from './lootSystem';

/**
 * Death system that handles entity death and triggers loot drops
 *
 * Checks all entities with health <= 0 and:
 * 1. Generates loot drops using their loot table (if present)
 * 2. Destroys the dead entity
 * 3. Logs death messages (if debug enabled)
 *
 * @param ecs - The ECS instance
 * @returns Array of entity IDs that died this frame
 *
 * @example
 * ```typescript
 * // In game update loop
 * const deadEntities = deathSystem(ecs);
 * if (deadEntities.length > 0) {
 *   console.log(`${deadEntities.length} entities died`);
 * }
 * ```
 */
export function deathSystem(ecs: ECS): number[] {
  const entities = ecs.query('health');
  const deadEntities: number[] = [];

  for (const entityId of entities) {
    const health = ecs.getComponent<HealthComponent>(entityId, 'health');

    if (health && health.current <= 0) {
      // Check if this is the player
      const isPlayer = ecs.getComponent<PlayerComponent>(entityId, 'player');

      if (isPlayer) {
        // TODO: Handle player death (game over, respawn, etc.)
        console.log('Player died!');
        continue; // Don't destroy player entity yet
      }

      // Generate loot drops (if entity has loot table)
      const droppedItems = generateLoot(ecs, entityId);

      if (droppedItems.length > 0) {
        console.log(
          `Entity ${entityId} died and dropped ${droppedItems.length} item(s)`
        );
      } else {
        console.log(`Entity ${entityId} died (no loot)`);
      }

      // Destroy the entity
      ecs.removeEntity(entityId);
      deadEntities.push(entityId);
    }
  }

  return deadEntities;
}

/**
 * Check if an entity is dead (health <= 0)
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to check
 * @returns True if entity has health <= 0
 */
export function isDead(ecs: ECS, entityId: number): boolean {
  const health = ecs.getComponent<HealthComponent>(entityId, 'health');
  return health ? health.current <= 0 : false;
}

/**
 * Kill an entity by setting health to 0
 * (Death system will handle cleanup on next frame)
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to kill
 */
export function killEntity(ecs: ECS, entityId: number): void {
  const health = ecs.getComponent<HealthComponent>(entityId, 'health');
  if (health) {
    health.current = 0;
  }
}
