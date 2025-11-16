/*
 * File: itemUsageSystem.ts
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
  ConsumableComponent,
  ConsumableEffect,
} from '../components/consumable';
import { identifyAllItems, identifyItem } from './identificationSystem';

import { ChargesComponent } from '../components/charges';
import ECS from '../ecs';
import { HealthComponent } from '../components/health';
import { InventoryComponent } from '../components/inventory';
import { ItemComponent } from '../components/item';
import { StatsComponent } from '../components/stats';
import { removeItem } from './inventorySystem';

/**
 * Use a consumable item
 *
 * Handles:
 * - Charge consumption
 * - Effect application
 * - Item removal/depletion
 * - Target validation
 *
 * @param ecs - The ECS instance
 * @param userId - Entity using the item
 * @param itemId - Item being used
 * @param targetId - Target entity (optional, required for targeted effects)
 * @returns True if item was successfully used, false otherwise
 *
 * @example
 * ```typescript
 * // Use health potion on self
 * if (useItem(ecs, playerId, healthPotionId)) {
 *   console.log('Potion consumed!');
 * }
 *
 * // Use offensive scroll on enemy
 * if (useItem(ecs, playerId, fireballScrollId, enemyId)) {
 *   console.log('Fireball cast!');
 * }
 * ```
 */
export function useItem(
  ecs: ECS,
  userId: number,
  itemId: number,
  targetId?: number
): boolean {
  const item = ecs.getComponent<ItemComponent>(itemId, 'item');
  const consumable = ecs.getComponent<ConsumableComponent>(
    itemId,
    'consumable'
  );

  if (!item || !consumable) {
    return false; // Not a consumable item
  }

  // Validate target requirement
  if (consumable.requiresTarget && targetId === undefined) {
    return false; // Requires target but none provided
  }

  // Check charges if item has them
  const charges = ecs.getComponent<ChargesComponent>(itemId, 'charges');
  if (charges && charges.current <= 0) {
    return false; // No charges remaining
  }

  // Use target or self
  const effectTarget = targetId !== undefined ? targetId : userId;

  // Apply the consumable effect
  const effectApplied = applyConsumableEffect(
    ecs,
    consumable.effect,
    effectTarget,
    consumable.power,
    consumable.duration,
    itemId,
    userId
  );

  if (!effectApplied) {
    return false; // Effect failed to apply
  }

  // Consume charge if item has charges
  if (charges) {
    charges.current--;

    // Remove item if depleted and marked for deletion
    if (charges.current <= 0 && charges.deleteWhenEmpty) {
      removeItem(ecs, userId, itemId, 1);
    }
  } else if (consumable.consumeOnUse) {
    // Remove non-charged consumable
    removeItem(ecs, userId, itemId, 1);
  }

  return true;
}

/**
 * Apply a consumable effect to a target
 *
 * Internal function that handles the actual effect logic.
 * Can be extended with more effect types as needed.
 *
 * @param ecs - The ECS instance
 * @param effect - Type of effect to apply
 * @param targetId - Entity receiving the effect
 * @param power - Magnitude of effect
 * @param duration - Duration in seconds (optional)
 * @param itemId - Item being used (for context)
 * @param userId - Entity using the item
 * @returns True if effect was successfully applied
 */
function applyConsumableEffect(
  ecs: ECS,
  effect: ConsumableEffect,
  targetId: number,
  power: number,
  duration?: number,
  itemId?: number,
  userId?: number
): boolean {
  switch (effect) {
    case 'heal': {
      const health = ecs.getComponent<HealthComponent>(targetId, 'health');
      if (!health) return false;

      health.current = Math.min(health.current + power, health.max);
      return true;
    }

    case 'restore_mana': {
      // TODO: Implement mana system
      // For now, just return true
      return true;
    }

    case 'identify': {
      if (itemId && userId) {
        // Identify the specific item or all items
        if (itemId) {
          return identifyItem(ecs, itemId, 'identified');
        }
      }
      return false;
    }

    case 'buff_strength':
    case 'buff_dexterity':
    case 'buff_intelligence':
    case 'buff_speed':
    case 'buff_defense': {
      // TODO: Implement stat modifier system for temporary buffs
      // For now, apply directly to base stats (permanent)
      const stats = ecs.getComponent<StatsComponent>(targetId, 'stats');
      if (!stats) return false;

      // Map effect to stat
      const statMap: Record<string, keyof typeof stats.base> = {
        buff_strength: 'strength',
        buff_dexterity: 'dexterity',
        buff_intelligence: 'intelligence',
      };

      const statKey = statMap[effect];
      if (statKey && statKey in stats.base) {
        stats.base[statKey] += power;
        // TODO: Add temporary modifier instead of permanent change
        // TODO: Use StatModifierComponent for duration-based effects
        return true;
      }
      return false;
    }

    case 'damage': {
      const health = ecs.getComponent<HealthComponent>(targetId, 'health');
      if (!health) return false;

      health.current = Math.max(0, health.current - power);
      return true;
    }

    case 'cure_poison':
    case 'cure_curse':
    case 'teleport':
    case 'bless':
    case 'curse':
    case 'summon':
    case 'reveal_map':
    case 'custom': {
      // TODO: Implement these effects
      // For now, return true as placeholder
      return true;
    }

    default: {
      return false;
    }
  }
}

/**
 * Recharge an item with charges
 *
 * Used for:
 * - NPC recharge services
 * - Recharge scrolls
 * - Rest mechanics (inn, campfire)
 * - Passive regeneration (handled by chargesSystem)
 *
 * @param ecs - The ECS instance
 * @param itemId - Item to recharge
 * @param amount - Number of charges to add (defaults to max)
 * @returns True if recharged successfully, false if not rechargeable
 *
 * @example
 * ```typescript
 * // Recharge rod to full
 * if (rechargeItem(ecs, rodId)) {
 *   console.log('Rod recharged to full!');
 * }
 *
 * // Add 5 charges
 * rechargeItem(ecs, wandId, 5);
 * ```
 */
export function rechargeItem(
  ecs: ECS,
  itemId: number,
  amount?: number
): boolean {
  const charges = ecs.getComponent<ChargesComponent>(itemId, 'charges');

  if (!charges || !charges.rechargeable) {
    return false; // Not rechargeable
  }

  if (amount !== undefined) {
    // Add specific amount
    charges.current = Math.min(charges.current + amount, charges.max);
  } else {
    // Recharge to full
    charges.current = charges.max;
  }

  return true;
}

/**
 * Process passive charge regeneration
 *
 * Automatically recharges items with rechargeRate > 0 over time.
 * Call this system every frame in game update loop.
 *
 * @param ecs - The ECS instance
 *
 * @example
 * ```typescript
 * function gameUpdate() {
 *   inputSystem(ecs);
 *   playerMovementSystem(ecs);
 *   chargesSystem(ecs); // Passive recharge
 *   identificationSystem(ecs);
 *   aiSystem(ecs, playerId);
 * }
 * ```
 */
export function chargesSystem(ecs: ECS): void {
  // Get all entities with charges (items are entities)
  const itemEntities = ecs.query('item', 'charges');

  for (const itemId of itemEntities) {
    const charges = ecs.getComponent<ChargesComponent>(itemId, 'charges');

    if (!charges || !charges.rechargeable || !charges.rechargeRate) {
      continue;
    }

    // Skip if already at max
    if (charges.current >= charges.max) {
      continue;
    }

    // Accumulate recharge progress
    const progress =
      (charges.rechargeProgress || 0) + charges.rechargeRate * LJS.timeDelta;

    if (progress >= 1.0) {
      // Gain charges
      const chargesToAdd = Math.floor(progress);
      charges.current = Math.min(charges.current + chargesToAdd, charges.max);
      charges.rechargeProgress = progress - chargesToAdd;
    } else {
      charges.rechargeProgress = progress;
    }
  }
}

/**
 * Check if an item can be used
 *
 * Validates:
 * - Item is consumable
 * - Item is in user's inventory
 * - Item has charges (if applicable)
 * - Target is valid (if required)
 *
 * @param ecs - The ECS instance
 * @param userId - Entity trying to use the item
 * @param itemId - Item to use
 * @param targetId - Optional target entity
 * @returns True if item can be used, false otherwise
 *
 * @example
 * ```typescript
 * if (canUseItem(ecs, playerId, potionId)) {
 *   useItem(ecs, playerId, potionId);
 * }
 * ```
 */
export function canUseItem(
  ecs: ECS,
  userId: number,
  itemId: number,
  targetId?: number
): boolean {
  const consumable = ecs.getComponent<ConsumableComponent>(
    itemId,
    'consumable'
  );
  if (!consumable) {
    return false; // Not consumable
  }

  // Check item is in inventory
  const inventory = ecs.getComponent<InventoryComponent>(userId, 'inventory');
  if (!inventory || !inventory.items.includes(itemId)) {
    return false; // Not in inventory
  }

  // Check charges
  const charges = ecs.getComponent<ChargesComponent>(itemId, 'charges');
  if (charges && charges.current <= 0) {
    return false; // No charges
  }

  // Check target requirement
  if (consumable.requiresTarget && targetId === undefined) {
    return false; // Needs target
  }

  return true;
}
