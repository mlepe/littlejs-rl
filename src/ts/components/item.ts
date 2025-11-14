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
 * Item types in the game
 */
export enum ItemType {
  WEAPON = 'weapon',
  ARMOR = 'armor',
  CONSUMABLE = 'consumable',
  SCROLL = 'scroll',
  POTION = 'potion',
  ROD = 'rod',
  FOOD = 'food',
  MATERIAL = 'material',
  MISC = 'misc',
}

/**
 * Item rarity/state
 */
export enum ItemState {
  NORMAL = 'normal',
  BLESSED = 'blessed',
  CURSED = 'cursed',
}

/**
 * Item material types
 */
export enum ItemMaterial {
  IRON = 'iron',
  STEEL = 'steel',
  SILVER = 'silver',
  MITHRIL = 'mithril',
  WOOD = 'wood',
  LEATHER = 'leather',
  CLOTH = 'cloth',
  CRYSTAL = 'crystal',
  BONE = 'bone',
  UNKNOWN = 'unknown',
}

/**
 * Core item component - Base data for all items
 */
export interface ItemComponent {
  /** Display name of the item */
  name: string;
  /** Type of item */
  type: ItemType;
  /** Description of the item */
  description: string;
  /** Item state (normal, blessed, cursed) */
  state: ItemState;
  /** Material the item is made of */
  material: ItemMaterial;
  /** Whether the item is broken */
  isBroken: boolean;
  /** Item value in currency */
  value: number;
}
