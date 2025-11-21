/*
 * File: biomeSpawnTables.ts
 * Project: littlejs-rl
 * File Created: Thursday, 21st November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 21st November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { BiomeType } from './biomeConfig';

/**
 * Spawn weight entry for an entity or item type
 */
export interface SpawnWeightEntry {
  /** Entity or item type ID */
  typeId: string;
  /** Spawn weight (higher = more likely) */
  weight: number;
  /** Minimum difficulty level required */
  minDifficulty?: number;
  /** Maximum difficulty level allowed */
  maxDifficulty?: number;
}

/**
 * Complete spawn table for a biome
 */
export interface BiomeSpawnTable {
  /** Biome this spawn table applies to */
  biome: BiomeType;
  /** Entity spawn weights */
  entities: SpawnWeightEntry[];
  /** Item spawn weights */
  items: SpawnWeightEntry[];
  /** Base spawn rate multiplier (1.0 = normal) */
  baseSpawnRate: number;
}

/**
 * Default spawn tables for each biome
 * This is a starting point - can be extended via JSON data loading later
 */
const DEFAULT_SPAWN_TABLES: Map<BiomeType, BiomeSpawnTable> = new Map();

// DEFAULT BIOME
DEFAULT_SPAWN_TABLES.set(BiomeType.DEFAULT, {
  biome: BiomeType.DEFAULT,
  entities: [
    { typeId: 'goblin', weight: 10 },
    { typeId: 'rat', weight: 15 },
    { typeId: 'slime', weight: 12 },
  ],
  items: [
    { typeId: 'potion_health', weight: 10 },
    { typeId: 'coin_gold', weight: 20 },
    { typeId: 'sword_short', weight: 5 },
  ],
  baseSpawnRate: 1.0,
});

// FOREST BIOME
DEFAULT_SPAWN_TABLES.set(BiomeType.FOREST, {
  biome: BiomeType.FOREST,
  entities: [
    { typeId: 'wolf', weight: 15 },
    { typeId: 'bear', weight: 8 },
    { typeId: 'bandit', weight: 10 },
    { typeId: 'forest_sprite', weight: 5 },
    { typeId: 'deer', weight: 12 },
  ],
  items: [
    { typeId: 'herbs', weight: 15 },
    { typeId: 'berries', weight: 20 },
    { typeId: 'wood', weight: 10 },
    { typeId: 'bow', weight: 5 },
  ],
  baseSpawnRate: 1.2,
});

// MOUNTAIN BIOME
DEFAULT_SPAWN_TABLES.set(BiomeType.MOUNTAIN, {
  biome: BiomeType.MOUNTAIN,
  entities: [
    { typeId: 'goat', weight: 10 },
    { typeId: 'eagle', weight: 8 },
    { typeId: 'troll', weight: 5, minDifficulty: 3 },
    { typeId: 'mountain_lion', weight: 7 },
    { typeId: 'bandit', weight: 6 },
  ],
  items: [
    { typeId: 'ore_iron', weight: 15 },
    { typeId: 'ore_silver', weight: 8 },
    { typeId: 'gems', weight: 5 },
    { typeId: 'pickaxe', weight: 3 },
  ],
  baseSpawnRate: 0.8,
});

// SNOWY/TUNDRA BIOMES
DEFAULT_SPAWN_TABLES.set(BiomeType.SNOWY, {
  biome: BiomeType.SNOWY,
  entities: [
    { typeId: 'ice_wolf', weight: 12 },
    { typeId: 'frost_giant', weight: 4, minDifficulty: 5 },
    { typeId: 'yeti', weight: 6, minDifficulty: 4 },
    { typeId: 'ice_elemental', weight: 5, minDifficulty: 3 },
  ],
  items: [
    { typeId: 'ice_crystal', weight: 10 },
    { typeId: 'fur', weight: 15 },
    { typeId: 'frozen_food', weight: 8 },
  ],
  baseSpawnRate: 0.7,
});

DEFAULT_SPAWN_TABLES.set(BiomeType.TUNDRA, {
  biome: BiomeType.TUNDRA,
  entities: [
    { typeId: 'frost_wolf', weight: 15 },
    { typeId: 'mammoth', weight: 6, minDifficulty: 3 },
    { typeId: 'frost_wraith', weight: 5, minDifficulty: 4 },
  ],
  items: [
    { typeId: 'ice_shard', weight: 12 },
    { typeId: 'frozen_meat', weight: 10 },
  ],
  baseSpawnRate: 0.6,
});

// DESERT BIOME
DEFAULT_SPAWN_TABLES.set(BiomeType.DESERT, {
  biome: BiomeType.DESERT,
  entities: [
    { typeId: 'scorpion', weight: 15 },
    { typeId: 'snake', weight: 12 },
    { typeId: 'sand_worm', weight: 6, minDifficulty: 4 },
    { typeId: 'desert_bandit', weight: 10 },
    { typeId: 'vulture', weight: 8 },
  ],
  items: [
    { typeId: 'cactus_fruit', weight: 10 },
    { typeId: 'sand', weight: 20 },
    { typeId: 'ancient_artifact', weight: 3, minDifficulty: 3 },
  ],
  baseSpawnRate: 0.9,
});

// VOLCANIC BIOME
DEFAULT_SPAWN_TABLES.set(BiomeType.VOLCANIC, {
  biome: BiomeType.VOLCANIC,
  entities: [
    { typeId: 'fire_elemental', weight: 12, minDifficulty: 4 },
    { typeId: 'lava_golem', weight: 8, minDifficulty: 5 },
    { typeId: 'fire_drake', weight: 5, minDifficulty: 6 },
    { typeId: 'magma_slime', weight: 10 },
  ],
  items: [
    { typeId: 'obsidian', weight: 15 },
    { typeId: 'fire_gem', weight: 8 },
    { typeId: 'lava_resistant_armor', weight: 3, minDifficulty: 5 },
  ],
  baseSpawnRate: 0.8,
});

// SWAMP BIOME
DEFAULT_SPAWN_TABLES.set(BiomeType.SWAMP, {
  biome: BiomeType.SWAMP,
  entities: [
    { typeId: 'swamp_troll', weight: 10, minDifficulty: 3 },
    { typeId: 'alligator', weight: 12 },
    { typeId: 'poison_frog', weight: 15 },
    { typeId: 'bog_witch', weight: 5, minDifficulty: 4 },
    { typeId: 'mosquito_swarm', weight: 18 },
  ],
  items: [
    { typeId: 'swamp_herbs', weight: 15 },
    { typeId: 'poison_extract', weight: 10 },
    { typeId: 'murky_water', weight: 20 },
  ],
  baseSpawnRate: 1.3,
});

// JUNGLE BIOME
DEFAULT_SPAWN_TABLES.set(BiomeType.JUNGLE, {
  biome: BiomeType.JUNGLE,
  entities: [
    { typeId: 'jaguar', weight: 10 },
    { typeId: 'gorilla', weight: 8 },
    { typeId: 'giant_spider', weight: 12, minDifficulty: 3 },
    { typeId: 'jungle_tribesman', weight: 7 },
    { typeId: 'poison_dart_frog', weight: 15 },
    { typeId: 'anaconda', weight: 9, minDifficulty: 2 },
  ],
  items: [
    { typeId: 'tropical_fruit', weight: 20 },
    { typeId: 'jungle_herbs', weight: 15 },
    { typeId: 'ancient_statue', weight: 4, minDifficulty: 4 },
    { typeId: 'poison_dart', weight: 8 },
  ],
  baseSpawnRate: 1.5,
});

// UNDERGROUND BIOME
DEFAULT_SPAWN_TABLES.set(BiomeType.UNDERGROUND, {
  biome: BiomeType.UNDERGROUND,
  entities: [
    { typeId: 'bat', weight: 20 },
    { typeId: 'giant_rat', weight: 15 },
    { typeId: 'cave_spider', weight: 12 },
    { typeId: 'kobold', weight: 10 },
    { typeId: 'deep_stalker', weight: 6, minDifficulty: 5 },
    { typeId: 'underground_horror', weight: 4, minDifficulty: 7 },
  ],
  items: [
    { typeId: 'ore_copper', weight: 15 },
    { typeId: 'ore_iron', weight: 10 },
    { typeId: 'gems', weight: 8 },
    { typeId: 'mushroom', weight: 12 },
    { typeId: 'ancient_relic', weight: 3, minDifficulty: 5 },
  ],
  baseSpawnRate: 1.0,
});

// CORRUPTED BIOME
DEFAULT_SPAWN_TABLES.set(BiomeType.CORRUPTED, {
  biome: BiomeType.CORRUPTED,
  entities: [
    { typeId: 'corrupted_beast', weight: 12, minDifficulty: 4 },
    { typeId: 'shadow_creature', weight: 10, minDifficulty: 5 },
    { typeId: 'undead', weight: 15, minDifficulty: 3 },
    { typeId: 'demon', weight: 6, minDifficulty: 6 },
    { typeId: 'cultist', weight: 8, minDifficulty: 3 },
  ],
  items: [
    { typeId: 'cursed_artifact', weight: 8, minDifficulty: 5 },
    { typeId: 'dark_essence', weight: 12 },
    { typeId: 'corrupted_gem', weight: 10 },
  ],
  baseSpawnRate: 1.1,
});

// BEACH and WATER biomes
DEFAULT_SPAWN_TABLES.set(BiomeType.BEACH, {
  biome: BiomeType.BEACH,
  entities: [
    { typeId: 'crab', weight: 20 },
    { typeId: 'seagull', weight: 15 },
    { typeId: 'pirate', weight: 8, minDifficulty: 2 },
    { typeId: 'sea_turtle', weight: 10 },
  ],
  items: [
    { typeId: 'shell', weight: 20 },
    { typeId: 'pearl', weight: 5 },
    { typeId: 'driftwood', weight: 15 },
    { typeId: 'fish', weight: 18 },
  ],
  baseSpawnRate: 1.0,
});

DEFAULT_SPAWN_TABLES.set(BiomeType.WATER, {
  biome: BiomeType.WATER,
  entities: [
    { typeId: 'fish', weight: 25 },
    { typeId: 'shark', weight: 8, minDifficulty: 3 },
    { typeId: 'water_elemental', weight: 6, minDifficulty: 4 },
    { typeId: 'sea_serpent', weight: 4, minDifficulty: 6 },
    { typeId: 'merfolk', weight: 7, minDifficulty: 2 },
  ],
  items: [
    { typeId: 'pearl', weight: 8 },
    { typeId: 'coral', weight: 15 },
    { typeId: 'seaweed', weight: 20 },
    { typeId: 'treasure_chest', weight: 3, minDifficulty: 4 },
  ],
  baseSpawnRate: 0.9,
});

// BARREN BIOME
DEFAULT_SPAWN_TABLES.set(BiomeType.BARREN, {
  biome: BiomeType.BARREN,
  entities: [
    { typeId: 'scavenger', weight: 15 },
    { typeId: 'wasteland_bandit', weight: 10, minDifficulty: 2 },
    { typeId: 'mutated_creature', weight: 8, minDifficulty: 3 },
    { typeId: 'dust_devil', weight: 6, minDifficulty: 4 },
  ],
  items: [
    { typeId: 'scrap_metal', weight: 15 },
    { typeId: 'old_bones', weight: 20 },
    { typeId: 'dried_meat', weight: 10 },
  ],
  baseSpawnRate: 0.7,
});

/**
 * Get spawn table for a biome
 * @param biome - Biome type
 * @returns Spawn table (falls back to DEFAULT if not found)
 */
export function getBiomeSpawnTable(biome: BiomeType): BiomeSpawnTable {
  return (
    DEFAULT_SPAWN_TABLES.get(biome) ||
    DEFAULT_SPAWN_TABLES.get(BiomeType.DEFAULT)!
  );
}

/**
 * Select random entity type based on spawn weights and difficulty
 * @param biome - Biome type
 * @param difficultyLevel - Current difficulty level (1-10)
 * @returns Entity type ID or null if no valid spawns
 */
export function selectRandomEntity(
  biome: BiomeType,
  difficultyLevel: number = 1
): string | null {
  const spawnTable = getBiomeSpawnTable(biome);

  // Filter by difficulty
  const validEntries = spawnTable.entities.filter((entry) => {
    if (entry.minDifficulty && difficultyLevel < entry.minDifficulty) {
      return false;
    }
    if (entry.maxDifficulty && difficultyLevel > entry.maxDifficulty) {
      return false;
    }
    return true;
  });

  if (validEntries.length === 0) return null;

  // Calculate total weight
  const totalWeight = validEntries.reduce(
    (sum, entry) => sum + entry.weight,
    0
  );

  // Select random entry based on weight
  let random = Math.random() * totalWeight;
  for (const entry of validEntries) {
    random -= entry.weight;
    if (random <= 0) {
      return entry.typeId;
    }
  }

  return validEntries[0].typeId; // Fallback
}

/**
 * Select random item type based on spawn weights and difficulty
 * @param biome - Biome type
 * @param difficultyLevel - Current difficulty level (1-10)
 * @returns Item type ID or null if no valid spawns
 */
export function selectRandomItem(
  biome: BiomeType,
  difficultyLevel: number = 1
): string | null {
  const spawnTable = getBiomeSpawnTable(biome);

  // Filter by difficulty
  const validEntries = spawnTable.items.filter((entry) => {
    if (entry.minDifficulty && difficultyLevel < entry.minDifficulty) {
      return false;
    }
    if (entry.maxDifficulty && difficultyLevel > entry.maxDifficulty) {
      return false;
    }
    return true;
  });

  if (validEntries.length === 0) return null;

  // Calculate total weight
  const totalWeight = validEntries.reduce(
    (sum, entry) => sum + entry.weight,
    0
  );

  // Select random entry based on weight
  let random = Math.random() * totalWeight;
  for (const entry of validEntries) {
    random -= entry.weight;
    if (random <= 0) {
      return entry.typeId;
    }
  }

  return validEntries[0].typeId; // Fallback
}

/**
 * Get base spawn rate for a biome
 * @param biome - Biome type
 * @returns Spawn rate multiplier
 */
export function getBiomeSpawnRate(biome: BiomeType): number {
  return getBiomeSpawnTable(biome).baseSpawnRate;
}
