/*
 * File: equipment.ts
 * Project: littlejs-rl
 * File Created: Thursday, 14th November 2025 9:59:17 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 14th November 2025 9:59:17 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { EquipmentSlot } from './equipmentSlot';

/**
 * Equipment component - Tracks equipped items for a character
 * 
 * Maps equipment slots to item entity IDs.
 * Each slot is identified by type + index (e.g., "handHeld:0" for main hand).
 */
export interface EquipmentComponent {
  /** Available equipment slots for this character */
  slots: EquipmentSlot[];
  /** Map of slot key (type:index) to item entity ID */
  equipped: Map<string, number>;
}

/**
 * Helper function to create slot key
 */
export function getSlotKey(type: string, index: number): string {
  return `${type}:${index}`;
}
