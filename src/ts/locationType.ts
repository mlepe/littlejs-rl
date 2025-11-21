/*
 * File: locationType.ts
 * Project: littlejs-rl
 * File Created: Thursday, 14th November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 21st November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

/**
 * Location types - Different structural types of locations
 * These define HOW a location is structured, not what it looks like
 */
export enum LocationType {
  /** Standard dungeon with rooms, corridors, and monsters */
  DUNGEON = 'dungeon',
  /** Town with buildings, NPCs, and shops */
  TOWN = 'town',
  /** Ancient ruins with broken structures and treasure */
  RUINS = 'ruins',
  /** Faction base with organized layout and guards */
  FACTION_BASE = 'faction_base',
  /** Wilderness area with natural terrain */
  WILDERNESS = 'wilderness',
  /** Cave system with organic tunnels */
  CAVE = 'cave',
}

/**
 * Location generation parameters based on type
 */
export interface LocationTypeProperties {
  /** Name/description of the location type */
  readonly name: string;
  /** Typical room density (0-1, higher = more rooms) */
  readonly roomDensity: number;
  /** Typical corridor density (0-1, higher = more corridors) */
  readonly corridorDensity: number;
  /** Whether this location type has organized structure */
  readonly organized: boolean;
  /** Whether this location type typically has NPCs */
  readonly hasNPCs: boolean;
  /** Whether this location type typically has shops */
  readonly hasShops: boolean;
  /** Danger level multiplier (1.0 = normal) */
  readonly dangerMultiplier: number;
}

/**
 * Get generation properties for a location type
 * @param type - The location type
 * @returns Generation properties
 */
export function getLocationTypeProperties(
  type: LocationType
): LocationTypeProperties {
  switch (type) {
    case LocationType.DUNGEON:
      return {
        name: 'Dungeon',
        roomDensity: 0.6,
        corridorDensity: 0.7,
        organized: false,
        hasNPCs: false,
        hasShops: false,
        dangerMultiplier: 1.5,
      };

    case LocationType.TOWN:
      return {
        name: 'Town',
        roomDensity: 0.8,
        corridorDensity: 0.9, // Streets
        organized: true,
        hasNPCs: true,
        hasShops: true,
        dangerMultiplier: 0.2,
      };

    case LocationType.RUINS:
      return {
        name: 'Ruins',
        roomDensity: 0.5,
        corridorDensity: 0.4,
        organized: false,
        hasNPCs: false,
        hasShops: false,
        dangerMultiplier: 1.2,
      };

    case LocationType.FACTION_BASE:
      return {
        name: 'Faction Base',
        roomDensity: 0.7,
        corridorDensity: 0.8,
        organized: true,
        hasNPCs: true,
        hasShops: false,
        dangerMultiplier: 1.0,
      };

    case LocationType.WILDERNESS:
      return {
        name: 'Wilderness',
        roomDensity: 0.2,
        corridorDensity: 0.3,
        organized: false,
        hasNPCs: false,
        hasShops: false,
        dangerMultiplier: 0.8,
      };

    case LocationType.CAVE:
      return {
        name: 'Cave',
        roomDensity: 0.4,
        corridorDensity: 0.5,
        organized: false,
        hasNPCs: false,
        hasShops: false,
        dangerMultiplier: 1.3,
      };

    default:
      return {
        name: 'Unknown',
        roomDensity: 0.5,
        corridorDensity: 0.5,
        organized: false,
        hasNPCs: false,
        hasShops: false,
        dangerMultiplier: 1.0,
      };
  }
}

/**
 * @deprecated Use EnvironmentMetadata from environmentMetadata.ts instead
 * This interface is kept for backward compatibility only
 */
export interface LocationMetadata {
  /** Type of location structure */
  locationType: LocationType;
  /** Generation properties */
  properties: LocationTypeProperties;
  /** Optional custom name */
  name?: string;
  /** Difficulty level (1-10) */
  difficultyLevel?: number;
}

/**
 * Create basic location metadata (structure only, no biome)
 * @param locationType - Type of location
 * @param name - Optional custom name
 * @param difficultyLevel - Optional difficulty level
 * @returns Location metadata
 * @deprecated Use createEnvironmentMetadata from environmentMetadata.ts for full biome support
 */
export function createLocationMetadata(
  locationType: LocationType,
  name?: string,
  difficultyLevel?: number
): LocationMetadata {
  return {
    locationType,
    properties: getLocationTypeProperties(locationType),
    name,
    difficultyLevel,
  };
}
