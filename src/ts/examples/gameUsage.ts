/*
 * File: gameUsage.ts
 * Project: littlejs-rl
 * File Created: Tuesday, 12th November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 12th November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

/**
 * Example of how to use the Game singleton with LittleJS
 */

import * as LJS from 'littlejsengine';

import Game from '../game';

// Example 1: Basic initialization with LittleJS
export function initGameBasic() {
  // Get singleton instance
  const game = Game.getInstance();

  // Initialize LittleJS engine
  LJS.engineInit(
    async () => {
      // Game initialization
      game.init();
    },
    () => {
      // Game update
      game.update();
    },
    () => {
      // Game update post
      game.updatePost();
    },
    () => {
      // Game render
      game.render();
    },
    () => {
      // Game render post
      game.renderPost();
    },
    ['tileset.png'] // Your tile assets
  );
}

// Example 2: Custom world size
export function initGameCustomSize() {
  // Create larger world: 20x20 locations, each 100x100 tiles
  const game = Game.getInstance(LJS.vec2(20, 20), LJS.vec2(100, 100));

  LJS.engineInit(
    async () => game.init(),
    () => game.update(),
    () => game.updatePost(),
    () => game.render(),
    () => game.renderPost(),
    ['tileset.png']
  );
}

// Example 3: Accessing game components
export function gameComponentAccess() {
  const game = Game.getInstance();

  // Get ECS to create custom entities
  const ecs = game.getECS();

  // Get World to manipulate locations
  const world = game.getWorld();

  // Get player ID for systems
  const playerId = game.getPlayerId();

  // Get current location
  const location = game.getCurrentLocation();

  console.log('Game components:', { ecs, world, playerId, location });
}

// Example 4: Changing locations (e.g., going through stairs)
export function handleLocationChange() {
  const game = Game.getInstance();

  // Player went down stairs - move to next location
  game.changeLocation(5, 6);

  // Or based on player action
  const playerPos = game
    .getECS()
    .getComponent<{ x: number; y: number }>(game.getPlayerId(), 'position');

  if (playerPos) {
    const location = game.getCurrentLocation();
    const tile = location?.getTile(playerPos.x, playerPos.y);

    // Check if player is on stairs
    if (tile?.type === 6) {
      // TileType.STAIRS_DOWN
      game.changeLocation(5, 6); // Move to different location
    }
  }
}

// Example 5: Resetting the game
export function resetGame() {
  // Reset singleton (for new game)
  Game.reset();

  // Get fresh instance
  const game = Game.getInstance();
  game.init();
}

// Example 6: Debug mode usage
export function debugExample() {
  if (Game.isDebug) {
    console.log(`Running debug version ${Game.version}`);

    const game = Game.getInstance();
    const ecs = game.getECS();

    // Get all entities
    const allEntities = ecs.query('position');
    console.log(`Total entities: ${allEntities.length}`);

    // Check player health
    const health = ecs.getComponent<{ current: number; max: number }>(
      game.getPlayerId(),
      'health'
    );
    console.log(`Player health: ${health?.current}/${health?.max}`);
  }
}
