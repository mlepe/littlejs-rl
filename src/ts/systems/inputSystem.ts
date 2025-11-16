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

  // Define keybindings as a constant object (supports multiple keys per action)
  const keybinds = {
    UP: ['ArrowUp', 'KeyW', 'Numpad8'],
    DOWN: ['ArrowDown', 'KeyS', 'Numpad2'],
    LEFT: ['ArrowLeft', 'KeyA', 'Numpad4'],
    RIGHT: ['ArrowRight', 'KeyD', 'Numpad6'],
    UP_LEFT: ['Numpad7'],
    UP_RIGHT: ['Numpad9'],
    DOWN_LEFT: ['Numpad1'],
    DOWN_RIGHT: ['Numpad3'],
    ACTION: ['Space', 'Enter', 'KeyE'],
    PICKUP: ['KeyG'],
    ZOOM_IN: ['Equal', 'NumpadAdd'],
    ZOOM_OUT: ['Minus', 'NumpadSubtract'],
    DEBUG_TOGGLE_COLLISION_DISPLAY: ['KeyC'],
    DEBUG_TOGGLE_DEBUG_TEXT: ['KeyX'],
  } as const;

  for (const entityId of playerEntities) {
    const input = ecs.getComponent<InputComponent>(entityId, 'input');
    if (!input) continue;

    // Reset input
    input.moveX = 0;
    input.moveY = 0;
    input.action = false;
    input.pickup = false;
    input.zoomIn = false;
    input.zoomOut = false;
    input.debugToggleCollision = false;
    input.debugToggleText = false;

    // Read keyboard input (LittleJS) - use keyWasPressed for turn-based movement

    // Check LEFT movement
    if (keybinds.LEFT.some((key) => LJS.keyWasPressed(key))) {
      input.moveX = -1;
    }

    // Check RIGHT movement
    if (keybinds.RIGHT.some((key) => LJS.keyWasPressed(key))) {
      input.moveX = 1;
    }

    // Check UP movement (Y axis is inverted in screen coordinates)
    if (keybinds.UP.some((key) => LJS.keyWasPressed(key))) {
      input.moveY = 1;
    }

    // Check DOWN movement
    if (keybinds.DOWN.some((key) => LJS.keyWasPressed(key))) {
      input.moveY = -1;
    }

    // Check UP_LEFT movement (Y axis is inverted in screen coordinates)
    if (keybinds.UP_LEFT.some((key) => LJS.keyWasPressed(key))) {
      input.moveX = -1;
      input.moveY = 1;
    }

    // Check UP_RIGHT movement
    if (keybinds.UP_RIGHT.some((key) => LJS.keyWasPressed(key))) {
      input.moveX = 1;
      input.moveY = 1;
    }

    // Check DOWN_LEFT movement
    if (keybinds.DOWN_LEFT.some((key) => LJS.keyWasPressed(key))) {
      input.moveX = -1;
      input.moveY = -1;
    }

    // Check DOWN_RIGHT movement
    if (keybinds.DOWN_RIGHT.some((key) => LJS.keyWasPressed(key))) {
      input.moveX = 1;
      input.moveY = -1;
    }

    // Check ACTION
    if (keybinds.ACTION.some((key) => LJS.keyWasPressed(key))) {
      input.action = true;
    }

    // Check PICKUP
    if (keybinds.PICKUP.some((key) => LJS.keyWasPressed(key))) {
      input.pickup = true;
    }

    // Check ZOOM_IN
    if (keybinds.ZOOM_IN.some((key) => LJS.keyWasPressed(key))) {
      input.zoomIn = true;
    }

    // Check ZOOM_OUT
    if (keybinds.ZOOM_OUT.some((key) => LJS.keyWasPressed(key))) {
      input.zoomOut = true;
    }

    // Check DEBUG_TOGGLE_COLLISION_DISPLAY
    if (
      keybinds.DEBUG_TOGGLE_COLLISION_DISPLAY.some((key) =>
        LJS.keyWasPressed(key)
      )
    ) {
      input.debugToggleCollision = true;
    }

    // Check DEBUG_TOGGLE_DEBUG_TEXT
    if (
      keybinds.DEBUG_TOGGLE_DEBUG_TEXT.some((key) => LJS.keyWasPressed(key))
    ) {
      input.debugToggleText = true;
    }
  }
}
