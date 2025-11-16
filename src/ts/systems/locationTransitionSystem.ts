/*
 * File: locationTransitionSystem.ts
 * Project: littlejs-rl
 * File Created: Saturday, 16th November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Saturday, 16th November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

import {
  LocationComponent,
  PlayerComponent,
  PositionComponent,
} from '../components';

import ECS from '../ecs';
import Game from '../game';

/**
 * Transition direction when crossing location edges
 */
export enum TransitionDirection {
  NORTH = 'north',
  SOUTH = 'south',
  EAST = 'east',
  WEST = 'west',
  NONE = 'none',
}

/**
 * Location Transition System - Handles moving between adjacent world locations
 *
 * Detects when player crosses the edge of the current location and transitions
 * to the adjacent location in the world grid.
 *
 * Should be called after movement systems in the update loop.
 *
 * @param ecs - The ECS instance
 *
 * @example
 * ```typescript
 * function gameUpdate() {
 *   inputSystem(ecs);
 *   playerMovementSystem(ecs);
 *   locationTransitionSystem(ecs); // Handle edge transitions
 *   aiSystem(ecs, playerId);
 * }
 * ```
 */
export function locationTransitionSystem(ecs: ECS): void {
  const game = Game.getInstance();
  const location = game.getCurrentLocation();
  if (!location) return;

  // Query all player entities
  const playerEntities = ecs.query('player', 'position', 'location');

  for (const entityId of playerEntities) {
    const pos = ecs.getComponent<PositionComponent>(entityId, 'position');
    const locationComp = ecs.getComponent<LocationComponent>(
      entityId,
      'location'
    );

    if (!pos || !locationComp) continue;

    // Check which edge (if any) the player crossed
    const direction = detectEdgeCrossing(pos, location.width, location.height);

    if (direction !== TransitionDirection.NONE) {
      handleTransition(ecs, entityId, direction, game);
    }
  }
}

/**
 * Detect if position is at or beyond a location edge
 * @param pos - Position component
 * @param width - Location width in tiles
 * @param height - Location height in tiles
 * @returns Direction of edge crossing
 */
function detectEdgeCrossing(
  pos: PositionComponent,
  width: number,
  height: number
): TransitionDirection {
  // Check boundaries (0-based indexing, so max is width-1, height-1)
  if (pos.x < 0) return TransitionDirection.WEST;
  if (pos.x >= width) return TransitionDirection.EAST;
  if (pos.y < 0) return TransitionDirection.NORTH;
  if (pos.y >= height) return TransitionDirection.SOUTH;

  return TransitionDirection.NONE;
}

/**
 * Handle transition to adjacent location
 * @param ecs - ECS instance
 * @param entityId - Player entity ID
 * @param direction - Direction of transition
 * @param game - Game instance
 */
function handleTransition(
  ecs: ECS,
  entityId: number,
  direction: TransitionDirection,
  game: Game
): void {
  const pos = ecs.getComponent<PositionComponent>(entityId, 'position');
  const locationComp = ecs.getComponent<LocationComponent>(
    entityId,
    'location'
  );

  if (!pos || !locationComp) return;

  // Calculate new world position
  let newWorldX = locationComp.worldX;
  let newWorldY = locationComp.worldY;

  switch (direction) {
    case TransitionDirection.NORTH:
      newWorldY -= 1;
      break;
    case TransitionDirection.SOUTH:
      newWorldY += 1;
      break;
    case TransitionDirection.WEST:
      newWorldX -= 1;
      break;
    case TransitionDirection.EAST:
      newWorldX += 1;
      break;
  }

  // Check if new world position is valid
  const world = game.getWorld();
  if (!world.isInBounds(newWorldX, newWorldY)) {
    console.warn(
      `Cannot transition to (${newWorldX}, ${newWorldY}) - out of world bounds`
    );
    // Clamp position to current location edge
    const currentLocation = game.getCurrentLocation();
    if (currentLocation) {
      pos.x = Math.max(0, Math.min(pos.x, currentLocation.width - 1));
      pos.y = Math.max(0, Math.min(pos.y, currentLocation.height - 1));
    }
    return;
  }

  // Transition to new location
  game.changeLocation(newWorldX, newWorldY);

  // Calculate new position in new location (wrap to opposite edge)
  const newLocation = game.getCurrentLocation();
  if (!newLocation) {
    console.error('Failed to load new location after transition');
    return;
  }

  switch (direction) {
    case TransitionDirection.NORTH:
      pos.y = newLocation.height - 1; // Bottom edge of new location
      break;
    case TransitionDirection.SOUTH:
      pos.y = 0; // Top edge of new location
      break;
    case TransitionDirection.WEST:
      pos.x = newLocation.width - 1; // Right edge of new location
      break;
    case TransitionDirection.EAST:
      pos.x = 0; // Left edge of new location
      break;
  }

  // Update location component
  locationComp.worldX = newWorldX;
  locationComp.worldY = newWorldY;

  // Update camera to follow player
  LJS.setCameraPos(LJS.vec2(pos.x, pos.y));

  if (Game.isDebug) {
    console.log(
      `[Transition] Player moved ${direction} to world (${newWorldX}, ${newWorldY}), local pos (${pos.x}, ${pos.y})`
    );
  }
}
