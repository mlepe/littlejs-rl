/*
 * File: worldMap.ts
 * Project: littlejs-rl
 * File Created: Saturday, 16th November 2025 1:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Saturday, 16th November 2025 1:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

import { BiomeType, LocationType, getBiomePalette } from './locationType';

import World from './world';

/**
 * World Map Tile - Represents a location on the world map
 */
export interface WorldMapTile {
  /** World X coordinate */
  worldX: number;
  /** World Y coordinate */
  worldY: number;
  /** Location type for this tile */
  locationType: LocationType;
  /** Biome type for visual representation */
  biome: BiomeType;
  /** Whether this tile has been visited */
  visited: boolean;
  /** Whether this tile has been discovered (visible on map) */
  discovered: boolean;
}

/**
 * World Map - Visual representation of the world grid
 *
 * Provides a traversable map view where each tile represents a location.
 * Players can navigate the world map and enter individual locations.
 *
 * @example
 * ```typescript
 * const worldMap = new WorldMap(world);
 * worldMap.discoverTile(5, 5);
 * const tile = worldMap.getTile(5, 5);
 * if (tile?.discovered) {
 *   // Render tile
 * }
 * ```
 */
export default class WorldMap {
  private readonly world: World;
  private readonly tiles: Map<string, WorldMapTile>;

  constructor(world: World) {
    this.world = world;
    this.tiles = new Map();

    // Initialize all tiles as undiscovered
    this.initializeTiles();
  }

  /**
   * Initialize world map tiles
   * @private
   */
  private initializeTiles(): void {
    for (let y = 0; y < this.world.height; y++) {
      for (let x = 0; x < this.world.width; x++) {
        const key = this.getKey(x, y);
        this.tiles.set(key, {
          worldX: x,
          worldY: y,
          locationType: LocationType.WILDERNESS, // Default
          biome: this.determineBiome(x, y),
          visited: false,
          discovered: false,
        });
      }
    }
  }

  /**
   * Determine biome based on world position
   * Uses simple procedural generation for variety
   * @private
   */
  private determineBiome(x: number, y: number): BiomeType {
    // Simple biome distribution based on position
    const seed = x * 31 + y * 17;
    const value = Math.abs(Math.sin(seed) * 1000) % 100;

    if (value < 30) return BiomeType.FOREST;
    if (value < 50) return BiomeType.MOUNTAIN;
    if (value < 65) return BiomeType.BARREN;
    if (value < 75) return BiomeType.DESERT;
    if (value < 85) return BiomeType.SWAMP;
    if (value < 92) return BiomeType.BEACH;
    if (value < 96) return BiomeType.SNOWY;
    if (value < 99) return BiomeType.VOLCANIC;
    return BiomeType.WATER;
  }

  /**
   * Generate key for tile lookup
   * @private
   */
  private getKey(x: number, y: number): string {
    return `${x},${y}`;
  }

  /**
   * Get tile at world coordinates
   * @param x - World X coordinate
   * @param y - World Y coordinate
   * @returns Tile data or undefined if out of bounds
   */
  getTile(x: number, y: number): WorldMapTile | undefined {
    return this.tiles.get(this.getKey(x, y));
  }

  /**
   * Discover a tile (make it visible on the map)
   * @param x - World X coordinate
   * @param y - World Y coordinate
   */
  discoverTile(x: number, y: number): void {
    const tile = this.getTile(x, y);
    if (tile) {
      tile.discovered = true;
    }
  }

  /**
   * Mark a tile as visited (player has been to this location)
   * @param x - World X coordinate
   * @param y - World Y coordinate
   */
  visitTile(x: number, y: number): void {
    const tile = this.getTile(x, y);
    if (tile) {
      tile.visited = true;
      tile.discovered = true; // Visiting auto-discovers
    }
  }

  /**
   * Discover tiles in a radius around a position
   * @param centerX - Center world X coordinate
   * @param centerY - Center world Y coordinate
   * @param radius - Radius to discover (default: 1)
   */
  discoverRadius(centerX: number, centerY: number, radius: number = 1): void {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const x = centerX + dx;
        const y = centerY + dy;
        if (this.world.isInBounds(x, y)) {
          this.discoverTile(x, y);
        }
      }
    }
  }

  /**
   * Check if player can move to a world map tile
   * @param x - World X coordinate
   * @param y - World Y coordinate
   * @returns True if movement is valid
   */
  canMoveTo(x: number, y: number): boolean {
    return this.world.isInBounds(x, y);
  }

  /**
   * Render the world map
   * @param cursorX - Current cursor/player X position
   * @param cursorY - Current cursor/player Y position
   */
  render(cursorX: number, cursorY: number): void {
    const tileSize = 2; // Each world map tile is 2x2 units
    const offsetX = -this.world.width;
    const offsetY = -this.world.height;

    for (let y = 0; y < this.world.height; y++) {
      for (let x = 0; x < this.world.width; x++) {
        const tile = this.getTile(x, y);
        if (!tile) continue;

        const posX = offsetX + x * tileSize;
        const posY = offsetY + y * tileSize;

        // Determine tile color
        let color: LJS.Color;
        if (!tile.discovered) {
          // Undiscovered tiles are dark gray
          color = LJS.rgb(0.2, 0.2, 0.2);
        } else if (tile.visited) {
          // Visited tiles show full biome color
          color = getBiomePalette(tile.biome).floor;
        } else {
          // Discovered but not visited - darker biome color
          const biomeColor = getBiomePalette(tile.biome).floor;
          color = LJS.rgb(
            biomeColor.r * 0.6,
            biomeColor.g * 0.6,
            biomeColor.b * 0.6
          );
        }

        // Draw tile
        LJS.drawRect(
          LJS.vec2(posX + tileSize / 2, posY + tileSize / 2),
          LJS.vec2(tileSize * 0.9, tileSize * 0.9),
          color
        );

        // Highlight cursor position
        if (x === cursorX && y === cursorY) {
          LJS.drawRect(
            LJS.vec2(posX + tileSize / 2, posY + tileSize / 2),
            LJS.vec2(tileSize, tileSize),
            LJS.rgb(1, 1, 0), // Yellow highlight
            0,
            false // Outline only
          );
        }
      }
    }
  }

  /**
   * Get the world reference
   */
  getWorld(): World {
    return this.world;
  }
}
