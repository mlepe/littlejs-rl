/*
 * File: collisionSystem.ts
 * Project: littlejs-rl
 * File Created: Sunday, 17th November 2025 12:30:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Sunday, 17th November 2025 12:30:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import type ECS from '../ecs';
import type { PositionComponent } from '../components/position';
import type { MovableComponent } from '../components/movable';

/**
 * Check if an entity can move to a specific position
 *
 * Prevents entities from overlapping by checking if another entity
 * is already occupying the target tile position.
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity attempting to move
 * @param newX - Intended new X position
 * @param newY - Intended new Y position
 * @returns true if position is valid (no collision), false if blocked
 *
 * @example
 * ```typescript
 * const newX = pos.x + dx;
 * const newY = pos.y + dy;
 *
 * if (canMoveTo(ecs, playerId, newX, newY)) {
 *   pos.x = newX;
 *   pos.y = newY;
 * } else {
 *   console.log('Blocked by another entity!');
 * }
 * ```
 */
export function canMoveTo(
  ecs: ECS,
  entityId: number,
  newX: number,
  newY: number
): boolean {
  // Only check collision with entities that have MovableComponent
  // This excludes items on the ground, which shouldn't block movement
  const entities = ecs.query('position', 'movable');

  for (const otherId of entities) {
    // Skip self
    if (otherId === entityId) continue;

    const otherPos = ecs.getComponent<PositionComponent>(otherId, 'position');
    if (!otherPos) continue;

    // Check if positions overlap (grid-based collision)
    const targetTileX = Math.floor(newX);
    const targetTileY = Math.floor(newY);
    const otherTileX = Math.floor(otherPos.x);
    const otherTileY = Math.floor(otherPos.y);

    if (targetTileX === otherTileX && targetTileY === otherTileY) {
      return false; // Blocked by another movable entity
    }
  }

  return true; // No collision
}

/**
 * Collision System - Validates entity movement to prevent overlaps
 *
 * This is a helper system called before applying movement in
 * movement systems (playerMovementSystem, aiSystem, etc.).
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity attempting to move
 * @param newX - Intended new X position
 * @param newY - Intended new Y position
 * @returns true if movement is valid, false if blocked
 */
export function collisionSystem(
  ecs: ECS,
  entityId: number,
  newX: number,
  newY: number
): boolean {
  return canMoveTo(ecs, entityId, newX, newY);
}
