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
 * Inventory component - manages entity's carried items
 *
 * Key features:
 * - No item count limit (only weight-based)
 * - Automatic stacking of similar items
 * - Weight capacity based on strength stat (stored in DerivedStats)
 * - Tracks total current weight
 *
 * @example
 * ```typescript
 * const inventory: InventoryComponent = {
 *   items: [itemId1, itemId2, itemId3],
 *   currentWeight: 25.5,
 * };
 * ```
 */
export interface InventoryComponent {
  /**
   * Array of item entity IDs
   * No limit on count, only limited by weight capacity
   */
  items: number[];

  /**
   * Current total weight of all items
   * Calculated by summing item weights * quantities
   */
  currentWeight: number;
}
