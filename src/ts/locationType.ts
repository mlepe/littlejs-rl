/*
 * File: locationType.ts
 * Project: littlejs-rl
 * File Created: Thursday, 14th November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 14th November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

/**
 * Location types - Different structural types of locations
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
 * Biome types - Different environmental themes
 */
export enum BiomeType {
  /** Temperate forest with trees and vegetation */
  FOREST = 'forest',
  /** Rocky mountains with cliffs and caves */
  MOUNTAIN = 'mountain',
  /** Snowy tundra with ice and frost */
  SNOWY = 'snowy',
  /** Barren wasteland with sparse vegetation */
  BARREN = 'barren',
  /** Sandy desert with dunes and oases */
  DESERT = 'desert',
  /** Coastal beach area */
  BEACH = 'beach',
  /** Water body (sea, lake, or river) */
  WATER = 'water',
  /** Volcanic area with lava and ash */
  VOLCANIC = 'volcanic',
  /** Swamp with murky water and vegetation */
  SWAMP = 'swamp',
}

/**
 * Biome visual properties - Colors and palette for each biome
 */
export interface BiomePalette {
  /** Primary floor/ground color */
  floor: LJS.Color;
  /** Primary wall/boundary color */
  wall: LJS.Color;
  /** Accent color for special tiles */
  accent: LJS.Color;
  /** Water color (if applicable) */
  water?: LJS.Color;
  /** Vegetation color (if applicable) */
  vegetation?: LJS.Color;
}

/**
 * Get color palette for a specific biome
 * @param biome - The biome type
 * @returns Color palette for the biome
 */
export function getBiomePalette(biome: BiomeType): BiomePalette {
  switch (biome) {
    case BiomeType.FOREST:
      return {
        floor: LJS.rgb(0.3, 0.5, 0.2), // Dark green
        wall: LJS.rgb(0.4, 0.3, 0.2), // Brown
        accent: LJS.rgb(0.5, 0.7, 0.3), // Light green
        water: LJS.rgb(0.2, 0.4, 0.6), // Blue
        vegetation: LJS.rgb(0.2, 0.6, 0.2), // Bright green
      };

    case BiomeType.MOUNTAIN:
      return {
        floor: LJS.rgb(0.4, 0.4, 0.4), // Gray stone
        wall: LJS.rgb(0.3, 0.3, 0.35), // Dark gray
        accent: LJS.rgb(0.5, 0.5, 0.6), // Light gray
        water: LJS.rgb(0.3, 0.5, 0.7), // Mountain stream blue
      };

    case BiomeType.SNOWY:
      return {
        floor: LJS.rgb(0.9, 0.9, 0.95), // White snow
        wall: LJS.rgb(0.7, 0.8, 0.9), // Light blue ice
        accent: LJS.rgb(0.8, 0.85, 0.95), // Pale blue
        water: LJS.rgb(0.5, 0.7, 0.9), // Icy water
      };

    case BiomeType.BARREN:
      return {
        floor: LJS.rgb(0.5, 0.4, 0.3), // Brown dirt
        wall: LJS.rgb(0.4, 0.35, 0.3), // Dark brown
        accent: LJS.rgb(0.6, 0.5, 0.4), // Light brown
      };

    case BiomeType.DESERT:
      return {
        floor: LJS.rgb(0.9, 0.8, 0.5), // Yellow sand
        wall: LJS.rgb(0.7, 0.6, 0.4), // Sandstone
        accent: LJS.rgb(0.95, 0.85, 0.6), // Light sand
        water: LJS.rgb(0.3, 0.6, 0.8), // Oasis water
      };

    case BiomeType.BEACH:
      return {
        floor: LJS.rgb(0.9, 0.85, 0.7), // Light sand
        wall: LJS.rgb(0.6, 0.5, 0.4), // Rocks
        accent: LJS.rgb(0.95, 0.9, 0.8), // Pale sand
        water: LJS.rgb(0.2, 0.5, 0.8), // Ocean blue
      };

    case BiomeType.WATER:
      return {
        floor: LJS.rgb(0.2, 0.4, 0.7), // Deep water
        wall: LJS.rgb(0.3, 0.3, 0.4), // Underwater rocks
        accent: LJS.rgb(0.3, 0.5, 0.8), // Light water
        water: LJS.rgb(0.2, 0.45, 0.75), // Water
      };

    case BiomeType.VOLCANIC:
      return {
        floor: LJS.rgb(0.3, 0.2, 0.2), // Dark volcanic rock
        wall: LJS.rgb(0.2, 0.15, 0.15), // Black obsidian
        accent: LJS.rgb(0.9, 0.3, 0.1), // Orange lava glow
        water: LJS.rgb(1.0, 0.4, 0.0), // Lava
      };

    case BiomeType.SWAMP:
      return {
        floor: LJS.rgb(0.3, 0.4, 0.2), // Muddy ground
        wall: LJS.rgb(0.2, 0.3, 0.2), // Dark vegetation
        accent: LJS.rgb(0.4, 0.5, 0.3), // Moss
        water: LJS.rgb(0.2, 0.3, 0.2), // Murky water
        vegetation: LJS.rgb(0.3, 0.5, 0.2), // Swamp vegetation
      };

    default:
      // Default to neutral colors
      return {
        floor: LJS.rgb(0.5, 0.5, 0.5),
        wall: LJS.rgb(0.3, 0.3, 0.3),
        accent: LJS.rgb(0.7, 0.7, 0.7),
      };
  }
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
 * Complete metadata for a location
 */
export interface LocationMetadata {
  /** Type of location structure */
  locationType: LocationType;
  /** Environmental biome */
  biome: BiomeType;
  /** Visual color palette */
  palette: BiomePalette;
  /** Generation properties */
  properties: LocationTypeProperties;
  /** Optional custom name */
  name?: string;
  /** Difficulty level (1-10) */
  difficultyLevel?: number;
}

/**
 * Create location metadata with defaults
 * @param locationType - Type of location
 * @param biome - Biome type
 * @param name - Optional custom name
 * @param difficultyLevel - Optional difficulty level
 * @returns Complete location metadata
 */
export function createLocationMetadata(
  locationType: LocationType,
  biome: BiomeType,
  name?: string,
  difficultyLevel?: number
): LocationMetadata {
  return {
    locationType,
    biome,
    palette: getBiomePalette(biome),
    properties: getLocationTypeProperties(locationType),
    name,
    difficultyLevel,
  };
}
