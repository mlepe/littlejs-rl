/*
 * File: renderSystem.ts
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

import { PositionComponent, RenderComponent } from '../components';

import ECS from '../ecs';

export function renderSystem(ecs: ECS): void {
  const entities = ecs.query('position', 'render');

  for (const id of entities) {
    const pos = ecs.getComponent<PositionComponent>(id, 'position');
    const render = ecs.getComponent<RenderComponent>(id, 'render');

    if (pos && render) {
      // Create a temporary EngineObject to render with LittleJS
      const position = new LJS.Vector2(pos.x, pos.y);
      const obj = new LJS.EngineObject(
        position,
        render.size,
        render.tileInfo,
        0,
        render.color
      );
      obj.render();
    }
  }
}
