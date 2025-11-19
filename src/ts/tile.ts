/*
 * File: tile.ts
 * Project: littlejs-rl
 * File Created: Monday, 11th November 2025 11:00:00 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Monday, 11th November 2025 11:00:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

import { BaseColor, getColor } from './colorPalette';

/**
 * Tile types available in the game
 */
export enum TileType {
  VOID = 0, // Empty space
  FLOOR = 1, // Walkable floor
  WALL = 2, // Solid wall
  DOOR_OPEN = 3, // Open door
  DOOR_CLOSED = 4, // Closed door
  STAIRS_UP = 5, // Stairs going up
  STAIRS_DOWN = 6, // Stairs going down
  WATER = 7, // Water terrain
  GRASS = 8, // Grass terrain
}

/**
 * Tile - Pure terrain/tile data (no entity storage)
 * Entity positions are stored in ECS PositionComponent instead
 */
export interface Tile {
  /** Type of the tile */
  type: TileType;
  /** Whether entities can walk through this tile */
  walkable: boolean;
  /** Whether line of sight passes through this tile */
  transparent: boolean;
  /** Index in the tileset sprite sheet */
  spriteIndex: number;
  /** Tile color/tint for rendering */
  color: LJS.Color;
}

/**
 * Properties associated with a tile type
 */
export interface TileProperties {
  /** Whether entities can walk through this tile */
  readonly walkable: boolean;
  /** Whether line of sight passes through this tile */
  readonly transparent: boolean;
  /** Collision value for LittleJS physics (0 = no collision, 1 = solid) */
  readonly collisionValue: number;
  /** Base color identifier for this tile type */
  readonly baseColor: BaseColor;
  /** Opacity for non-blocking tiles (0.0-1.0, default 1.0) */
  readonly opacity?: number;
}

// Tile type properties lookup
const TILE_PROPERTIES: Record<TileType, TileProperties> = {
  [TileType.VOID]: {
    walkable: false,
    transparent: true,
    collisionValue: 0,
    baseColor: BaseColor.BLACK,
  },
  [TileType.FLOOR]: {
    walkable: true,
    transparent: true,
    collisionValue: 0,
    baseColor: BaseColor.FLOOR,
  },
  [TileType.WALL]: {
    walkable: false,
    transparent: false,
    collisionValue: 1,
    baseColor: BaseColor.WALL,
  },
  [TileType.DOOR_OPEN]: {
    walkable: true,
    transparent: true,
    collisionValue: 0,
    baseColor: BaseColor.BROWN,
  },
  [TileType.DOOR_CLOSED]: {
    walkable: false,
    transparent: false,
    collisionValue: 1,
    baseColor: BaseColor.BROWN,
  },
  [TileType.STAIRS_UP]: {
    walkable: true,
    transparent: true,
    collisionValue: 0,
    baseColor: BaseColor.LIGHT_GRAY,
  },
  [TileType.STAIRS_DOWN]: {
    walkable: true,
    transparent: true,
    collisionValue: 0,
    baseColor: BaseColor.LIGHT_GRAY,
  },
  [TileType.WATER]: {
    walkable: false,
    transparent: true,
    collisionValue: 0,
    baseColor: BaseColor.WATER,
  },
  [TileType.GRASS]: {
    walkable: true,
    transparent: true,
    collisionValue: 0,
    baseColor: BaseColor.GRASS,
    opacity: 0.7, // Reduced opacity to distinguish from walls
  },
};

/**
 * Get the properties for a specific tile type
 * @param type - The tile type
 * @returns The properties for that tile type
 */
export function getTileProperties(type: TileType): TileProperties {
  return TILE_PROPERTIES[type];
}

/**
 * Map TileType enum to correct sprite indices from TileSprite
 */
const TILE_SPRITE_MAP: Record<TileType, number> = {
  [TileType.VOID]: 0, // TileSprite.VOID
  [TileType.FLOOR]: 1, // TileSprite.FLOOR_STONE
  [TileType.WALL]: 48, // TileSprite.WALL_STONE
  [TileType.DOOR_OPEN]: 97, // TileSprite.DOOR_OPEN_WOOD
  [TileType.DOOR_CLOSED]: 96, // TileSprite.DOOR_CLOSED_WOOD
  [TileType.STAIRS_UP]: 244, // TileSprite.STAIRS_UP
  [TileType.STAIRS_DOWN]: 245, // TileSprite.STAIRS_DOWN
  [TileType.WATER]: 103, // TileSprite.WATER_DEEP
  [TileType.GRASS]: 5, // TileSprite.FLOOR_GRASS
};

/**
 * Create a new tile of the specified type
 * @param type - The tile type to create
 * @param color - Optional custom color (uses palette color if not provided)
 * @returns A new Tile object
 */
export function createTile(type: TileType, color?: LJS.Color): Tile {
  const props = getTileProperties(type);

  return {
    type,
    walkable: props.walkable,
    transparent: props.transparent,
    spriteIndex: TILE_SPRITE_MAP[type] ?? type,
    color: color || getColor(props.baseColor),
  };
}

/**
 * Check if a tile type is walkable
 * @param type - The tile type to check
 * @returns True if walkable
 */
export function isTileWalkable(type: TileType): boolean {
  return getTileProperties(type).walkable;
}

/**
 * Check if a tile type is transparent (for line of sight)
 * @param type - The tile type to check
 * @returns True if transparent
 */
export function isTileTransparent(type: TileType): boolean {
  return getTileProperties(type).transparent;
}

/**
 * Get the collision value for a tile type
 * @param type - The tile type to check
 * @returns Collision value (0 = no collision, 1 = solid)
 */
export function getTileCollisionValue(type: TileType): number {
  return getTileProperties(type).collisionValue;
}

/**
 * Get a human-readable name for a tile type
 * @param type - The tile type
 * @returns Readable name for display
 */
export function getTileName(type: TileType): string {
  const names: Record<TileType, string> = {
    [TileType.VOID]: 'Empty Space',
    [TileType.FLOOR]: 'Stone Floor',
    [TileType.WALL]: 'Stone Wall',
    [TileType.DOOR_OPEN]: 'Open Door',
    [TileType.DOOR_CLOSED]: 'Closed Door',
    [TileType.STAIRS_UP]: 'Stairs Up',
    [TileType.STAIRS_DOWN]: 'Stairs Down',
    [TileType.WATER]: 'Water',
    [TileType.GRASS]: 'Grass',
  };
  return names[type] || 'Unknown';
}
