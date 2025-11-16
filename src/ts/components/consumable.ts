/*
 * File: consumable.ts
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
 * Effect types that can be applied when consuming an item
 */
export type ConsumableEffect =
  | 'heal' // Restore health
  | 'restore_mana' // Restore mana/magic points
  | 'cure_poison' // Remove poison status
  | 'cure_curse' // Remove curse from item or entity
  | 'identify' // Identify item(s)
  | 'teleport' // Random or targeted teleportation
  | 'damage' // Deal damage (offensive scrolls/potions)
  | 'buff_strength' // Temporary stat boost
  | 'buff_dexterity'
  | 'buff_intelligence'
  | 'buff_speed'
  | 'buff_defense'
  | 'bless' // Bless an item
  | 'curse' // Curse an item (cursed scrolls)
  | 'summon' // Summon creature/ally
  | 'reveal_map' // Reveal fog of war
  | 'custom'; // Custom effect (handled by game logic)

/**
 * Consumable component defines items that can be used/consumed
 *
 * Consumables include:
 * - Potions (heal, mana, buffs)
 * - Scrolls (spells, identification, teleportation)
 * - Food (restore hunger, buffs)
 * - Rods/wands (offensive/utility magic)
 *
 * Effects can be:
 * - Instant (health potion, identification scroll)
 * - Duration-based (buff potions, status effects)
 * - Targeted (offensive scrolls, curse removal)
 *
 * @example
 * ```typescript
 * const consumable = ecs.getComponent<ConsumableComponent>(potionId, 'consumable');
 * if (consumable.effect === 'heal') {
 *   applyHealing(userId, consumable.power);
 *   if (consumable.consumeOnUse) {
 *     removeFromInventory(userId, potionId);
 *   }
 * }
 * ```
 */
export interface ConsumableComponent {
  /**
   * Type of effect applied when consumed
   * Determines what happens when the item is used
   */
  effect: ConsumableEffect;

  /**
   * Magnitude of the effect
   * Interpretation depends on effect type:
   * - heal: HP restored (50 = restore 50 HP)
   * - buff_strength: Stat bonus amount (+5 strength)
   * - damage: Damage dealt (30 = deal 30 damage)
   * - duration: Duration in seconds for timed effects
   */
  power: number;

  /**
   * Duration of effect in seconds (for buffs/debuffs)
   * - undefined or 0: Instant effect
   * - > 0: Temporary effect lasting this many seconds
   */
  duration?: number;

  /**
   * Whether the item requires a target
   * - false: Self-targeted (health potion, buff)
   * - true: Requires selecting target (offensive scroll, curse removal)
   */
  requiresTarget: boolean;

  /**
   * Range for targeted effects (in tiles)
   * - undefined: Self or adjacent only
   * - > 0: Can target within this range
   */
  targetRange?: number;

  /**
   * Area of effect radius (in tiles)
   * - undefined or 0: Single target
   * - > 0: Affects all entities within radius of target
   */
  areaOfEffect?: number;

  /**
   * Whether the item is consumed/destroyed on use
   * - true: Single use (most potions, scrolls)
   * - false: Multiple uses (rods with charges, reusable items)
   */
  consumeOnUse: boolean;

  /**
   * Custom effect identifier for special mechanics
   * Used when effect === 'custom' for game-specific logic
   */
  customEffect?: string;
}
