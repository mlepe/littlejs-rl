/*
 * File: carryWeightSystem.ts
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
  StatsComponent,
} from '../components';

/**
 * Calculate total weight of all items in inventory
 */
export function calculateInventoryWeight(
  ecs: ECS,
  entityId: number
): number {
  const inventory = ecs.getComponent<InventoryComponent>(
    entityId,
    'inventory'
  );
  if (!inventory) return 0;

  let totalWeight = 0;

  for (const itemId of inventory.items) {
    const weight = ecs.getComponent<WeightComponent>(itemId, 'weight');
    if (!weight) continue;

    // Account for stacking - multiply weight by quantity
    const stackable = ecs.getComponent<StackableComponent>(itemId, 'stackable');
    const quantity = stackable ? stackable.quantity : 1;

    totalWeight += weight.weight * quantity;
  }

  return totalWeight;
}

/**
 * Update inventory's current weight
 */
export function updateInventoryWeight(ecs: ECS, entityId: number): void {
  const inventory = ecs.getComponent<InventoryComponent>(
    entityId,
    'inventory'
  );
  if (!inventory) return;

  inventory.currentWeight = calculateInventoryWeight(ecs, entityId);
}

/**
 * Calculate max carry weight based on strength
 * Formula: baseCarryWeight + (strength * strengthMultiplier)
 */
export function calculateMaxCarryWeight(
  baseCarryWeight: number,
  strength: number,
  strengthMultiplier: number = 5
): number {
  return baseCarryWeight + strength * strengthMultiplier;
}

/**
 * Update entity's max carry weight based on their stats
 */
export function updateMaxCarryWeight(
  ecs: ECS,
  entityId: number,
  baseCarryWeight: number = 100
): void {
  const inventory = ecs.getComponent<InventoryComponent>(
    entityId,
    'inventory'
  );
  const stats = ecs.getComponent<StatsComponent>(entityId, 'stats');

  if (!inventory || !stats) return;

  inventory.maxCarryWeight = calculateMaxCarryWeight(
    baseCarryWeight,
    stats.base.strength
  );
}

/**
 * Check if entity can carry additional weight
 */
export function canCarryWeight(
  ecs: ECS,
  entityId: number,
  additionalWeight: number
): boolean {
  const inventory = ecs.getComponent<InventoryComponent>(
    entityId,
    'inventory'
  );
  if (!inventory) return false;

  return inventory.currentWeight + additionalWeight <= inventory.maxCarryWeight;
}

/**
 * Check if entity is overencumbered
 */
export function isOverencumbered(ecs: ECS, entityId: number): boolean {
  const inventory = ecs.getComponent<InventoryComponent>(
    entityId,
    'inventory'
  );
  if (!inventory) return false;

  return inventory.currentWeight > inventory.maxCarryWeight;
}

/**
 * Get carry weight status (percentage used)
 */
export function getCarryWeightPercentage(ecs: ECS, entityId: number): number {
  const inventory = ecs.getComponent<InventoryComponent>(
    entityId,
    'inventory'
  );
  if (!inventory || inventory.maxCarryWeight === 0) return 0;

  return (inventory.currentWeight / inventory.maxCarryWeight) * 100;
}
