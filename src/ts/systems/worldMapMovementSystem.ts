/*
 * File: worldMapMovementSystem.ts
 * Project: littlejs-rl
 * File Created: Saturday, 16th November 2025 1:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Saturday, 16th November 2025 1:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

import { InputComponent, ViewModeComponent } from '../components';

import ECS from '../ecs';
import Game from '../game';
import { ViewMode } from '../components/viewMode';

/**
 * World Map Movement System - Handles cursor movement on the world map
 *
 * Processes entities with 'viewMode' and 'input' components when in WORLD_MAP mode.
 * Moves the world map cursor based on input direction.
 *
 * Should be called after inputSystem when in world map view.
 *
 * @param ecs - The ECS instance
 *
 * @example
 * ```typescript
 * function gameUpdate() {
 *   inputSystem(ecs);
 *
 *   // Check view mode and route to appropriate system
 *   if (viewMode === ViewMode.WORLD_MAP) {
 *     worldMapMovementSystem(ecs);
 *   } else {
 *     playerMovementSystem(ecs);
 *   }
 * }
 * ```
 */
export function worldMapMovementSystem(ecs: ECS): void {
  const entities = ecs.query('viewMode', 'input');

  for (const entityId of entities) {
    const viewMode = ecs.getComponent<ViewModeComponent>(entityId, 'viewMode');
    const input = ecs.getComponent<InputComponent>(entityId, 'input');

    if (!viewMode || !input) continue;
    if (viewMode.mode !== ViewMode.WORLD_MAP) continue;

    // Apply movement to world map cursor
    if (input.moveX !== 0 || input.moveY !== 0) {
      const game = Game.getInstance();
      const worldMap = game.getWorldMap();

      const newX = Math.floor(viewMode.worldMapCursorX + input.moveX);
      const newY = Math.floor(viewMode.worldMapCursorY + input.moveY);

      // Check if movement is valid
      if (worldMap.canMoveTo(newX, newY)) {
        viewMode.worldMapCursorX = newX;
        viewMode.worldMapCursorY = newY;

        // Update camera to follow cursor
        LJS.setCameraPos(
          LJS.vec2(
            -worldMap.getWorld().width + newX * 2 + 1,
            -worldMap.getWorld().height + newY * 2 + 1
          )
        );

        if (Game.isDebug) {
          console.log(`[WorldMap] Cursor moved to (${newX}, ${newY})`);
        }
      }
    }
  }
}
