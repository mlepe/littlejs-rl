/*
 * File: inventorySystem.ts
 * Project: littlejs-rl
 * File Created: Friday, 15th November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Friday, 15th November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import type ECS from '../ecs';
import type { InventoryComponent } from '../components/inventory';
import type { ItemComponent } from '../components/item';
import type { StatsComponent } from '../components/stats';

/**
 * Check if two items can stack together
 *
 * Items can stack if:
 * - Both are stackable
 * - Same item type
 * - Same quality level
 * - Same bless state
 * - Same identification level
 * - Same material
 *
 * @param item1 - First item component
 * @param item2 - Second item component
 * @returns True if items can stack
 */
export function canItemsStack(
  item1: ItemComponent,
  item2: ItemComponent
): boolean {
  if (!item1.stackable || !item2.stackable) return false;

  return (
    item1.itemType === item2.itemType &&
    item1.quality === item2.quality &&
    item1.blessState === item2.blessState &&
    item1.identified === item2.identified &&
    item1.material === item2.material &&
    item1.name === item2.name // Ensure same base item
  );
}

/**
 * Calculate total weight of an item stack
 *
 * @param item - Item component
 * @returns Total weight (weight * quantity)
 */
export function getItemWeight(item: ItemComponent): number {
  return item.weight * item.quantity;
}

/**
 * Update inventory's current weight by summing all items
 *
 * @param ecs - ECS instance
 * @param entityId - Entity with inventory
 */
export function updateInventoryWeight(ecs: ECS, entityId: number): void {
  const inventory = ecs.getComponent<InventoryComponent>(entityId, 'inventory');
  if (!inventory) return;

  let totalWeight = 0;

  for (const itemId of inventory.items) {
    const item = ecs.getComponent<ItemComponent>(itemId, 'item');
    if (item) {
      totalWeight += getItemWeight(item);
    }
  }

  inventory.currentWeight = totalWeight;
}

/**
 * Check if entity can add item without exceeding carry capacity
 *
 * @param ecs - ECS instance
 * @param entityId - Entity with inventory and stats
 * @param itemId - Item entity to add
 * @returns True if item can be added, false if over capacity
 */
export function canAddItem(
  ecs: ECS,
  entityId: number,
  itemId: number
): boolean {
  const inventory = ecs.getComponent<InventoryComponent>(entityId, 'inventory');
  const stats = ecs.getComponent<StatsComponent>(entityId, 'stats');
  const item = ecs.getComponent<ItemComponent>(itemId, 'item');

  if (!inventory || !stats || !item) return false;

  const newWeight = inventory.currentWeight + getItemWeight(item);
  return newWeight <= stats.derived.carryCapacity;
}

/**
 * Attempt to stack a new item with existing items in inventory
 *
 * If a matching stack is found, increases quantity and removes the new item entity.
 * Returns true if stacked successfully, false if no stack found.
 *
 * @param ecs - ECS instance
 * @param entityId - Entity with inventory
 * @param itemId - New item to stack
 * @returns True if item was stacked, false if not stackable
 */
export function tryStackItem(
  ecs: ECS,
  entityId: number,
  itemId: number
): boolean {
  const inventory = ecs.getComponent<InventoryComponent>(entityId, 'inventory');
  const newItem = ecs.getComponent<ItemComponent>(itemId, 'item');

  if (!inventory || !newItem || !newItem.stackable) return false;

  // Find matching stack
  for (const existingItemId of inventory.items) {
    const existingItem = ecs.getComponent<ItemComponent>(
      existingItemId,
      'item'
    );

    if (existingItem && canItemsStack(newItem, existingItem)) {
      // Stack found - add quantity
      existingItem.quantity += newItem.quantity;

      // Remove the new item entity (it's been merged)
      ecs.removeEntity(itemId);

      // Update weight
      updateInventoryWeight(ecs, entityId);

      return true;
    }
  }

  return false; // No matching stack found
}

/**
 * Add item to entity's inventory
 *
 * Automatically attempts stacking if item is stackable.
 * Checks carry capacity before adding.
 *
 * @param ecs - ECS instance
 * @param entityId - Entity with inventory and stats
 * @param itemId - Item entity to add
 * @returns True if item was added, false if over capacity or invalid
 */
export function addItem(ecs: ECS, entityId: number, itemId: number): boolean {
  const inventory = ecs.getComponent<InventoryComponent>(entityId, 'inventory');
  const item = ecs.getComponent<ItemComponent>(itemId, 'item');

  if (!inventory || !item) return false;

  // Check carry capacity
  if (!canAddItem(ecs, entityId, itemId)) {
    console.log('Cannot add item: exceeds carry capacity');
    return false;
  }

  // Try to stack first
  if (item.stackable && tryStackItem(ecs, entityId, itemId)) {
    console.log(`Stacked ${item.name} (quantity: ${item.quantity})`);
    return true;
  }

  // Add as new item
  inventory.items.push(itemId);
  updateInventoryWeight(ecs, entityId);

  console.log(`Added ${item.name} to inventory`);
  return true;
}

/**
 * Remove item from entity's inventory
 *
 * For stackable items, reduces quantity by specified amount.
 * Removes item entity if quantity reaches 0.
 *
 * @param ecs - ECS instance
 * @param entityId - Entity with inventory
 * @param itemId - Item entity to remove
 * @param quantity - Amount to remove (default 1)
 * @returns True if item was removed, false if not found or invalid quantity
 */
export function removeItem(
  ecs: ECS,
  entityId: number,
  itemId: number,
  quantity = 1
): boolean {
  const inventory = ecs.getComponent<InventoryComponent>(entityId, 'inventory');
  const item = ecs.getComponent<ItemComponent>(itemId, 'item');

  if (!inventory || !item) return false;

  const itemIndex = inventory.items.indexOf(itemId);
  if (itemIndex === -1) return false;

  if (item.stackable) {
    // Reduce quantity
    item.quantity -= quantity;

    if (item.quantity <= 0) {
      // Remove item entity
      inventory.items.splice(itemIndex, 1);
      ecs.removeEntity(itemId);
      console.log(`Removed all ${item.name} from inventory`);
    } else {
      console.log(
        `Removed ${quantity}x ${item.name} (${item.quantity} remaining)`
      );
    }
  } else {
    // Remove non-stackable item
    inventory.items.splice(itemIndex, 1);
    ecs.removeEntity(itemId);
    console.log(`Removed ${item.name} from inventory`);
  }

  updateInventoryWeight(ecs, entityId);
  return true;
}

/**
 * Get total number of items in inventory (counting stacks as 1 each)
 *
 * @param ecs - ECS instance
 * @param entityId - Entity with inventory
 * @returns Total item count
 */
export function getItemCount(ecs: ECS, entityId: number): number {
  const inventory = ecs.getComponent<InventoryComponent>(entityId, 'inventory');
  return inventory ? inventory.items.length : 0;
}

/**
 * Get inventory space usage as percentage
 *
 * @param ecs - ECS instance
 * @param entityId - Entity with inventory and stats
 * @returns Percentage (0-100) of carry capacity used
 */
export function getInventoryUsagePercent(ecs: ECS, entityId: number): number {
  const inventory = ecs.getComponent<InventoryComponent>(entityId, 'inventory');
  const stats = ecs.getComponent<StatsComponent>(entityId, 'stats');

  if (!inventory || !stats) return 0;

  const capacity = stats.derived.carryCapacity;
  if (capacity === 0) return 0;

  return (inventory.currentWeight / capacity) * 100;
}

/**
 * Check if entity is over-encumbered (above 100% capacity)
 *
 * @param ecs - ECS instance
 * @param entityId - Entity with inventory and stats
 * @returns True if over-encumbered
 */
export function isOverEncumbered(ecs: ECS, entityId: number): boolean {
  return getInventoryUsagePercent(ecs, entityId) > 100;
}

/**
 * Inventory System - Maintains inventory weights and enforces capacity limits
 *
 * Call this system periodically or after stat changes to ensure weights are current.
 * Can be extended with over-encumbrance penalties in the future.
 *
 * @param ecs - ECS instance
 */
export function inventorySystem(ecs: ECS): void {
  const entities = ecs.query('inventory', 'stats');

  for (const entityId of entities) {
    // Recalculate weight in case items changed
    updateInventoryWeight(ecs, entityId);

    // Future: Apply over-encumbrance penalties to movement/combat
    if (isOverEncumbered(ecs, entityId)) {
      // TODO: Apply penalties when combat/movement systems are ready
      console.warn(`Entity ${entityId} is over-encumbered!`);
    }
  }
}
