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
import { VisualEffectComponent } from '../components/visualEffect';

import ECS from '../ecs';
import Global from '../global';
import { BaseColor, getColor } from '../colorPalette';

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
      // Get visual effects if present
      const vfx = ecs.getComponent<VisualEffectComponent>(id, 'visualEffect');

      // Calculate base position (centered on tile)
      let position = LJS.vec2(pos.x + 0.5, pos.y + 0.5);

      // Apply visual effect offset
      if (vfx?.currentOffset) {
        position = position.add(vfx.currentOffset);
      }

      // Apply visual effect scale
      let size = render.size;
      if (vfx?.currentScale) {
        size = LJS.vec2(
          render.size.x * vfx.currentScale.x,
          render.size.y * vfx.currentScale.y
        );
      }

      // Apply visual effect rotation
      let angle = render.angle || 0;
      if (vfx?.currentRotation) {
        angle += vfx.currentRotation;
      }

      // Draw outline if specified (for enemies, special entities)
      if (render.outlineColor && render.outlineWidth) {
        const outlineWidth = render.outlineWidth;
        const outlineSize = size.add(
          LJS.vec2(outlineWidth * 2, outlineWidth * 2)
        );

        // Draw outline rectangle behind sprite
        //LJS.drawRect(position, outlineSize, render.outlineColor, angle);

        // Draw outline behind sprite
        LJS.drawTile(
          position,
          outlineSize,
          render.tileInfo,
          render.outlineColor,
          angle,
          render.mirror || false
        );
      }

      // Determine sprite color
      let spriteColor = render.color;

      // Apply flash effect (overrides damage flash)
      if (vfx?.flashColor) {
        // Blend flash color with sprite color
        const flashAlpha = vfx.flashColor.a;
        spriteColor = new LJS.Color(
          spriteColor.r * (1 - flashAlpha) + vfx.flashColor.r * flashAlpha,
          spriteColor.g * (1 - flashAlpha) + vfx.flashColor.g * flashAlpha,
          spriteColor.b * (1 - flashAlpha) + vfx.flashColor.b * flashAlpha,
          spriteColor.a
        );
      }
      // Legacy damage flash (kept for backward compatibility)
      else if (render.damageFlashTimer && render.damageFlashTimer > 0) {
        // Flash white when damaged
        spriteColor = getColor(BaseColor.WHITE);
        // Decrement timer (use engine time delta)
        render.damageFlashTimer -= LJS.timeDelta;
        if (render.damageFlashTimer < 0) render.damageFlashTimer = 0;
      }

      // Draw main sprite
      LJS.drawTile(
        position,
        size,
        render.tileInfo,
        spriteColor,
        angle,
        render.mirror || false
      );

      // Draw floating damage number if present
      if (render.floatingDamage && render.floatingDamage.timer > 0) {
        const dmg = render.floatingDamage;
        const damagePos = LJS.vec2(pos.x + 0.5, pos.y + 2 + dmg.offsetY);
        //const damageColor = new LJS.Color(1, 0.2, 0.2, dmg.timer / 0.5); // Fade out
        const damageColor = getColor(BaseColor.RED, dmg.timer / 0.5); // Fade out
        LJS.drawText(
          dmg.amount.toString(),
          damagePos,
          1, // Font size
          damageColor,
          0, // Outline size
          undefined, // Outline color
          'center' // Text align
        );

        // Update floating animation
        dmg.timer -= LJS.timeDelta / 2;
        dmg.offsetY += (2.0 * LJS.timeDelta) / 2; // Float upward

        if (dmg.timer <= 0) {
          render.floatingDamage = undefined; // Remove when done
        }
      }
    }
  }
}
