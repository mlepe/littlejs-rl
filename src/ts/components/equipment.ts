/*
 * File: equipment.ts
 * Project: littlejs-rl
 * File Created: Friday, 15th November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Friday, 15th November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

/**
 * Equipment component tracking all equipped items on an entity
 *
 * Supports 18 body slots for detailed equipment management:
 * - Head: helmets, hoods, crowns
 * - Face: masks, visors
 * - Neck: amulets, necklaces
 * - Body: armor, robes, shirts
 * - Shoulders (left/right): pauldrons
 * - Wrists (left/right): bracers, bracelets
 * - Hands (left/right): gloves
 * - Main-hand: primary weapon
 * - Off-hand: shields, secondary weapon, torch
 * - Rings (left/right): magic rings
 * - Back: cloaks, capes
 * - Belt: belts with pouches
 * - Legs: pants, greaves
 * - Feet: boots, shoes
 *
 * Each slot stores the entity ID of the equipped item, or undefined if empty.
 * Items with blessState='cursed' cannot be unequipped without curse removal.
 *
 * @example
 * ```typescript
 * const equipment = ecs.getComponent<EquipmentComponent>(playerId, 'equipment');
 * if (equipment.mainHand !== undefined) {
 *   // Player has weapon equipped
 * }
 * ```
 */
export interface EquipmentComponent {
  /** Helmet, hood, crown */
  head?: number;

  /** Mask, visor */
  face?: number;

  /** Amulet, necklace */
  neck?: number;

  /** Chest armor, robe, shirt */
  body?: number;

  /** Left shoulder armor, pauldron */
  shoulderLeft?: number;

  /** Right shoulder armor, pauldron */
  shoulderRight?: number;

  /** Left wrist bracer, bracelet */
  wristLeft?: number;

  /** Right wrist bracer, bracelet */
  wristRight?: number;

  /** Left glove, gauntlet */
  handLeft?: number;

  /** Right glove, gauntlet */
  handRight?: number;

  /** Primary weapon */
  mainHand?: number;

  /** Shield, secondary weapon, torch */
  offHand?: number;

  /** Left ring */
  ringLeft?: number;

  /** Right ring */
  ringRight?: number;

  /** Cloak, cape */
  back?: number;

  /** Belt with pouches */
  belt?: number;

  /** Leg armor, pants, greaves */
  legs?: number;

  /** Boots, shoes */
  feet?: number;
}
