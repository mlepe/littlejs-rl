/*
 * File: index.ts
 * Project: littlejs-rl
 * File Created: Sunday, 9th November 2025 6:22:55 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 12th November 2025 1:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

'use strict';

import * as LJS from 'littlejsengine';

import Game from './ts/game';
import Tileset from './assets/img/tileset.png';

// Get the Game singleton instance
const game = Game.getInstance();

/**
 * Game initialization callback
 *
 * Called once after the LittleJS engine starts up.
 * Initializes the game world, player, and ECS.
 */
function gameInit() {
  // Called once after the engine starts up
  // Initialize the game world, player, and ECS
  game.init();

  if (Game.isDebug) {
    console.log('LittleJS Roguelike initialized');
    console.log(`Debug mode: ${Game.isDebug}`);
    console.log(`Version: ${Game.version}`);
  }
}

/**
 * Main update callback
 *
 * Called every frame at 60 frames per second.
 * Processes all game systems (input, movement, AI).
 */
function gameUpdate() {
  // Called every frame at 60 frames per second
  // Process all game systems (input, movement, AI)
  game.update();
}

/**
 * Post-update callback
 *
 * Called after physics and objects are updated.
 * Handles post-update logic and cleanup.
 */
function gameUpdatePost() {
  // Called after physics and objects are updated
  // Post-update logic and cleanup
  game.updatePost();
}

/**
 * Main render callback
 *
 * Called before objects are rendered.
 * Renders the current location tiles and entities.
 */
function gameRender() {
  // Called before objects are rendered
  // Render the current location tiles and entities
  game.render();
}

/**
 * Post-render callback
 *
 * Called after objects are rendered.
 * Renders UI, HUD, and debug information.
 */
function gameRenderPost() {
  // Called after objects are rendered
  // Render UI, HUD, and debug information
  game.renderPost();
}

/**
 * Start the LittleJS Engine
 *
 * Initializes the engine with game callbacks and tileset assets.
 */
LJS.engineInit(
  gameInit,
  gameUpdate,
  gameUpdatePost,
  gameRender,
  gameRenderPost,
  [Tileset]
);
