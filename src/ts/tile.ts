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

export interface Tile {
  type: TileType;
  walkable: boolean;
  transparent: boolean; // For line of sight
  spriteIndex: number; // Index in tileset
  entities: number[]; // ECS entity IDs on this tile
}

export function createTile(type: TileType): Tile {
  const walkable =
    type === TileType.FLOOR ||
    type === TileType.DOOR_OPEN ||
    type === TileType.GRASS ||
    type === TileType.STAIRS_UP ||
    type === TileType.STAIRS_DOWN;

  const transparent = type !== TileType.WALL && type !== TileType.DOOR_CLOSED;

  return {
    type,
    walkable,
    transparent,
    spriteIndex: type,
    entities: [],
  };
}
