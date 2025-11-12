/*
 * File: locationComponent.ts
 * Project: littlejs-rl
 * File Created: Tuesday, 12th November 2025 12:35:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 12th November 2025 12:35:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

/**
 * LocationComponent - Tracks which world location an entity belongs to
 * This allows the ECS to know which entities to update/render per location
 */
export interface LocationComponent {
  worldX: number; // World grid X coordinate
  worldY: number; // World grid Y coordinate
}
