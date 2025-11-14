/*
 * File: equippable.ts
 * Project: littlejs-rl
 * File Created: Thursday, 14th November 2025 9:59:17 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 14th November 2025 9:59:17 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { EquipmentSlotType } from './equipmentSlot';

/**
 * Equippable component - Items that can be equipped
 */
export interface EquippableComponent {
  /** Which slot type this item can be equipped to */
  slotType: EquipmentSlotType;
  /** Whether the item is currently equipped */
  isEquipped: boolean;
  /** Entity ID of the character who has this equipped (if any) */
  equippedBy?: number;
  /** Specific slot index where equipped (if equipped) */
  equippedSlotIndex?: number;
}
