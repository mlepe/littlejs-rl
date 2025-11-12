/*
 * File: spatialSystem.ts
 * Project: littlejs-rl
 * File Created: Tuesday, 12th November 2025 12:40:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 12th November 2025 12:40:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

import { LocationComponent, PositionComponent } from '../components';

import ECS from '../ecs';

/**
 * Spatial System - Provides spatial queries using ECS as source of truth
 *
 * This module provides functions for querying entities based on their positions.
 * Use these functions instead of storing entities in tiles.
 * All queries use the ECS PositionComponent and LocationComponent.
 */

/**
 * Get all entities at a specific tile position
 *
 * @param ecs - The ECS instance
 * @param x - Tile X coordinate
 * @param y - Tile Y coordinate
 * @param worldX - Optional: filter by world location X
 * @param worldY - Optional: filter by world location Y
 * @returns Array of entity IDs at the position
 *
 * @example
 * ```typescript
 * const entities = getEntitiesAt(ecs, 10, 15);
 * const entitiesInLocation = getEntitiesAt(ecs, 10, 15, 5, 5);
 * ```
 */
export function getEntitiesAt(
  ecs: ECS,
  x: number,
  y: number,
  worldX?: number,
  worldY?: number
): number[] {
  const entities = ecs.query('position');
  const results: number[] = [];

  for (const id of entities) {
    const pos = ecs.getComponent<PositionComponent>(id, 'position');
    if (!pos) continue;

    // Check if position matches
    const tileX = Math.floor(pos.x);
    const tileY = Math.floor(pos.y);

    if (tileX === x && tileY === y) {
      // If location filtering requested, check location component
      if (worldX !== undefined && worldY !== undefined) {
        const loc = ecs.getComponent<LocationComponent>(id, 'location');
        if (loc?.worldX !== worldX || loc?.worldY !== worldY) {
          continue;
        }
      }
      results.push(id);
    }
  }

  return results;
}

/**
 * Get all entities within a radius of a position
 *
 * @param ecs - The ECS instance
 * @param centerX - Center X coordinate
 * @param centerY - Center Y coordinate
 * @param radius - Search radius in tiles
 * @param worldX - Optional: filter by world location X
 * @param worldY - Optional: filter by world location Y
 * @returns Array of entity IDs within the radius
 *
 * @example
 * ```typescript
 * // Get all entities within 5 tiles of position (20, 20)
 * const nearby = getEntitiesInRadius(ecs, 20, 20, 5);
 * ```
 */
export function getEntitiesInRadius(
  ecs: ECS,
  centerX: number,
  centerY: number,
  radius: number,
  worldX?: number,
  worldY?: number
): number[] {
  const entities = ecs.query('position');
  const results: number[] = [];
  const radiusSquared = radius * radius;

  for (const id of entities) {
    const pos = ecs.getComponent<PositionComponent>(id, 'position');
    if (!pos) continue;

    // Check location filtering
    if (worldX !== undefined && worldY !== undefined) {
      const loc = ecs.getComponent<LocationComponent>(id, 'location');
      if (loc?.worldX !== worldX || loc?.worldY !== worldY) {
        continue;
      }
    }

    // Check distance
    const dx = pos.x - centerX;
    const dy = pos.y - centerY;
    const distSquared = dx * dx + dy * dy;

    if (distSquared <= radiusSquared) {
      results.push(id);
    }
  }

  return results;
}

/**
 * Get all entities in a specific world location
 *
 * @param ecs - The ECS instance
 * @param worldX - World location X coordinate
 * @param worldY - World location Y coordinate
 * @returns Array of entity IDs in that location
 *
 * @example
 * ```typescript
 * const entities = getEntitiesInLocation(ecs, 5, 5);
 * ```
 */
export function getEntitiesInLocation(
  ecs: ECS,
  worldX: number,
  worldY: number
): number[] {
  const entities = ecs.query('position', 'location');
  const results: number[] = [];

  for (const id of entities) {
    const loc = ecs.getComponent<LocationComponent>(id, 'location');
    if (loc?.worldX === worldX && loc?.worldY === worldY) {
      results.push(id);
    }
  }

  return results;
}

/**
 * Check if a position is occupied by any entity
 *
 * @param ecs - The ECS instance
 * @param x - Tile X coordinate
 * @param y - Tile Y coordinate
 * @param worldX - Optional: filter by world location X
 * @param worldY - Optional: filter by world location Y
 * @returns True if at least one entity occupies the position
 *
 * @example
 * ```typescript
 * if (!isPositionOccupied(ecs, 10, 10)) {
 *   // Spawn entity at empty position
 * }
 * ```
 */
export function isPositionOccupied(
  ecs: ECS,
  x: number,
  y: number,
  worldX?: number,
  worldY?: number
): boolean {
  return getEntitiesAt(ecs, x, y, worldX, worldY).length > 0;
}

/**
 * Get the nearest entity to a position
 *
 * @param ecs - The ECS instance
 * @param centerX - Center X coordinate
 * @param centerY - Center Y coordinate
 * @param maxDistance - Optional: maximum search distance
 * @param worldX - Optional: filter by world location X
 * @param worldY - Optional: filter by world location Y
 * @returns Entity ID of nearest entity, or null if none found
 *
 * @example
 * ```typescript
 * const nearest = getNearestEntity(ecs, playerX, playerY, 10);
 * if (nearest) {
 *   // Target the nearest enemy
 * }
 * ```
 */
export function getNearestEntity(
  ecs: ECS,
  centerX: number,
  centerY: number,
  maxDistance?: number,
  worldX?: number,
  worldY?: number
): number | null {
  const entities = ecs.query('position');
  let nearestId: number | null = null;
  let nearestDistSquared = maxDistance
    ? maxDistance * maxDistance
    : Number.MAX_VALUE;

  for (const id of entities) {
    const pos = ecs.getComponent<PositionComponent>(id, 'position');
    if (!pos) continue;

    // Check location filtering
    if (worldX !== undefined && worldY !== undefined) {
      const loc = ecs.getComponent<LocationComponent>(id, 'location');
      if (loc?.worldX !== worldX || loc?.worldY !== worldY) {
        continue;
      }
    }

    // Calculate distance
    const dx = pos.x - centerX;
    const dy = pos.y - centerY;
    const distSquared = dx * dx + dy * dy;

    if (distSquared < nearestDistSquared) {
      nearestDistSquared = distSquared;
      nearestId = id;
    }
  }

  return nearestId;
}

/**
 * Check line of sight between two positions
 *
 * Uses simple raycasting to check if there are opaque tiles blocking the view.
 *
 * @param ecs - The ECS instance (unused, for consistency)
 * @param from - Starting position
 * @param to - Target position
 * @param checkTileTransparency - Function to check if a tile is transparent
 * @returns True if there is a clear line of sight
 *
 * @example
 * ```typescript
 * const canSee = hasLineOfSight(
 *   ecs,
 *   vec2(playerX, playerY),
 *   vec2(enemyX, enemyY),
 *   (x, y) => location.getTile(x, y)?.transparent ?? false
 * );
 * ```
 */
export function hasLineOfSight(
  ecs: ECS,
  from: LJS.Vector2,
  to: LJS.Vector2,
  checkTileTransparency: (x: number, y: number) => boolean
): boolean {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.hypot(dx, dy);
  const steps = Math.ceil(distance);

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = Math.floor(from.x + dx * t);
    const y = Math.floor(from.y + dy * t);

    if (!checkTileTransparency(x, y)) {
      return false;
    }
  }

  return true;
}
