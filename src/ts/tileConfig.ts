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

/**
 * Tileset Configuration - Sprite index mappings
 *
 * This file contains all sprite indices for the game's tileset.
 * The tileset is a 16x16 tile grid where each tile is 16x16 pixels.
 *
 * Tileset layout:
 * - Index 0 = top-left tile (position x=0, y=0)
 * - Indices increase left-to-right, top-to-bottom
 * - For a 16-tile-wide tileset: tile at (x, y) = y * 16 + x
 * - Total tiles: 256 (16 columns × 16 rows)
 *
 * @example
 * ```typescript
 * // Using enum values
 * import { TileSprite } from './tileConfig';
 * const tileInfo = new LJS.TileInfo(vec2(TileSprite.PLAYER % 16, Math.floor(TileSprite.PLAYER / 16)));
 * ```
 */

/**
 * Comprehensive enum of all tiles in the tileset
 * Each value represents the linear index of a 16x16 pixel tile in the tileset image
 */
export enum TileSprite {
  // ============================================================================
  // ROW 0 (Tiles 0-15): TERRAIN - FLOORS & BASIC TILES
  // ============================================================================
  FLOOR_STONE = 0,
  FLOOR_WOOD = 1,
  FLOOR_DIRT = 2,
  FLOOR_GRASS = 3,
  FLOOR_SAND = 4,
  FLOOR_COBBLESTONE = 5,
  FLOOR_MARBLE = 6,
  FLOOR_TILE = 7,
  FLOOR_CARPET_RED = 8,
  FLOOR_CARPET_BLUE = 9,
  FLOOR_CARPET_GREEN = 10,
  FLOOR_CAVE = 11,
  FLOOR_ICE = 12,
  FLOOR_LAVA_EDGE = 13,
  FLOOR_WATER_SHALLOW = 14,
  FLOOR_CHECKERBOARD = 15,

  // ============================================================================
  // ROW 1 (Tiles 16-31): TERRAIN - WALLS
  // ============================================================================
  WALL_STONE = 16,
  WALL_STONE_DARK = 17,
  WALL_BRICK = 18,
  WALL_BRICK_RED = 19,
  WALL_WOOD = 20,
  WALL_CAVE = 21,
  WALL_DUNGEON = 22,
  WALL_CASTLE = 23,
  WALL_ICE = 24,
  WALL_METAL = 25,
  WALL_ROCK = 26,
  WALL_MOSSY = 27,
  WALL_CRACKED = 28,
  WALL_REINFORCED = 29,
  WALL_GLASS = 30,
  WALL_OBSIDIAN = 31,

  // ============================================================================
  // ROW 2 (Tiles 32-47): TERRAIN - DOORS & PASSAGES
  // ============================================================================
  DOOR_CLOSED_WOOD = 32,
  DOOR_OPEN_WOOD = 33,
  DOOR_CLOSED_METAL = 34,
  DOOR_OPEN_METAL = 35,
  DOOR_LOCKED = 36,
  DOOR_BROKEN = 37,
  STAIRS_UP = 38,
  STAIRS_DOWN = 39,
  LADDER_UP = 40,
  LADDER_DOWN = 41,
  PORTAL_BLUE = 42,
  PORTAL_RED = 43,
  PORTAL_GREEN = 44,
  PORTAL_PURPLE = 45,
  GATE_CLOSED = 46,
  GATE_OPEN = 47,

  // ============================================================================
  // ROW 3 (Tiles 48-63): TERRAIN - LIQUIDS & HAZARDS
  // ============================================================================
  WATER_DEEP = 48,
  WATER_SHALLOW = 49,
  WATER_MURKY = 50,
  LAVA = 51,
  LAVA_BUBBLING = 52,
  POISON_POOL = 53,
  ACID_POOL = 54,
  QUICKSAND = 55,
  CHASM = 56,
  VOID = 57,
  SPIKE_TRAP = 58,
  FIRE_TRAP = 59,
  PRESSURE_PLATE = 60,
  ARROW_TRAP = 61,
  PIT_TRAP = 62,
  MAGIC_BARRIER = 63,

  // ============================================================================
  // ROW 4 (Tiles 64-79): OBJECTS - CONTAINERS & FURNITURE
  // ============================================================================
  CHEST_CLOSED = 64,
  CHEST_OPEN = 65,
  CHEST_LOCKED = 66,
  CHEST_TRAPPED = 67,
  BARREL = 68,
  CRATE = 69,
  POT = 70,
  VASE = 71,
  TABLE_WOOD = 72,
  TABLE_STONE = 73,
  CHAIR = 74,
  THRONE = 75,
  BED = 76,
  BOOKSHELF = 77,
  ALTAR = 78,
  STATUE = 79,

  // ============================================================================
  // ROW 5 (Tiles 80-95): OBJECTS - DECORATIVE & INTERACTIVE
  // ============================================================================
  TORCH_WALL = 80,
  TORCH_STAND = 81,
  CANDLE = 82,
  BRAZIER = 83,
  FOUNTAIN = 84,
  WELL = 85,
  ANVIL = 86,
  FORGE = 87,
  LEVER_UP = 88,
  LEVER_DOWN = 89,
  BUTTON = 90,
  CRYSTAL_BLUE = 91,
  CRYSTAL_RED = 92,
  CRYSTAL_GREEN = 93,
  ORB_GLOWING = 94,
  BANNER = 95,

  // ============================================================================
  // ROW 6 (Tiles 96-111): ITEMS - WEAPONS
  // ============================================================================
  SWORD_SHORT = 96,
  SWORD_LONG = 97,
  SWORD_GREAT = 98,
  DAGGER = 99,
  SPEAR = 100,
  AXE = 101,
  AXE_BATTLE = 102,
  MACE = 103,
  HAMMER = 104,
  STAFF_WOOD = 105,
  STAFF_MAGIC = 106,
  BOW = 107,
  CROSSBOW = 108,
  ARROW = 109,
  BOLT = 110,
  WAND = 111,

  // ============================================================================
  // ROW 7 (Tiles 112-127): ITEMS - ARMOR & EQUIPMENT
  // ============================================================================
  HELMET_LEATHER = 112,
  HELMET_IRON = 113,
  HELMET_STEEL = 114,
  ARMOR_LEATHER = 115,
  ARMOR_CHAIN = 116,
  ARMOR_PLATE = 117,
  SHIELD_WOOD = 118,
  SHIELD_IRON = 119,
  SHIELD_STEEL = 120,
  BOOTS = 121,
  GLOVES = 122,
  RING = 123,
  AMULET = 124,
  CLOAK = 125,
  BELT = 126,
  BACKPACK = 127,

  // ============================================================================
  // ROW 8 (Tiles 128-143): ITEMS - CONSUMABLES
  // ============================================================================
  POTION_RED = 128,
  POTION_BLUE = 129,
  POTION_GREEN = 130,
  POTION_YELLOW = 131,
  POTION_PURPLE = 132,
  POTION_ORANGE = 133,
  FLASK_EMPTY = 134,
  SCROLL = 135,
  BOOK_RED = 136,
  BOOK_BLUE = 137,
  BOOK_GREEN = 138,
  TOME = 139,
  FOOD_BREAD = 140,
  FOOD_MEAT = 141,
  FOOD_CHEESE = 142,
  FOOD_APPLE = 143,

  // ============================================================================
  // ROW 9 (Tiles 144-159): ITEMS - TREASURE & COLLECTIBLES
  // ============================================================================
  COIN_GOLD = 144,
  COIN_SILVER = 145,
  COIN_COPPER = 146,
  COIN_PILE = 147,
  GEM_DIAMOND = 148,
  GEM_RUBY = 149,
  GEM_SAPPHIRE = 150,
  GEM_EMERALD = 151,
  CROWN = 152,
  SCEPTER = 153,
  CHALICE = 154,
  KEY_GOLD = 155,
  KEY_SILVER = 156,
  KEY_BRONZE = 157,
  KEY_SKELETON = 158,
  TREASURE_PILE = 159,

  // ============================================================================
  // ROW 10 (Tiles 160-175): CHARACTERS - PLAYER & ALLIES
  // ============================================================================
  PLAYER_WARRIOR = 160,
  PLAYER_MAGE = 161,
  PLAYER_ROGUE = 162,
  PLAYER_CLERIC = 163,
  PLAYER_RANGER = 164,
  PLAYER_PALADIN = 165,
  PLAYER_DRUID = 166,
  PLAYER_BARD = 167,
  NPC_MERCHANT = 168,
  NPC_GUARD = 169,
  NPC_NOBLE = 170,
  NPC_PEASANT = 171,
  NPC_WIZARD = 172,
  NPC_PRIEST = 173,
  COMPANION_DOG = 174,
  COMPANION_CAT = 175,

  // ============================================================================
  // ROW 11 (Tiles 176-191): ENEMIES - COMMON
  // ============================================================================
  ENEMY_GOBLIN = 176,
  ENEMY_ORC = 177,
  ENEMY_KOBOLD = 178,
  ENEMY_SKELETON = 179,
  ENEMY_ZOMBIE = 180,
  ENEMY_GHOST = 181,
  ENEMY_SLIME_GREEN = 182,
  ENEMY_SLIME_BLUE = 183,
  ENEMY_RAT_GIANT = 184,
  ENEMY_BAT = 185,
  ENEMY_SPIDER = 186,
  ENEMY_SNAKE = 187,
  ENEMY_WOLF = 188,
  ENEMY_BEAR = 189,
  ENEMY_BANDIT = 190,
  ENEMY_CULTIST = 191,

  // ============================================================================
  // ROW 12 (Tiles 192-207): ENEMIES - ADVANCED
  // ============================================================================
  ENEMY_TROLL = 192,
  ENEMY_OGRE = 193,
  ENEMY_MINOTAUR = 194,
  ENEMY_GOLEM_STONE = 195,
  ENEMY_GOLEM_IRON = 196,
  ENEMY_ELEMENTAL_FIRE = 197,
  ENEMY_ELEMENTAL_WATER = 198,
  ENEMY_ELEMENTAL_AIR = 199,
  ENEMY_ELEMENTAL_EARTH = 200,
  ENEMY_DEMON = 201,
  ENEMY_IMP = 202,
  ENEMY_WRAITH = 203,
  ENEMY_VAMPIRE = 204,
  ENEMY_WEREWOLF = 205,
  ENEMY_LICH = 206,
  ENEMY_NECROMANCER = 207,

  // ============================================================================
  // ROW 13 (Tiles 208-223): ENEMIES - BOSSES & DRAGONS
  // ============================================================================
  BOSS_DRAGON_RED = 208,
  BOSS_DRAGON_BLUE = 209,
  BOSS_DRAGON_GREEN = 210,
  BOSS_DRAGON_BLACK = 211,
  BOSS_DEMON_LORD = 212,
  BOSS_LICH_KING = 213,
  BOSS_GIANT = 214,
  BOSS_HYDRA = 215,
  BOSS_BEHOLDER = 216,
  BOSS_MIND_FLAYER = 217,
  BOSS_ANCIENT_WYRM = 218,
  BOSS_DARK_KNIGHT = 219,
  BOSS_ARCHMAGE = 220,
  BOSS_VAMPIRE_LORD = 221,
  BOSS_DEATH_KNIGHT = 222,
  BOSS_PRIMORDIAL = 223,

  // ============================================================================
  // ROW 14 (Tiles 224-239): EFFECTS & PARTICLES
  // ============================================================================
  EFFECT_EXPLOSION = 224,
  EFFECT_SMOKE = 225,
  EFFECT_FIRE = 226,
  EFFECT_ICE = 227,
  EFFECT_LIGHTNING = 228,
  EFFECT_POISON_CLOUD = 229,
  EFFECT_HEAL = 230,
  EFFECT_BUFF = 231,
  EFFECT_DEBUFF = 232,
  EFFECT_SPARKLE = 233,
  EFFECT_BLOOD = 234,
  EFFECT_DUST = 235,
  PROJECTILE_FIREBALL = 236,
  PROJECTILE_ICEBALL = 237,
  PROJECTILE_LIGHTNING = 238,
  PROJECTILE_ARROW = 239,

  // ============================================================================
  // ROW 15 (Tiles 240-255): UI & ICONS
  // ============================================================================
  ICON_HEART_FULL = 240,
  ICON_HEART_HALF = 241,
  ICON_HEART_EMPTY = 242,
  ICON_STAR = 243,
  ICON_SKULL = 244,
  ICON_SWORD_CROSSED = 245,
  ICON_SHIELD_EMBLEM = 246,
  ICON_MAGIC_SYMBOL = 247,
  ICON_CURSOR = 248,
  ICON_TARGET = 249,
  ICON_QUESTION = 250,
  ICON_EXCLAMATION = 251,
  ICON_CHECK = 252,
  ICON_CROSS = 253,
  ICON_ARROW_UP = 254,
  ICON_ARROW_DOWN = 255,
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
 * @param tilesetWidth - Width of tileset in tiles (default: 16)
 * @returns Object with x and y coordinates
 *
 * @example
 * ```typescript
 * const coords = getTileCoords(SPRITE_PLAYER);
 * const tileInfo = new LJS.TileInfo(vec2(coords.x, coords.y));
 * ```
 */
export function getTileCoords(
  index: number,
  tilesetWidth: number = 16
): { x: number; y: number } {
  return {
    x: index % tilesetWidth,
    y: Math.floor(index / tilesetWidth),
  };
}
