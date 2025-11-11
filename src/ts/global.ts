/*
 * File: global.ts
 * Project: littlejs-rl
 * File Created: Tuesday, 11th November 2025 3:16:02 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 11th November 2025 3:16:08 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

export namespace Global {
  export const screenSize = LJS.vec2(200, 150);
  export const tileSize = 16;
  export const vTilesize = LJS.vec2(tileSize);
}

export default Global;
export type Global = typeof Global;
