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
 * View Mode Transition System - Handles switching between views
 *
 * Processes input to transition between:
 * - LOCATION view (exploring a specific location)
 * - WORLD_MAP view (viewing the world grid)
 * - EXAMINE view (cursor-based tile/entity inspection)
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

    if (!viewMode || !input || !locationComp || !pos) {
      console.log('[ViewMode] Missing component:', {
        hasViewMode: !!viewMode,
        hasInput: !!input,
        hasLocation: !!locationComp,
        hasPosition: !!pos,
      });
      continue;
    }

    const game = Game.getInstance();
    const worldMap = game.getWorldMap();

    // Debug: Log current state
    if (
      input.locationEnterWorldMap ||
      input.worldMapEnterLocation ||
      input.toggleExamine ||
      LJS.keyWasPressed('KeyI')
    ) {
      console.log('[ViewMode] Transition request:', {
        currentMode: viewMode.mode,
        locationEnterWorldMap: input.locationEnterWorldMap,
        worldMapEnterLocation: input.worldMapEnterLocation,
        toggleExamine: input.toggleExamine,
        toggleInventory: LJS.keyWasPressed('KeyI'),
      });
    }

    // Toggle INVENTORY mode (from LOCATION or back to LOCATION)
    if (LJS.keyWasPressed('KeyI')) {
      if (viewMode.mode === ViewMode.LOCATION) {
        console.log('[ViewMode] TRANSITIONING: LOCATION -> INVENTORY');
        viewMode.mode = ViewMode.INVENTORY;

        if (Game.isDebug) {
          console.log('[ViewMode] Entered INVENTORY mode');
        }
      } else if (viewMode.mode === ViewMode.INVENTORY) {
        console.log('[ViewMode] TRANSITIONING: INVENTORY -> LOCATION');
        viewMode.mode = ViewMode.LOCATION;

        if (Game.isDebug) {
          console.log('[ViewMode] Exited INVENTORY mode');
        }
      }
      // If in world map or examine, ignore inventory toggle
    }

    // Toggle EXAMINE mode (only from LOCATION view)
    if (input.toggleExamine) {
      if (viewMode.mode === ViewMode.LOCATION) {
        console.log('[ViewMode] TRANSITIONING: LOCATION -> EXAMINE');
        viewMode.mode = ViewMode.EXAMINE;

        // Initialize examine cursor at player position
        viewMode.examineCursorX = Math.floor(pos.x);
        viewMode.examineCursorY = Math.floor(pos.y);

        if (Game.isDebug) {
          console.log(
            `[ViewMode] Entered EXAMINE at (${viewMode.examineCursorX}, ${viewMode.examineCursorY})`
          );
        }
      } else if (viewMode.mode === ViewMode.EXAMINE) {
        console.log('[ViewMode] TRANSITIONING: EXAMINE -> LOCATION');
        viewMode.mode = ViewMode.LOCATION;

        if (Game.isDebug) {
          console.log('[ViewMode] Exited EXAMINE mode');
        }
      }
      // If in world map, ignore examine toggle
    }

    // Transition from LOCATION to WORLD_MAP
    if (viewMode.mode === ViewMode.LOCATION && input.locationEnterWorldMap) {
      console.log('[ViewMode] TRANSITIONING: LOCATION -> WORLD_MAP');
      viewMode.mode = ViewMode.WORLD_MAP;

      // Set player position to world coordinates
      pos.x = locationComp.worldX;
      pos.y = locationComp.worldY;

      // Update cursor tracking
      viewMode.worldMapCursorX = locationComp.worldX;
      viewMode.worldMapCursorY = locationComp.worldY;

      // CRITICAL: Destroy location layers first
      const location = game.getCurrentLocation();
      if (location) {
        location.getTileLayer().destroy();
        location.getCollisionLayer().destroy();
      }

      // Recreate world map layer (it may have been destroyed on previous transition)
      worldMap.recreateTileLayer();

      // NOW discover entire world map for visibility (after layer is created)
      const world = worldMap.getWorld();
      for (let y = 0; y < world.height; y++) {
        for (let x = 0; x < world.width; x++) {
          worldMap.discoverTile(x, y);
        }
      }

      // Mark current location as visited
      worldMap.visitTile(locationComp.worldX, locationComp.worldY);

      // Set camera to show entire world map
      const worldSize = worldMap.getWorld();
      const centerX = worldSize.width / 2;
      const centerY = worldSize.height / 2;
      LJS.setCameraPos(LJS.vec2(centerX, centerY));

      // Zoom out to show full map (scale based on world size)
      const maxDimension = Math.max(worldSize.width, worldSize.height);
      //const zoomScale = Math.max(0.5, 20 / maxDimension); // Min zoom 0.5, adjust for screen
      const zoomScale = 25;
      LJS.setCameraScale(zoomScale);

      if (Game.isDebug) {
        console.log(
          `[ViewMode] Entered WORLD_MAP at (${locationComp.worldX}, ${locationComp.worldY}), camera scale: ${zoomScale}`
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

        // CRITICAL: Destroy world map layer and recreate location layers
        worldMap.getTileLayer().destroy();

        // Recreate location layers (they were destroyed when entering world map)
        location.recreateLayers();

        // Update camera for location view
        LJS.setCameraPos(LJS.vec2(spawnX, spawnY));

        // Reset camera zoom for location view
        LJS.setCameraScale(1.0);
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
