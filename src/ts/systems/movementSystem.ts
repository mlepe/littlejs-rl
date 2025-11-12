/*
 * File: movementSystem.ts
 * Project: littlejs-rl
 * File Created: Monday, 11th November 2025 11:30:00 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Monday, 11th November 2025 11:30:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { PositionComponent } from '../components';

import ECS from '../ecs';

/**
 * Movement System - Applies directional movement to all movable entities
 *
 * This is a generic movement system that moves ALL entities with 'position'
 * and 'movable' components by the specified delta.
 *
 * Note: This is typically NOT used in the main game loop. Instead, use:
 * - inputSystem + playerMovementSystem for player movement
 * - aiSystem for NPC/enemy movement
 *
 * This system is useful for:
 * - Testing movement behavior
 * - Applying global world shifts (e.g., scrolling backgrounds)
 * - Special effects that move all entities at once
 *
 * @param ecs - The ECS instance
 * @param dx - Delta X to add to all entity positions
 * @param dy - Delta Y to add to all entity positions
 *
 * @example
 * ```typescript
 * // Move all movable entities 5 tiles to the right
 * movementSystem(ecs, 5, 0);
 *
 * // Shift world downward by 2 tiles (earthquake effect)
 * movementSystem(ecs, 0, 2);
 * ```
 */
export function movementSystem(ecs: ECS, dx: number, dy: number): void {
  const entities = ecs.query('position', 'movable');

  for (const id of entities) {
    const pos = ecs.getComponent<PositionComponent>(id, 'position');
    if (pos) {
      pos.x += dx;
      pos.y += dy;
    }
  }
}
