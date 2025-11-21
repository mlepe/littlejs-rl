/*
 * File: environmentMetadata.ts
 * Project: littlejs-rl
 * File Created: Thursday, 21st November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 21st November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import {
  LocationType,
  LocationTypeProperties,
  getLocationTypeProperties,
} from './locationType';
import { BiomeType, BiomeConfig, getBiomeConfig } from './biomeConfig';

/**
 * Complete environment metadata combining location structure and biome
 * This is the unified interface for location generation
 */
export interface EnvironmentMetadata {
  /** Type of location structure (dungeon, town, cave, etc.) */
  locationType: LocationType;
  /** Environmental biome (forest, desert, snowy, etc.) */
  biome: BiomeType;
  /** Biome configuration (tiles, colors, environment) */
  biomeConfig: BiomeConfig;
  /** Location structure properties (room density, NPCs, etc.) */
  locationProperties: LocationTypeProperties;
  /** Optional custom name for this location */
  name?: string;
  /** Difficulty level (1-10) */
  difficultyLevel?: number;
  /** Special modifiers for this location */
  modifiers?: EnvironmentModifiers;
}

/**
 * Optional modifiers that can customize a location's behavior
 */
export interface EnvironmentModifiers {
  /** Spawn rate multiplier (1.0 = normal) */
  spawnRateMultiplier?: number;
  /** Treasure quality multiplier (1.0 = normal) */
  treasureMultiplier?: number;
  /** Enemy strength multiplier (1.0 = normal) */
  enemyStrengthMultiplier?: number;
  /** Visibility override (-1 to disable) */
  visibilityOverride?: number;
  /** Custom spawn table ID (for future use) */
  customSpawnTable?: string;
  /** Disable weather effects */
  disableWeather?: boolean;
  /** Force specific weather */
  forceWeather?: string;
}

/**
 * Create environment metadata with full biome support
 * @param locationType - Type of location structure
 * @param biome - Biome type
 * @param name - Optional custom name
 * @param difficultyLevel - Optional difficulty level (1-10)
 * @param modifiers - Optional environment modifiers
 * @returns Complete environment metadata
 */
export function createEnvironmentMetadata(
  locationType: LocationType,
  biome: BiomeType = BiomeType.DEFAULT,
  name?: string,
  difficultyLevel?: number,
  modifiers?: EnvironmentModifiers
): EnvironmentMetadata {
  return {
    locationType,
    biome,
    biomeConfig: getBiomeConfig(biome),
    locationProperties: getLocationTypeProperties(locationType),
    name,
    difficultyLevel,
    modifiers,
  };
}

/**
 * Get suggested biomes for a location type
 * Returns biomes that make thematic sense for a given structure type
 * @param locationType - Type of location
 * @returns Array of recommended biome types
 */
export function getSuggestedBiomesForLocationType(
  locationType: LocationType
): BiomeType[] {
  switch (locationType) {
    case LocationType.DUNGEON:
      return [
        BiomeType.UNDERGROUND,
        BiomeType.MOUNTAIN,
        BiomeType.CORRUPTED,
        BiomeType.VOLCANIC,
        BiomeType.DEFAULT,
      ];

    case LocationType.TOWN:
      return [
        BiomeType.FOREST,
        BiomeType.DESERT,
        BiomeType.SNOWY,
        BiomeType.BEACH,
        BiomeType.DEFAULT,
      ];

    case LocationType.RUINS:
      return [
        BiomeType.JUNGLE,
        BiomeType.DESERT,
        BiomeType.FOREST,
        BiomeType.SWAMP,
        BiomeType.CORRUPTED,
        BiomeType.DEFAULT,
      ];

    case LocationType.FACTION_BASE:
      return [
        BiomeType.MOUNTAIN,
        BiomeType.FOREST,
        BiomeType.DESERT,
        BiomeType.SNOWY,
        BiomeType.DEFAULT,
      ];

    case LocationType.WILDERNESS:
      return [
        BiomeType.FOREST,
        BiomeType.JUNGLE,
        BiomeType.DESERT,
        BiomeType.TUNDRA,
        BiomeType.SWAMP,
        BiomeType.BEACH,
        BiomeType.MOUNTAIN,
        BiomeType.DEFAULT,
      ];

    case LocationType.CAVE:
      return [
        BiomeType.UNDERGROUND,
        BiomeType.MOUNTAIN,
        BiomeType.VOLCANIC,
        BiomeType.BEACH,
        BiomeType.DEFAULT,
      ];

    default:
      return [BiomeType.DEFAULT];
  }
}

/**
 * Get random appropriate biome for a location type
 * @param locationType - Type of location
 * @returns Random biome that fits the location type
 */
export function getRandomBiomeForLocationType(
  locationType: LocationType
): BiomeType {
  const suggested = getSuggestedBiomesForLocationType(locationType);
  const index = Math.floor(Math.random() * suggested.length);
  return suggested[index];
}

/**
 * Calculate effective danger level based on location and biome
 * @param metadata - Environment metadata
 * @returns Effective danger multiplier
 */
export function getEffectiveDangerLevel(metadata: EnvironmentMetadata): number {
  let danger = metadata.locationProperties.dangerMultiplier;

  // Biome difficulty factors
  const biomeConfig = metadata.biomeConfig;
  switch (biomeConfig.environment.temperature) {
    case 'freezing':
    case 'scorching':
      danger *= 1.3;
      break;
    case 'cold':
    case 'hot':
      danger *= 1.1;
      break;
  }

  // Low visibility increases danger
  if (biomeConfig.environment.visibilityModifier < 0.8) {
    danger *= 1.2;
  }

  // Apply modifiers
  if (metadata.modifiers?.enemyStrengthMultiplier) {
    danger *= metadata.modifiers.enemyStrengthMultiplier;
  }

  // Apply difficulty level
  if (metadata.difficultyLevel) {
    danger *= 0.5 + metadata.difficultyLevel * 0.1; // Scale from 0.6 to 1.5
  }

  return danger;
}

/**
 * Generate a descriptive name for a location based on its properties
 * @param metadata - Environment metadata
 * @returns Generated location name
 */
export function generateLocationName(metadata: EnvironmentMetadata): string {
  if (metadata.name) {
    return metadata.name;
  }

  const biomeAdjectives: Record<BiomeType, string[]> = {
    [BiomeType.DEFAULT]: ['Ancient', 'Forgotten', 'Hidden', 'Lost'],
    [BiomeType.FOREST]: ['Verdant', 'Shadowy', 'Overgrown', 'Emerald'],
    [BiomeType.MOUNTAIN]: ['Highland', 'Craggy', 'Misty', 'Stone'],
    [BiomeType.SNOWY]: ['Frozen', 'Icy', 'Glacial', 'Frost-covered'],
    [BiomeType.TUNDRA]: ['Bleak', 'Windswept', 'Barren', 'Frozen'],
    [BiomeType.BARREN]: ['Desolate', 'Wasteland', 'Ruined', 'Forsaken'],
    [BiomeType.DESERT]: ['Sun-scorched', 'Sandy', 'Arid', 'Dusty'],
    [BiomeType.BEACH]: ['Coastal', 'Seaside', 'Tidal', 'Shore'],
    [BiomeType.WATER]: ['Submerged', 'Aquatic', 'Underwater', 'Sunken'],
    [BiomeType.VOLCANIC]: ['Molten', 'Ashen', 'Burning', 'Volcanic'],
    [BiomeType.SWAMP]: ['Murky', 'Fetid', 'Misty', 'Boggy'],
    [BiomeType.JUNGLE]: ['Tangled', 'Overgrown', 'Dense', 'Verdant'],
    [BiomeType.UNDERGROUND]: ['Subterranean', 'Deep', 'Forgotten', 'Dark'],
    [BiomeType.CORRUPTED]: ['Blighted', 'Cursed', 'Twisted', 'Corrupted'],
  };

  const locationNouns: Record<LocationType, string[]> = {
    [LocationType.DUNGEON]: ['Dungeon', 'Crypt', 'Labyrinth', 'Catacomb'],
    [LocationType.TOWN]: ['Town', 'Village', 'Settlement', 'Outpost'],
    [LocationType.RUINS]: ['Ruins', 'Temple', 'Sanctuary', 'Monument'],
    [LocationType.FACTION_BASE]: ['Fortress', 'Stronghold', 'Base', 'Keep'],
    [LocationType.WILDERNESS]: ['Wilds', 'Expanse', 'Territory', 'Lands'],
    [LocationType.CAVE]: ['Cavern', 'Cave', 'Grotto', 'Hollow'],
  };

  const adjectives =
    biomeAdjectives[metadata.biome] || biomeAdjectives[BiomeType.DEFAULT];
  const nouns = locationNouns[metadata.locationType] || ['Location'];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${adjective} ${noun}`;
}

/**
 * Check if an environment configuration is valid
 * @param metadata - Environment metadata to validate
 * @returns True if valid, false otherwise
 */
export function isValidEnvironment(metadata: EnvironmentMetadata): boolean {
  // Check if location type exists
  if (!metadata.locationType || !metadata.locationProperties) {
    return false;
  }

  // Check if biome exists
  if (!metadata.biome || !metadata.biomeConfig) {
    return false;
  }

  // Check if difficulty is in valid range
  if (metadata.difficultyLevel !== undefined) {
    if (metadata.difficultyLevel < 1 || metadata.difficultyLevel > 10) {
      return false;
    }
  }

  return true;
}
