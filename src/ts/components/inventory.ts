/*
 * File: inventory.ts
 * Project: littlejs-rl
 * File Created: Thursday, 14th November 2025 9:59:17 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 14th November 2025 9:59:17 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

/**
 * Inventory component - Stores items for a character
 * 
 * No maximum item count - only limited by carry weight.
 * Items are stored as entity IDs.
 */
export interface InventoryComponent {
  /** Entity IDs of items in inventory */
  items: number[];
  /** Maximum carry weight capacity */
  maxCarryWeight: number;
  /** Current total weight of all items */
  currentWeight: number;
}
