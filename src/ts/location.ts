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
  private readonly backgroundLayer: LJS.TileLayer;
  private readonly foregroundLayer: LJS.TileLayer;

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
    const position = LJS.vec2(0, 0);
    const size = LJS.vec2(width, height);
    const tileInfo = new LJS.TileInfo(LJS.vec2(0, 0), Global.vTilesize);

    this.backgroundLayer = new LJS.TileLayer(position, size, tileInfo);
    this.foregroundLayer = new LJS.TileLayer(position, size, tileInfo);
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

    // Update LittleJS rendering layers
    const tileData = new LJS.TileLayerData(
      tile.spriteIndex,
      0, // direction
      false, // mirror
      LJS.WHITE
    );

    this.backgroundLayer.setData(LJS.vec2(x, y), tileData);

    // Set collision for non-walkable tiles
    if (!tile.walkable) {
      const collisionData = new LJS.TileLayerData(
        tile.spriteIndex,
        0,
        false,
        LJS.WHITE
      );
      this.foregroundLayer.setData(LJS.vec2(x, y), collisionData, true);
    }
  }

  // Get tile at position
  getTile(x: number, y: number): Tile | undefined {
    if (!this.isInBounds(x, y)) return undefined;
    return this.tiles.get(this.getKey(x, y));
  }

  // Add entity to tile
  addEntity(x: number, y: number, entityId: number): boolean {
    const tile = this.getTile(x, y);
    if (!tile?.walkable) return false;

    tile.entities.push(entityId);
    return true;
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

  // Render using LittleJS
  render(): void {
    this.backgroundLayer.render();
    this.foregroundLayer.render();
  }

  // Get all entities at a position
  getEntitiesAt(x: number, y: number): number[] {
    const tile = this.getTile(x, y);
    return tile ? [...tile.entities] : [];
  }
}
