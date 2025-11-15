/*
 * File: equipmentSystem.ts
 * Project: littlejs-rl
 * File Created: Friday, 15th November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Friday, 15th November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { EquipmentSlot, ItemComponent } from '../components/item';

import ECS from '../ecs';
import { EquipmentComponent } from '../components/equipment';
import { InventoryComponent } from '../components/inventory';

/**
 * Map EquipmentSlot enum values to EquipmentComponent property names
 */
const SLOT_MAPPING: Record<EquipmentSlot, keyof EquipmentComponent> = {
  head: 'head',
  face: 'face',
  neck: 'neck',
  body: 'body',
  'shoulder-left': 'shoulderLeft',
  'shoulder-right': 'shoulderRight',
  'wrist-left': 'wristLeft',
  'wrist-right': 'wristRight',
  'hand-left': 'handLeft',
  'hand-right': 'handRight',
  'main-hand': 'mainHand',
  'off-hand': 'offHand',
  'ring-left': 'ringLeft',
  'ring-right': 'ringRight',
  back: 'back',
  belt: 'belt',
  legs: 'legs',
  feet: 'feet',
};

/**
 * Check if an item can be equipped by an entity
 *
 * Validates:
 * - Item exists and has an equipment slot defined
 * - Entity has equipment component
 * - Item is in entity's inventory
 *
 * @param ecs - The ECS instance
 * @param entityId - The entity trying to equip the item
 * @param itemId - The item entity to equip
 * @returns True if item can be equipped, false otherwise
 *
 * @example
 * ```typescript
 * if (canEquipItem(ecs, playerId, swordId)) {
 *   equipItem(ecs, playerId, swordId);
 * }
 * ```
 */
export function canEquipItem(
  ecs: ECS,
  entityId: number,
  itemId: number
): boolean {
  // Get item component
  const item = ecs.getComponent<ItemComponent>(itemId, 'item');
  if (!item || !item.equipSlot) {
    return false; // Item doesn't exist or isn't equippable
  }

  // Get equipment component
  const equipment = ecs.getComponent<EquipmentComponent>(entityId, 'equipment');
  if (!equipment) {
    return false; // Entity can't equip items
  }

  // Check if item is in inventory
  const inventory = ecs.getComponent<InventoryComponent>(entityId, 'inventory');
  if (!inventory || !inventory.items.includes(itemId)) {
    return false; // Item not in inventory
  }

  return true;
}

/**
 * Equip an item to an entity
 *
 * Equips the item to the appropriate slot based on item.equipSlot.
 * If the slot is already occupied, the old item is unequipped first.
 * Updates item.equipped status and inventory tracking.
 *
 * @param ecs - The ECS instance
 * @param entityId - The entity equipping the item
 * @param itemId - The item entity to equip
 * @returns True if successfully equipped, false if validation failed
 *
 * @example
 * ```typescript
 * const success = equipItem(ecs, playerId, helmId);
 * if (success) {
 *   console.log('Helmet equipped!');
 * }
 * ```
 */
export function equipItem(ecs: ECS, entityId: number, itemId: number): boolean {
  // Validate
  if (!canEquipItem(ecs, entityId, itemId)) {
    return false;
  }

  const item = ecs.getComponent<ItemComponent>(itemId, 'item');
  const equipment = ecs.getComponent<EquipmentComponent>(entityId, 'equipment');

  if (!item || !equipment || !item.equipSlot) {
    return false;
  }

  // Map equipment slot to component property
  const slotKey = SLOT_MAPPING[item.equipSlot];

  // Unequip current item in that slot if present
  const currentItemId = equipment[slotKey];
  if (currentItemId !== undefined) {
    unequipItem(ecs, entityId, item.equipSlot);
  }

  // Equip the new item
  equipment[slotKey] = itemId;
  item.equipped = true;

  return true;
}

/**
 * Unequip an item from a specific equipment slot
 *
 * Removes the item from the slot and marks it as unequipped.
 * Cursed items (blessState='cursed') cannot be unequipped and will fail.
 *
 * @param ecs - The ECS instance
 * @param entityId - The entity unequipping the item
 * @param slot - The equipment slot to unequip from
 * @returns True if successfully unequipped, false if slot empty or item is cursed
 *
 * @example
 * ```typescript
 * const success = unequipItem(ecs, playerId, 'main-hand');
 * if (!success) {
 *   console.log('Cannot unequip - item may be cursed!');
 * }
 * ```
 */
export function unequipItem(
  ecs: ECS,
  entityId: number,
  slot: EquipmentSlot
): boolean {
  const equipment = ecs.getComponent<EquipmentComponent>(entityId, 'equipment');
  if (!equipment) {
    return false;
  }

  const slotKey = SLOT_MAPPING[slot];
  const itemId = equipment[slotKey];

  if (itemId === undefined) {
    return false; // Nothing equipped in that slot
  }

  const item = ecs.getComponent<ItemComponent>(itemId, 'item');
  if (!item) {
    return false;
  }

  // Cursed items cannot be unequipped
  if (item.blessState === 'cursed') {
    return false;
  }

  // Unequip the item
  equipment[slotKey] = undefined;
  item.equipped = false;

  return true;
}

/**
 * Get the item equipped in a specific slot
 *
 * @param ecs - The ECS instance
 * @param entityId - The entity to check
 * @param slot - The equipment slot to check
 * @returns The item entity ID if equipped, undefined if slot is empty
 *
 * @example
 * ```typescript
 * const weaponId = getEquippedItem(ecs, playerId, 'main-hand');
 * if (weaponId !== undefined) {
 *   const weapon = ecs.getComponent<ItemComponent>(weaponId, 'item');
 *   console.log(`Wielding: ${weapon.name}`);
 * }
 * ```
 */
export function getEquippedItem(
  ecs: ECS,
  entityId: number,
  slot: EquipmentSlot
): number | undefined {
  const equipment = ecs.getComponent<EquipmentComponent>(entityId, 'equipment');
  if (!equipment) {
    return undefined;
  }

  const slotKey = SLOT_MAPPING[slot];
  return equipment[slotKey];
}

/**
 * Get all equipped items for an entity
 *
 * Returns a map of slot names to item entity IDs for all non-empty slots.
 * Useful for UI display, stat calculation, and save/load operations.
 *
 * @param ecs - The ECS instance
 * @param entityId - The entity to check
 * @returns Map of EquipmentSlot to item entity ID for all equipped items
 *
 * @example
 * ```typescript
 * const equipped = getAllEquippedItems(ecs, playerId);
 * for (const [slot, itemId] of equipped.entries()) {
 *   const item = ecs.getComponent<ItemComponent>(itemId, 'item');
 *   console.log(`${slot}: ${item.name}`);
 * }
 * ```
 */
export function getAllEquippedItems(
  ecs: ECS,
  entityId: number
): Map<EquipmentSlot, number> {
  const result = new Map<EquipmentSlot, number>();
  const equipment = ecs.getComponent<EquipmentComponent>(entityId, 'equipment');

  if (!equipment) {
    return result;
  }

  // Iterate through all slots
  for (const [slot, slotKey] of Object.entries(SLOT_MAPPING)) {
    const itemId = equipment[slotKey];
    if (itemId !== undefined) {
      result.set(slot as EquipmentSlot, itemId);
    }
  }

  return result;
}

/**
 * Main equipment system - processes equipment-related logic
 *
 * Currently a placeholder for future functionality like:
 * - Applying stat bonuses from equipped items
 * - Handling equipment durability
 * - Processing equipment-based effects
 * - Auto-equipping items
 *
 * Call this system after inventory changes or during game updates.
 *
 * @param ecs - The ECS instance
 *
 * @example
 * ```typescript
 * function gameUpdate() {
 *   inputSystem(ecs);
 *   playerMovementSystem(ecs);
 *   equipmentSystem(ecs); // Process equipment effects
 *   aiSystem(ecs, playerId);
 * }
 * ```
 */
export function equipmentSystem(ecs: ECS): void {
  // Future: Apply stat bonuses, equipment effects, etc.
  // For now, equipment state is managed by equip/unequip functions
}
