/*
 * File: gameCharacter.ts
 * Project: littlejs-rl
 * File Created: Tuesday, 11th November 2025 4:41:14 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 11th November 2025 4:41:20 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

import GameObject from './gameObject';

export default class Character extends GameObject {
  health: number = 100;
  maxHealth: number = 100;
  dv: number = 0;
  pv: number = 0;
  constructor(
    position: LJS.Vector2,
    size: LJS.Vector2 | undefined,
    tileInfo: LJS.TileInfo | undefined,
    angle: number | undefined,
    color: LJS.Color | undefined,
    renderOrder: number | undefined
  ) {
    super(position, size, tileInfo, angle, color, renderOrder);
    this.isSolid = true;
  }
}

export class Player extends Character {
  constructor(
    position: LJS.Vector2,
    size: LJS.Vector2 | undefined,
    tileInfo: LJS.TileInfo | undefined,
    angle: number | undefined,
    color: LJS.Color | undefined,
    renderOrder: number | undefined
  ) {
    super(position, size, tileInfo, angle, color, renderOrder);
  }
}
