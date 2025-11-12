/*
 * File: playerMovementSystem.ts
 * Project: littlejs-rl
 * File Created: Monday, 11th November 2025 11:30:00 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Monday, 11th November 2025 11:30:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import {
  InputComponent,
  PositionComponent,
  StatsComponent,
} from '../components';

import ECS from '../ecs';

/**
 * Player Movement System - Moves player entities based on input
 *
 * Processes all entities with 'player', 'position', 'input', and 'stats' components.
 * Applies movement based on input direction and player speed from stats.
 *
 * Should be called after inputSystem and before aiSystem in the update loop.
 *
 * @param ecs - The ECS instance
 *
 * @example
 * ```typescript
 * function gameUpdate() {
 *   inputSystem(ecs);
 *   playerMovementSystem(ecs); // Process player movement
 *   aiSystem(ecs, playerId);
 * }
 * ```
 */
export function playerMovementSystem(ecs: ECS): void {
  const playerEntities = ecs.query('player', 'position', 'input', 'stats');

  for (const entityId of playerEntities) {
    const pos = ecs.getComponent<PositionComponent>(entityId, 'position');
    const input = ecs.getComponent<InputComponent>(entityId, 'input');
    const stats = ecs.getComponent<StatsComponent>(entityId, 'stats');

    if (!pos || !input || !stats) continue;

    // Apply movement with speed
    if (input.moveX !== 0 || input.moveY !== 0) {
      pos.x += input.moveX * stats.speed;
      pos.y += input.moveY * stats.speed;
    }

    // Handle action
    if (input.action) {
      // Perform action (attack, interact, etc.)
      // This can trigger other systems or events
    }
  }
}
