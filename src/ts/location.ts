/*
 * File: location.ts
 * Project: littlejs-rl
 * File Created: Tuesday, 11th November 2025 4:12:02 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Monday, 11th November 2025 11:00:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

import { Tile, TileType, createTile } from './tile';

import Global from './global';

export default class Location {
  readonly name: string;
  readonly width: number;
  readonly height: number;
  readonly worldPosition: LJS.Vector2;

  private readonly tiles: Map<string, Tile>; // "x,y" -> Tile
  private readonly tileLayer: LJS.TileLayer;
  private readonly collisionLayer: LJS.TileCollisionLayer;

  constructor(
    worldPosition: LJS.Vector2,
    width: number,
    height: number,
    name?: string
  ) {
    this.name = name || `Location_${worldPosition.x}_${worldPosition.y}`;
    this.worldPosition = worldPosition;
    this.width = width;
    this.height = height;
    this.tiles = new Map();

    // Initialize LittleJS tile layers
    const layerPos = LJS.vec2(width / 2, height / 2); // Center the layer
    const layerSize = LJS.vec2(width, height);
    const tileInfo = new LJS.TileInfo(LJS.vec2(0, 0), Global.vTilesize);

    // Visual tile layer
    this.tileLayer = new LJS.TileLayer(layerPos, layerSize, tileInfo);

    // Collision layer (uses TileCollisionLayer for physics)
    this.collisionLayer = new LJS.TileCollisionLayer(
      layerPos,
      layerSize,
      tileInfo
    );
    this.collisionLayer.initCollision(layerSize);
  }

  // Convert coordinates to map key
  private getKey(x: number, y: number): string {
    return `${x},${y}`;
  }

  // Check if coordinates are valid
  isInBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  // Set tile at position
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

  // Set tile by type (convenience method)
  setTileType(x: number, y: number, type: TileType): void {
    this.setTile(x, y, createTile(type));
  }

  // Get tile at position
  getTile(x: number, y: number): Tile | undefined {
    if (!this.isInBounds(x, y)) return undefined;
    return this.tiles.get(this.getKey(x, y));
  }

  // Add entity to tile
  addEntity(x: number, y: number, entityId: number): boolean {
    if (!this.isWalkable(x, y)) return false;

    const tile = this.getTile(x, y);
    if (!tile) return false;

    tile.entities.push(entityId);
    return true;
  }

  // Add entity at world position (works with Vector2)
  addEntityWorld(worldPos: LJS.Vector2, entityId: number): boolean {
    return this.addEntity(
      Math.floor(worldPos.x),
      Math.floor(worldPos.y),
      entityId
    );
  }

  // Remove entity from tile
  removeEntity(x: number, y: number, entityId: number): void {
    const tile = this.getTile(x, y);
    if (!tile) return;

    const index = tile.entities.indexOf(entityId);
    if (index > -1) {
      tile.entities.splice(index, 1);
    }
  }

  // Move entity from one tile to another
  moveEntity(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    entityId: number
  ): boolean {
    if (!this.addEntity(toX, toY, entityId)) {
      return false;
    }
    this.removeEntity(fromX, fromY, entityId);
    return true;
  }

  // Generate procedural dungeon/location
  generate(): void {
    // Fill with walls
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.setTile(x, y, createTile(TileType.WALL));
      }
    }

    // Create floor space (simple room for now)
    for (let x = 2; x < this.width - 2; x++) {
      for (let y = 2; y < this.height - 2; y++) {
        this.setTile(x, y, createTile(TileType.FLOOR));
      }
    }

    // Add stairs in center
    const centerX = Math.floor(this.width / 2);
    const centerY = Math.floor(this.height / 2);
    this.setTile(centerX, centerY, createTile(TileType.STAIRS_DOWN));
  }

  // Check if position is walkable using collision layer
  isWalkable(x: number, y: number): boolean {
    if (!this.isInBounds(x, y)) return false;

    const pos = LJS.vec2(x, y);
    const collisionValue = this.collisionLayer.getCollisionData(pos);

    // 0 = walkable, 1 = solid
    return collisionValue === 0;
  }

  // Check if world position is walkable (works with Vector2)
  isWalkableWorld(worldPos: LJS.Vector2): boolean {
    return this.isWalkable(Math.floor(worldPos.x), Math.floor(worldPos.y));
  }

  // Get tile collision value at position
  getTileCollision(x: number, y: number): number {
    const pos = LJS.vec2(x, y);
    return this.collisionLayer.getCollisionData(pos);
  }

  // Test if a world space position collides with tiles
  tileCollisionTest(
    worldPos: LJS.Vector2,
    size: LJS.Vector2 = LJS.vec2(1, 1)
  ): boolean {
    return this.collisionLayer.collisionTest(worldPos, size);
  }

  // Render using LittleJS
  render(): void {
    this.tileLayer.render();
    // Collision layer can also be rendered if you want to see collision tiles
    // this.collisionLayer.render();
  }

  // Render with debug collision overlay
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

  // Get all entities at a position
  getEntitiesAt(x: number, y: number): number[] {
    const tile = this.getTile(x, y);
    return tile ? [...tile.entities] : [];
  }

  // Get all entities at world position (works with Vector2)
  getEntitiesAtWorld(worldPos: LJS.Vector2): number[] {
    return this.getEntitiesAt(Math.floor(worldPos.x), Math.floor(worldPos.y));
  }
}
