/*
 * File: lootTable.ts
 * Project: littlejs-rl
 * File Created: Saturday, 16th November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Saturday, 16th November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

/**
 * Loot entry defining what can be dropped
 */
export interface LootEntry {
  /**
   * Item template ID from items data
   * e.g., "health_potion", "iron_sword", "gold_coin"
   */
  itemId: string;

  /**
   * Drop chance (0.0 to 1.0)
   * - 1.0 = 100% always drops
   * - 0.5 = 50% chance
   * - 0.01 = 1% rare drop
   */
  dropChance: number;

  /**
   * Minimum quantity to drop (if item drops)
   */
  minQuantity: number;

  /**
   * Maximum quantity to drop (if item drops)
   */
  maxQuantity: number;

  /**
   * Quality range for generated items (optional)
   * Random quality between min and max will be applied
   */
  qualityRange?: {
    min: number;
    max: number;
  };

  /**
   * Chance for item to be blessed (0.0 to 1.0)
   * If rolled, item gets blessState='blessed'
   */
  blessChance?: number;

  /**
   * Chance for item to be cursed (0.0 to 1.0)
   * If rolled, item gets blessState='cursed'
   */
  curseChance?: number;
}

/**
 * Loot table component defining what an entity drops on death
 *
 * Loot tables support:
 * - Multiple item types with different drop chances
 * - Quantity ranges (e.g., 5-20 gold coins)
 * - Quality randomization (e.g., +0 to +2 quality)
 * - Blessed/cursed item generation
 * - Guaranteed drops (100% chance items)
 *
 * @example
 * ```typescript
 * const loot = ecs.getComponent<LootTableComponent>(enemyId, 'lootTable');
 * // On death, roll for each loot entry
 * for (const entry of loot.entries) {
 *   if (Math.random() < entry.dropChance) {
 *     // Generate item with random quantity
 *     const quantity = randomInt(entry.minQuantity, entry.maxQuantity);
 *     spawnItem(entry.itemId, quantity);
 *   }
 * }
 * ```
 */
export interface LootTableComponent {
  /**
   * List of possible loot drops
   * Each entry is rolled independently on entity death
   */
  entries: LootEntry[];

  /**
   * Loot table ID for loading from data files
   * e.g., "goblin_loot", "boss_treasure", "chest_common"
   */
  tableId?: string;

  /**
   * Multiplier applied to drop chances (optional)
   * - 1.0 = Normal drop rates
   * - 2.0 = Double drop chances (boss variants, lucky player)
   * - 0.5 = Half drop chances (poor/weak enemies)
   */
  dropChanceMultiplier?: number;

  /**
   * Multiplier applied to quantities (optional)
   * - 1.0 = Normal quantities
   * - 2.0 = Double quantities (generous drops)
   * - 0.5 = Half quantities (stingy enemies)
   */
  quantityMultiplier?: number;
}
