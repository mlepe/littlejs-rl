/*
 * File: inventorySystem.ts
 * Project: littlejs-rl
 * File Created: Thursday, 14th November 2025 9:59:17 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 14th November 2025 9:59:17 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import ECS from '../ecs';
import {
  InventoryComponent,
  WeightComponent,
  StackableComponent,
} from '../components';
import { canItemsStack, stackItems } from './itemStackingSystem';
import {
  calculateInventoryWeight,
  updateInventoryWeight,
} from './carryWeightSystem';

/**
 * Add item to inventory
 * Automatically stacks if possible
 * Returns true if successful, false if would exceed carry weight
 */
export function addItemToInventory(
  ecs: ECS,
  entityId: number,
  itemId: number
): boolean {
  const inventory = ecs.getComponent<InventoryComponent>(
    entityId,
    'inventory'
  );
  if (!inventory) return false;

  // Check if item can stack with existing items
  const stackable = ecs.getComponent<StackableComponent>(itemId, 'stackable');
  if (stackable) {
    for (const existingItemId of inventory.items) {
      if (canItemsStack(ecs, existingItemId, itemId)) {
        // Try to stack
        if (stackItems(ecs, existingItemId, itemId)) {
          updateInventoryWeight(ecs, entityId);
          return true;
        }
      }
    }
  }

  // Calculate weight of new item
  const weight = ecs.getComponent<WeightComponent>(itemId, 'weight');
  const itemWeight = weight ? weight.weight * (stackable?.quantity || 1) : 0;

  // Check if would exceed carry weight
  if (inventory.currentWeight + itemWeight > inventory.maxCarryWeight) {
    return false;
  }

  // Add to inventory
  inventory.items.push(itemId);
  updateInventoryWeight(ecs, entityId);

  return true;
}

/**
 * Remove item from inventory
 * Returns true if successful
 */
export function removeItemFromInventory(
  ecs: ECS,
  entityId: number,
  itemId: number
): boolean {
  const inventory = ecs.getComponent<InventoryComponent>(
    entityId,
    'inventory'
  );
  if (!inventory) return false;

  const index = inventory.items.indexOf(itemId);
  if (index === -1) return false;

  inventory.items.splice(index, 1);
  updateInventoryWeight(ecs, entityId);

  return true;
}

/**
 * Transfer item from one inventory to another
 * Returns true if successful
 */
export function transferItem(
  ecs: ECS,
  fromEntityId: number,
  toEntityId: number,
  itemId: number
): boolean {
  if (!removeItemFromInventory(ecs, fromEntityId, itemId)) {
    return false;
  }

  if (!addItemToInventory(ecs, toEntityId, itemId)) {
    // Failed to add, put it back
    addItemToInventory(ecs, fromEntityId, itemId);
    return false;
  }

  return true;
}

/**
 * Drop item from inventory (removes from inventory, doesn't delete entity)
 */
export function dropItem(ecs: ECS, entityId: number, itemId: number): boolean {
  return removeItemFromInventory(ecs, entityId, itemId);
}

/**
 * Check if entity has item in inventory
 */
export function hasItemInInventory(
  ecs: ECS,
  entityId: number,
  itemId: number
): boolean {
  const inventory = ecs.getComponent<InventoryComponent>(
    entityId,
    'inventory'
  );
  if (!inventory) return false;

  return inventory.items.includes(itemId);
}

/**
 * Get number of items in inventory
 */
export function getInventoryItemCount(ecs: ECS, entityId: number): number {
  const inventory = ecs.getComponent<InventoryComponent>(
    entityId,
    'inventory'
  );
  if (!inventory) return 0;

  return inventory.items.length;
}

/**
 * Sort inventory by item type, then by name
 */
export function sortInventory(ecs: ECS, entityId: number): void {
  const inventory = ecs.getComponent<InventoryComponent>(
    entityId,
    'inventory'
  );
  if (!inventory) return;

  inventory.items.sort((a, b) => {
    const itemA = ecs.getComponent<any>(a, 'item');
    const itemB = ecs.getComponent<any>(b, 'item');

    if (!itemA || !itemB) return 0;

    // Sort by type first
    if (itemA.type !== itemB.type) {
      return itemA.type.localeCompare(itemB.type);
    }

    // Then by name
    return itemA.name.localeCompare(itemB.name);
  });
}
