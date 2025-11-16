/*
 * File: viewModeTransitionSystem.ts
 * Project: littlejs-rl
 * File Created: Saturday, 16th November 2025 1:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Saturday, 16th November 2025 1:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

import {
  InputComponent,
  LocationComponent,
  PositionComponent,
  ViewModeComponent,
} from '../components';

import ECS from '../ecs';
import Game from '../game';
import { ViewMode } from '../components/viewMode';

/**
 * View Mode Transition System - Handles switching between location and world map views
 *
 * Processes input to transition between:
 * - LOCATION view (exploring a specific location)
 * - WORLD_MAP view (viewing the world grid)
 *
 * Should be called after input system in the update loop.
 *
 * @param ecs - The ECS instance
 *
 * @example
 * ```typescript
 * function gameUpdate() {
 *   inputSystem(ecs);
 *   viewModeTransitionSystem(ecs); // Handle view switching
 *
 *   // Then route to appropriate movement system
 * }
 * ```
 */
export function viewModeTransitionSystem(ecs: ECS): void {
  const entities = ecs.query('viewMode', 'input', 'location', 'position');

  for (const entityId of entities) {
    const viewMode = ecs.getComponent<ViewModeComponent>(entityId, 'viewMode');
    const input = ecs.getComponent<InputComponent>(entityId, 'input');
    const locationComp = ecs.getComponent<LocationComponent>(
      entityId,
      'location'
    );
    const pos = ecs.getComponent<PositionComponent>(entityId, 'position');

    if (!viewMode || !input || !locationComp || !pos) continue;

    const game = Game.getInstance();
    const worldMap = game.getWorldMap();

    // Transition from LOCATION to WORLD_MAP
    if (viewMode.mode === ViewMode.LOCATION && input.locationEnterWorldMap) {
      viewMode.mode = ViewMode.WORLD_MAP;

      // Set cursor to current world position
      viewMode.worldMapCursorX = locationComp.worldX;
      viewMode.worldMapCursorY = locationComp.worldY;

      // Discover surrounding tiles
      worldMap.discoverRadius(locationComp.worldX, locationComp.worldY, 2);

      // Update camera for world map view
      LJS.setCameraPos(
        LJS.vec2(
          -worldMap.getWorld().width + locationComp.worldX * 2 + 1,
          -worldMap.getWorld().height + locationComp.worldY * 2 + 1
        )
      );

      if (Game.isDebug) {
        console.log(
          `[ViewMode] Entered WORLD_MAP at (${locationComp.worldX}, ${locationComp.worldY})`
        );
      }
    }

    // Transition from WORLD_MAP to LOCATION
    else if (
      viewMode.mode === ViewMode.WORLD_MAP &&
      input.worldMapEnterLocation
    ) {
      const targetX = viewMode.worldMapCursorX;
      const targetY = viewMode.worldMapCursorY;

      // Check if tile is discovered
      const tile = worldMap.getTile(targetX, targetY);
      if (!tile?.discovered) {
        if (Game.isDebug) {
          console.warn(
            `[ViewMode] Cannot enter undiscovered location (${targetX}, ${targetY})`
          );
        }
        continue;
      }

      // Mark tile as visited
      worldMap.visitTile(targetX, targetY);

      // Change to the selected location
      game.changeLocation(targetX, targetY);

      // Update location component
      locationComp.worldX = targetX;
      locationComp.worldY = targetY;

      // Find spawn position in new location
      const location = game.getCurrentLocation();
      if (location) {
        // Spawn at center of location
        let spawnX = Math.floor(location.width / 2);
        let spawnY = Math.floor(location.height / 2);

        // Search for walkable tile
        let found = location.isWalkable(spawnX, spawnY);
        if (!found) {
          for (let radius = 1; radius < 20 && !found; radius++) {
            for (let dx = -radius; dx <= radius && !found; dx++) {
              for (let dy = -radius; dy <= radius && !found; dy++) {
                if (Math.abs(dx) === radius || Math.abs(dy) === radius) {
                  const testX = spawnX + dx;
                  const testY = spawnY + dy;
                  if (location.isWalkable(testX, testY)) {
                    spawnX = testX;
                    spawnY = testY;
                    found = true;
                  }
                }
              }
            }
          }
        }

        // Update position
        pos.x = spawnX;
        pos.y = spawnY;

        // Update camera for location view
        LJS.setCameraPos(LJS.vec2(spawnX, spawnY));
      }

      // Switch to location view
      viewMode.mode = ViewMode.LOCATION;

      if (Game.isDebug) {
        console.log(
          `[ViewMode] Entered LOCATION at world (${targetX}, ${targetY}), local pos (${pos.x}, ${pos.y})`
        );
      }
    }
  }
}
