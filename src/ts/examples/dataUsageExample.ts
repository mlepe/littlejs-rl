/*
 * File: dataUsageExample.ts
 * Project: littlejs-rl
 * File Created: 2025-11-14 16:00:00
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: 2025-11-14 16:00:00
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

/**
 * Example: Using the Data Loading System
 *
 * ⚠️ WARNING: This example file is currently outdated!
 * The Location class API has changed and addEntity() method no longer exists.
 * These examples are kept for reference but will cause compilation errors.
 * TODO: Update examples to use new Location API
 *
 * This file demonstrates how to use the EntityRegistry and DataLoader
 * to spawn entities from data files in your game.
 */

import { DataLoader } from '../data/dataLoader';
import ECS from '../ecs';
import { EntityRegistry } from '../data/entityRegistry';
import Location from '../location';

/**
 * Example 1: Basic entity spawning
 */
export function exampleBasicSpawning(ecs: ECS, location: Location): void {
  const registry = EntityRegistry.getInstance();

  // Spawn an orc at position (10, 10) in the current location
  const orcId = registry.spawn(ecs, 'orc_warrior', 10, 10, 0, 0);

  if (orcId !== null) {
    console.log(`Spawned orc with entity ID: ${orcId}`);

    // Add to location tracking
    location.addEntity(10, 10, orcId);
  }
}

/**
 * Example 2: Spawning multiple enemies
 */
export function exampleSpawnEnemyGroup(
  ecs: ECS,
  location: Location,
  centerX: number,
  centerY: number,
  worldX: number,
  worldY: number
): void {
  const registry = EntityRegistry.getInstance();

  // Spawn a group of enemies around a center point
  const enemyTypes = ['orc_warrior', 'goblin_scout', 'goblin_scout'];

  for (let i = 0; i < enemyTypes.length; i++) {
    const angle = (i / enemyTypes.length) * Math.PI * 2;
    const radius = 3;
    const x = Math.floor(centerX + Math.cos(angle) * radius);
    const y = Math.floor(centerY + Math.sin(angle) * radius);

    const entityId = registry.spawn(ecs, enemyTypes[i], x, y, worldX, worldY);

    if (entityId !== null && location.isWalkable(x, y)) {
      location.addEntity(x, y, entityId);
    }
  }
}

/**
 * Example 3: Random enemy spawning
 */
export function exampleRandomSpawning(
  ecs: ECS,
  location: Location,
  worldX: number,
  worldY: number,
  count: number
): void {
  const registry = EntityRegistry.getInstance();

  // Get all creature templates
  const creatures = registry.getByType('creature');

  if (creatures.length === 0) {
    console.warn('No creature templates loaded');
    return;
  }

  let spawned = 0;
  let attempts = 0;
  const maxAttempts = count * 10; // Prevent infinite loop

  while (spawned < count && attempts < maxAttempts) {
    attempts++;

    // Random position
    const x = Math.floor(Math.random() * location.width);
    const y = Math.floor(Math.random() * location.height);

    // Check if position is walkable
    if (!location.isWalkable(x, y)) {
      continue;
    }

    // Random creature type
    const template = creatures[Math.floor(Math.random() * creatures.length)];

    // Spawn
    const entityId = registry.spawn(ecs, template.id, x, y, worldX, worldY);

    if (entityId !== null) {
      location.addEntity(x, y, entityId);
      spawned++;
    }
  }

  console.log(`Spawned ${spawned} random enemies`);
}

/**
 * Example 4: Checking available templates
 */
export function exampleCheckTemplates(): void {
  const registry = EntityRegistry.getInstance();

  // List all available entities
  console.log('Available entity templates:');
  for (const id of registry.getAllIds()) {
    const template = registry.get(id);
    if (template) {
      console.log(`- ${id}: ${template.name} (${template.type})`);
    }
  }

  // Get specific types
  const creatures = registry.getByType('creature');
  const characters = registry.getByType('character');

  console.log(
    `\nLoaded ${creatures.length} creatures and ${characters.length} characters`
  );
}

/**
 * Example 5: Conditional spawning based on template data
 */
export function exampleConditionalSpawning(
  ecs: ECS,
  location: Location,
  x: number,
  y: number,
  worldX: number,
  worldY: number,
  difficulty: 'easy' | 'medium' | 'hard'
): void {
  const registry = EntityRegistry.getInstance();

  // Get creatures sorted by health (difficulty)
  const creatures = registry
    .getByType('creature')
    .filter((e) => e.health !== undefined)
    .sort((a, b) => (a.health?.max || 0) - (b.health?.max || 0));

  if (creatures.length === 0) return;

  // Select creature based on difficulty
  let selectedCreature;
  if (difficulty === 'easy') {
    selectedCreature = creatures[0]; // Weakest
  } else if (difficulty === 'hard') {
    selectedCreature = creatures[creatures.length - 1]; // Strongest
  } else {
    selectedCreature = creatures[Math.floor(creatures.length / 2)]; // Middle
  }

  // Spawn the selected enemy
  const entityId = registry.spawn(
    ecs,
    selectedCreature.id,
    x,
    y,
    worldX,
    worldY
  );

  if (entityId !== null) {
    location.addEntity(x, y, entityId);
    console.log(`Spawned ${selectedCreature.name} (difficulty: ${difficulty})`);
  }
}

/**
 * Example 6: Integration with DataLoader
 */
export async function exampleDataLoaderIntegration(): Promise<void> {
  const dataLoader = DataLoader.getInstance();

  // Check if data is loaded
  if (!dataLoader.isLoaded()) {
    console.log('Data not loaded, loading now...');
    await dataLoader.loadAllData();
  }

  // Now we can use the registry
  const registry = EntityRegistry.getInstance();
  console.log(`Loaded ${registry.getAllIds().length} entity templates`);

  // Development: Reload data (useful for testing)
  if (process.env.NODE_ENV === 'development') {
    // await dataLoader.reload();
  }
}

/**
 * Example 7: Spawning NPCs in a village
 */
export function exampleSpawnVillage(
  ecs: ECS,
  location: Location,
  centerX: number,
  centerY: number,
  worldX: number,
  worldY: number
): void {
  const registry = EntityRegistry.getInstance();

  // Get all character templates
  const characters = registry.getByType('character');

  // Spawn one of each character type around the village center
  characters.forEach((template, index) => {
    const angle = (index / characters.length) * Math.PI * 2;
    const radius = 5;
    const x = Math.floor(centerX + Math.cos(angle) * radius);
    const y = Math.floor(centerY + Math.sin(angle) * radius);

    if (location.isWalkable(x, y)) {
      const entityId = registry.spawn(ecs, template.id, x, y, worldX, worldY);

      if (entityId !== null) {
        location.addEntity(x, y, entityId);
        console.log(`Placed ${template.name} at village`);
      }
    }
  });
}
