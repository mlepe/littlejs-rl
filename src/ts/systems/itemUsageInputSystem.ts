/*
 * File: itemUsageInputSystem.ts
 * Project: littlejs-rl
 * File Created: Saturday, 16th November 2025 12:30:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Saturday, 16th November 2025 12:30:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { ChargesComponent } from '../components/charges';
import ECS from '../ecs';
import { InputComponent } from '../components/input';
import { InventoryComponent } from '../components/inventory';
import { ItemComponent } from '../components/item';
import { useItem } from './itemUsageSystem';

/**
 * Item Usage Input System - Handles player input for using items
 *
 * When player presses U key:
 * 1. Gets first usable item from inventory
 * 2. Attempts to use it
 * 3. Logs result to console
 *
 * Future enhancement: Add item selection UI for choosing which item to use
 *
 * @param ecs - The ECS instance
 *
 * @example
 * ```typescript
 * function gameUpdate() {
 *   inputSystem(ecs);
 *   itemUsageInputSystem(ecs); // Process U key press
 *   playerMovementSystem(ecs);
 * }
 * ```
 */
export function itemUsageInputSystem(ecs: ECS): void {
  const playerEntities = ecs.query('player', 'input', 'inventory');

  for (const playerId of playerEntities) {
    const input = ecs.getComponent<InputComponent>(playerId, 'input');
    const inventory = ecs.getComponent<InventoryComponent>(
      playerId,
      'inventory'
    );

    if (!input || !inventory || !input.useItem) continue;

    // Get first usable item (has consumable or charges component)
    const usableItem = findUsableItem(ecs, inventory);

    if (!usableItem) {
      console.log('[ItemUsage] No usable items in inventory');
      continue;
    }

    const item = ecs.getComponent<ItemComponent>(usableItem, 'item');
    const itemName = item?.name || 'Unknown Item';

    console.log(`[ItemUsage] Attempting to use: ${itemName}`);

    // Use the item (no target for now - will be enhanced later)
    const success = useItem(ecs, playerId, usableItem);

    if (success) {
      console.log(`[ItemUsage] Successfully used ${itemName}`);
    } else {
      console.log(`[ItemUsage] Failed to use ${itemName}`);
    }
  }
}

/**
 * Find first usable item in inventory
 *
 * Item is usable if it has:
 * - Consumable component, OR
 * - Charges component with current > 0
 *
 * @param ecs - The ECS instance
 * @param inventory - Inventory component to search
 * @returns First usable item entity ID, or undefined if none found
 */
function findUsableItem(
  ecs: ECS,
  inventory: InventoryComponent
): number | undefined {
  for (const itemId of inventory.items) {
    // Check if item has consumable component
    if (ecs.hasComponent(itemId, 'consumable')) {
      return itemId;
    }

    // Check if item has charges with current > 0
    const charges = ecs.getComponent<ChargesComponent>(itemId, 'charges');
    if (charges && charges.current > 0) {
      return itemId;
    }
  }

  return undefined;
}

/**
 * Get all usable items from inventory
 *
 * Useful for UI display - shows which items can be used.
 *
 * @param ecs - The ECS instance
 * @param inventory - Inventory component to search
 * @returns Array of usable item entity IDs
 *
 * @example
 * ```typescript
 * const usableItems = getUsableItems(ecs, inventory);
 * for (const itemId of usableItems) {
 *   const item = ecs.getComponent<ItemComponent>(itemId, 'item');
 *   console.log(`Can use: ${item.name}`);
 * }
 * ```
 */
export function getUsableItems(
  ecs: ECS,
  inventory: InventoryComponent
): number[] {
  const usableItems: number[] = [];

  for (const itemId of inventory.items) {
    // Check if item has consumable component
    if (ecs.hasComponent(itemId, 'consumable')) {
      usableItems.push(itemId);
      continue;
    }

    // Check if item has charges with current > 0
    const charges = ecs.getComponent<ChargesComponent>(itemId, 'charges');
    if (charges && charges.current > 0) {
      usableItems.push(itemId);
    }
  }

  return usableItems;
}
