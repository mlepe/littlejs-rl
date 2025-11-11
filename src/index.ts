/*
 * File: index.ts
 * Project: littlejs-rl
 * File Created: Sunday, 9th November 2025 6:22:55 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 11th November 2025 3:32:19 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

'use strict';

import * as LJS from 'littlejsengine';

import Game from './ts/game';
import Global from './ts/global';

const game = new Game(Global.screenSize, Global.tileSize);

///////////////////////////////////////////////////////////////////////////////
function gameInit() {
  // called once after the engine starts up
  // setup the game
  game.init();
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate() {
  // called every frame at 60 frames per second
  // handle input and update the game state
  game.update();
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost() {
  // called after physics and objects are updated
  // setup camera and prepare for render
}

///////////////////////////////////////////////////////////////////////////////
function gameRender() {
  // called before objects are rendered
  // draw any background effects that appear behind objects
  game.render();
  //tileLayers[0].drawTileData(game.center);
  /*for (let x = game.gameSize.x; x--; )
    for (let y = game.gameSize.y; y--; ) {
      tileLayers[0].drawTileData(LJS.vec2(x, y));
    }*/
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost() {
  // called after objects are rendered
  // draw effects or hud that appear above all objects
  //drawTextScreen("Hello World!", G.center, 50);
  game.renderPost();
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
LJS.engineInit(
  gameInit,
  gameUpdate,
  gameUpdatePost,
  gameRender,
  gameRenderPost,
  game.tiles
);
