/*
 * File: inputSystem.ts
 * Project: littlejs-rl
 * File Created: Monday, 11th November 2025 11:30:00 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Monday, 11th November 2025 11:30:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

import ECS from '../ecs';
import { InputComponent } from '../components';

/**
 * Input System - Captures keyboard input for player entities
 *
 * Reads keyboard state from LittleJS and updates InputComponent for all
 * entities with 'player' and 'input' components.
 *
 * Supported controls:
 * - Arrow keys or WASD for movement
 * - Space for action
 *
 * @param ecs - The ECS instance
 *
 * @example
 * ```typescript
 * function gameUpdate() {
 *   inputSystem(ecs); // Call first in update loop
 *   playerMovementSystem(ecs);
 * }
 * ```
 */
export function inputSystem(ecs: ECS): void {
  const playerEntities = ecs.query('player', 'input');

  for (const entityId of playerEntities) {
    const input = ecs.getComponent<InputComponent>(entityId, 'input');
    if (!input) continue;

    // Reset input
    input.moveX = 0;
    input.moveY = 0;
    input.action = false;

    // Read keyboard input (LittleJS) - use keyWasPressed for turn-based movement
    if (LJS.keyWasPressed('ArrowLeft') || LJS.keyWasPressed('KeyA')) {
      input.moveX = -1;
    }
    if (LJS.keyWasPressed('ArrowRight') || LJS.keyWasPressed('KeyD')) {
      input.moveX = 1;
    }
    if (LJS.keyWasPressed('ArrowUp') || LJS.keyWasPressed('KeyW')) {
      input.moveY = -1;
    }
    if (LJS.keyWasPressed('ArrowDown') || LJS.keyWasPressed('KeyS')) {
      input.moveY = 1;
    }
    if (LJS.keyWasPressed('Space')) {
      input.action = true;
    }
  }
}
