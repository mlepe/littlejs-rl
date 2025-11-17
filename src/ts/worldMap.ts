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

import Global from './global';
import { TileSprite } from './tileConfig';
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
  private readonly tileLayer: LJS.TileLayer;
  private readonly tileSize: number = 1; // Each world map tile is 1x1 units (same as locations)

  constructor(world: World) {
    this.world = world;
    this.tiles = new Map();

    // Initialize LittleJS tile layer for world map
    // Position at origin for consistent coordinate system
    const layerPos = LJS.vec2(0, 0);
    const layerSize = LJS.vec2(this.world.width, this.world.height);
    const tileInfo = new LJS.TileInfo(LJS.vec2(0, 0), LJS.vec2(16, 16));

    this.tileLayer = new LJS.TileLayer(
      layerPos,
      layerSize,
      tileInfo,
      Global.RenderOrder.TILE_LAYER_RENDER_ORDER
    );

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
        const biome = this.determineBiome(x, y);
        this.tiles.set(key, {
          worldX: x,
          worldY: y,
          locationType: LocationType.WILDERNESS, // Default
          biome: biome,
          visited: false,
          discovered: false,
        });

        // Set tile layer data (initially undiscovered - very dark)
        this.updateTileLayer(x, y);
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
      this.updateTileLayer(x, y);
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
      this.updateTileLayer(x, y);
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
   * Update tile layer data for a specific tile
   * @private
   */
  private updateTileLayer(x: number, y: number): void {
    const tile = this.getTile(x, y);
    if (!tile) return;

    const tileSprite = this.getBiomeTileSprite(tile.biome);

    // Get biome palette color (floor color represents the biome)
    const biomePalette = getBiomePalette(tile.biome);
    const baseColor = biomePalette.floor;

    // Modify alpha based on discovery state
    let color: LJS.Color;
    if (!tile.discovered) {
      // Undiscovered tiles are very dim (30% alpha)
      color = new LJS.Color(baseColor.r, baseColor.g, baseColor.b, 0.3);
    } else if (tile.visited) {
      // Visited tiles show full color (100% alpha)
      color = new LJS.Color(baseColor.r, baseColor.g, baseColor.b, 1.0);
    } else {
      // Discovered but not visited - dimmed (60% alpha)
      color = new LJS.Color(baseColor.r, baseColor.g, baseColor.b, 0.6);
    }

    const pos = LJS.vec2(x, y);
    const tileData = new LJS.TileLayerData(
      tileSprite,
      0, // direction
      false, // mirror
      color
    );
    this.tileLayer.setData(pos, tileData);
  }

  /**
   * Get tile sprite for a biome
   * @private
   */
  private getBiomeTileSprite(biome: BiomeType): TileSprite {
    switch (biome) {
      case BiomeType.FOREST:
        return TileSprite.FLOOR_GRASS;
      case BiomeType.MOUNTAIN:
        return TileSprite.FLOOR_MOUNTAIN;
      case BiomeType.SNOWY:
        return TileSprite.FLOOR_SNOW;
      case BiomeType.BARREN:
        return TileSprite.FLOOR_BARREN;
      case BiomeType.DESERT:
        return TileSprite.FLOOR_DESERT;
      case BiomeType.BEACH:
        return TileSprite.FLOOR_BEACH;
      case BiomeType.WATER:
        return TileSprite.WATER_DEEP;
      case BiomeType.VOLCANIC:
        return TileSprite.FLOOR_VOLCANIC_ROCK;
      case BiomeType.SWAMP:
        return TileSprite.FLOOR_SWAMP;
      default:
        return TileSprite.FLOOR_STONE;
    }
  }

  /**
   * No cursor rendering - player entity renders via renderSystem
   * World map tiles are 1x1, player moves directly on the map
   */

  /**
   * Render the world map (DEPRECATED - use getTileLayer() instead)
   * TileLayer renders automatically, call renderCursor() for overlay
   * @param cursorX - Current cursor/player X position
   * @param cursorY - Current cursor/player Y position
   * @deprecated Use getTileLayer() to get layer reference and renderCursor() for cursor overlay
   */
  /*render(cursorX: number, cursorY: number): void {
    // TileLayer renders automatically
    this.renderCursor(cursorX, cursorY);
  }*/

  /**
   * Get the tile layer (for direct engine control)
   */
  getTileLayer(): LJS.TileLayer {
    return this.tileLayer;
  }

  /**
   * Redraw the tile layer
   * Call this after updating tiles to make changes visible
   */
  redraw(): void {
    this.tileLayer.redraw();
  }

  /**
   * Recreate the tile layer (needed after destroy())
   * Call this when switching back to world map view
   */
  recreateTileLayer(): void {
    const layerPos = LJS.vec2(0, 0);
    const layerSize = LJS.vec2(this.world.width, this.world.height);
    const tileInfo = new LJS.TileInfo(LJS.vec2(0, 0), Global.vTilesize);

    // Create new tile layer
    (this as any).tileLayer = new LJS.TileLayer(
      layerPos,
      layerSize,
      tileInfo,
      Global.RenderOrder.TILE_LAYER_RENDER_ORDER
    );

    // Restore all tile data
    for (let y = 0; y < this.world.height; y++) {
      for (let x = 0; x < this.world.width; x++) {
        this.updateTileLayer(x, y);
      }
    }

    // Redraw to make visible
    this.tileLayer.redraw();
  }

  /**
   * Get the world reference
   */
  getWorld(): World {
    return this.world;
  }
}
