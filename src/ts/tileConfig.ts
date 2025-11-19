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

/**Do you see any more categories and subcategories to implement? Based on #sym:TileSprite and #file:tileset.png

 TileSprite
 * Comprehensive enum of all tiles in the tileset
 * Each value represents the linear index of a 16x16 pixel tile in the tileset image
 */
export enum TileSprite {
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
 * @todo Add a curated selection of tile sprites.
 */
export enum CuratedTileSprite {}

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
  position: LJS.Vector2;
  size: LJS.Vector2;
}

/**
 * @todo Add zones.
 */
const TileZones: Map<string, TileRect> = new Map<string, TileRect>();

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
 * const category = getTileCategory(TileSprite.PLAYER_WARRIOR);
 * // Returns TileCategory.CHARACTER
 * ```
 */
export function getTileCategory(sprite: TileSprite): TileCategory {
  const coords = getTileCoords(sprite);

  // Characters: columns 24-31, rows 0-9 (new character layout)
  if (coords.x >= 24 && coords.x <= 31 && coords.y >= 0 && coords.y <= 9) {
    return TileCategory.CHARACTER;
  }

  // Characters: rows 10-13 (legacy player, NPCs, enemies, bosses)
  if (coords.y >= 10 && coords.y <= 13) {
    return TileCategory.CHARACTER;
  }

  // Environment: floors (row 0, cols 0-23)
  if (coords.y === 0 && coords.x < 24) {
    return TileCategory.ENVIRONMENT;
  }

  // Environment: walls (row 1)
  if (coords.y === 1) {
    return TileCategory.ENVIRONMENT;
  }

  // Environment: doors/passages (row 2)
  if (coords.y === 2) {
    return TileCategory.ENVIRONMENT;
  }

  // Environment: liquids/hazards (row 3)
  if (coords.y === 3) {
    return TileCategory.ENVIRONMENT;
  }

  // Objects: containers/furniture (row 4)
  if (coords.y === 4) {
    return TileCategory.OBJECT;
  }

  // Objects: decorative/interactive (row 5)
  if (coords.y === 5) {
    return TileCategory.OBJECT;
  }

  // Items: weapons (row 6)
  if (coords.y === 6) {
    return TileCategory.ITEM;
  }

  // Items: armor/equipment (row 7)
  if (coords.y === 7) {
    return TileCategory.ITEM;
  }

  // Items: consumables (row 8)
  if (coords.y === 8) {
    return TileCategory.ITEM;
  }

  // Items: treasure/collectibles (row 9)
  if (coords.y === 9) {
    return TileCategory.ITEM;
  }

  // Effects: particles/projectiles (row 14)
  if (coords.y === 14) {
    return TileCategory.EFFECT;
  }

  // Icons: UI elements (row 15)
  if (coords.y === 15) {
    return TileCategory.ICON;
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
 * const subcategory = getTileSubcategory(TileSprite.FLOOR_STONE);
 * // Returns TileSubcategory.FLOOR
 * ```
 */
export function getTileSubcategory(sprite: TileSprite): TileSubcategory {
  const coords = getTileCoords(sprite);

  // Row 0: Floors (cols 0-23)
  if (coords.y === 0 && coords.x < 24) {
    return TileSubcategory.FLOOR;
  }

  // Row 0: Characters columns 24-31 (Player characters, human-like)
  if (coords.y === 0 && coords.x >= 24 && coords.x <= 31) {
    return TileSubcategory.PLAYER;
  }

  // Row 1: Walls (cols 0-23)
  if (coords.y === 1 && coords.x < 24) {
    return TileSubcategory.WALL;
  }

  // Row 1: Characters columns 24-31 (More player classes)
  if (coords.y === 1 && coords.x >= 24 && coords.x <= 31) {
    return TileSubcategory.PLAYER;
  }

  // Row 2: Doors and passages (cols 0-23)
  if (coords.y === 2 && coords.x < 24) {
    return TileSubcategory.DOOR;
  }

  // Row 2: Characters columns 24-31 (NPCs)
  if (coords.y === 2 && coords.x >= 24 && coords.x <= 31) {
    return TileSubcategory.NPC;
  }

  // Row 3: Liquids and hazards (cols 0-23)
  if (coords.y === 3 && coords.x < 24) {
    return TileSubcategory.LIQUID;
  }

  // Row 3: Characters columns 24-31 (More NPCs)
  if (coords.y === 3 && coords.x >= 24 && coords.x <= 31) {
    return TileSubcategory.NPC;
  }

  // Row 4: Containers and furniture (cols 0-23)
  if (coords.y === 4 && coords.x < 24) {
    return TileSubcategory.CONTAINER;
  }

  // Row 4: Characters columns 24-31 (Common enemies)
  if (coords.y === 4 && coords.x >= 24 && coords.x <= 31) {
    return TileSubcategory.ENEMY_COMMON;
  }

  // Row 5: Decorative and interactive props (cols 0-23)
  if (coords.y === 5 && coords.x < 24) {
    return TileSubcategory.PROP;
  }

  // Row 5: Characters columns 24-31 (Undead enemies)
  if (coords.y === 5 && coords.x >= 24 && coords.x <= 31) {
    return TileSubcategory.ENEMY_UNDEAD;
  }

  // Row 6: Weapons (cols 0-23)
  if (coords.y === 6 && coords.x < 24) {
    return TileSubcategory.WEAPON;
  }

  // Row 6: Characters columns 24-31 (Creatures)
  if (coords.y === 6 && coords.x >= 24 && coords.x <= 31) {
    return TileSubcategory.ENEMY_CREATURE;
  }

  // Row 7: Armor and equipment (cols 0-23)
  if (coords.y === 7 && coords.x < 24) {
    return TileSubcategory.ARMOR;
  }

  // Row 7: Characters columns 24-31 (More creatures)
  if (coords.y === 7 && coords.x >= 24 && coords.x <= 31) {
    return TileSubcategory.ENEMY_CREATURE;
  }

  // Row 8: Consumables (cols 0-23)
  if (coords.y === 8 && coords.x < 24) {
    return TileSubcategory.CONSUMABLE;
  }

  // Row 8: Characters columns 24-31 (Advanced enemies)
  if (coords.y === 8 && coords.x >= 24 && coords.x <= 31) {
    return TileSubcategory.ENEMY_ADVANCED;
  }

  // Row 9: Treasure and collectibles (cols 0-23)
  if (coords.y === 9 && coords.x < 24) {
    return TileSubcategory.TREASURE;
  }

  // Row 9: Characters columns 24-31 (Bosses and special)
  if (coords.y === 9 && coords.x >= 24 && coords.x <= 31) {
    return TileSubcategory.BOSS;
  }

  // Row 10: Player and allies
  if (coords.y === 10) {
    return TileSubcategory.PLAYER;
  }

  // Row 11: Common enemies
  if (coords.y === 11) {
    return TileSubcategory.ENEMY_COMMON;
  }

  // Row 12: Advanced enemies
  if (coords.y === 12) {
    return TileSubcategory.ENEMY_ADVANCED;
  }

  // Row 13: Bosses
  if (coords.y === 13) {
    return TileSubcategory.BOSS;
  }

  // Row 14: Effects and particles
  if (coords.y === 14) {
    return TileSubcategory.EFFECT;
  }

  // Row 15: UI and icons
  if (coords.y === 15) {
    return TileSubcategory.ICON;
  }

  return TileSubcategory.OTHER;
}

// ============================================================================
// LEGACY CONSTANTS (for backward compatibility)
// ============================================================================

/** @deprecated Use TileSprite.PLAYER_WARRIOR instead */
export const SPRITE_PLAYER = TileSprite.PLAYER_WARRIOR;

/** @deprecated Use TileSprite.ENEMY_GOBLIN instead */
export const SPRITE_ENEMY = TileSprite.ENEMY_GOBLIN;

/** @deprecated Use TileSprite.NPC_MERCHANT instead */
export const SPRITE_NPC = TileSprite.NPC_MERCHANT;

/** @deprecated Use TileSprite.BOSS_DRAGON_RED instead */
export const SPRITE_BOSS = TileSprite.BOSS_DRAGON_RED;

/** @deprecated Use TileSprite.ENEMY_RAT_GIANT instead */
export const SPRITE_FLEEING_CREATURE = TileSprite.ENEMY_RAT_GIANT;

/** @deprecated Use TileSprite.FLOOR_STONE instead */
export const SPRITE_FLOOR = TileSprite.FLOOR_STONE;

/** @deprecated Use TileSprite.WALL_STONE instead */
export const SPRITE_WALL = TileSprite.WALL_STONE;

/** @deprecated Use TileSprite.DOOR_OPEN_WOOD instead */
export const SPRITE_DOOR_OPEN = TileSprite.DOOR_OPEN_WOOD;

/** @deprecated Use TileSprite.DOOR_CLOSED_WOOD instead */
export const SPRITE_DOOR_CLOSED = TileSprite.DOOR_CLOSED_WOOD;

/** @deprecated Use TileSprite.STAIRS_UP instead */
export const SPRITE_STAIRS_UP = TileSprite.STAIRS_UP;

/** @deprecated Use TileSprite.STAIRS_DOWN instead */
export const SPRITE_STAIRS_DOWN = TileSprite.STAIRS_DOWN;

/** @deprecated Use TileSprite.WATER_DEEP instead */
export const SPRITE_WATER = TileSprite.WATER_DEEP;

/** @deprecated Use TileSprite.FLOOR_GRASS instead */
export const SPRITE_GRASS = TileSprite.FLOOR_GRASS;

/** @deprecated Use TileSprite.VOID instead */
export const SPRITE_VOID = TileSprite.VOID;

/** @deprecated Use TileSprite.SWORD_SHORT instead */
export const SPRITE_SWORD = TileSprite.SWORD_SHORT;

/** @deprecated Use TileSprite.SHIELD_WOOD instead */
export const SPRITE_SHIELD = TileSprite.SHIELD_WOOD;

/** @deprecated Use TileSprite.POTION_RED instead */
export const SPRITE_POTION_HEALTH = TileSprite.POTION_RED;

/** @deprecated Use TileSprite.POTION_BLUE instead */
export const SPRITE_POTION_MANA = TileSprite.POTION_BLUE;

/** @deprecated Use TileSprite.COIN_GOLD instead */
export const SPRITE_COIN = TileSprite.COIN_GOLD;

/** @deprecated Use TileSprite.CHEST_CLOSED instead */
export const SPRITE_CHEST = TileSprite.CHEST_CLOSED;

/** @deprecated Use TileSprite.ICON_HEART_FULL instead */
export const SPRITE_HEART = TileSprite.ICON_HEART_FULL;

/** @deprecated Use TileSprite.ICON_STAR instead */
export const SPRITE_STAR = TileSprite.ICON_STAR;

/** @deprecated Use TileSprite.ICON_SKULL instead */
export const SPRITE_SKULL = TileSprite.ICON_SKULL;

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
 * @param tilesetWidth - Width of tileset in tiles (default: 48)
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
  tilesetWidth: number = 48
): { x: number; y: number } {
  return {
    x: index % tilesetWidth,
    y: Math.floor(index / tilesetWidth),
  };
}
