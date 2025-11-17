/*
 * File: examineCursorMovementSystem.ts
 * Project: littlejs-rl
 * File Created: Sunday, 17th November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Sunday, 17th November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { InputComponent, ViewModeComponent } from '../components';

import ECS from '../ecs';
import Game from '../game';
import { ViewMode } from '../components/viewMode';

/**
 * Examine Cursor Movement System - Moves the examine cursor based on input
 *
 * Processes player input to move the examine cursor around the current location.
 * Only active when ViewMode is EXAMINE.
 * Cursor is clamped to the location bounds.
 *
 * @param ecs - The ECS instance
 *
 * @example
 * ```typescript
 * function gameUpdate() {
 *   if (viewMode === ViewMode.EXAMINE) {
 *     examineCursorMovementSystem(ecs);
 *   }
 * }
 * ```
 */
export function examineCursorMovementSystem(ecs: ECS): void {
  const playerEntities = ecs.query('player', 'input', 'viewMode');
  const game = Game.getInstance();
  const location = game.getCurrentLocation();

  if (!location) {
    return;
  }

  for (const entityId of playerEntities) {
    const viewMode = ecs.getComponent<ViewModeComponent>(entityId, 'viewMode');
    const input = ecs.getComponent<InputComponent>(entityId, 'input');

    if (!viewMode || !input) {
      continue;
    }

    // Only process cursor movement in examine mode
    if (viewMode.mode !== ViewMode.EXAMINE) {
      continue;
    }

    // Move cursor based on input
    if (input.moveX !== 0 || input.moveY !== 0) {
      viewMode.examineCursorX += input.moveX;
      viewMode.examineCursorY += input.moveY;

      // Clamp to location bounds
      viewMode.examineCursorX = Math.max(
        0,
        Math.min(location.width - 1, viewMode.examineCursorX)
      );
      viewMode.examineCursorY = Math.max(
        0,
        Math.min(location.height - 1, viewMode.examineCursorY)
      );
    }
  }
}
