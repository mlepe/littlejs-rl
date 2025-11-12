/*
 * File: ecsWorldExample.ts
 * Project: littlejs-rl
 * File Created: Tuesday, 12th November 2025 12:50:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 12th November 2025 12:50:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

import ECS from '../ecs';
import World from '../world';
import { createPlayer, createEnemy, createNPC } from '../entities';
import {
  getEntitiesAt,
  getEntitiesInRadius,
  getEntitiesInLocation,
  isPositionOccupied,
  getNearestEntity,
} from '../systems/spatialSystem';
import { PositionComponent, LocationComponent } from '../components';

/**
 * ECS-First World Example
 * Demonstrates how to use ECS as the single source of truth for entities
 */
export function ecsWorldExample(): void {
  const ecs = new ECS();
  const world = new World(10, 10, 50, 50);

  // Set up starting location
  world.setCurrentLocation(5, 5);
  const location = world.getCurrentLocation();
  if (!location) return;

  // Create entities with LocationComponent
  const playerId = createPlayer(ecs, 25, 25, 5, 5);
  const enemy1Id = createEnemy(ecs, 30, 30, 5, 5);
  const enemy2Id = createEnemy(ecs, 20, 20, 5, 5);
  const npcId = createNPC(ecs, 15, 25, 5, 5);

  // --- SPATIAL QUERIES (ECS as source of truth) ---

  // Get all entities at a specific tile
  const entitiesAtPlayerPos = getEntitiesAt(ecs, 25, 25, 5, 5);
  console.log('Entities at player position:', entitiesAtPlayerPos);

  // Get entities in radius
  const nearbyEntities = getEntitiesInRadius(ecs, 25, 25, 10, 5, 5);
  console.log('Entities within 10 tiles:', nearbyEntities);

  // Get all entities in current location
  const locationEntities = getEntitiesInLocation(ecs, 5, 5);
  console.log('All entities in location:', locationEntities);

  // Check if position is occupied
  if (!isPositionOccupied(ecs, 26, 25, 5, 5)) {
    console.log('Position (26, 25) is free to move to');
  }

  // Find nearest entity to player
  const nearestEnemy = getNearestEntity(ecs, 25, 25, 20, 5, 5);
  if (nearestEnemy !== null) {
    console.log('Nearest entity:', nearestEnemy);
  }

  // --- MOVEMENT (Update ECS directly) ---

  // Move player to new position
  const playerPos = ecs.getComponent<PositionComponent>(playerId, 'position');
  if (playerPos && location.isWalkable(26, 25)) {
    playerPos.x = 26;
    playerPos.y = 25;
    // No need to update tiles - ECS is the source of truth
  }

  // --- LOCATION CHANGES ---

  // Move player to different location
  const playerLoc = ecs.getComponent<LocationComponent>(playerId, 'location');
  const playerPosition = ecs.getComponent<PositionComponent>(
    playerId,
    'position'
  );

  if (playerLoc && playerPosition) {
    // Change to new location
    playerLoc.worldX = 6;
    playerLoc.worldY = 5;

    // Reset position in new location
    playerPosition.x = 25;
    playerPosition.y = 25;

    // Update world
    world.setCurrentLocation(6, 5);
  }

  // --- RENDERING ---

  // In your render loop, only render entities in current location
  const currentLoc = world.getCurrentLocation();
  if (currentLoc) {
    // Render tiles
    currentLoc.render();

    // Get entities in current location
    const worldX = currentLoc.worldPosition.x;
    const worldY = currentLoc.worldPosition.y;
    const visibleEntities = getEntitiesInLocation(ecs, worldX, worldY);

    // Render each entity (your render system handles this)
    for (const entityId of visibleEntities) {
      const pos = ecs.getComponent<PositionComponent>(entityId, 'position');
      // Render entity at pos.x, pos.y
      console.log(`Render entity ${entityId} at (${pos?.x}, ${pos?.y})`);
    }
  }
}

/**
 * Spawning Enemies Example
 * Shows how to spawn enemies at random walkable positions
 */
export function spawnEnemiesExample(): void {
  const ecs = new ECS();
  const world = new World(10, 10, 50, 50);

  world.setCurrentLocation(5, 5);
  const location = world.getCurrentLocation();
  if (!location) return;

  // Spawn 5 enemies at random positions
  for (let i = 0; i < 5; i++) {
    const spawnPos = location.findRandomWalkablePosition();
    if (spawnPos) {
      const enemyId = createEnemy(
        ecs,
        spawnPos.x,
        spawnPos.y,
        location.worldPosition.x,
        location.worldPosition.y
      );
      console.log(`Spawned enemy ${enemyId} at (${spawnPos.x}, ${spawnPos.y})`);
    }
  }

  // Get all enemies in location
  const enemies = getEntitiesInLocation(
    ecs,
    location.worldPosition.x,
    location.worldPosition.y
  );
  console.log(`Total enemies spawned: ${enemies.length}`);
}

/**
 * Combat Detection Example
 * Shows how to find enemies in melee range
 */
export function combatDetectionExample(): void {
  const ecs = new ECS();
  const world = new World(10, 10, 50, 50);

  world.setCurrentLocation(5, 5);
  const location = world.getCurrentLocation();
  if (!location) return;

  const playerId = createPlayer(ecs, 25, 25, 5, 5);
  createEnemy(ecs, 26, 25, 5, 5); // Adjacent enemy
  createEnemy(ecs, 30, 30, 5, 5); // Far enemy

  const playerPos = ecs.getComponent<PositionComponent>(playerId, 'position');
  if (!playerPos) return;

  // Find enemies in melee range (1 tile)
  const meleeRange = 1.5; // Diagonal distance
  const nearbyEnemies = getEntitiesInRadius(
    ecs,
    playerPos.x,
    playerPos.y,
    meleeRange,
    location.worldPosition.x,
    location.worldPosition.y
  );

  // Exclude player from results
  const enemies = nearbyEnemies.filter((id) => id !== playerId);

  console.log(`Enemies in melee range: ${enemies.length}`);
}
