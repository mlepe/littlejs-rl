/*
 * File: lootSystem.ts
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

import { LootEntry, LootTableComponent } from '../components/lootTable';
import {
  applyRandomBlessState,
  applyRandomQuality,
  generateItem,
  generateQuantity,
} from './itemGenerationSystem';

import ECS from '../ecs';
import { LocationComponent } from '../components/locationComponent';
import { PositionComponent } from '../components/position';

/**
 * Generate loot drops from an entity's loot table
 *
 * Rolls for each loot entry independently:
 * - Checks drop chance
 * - Generates random quantity
 * - Applies quality/blessing randomization
 * - Creates item entities at entity's position
 *
 * Call this when an entity dies to spawn its loot.
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity that died
 * @returns Array of spawned item entity IDs
 *
 * @example
 * ```typescript
 * // When enemy dies
 * if (enemy.health <= 0) {
 *   const loot = generateLoot(ecs, enemyId);
 *   console.log(`Dropped ${loot.length} items`);
 * }
 * ```
 */
export function generateLoot(ecs: ECS, entityId: number): number[] {
  const lootTable = ecs.getComponent<LootTableComponent>(entityId, 'lootTable');
  if (!lootTable) {
    return []; // No loot table
  }

  const position = ecs.getComponent<PositionComponent>(entityId, 'position');
  const location = ecs.getComponent<LocationComponent>(entityId, 'location');

  if (!position || !location) {
    return []; // Need position to drop loot
  }

  const droppedItems: number[] = [];

  // Apply multipliers
  const dropChanceMultiplier = lootTable.dropChanceMultiplier || 1.0;
  const quantityMultiplier = lootTable.quantityMultiplier || 1.0;

  // Roll for each loot entry
  for (const entry of lootTable.entries) {
    const adjustedDropChance = Math.min(
      1.0,
      entry.dropChance * dropChanceMultiplier
    );

    // Check if item drops
    if (LJS.rand() < adjustedDropChance) {
      // Generate quantity
      const baseQuantity = generateQuantity(
        entry.minQuantity,
        entry.maxQuantity
      );
      const quantity = Math.max(
        1,
        Math.floor(baseQuantity * quantityMultiplier)
      );

      // Generate item
      const itemId = generateItem(ecs, entry.itemId, {
        qualityRange: entry.qualityRange,
        quantity,
      });

      // Apply random quality if specified
      if (entry.qualityRange) {
        applyRandomQuality(
          ecs,
          itemId,
          entry.qualityRange.min,
          entry.qualityRange.max
        );
      }

      // Apply blessing/curse if specified
      if (entry.blessChance || entry.curseChance) {
        applyRandomBlessState(
          ecs,
          itemId,
          entry.blessChance || 0,
          entry.curseChance || 0
        );
      }

      // Add position to dropped item (same as entity that died)
      ecs.addComponent<PositionComponent>(itemId, 'position', {
        x: position.x,
        y: position.y,
      });

      ecs.addComponent<LocationComponent>(itemId, 'location', {
        worldX: location.worldX,
        worldY: location.worldY,
      });

      droppedItems.push(itemId);
    }
  }

  return droppedItems;
}

/**
 * Add a loot table to an entity
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to add loot table to
 * @param entries - Loot entries
 * @param options - Optional multipliers and table ID
 *
 * @example
 * ```typescript
 * addLootTable(ecs, enemyId, [
 *   {
 *     itemId: 'health_potion',
 *     dropChance: 0.3,
 *     minQuantity: 1,
 *     maxQuantity: 2
 *   },
 *   {
 *     itemId: 'gold_coin',
 *     dropChance: 1.0,
 *     minQuantity: 5,
 *     maxQuantity: 15
 *   }
 * ]);
 * ```
 */
export function addLootTable(
  ecs: ECS,
  entityId: number,
  entries: LootEntry[],
  options?: {
    tableId?: string;
    dropChanceMultiplier?: number;
    quantityMultiplier?: number;
  }
): void {
  ecs.addComponent<LootTableComponent>(entityId, 'lootTable', {
    entries,
    tableId: options?.tableId,
    dropChanceMultiplier: options?.dropChanceMultiplier,
    quantityMultiplier: options?.quantityMultiplier,
  });
}

/**
 * Generate loot from a loot table ID (for containers/chests)
 *
 * Similar to generateLoot but for static containers rather than entities.
 *
 * @param ecs - The ECS instance
 * @param tableId - Loot table ID to use
 * @param x - X position to spawn loot
 * @param y - Y position to spawn loot
 * @param worldX - World X location
 * @param worldY - World Y location
 * @returns Array of spawned item entity IDs
 *
 * @example
 * ```typescript
 * // Open chest
 * const loot = generateLootFromTable(ecs, 'chest_common', 10, 15, 5, 5);
 * ```
 */
export function generateLootFromTable(
  ecs: ECS,
  tableId: string,
  x: number,
  y: number,
  worldX: number,
  worldY: number
): number[] {
  // TODO: Load loot table from data system
  // For now, return empty array
  // In full implementation, would load from data files and call generateLoot logic

  return [];
}

/**
 * Drop a specific item at a position
 *
 * Used for manual item drops (player discarding items, quest rewards, etc.)
 *
 * @param ecs - The ECS instance
 * @param itemId - Item entity to drop
 * @param x - X position
 * @param y - Y position
 * @param worldX - World X location
 * @param worldY - World Y location
 *
 * @example
 * ```typescript
 * // Player drops item
 * dropItemAtPosition(ecs, itemId, playerX, playerY, worldX, worldY);
 * ```
 */
export function dropItemAtPosition(
  ecs: ECS,
  itemId: number,
  x: number,
  y: number,
  worldX: number,
  worldY: number
): void {
  // Update or add position component
  let position = ecs.getComponent<PositionComponent>(itemId, 'position');
  if (position) {
    position.x = x;
    position.y = y;
  } else {
    ecs.addComponent<PositionComponent>(itemId, 'position', { x, y });
  }

  // Update or add location component
  let location = ecs.getComponent<LocationComponent>(itemId, 'location');
  if (location) {
    location.worldX = worldX;
    location.worldY = worldY;
  } else {
    ecs.addComponent<LocationComponent>(itemId, 'location', { worldX, worldY });
  }
}

/**
 * Pick up an item from the ground
 *
 * Removes position/location components and adds to entity's inventory.
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity picking up the item
 * @param itemId - Item to pick up
 * @returns True if successful, false otherwise
 *
 * @example
 * ```typescript
 * if (pickupItem(ecs, playerId, itemId)) {
 *   console.log('Item picked up!');
 * }
 * ```
 */
export function pickupItem(
  ecs: ECS,
  entityId: number,
  itemId: number
): boolean {
  // TODO: Integrate with inventory system
  // For now, just remove position components

  // Remove position (item no longer on ground)
  if (ecs.hasComponent(itemId, 'position')) {
    ecs.removeComponent(itemId, 'position');
  }

  if (ecs.hasComponent(itemId, 'location')) {
    ecs.removeComponent(itemId, 'location');
  }

  // TODO: Add to inventory using addItem from inventorySystem
  // addItem(ecs, entityId, itemId);

  return true;
}

/**
 * Get all items at a specific position
 *
 * Useful for:
 * - Showing pickup UI
 * - Auto-pickup mechanics
 * - Area loot display
 *
 * @param ecs - The ECS instance
 * @param x - X position
 * @param y - Y position
 * @param worldX - World X location
 * @param worldY - World Y location
 * @returns Array of item entity IDs at position
 *
 * @example
 * ```typescript
 * const items = getItemsAtPosition(ecs, playerX, playerY, worldX, worldY);
 * if (items.length > 0) {
 *   console.log(`${items.length} items here`);
 * }
 * ```
 */
export function getItemsAtPosition(
  ecs: ECS,
  x: number,
  y: number,
  worldX: number,
  worldY: number
): number[] {
  const items = ecs.query('item', 'position', 'location');
  const result: number[] = [];

  for (const itemId of items) {
    const position = ecs.getComponent<PositionComponent>(itemId, 'position');
    const location = ecs.getComponent<LocationComponent>(itemId, 'location');

    if (
      position &&
      location &&
      position.x === x &&
      position.y === y &&
      location.worldX === worldX &&
      location.worldY === worldY
    ) {
      result.push(itemId);
    }
  }

  return result;
}
