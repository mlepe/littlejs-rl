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

export function inputSystem(ecs: ECS): void {
  const playerEntities = ecs.query('player', 'input');

  for (const entityId of playerEntities) {
    const input = ecs.getComponent<InputComponent>(entityId, 'input');
    if (!input) continue;

    // Reset input
    input.moveX = 0;
    input.moveY = 0;
    input.action = false;

    // Read keyboard input (LittleJS)
    if (LJS.keyIsDown('ArrowLeft') || LJS.keyIsDown('KeyA')) {
      input.moveX = -1;
    }
    if (LJS.keyIsDown('ArrowRight') || LJS.keyIsDown('KeyD')) {
      input.moveX = 1;
    }
    if (LJS.keyIsDown('ArrowUp') || LJS.keyIsDown('KeyW')) {
      input.moveY = -1;
    }
    if (LJS.keyIsDown('ArrowDown') || LJS.keyIsDown('KeyS')) {
      input.moveY = 1;
    }
    if (LJS.keyWasPressed('Space')) {
      input.action = true;
    }
  }
}
