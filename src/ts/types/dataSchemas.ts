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
import { RaceType } from '../components/race';

/**
 * Stat modifier - can be flat bonus or percentage multiplier
 */
export interface StatModifier {
  /** Flat bonus added to stat (e.g., +5 strength) */
  flat?: number;
  /** Percentage multiplier (e.g., 0.2 = +20% strength) */
  percent?: number;
}

/**
 * Component templates for template-mixing feature
 * These allow entities to be composed from reusable component configurations
 */

/**
 * Render template for visual appearance
 */
export interface RenderTemplate {
  id: string;
  name: string;
  description?: string;
  sprite: string; // TileSprite enum value as string
  color?: string; // Hex color
  size?: { x: number; y: number }; // Size in tiles (default: 1x1)
}

/**
 * Stats template for character attributes
 */
export interface StatsTemplate {
  id: string;
  name: string;
  description?: string;
  stats: {
    strength: number;
    dexterity?: number;
    intelligence?: number;
    charisma?: number;
    willpower?: number;
    toughness?: number;
    attractiveness?: number;
  };
}

/**
 * AI behavior template
 */
export interface AITemplate {
  id: string;
  name: string;
  description?: string;
  ai: {
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
}

/**
 * Health/durability template
 */
export interface HealthTemplate {
  id: string;
  name: string;
  description?: string;
  health: {
    max: number;
    regen?: number;
  };
}

/**
 * Component template references for template-mixing
 * Allows entities to be composed from multiple templates per component type
 * Templates are merged in array order: [0] → [1] → ... → [n] → direct entity values
 */
export interface ComponentTemplateRefs {
  renderTemplates?: string[]; // Array of RenderTemplate IDs
  statsTemplates?: string[]; // Array of StatsTemplate IDs
  aiTemplates?: string[]; // Array of AITemplate IDs
  healthTemplates?: string[]; // Array of HealthTemplate IDs
}

/**
 * Race template that can be loaded from JSON data files
 */
export interface RaceTemplate {
  id: string;
  name: string;
  description?: string;
  type: RaceType;

  /** Stat modifiers provided by this race */
  statModifiers?: {
    strength?: StatModifier;
    dexterity?: StatModifier;
    intelligence?: StatModifier;
    charisma?: StatModifier;
    willpower?: StatModifier;
    toughness?: StatModifier;
    attractiveness?: StatModifier;
  };

  /** Racial abilities/traits IDs granted by this race */
  abilities?: string[];

  /** Class affinity modifiers (for future implementation) */
  classAffinities?: {
    [classId: string]: number; // Positive = affinity, negative = penalty
  };
}

/**
 * Class template that can be loaded from JSON data files
 */
export interface ClassTemplate {
  id: string;
  name: string;
  description?: string;

  /** Stat modifiers provided by this class per level */
  statModifiersPerLevel?: {
    strength?: StatModifier;
    dexterity?: StatModifier;
    intelligence?: StatModifier;
    charisma?: StatModifier;
    willpower?: StatModifier;
    toughness?: StatModifier;
    attractiveness?: StatModifier;
  };

  /** Base stat modifiers at level 1 */
  baseStatModifiers?: {
    strength?: StatModifier;
    dexterity?: StatModifier;
    intelligence?: StatModifier;
    charisma?: StatModifier;
    willpower?: StatModifier;
    toughness?: StatModifier;
    attractiveness?: StatModifier;
  };

  /** Class abilities/skills IDs granted by this class */
  abilities?: {
    [level: number]: string[]; // Abilities unlocked at each level
  };

  /** Experience required for each level (level 1 to 2, 2 to 3, etc.) */
  experiencePerLevel?: number[];

  /** Default XP formula: level * baseXP * multiplier^(level-1) */
  experienceFormula?: {
    base: number;
    multiplier: number;
  };
}

/**
 * Base entity template that can be loaded from JSON data files
 */
export interface EntityTemplate {
  id: string;
  name: string;
  description?: string;

  // Template-mixing: Reference component templates
  // These are resolved first, then overridden by direct component data
  templates?: ComponentTemplateRefs;

  // Component data (overrides template values if specified)
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

  // Race configuration (all entities have a race)
  race?: {
    id: string; // Race ID from races.json
  };

  // Class configuration (only 'character', 'player', 'boss' types have classes)
  class?: {
    id: string; // Class ID from classes.json
    level?: number; // Starting level (default: 1)
    experience?: number; // Starting XP (default: 0)
  };
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

/**
 * Container for race data files
 */
export interface RaceDataFile {
  races: RaceTemplate[];
}

/**
 * Container for class data files
 */
export interface ClassDataFile {
  classes: ClassTemplate[];
}

/**
 * Container for component template data files
 */
export interface RenderTemplateDataFile {
  renderTemplates: RenderTemplate[];
}

export interface StatsTemplateDataFile {
  statsTemplates: StatsTemplate[];
}

export interface AITemplateDataFile {
  aiTemplates: AITemplate[];
}

export interface HealthTemplateDataFile {
  healthTemplates: HealthTemplate[];
}
