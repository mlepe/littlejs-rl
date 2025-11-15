/*
 * File: item.ts
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
 * Item types for categorization
 */
export type ItemType =
  | 'weapon'
  | 'armor'
  | 'consumable'
  | 'potion'
  | 'scroll'
  | 'rod'
  | 'food'
  | 'material'
  | 'quest'
  | 'misc';

/**
 * Item blessed/cursed state
 * - blessed: Improved stats, positive effects
 * - normal: Standard item
 * - cursed: Worse stats, can't unequip without curse removal
 */
export type ItemBlessState = 'blessed' | 'normal' | 'cursed';

/**
 * Item identification level
 * - unidentified: Completely unknown (e.g., "blue potion")
 * - partial: Basic type known (e.g., "iron sword" but not +1 or blessed)
 * - identified: Fully identified with all properties
 */
export type ItemIdentificationLevel = 'unidentified' | 'partial' | 'identified';

/**
 * Equipment slot types for equippable items
 * Designed to support future dismemberment system with individual slots
 */
export type EquipmentSlot =
  | 'head'
  | 'face'
  | 'neck'
  | 'body'
  | 'shoulder-left'
  | 'shoulder-right'
  | 'wrist-left'
  | 'wrist-right'
  | 'hand-left'
  | 'hand-right'
  | 'main-hand'
  | 'off-hand'
  | 'ring-left'
  | 'ring-right'
  | 'back'
  | 'belt'
  | 'legs'
  | 'feet';

/**
 * Item material types (affects stats and properties)
 */
export type ItemMaterial =
  | 'iron'
  | 'steel'
  | 'silver'
  | 'mithril'
  | 'wood'
  | 'leather'
  | 'cloth'
  | 'crystal'
  | 'bone'
  | 'unknown';

/**
 * Item component - represents a single item instance
 *
 * Items can be:
 * - Unidentified, partially identified, or fully identified
 * - Blessed (improved stats), normal, or cursed (worse stats, can't unequip)
 * - Stackable (similar items combine) or unique
 * - Different quality levels (0 = basic, +1, +2, etc.)
 * - Equipped in various body slots
 *
 * @example
 * ```typescript
 * const sword: ItemComponent = {
 *   id: 'iron_sword_001',
 *   name: 'Iron Sword',
 *   description: 'A basic iron sword',
 *   weight: 5.0,
 *   value: 50,
 *   itemType: 'weapon',
 *   identified: 'partial',
 *   blessState: 'normal',
 *   stackable: false,
 *   quantity: 1,
 *   quality: 1,
 *   material: 'iron',
 *   equipSlot: 'main-hand',
 *   equipped: false
 * };
 * ```
 */
export interface ItemComponent {
  /**
   * Unique identifier for this item instance
   */
  readonly id: string;

  /**
   * Display name (may show generic name if unidentified)
   */
  name: string;

  /**
   * Item description (may be hidden if unidentified)
   */
  description: string;

  /**
   * Weight in pounds (affects carry capacity)
   */
  weight: number;

  /**
   * Base value in gold pieces
   */
  value: number;

  /**
   * Item category
   */
  itemType: ItemType;

  /**
   * Identification level
   */
  identified: ItemIdentificationLevel;

  /**
   * Blessed/cursed state (affects stats and equipability)
   */
  blessState: ItemBlessState;

  /**
   * Whether similar items can stack together
   */
  stackable: boolean;

  /**
   * Quantity in stack (only used if stackable)
   */
  quantity: number;

  /**
   * Quality level: 0 = basic, +1, +2, etc. (affects stats)
   */
  quality: number;

  /**
   * Material the item is made of (affects stats)
   */
  material: ItemMaterial;

  /**
   * Optional equipment slot if item is equippable
   */
  equipSlot?: EquipmentSlot;

  /**
   * Whether item is currently equipped
   */
  equipped?: boolean;

  /**
   * Whether the item can be broken (durability system placeholder)
   */
  canBreak?: boolean;

  /**
   * Whether the item is currently broken
   */
  broken?: boolean;
}
