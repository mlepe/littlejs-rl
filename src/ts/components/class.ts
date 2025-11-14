/*
 * File: class.ts
 * Project: littlejs-rl
 * File Created: Thursday, 14th November 2025 11:45:00 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 14th November 2025 11:45:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

/**
 * Class Component - Defines an entity's character class
 *
 * Classes provide:
 * - Stat modifiers that scale with level
 * - Class-specific abilities and skills
 * - Progression through experience and leveling
 *
 * Note: Only 'character' type entities have classes.
 * Creatures (beasts, animals) do not have classes.
 * Stat modifiers are applied by classSystem, not stored here.
 */
export interface ClassComponent {
  /** Unique class identifier (e.g., "warrior", "mage", "thief") */
  classId: string;

  /** Display name of the class */
  className: string;

  /** Current class level (starts at 1) */
  level: number;

  /** Current experience points */
  experience: number;

  /** XP needed to reach next level */
  experienceToNextLevel: number;

  /** Class abilities/skills this entity has learned (IDs) */
  abilities?: string[];
}
