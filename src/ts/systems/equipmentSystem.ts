/*
 * File: equipmentSystem.ts
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
  EquipmentComponent,
  EquippableComponent,
  InventoryComponent,
  ItemComponent,
  ItemState,
  getSlotKey,
} from '../components';

/**
 * Equip an item to a specific slot
 * Returns true if successful, false otherwise
 */
export function equipItem(
  ecs: ECS,
  entityId: number,
  itemId: number,
  slotIndex: number
): boolean {
  const equipment = ecs.getComponent<EquipmentComponent>(
    entityId,
    'equipment'
  );
  const equippable = ecs.getComponent<EquippableComponent>(
    itemId,
    'equippable'
  );
  const inventory = ecs.getComponent<InventoryComponent>(entityId, 'inventory');

  if (!equipment || !equippable || !inventory) return false;

  // Check if item is in inventory
  if (!inventory.items.includes(itemId)) return false;

  // Check if item is already equipped
  if (equippable.isEquipped) return false;

  // Find the slot
  const slot = equipment.slots.find(
    (s) => s.type === equippable.slotType && s.index === slotIndex
  );
  if (!slot) return false;

  const slotKeyStr = getSlotKey(slot.type, slot.index);

  // Check if slot is already occupied
  const currentlyEquipped = equipment.equipped.get(slotKeyStr);
  if (currentlyEquipped !== undefined) {
    // Unequip current item first
    if (!unequipItem(ecs, entityId, slot.type, slotIndex)) {
      return false;
    }
  }

  // Check if item is cursed (can't equip cursed items intentionally in some games)
  // For now, we allow equipping but will prevent unequipping later
  const item = ecs.getComponent<ItemComponent>(itemId, 'item');

  // Equip the item
  equipment.equipped.set(slotKeyStr, itemId);
  equippable.isEquipped = true;
  equippable.equippedBy = entityId;
  equippable.equippedSlotIndex = slotIndex;

  return true;
}

/**
 * Unequip an item from a specific slot
 * Returns true if successful, false otherwise
 */
export function unequipItem(
  ecs: ECS,
  entityId: number,
  slotType: string,
  slotIndex: number
): boolean {
  const equipment = ecs.getComponent<EquipmentComponent>(
    entityId,
    'equipment'
  );
  if (!equipment) return false;

  const slotKeyStr = getSlotKey(slotType, slotIndex);
  const itemId = equipment.equipped.get(slotKeyStr);

  if (itemId === undefined) return false;

  const equippable = ecs.getComponent<EquippableComponent>(itemId, 'equippable');
  const item = ecs.getComponent<ItemComponent>(itemId, 'item');

  if (!equippable) return false;

  // Check if item is cursed - can't unequip cursed items
  if (item && item.state === ItemState.CURSED) {
    return false;
  }

  // Unequip the item
  equipment.equipped.delete(slotKeyStr);
  equippable.isEquipped = false;
  equippable.equippedBy = undefined;
  equippable.equippedSlotIndex = undefined;

  return true;
}

/**
 * Get item equipped in a specific slot
 */
export function getEquippedItem(
  ecs: ECS,
  entityId: number,
  slotType: string,
  slotIndex: number
): number | undefined {
  const equipment = ecs.getComponent<EquipmentComponent>(
    entityId,
    'equipment'
  );
  if (!equipment) return undefined;

  const slotKeyStr = getSlotKey(slotType, slotIndex);
  return equipment.equipped.get(slotKeyStr);
}

/**
 * Get all equipped items for an entity
 */
export function getAllEquippedItems(ecs: ECS, entityId: number): number[] {
  const equipment = ecs.getComponent<EquipmentComponent>(
    entityId,
    'equipment'
  );
  if (!equipment) return [];

  return Array.from(equipment.equipped.values());
}

/**
 * Check if a slot is occupied
 */
export function isSlotOccupied(
  ecs: ECS,
  entityId: number,
  slotType: string,
  slotIndex: number
): boolean {
  return getEquippedItem(ecs, entityId, slotType, slotIndex) !== undefined;
}

/**
 * Force unequip a cursed item (e.g., after curse removal)
 */
export function forceUnequipItem(
  ecs: ECS,
  entityId: number,
  slotType: string,
  slotIndex: number
): boolean {
  const equipment = ecs.getComponent<EquipmentComponent>(
    entityId,
    'equipment'
  );
  if (!equipment) return false;

  const slotKeyStr = getSlotKey(slotType, slotIndex);
  const itemId = equipment.equipped.get(slotKeyStr);

  if (itemId === undefined) return false;

  const equippable = ecs.getComponent<EquippableComponent>(itemId, 'equippable');
  if (!equippable) return false;

  // Force unequip regardless of curse status
  equipment.equipped.delete(slotKeyStr);
  equippable.isEquipped = false;
  equippable.equippedBy = undefined;
  equippable.equippedSlotIndex = undefined;

  return true;
}
