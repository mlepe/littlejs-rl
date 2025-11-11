/*
 * File: gameObject.ts
 * Project: littlejs-rl
 * File Created: Tuesday, 11th November 2025 3:20:19 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 11th November 2025 3:20:22 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

export default class GameObject extends LJS.EngineObject {
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
