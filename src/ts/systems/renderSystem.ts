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

/**
 * Render System - Renders all entities with visual components
 *
 * Processes all entities with 'position' and 'render' components.
 * Uses LittleJS drawTile to render each entity.
 *
 * Note: TileLayer and TileCollisionLayer are automatically rendered by LittleJS.
 * Manual tile rendering is not needed - tiles redraw when modified.
 *
 * Should be called in the gameRender() callback.
 *
 * @param ecs - The ECS instance
 *
 * @example
 * ```typescript
 * function gameRender() {
 *   renderSystem(ecs); // Render all entities (tiles auto-render)
 * }
 * ```
 */
export function renderSystem(ecs: ECS): void {
  const entities = ecs.query('position', 'render');

  for (const id of entities) {
    const pos = ecs.getComponent<PositionComponent>(id, 'position');
    const render = ecs.getComponent<RenderComponent>(id, 'render');

    if (pos && render) {
      // Use LittleJS drawTile instead of EngineObject to avoid trails
      const position = LJS.vec2(pos.x, pos.y);
      LJS.drawTile(
        position,
        render.size,
        render.tileInfo,
        render.color,
        render.angle || 0,
        render.mirror || false
      );
    }
  }
}
