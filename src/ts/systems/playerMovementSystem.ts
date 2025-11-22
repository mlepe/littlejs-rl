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
import { EntityState } from '../components/state';

import ECS from '../ecs';
import Game from '../game';
import { collisionSystem } from './collisionSystem';
import { combatSystem } from './combatSystem';
import { addState, removeState } from './stateSystem';

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

    // Track if player is moving this frame
    const isMovingThisFrame = input.moveX !== 0 || input.moveY !== 0;

    // Apply movement (grid-based, one tile at a time)
    if (isMovingThisFrame) {
      // Set MOVING state
      addState(ecs, entityId, EntityState.MOVING);

      const newX = Math.floor(pos.x + input.moveX);
      const newY = Math.floor(pos.y + input.moveY);

      // Check if target tile has an entity - if so, attack instead of moving
      if (!collisionSystem(ecs, entityId, newX, newY)) {
        // Tile is occupied - perform melee attack
        addState(ecs, entityId, EntityState.ATTACKING);

        const attackResult = combatSystem(ecs, entityId, newX, newY);

        if (attackResult && attackResult.hit) {
          console.log(`Player attacks for ${attackResult.damage} damage!`);
          if (attackResult.killed) {
            console.log('Enemy defeated!');
          }
        }

        // Remove MOVING state (didn't actually move), keep ATTACKING
        removeState(ecs, entityId, EntityState.MOVING);

        // Don't move - stay in current position after attacking
        continue;
      }

      // No entity blocking - check terrain collision
      const game = Game.getInstance();
      const location = game.getCurrentLocation();

      // Allow movement beyond location bounds for edge transitions
      // locationTransitionSystem will handle wrapping to next location
      const isWithinBounds =
        location &&
        newX >= 0 &&
        newX < location.width &&
        newY >= 0 &&
        newY < location.height;

      if (isWithinBounds && location) {
        // Check walkability only if within bounds
        if (location.isWalkable(newX, newY)) {
          // Move to new position (tile-based, integer coordinates)
          pos.x = newX;
          pos.y = newY;
        } else {
          // Couldn't move (wall/obstacle)
          removeState(ecs, entityId, EntityState.MOVING);
        }
      } else {
        // Moving beyond location bounds - allow it for edge transition
        // locationTransitionSystem will handle moving to adjacent location
        pos.x = newX;
        pos.y = newY;
      }
    } else {
      // Not moving this frame - remove MOVING state
      removeState(ecs, entityId, EntityState.MOVING);
      // Also clear ATTACKING state if not attacking
      removeState(ecs, entityId, EntityState.ATTACKING);
    }

    // Handle action
    if (input.action) {
      // Perform action (attack, interact, etc.)
      // This can trigger other systems or events
    }
  }
}
