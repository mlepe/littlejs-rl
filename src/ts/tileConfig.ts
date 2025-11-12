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
 * Each constant maps a sprite name to its index position in the tileset image.
 *
 * Tileset layout is typically a grid where:
 * - Index 0 = top-left tile
 * - Indices increase left-to-right, top-to-bottom
 * - For a 16-tile-wide tileset: tile at (x, y) = y * 16 + x
 *
 * @example
 * ```typescript
 * // Using sprite constants
 * import { SPRITE_PLAYER } from './tileConfig';
 * const tileInfo = new LJS.TileInfo(vec2(SPRITE_PLAYER % 16, Math.floor(SPRITE_PLAYER / 16)));
 * ```
 */

// ============================================================================
// ENTITY SPRITES
// ============================================================================

/** Player character sprite */
export const SPRITE_PLAYER = 120;

/** Standard enemy sprite */
export const SPRITE_ENEMY = 121;

/** Friendly NPC sprite */
export const SPRITE_NPC = 122;

/** Boss enemy sprite */
export const SPRITE_BOSS = 123;

/** Fleeing creature sprite */
export const SPRITE_FLEEING_CREATURE = 124;

// ============================================================================
// TERRAIN SPRITES
// ============================================================================

/** Walkable floor tile */
export const SPRITE_FLOOR = 0;

/** Solid wall tile */
export const SPRITE_WALL = 1;

/** Open door tile */
export const SPRITE_DOOR_OPEN = 2;

/** Closed door tile */
export const SPRITE_DOOR_CLOSED = 3;

/** Stairs going up */
export const SPRITE_STAIRS_UP = 4;

/** Stairs going down */
export const SPRITE_STAIRS_DOWN = 5;

/** Water terrain */
export const SPRITE_WATER = 6;

/** Grass terrain */
export const SPRITE_GRASS = 7;

/** Void/empty space */
export const SPRITE_VOID = 8;

// ============================================================================
// ITEM SPRITES (Example - expand as needed)
// ============================================================================

/** Sword weapon */
export const SPRITE_SWORD = 200;

/** Shield armor */
export const SPRITE_SHIELD = 201;

/** Health potion */
export const SPRITE_POTION_HEALTH = 202;

/** Mana potion */
export const SPRITE_POTION_MANA = 203;

/** Gold coin */
export const SPRITE_COIN = 204;

/** Treasure chest */
export const SPRITE_CHEST = 205;

// ============================================================================
// UI SPRITES (Example - expand as needed)
// ============================================================================

/** Heart icon for health display */
export const SPRITE_HEART = 240;

/** Star icon */
export const SPRITE_STAR = 241;

/** Skull icon */
export const SPRITE_SKULL = 242;

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
