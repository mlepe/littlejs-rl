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
 * Location Component - Tracks which world location an entity belongs to
 *
 * This allows the ECS to know which entities to update/render per location.
 * Critical for spatial queries and location-based entity management.
 *
 * @example
 * ```typescript
 * // Add location component to entity
 * ecs.addComponent<LocationComponent>(entityId, 'location', { worldX: 5, worldY: 5 });
 *
 * // Query entities in a specific location
 * const entities = getEntitiesInLocation(ecs, 5, 5);
 * ```
 */
export interface LocationComponent {
  /** World grid X coordinate */
  worldX: number;
  /** World grid Y coordinate */
  worldY: number;
}
