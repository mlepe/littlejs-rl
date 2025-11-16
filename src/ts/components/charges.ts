/*
 * File: charges.ts
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
 * Charges component tracks limited-use items like rods, wands, and scrolls
 *
 * Items with charges can be used a limited number of times before:
 * - Being depleted (scrolls disappear)
 * - Needing recharge (rods/wands become unusable)
 * - Breaking (special event)
 *
 * Recharging mechanics:
 * - Some items recharge over time (passive regeneration)
 * - Some require special actions (rest at inn, visit shrine)
 * - Some can be recharged with scrolls/NPCs (for a cost)
 *
 * @example
 * ```typescript
 * const charges = ecs.getComponent<ChargesComponent>(rodId, 'charges');
 * if (charges.current > 0) {
 *   // Use the item
 *   charges.current--;
 *   if (charges.current === 0 && charges.deleteWhenEmpty) {
 *     // Remove from inventory
 *   }
 * }
 * ```
 */
export interface ChargesComponent {
  /**
   * Current number of charges remaining
   * When 0, item cannot be used (unless rechargeable)
   */
  current: number;

  /**
   * Maximum number of charges the item can hold
   * Used for recharging mechanics and UI display
   */
  max: number;

  /**
   * Whether the item is deleted when charges reach 0
   * - true: Scrolls, single-use consumables (destroyed on use)
   * - false: Rods, wands (remain but unusable until recharged)
   */
  deleteWhenEmpty: boolean;

  /**
   * Whether the item can be recharged
   * - true: Rods, wands (can visit NPCs or use recharge scrolls)
   * - false: Scrolls (single-use, cannot be recharged)
   */
  rechargeable: boolean;

  /**
   * Passive recharge rate per second (optional)
   * - undefined or 0: No passive recharge
   * - > 0: Automatically regains charges over time
   * Useful for special magic items that regenerate
   */
  rechargeRate?: number;

  /**
   * Accumulated recharge progress (for passive regeneration)
   * When >= 1.0, gain 1 charge and subtract 1.0
   * Only used if rechargeRate > 0
   */
  rechargeProgress?: number;
}
