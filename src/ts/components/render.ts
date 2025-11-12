/*
 * File: render.ts
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

/**
 * Render Component - Contains visual rendering data for entities
 *
 * Used by the renderSystem to draw entities using LittleJS.
 */
export interface RenderComponent {
  /** Sprite tile information from tileset */
  tileInfo: LJS.TileInfo;
  /** Entity color/tint */
  color: LJS.Color;
  /** Entity size in tiles */
  size: LJS.Vector2;
}
