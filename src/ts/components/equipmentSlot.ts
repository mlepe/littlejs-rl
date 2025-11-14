/*
 * File: equipmentSlot.ts
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
 * Equipment slot types based on body parts
 * 
 * Design supports future expansion for multi-headed, multi-armed creatures:
 * - Regular characters have 1 head, 2 arms, 2 legs
 * - Each slot can have multiple sub-slots (e.g., 2 hand slots for 2 arms)
 */
export enum EquipmentSlotType {
  HEAD = 'head',           // Helmets
  FACE = 'face',           // Masks
  NECK = 'neck',           // Necklaces, amulets
  BODY = 'body',           // Main armor
  SHOULDERS = 'shoulders', // Shoulder pads (2 slots for regular)
  WRISTS = 'wrists',       // Bracelets, vambraces (2 slots)
  HANDS = 'hands',         // Gloves, gauntlets (2 slots)
  HAND_HELD = 'handHeld',  // Weapons, shields (2 slots: main + off)
  RINGS = 'rings',         // Rings (2 slots)
  BACK = 'back',           // Cloaks, backpacks
  BELT = 'belt',           // Belts
  LEGS = 'legs',           // Pants (1 slot per 2 legs)
  FEET = 'feet',           // Shoes (1 slot per 2 feet)
}

/**
 * Equipment slot descriptor
 * Describes a specific slot instance (e.g., "left hand", "right shoulder")
 */
export interface EquipmentSlot {
  /** Type of equipment slot */
  type: EquipmentSlotType;
  /** Sub-slot index (e.g., 0 for left, 1 for right) */
  index: number;
  /** Display name (e.g., "Left Hand", "Main Hand") */
  displayName: string;
}

/**
 * Standard equipment slots for a regular humanoid character
 * (1 head, 2 arms, 2 legs)
 */
export const STANDARD_HUMANOID_SLOTS: EquipmentSlot[] = [
  { type: EquipmentSlotType.HEAD, index: 0, displayName: 'Head' },
  { type: EquipmentSlotType.FACE, index: 0, displayName: 'Face' },
  { type: EquipmentSlotType.NECK, index: 0, displayName: 'Neck' },
  { type: EquipmentSlotType.BODY, index: 0, displayName: 'Body' },
  { type: EquipmentSlotType.SHOULDERS, index: 0, displayName: 'Left Shoulder' },
  { type: EquipmentSlotType.SHOULDERS, index: 1, displayName: 'Right Shoulder' },
  { type: EquipmentSlotType.WRISTS, index: 0, displayName: 'Left Wrist' },
  { type: EquipmentSlotType.WRISTS, index: 1, displayName: 'Right Wrist' },
  { type: EquipmentSlotType.HANDS, index: 0, displayName: 'Left Hand' },
  { type: EquipmentSlotType.HANDS, index: 1, displayName: 'Right Hand' },
  { type: EquipmentSlotType.HAND_HELD, index: 0, displayName: 'Main Hand' },
  { type: EquipmentSlotType.HAND_HELD, index: 1, displayName: 'Off Hand' },
  { type: EquipmentSlotType.RINGS, index: 0, displayName: 'Left Ring' },
  { type: EquipmentSlotType.RINGS, index: 1, displayName: 'Right Ring' },
  { type: EquipmentSlotType.BACK, index: 0, displayName: 'Back' },
  { type: EquipmentSlotType.BELT, index: 0, displayName: 'Belt' },
  { type: EquipmentSlotType.LEGS, index: 0, displayName: 'Legs' },
  { type: EquipmentSlotType.FEET, index: 0, displayName: 'Feet' },
];
