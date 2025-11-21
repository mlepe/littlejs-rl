/*
 * File: biomeConfig.ts
 * Project: littlejs-rl
 * File Created: Thursday, 21st November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 21st November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

import { AutoTileSprite } from './tileConfig';
import { BaseColor, getColor } from './colorPalette';

/**
 * Biome types - Different environmental themes
 */
export enum BiomeType {
  /** Default/neutral biome */
  DEFAULT = 'default',
  /** Temperate forest with trees and vegetation */
  FOREST = 'forest',
  /** Rocky mountains with cliffs and caves */
  MOUNTAIN = 'mountain',
  /** Snowy tundra with ice and frost */
  SNOWY = 'snowy',
  /** Frozen tundra (colder than snowy, more extreme) */
  TUNDRA = 'tundra',
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
  /** Dense tropical jungle */
  JUNGLE = 'jungle',
  /** Underground caverns and tunnels */
  UNDERGROUND = 'underground',
  /** Corrupted/blighted lands */
  CORRUPTED = 'corrupted',
}

/**
 * Environmental temperature levels
 */
export enum Temperature {
  /** Extremely cold (-30°C and below) */
  FREEZING = 'freezing',
  /** Cold (0°C to -30°C) */
  COLD = 'cold',
  /** Moderate (10°C to 20°C) */
  MODERATE = 'moderate',
  /** Warm (20°C to 35°C) */
  WARM = 'warm',
  /** Hot (35°C to 50°C) */
  HOT = 'hot',
  /** Extremely hot (50°C and above) */
  SCORCHING = 'scorching',
}

/**
 * Humidity levels
 */
export enum Humidity {
  /** Very dry */
  ARID = 'arid',
  /** Dry */
  DRY = 'dry',
  /** Normal humidity */
  MODERATE = 'moderate',
  /** Humid */
  HUMID = 'humid',
  /** Very humid */
  WET = 'wet',
}

/**
 * Tile sprite mappings for a biome
 */
export interface BiomeTiles {
  /** Primary floor tile */
  floor: AutoTileSprite;
  /** Alternative floor tiles (for variety) */
  floorVariants?: AutoTileSprite[];
  /** Primary wall tile */
  wall: AutoTileSprite;
  /** Alternative wall tiles (for variety) */
  wallVariants?: AutoTileSprite[];
  /** Water tile (if applicable) */
  water?: AutoTileSprite;
  /** Vegetation/decoration tiles */
  vegetation?: AutoTileSprite[];
  /** Special accent tiles */
  accent?: AutoTileSprite[];
}

/**
 * Optional color tint overlay for biome tiles
 */
export interface BiomeTint {
  /** Tint for floor tiles */
  floor?: LJS.Color;
  /** Tint for wall tiles */
  wall?: LJS.Color;
  /** Tint for water tiles */
  water?: LJS.Color;
  /** Tint for vegetation */
  vegetation?: LJS.Color;
  /** Tint for accent tiles */
  accent?: LJS.Color;
}

/**
 * Environmental properties of a biome
 */
export interface BiomeEnvironment {
  /** Temperature level */
  temperature: Temperature;
  /** Humidity level */
  humidity: Humidity;
  /** Light level (0-1, where 1 is bright daylight) */
  lightLevel: number;
  /** Visibility distance modifier (1.0 = normal) */
  visibilityModifier: number;
  /** Cold resistance modifier (-1 to +1) */
  coldResistanceModifier: number;
  /** Fire resistance modifier (-1 to +1) */
  fireResistanceModifier: number;
}

/**
 * Weather types that can occur in biomes
 */
export enum WeatherType {
  CLEAR = 'clear',
  CLOUDY = 'cloudy',
  RAIN = 'rain',
  HEAVY_RAIN = 'heavy_rain',
  SNOW = 'snow',
  BLIZZARD = 'blizzard',
  FOG = 'fog',
  STORM = 'storm',
  SANDSTORM = 'sandstorm',
  HEATWAVE = 'heatwave',
  ASH_FALL = 'ash_fall',
  TOXIC_RAIN = 'toxic_rain',
}

/**
 * Weather configuration for a biome
 */
export interface BiomeWeather {
  /** Common weather types (80% chance) */
  common: WeatherType[];
  /** Rare weather types (20% chance) */
  rare: WeatherType[];
  /** Default weather */
  defaultWeather: WeatherType;
  /** Weather change frequency (lower = more frequent) */
  changeFrequency: number;
}

/**
 * Spawn weight configuration
 * (For future spawn table system)
 */
export interface BiomeSpawnWeights {
  /** Entity type to spawn weight mapping */
  entities?: Map<string, number>;
  /** Item type to spawn weight mapping */
  items?: Map<string, number>;
}

/**
 * Complete biome configuration
 */
export interface BiomeConfig {
  /** Unique identifier */
  id: BiomeType;
  /** Display name */
  name: string;
  /** Description */
  description: string;
  /** Tile sprite mappings */
  tiles: BiomeTiles;
  /** Optional color tinting */
  tint?: BiomeTint;
  /** Environmental properties */
  environment: BiomeEnvironment;
  /** Weather configuration (for future use) */
  weather: BiomeWeather;
  /** Spawn weights (for future use) */
  spawnWeights?: BiomeSpawnWeights;
  /** Biomes that can transition to this one */
  compatibleTransitions?: BiomeType[];
}

/**
 * Default biome configurations
 */
const BIOME_CONFIGS: Map<BiomeType, BiomeConfig> = new Map();

// DEFAULT BIOME
BIOME_CONFIGS.set(BiomeType.DEFAULT, {
  id: BiomeType.DEFAULT,
  name: 'Default',
  description: 'Neutral environment with standard tiles',
  tiles: {
    floor: AutoTileSprite.FLOOR_STONE,
    floorVariants: [AutoTileSprite.FLOOR_WOOD, AutoTileSprite.FLOOR_DIRT],
    wall: AutoTileSprite.WALL_STONE,
    wallVariants: [AutoTileSprite.WALL_BRICK],
  },
  tint: {
    floor: getColor(BaseColor.GRAY),
    wall: getColor(BaseColor.DARK_GRAY),
  },
  environment: {
    temperature: Temperature.MODERATE,
    humidity: Humidity.MODERATE,
    lightLevel: 0.8,
    visibilityModifier: 1.0,
    coldResistanceModifier: 0,
    fireResistanceModifier: 0,
  },
  weather: {
    common: [WeatherType.CLEAR, WeatherType.CLOUDY],
    rare: [],
    defaultWeather: WeatherType.CLEAR,
    changeFrequency: 1000,
  },
  compatibleTransitions: [],
});

// FOREST BIOME
BIOME_CONFIGS.set(BiomeType.FOREST, {
  id: BiomeType.FOREST,
  name: 'Forest',
  description: 'Temperate forest with trees and vegetation',
  tiles: {
    floor: AutoTileSprite.FLOOR_GRASS,
    floorVariants: [AutoTileSprite.FLOOR_DIRT],
    wall: AutoTileSprite.WALL_WOOD,
    wallVariants: [AutoTileSprite.WALL_MOSSY],
    water: AutoTileSprite.WATER_SHALLOW,
    vegetation: [AutoTileSprite.FLOOR_GRASS, AutoTileSprite.FLOOR_GRASS],
  },
  tint: {
    floor: getColor(BaseColor.GRASS),
    wall: getColor(BaseColor.BROWN),
    water: getColor(BaseColor.WATER),
    vegetation: getColor(BaseColor.GREEN),
  },
  environment: {
    temperature: Temperature.MODERATE,
    humidity: Humidity.HUMID,
    lightLevel: 0.7,
    visibilityModifier: 0.9,
    coldResistanceModifier: 0,
    fireResistanceModifier: 0,
  },
  weather: {
    common: [WeatherType.CLEAR, WeatherType.CLOUDY, WeatherType.RAIN],
    rare: [WeatherType.FOG, WeatherType.STORM],
    defaultWeather: WeatherType.CLEAR,
    changeFrequency: 300,
  },
  compatibleTransitions: [
    BiomeType.MOUNTAIN,
    BiomeType.SWAMP,
    BiomeType.JUNGLE,
    BiomeType.DEFAULT,
  ],
});

// MOUNTAIN BIOME
BIOME_CONFIGS.set(BiomeType.MOUNTAIN, {
  id: BiomeType.MOUNTAIN,
  name: 'Mountain',
  description: 'Rocky mountains with cliffs and caves',
  tiles: {
    floor: AutoTileSprite.FLOOR_STONE,
    floorVariants: [AutoTileSprite.FLOOR_CAVE],
    wall: AutoTileSprite.WALL_ROCK,
    wallVariants: [AutoTileSprite.WALL_STONE_DARK],
    water: AutoTileSprite.WATER_SHALLOW,
  },
  tint: {
    floor: getColor(BaseColor.GRAY),
    wall: getColor(BaseColor.DARK_GRAY),
    water: getColor(BaseColor.CYAN),
  },
  environment: {
    temperature: Temperature.COLD,
    humidity: Humidity.DRY,
    lightLevel: 0.9,
    visibilityModifier: 1.1,
    coldResistanceModifier: -0.2,
    fireResistanceModifier: 0.1,
  },
  weather: {
    common: [WeatherType.CLEAR, WeatherType.CLOUDY, WeatherType.FOG],
    rare: [WeatherType.SNOW, WeatherType.STORM],
    defaultWeather: WeatherType.CLEAR,
    changeFrequency: 400,
  },
  compatibleTransitions: [
    BiomeType.FOREST,
    BiomeType.SNOWY,
    BiomeType.TUNDRA,
    BiomeType.UNDERGROUND,
    BiomeType.DEFAULT,
  ],
});

// SNOWY BIOME
BIOME_CONFIGS.set(BiomeType.SNOWY, {
  id: BiomeType.SNOWY,
  name: 'Snowy',
  description: 'Snow-covered lands with ice and frost',
  tiles: {
    floor: AutoTileSprite.FLOOR_SNOW,
    floorVariants: [AutoTileSprite.FLOOR_ICE],
    wall: AutoTileSprite.WALL_ICE,
    wallVariants: [AutoTileSprite.WALL_STONE],
    water: AutoTileSprite.WATER_DEEP,
  },
  tint: {
    floor: getColor(BaseColor.WHITE),
    wall: getColor(BaseColor.CYAN),
    water: getColor(BaseColor.BLUE),
  },
  environment: {
    temperature: Temperature.COLD,
    humidity: Humidity.MODERATE,
    lightLevel: 0.95,
    visibilityModifier: 1.0,
    coldResistanceModifier: -0.3,
    fireResistanceModifier: 0.2,
  },
  weather: {
    common: [WeatherType.SNOW, WeatherType.CLOUDY],
    rare: [WeatherType.CLEAR, WeatherType.BLIZZARD],
    defaultWeather: WeatherType.SNOW,
    changeFrequency: 400,
  },
  compatibleTransitions: [
    BiomeType.MOUNTAIN,
    BiomeType.TUNDRA,
    BiomeType.DEFAULT,
  ],
});

// TUNDRA BIOME
BIOME_CONFIGS.set(BiomeType.TUNDRA, {
  id: BiomeType.TUNDRA,
  name: 'Tundra',
  description: 'Frozen tundra with extreme cold and sparse life',
  tiles: {
    floor: AutoTileSprite.FLOOR_SNOW,
    floorVariants: [AutoTileSprite.FLOOR_ICE],
    wall: AutoTileSprite.WALL_ICE,
    water: AutoTileSprite.WATER_DEEP,
  },
  tint: {
    floor: getColor(BaseColor.WHITE),
    wall: getColor(BaseColor.CYAN),
    water: getColor(BaseColor.BLUE),
  },
  environment: {
    temperature: Temperature.FREEZING,
    humidity: Humidity.DRY,
    lightLevel: 0.9,
    visibilityModifier: 0.8,
    coldResistanceModifier: -0.5,
    fireResistanceModifier: 0.3,
  },
  weather: {
    common: [WeatherType.SNOW, WeatherType.BLIZZARD],
    rare: [WeatherType.CLEAR],
    defaultWeather: WeatherType.BLIZZARD,
    changeFrequency: 300,
  },
  compatibleTransitions: [BiomeType.SNOWY, BiomeType.MOUNTAIN],
});

// BARREN BIOME
BIOME_CONFIGS.set(BiomeType.BARREN, {
  id: BiomeType.BARREN,
  name: 'Barren',
  description: 'Barren wasteland with sparse vegetation',
  tiles: {
    floor: AutoTileSprite.FLOOR_BARREN,
    floorVariants: [AutoTileSprite.FLOOR_DIRT],
    wall: AutoTileSprite.WALL_ROCK,
    wallVariants: [AutoTileSprite.WALL_CRACKED],
  },
  tint: {
    floor: getColor(BaseColor.BROWN),
    wall: getColor(BaseColor.DARK_GRAY),
  },
  environment: {
    temperature: Temperature.WARM,
    humidity: Humidity.ARID,
    lightLevel: 0.95,
    visibilityModifier: 1.1,
    coldResistanceModifier: 0.1,
    fireResistanceModifier: -0.1,
  },
  weather: {
    common: [WeatherType.CLEAR, WeatherType.STORM],
    rare: [WeatherType.SANDSTORM],
    defaultWeather: WeatherType.CLEAR,
    changeFrequency: 500,
  },
  compatibleTransitions: [
    BiomeType.DESERT,
    BiomeType.CORRUPTED,
    BiomeType.DEFAULT,
  ],
});

// DESERT BIOME
BIOME_CONFIGS.set(BiomeType.DESERT, {
  id: BiomeType.DESERT,
  name: 'Desert',
  description: 'Sandy desert with dunes and oases',
  tiles: {
    floor: AutoTileSprite.FLOOR_DESERT,
    floorVariants: [AutoTileSprite.FLOOR_SAND],
    wall: AutoTileSprite.WALL_STONE,
    water: AutoTileSprite.WATER_SHALLOW,
  },
  tint: {
    floor: getColor(BaseColor.YELLOW),
    wall: getColor(BaseColor.GOLD),
    water: getColor(BaseColor.CYAN),
  },
  environment: {
    temperature: Temperature.HOT,
    humidity: Humidity.ARID,
    lightLevel: 1.0,
    visibilityModifier: 0.9,
    coldResistanceModifier: 0.3,
    fireResistanceModifier: -0.3,
  },
  weather: {
    common: [WeatherType.CLEAR, WeatherType.HEATWAVE],
    rare: [WeatherType.SANDSTORM],
    defaultWeather: WeatherType.CLEAR,
    changeFrequency: 600,
  },
  compatibleTransitions: [BiomeType.BARREN, BiomeType.BEACH, BiomeType.DEFAULT],
});

// BEACH BIOME
BIOME_CONFIGS.set(BiomeType.BEACH, {
  id: BiomeType.BEACH,
  name: 'Beach',
  description: 'Coastal beach area with sand and surf',
  tiles: {
    floor: AutoTileSprite.FLOOR_BEACH,
    floorVariants: [AutoTileSprite.FLOOR_SAND],
    wall: AutoTileSprite.WALL_ROCK,
    water: AutoTileSprite.WATER_DEEP,
  },
  tint: {
    floor: getColor(BaseColor.GOLD),
    wall: getColor(BaseColor.GRAY),
    water: getColor(BaseColor.BLUE),
  },
  environment: {
    temperature: Temperature.WARM,
    humidity: Humidity.HUMID,
    lightLevel: 1.0,
    visibilityModifier: 1.0,
    coldResistanceModifier: 0.1,
    fireResistanceModifier: 0,
  },
  weather: {
    common: [WeatherType.CLEAR, WeatherType.CLOUDY, WeatherType.RAIN],
    rare: [WeatherType.STORM, WeatherType.FOG],
    defaultWeather: WeatherType.CLEAR,
    changeFrequency: 300,
  },
  compatibleTransitions: [BiomeType.WATER, BiomeType.DESERT, BiomeType.DEFAULT],
});

// WATER BIOME
BIOME_CONFIGS.set(BiomeType.WATER, {
  id: BiomeType.WATER,
  name: 'Water',
  description: 'Water body with underwater terrain',
  tiles: {
    floor: AutoTileSprite.WATER_DEEP,
    floorVariants: [AutoTileSprite.WATER_SHALLOW],
    wall: AutoTileSprite.WALL_ROCK,
    water: AutoTileSprite.WATER_DEEP,
  },
  tint: {
    floor: getColor(BaseColor.BLUE),
    wall: getColor(BaseColor.DARK_GRAY),
    water: getColor(BaseColor.WATER),
  },
  environment: {
    temperature: Temperature.MODERATE,
    humidity: Humidity.WET,
    lightLevel: 0.6,
    visibilityModifier: 0.7,
    coldResistanceModifier: -0.1,
    fireResistanceModifier: 0.4,
  },
  weather: {
    common: [WeatherType.CLEAR, WeatherType.CLOUDY, WeatherType.RAIN],
    rare: [WeatherType.STORM, WeatherType.FOG],
    defaultWeather: WeatherType.CLEAR,
    changeFrequency: 250,
  },
  compatibleTransitions: [BiomeType.BEACH, BiomeType.SWAMP, BiomeType.DEFAULT],
});

// VOLCANIC BIOME
BIOME_CONFIGS.set(BiomeType.VOLCANIC, {
  id: BiomeType.VOLCANIC,
  name: 'Volcanic',
  description: 'Volcanic area with lava and ash',
  tiles: {
    floor: AutoTileSprite.FLOOR_VOLCANIC_ROCK,
    floorVariants: [AutoTileSprite.FLOOR_CAVE],
    wall: AutoTileSprite.WALL_OBSIDIAN,
    wallVariants: [AutoTileSprite.WALL_ROCK],
    water: AutoTileSprite.LAVA,
  },
  tint: {
    floor: getColor(BaseColor.DARK_GRAY),
    wall: getColor(BaseColor.BLACK),
    water: getColor(BaseColor.LAVA),
  },
  environment: {
    temperature: Temperature.SCORCHING,
    humidity: Humidity.ARID,
    lightLevel: 0.8,
    visibilityModifier: 0.8,
    coldResistanceModifier: 0.5,
    fireResistanceModifier: -0.5,
  },
  weather: {
    common: [WeatherType.CLEAR, WeatherType.ASH_FALL],
    rare: [WeatherType.HEATWAVE],
    defaultWeather: WeatherType.ASH_FALL,
    changeFrequency: 250,
  },
  compatibleTransitions: [
    BiomeType.UNDERGROUND,
    BiomeType.BARREN,
    BiomeType.DEFAULT,
  ],
});

// SWAMP BIOME
BIOME_CONFIGS.set(BiomeType.SWAMP, {
  id: BiomeType.SWAMP,
  name: 'Swamp',
  description: 'Murky swamp with vegetation and stagnant water',
  tiles: {
    floor: AutoTileSprite.FLOOR_SWAMP,
    floorVariants: [AutoTileSprite.FLOOR_GRASS, AutoTileSprite.FLOOR_DIRT],
    wall: AutoTileSprite.WALL_MOSSY,
    wallVariants: [AutoTileSprite.WALL_WOOD],
    water: AutoTileSprite.WATER_MURKY,
    vegetation: [AutoTileSprite.FLOOR_GRASS],
  },
  tint: {
    floor: getColor(BaseColor.BROWN),
    wall: getColor(BaseColor.DARK_GRAY),
    water: getColor(BaseColor.TEAL),
    vegetation: getColor(BaseColor.GREEN),
  },
  environment: {
    temperature: Temperature.WARM,
    humidity: Humidity.WET,
    lightLevel: 0.6,
    visibilityModifier: 0.7,
    coldResistanceModifier: 0,
    fireResistanceModifier: 0.1,
  },
  weather: {
    common: [WeatherType.CLOUDY, WeatherType.FOG, WeatherType.RAIN],
    rare: [WeatherType.CLEAR],
    defaultWeather: WeatherType.FOG,
    changeFrequency: 200,
  },
  compatibleTransitions: [
    BiomeType.FOREST,
    BiomeType.WATER,
    BiomeType.JUNGLE,
    BiomeType.DEFAULT,
  ],
});

// JUNGLE BIOME
BIOME_CONFIGS.set(BiomeType.JUNGLE, {
  id: BiomeType.JUNGLE,
  name: 'Jungle',
  description: 'Dense tropical jungle with heavy vegetation',
  tiles: {
    floor: AutoTileSprite.FLOOR_GRASS,
    floorVariants: [AutoTileSprite.FLOOR_DIRT],
    wall: AutoTileSprite.WALL_WOOD,
    wallVariants: [AutoTileSprite.WALL_MOSSY],
    water: AutoTileSprite.WATER_SHALLOW,
    vegetation: [AutoTileSprite.FLOOR_GRASS, AutoTileSprite.FLOOR_GRASS],
  },
  tint: {
    floor: getColor(BaseColor.GRASS),
    wall: getColor(BaseColor.BROWN),
    water: getColor(BaseColor.WATER),
    vegetation: getColor(BaseColor.GREEN),
  },
  environment: {
    temperature: Temperature.HOT,
    humidity: Humidity.WET,
    lightLevel: 0.5,
    visibilityModifier: 0.6,
    coldResistanceModifier: 0.2,
    fireResistanceModifier: 0,
  },
  weather: {
    common: [WeatherType.CLOUDY, WeatherType.RAIN, WeatherType.HEAVY_RAIN],
    rare: [WeatherType.CLEAR, WeatherType.STORM],
    defaultWeather: WeatherType.RAIN,
    changeFrequency: 180,
  },
  compatibleTransitions: [BiomeType.FOREST, BiomeType.SWAMP, BiomeType.DEFAULT],
});

// UNDERGROUND BIOME
BIOME_CONFIGS.set(BiomeType.UNDERGROUND, {
  id: BiomeType.UNDERGROUND,
  name: 'Underground',
  description: 'Deep underground caverns and tunnels',
  tiles: {
    floor: AutoTileSprite.FLOOR_CAVE,
    floorVariants: [AutoTileSprite.FLOOR_STONE],
    wall: AutoTileSprite.WALL_CAVE,
    wallVariants: [AutoTileSprite.WALL_ROCK],
    water: AutoTileSprite.WATER_DEEP,
  },
  tint: {
    floor: getColor(BaseColor.DARK_GRAY),
    wall: getColor(BaseColor.BLACK),
    water: getColor(BaseColor.BLUE),
  },
  environment: {
    temperature: Temperature.COLD,
    humidity: Humidity.HUMID,
    lightLevel: 0.3,
    visibilityModifier: 0.5,
    coldResistanceModifier: -0.1,
    fireResistanceModifier: 0,
  },
  weather: {
    common: [WeatherType.CLEAR],
    rare: [],
    defaultWeather: WeatherType.CLEAR,
    changeFrequency: 1000,
  },
  compatibleTransitions: [
    BiomeType.MOUNTAIN,
    BiomeType.VOLCANIC,
    BiomeType.CORRUPTED,
  ],
});

// CORRUPTED BIOME
BIOME_CONFIGS.set(BiomeType.CORRUPTED, {
  id: BiomeType.CORRUPTED,
  name: 'Corrupted',
  description: 'Blighted lands twisted by dark magic',
  tiles: {
    floor: AutoTileSprite.FLOOR_BARREN,
    floorVariants: [AutoTileSprite.FLOOR_DIRT],
    wall: AutoTileSprite.WALL_CRACKED,
    wallVariants: [AutoTileSprite.WALL_STONE_DARK],
    water: AutoTileSprite.POISON_POOL,
    vegetation: [AutoTileSprite.FLOOR_BARREN],
  },
  tint: {
    floor: getColor(BaseColor.PURPLE),
    wall: getColor(BaseColor.BLACK),
    water: getColor(BaseColor.PURPLE),
    vegetation: getColor(BaseColor.PURPLE),
  },
  environment: {
    temperature: Temperature.COLD,
    humidity: Humidity.DRY,
    lightLevel: 0.4,
    visibilityModifier: 0.6,
    coldResistanceModifier: -0.2,
    fireResistanceModifier: -0.2,
  },
  weather: {
    common: [WeatherType.FOG, WeatherType.TOXIC_RAIN],
    rare: [WeatherType.CLEAR, WeatherType.STORM],
    defaultWeather: WeatherType.FOG,
    changeFrequency: 250,
  },
  compatibleTransitions: [
    BiomeType.BARREN,
    BiomeType.UNDERGROUND,
    BiomeType.DEFAULT,
  ],
});

/**
 * Get biome configuration
 * @param biome - Biome type
 * @returns Biome configuration (falls back to DEFAULT if not found)
 */
export function getBiomeConfig(biome: BiomeType): BiomeConfig {
  return BIOME_CONFIGS.get(biome) || BIOME_CONFIGS.get(BiomeType.DEFAULT)!;
}

/**
 * Get all available biome types
 * @returns Array of all biome types
 */
export function getAllBiomeTypes(): BiomeType[] {
  return Array.from(BIOME_CONFIGS.keys());
}

/**
 * Check if two biomes can transition smoothly
 * @param from - Source biome
 * @param to - Target biome
 * @returns True if transition is compatible
 */
export function canTransitionBetweenBiomes(
  from: BiomeType,
  to: BiomeType
): boolean {
  const fromConfig = getBiomeConfig(from);
  return (
    from === to ||
    fromConfig.compatibleTransitions?.includes(to) ||
    to === BiomeType.DEFAULT
  );
}

/**
 * Get a random floor tile for a biome
 * @param biome - Biome type
 * @returns Tile sprite for floor
 */
export function getRandomFloorTile(biome: BiomeType): AutoTileSprite {
  const config = getBiomeConfig(biome);
  if (config.tiles.floorVariants && config.tiles.floorVariants.length > 0) {
    const rand = Math.random();
    if (rand < 0.2 && config.tiles.floorVariants.length > 0) {
      const index = Math.floor(
        Math.random() * config.tiles.floorVariants.length
      );
      return config.tiles.floorVariants[index];
    }
  }
  return config.tiles.floor;
}

/**
 * Get a random wall tile for a biome
 * @param biome - Biome type
 * @returns Tile sprite for wall
 */
export function getRandomWallTile(biome: BiomeType): AutoTileSprite {
  const config = getBiomeConfig(biome);
  if (config.tiles.wallVariants && config.tiles.wallVariants.length > 0) {
    const rand = Math.random();
    if (rand < 0.3) {
      const index = Math.floor(
        Math.random() * config.tiles.wallVariants.length
      );
      return config.tiles.wallVariants[index];
    }
  }
  return config.tiles.wall;
}

/**
 * Get water tile for a biome
 * @param biome - Biome type
 * @returns Tile sprite for water (or null if biome has no water)
 */
export function getWaterTile(biome: BiomeType): AutoTileSprite | null {
  const config = getBiomeConfig(biome);
  return config.tiles.water || null;
}

/**
 * Get random vegetation tile for a biome
 * @param biome - Biome type
 * @returns Tile sprite for vegetation (or null if biome has no vegetation)
 */
export function getRandomVegetationTile(
  biome: BiomeType
): AutoTileSprite | null {
  const config = getBiomeConfig(biome);
  if (config.tiles.vegetation && config.tiles.vegetation.length > 0) {
    const index = Math.floor(Math.random() * config.tiles.vegetation.length);
    return config.tiles.vegetation[index];
  }
  return null;
}

/**
 * Calculate blended environmental properties for biome transition
 * @param from - Source biome
 * @param to - Target biome
 * @param factor - Blend factor (0 = from, 1 = to)
 * @returns Blended environmental properties
 */
export function blendBiomeEnvironments(
  from: BiomeType,
  to: BiomeType,
  factor: number
): BiomeEnvironment {
  const fromConfig = getBiomeConfig(from);
  const toConfig = getBiomeConfig(to);

  const fromEnv = fromConfig.environment;
  const toEnv = toConfig.environment;

  // Linear interpolation for numeric values
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  return {
    // Use temperature from dominant biome (factor > 0.5)
    temperature: factor > 0.5 ? toEnv.temperature : fromEnv.temperature,
    // Use humidity from dominant biome
    humidity: factor > 0.5 ? toEnv.humidity : fromEnv.humidity,
    // Interpolate light level
    lightLevel: lerp(fromEnv.lightLevel, toEnv.lightLevel, factor),
    // Interpolate visibility
    visibilityModifier: lerp(
      fromEnv.visibilityModifier,
      toEnv.visibilityModifier,
      factor
    ),
    // Interpolate resistances
    coldResistanceModifier: lerp(
      fromEnv.coldResistanceModifier,
      toEnv.coldResistanceModifier,
      factor
    ),
    fireResistanceModifier: lerp(
      fromEnv.fireResistanceModifier,
      toEnv.fireResistanceModifier,
      factor
    ),
  };
}
