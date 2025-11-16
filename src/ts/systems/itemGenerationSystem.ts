/*
 * File: itemGenerationSystem.ts
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

import {
  ItemBlessState,
  ItemComponent,
  ItemIdentificationLevel,
} from '../components/item';

import { ChargesComponent } from '../components/charges';
import { ConsumableComponent } from '../components/consumable';
import ECS from '../ecs';

/**
 * Generate a random item from a template with randomized properties
 *
 * Creates an item entity with:
 * - Base properties from template
 * - Random quality (if range provided)
 * - Random blessing/curse state
 * - Random identification level
 * - Charges (if item has them)
 * - Consumable properties (if applicable)
 *
 * @param ecs - The ECS instance
 * @param templateId - Item template ID from data
 * @param options - Generation options
 * @returns Item entity ID
 *
 * @example
 * ```typescript
 * // Generate iron sword with random quality 0-2
 * const swordId = generateItem(ecs, 'iron_sword', {
 *   qualityRange: { min: 0, max: 2 },
 *   blessChance: 0.1,
 *   curseChance: 0.05
 * });
 * ```
 */
export function generateItem(
  ecs: ECS,
  templateId: string,
  options?: {
    qualityRange?: { min: number; max: number };
    blessChance?: number;
    curseChance?: number;
    identificationLevel?: ItemIdentificationLevel;
    quantity?: number;
  }
): number {
  const itemId = ecs.createEntity();

  // TODO: Load template from data system
  // For now, create basic item component
  // In full implementation, this would load from EntityRegistry/DataLoader

  // Determine blessing state
  let blessState: ItemBlessState = 'normal';
  if (options?.blessChance && LJS.rand() < options.blessChance) {
    blessState = 'blessed';
  } else if (options?.curseChance && LJS.rand() < options.curseChance) {
    blessState = 'cursed';
  }

  // Determine quality
  let quality = 0;
  if (options?.qualityRange) {
    quality = LJS.randInt(options.qualityRange.min, options.qualityRange.max);
  }

  // Determine identification level
  const identified = options?.identificationLevel || 'unidentified';

  // Create base item component
  ecs.addComponent<ItemComponent>(itemId, 'item', {
    id: templateId,
    name: `Generated ${templateId}`,
    description: 'A generated item',
    weight: 1.0,
    value: 10,
    itemType: 'misc',
    identified,
    blessState,
    stackable: false,
    quantity: options?.quantity || 1,
    quality,
    material: 'unknown',
  });

  return itemId;
}

/**
 * Apply random quality to an item
 *
 * Quality affects:
 * - Item stats (damage, defense, etc.)
 * - Item value
 * - Item name display (+1, +2, +3, etc.)
 *
 * @param ecs - The ECS instance
 * @param itemId - Item entity to modify
 * @param minQuality - Minimum quality (inclusive)
 * @param maxQuality - Maximum quality (inclusive)
 * @returns The applied quality value
 *
 * @example
 * ```typescript
 * const quality = applyRandomQuality(ecs, swordId, 0, 3);
 * // Sword now has quality between +0 and +3
 * ```
 */
export function applyRandomQuality(
  ecs: ECS,
  itemId: number,
  minQuality: number,
  maxQuality: number
): number {
  const item = ecs.getComponent<ItemComponent>(itemId, 'item');
  if (!item) return 0;

  const quality = LJS.randInt(minQuality, maxQuality);
  item.quality = quality;

  // Update item value based on quality
  item.value = Math.floor(item.value * (1 + quality * 0.5));

  return quality;
}

/**
 * Apply random blessing or curse to an item
 *
 * @param ecs - The ECS instance
 * @param itemId - Item entity to modify
 * @param blessChance - Chance for blessing (0.0 to 1.0)
 * @param curseChance - Chance for curse (0.0 to 1.0)
 * @returns The applied blessing state
 *
 * @example
 * ```typescript
 * // 10% chance blessed, 5% chance cursed
 * const state = applyRandomBlessState(ecs, itemId, 0.1, 0.05);
 * ```
 */
export function applyRandomBlessState(
  ecs: ECS,
  itemId: number,
  blessChance: number,
  curseChance: number
): ItemBlessState {
  const item = ecs.getComponent<ItemComponent>(itemId, 'item');
  if (!item) return 'normal';

  let state: ItemBlessState = 'normal';

  if (LJS.rand() < blessChance) {
    state = 'blessed';
  } else if (LJS.rand() < curseChance) {
    state = 'cursed';
  }

  item.blessState = state;

  // Update item value based on blessing state
  if (state === 'blessed') {
    item.value = Math.floor(item.value * 2);
  } else if (state === 'cursed') {
    item.value = Math.floor(item.value * 0.5);
  }

  return state;
}

/**
 * Set item identification level
 *
 * @param ecs - The ECS instance
 * @param itemId - Item entity to modify
 * @param level - Identification level to set
 *
 * @example
 * ```typescript
 * setItemIdentification(ecs, potionId, 'partial');
 * ```
 */
export function setItemIdentification(
  ecs: ECS,
  itemId: number,
  level: ItemIdentificationLevel
): void {
  const item = ecs.getComponent<ItemComponent>(itemId, 'item');
  if (!item) return;

  item.identified = level;
}

/**
 * Create an item with charges component
 *
 * Used for rods, wands, scrolls with limited uses.
 *
 * @param ecs - The ECS instance
 * @param itemId - Item entity to add charges to
 * @param current - Current charges
 * @param max - Maximum charges
 * @param rechargeable - Whether item can be recharged
 * @param deleteWhenEmpty - Whether to delete item when depleted
 * @param rechargeRate - Optional passive recharge rate
 *
 * @example
 * ```typescript
 * addCharges(ecs, rodId, 10, 20, true, false, 0.05);
 * ```
 */
export function addCharges(
  ecs: ECS,
  itemId: number,
  current: number,
  max: number,
  rechargeable: boolean,
  deleteWhenEmpty: boolean,
  rechargeRate?: number
): void {
  ecs.addComponent<ChargesComponent>(itemId, 'charges', {
    current,
    max,
    rechargeable,
    deleteWhenEmpty,
    rechargeRate,
    rechargeProgress: 0,
  });
}

/**
 * Create an item with consumable component
 *
 * Used for potions, scrolls, food, and usable items.
 *
 * @param ecs - The ECS instance
 * @param itemId - Item entity to add consumable to
 * @param consumableData - Consumable properties
 *
 * @example
 * ```typescript
 * addConsumable(ecs, potionId, {
 *   effect: 'heal',
 *   power: 50,
 *   requiresTarget: false,
 *   consumeOnUse: true
 * });
 * ```
 */
export function addConsumable(
  ecs: ECS,
  itemId: number,
  consumableData: ConsumableComponent
): void {
  ecs.addComponent<ConsumableComponent>(itemId, 'consumable', consumableData);
}

/**
 * Generate random quantity within a range
 *
 * @param min - Minimum quantity
 * @param max - Maximum quantity
 * @returns Random quantity between min and max (inclusive)
 *
 * @example
 * ```typescript
 * const goldAmount = generateQuantity(5, 20);
 * // Returns random value between 5 and 20
 * ```
 */
export function generateQuantity(min: number, max: number): number {
  return LJS.randInt(min, max);
}

/**
 * Stack items if they match
 *
 * Checks if two items can stack and combines them if possible.
 * Returns true if items were stacked.
 *
 * @param ecs - The ECS instance
 * @param itemId1 - First item
 * @param itemId2 - Second item
 * @returns True if items were stacked, false otherwise
 *
 * @example
 * ```typescript
 * if (stackItems(ecs, potion1Id, potion2Id)) {
 *   // Items were combined, remove itemId2
 * }
 * ```
 */
export function stackItems(
  ecs: ECS,
  itemId1: number,
  itemId2: number
): boolean {
  const item1 = ecs.getComponent<ItemComponent>(itemId1, 'item');
  const item2 = ecs.getComponent<ItemComponent>(itemId2, 'item');

  if (!item1 || !item2 || !item1.stackable || !item2.stackable) {
    return false;
  }

  // Check if items match
  if (
    item1.id === item2.id &&
    item1.quality === item2.quality &&
    item1.blessState === item2.blessState &&
    item1.identified === item2.identified
  ) {
    // Stack items
    item1.quantity += item2.quantity;
    return true;
  }

  return false;
}
