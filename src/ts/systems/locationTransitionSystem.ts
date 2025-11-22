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
 * Detects when entities cross the edge of their current location and transitions
 * them to the adjacent location in the world grid. Handles both player and non-player
 * entities (enemies, NPCs, etc.).
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
 *   locationTransitionSystem(ecs); // Handle edge transitions for all entities
 *   aiSystem(ecs, playerId);
 * }
 * ```
 */
export function locationTransitionSystem(ecs: ECS): void {
  const game = Game.getInstance();
  const currentLocation = game.getCurrentLocation();
  if (!currentLocation) return;

  // Query all entities with position and location (player and non-player)
  const entities = ecs.query('position', 'location');

  for (const entityId of entities) {
    const pos = ecs.getComponent<PositionComponent>(entityId, 'position');
    const locationComp = ecs.getComponent<LocationComponent>(
      entityId,
      'location'
    );

    if (!pos || !locationComp) continue;

    // Only process entities in the current active location
    if (
      locationComp.worldX !== currentLocation.worldPosition.x ||
      locationComp.worldY !== currentLocation.worldPosition.y
    ) {
      continue;
    }

    // Get the location this entity is in
    const world = game.getWorld();
    const entityLocation = world.getLocation(
      locationComp.worldX,
      locationComp.worldY
    );
    if (!entityLocation) continue;

    // Check which edge (if any) the entity crossed
    const direction = detectEdgeCrossing(
      pos,
      entityLocation.width,
      entityLocation.height
    );

    if (direction !== TransitionDirection.NONE) {
      const isPlayer = ecs.hasComponent(entityId, 'player');
      handleTransition(ecs, entityId, direction, game, isPlayer);
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
 * @param entityId - Entity ID (player or non-player)
 * @param direction - Direction of transition
 * @param game - Game instance
 * @param isPlayer - Whether this entity is the player
 */
function handleTransition(
  ecs: ECS,
  entityId: number,
  direction: TransitionDirection,
  game: Game,
  isPlayer: boolean
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
    if (Game.isDebug) {
      console.warn(
        `Cannot transition entity ${entityId} to (${newWorldX}, ${newWorldY}) - out of world bounds`
      );
    }
    // Clamp position to current location edge
    const currentLocation = world.getLocation(
      locationComp.worldX,
      locationComp.worldY
    );
    if (currentLocation) {
      pos.x = Math.max(0, Math.min(pos.x, currentLocation.width - 1));
      pos.y = Math.max(0, Math.min(pos.y, currentLocation.height - 1));
    }
    return;
  }

  // If this is the player, change the game's active location
  if (isPlayer) {
    game.changeLocation(newWorldX, newWorldY);
  }

  // Get or create the new location
  const newLocation = world.getOrCreateLocation(newWorldX, newWorldY);

  // Calculate new position in new location (wrap to opposite edge)
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

  // Update camera only for player
  if (isPlayer) {
    LJS.setCameraPos(LJS.vec2(pos.x, pos.y));
  }

  if (Game.isDebug) {
    const entityType = isPlayer ? 'Player' : `Entity ${entityId}`;
    console.log(
      `[Transition] ${entityType} moved ${direction} to world (${newWorldX}, ${newWorldY}), local pos (${pos.x}, ${pos.y})`
    );
  }
}
