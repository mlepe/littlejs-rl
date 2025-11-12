/*
 * File: game.ts
 * Project: littlejs-rl
 * File Created: Tuesday, 11th November 2025 3:05:52 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 12th November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

import {
  aiSystem,
  inputSystem,
  playerMovementSystem,
  renderSystem,
} from './systems';

import ECS from './ecs';
import World from './world';
import { createPlayer } from './entities';

/**
 * Main Game class - Singleton pattern
 * 
 * Manages the ECS, World, and game loop integration with LittleJS.
 * This is the central controller for the game, coordinating between:
 * - Entity Component System (ECS) for game logic
 * - World and Location management for tile-based maps
 * - LittleJS engine for rendering and input
 * 
 * @example
 * ```typescript
 * // Get the game instance
 * const game = Game.getInstance();
 * 
 * // Initialize the game
 * game.init();
 * 
 * // Access game systems
 * const ecs = game.getECS();
 * const world = game.getWorld();
 * const playerId = game.getPlayerId();
 * ```
 */
export default class Game {
  private static instance: Game | null = null;

  // Configuration
  static readonly isDebug = process.env.GAME_DEBUG === 'true';
  static readonly version = process.env.GAME_VERSION;

  // Core systems
  private readonly ecs: ECS;
  private readonly world: World;

  // Game state
  private playerId: number;
  private currentWorldPos: LJS.Vector2;
  private initialized = false;

  /**
   * Private constructor for singleton pattern
   * @param worldSize - Size of the world grid (default: 10x10 locations)
   * @param locationSize - Size of each location (default: 50x50 tiles)
   */
  private constructor(
    worldSize: LJS.Vector2 = LJS.vec2(10, 10),
    locationSize: LJS.Vector2 = LJS.vec2(50, 50)
  ) {
    this.ecs = new ECS();
    this.world = new World(
      worldSize.x,
      worldSize.y,
      locationSize.x,
      locationSize.y
    );
    this.currentWorldPos = LJS.vec2(5, 5); // Start in center
    this.playerId = -1; // Will be set in init
  }

  /**
   * Get singleton instance
   * @param worldSize - Size of the world grid (only used on first creation)
   * @param locationSize - Size of each location (only used on first creation)
   */
  static getInstance(
    worldSize?: LJS.Vector2,
    locationSize?: LJS.Vector2
  ): Game {
    Game.instance ??= new Game(worldSize, locationSize);
    return Game.instance;
  }

  /**
   * Reset the game instance (useful for testing or restarting)
   */
  static reset(): void {
    Game.instance = null;
  }

  /**
   * Initialize the game world and player
   */
  init(): void {
    if (this.initialized) {
      console.warn('Game already initialized');
      return;
    }

    // Set up initial location
    this.world.setCurrentLocation(
      this.currentWorldPos.x,
      this.currentWorldPos.y
    );
    const startLocation = this.world.getCurrentLocation();

    if (startLocation) {
      // Generate the starting location
      startLocation.generate();

      // Create player entity at center of location
      const startX = Math.floor(startLocation.width / 2);
      const startY = Math.floor(startLocation.height / 2);
      this.playerId = createPlayer(
        this.ecs,
        startX,
        startY,
        this.currentWorldPos.x,
        this.currentWorldPos.y
      );

      // Set camera to player position
      LJS.setCameraPos(LJS.vec2(startX, startY));
    }

    // Initialize relations between all entities
    this.world.initializeRelations(this.ecs);

    this.initialized = true;

    if (Game.isDebug) {
      console.log(`Game initialized v${Game.version}`);
      console.log(`Player ID: ${this.playerId}`);
      console.log(`Starting location: ${startLocation?.name}`);
      console.log(
        `Initialized relations for ${this.ecs.query('relation').length} entities`
      );
    }
  }

  /**
   * Main update loop - processes all game systems
   */
  update(): void {
    if (!this.initialized) return;

    // Process systems in order
    inputSystem(this.ecs); // Capture player input
    playerMovementSystem(this.ecs); // Move player based on input
    aiSystem(this.ecs, this.playerId); // AI behaviors for NPCs/enemies

    // Update camera to follow player
    this.updateCamera();
  }

  /**
   * Post-update logic (after LittleJS updates)
   */
  updatePost(): void {
    if (!this.initialized) return;

    // Clean up destroyed entities
    // Handle any post-update logic
  }

  /**
   * Main render loop
   */
  render(): void {
    if (!this.initialized) return;

    const location = this.world.getCurrentLocation();
    if (location) {
      // Render the current location tiles
      if (Game.isDebug) {
        location.renderDebug(); // Shows collision overlay
      } else {
        location.render();
      }
    }

    // Render all entities
    renderSystem(this.ecs);
  }

  /**
   * Post-render logic (overlay rendering)
   */
  renderPost(): void {
    if (!this.initialized) return;

    // Render UI, HUD, etc.
    if (Game.isDebug) {
      this.renderDebugInfo();
    }
  }

  /**
   * Update camera to follow player
   */
  private updateCamera(): void {
    const playerPos = this.ecs.getComponent<{ x: number; y: number }>(
      this.playerId,
      'position'
    );
    if (playerPos) {
      LJS.setCameraPos(LJS.vec2(playerPos.x, playerPos.y));
    }
  }

  /**
   * Render debug information
   */
  private renderDebugInfo(): void {
    const location = this.world.getCurrentLocation();
    const playerPos = this.ecs.getComponent<{ x: number; y: number }>(
      this.playerId,
      'position'
    );

    const debugInfo = [
      `Game v${Game.version}`,
      `FPS: ${LJS.frame}`,
      `Location: ${location?.name || 'None'}`,
      `Player: (${playerPos?.x ?? '?'}, ${playerPos?.y ?? '?'})`,
      `Entities: ${this.ecs.query('position').length}`,
      `Loaded Locations: ${this.world.getLoadedLocationCount()}`,
    ];

    let yPos = 10;
    for (const info of debugInfo) {
      LJS.drawTextScreen(
        info,
        LJS.vec2(10, yPos),
        16,
        LJS.WHITE,
        2,
        LJS.BLACK,
        'left'
      );
      yPos += 20;
    }
  }

  /**
   * Change to a different location
   */
  changeLocation(worldX: number, worldY: number): void {
    // Change to new location
    this.world.setCurrentLocation(worldX, worldY);
    this.currentWorldPos = LJS.vec2(worldX, worldY);

    const newLocation = this.world.getCurrentLocation();

    if (Game.isDebug) {
      console.log(`Changed to location: ${newLocation?.name}`);
    }
  }

  /**
   * Get the ECS instance
   */
  getECS(): ECS {
    return this.ecs;
  }

  /**
   * Get the World instance
   */
  getWorld(): World {
    return this.world;
  }

  /**
   * Get the player entity ID
   */
  getPlayerId(): number {
    return this.playerId;
  }

  /**
   * Get current location
   */
  getCurrentLocation() {
    return this.world.getCurrentLocation();
  }
}
