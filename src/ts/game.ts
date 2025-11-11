/*
 * File: game.ts
 * Project: littlejs-rl
 * File Created: Tuesday, 11th November 2025 3:05:52 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 11th November 2025 3:06:21 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

import GameObject from './gameObject';
import { Player } from './gameCharacter';
import Tileset from 'process.env.ASSET_PATH/img/tileset.png';
import World from './world';

export default class Game {
  static readonly isDebug = process.env.GAME_DEBUG === 'true';
  static readonly version = process.env.GAME_VERSION;
  player: GameObject;
  world: World;
  entities: GameObject[];
  tiles: any;

  constructor(screenSize: LJS.Vector2, tileSize: number) {
    this.tiles = [Tileset];
    this.player = new Player(
      LJS.vec2(0, 0),
      LJS.vec2(16, 16),
      LJS.tile(144),
      0,
      LJS.WHITE,
      10
    );
    this.entities = [this.player];
    this.world = new World();
  }

  init() {
    throw new Error('Method not implemented.');
  }
  update() {
    throw new Error('Method not implemented.');
  }
  updatePost() {
    throw new Error('Method not implemented.');
  }
  render() {
    throw new Error('Method not implemented.');
  }
  renderPost() {
    throw new Error('Method not implemented.');
  }
}
