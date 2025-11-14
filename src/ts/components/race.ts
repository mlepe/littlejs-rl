/*
 * File: race.ts
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
 * Race types classify entities by their biological/species category
 */
export enum RaceType {
  /** Humanoid races: humans, elves, dwarves, orcs, goblins */
  HUMANOID = 'humanoid',
  /** Animal races: wolves, bears, rats, cats, dogs */
  BEAST = 'beast',
  /** Undead races: skeletons, zombies, vampires */
  UNDEAD = 'undead',
  /** Constructed beings: golems, animated objects */
  CONSTRUCT = 'construct',
  /** Elemental beings: fire/water/earth/air elementals */
  ELEMENTAL = 'elemental',
  /** Demonic beings: demons, devils */
  DEMON = 'demon',
  /** Celestial beings: angels, archons */
  CELESTIAL = 'celestial',
}

/**
 * Race Component - Defines an entity's race/species
 *
 * Races provide:
 * - Base stat modifiers (flat and percentage)
 * - Racial abilities and traits
 * - Classification for gameplay purposes (dialogue, faction relations, etc.)
 *
 * Note: Stat modifiers are applied by raceSystem, not stored here
 */
export interface RaceComponent {
  /** Unique race identifier (e.g., "human", "dwarf", "orc") */
  raceId: string;

  /** Display name of the race */
  raceName: string;

  /** Race category for classification */
  raceType: RaceType;

  /** Racial abilities/traits this entity has unlocked (IDs) */
  abilities?: string[];
}
