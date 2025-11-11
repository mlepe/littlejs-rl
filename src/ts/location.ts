/*
 * File: location.ts
 * Project: littlejs-rl
 * File Created: Tuesday, 11th November 2025 4:12:02 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 11th November 2025 4:12:13 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

import Global from './global';

export default class Location {
  name?: string;
  position: LJS.Vector2;
  worldPosition: LJS.Vector2;
  tileMapData: number[][];
  tileMap: LJS.TileCollisionLayer[];
  backgroundLayer: LJS.TileCollisionLayer;
  foregroundLayer: LJS.TileCollisionLayer;

  constructor(
    worldPosition: LJS.Vector2,
    tileMapData: number[][],
    name?: string
  ) {
    this.position = LJS.vec2(0, 0);
    this.worldPosition = worldPosition;
    this.tileMapData = tileMapData;
    this.name = name;
    this.backgroundLayer = new LJS.TileCollisionLayer(
      this.position,
      Global.screenSize,
      new LJS.TileInfo(this.position, Global.vTilesize),
      0
    );
    this.foregroundLayer = new LJS.TileCollisionLayer(
      this.position,
      Global.screenSize,
      new LJS.TileInfo(this.position, Global.vTilesize),
      1
    );
    this.tileMap = [this.backgroundLayer, this.foregroundLayer];
  }

  init() {
    throw new Error('Method not implemented.');
    this.buildTileMap();
  }

  buildTileMap() {
    throw new Error('Method not implemented.');
    // Building background layer
    this.backgroundLayer.isSolid = false;
    for (let x = 0; x < this.tileMapData.length; x++) {
      for (let y = 0; y < this.tileMapData[x].length; y++) {
        const tileIndex = this.tileMapData[x][y];
        if (tileIndex > 0) {
          const tile = new LJS.TileCollisionLayer(
            LJS.vec2(x, y),
            Global.vTilesize,
            new LJS.TileInfo(LJS.vec2(x, y), Global.vTilesize),
            1
          );
          const data = new LJS.TileLayerData(tileIndex, 0, false, LJS.WHITE);
          this.backgroundLayer.setData(LJS.vec2(x, y), data);
        }
      }
    }

    // Building foreground layer
    this.foregroundLayer.isSolid = true;
    for (let x = 0; x < this.tileMapData.length; x++) {
      for (let y = 0; y < this.tileMapData[x].length; y++) {
        const tileIndex = this.tileMapData[x][y];
        if (tileIndex > 0) {
          const tile = new LJS.TileCollisionLayer(
            LJS.vec2(x, y),
            Global.vTilesize,
            new LJS.TileInfo(LJS.vec2(x, y), Global.vTilesize),
            1
          );
          const data = new LJS.TileLayerData(tileIndex, 0, false, LJS.WHITE);
          this.foregroundLayer.setData(LJS.vec2(x, y), data);
          this.foregroundLayer.setCollisionData(LJS.vec2(x, y), 1);
        }
      }
    }
  }
}
