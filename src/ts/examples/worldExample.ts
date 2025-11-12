/*
 * File: worldExample.ts
 * Project: littlejs-rl
 * File Created: Monday, 11th November 2025 11:00:00 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Monday, 11th November 2025 11:00:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

/**
 * Example usage of World, Location, and Tile system
 * This file demonstrates how to use the tile-based world system
 *
 * Note: This uses the ECS-first approach where entities are stored in ECS,
 * not in Location objects. See ecsWorldExample.ts for more advanced patterns.
 */

import { LocationComponent, PositionComponent } from '../components';
import { TileType, createTile } from '../tile';
import { createEnemy, createPlayer } from '../entities';

import ECS from '../ecs';
import World from '../world';

export function worldSystemExample() {
  // Create ECS instance
  const ecs = new ECS();

  // Create a world: 10x10 locations, each location is 50x50 tiles
  const world = new World(10, 10, 50, 50);

  // Start at world position (5, 5) - center of the world
  world.setCurrentLocation(5, 5);
  const startLocation = world.getCurrentLocation();

  if (startLocation) {
    // Create player at tile position (25, 25) in the location
    // Entity factories now require worldX and worldY parameters
    const playerId = createPlayer(ecs, 25, 25, 5, 5);

    // Create some enemies at different positions
    const enemy1Id = createEnemy(ecs, 10, 10, 5, 5);
    const enemy2Id = createEnemy(ecs, 40, 40, 5, 5);

    // Customize some tiles
    startLocation.setTile(20, 20, createTile(TileType.WATER));
    startLocation.setTile(30, 30, createTile(TileType.GRASS));

    // Check entity positions using ECS (entities are stored in ECS, not Location)
    const playerPos = ecs.getComponent<PositionComponent>(playerId, 'position');
    console.log('Player position:', playerPos);

    // Move player entity by updating position component
    if (playerPos && startLocation.isWalkable(26, 25)) {
      playerPos.x = 26;
      playerPos.y = 25;
      console.log('Player moved to:', playerPos);
    }
  }

  // Travel to adjacent location
  world.setCurrentLocation(5, 6);
  const newLocation = world.getCurrentLocation();
  console.log('Moved to location:', newLocation?.name);

  // Check loaded locations
  console.log('Loaded locations:', world.getLoadedLocationCount());

  // Unload locations to save memory (except current)
  world.unloadAllExceptCurrent();
  console.log('After cleanup:', world.getLoadedLocationCount());

  return { world, ecs };
}

export function customLocationExample() {
  const world = new World(5, 5, 30, 30);
  world.setCurrentLocation(0, 0);
  const location = world.getCurrentLocation();

  if (location) {
    // Create a custom room layout
    // Outer walls
    for (let x = 0; x < location.width; x++) {
      location.setTile(x, 0, createTile(TileType.WALL));
      location.setTile(x, location.height - 1, createTile(TileType.WALL));
    }
    for (let y = 0; y < location.height; y++) {
      location.setTile(0, y, createTile(TileType.WALL));
      location.setTile(location.width - 1, y, createTile(TileType.WALL));
    }

    // Floor
    for (let x = 1; x < location.width - 1; x++) {
      for (let y = 1; y < location.height - 1; y++) {
        location.setTile(x, y, createTile(TileType.FLOOR));
      }
    }

    // Add doors
    location.setTile(15, 0, createTile(TileType.DOOR_CLOSED));
    location.setTile(15, 29, createTile(TileType.DOOR_OPEN));

    // Add water feature
    for (let x = 10; x < 20; x++) {
      for (let y = 10; y < 15; y++) {
        location.setTile(x, y, createTile(TileType.WATER));
      }
    }

    // Add stairs
    location.setTile(5, 5, createTile(TileType.STAIRS_UP));
    location.setTile(25, 25, createTile(TileType.STAIRS_DOWN));
  }

  return world;
}
