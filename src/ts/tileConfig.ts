/*
 * File: tileConfig.ts
 * Project: littlejs-rl
 * File Created: Tuesday, 12th November 2025 2:30:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 12th November 2025 2:30:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */
import * as LJS from 'littlejsengine';
import { CuratedTileSprite } from './tileConfig_generated';

/**
 * Tileset Configuration - Sprite index mappings
 *
 * This file contains all sprite indices for the game's tileset.
 * The tileset is a 48x21 tile grid where each tile is 16x16 pixels.
 *
 * Tileset layout:
 * - Index 0 = top-left tile (position x=0, y=0)
 * - Indices increase left-to-right, top-to-bottom
 * - For a 48-tile-wide tileset: tile at (x, y) = y * 48 + x
 * - Total tiles: 1008 (48 columns × 21 rows)
 *
 * @example
 * ```typescript
 * // Using enum values
 * import { TileSprite } from './tileConfig';
 * const coords = getTileCoords(TileSprite.PLAYER_WARRIOR);
 * const tileInfo = new LJS.TileInfo(vec2(coords.x * 16, coords.y * 16), vec2(16, 16), 0);
 * ```
 */

/** TileSprite
 * Comprehensive enum of all tiles in the tileset
 * Each value represents the linear index of a 16x16 pixel tile in the tileset image
 */
export enum TileSprite {
  VOID = 0,

  _9_FLOOR_BRICK = 69,
  FLOOR_ROCKY = 1,
  FLOOR_STONE = 2,
  FLOOR_STONE_2 = 3,
  FLOOR_STONE_3 = 4,
  FLOOR_GRASS = 5,
  FLOOR_FLOWERS = 6,
  FLOOR_PUDDLE = 103,

  _9_FLOOR_ROAD = 9,
  _9_FLOOR_ROAD_MIDDLE = 9,
  _9_FLOOR_ROAD_TOP_LEFT = 10,
  _9_FLOOR_ROAD_LEFT_INTERSECTION_RIGHT = 11,
  _9_FLOOR_ROAD_MIDDLE_INTERSECTION_ALL = 12,
  _9_FLOOR_ROAD_TOP = 13,

  _9_FLOOR_RIVER = 58,

  _9_WALL_BRICK_TOP_LEFT = 19,
  _9_WALL_BRICK = 20,
  _9_WALL_BRICK_MIDDLE = 20,
  _9_WALL_BRICK_TOP = 20,
  _9_WALL_BRICK_TOP_RIGHT = 21,
  _9_WALL_BRICK_LEFT = 68,
  _9_WALL_BRICK_RIGHT = 70,
  _9_WALL_BRICK_BOTTOM_LEFT = 117,
  _9_WALL_BRICK_BOTTOM = 118,
  _9_WALL_BRICK_BOTTOM_RIGHT = 119,

  WALL_STONE = 637,
  WALL_BRICK = 643,

  STAIRS_UP = 244,
  STAIRS_DOWN = 245,

  VEGETATION_TREE = 49,
  VEGETATION_TREE_2 = 50,
  VEGETATION_TREE_3 = 51,
  VEGETATION_TREES = 52,
  VEGETATION_TREES_2 = 101,
  VEGETATION_TREE_4 = 53,
  VEGETATION_TREE_5 = 54,
  VEGETATION_CACTUS = 55,
  VEGETATION_CACTI = 56,

  TILE_PATTERN = 17,
  TILE_PATTERN_2 = 18,

  DOOR_LOCKED = 389,
  DOOR_UNLOCKED = 390,
  DOOR_OPEN = 391,
  DOOR_CLOSED = 392,

  ENEMY_GOBLIN = 123,
  PLAYER_DEFAULT = 24,

  CHAR_SCHOLAR = 15,

  CHAR_1 = 24,
  CHAR_2 = 25,
  CHAR_3 = 26,
  CHAR_4 = 27,
  CHAR_5 = 28,
  CHAR_6 = 29,
  CHAR_7 = 30,
  CHAR_8 = 31,
  CHAR_9 = 73,
}

/** AutoTileSprite
 * AI-generated comprehensive enum of all tiles in the tileset
 * Each value represents the linear index of a 16x16 pixel tile in the tileset image
 */
export enum AutoTileSprite {
  // ============================================================================
  // ROW 0 (Tiles 0-47): TERRAIN - FLOORS & BASIC TILES
  // ============================================================================
  VOID = 0,
  FLOOR_STONE = 1,
  FLOOR_WOOD = 2,
  FLOOR_DIRT = 3,
  FLOOR_GRASS = 4,
  FLOOR_SAND = 5,
  FLOOR_COBBLESTONE = 6,
  FLOOR_MARBLE = 7,
  FLOOR_TILE = 8,
  FLOOR_CARPET_RED = 9,
  FLOOR_CARPET_BLUE = 10,
  FLOOR_CARPET_GREEN = 11,
  FLOOR_CAVE = 12,
  FLOOR_ICE = 13,
  FLOOR_LAVA_EDGE = 14,
  FLOOR_WATER_SHALLOW = 15,
  FLOOR_CHECKERBOARD = 16,
  FLOOR_SNOW = 17, // Snowy terrain
  FLOOR_VOLCANIC_ROCK = 18, // Volcanic terrain
  FLOOR_SWAMP = 19, // Swamp terrain
  FLOOR_BEACH = 20, // Beach sand
  FLOOR_MOUNTAIN = 21, // Rocky mountain floor
  FLOOR_DESERT = 22, // Desert sand (different from beach)
  FLOOR_BARREN = 23, // Barren wasteland

  // ============================================================================
  // CHARACTERS - Columns 24-31, Rows 0-9 (Tiles 24-31, 72-79, 120-127, etc.)
  // ============================================================================

  // Row 0: Columns 24-31 (Player characters, human-like)
  CHAR_WARRIOR_1 = 24,
  CHAR_WARRIOR_2 = 25,
  CHAR_MAGE_1 = 26,
  CHAR_MAGE_2 = 27,
  CHAR_ROGUE_1 = 28,
  CHAR_ROGUE_2 = 29,
  CHAR_CLERIC_1 = 30,
  CHAR_CLERIC_2 = 31,

  // Row 1: Columns 24-31 (More player classes)
  CHAR_RANGER_1 = 72, // 48 + 24
  CHAR_RANGER_2 = 73,
  CHAR_PALADIN_1 = 74,
  CHAR_PALADIN_2 = 75,
  CHAR_DRUID_1 = 76,
  CHAR_DRUID_2 = 77,
  CHAR_BARD_1 = 78,
  CHAR_BARD_2 = 79,

  // Row 2: Columns 24-31 (NPCs)
  CHAR_MERCHANT_1 = 120, // 96 + 24
  CHAR_MERCHANT_2 = 121,
  CHAR_GUARD_1 = 122,
  CHAR_GUARD_2 = 123,
  CHAR_NOBLE_1 = 124,
  CHAR_NOBLE_2 = 125,
  CHAR_PEASANT_1 = 126,
  CHAR_PEASANT_2 = 127,

  // Row 3: Columns 24-31 (More NPCs)
  CHAR_WIZARD_1 = 168, // 144 + 24
  CHAR_WIZARD_2 = 169,
  CHAR_PRIEST_1 = 170,
  CHAR_PRIEST_2 = 171,
  CHAR_ELDER_1 = 172,
  CHAR_ELDER_2 = 173,
  CHAR_CHILD_1 = 174,
  CHAR_CHILD_2 = 175,

  // Row 4: Columns 24-31 (Common enemies)
  CHAR_GOBLIN_1 = 216, // 192 + 24
  CHAR_GOBLIN_2 = 217,
  CHAR_ORC_1 = 218,
  CHAR_ORC_2 = 219,
  CHAR_KOBOLD_1 = 220,
  CHAR_KOBOLD_2 = 221,
  CHAR_BANDIT_1 = 222,
  CHAR_BANDIT_2 = 223,

  // Row 5: Columns 24-31 (Undead enemies)
  CHAR_SKELETON_1 = 264, // 240 + 24
  CHAR_SKELETON_2 = 265,
  CHAR_ZOMBIE_1 = 266,
  CHAR_ZOMBIE_2 = 267,
  CHAR_GHOST_1 = 268,
  CHAR_GHOST_2 = 269,
  CHAR_WRAITH_1 = 270,
  CHAR_WRAITH_2 = 271,

  // Row 6: Columns 24-31 (Creatures)
  CHAR_WOLF_1 = 312, // 288 + 24
  CHAR_WOLF_2 = 313,
  CHAR_BEAR_1 = 314,
  CHAR_BEAR_2 = 315,
  CHAR_SPIDER_1 = 316,
  CHAR_SPIDER_2 = 317,
  CHAR_SNAKE_1 = 318,
  CHAR_SNAKE_2 = 319,

  // Row 7: Columns 24-31 (More creatures)
  CHAR_RAT_GIANT_1 = 360, // 336 + 24
  CHAR_RAT_GIANT_2 = 361,
  CHAR_BAT_1 = 362,
  CHAR_BAT_2 = 363,
  CHAR_SLIME_1 = 364,
  CHAR_SLIME_2 = 365,
  CHAR_DOG_1 = 366,
  CHAR_DOG_2 = 367,

  // Row 8: Columns 24-31 (Advanced enemies)
  CHAR_TROLL_1 = 408, // 384 + 24
  CHAR_TROLL_2 = 409,
  CHAR_OGRE_1 = 410,
  CHAR_OGRE_2 = 411,
  CHAR_MINOTAUR_1 = 412,
  CHAR_MINOTAUR_2 = 413,
  CHAR_DEMON_1 = 414,
  CHAR_DEMON_2 = 415,

  // Row 9: Columns 24-31 (Bosses and special)
  CHAR_DRAGON_1 = 456, // 432 + 24
  CHAR_DRAGON_2 = 457,
  CHAR_LICH_1 = 458,
  CHAR_LICH_2 = 459,
  CHAR_VAMPIRE_1 = 460,
  CHAR_VAMPIRE_2 = 461,
  CHAR_BOSS_1 = 462,
  CHAR_BOSS_2 = 463,

  // Legacy character aliases (for backward compatibility)
  PLAYER_WARRIOR = 24, // CHAR_WARRIOR_1
  PLAYER_WARRIOR_1 = 24, // CHAR_WARRIOR_1
  PLAYER_WARRIOR_2 = 25, // CHAR_WARRIOR_2

  // ============================================================================
  // ROW 1 (Tiles 48-95): TERRAIN - WALLS
  // ============================================================================
  WALL_STONE = 48,
  WALL_STONE_DARK = 49,
  WALL_BRICK = 50,
  WALL_BRICK_RED = 51,
  WALL_WOOD = 52,
  WALL_CAVE = 53,
  WALL_DUNGEON = 54,
  WALL_CASTLE = 55,
  WALL_ICE = 56,
  WALL_METAL = 57,
  WALL_ROCK = 58,
  WALL_MOSSY = 59,
  WALL_CRACKED = 60,
  WALL_REINFORCED = 61,
  WALL_GLASS = 62,
  WALL_OBSIDIAN = 63,

  // ============================================================================
  // ROW 2 (Tiles 96-143): TERRAIN - DOORS & PASSAGES
  // ============================================================================
  DOOR_CLOSED_WOOD = 96,
  DOOR_OPEN_WOOD = 97,
  DOOR_CLOSED_METAL = 98,
  DOOR_OPEN_METAL = 99,
  DOOR_LOCKED = 100,
  DOOR_BROKEN = 101,
  STAIRS_UP = 102,
  STAIRS_DOWN = 103,
  LADDER_UP = 104,
  LADDER_DOWN = 105,
  PORTAL_BLUE = 106,
  PORTAL_RED = 107,
  PORTAL_GREEN = 108,
  PORTAL_PURPLE = 109,
  GATE_CLOSED = 110,
  GATE_OPEN = 111,

  // ============================================================================
  // ROW 3 (Tiles 144-191): TERRAIN - LIQUIDS & HAZARDS
  // ============================================================================
  WATER_DEEP = 144,
  WATER_SHALLOW = 145,
  WATER_MURKY = 146,
  LAVA = 147,
  LAVA_BUBBLING = 148,
  POISON_POOL = 149,
  ACID_POOL = 150,
  QUICKSAND = 151,
  CHASM = 152,
  SPIKE_TRAP = 153,
  FIRE_TRAP = 154,
  PRESSURE_PLATE = 155,
  ARROW_TRAP = 156,
  PIT_TRAP = 157,
  MAGIC_BARRIER = 158,

  // ============================================================================
  // ROW 4 (Tiles 192-239): OBJECTS - CONTAINERS & FURNITURE
  // ============================================================================
  CHEST_CLOSED = 192,
  CHEST_OPEN = 193,
  CHEST_LOCKED = 194,
  CHEST_TRAPPED = 195,
  BARREL = 196,
  CRATE = 197,
  POT = 198,
  VASE = 199,
  TABLE_WOOD = 200,
  TABLE_STONE = 201,
  CHAIR = 202,
  THRONE = 203,
  BED = 204,
  BOOKSHELF = 205,
  ALTAR = 206,
  STATUE = 207,

  // ============================================================================
  // ROW 5 (Tiles 240-287): OBJECTS - DECORATIVE & INTERACTIVE
  // ============================================================================
  TORCH_WALL = 240,
  TORCH_STAND = 241,
  CANDLE = 242,
  BRAZIER = 243,
  FOUNTAIN = 244,
  WELL = 245,
  ANVIL = 246,
  FORGE = 247,
  LEVER_UP = 248,
  LEVER_DOWN = 249,
  BUTTON = 250,
  CRYSTAL_BLUE = 251,
  CRYSTAL_RED = 252,
  CRYSTAL_GREEN = 253,
  ORB_GLOWING = 254,
  BANNER = 255,

  // ============================================================================
  // ROW 6 (Tiles 288-335): ITEMS - WEAPONS
  // ============================================================================
  SWORD_SHORT = 288,
  SWORD_LONG = 289,
  SWORD_GREAT = 290,
  DAGGER = 291,
  SPEAR = 292,
  AXE = 293,
  AXE_BATTLE = 294,
  MACE = 295,
  HAMMER = 296,
  STAFF_WOOD = 297,
  STAFF_MAGIC = 298,
  BOW = 299,
  CROSSBOW = 300,
  ARROW = 301,
  BOLT = 302,
  WAND = 303,

  // ============================================================================
  // ROW 7 (Tiles 336-383): ITEMS - ARMOR & EQUIPMENT
  // ============================================================================
  HELMET_LEATHER = 336,
  HELMET_IRON = 337,
  HELMET_STEEL = 338,
  ARMOR_LEATHER = 339,
  ARMOR_CHAIN = 340,
  ARMOR_PLATE = 341,
  SHIELD_WOOD = 342,
  SHIELD_IRON = 343,
  SHIELD_STEEL = 344,
  BOOTS = 345,
  GLOVES = 346,
  RING = 347,
  AMULET = 348,
  CLOAK = 349,
  BELT = 350,
  BACKPACK = 351,

  // ============================================================================
  // ROW 8 (Tiles 384-431): ITEMS - CONSUMABLES
  // ============================================================================
  POTION_RED = 384,
  POTION_BLUE = 385,
  POTION_GREEN = 386,
  POTION_YELLOW = 387,
  POTION_PURPLE = 388,
  POTION_ORANGE = 389,
  FLASK_EMPTY = 390,
  SCROLL = 391,
  BOOK_RED = 392,
  BOOK_BLUE = 393,
  BOOK_GREEN = 394,
  TOME = 395,
  FOOD_BREAD = 396,
  FOOD_MEAT = 397,
  FOOD_CHEESE = 398,
  FOOD_APPLE = 399,

  // ============================================================================
  // ROW 9 (Tiles 432-479): ITEMS - TREASURE & COLLECTIBLES
  // ============================================================================
  COIN_GOLD = 432,
  COIN_SILVER = 433,
  COIN_COPPER = 434,
  COIN_PILE = 435,
  GEM_DIAMOND = 436,
  GEM_RUBY = 437,
  GEM_SAPPHIRE = 438,
  GEM_EMERALD = 439,
  CROWN = 440,
  SCEPTER = 441,
  CHALICE = 442,
  KEY_GOLD = 443,
  KEY_SILVER = 444,
  KEY_BRONZE = 445,
  KEY_SKELETON = 446,
  TREASURE_PILE = 447,

  // ============================================================================
  // ROW 10 (Tiles 480-527): CHARACTERS - PLAYER & ALLIES
  // ============================================================================
  PLAYER_MAGE = 481,
  PLAYER_ROGUE = 482,
  PLAYER_CLERIC = 483,
  PLAYER_RANGER = 484,
  PLAYER_PALADIN = 485,
  PLAYER_DRUID = 486,
  PLAYER_BARD = 487,
  NPC_MERCHANT = 488,
  NPC_GUARD = 489,
  NPC_NOBLE = 490,
  NPC_PEASANT = 491,
  NPC_WIZARD = 492,
  NPC_PRIEST = 493,
  COMPANION_DOG = 494,
  COMPANION_CAT = 495,

  // ============================================================================
  // ROW 11 (Tiles 528-575): ENEMIES - COMMON
  // ============================================================================
  ENEMY_GOBLIN = 528,
  ENEMY_ORC = 529,
  ENEMY_KOBOLD = 530,
  ENEMY_SKELETON = 531,
  ENEMY_ZOMBIE = 532,
  ENEMY_GHOST = 533,
  ENEMY_SLIME_GREEN = 534,
  ENEMY_SLIME_BLUE = 535,
  ENEMY_RAT_GIANT = 536,
  ENEMY_BAT = 537,
  ENEMY_SPIDER = 538,
  ENEMY_SNAKE = 539,
  ENEMY_WOLF = 540,
  ENEMY_BEAR = 541,
  ENEMY_BANDIT = 542,
  ENEMY_CULTIST = 543,

  // ============================================================================
  // ROW 12 (Tiles 576-623): ENEMIES - ADVANCED
  // ============================================================================
  ENEMY_TROLL = 576,
  ENEMY_OGRE = 577,
  ENEMY_MINOTAUR = 578,
  ENEMY_GOLEM_STONE = 579,
  ENEMY_GOLEM_IRON = 580,
  ENEMY_ELEMENTAL_FIRE = 581,
  ENEMY_ELEMENTAL_WATER = 582,
  ENEMY_ELEMENTAL_AIR = 583,
  ENEMY_ELEMENTAL_EARTH = 584,
  ENEMY_DEMON = 585,
  ENEMY_IMP = 586,
  ENEMY_WRAITH = 587,
  ENEMY_VAMPIRE = 588,
  ENEMY_WEREWOLF = 589,
  ENEMY_LICH = 590,
  ENEMY_NECROMANCER = 591,

  // ============================================================================
  // ROW 13 (Tiles 624-671): ENEMIES - BOSSES & DRAGONS
  // ============================================================================
  BOSS_DRAGON_RED = 624,
  BOSS_DRAGON_BLUE = 625,
  BOSS_DRAGON_GREEN = 626,
  BOSS_DRAGON_BLACK = 627,
  BOSS_DEMON_LORD = 628,
  BOSS_LICH_KING = 629,
  BOSS_GIANT = 630,
  BOSS_HYDRA = 631,
  BOSS_BEHOLDER = 632,
  BOSS_MIND_FLAYER = 633,
  BOSS_ANCIENT_WYRM = 634,
  BOSS_DARK_KNIGHT = 635,
  BOSS_ARCHMAGE = 636,
  BOSS_VAMPIRE_LORD = 637,
  BOSS_DEATH_KNIGHT = 638,
  BOSS_PRIMORDIAL = 639,

  // ============================================================================
  // ROW 14 (Tiles 672-719): EFFECTS & PARTICLES
  // ============================================================================
  EFFECT_EXPLOSION = 672,
  EFFECT_SMOKE = 673,
  EFFECT_FIRE = 674,
  EFFECT_ICE = 675,
  EFFECT_LIGHTNING = 676,
  EFFECT_POISON_CLOUD = 677,
  EFFECT_HEAL = 678,
  EFFECT_BUFF = 679,
  EFFECT_DEBUFF = 680,
  EFFECT_SPARKLE = 681,
  EFFECT_BLOOD = 682,
  EFFECT_DUST = 683,
  PROJECTILE_FIREBALL = 684,
  PROJECTILE_ICEBALL = 685,
  PROJECTILE_LIGHTNING = 686,
  PROJECTILE_ARROW = 687,

  // ============================================================================
  // ROW 15 (Tiles 720-767): UI & ICONS
  // ============================================================================
  ICON_HEART_FULL = 720,
  ICON_HEART_HALF = 721,
  ICON_HEART_EMPTY = 722,
  ICON_STAR = 723,
  ICON_SKULL = 724,
  ICON_SWORD_CROSSED = 725,
  ICON_SHIELD_EMBLEM = 726,
  ICON_MAGIC_SYMBOL = 727,
  ICON_CURSOR = 728,
  ICON_TARGET = 729,
  ICON_QUESTION = 730,
  ICON_EXCLAMATION = 731,
  ICON_CHECK = 732,
  ICON_CROSS = 733,
  ICON_ARROW_UP = 734,
  ICON_ARROW_DOWN = 735,
}

/**
 * Tile categories for organizing sprites
 */
export enum TileCategory {
  ENVIRONMENT, // Terrain, walls, doors, liquids, hazards
  CHARACTER, // Player, NPCs, enemies, bosses, creatures
  ITEM, // Weapons, armor, consumables, treasure
  OBJECT, // Containers, furniture, decorative props
  EFFECT, // Visual effects, particles, projectiles
  ICON, // UI icons and symbols
  FONT, // (Reserved for future text rendering)
  OTHER,
}

/**
 * Tile subcategories for more specific classification
 */
export enum TileSubcategory {
  // Environment subcategories
  FLOOR,
  WALL,
  DOOR,
  PASSAGE, // Stairs, ladders, portals, gates
  LIQUID,
  HAZARD,
  TRAP, // Spike traps, fire traps, arrow traps, etc.

  // Object subcategories
  CONTAINER,
  FURNITURE,
  PROP,
  INTERACTIVE, // Levers, buttons, pressure plates

  // Item subcategories
  WEAPON,
  ARMOR,
  EQUIPMENT, // Rings, amulets, cloaks, belts, backpacks
  CONSUMABLE,
  FOOD, // Bread, meat, cheese, apple
  POTION, // All potion types
  SCROLL_BOOK, // Scrolls, books, tomes
  TREASURE,
  CURRENCY, // Gold, silver, copper coins
  GEM, // Diamonds, rubies, sapphires, emeralds
  KEY, // Gold, silver, bronze, skeleton keys

  // Character subcategories
  PLAYER,
  NPC,
  COMPANION,
  ENEMY_COMMON,
  ENEMY_UNDEAD,
  ENEMY_CREATURE,
  ENEMY_ADVANCED,
  BOSS,

  // Effect subcategories
  EFFECT,
  PARTICLE,
  PROJECTILE,

  // UI subcategories
  ICON,
  OTHER,
}

interface TileRect {
  start: LJS.Vector2;
  end: LJS.Vector2;
}

/**
 * Tile zones define the rectangular areas in the tileset image that correspond to each tile category.
 *
 * These zones help in categorizing tiles based on their position in the tileset.
 *
 * @example
 * ```typescript
 * const environmentZones = TileZones.get(TileCategory.ENVIRONMENT);
 * ```
 * @todo Refine zones.
 */
const TileZones: Map<TileCategory, TileRect[]> = new Map<
  TileCategory,
  TileRect[]
>();

TileZones.set(TileCategory.ENVIRONMENT, [
  { start: LJS.vec2(0, 0), end: LJS.vec2(6, 23) },
]);

TileZones.set(TileCategory.CHARACTER, [
  { start: LJS.vec2(24, 0), end: LJS.vec2(31, 9) },
]);

TileZones.set(TileCategory.ITEM, [
  { start: LJS.vec2(32, 0), end: LJS.vec2(48, 9) },
]);

TileZones.set(TileCategory.OBJECT, [
  { start: LJS.vec2(0, 1), end: LJS.vec2(7, 2) },
]);

TileZones.set(TileCategory.ICON, [
  { start: LJS.vec2(24, 10), end: LJS.vec2(47, 13) },
  { start: LJS.vec2(19, 14), end: LJS.vec2(47, 21) },
]);

TileZones.set(TileCategory.FONT, []);

/**
 * Tile subzones define the rectangular areas in the tileset image that correspond to each tile subcategory.
 *
 * These subzones help in further classifying tiles based on their position in the tileset.
 *
 * @example
 * ```typescript
 * const floorSubzones = TileSubzones.get(TileSubcategory.FLOOR);
 * ```
 * @todo Refine zones.
 */
const TileSubzones: Map<TileSubcategory, TileRect[]> = new Map<
  TileSubcategory,
  TileRect[]
>();

/*  // Environment subcategories
FLOOR,
WALL,
DOOR,
PASSAGE, // Stairs, ladders, portals, gates
LIQUID,
HAZARD,
TRAP, // Spike traps, fire traps, arrow traps, etc.

// Object subcategories
CONTAINER,
FURNITURE,
PROP,
INTERACTIVE, // Levers, buttons, pressure plates

// Item subcategories
WEAPON,
ARMOR,
EQUIPMENT, // Rings, amulets, cloaks, belts, backpacks
CONSUMABLE,
FOOD, // Bread, meat, cheese, apple
POTION, // All potion types
SCROLL_BOOK, // Scrolls, books, tomes
TREASURE,
CURRENCY, // Gold, silver, copper coins
GEM, // Diamonds, rubies, sapphires, emeralds
KEY, // Gold, silver, bronze, skeleton keys

// Character subcategories
PLAYER,
NPC,
COMPANION,
ENEMY_COMMON,
ENEMY_UNDEAD,
ENEMY_CREATURE,
ENEMY_ADVANCED,
BOSS,

// Effect subcategories
EFFECT,
PARTICLE,
PROJECTILE,

// UI subcategories
ICON,
OTHER,
*/

/**
 * Get the category for a given tile sprite
 *
 * Determines the category based on the sprite's position in the tileset.
 *
 * @param sprite - The tile sprite index
 * @returns The tile category
 *
 * @example
 * ```typescript
 * const category = getTileCategory(AutoTileSprite.PLAYER_WARRIOR);
 * // Returns TileCategory.CHARACTER
 * ```
 */
export function getTileCategory(sprite: number): TileCategory {
  const coords = getTileCoords(sprite);

  for (const [category, zones] of TileZones) {
    for (const zone of zones) {
      if (
        coords.x >= zone.start.x &&
        coords.x <= zone.end.x &&
        coords.y >= zone.start.y &&
        coords.y <= zone.end.y
      ) {
        return category;
      }
    }
  }

  return TileCategory.OTHER;
}

/**
 * Get the subcategory for a given tile sprite
 *
 * Provides more specific classification based on sprite position.
 *
 * @param sprite - The tile sprite index
 * @returns The tile subcategory
 *
 * @example
 * ```typescript
 * const subcategory = getTileSubcategory(AutoTileSprite.FLOOR_STONE);
 * // Returns TileSubcategory.FLOOR
 * ```
 */
export function getTileSubcategory(sprite: number): TileSubcategory {
  const coords = getTileCoords(sprite);

  for (const [subcategory, zones] of TileSubzones) {
    for (const zone of zones) {
      if (
        coords.x >= zone.start.x &&
        coords.x <= zone.end.x &&
        coords.y >= zone.start.y &&
        coords.y <= zone.end.y
      ) {
        return subcategory;
      }
    }
  }

  return TileSubcategory.OTHER;
}

/**
 * Full categorization of a tile
 *
 * Represents all the categories and subcategories that fit a tile.
 *
 * @interface TileCategorization
 */
interface TileCategorization {
  tileCategories: TileCategory[];
  tileSubcategories: TileSubcategory[];
}

/**
 * Get the full tile categorization (tile categories and subcategories) for a given tile sprite
 *
 * @export
 * @param {number} sprite
 * @return {*}  {TileCategorization}
 */
export function getTileCategorization(sprite: number): TileCategorization {
  const coords = getTileCoords(sprite);
  const categories = [];
  const subcategories = [];

  for (const [category, zones] of TileZones) {
    for (const zone of zones) {
      if (
        coords.x >= zone.start.x &&
        coords.x <= zone.end.x &&
        coords.y >= zone.start.y &&
        coords.y <= zone.end.y
      ) {
        categories.push(category);
      }
    }
  }

  for (const [subcategory, zones] of TileSubzones) {
    for (const zone of zones) {
      if (
        coords.x >= zone.start.x &&
        coords.x <= zone.end.x &&
        coords.y >= zone.start.y &&
        coords.y <= zone.end.y
      ) {
        subcategories.push(subcategory);
      }
    }
  }

  if (categories.length === 0) categories.push(TileCategory.OTHER);
  if (subcategories.length === 0) subcategories.push(TileSubcategory.OTHER);

  return { tileCategories: categories, tileSubcategories: subcategories };
}

// ============================================================================
// LEGACY CONSTANTS (for backward compatibility)
// ============================================================================

/** @deprecated Use CuratedTileSprite.CHAR_1 instead */
export const SPRITE_PLAYER = CuratedTileSprite.CHAR_1;

/** @deprecated Use CuratedTileSprite.ENEMY_GOBLIN instead */
export const SPRITE_ENEMY = CuratedTileSprite.ENEMY_GOBLIN;

/** @deprecated Use CuratedTileSprite.CHAR_2 instead (NPC merchant not documented in curated set) */
export const SPRITE_NPC = CuratedTileSprite.CHAR_2;

/** @deprecated Use resolveTileInfo('BOSS_DRAGON') instead (not documented in curated set, using placeholder) */
export const SPRITE_BOSS = CuratedTileSprite.CHAR_9; // Placeholder

/** @deprecated Use CuratedTileSprite.MONSTER_SPIDER instead */
export const SPRITE_FLEEING_CREATURE = CuratedTileSprite.MONSTER_SPIDER;

/** @deprecated Use CuratedTileSprite.FLOOR_STONE instead */
export const SPRITE_FLOOR = CuratedTileSprite.FLOOR_STONE;

/** @deprecated Use resolveTileInfo('WALL_STONE') instead (not documented in curated set) */
export const SPRITE_WALL = 48; // Fallback to numeric index

/** @deprecated Use CuratedTileSprite.DOOR_OPEN instead */
export const SPRITE_DOOR_OPEN = CuratedTileSprite.DOOR_OPEN;

/** @deprecated Use CuratedTileSprite.DOOR_CLOSED instead */
export const SPRITE_DOOR_CLOSED = CuratedTileSprite.DOOR_CLOSED;

/** @deprecated Use CuratedTileSprite.STAIRS_UP instead */
export const SPRITE_STAIRS_UP = CuratedTileSprite.STAIRS_UP;

/** @deprecated Use CuratedTileSprite.STAIRS_DOWN instead */
export const SPRITE_STAIRS_DOWN = CuratedTileSprite.STAIRS_DOWN;

/** @deprecated Use resolveTileInfo('WATER') instead (not documented in curated set) */
export const SPRITE_WATER = CuratedTileSprite.FLOOR_PUDDLE; // Closest match

/** @deprecated Use CuratedTileSprite.FLOOR_GRASS instead */
export const SPRITE_GRASS = CuratedTileSprite.FLOOR_GRASS;

/** @deprecated Use CuratedTileSprite.VOID instead */
export const SPRITE_VOID = CuratedTileSprite.VOID;

/** @deprecated Use resolveTileInfo('SWORD') instead (not documented in curated set) */
export const SPRITE_SWORD = 575; // Fallback to numeric index

/** @deprecated Use resolveTileInfo('SHIELD') instead (not documented in curated set) */
export const SPRITE_SHIELD = 624; // Fallback to numeric index

/** @deprecated Use resolveTileInfo('POTION_RED') instead (not documented in curated set) */
export const SPRITE_POTION_HEALTH = 657; // Fallback to numeric index

/** @deprecated Use resolveTileInfo('POTION_BLUE') instead (not documented in curated set) */
export const SPRITE_POTION_MANA = 658; // Fallback to numeric index

/** @deprecated Use resolveTileInfo('COIN') instead (not documented in curated set) */
export const SPRITE_COIN = 721; // Fallback to numeric index

/** @deprecated Use CuratedTileSprite.CHEST_CLOSED instead */
export const SPRITE_CHEST = CuratedTileSprite.CHEST_CLOSED;

/** @deprecated Use resolveTileInfo('ICON_HEART_FULL') instead (not documented in curated set) */
export const SPRITE_HEART = 560; // Fallback to numeric index

/** @deprecated Use resolveTileInfo('ICON_STAR') instead (not documented in curated set) */
export const SPRITE_STAR = 561; // Fallback to numeric index

/** @deprecated Use resolveTileInfo('ICON_SKULL') instead (not documented in curated set) */
export const SPRITE_SKULL = 562; // Fallback to numeric index

// ============================================================================
// HELPER FUNCTION
// ============================================================================

/**
 * Convert a sprite index to tileset coordinates
 *
 * LittleJS TileInfo expects (x, y) coordinates in the tileset grid.
 * This helper converts a linear index to grid coordinates.
 *
 * @param index - The sprite index
 * @param tilesetWidth - Width of tileset in tiles (default: 49)
 * @returns Object with x and y coordinates
 *
 * @example
 * ```typescript
 * const coords = getTileCoords(TileSprite.PLAYER_WARRIOR);
 * const tileInfo = new LJS.TileInfo(vec2(coords.x * 16, coords.y * 16), vec2(16, 16), 0);
 * ```
 */
export function getTileCoords(
  index: number,
  tilesetWidth: number = 49
): { x: number; y: number } {
  return {
    x: index % tilesetWidth,
    y: Math.floor(index / tilesetWidth),
  };
}

/**
 * Convert tileset coordinates to a sprite index
 *
 * This is the inverse of getTileCoords(). Converts grid coordinates
 * back to a linear sprite index.
 *
 * @param x - X coordinate in the tileset grid
 * @param y - Y coordinate in the tileset grid
 * @param tilesetWidth - Width of tileset in tiles (default: 49)
 * @returns The sprite index
 *
 * @example
 * ```typescript
 * // Get the sprite at position (24, 0) - should be PLAYER_WARRIOR
 * const index = getTileIndex(24, 0); // Returns 24
 *
 * // Verify round-trip conversion
 * const coords = getTileCoords(TileSprite.PLAYER_WARRIOR);
 * const index = getTileIndex(coords.x, coords.y); // Returns original sprite value
 * ```
 */
export function getTileIndex(
  x: number,
  y: number,
  tilesetWidth: number = 49
): number {
  return y * tilesetWidth + x;
}

// ============================================================================
// TILESET RESOLVER INTEGRATION
// ============================================================================

/**
 * Export CuratedTileSprite - The curated, hand-documented tileset
 * This is the primary tile sprite enum to use in your game code.
 *
 * CuratedTileSprite replaces AutoTileSprite and provides:
 * - Manually documented tiles with meaningful names
 * - Alias support (e.g., ENEMY_GOBLIN, MONSTER_SPIDER)
 * - Category and subcategory mappings
 *
 * @see tileConfig_generated.ts for the full enum and documentation
 */
export { CuratedTileSprite } from './tileConfig_generated';

/**
 * Re-export TileSpriteResolver utilities for convenient access
 *
 * These functions integrate with the tileset configuration system to allow
 * dynamic sprite mapping based on the active tileset configuration.
 *
 * @see tileSpriteResolver.ts for full implementation
 */
export {
  TileSpriteResolver,
  getTileSpriteResolver,
  resolveTileSprite,
  resolveTileSpriteCoords,
  resolveTileInfo,
  setTilesetConfiguration,
} from './tileSpriteResolver';
