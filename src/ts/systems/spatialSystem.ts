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
 * Use these functions instead of storing entities in tiles
 */

// Get all entities at a specific tile position in current location
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

// Get all entities within radius of a position
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

// Get all entities in a specific location
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

// Check if position is occupied by any entity
export function isPositionOccupied(
  ecs: ECS,
  x: number,
  y: number,
  worldX?: number,
  worldY?: number
): boolean {
  return getEntitiesAt(ecs, x, y, worldX, worldY).length > 0;
}

// Get nearest entity to a position (within optional max distance)
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

// Check line of sight between two positions (simple raycasting)
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
