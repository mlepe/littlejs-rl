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
  LocationComponent,
  PositionComponent,
  StatsComponent,
} from '../components';

import ECS from '../ecs';
import Game from '../game';
import { collisionSystem } from './collisionSystem';

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
  const playerEntities = ecs.query('player', 'position', 'input', 'location');

  for (const entityId of playerEntities) {
    const pos = ecs.getComponent<PositionComponent>(entityId, 'position');
    const input = ecs.getComponent<InputComponent>(entityId, 'input');
    const locationComp = ecs.getComponent<LocationComponent>(
      entityId,
      'location'
    );

    if (!pos || !input || !locationComp) continue;

    // Apply movement (grid-based, one tile at a time)
    if (input.moveX !== 0 || input.moveY !== 0) {
      const newX = Math.floor(pos.x + input.moveX);
      const newY = Math.floor(pos.y + input.moveY);

      // Check entity-entity collision first
      if (!collisionSystem(ecs, entityId, newX, newY)) {
        // Blocked by another entity, don't move
        continue;
      }

      // Get current location to check terrain collision
      const game = Game.getInstance();
      const location = game.getCurrentLocation();

      if (location && location.isWalkable(newX, newY)) {
        // Move to new position (tile-based, integer coordinates)
        pos.x = newX;
        pos.y = newY;
      }
    }

    // Handle action
    if (input.action) {
      // Perform action (attack, interact, etc.)
      // This can trigger other systems or events
    }
  }
}
