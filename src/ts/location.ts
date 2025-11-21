/*
 * File: location.ts
 * Project: littlejs-rl
 * File Created: Tuesday, 11th November 2025 4:12:02 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 12th November 2025 12:30:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

import { LocationType } from './locationType';
import { Tile, TileType, createTile } from './tile';
import {
  EnvironmentMetadata,
  createEnvironmentMetadata,
} from './environmentMetadata';
import { BiomeType } from './biomeConfig';

import Global from './global';
import { LocationGenerator } from './locationGenerator';

/**
 * Location - Represents a single map/level in the game world
 *
 * Handles tile data and rendering, but NOT entity storage (ECS handles that).
 * Each location represents a distinct area in the game world with its own:
 * - Tile map (floors, walls, doors, etc.)
 * - Collision data for pathfinding and movement
 * - Visual rendering via LittleJS tile layers
 *
 * Entity positions are stored in the ECS using PositionComponent and
 * LocationComponent, not in the Location object itself.
 *
 * @example
 * ```typescript
 * const location = new Location(vec2(5, 5), 50, 50);
 * location.generate(); // Create procedural layout
 *
 * // Set custom tiles
 * location.setTile(10, 10, createTile(TileType.WATER));
 *
 * // Check walkability
 * if (location.isWalkable(x, y)) {
 *   // Position is walkable
 * }
 *
 * // Render
 * location.render();
 * ```
 */
export default class Location {
  readonly name: string;
  readonly width: number;
  readonly height: number;
  readonly worldPosition: LJS.Vector2;
  readonly metadata: EnvironmentMetadata;

  private readonly tiles: Map<string, Tile>; // "x,y" -> Tile (without entity tracking)
  private readonly tileLayer: LJS.TileLayer;
  private readonly collisionLayer: LJS.TileCollisionLayer;

  constructor(
    worldPosition: LJS.Vector2,
    width: number,
    height: number,
    name?: string,
    locationType: LocationType = LocationType.DUNGEON,
    biome: BiomeType = BiomeType.DEFAULT
  ) {
    this.name = name || `Location_${worldPosition.x}_${worldPosition.y}`;
    this.worldPosition = worldPosition;
    this.width = width;
    this.height = height;
    this.metadata = createEnvironmentMetadata(locationType, biome, this.name);
    this.tiles = new Map();

    // Initialize LittleJS tile layers
    // Layer position should be at origin (0,0) so tile coordinates match world coordinates
    const layerPos = LJS.vec2(0, 0);
    const layerSize = LJS.vec2(width, height);
    const tileInfo = new LJS.TileInfo(LJS.vec2(0, 0), Global.vTilesize);

    // Visual tile layer
    this.tileLayer = new LJS.TileLayer(
      layerPos,
      layerSize,
      tileInfo,
      Global.RenderOrder.TILE_LAYER_RENDER_ORDER
    );

    // Collision layer (uses TileCollisionLayer for physics)
    this.collisionLayer = new LJS.TileCollisionLayer(
      layerPos,
      layerSize,
      tileInfo,
      Global.RenderOrder.TILE_COLLISION_LAYER_RENDER_ORDER
    );
    this.collisionLayer.initCollision(layerSize);
  }

  /**
   * Convert tile coordinates to internal map key
   * @private
   */
  private getKey(x: number, y: number): string {
    return `${x},${y}`;
  }

  /**
   * Check if tile coordinates are within location bounds
   * @param x - Tile X coordinate
   * @param y - Tile Y coordinate
   * @returns True if coordinates are valid
   */
  isInBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  /**
   * Set a tile at the specified position
   * Updates both visual and collision layers
   * @param x - Tile X coordinate
   * @param y - Tile Y coordinate
   * @param tile - The tile data to set
   */
  setTile(x: number, y: number, tile: Tile): void {
    if (!this.isInBounds(x, y)) return;

    this.tiles.set(this.getKey(x, y), tile);

    const pos = LJS.vec2(x, y);

    // Update visual tile layer with color
    const tileData = new LJS.TileLayerData(
      tile.spriteIndex,
      0, // direction
      false, // mirror
      tile.color
    );
    this.tileLayer.setData(pos, tileData);

    // Update collision data (1 = solid, 0 = passable)
    const collisionValue = tile.walkable ? 0 : 1;
    this.collisionLayer.setCollisionData(pos, collisionValue);
  }

  /**
   * Set tile using a tile type (convenience method)
   * @param x - Tile X coordinate
   * @param y - Tile Y coordinate
   * @param type - The tile type to set
   */
  setTileType(x: number, y: number, type: TileType): void {
    this.setTile(x, y, createTile(type));
  }

  /**
   * Get tile data at the specified position
   * @param x - Tile X coordinate
   * @param y - Tile Y coordinate
   * @returns The tile data, or undefined if out of bounds
   */
  getTile(x: number, y: number): Tile | undefined {
    if (!this.isInBounds(x, y)) return undefined;
    return this.tiles.get(this.getKey(x, y));
  }

  /**
   * Get tile type at position (convenience method)
   * @param x - Tile X coordinate
   * @param y - Tile Y coordinate
   * @returns The tile type, or undefined if out of bounds
   */
  getTileType(x: number, y: number): TileType | undefined {
    return this.getTile(x, y)?.type;
  }

  /**
   * Generate procedural location content
   * Uses LocationGenerator to create layout based on location type and biome
   */
  generate(): void {
    LocationGenerator.generate(this);
    // Redraw tile layers after generation to make tiles visible
    this.tileLayer.redraw();
    this.collisionLayer.redraw();
  }

  /**
   * Check if a tile position is walkable
   * @param x - Tile X coordinate
   * @param y - Tile Y coordinate
   * @returns True if the tile can be walked on
   */
  isWalkable(x: number, y: number): boolean {
    if (!this.isInBounds(x, y)) return false;

    const pos = LJS.vec2(x, y);
    const collisionValue = this.collisionLayer.getCollisionData(pos);

    // 0 = walkable, 1 = solid
    return collisionValue === 0;
  }

  /**
   * Check if a world position is walkable (works with Vector2)
   * @param worldPos - World position as Vector2
   * @returns True if the position can be walked on
   */
  isWalkableWorld(worldPos: LJS.Vector2): boolean {
    return this.isWalkable(Math.floor(worldPos.x), Math.floor(worldPos.y));
  }

  /**
   * Get tile collision value at position
   * @param x - Tile X coordinate
   * @param y - Tile Y coordinate
   * @returns Collision value (0 = walkable, 1 = solid)
   */
  getTileCollision(x: number, y: number): number {
    const pos = LJS.vec2(x, y);
    return this.collisionLayer.getCollisionData(pos);
  }

  /**
   * Test if a world space position collides with tiles
   * Integrates with LittleJS physics system
   * @param worldPos - World position to test
   * @param size - Size of the object (default: 1x1)
   * @returns True if collision detected
   */
  tileCollisionTest(
    worldPos: LJS.Vector2,
    size: LJS.Vector2 = LJS.vec2(1, 1)
  ): boolean {
    return this.collisionLayer.collisionTest(worldPos, size);
  }

  /**
   * Render the location using LittleJS tile layers
   */
  render(): void {
    this.tileLayer.render();
    // Collision layer can also be rendered if you want to see collision tiles
    // this.collisionLayer.render();
  }

  /**
   * Render with debug collision overlay
   * Shows collision tiles in semi-transparent red
   */
  renderDebug(): void {
    this.tileLayer.render();

    // Draw collision tiles in semi-transparent red
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (!this.isWalkable(x, y)) {
          const worldPos = LJS.vec2(x + 0.5, y + 0.5);
          LJS.drawRect(worldPos, LJS.vec2(0.9, 0.9), LJS.rgb(1, 0, 0, 0.3));
        }
      }
    }
  }

  /**
   * Get the tile layer (for direct engine control)
   */
  getTileLayer(): LJS.TileLayer {
    return this.tileLayer;
  }

  /**
   * Get the collision layer (for direct engine control)
   */
  getCollisionLayer(): LJS.TileCollisionLayer {
    return this.collisionLayer;
  }

  /**
   * Recreate the tile layers (needed after destroy())
   * Call this when switching back to location view
   */
  recreateLayers(): void {
    const layerPos = LJS.vec2(0, 0);
    const layerSize = LJS.vec2(this.width, this.height);
    const tileInfo = new LJS.TileInfo(LJS.vec2(0, 0), Global.vTilesize);

    // Create new tile layer
    (this as any).tileLayer = new LJS.TileLayer(
      layerPos,
      layerSize,
      tileInfo,
      Global.RenderOrder.TILE_LAYER_RENDER_ORDER
    );

    // Create new collision layer
    (this as any).collisionLayer = new LJS.TileCollisionLayer(
      layerPos,
      layerSize,
      tileInfo,
      Global.RenderOrder.TILE_COLLISION_LAYER_RENDER_ORDER
    );
    this.collisionLayer.initCollision(layerSize);

    // Restore all tile data
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const tile = this.getTile(x, y);
        if (tile) {
          this.setTile(x, y, tile);
        }
      }
    }

    // Redraw to make visible
    this.tileLayer.redraw();
  }

  /**
   * Get the center position of the location
   * Useful for spawning entities or centering camera
   * @returns Vector2 position at the center
   */
  getCenter(): LJS.Vector2 {
    return LJS.vec2(Math.floor(this.width / 2), Math.floor(this.height / 2));
  }

  /**
   * Create a biome-themed floor tile
   * @returns Floor tile with biome-appropriate color
   */
  private createBiomeFloor(): Tile {
    const tile = createTile(TileType.FLOOR, this.metadata.palette.floor);
    return tile;
  }

  /**
   * Create a biome-themed wall tile
   * @returns Wall tile with biome-appropriate color
   */
  private createBiomeWall(): Tile {
    const tile = createTile(TileType.WALL, this.metadata.palette.wall);
    return tile;
  }

  /**
   * Create a biome-themed grass tile (if applicable)
   * @returns Grass tile with biome-appropriate color
   */
  private createBiomeGrass(): Tile {
    const color =
      this.metadata.palette.vegetation || this.metadata.palette.accent;
    const tile = createTile(TileType.GRASS, color);
    return tile;
  }

  /**
   * Create a biome-themed water tile (if applicable)
   * @returns Water tile with biome-appropriate color
   */
  private createBiomeWater(): Tile {
    const color = this.metadata.palette.water || LJS.rgb(0.2, 0.4, 0.8);
    const tile = createTile(TileType.WATER, color);
    return tile;
  }

  /**
   * Find a random walkable position in the location
   * Useful for spawning enemies or items
   * @returns Vector2 position, or null if no walkable tile found
   */
  findRandomWalkablePosition(): LJS.Vector2 | null {
    const maxAttempts = 100;
    for (let i = 0; i < maxAttempts; i++) {
      const x = Math.floor(Math.random() * this.width);
      const y = Math.floor(Math.random() * this.height);
      if (this.isWalkable(x, y)) {
        return LJS.vec2(x, y);
      }
    }
    return null;
  }
}
