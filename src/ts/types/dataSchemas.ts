/*
 * File: dataSchemas.ts
 * Project: littlejs-rl
 * File Created: 2025-11-14 16:00:00
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: 2025-01-14 12:30:00
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { ElementType } from './elements';

/**
 * Base entity template that can be loaded from JSON data files
 */
export interface EntityTemplate {
  id: string;
  name: string;
  description?: string;

  // Component data
  health?: {
    current?: number;
    max: number;
    regen?: number;
  };

  stats?: {
    // Base stats - set directly in data files
    strength: number;
    dexterity?: number;
    intelligence?: number;
    charisma?: number;
    willpower?: number;
    toughness?: number;
    attractiveness?: number;
    // Note: Derived stats (defense, dodge, mindDefense, magicalDefense, speed)
    // are calculated automatically from base stats and should NOT be specified in data files
  };

  ai?: {
    // Disposition determines base behavior pattern
    disposition:
      | 'peaceful'
      | 'neutral'
      | 'defensive'
      | 'aggressive'
      | 'hostile'
      | 'patrol'
      | 'fleeing';
    detectionRange: number;
  };

  render: {
    sprite: string; // e.g., "ENEMY_ORC" from TileSprite enum
    color?: string; // Hex color like "#ff0000"
  };

  // Relation settings
  relation?: {
    baseScore?: number;
    minScore?: number;
    maxScore?: number;
  };

  // Elemental resistances (flat and percentage)
  elementalResistance?: {
    [element: string]: {
      // Element type from ElementType enum (e.g., "fire", "cold", "slashing")
      flat?: number; // Flat damage reduction (negative = weakness)
      percent?: number; // Percentage resistance 0-1 (negative = vulnerability)
    };
  };

  // Elemental damage dealt by attacks
  elementalDamage?: Array<{
    element: string; // Element type from ElementType enum
    amount: number; // Damage amount
  }>;

  // Entity type for categorization (visual/gameplay, not hostility)
  type: 'player' | 'character' | 'creature' | 'boss';
}

/**
 * Item template that can be loaded from JSON data files
 */
export interface ItemTemplate {
  id: string;
  name: string;
  description: string;
  type: 'weapon' | 'armor' | 'consumable' | 'misc';
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

  // Effects when equipped/used
  effects?: {
    health?: number;
    strength?: number;
    defense?: number;
    speed?: number;
  };

  // Elemental damage added by this item (for weapons)
  elementalDamage?: Array<{
    element: string; // Element type from ElementType enum
    amount: number; // Damage amount
  }>;

  // Elemental resistances provided by this item (for armor)
  elementalResistance?: {
    [element: string]: {
      // Element type from ElementType enum
      flat?: number; // Flat damage reduction
      percent?: number; // Percentage resistance 0-1
    };
  };

  // Stack settings
  stackable?: boolean;
  maxStack?: number;

  // Visual
  sprite?: string;
  color?: string;
}

/**
 * Tile template that can be loaded from JSON data files
 */
export interface TileTemplate {
  id: string;
  type: number; // TileType enum value
  walkable: boolean;
  transparent: boolean;
  sprite: string;
  color?: string;
}

/**
 * Biome template for procedural generation
 */
export interface BiomeTemplate {
  id: string;
  name: string;
  description?: string;

  // Tile generation weights
  tiles: {
    [tileId: string]: number; // Weight for this tile type
  };

  // Entity spawn chances
  entities?: {
    [entityId: string]: {
      weight: number;
      minCount: number;
      maxCount: number;
    };
  };
}

/**
 * Balance configuration for game mechanics
 */
export interface BalanceConfig {
  player?: {
    health: number;
    strength: number;
    defense: number;
    speed: number;
  };

  combat?: {
    baseDamageMultiplier: number;
    defenseReduction: number;
    criticalChance: number;
    criticalMultiplier: number;
  };

  progression?: {
    xpPerLevel: number;
    levelScaling: number;
    statsPerLevel: {
      strength: number;
      defense: number;
      health: number;
    };
  };
}

/**
 * Mod metadata
 */
export interface ModMetadata {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;

  // Data files to load relative to mod directory
  data?: string[];

  // Dependencies on other mods
  dependencies?: string[];
}

/**
 * Container for entity data files
 */
export interface EntityDataFile {
  entities: EntityTemplate[];
}

/**
 * Container for item data files
 */
export interface ItemDataFile {
  items: ItemTemplate[];
}

/**
 * Container for tile data files
 */
export interface TileDataFile {
  tiles: TileTemplate[];
}

/**
 * Container for biome data files
 */
export interface BiomeDataFile {
  biomes: BiomeTemplate[];
}
