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
  type: TileType;
  walkable: boolean;
  transparent: boolean; // For line of sight
  spriteIndex: number; // Index in tileset
  color: LJS.Color; // Tile color/tint
}

export interface TileProperties {
  readonly walkable: boolean;
  readonly transparent: boolean;
  readonly collisionValue: number; // 0 = no collision, 1 = solid
  readonly color: LJS.Color;
}

// Tile type properties lookup
const TILE_PROPERTIES: Record<TileType, TileProperties> = {
  [TileType.VOID]: {
    walkable: false,
    transparent: true,
    collisionValue: 0,
    color: LJS.BLACK,
  },
  [TileType.FLOOR]: {
    walkable: true,
    transparent: true,
    collisionValue: 0,
    color: LJS.rgb(0.5, 0.5, 0.5),
  },
  [TileType.WALL]: {
    walkable: false,
    transparent: false,
    collisionValue: 1,
    color: LJS.rgb(0.3, 0.3, 0.3),
  },
  [TileType.DOOR_OPEN]: {
    walkable: true,
    transparent: true,
    collisionValue: 0,
    color: LJS.rgb(0.6, 0.4, 0.2),
  },
  [TileType.DOOR_CLOSED]: {
    walkable: false,
    transparent: false,
    collisionValue: 1,
    color: LJS.rgb(0.5, 0.3, 0.1),
  },
  [TileType.STAIRS_UP]: {
    walkable: true,
    transparent: true,
    collisionValue: 0,
    color: LJS.rgb(0.7, 0.7, 0.3),
  },
  [TileType.STAIRS_DOWN]: {
    walkable: true,
    transparent: true,
    collisionValue: 0,
    color: LJS.rgb(0.6, 0.6, 0.2),
  },
  [TileType.WATER]: {
    walkable: false,
    transparent: true,
    collisionValue: 0,
    color: LJS.rgb(0.2, 0.4, 0.8),
  },
  [TileType.GRASS]: {
    walkable: true,
    transparent: true,
    collisionValue: 0,
    color: LJS.rgb(0.3, 0.7, 0.3),
  },
};

export function getTileProperties(type: TileType): TileProperties {
  return TILE_PROPERTIES[type];
}

export function createTile(type: TileType, color?: LJS.Color): Tile {
  const props = getTileProperties(type);

  return {
    type,
    walkable: props.walkable,
    transparent: props.transparent,
    spriteIndex: type,
    color: color || props.color,
  };
}

export function isTileWalkable(type: TileType): boolean {
  return getTileProperties(type).walkable;
}

export function isTileTransparent(type: TileType): boolean {
  return getTileProperties(type).transparent;
}

export function getTileCollisionValue(type: TileType): number {
  return getTileProperties(type).collisionValue;
}
