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

import { BaseColor, getColor } from './colorPalette';

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
        floor: getColor(BaseColor.GRASS), // Dark green
        wall: getColor(BaseColor.BROWN), // Brown
        accent: getColor(BaseColor.LIME), // Light green
        water: getColor(BaseColor.WATER), // Blue
        vegetation: getColor(BaseColor.GREEN), // Bright green
      };

    case BiomeType.MOUNTAIN:
      return {
        floor: getColor(BaseColor.GRAY), // Gray stone
        wall: getColor(BaseColor.DARK_GRAY), // Dark gray
        accent: getColor(BaseColor.LIGHT_GRAY), // Light gray
        water: getColor(BaseColor.CYAN), // Mountain stream blue
      };

    case BiomeType.SNOWY:
      return {
        floor: getColor(BaseColor.WHITE), // White snow
        wall: getColor(BaseColor.CYAN), // Light blue ice
        accent: getColor(BaseColor.LIGHT_GRAY), // Pale blue
        water: getColor(BaseColor.BLUE), // Icy water
      };

    case BiomeType.BARREN:
      return {
        floor: getColor(BaseColor.BROWN), // Brown dirt
        wall: getColor(BaseColor.DARK_GRAY), // Dark brown
        accent: getColor(BaseColor.GRAY), // Light brown
      };

    case BiomeType.DESERT:
      return {
        floor: getColor(BaseColor.YELLOW), // Yellow sand
        wall: getColor(BaseColor.GOLD), // Sandstone
        accent: getColor(BaseColor.LIGHT_GRAY), // Light sand
        water: getColor(BaseColor.CYAN), // Oasis water
      };

    case BiomeType.BEACH:
      return {
        floor: getColor(BaseColor.GOLD), // Light sand
        wall: getColor(BaseColor.GRAY), // Rocks
        accent: getColor(BaseColor.LIGHT_GRAY), // Pale sand
        water: getColor(BaseColor.BLUE), // Ocean blue
      };

    case BiomeType.WATER:
      return {
        floor: getColor(BaseColor.BLUE), // Deep water
        wall: getColor(BaseColor.DARK_GRAY), // Underwater rocks
        accent: getColor(BaseColor.CYAN), // Light water
        water: getColor(BaseColor.WATER), // Water
      };

    case BiomeType.VOLCANIC:
      return {
        floor: getColor(BaseColor.DARK_GRAY), // Dark volcanic rock
        wall: getColor(BaseColor.BLACK), // Black obsidian
        accent: getColor(BaseColor.ORANGE), // Orange lava glow
        water: getColor(BaseColor.LAVA), // Lava
      };

    case BiomeType.SWAMP:
      return {
        floor: getColor(BaseColor.BROWN), // Muddy ground
        wall: getColor(BaseColor.DARK_GRAY), // Dark vegetation
        accent: getColor(BaseColor.GRASS), // Moss
        water: getColor(BaseColor.TEAL), // Murky water
        vegetation: getColor(BaseColor.GREEN), // Swamp vegetation
      };

    default:
      // Default to neutral colors
      return {
        floor: getColor(BaseColor.GRAY),
        wall: getColor(BaseColor.DARK_GRAY),
        accent: getColor(BaseColor.LIGHT_GRAY),
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
