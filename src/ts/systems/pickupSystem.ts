/*
 * File: pickupSystem.ts
 * Project: littlejs-rl
 * File Created: Saturday, 16th November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Saturday, 16th November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { addItem, canAddItem, getItemWeight } from './inventorySystem';

import ECS from '../ecs';
import { InputComponent } from '../components/input';
import { ItemComponent } from '../components/item';
import { LocationComponent } from '../components/locationComponent';
import { PositionComponent } from '../components/position';
import { getItemsAtPosition } from './lootSystem';

/**
 * Pickup system that handles player picking up items from the ground
 *
 * When a player presses the pickup key (G):
 * 1. Finds all items at player's position
 * 2. Attempts to add each item to player's inventory
 * 3. Removes items from ground (removes position/location components)
 * 4. Logs pickup messages
 *
 * @param ecs - The ECS instance
 *
 * @example
 * ```typescript
 * // In game update loop (after input system)
 * inputSystem(ecs);
 * pickupSystem(ecs);
 * ```
 */
export function pickupSystem(ecs: ECS): void {
  const playerEntities = ecs.query(
    'player',
    'input',
    'position',
    'location',
    'inventory'
  );

  for (const playerId of playerEntities) {
    const input = ecs.getComponent<InputComponent>(playerId, 'input');
    const playerPos = ecs.getComponent<PositionComponent>(playerId, 'position');
    const playerLoc = ecs.getComponent<LocationComponent>(playerId, 'location');

    if (!input || !playerPos || !playerLoc) continue;

    // Check if pickup key was pressed
    if (input.pickup) {
      console.log(
        `[Pickup] Attempting pickup at (${Math.floor(playerPos.x)}, ${Math.floor(playerPos.y)}) in location (${playerLoc.worldX}, ${playerLoc.worldY})`
      );

      // Reset pickup flag now that we're processing it
      input.pickup = false;

      // Get all items at player's position
      const itemsAtPosition = getItemsAtPosition(
        ecs,
        Math.floor(playerPos.x),
        Math.floor(playerPos.y),
        playerLoc.worldX,
        playerLoc.worldY
      );

      console.log(
        `[Pickup] Found ${itemsAtPosition.length} item(s) at position`
      );

      if (itemsAtPosition.length === 0) {
        console.log('[Pickup] Nothing to pick up here.');
        continue;
      }

      // Attempt to pick up each item
      let pickedUpCount = 0;
      let totalItems = itemsAtPosition.length;

      for (const itemId of itemsAtPosition) {
        const item = ecs.getComponent<ItemComponent>(itemId, 'item');
        if (!item) continue;

        // Check if player can carry this item
        if (!canAddItem(ecs, playerId, itemId)) {
          const itemWeight = getItemWeight(item);
          console.log(
            `Cannot pick up ${item.name} - inventory full (weight: ${itemWeight})`
          );
          continue;
        }

        // Add to inventory
        if (addItem(ecs, playerId, itemId)) {
          // Remove from ground (remove position and location components)
          ecs.removeComponent(itemId, 'position');
          ecs.removeComponent(itemId, 'location');

          console.log(
            `Picked up: ${item.name}${item.quantity > 1 ? ` (x${item.quantity})` : ''}`
          );
          pickedUpCount++;
        }
      }

      if (pickedUpCount > 0) {
        console.log(`Picked up ${pickedUpCount}/${totalItems} item(s)`);
      }
    }
  }
}
