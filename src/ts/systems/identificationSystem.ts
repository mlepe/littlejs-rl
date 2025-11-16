/*
 * File: identificationSystem.ts
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

import { ItemComponent, ItemIdentificationLevel } from '../components/item';

import ECS from '../ecs';
import { IdentificationComponent } from '../components/identification';
import { InventoryComponent } from '../components/inventory';

/**
 * Identify an item instantly to a specific level
 *
 * Used for:
 * - Scroll of Identification
 * - NPC identification services
 * - Special abilities
 *
 * @param ecs - The ECS instance
 * @param itemId - The item entity to identify
 * @param level - Target identification level ('partial' or 'identified')
 * @returns True if successfully identified, false if item doesn't exist
 *
 * @example
 * ```typescript
 * // Use identification scroll
 * if (identifyItem(ecs, mysteriousPotionId, 'identified')) {
 *   console.log('Item fully identified!');
 * }
 * ```
 */
export function identifyItem(
  ecs: ECS,
  itemId: number,
  level: ItemIdentificationLevel
): boolean {
  const item = ecs.getComponent<ItemComponent>(itemId, 'item');
  if (!item) {
    return false;
  }

  // Update identification level
  item.identified = level;

  return true;
}

/**
 * Identify all items in an entity's inventory to a specific level
 *
 * Used for:
 * - Mass identification scrolls
 * - NPC services that identify everything
 * - Shop mechanics (merchants identify items when buying)
 *
 * @param ecs - The ECS instance
 * @param entityId - The entity whose inventory to identify
 * @param level - Target identification level
 * @returns Number of items identified
 *
 * @example
 * ```typescript
 * const count = identifyAllItems(ecs, playerId, 'partial');
 * console.log(`Identified ${count} items!`);
 * ```
 */
export function identifyAllItems(
  ecs: ECS,
  entityId: number,
  level: ItemIdentificationLevel
): number {
  const inventory = ecs.getComponent<InventoryComponent>(entityId, 'inventory');
  if (!inventory) {
    return 0;
  }

  let count = 0;
  for (const itemId of inventory.items) {
    const item = ecs.getComponent<ItemComponent>(itemId, 'item');
    if (item && item.identified !== 'identified') {
      item.identified = level;
      count++;
    }
  }

  return count;
}

/**
 * Process auto-identification for entities with IdentificationComponent
 *
 * Gradually identifies unidentified items in inventory based on:
 * - Time (deltaTime)
 * - Intelligence-based identification rate
 * - Thresholds for partial and full identification
 *
 * Call this system every frame in the game update loop.
 * Uses LJS.timeDelta for frame-independent progress.
 *
 * @param ecs - The ECS instance
 *
 * @example
 * ```typescript
 * function gameUpdate() {
 *   inputSystem(ecs);
 *   playerMovementSystem(ecs);
 *   identificationSystem(ecs); // Auto-identify items over time
 *   aiSystem(ecs, playerId);
 * }
 * ```
 */
export function identificationSystem(ecs: ECS): void {
  const entities = ecs.query('identification', 'inventory');

  for (const entityId of entities) {
    const identification = ecs.getComponent<IdentificationComponent>(
      entityId,
      'identification'
    );
    const inventory = ecs.getComponent<InventoryComponent>(
      entityId,
      'inventory'
    );

    if (!identification || !inventory || !identification.enabled) {
      continue;
    }

    // Process each item in inventory
    for (const itemId of inventory.items) {
      const item = ecs.getComponent<ItemComponent>(itemId, 'item');
      if (!item || item.identified === 'identified') {
        continue; // Skip already identified items
      }

      // Get or initialize progress
      let progress = identification.itemProgress.get(itemId) || 0;

      // Add progress based on rate and deltaTime
      progress += identification.autoIdentifyRate * LJS.timeDelta;

      // Update identification level based on progress
      if (progress >= identification.fullThreshold) {
        item.identified = 'identified';
        identification.itemProgress.delete(itemId); // Remove from tracking
      } else if (progress >= identification.partialThreshold) {
        if (item.identified === 'unidentified') {
          item.identified = 'partial';
        }
        identification.itemProgress.set(itemId, progress);
      } else {
        identification.itemProgress.set(itemId, progress);
      }
    }

    // Clean up progress for items no longer in inventory
    const inventoryItemIds = new Set(inventory.items);
    for (const [itemId] of identification.itemProgress) {
      if (!inventoryItemIds.has(itemId)) {
        identification.itemProgress.delete(itemId);
      }
    }
  }
}

/**
 * Get identification progress for a specific item
 *
 * Useful for UI display showing how close an item is to identification.
 *
 * @param ecs - The ECS instance
 * @param entityId - The entity with IdentificationComponent
 * @param itemId - The item to check
 * @returns Progress value (0-200+), or undefined if not tracking
 *
 * @example
 * ```typescript
 * const progress = getIdentificationProgress(ecs, playerId, itemId);
 * if (progress !== undefined) {
 *   console.log(`Item ${progress}% identified`);
 * }
 * ```
 */
export function getIdentificationProgress(
  ecs: ECS,
  entityId: number,
  itemId: number
): number | undefined {
  const identification = ecs.getComponent<IdentificationComponent>(
    entityId,
    'identification'
  );
  if (!identification) {
    return undefined;
  }

  return identification.itemProgress.get(itemId);
}

/**
 * Reset identification progress for an item
 *
 * Used when:
 * - Item is dropped and picked up by another entity
 * - Item properties change (re-enchantment, cursing)
 * - Game mechanics require re-identification
 *
 * @param ecs - The ECS instance
 * @param entityId - The entity with IdentificationComponent
 * @param itemId - The item to reset
 * @returns True if reset successful, false if not found
 *
 * @example
 * ```typescript
 * // Item was cursed, needs re-identification
 * resetIdentificationProgress(ecs, playerId, itemId);
 * ```
 */
export function resetIdentificationProgress(
  ecs: ECS,
  entityId: number,
  itemId: number
): boolean {
  const identification = ecs.getComponent<IdentificationComponent>(
    entityId,
    'identification'
  );
  if (!identification) {
    return false;
  }

  return identification.itemProgress.delete(itemId);
}

/**
 * Check if an item can be identified by an entity
 *
 * Validates that:
 * - Entity has identification component
 * - Item exists and is not already fully identified
 * - Item is in entity's inventory
 *
 * @param ecs - The ECS instance
 * @param entityId - The entity trying to identify
 * @param itemId - The item to identify
 * @returns True if item can be identified, false otherwise
 *
 * @example
 * ```typescript
 * if (canIdentifyItem(ecs, playerId, scrollId)) {
 *   identifyItem(ecs, scrollId, 'identified');
 * }
 * ```
 */
export function canIdentifyItem(
  ecs: ECS,
  entityId: number,
  itemId: number
): boolean {
  // Check entity has identification capability
  const identification = ecs.getComponent<IdentificationComponent>(
    entityId,
    'identification'
  );
  if (!identification) {
    return false;
  }

  // Check item exists and isn't already identified
  const item = ecs.getComponent<ItemComponent>(itemId, 'item');
  if (!item || item.identified === 'identified') {
    return false;
  }

  // Check item is in entity's inventory
  const inventory = ecs.getComponent<InventoryComponent>(entityId, 'inventory');
  if (!inventory || !inventory.items.includes(itemId)) {
    return false;
  }

  return true;
}
