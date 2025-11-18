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
import Global from '../global';

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
      // Add 0.5 offset to center sprite on tile (tiles are bottom-left anchored)
      // Note: Entities are drawn in gameRender(), after tile layers (renderOrder 0, 1)
      // so they automatically appear above tiles
      const position = LJS.vec2(pos.x + 0.5, pos.y + 0.5);

      // Draw outline if specified (for enemies, special entities)
      if (render.outlineColor && render.outlineWidth) {
        const outlineWidth = render.outlineWidth;
        const outlineSize = render.size.add(
          LJS.vec2(outlineWidth * 2, outlineWidth * 2)
        );

        // Draw outline rectangle behind sprite
        LJS.drawRect(
          position,
          outlineSize,
          render.outlineColor,
          render.angle || 0
        );
      }

      // Determine sprite color (white flash on damage, normal otherwise)
      let spriteColor = render.color;
      if (render.damageFlashTimer && render.damageFlashTimer > 0) {
        // Flash white when damaged
        spriteColor = new LJS.Color(1, 1, 1, 1);
        // Decrement timer (use engine time delta)
        render.damageFlashTimer -= LJS.timeDelta;
        if (render.damageFlashTimer < 0) render.damageFlashTimer = 0;
      }

      // Draw main sprite on top
      LJS.drawTile(
        position,
        render.size,
        render.tileInfo,
        spriteColor,
        render.angle || 0,
        render.mirror || false
      );

      // Draw floating damage number if present
      if (render.floatingDamage && render.floatingDamage.timer > 0) {
        const dmg = render.floatingDamage;
        const damagePos = LJS.vec2(pos.x + 0.5, pos.y + 0.5 + dmg.offsetY);
        const damageColor = new LJS.Color(1, 0.2, 0.2, dmg.timer / 0.5); // Fade out

        LJS.drawText(
          dmg.amount.toString(),
          damagePos,
          0.5, // Font size
          damageColor,
          0, // Outline size
          undefined, // Outline color
          'center' // Text align
        );

        // Update floating animation
        dmg.timer -= LJS.timeDelta;
        dmg.offsetY += 2.0 * LJS.timeDelta; // Float upward

        if (dmg.timer <= 0) {
          render.floatingDamage = undefined; // Remove when done
        }
      }
    }
  }
}
