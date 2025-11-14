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

  // Get all enemy templates
  const enemies = registry.getByType('enemy');

  if (enemies.length === 0) {
    console.warn('No enemy templates loaded');
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

    // Random enemy type
    const template = enemies[Math.floor(Math.random() * enemies.length)];

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
  const enemies = registry.getByType('enemy');
  const npcs = registry.getByType('npc');

  console.log(`\nLoaded ${enemies.length} enemies and ${npcs.length} NPCs`);
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

  // Get enemies sorted by health (difficulty)
  const enemies = registry
    .getByType('enemy')
    .filter((e) => e.health !== undefined)
    .sort((a, b) => (a.health?.max || 0) - (b.health?.max || 0));

  if (enemies.length === 0) return;

  // Select enemy based on difficulty
  let selectedEnemy;
  if (difficulty === 'easy') {
    selectedEnemy = enemies[0]; // Weakest
  } else if (difficulty === 'hard') {
    selectedEnemy = enemies[enemies.length - 1]; // Strongest
  } else {
    selectedEnemy = enemies[Math.floor(enemies.length / 2)]; // Middle
  }

  // Spawn the selected enemy
  const entityId = registry.spawn(ecs, selectedEnemy.id, x, y, worldX, worldY);

  if (entityId !== null) {
    location.addEntity(x, y, entityId);
    console.log(`Spawned ${selectedEnemy.name} (difficulty: ${difficulty})`);
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

  // Get all NPC templates
  const npcs = registry.getByType('npc');

  // Spawn one of each NPC type around the village center
  npcs.forEach((template, index) => {
    const angle = (index / npcs.length) * Math.PI * 2;
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
