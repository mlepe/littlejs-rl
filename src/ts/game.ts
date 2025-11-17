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

import { BiomeType, LocationType } from './locationType';
import {
  addCharges,
  addConsumable,
  generateItem,
} from './systems/itemGenerationSystem';
import {
  aiSystem,
  cameraSystem,
  chargesSystem,
  collisionDamageSystem,
  deathSystem,
  examineCursorMovementSystem,
  examineRenderSystem,
  examineSystem,
  identificationSystem,
  inputSystem,
  inventoryUISystem,
  itemUsageInputSystem,
  locationTransitionSystem,
  pickupSystem,
  playerMovementSystem,
  renderSystem,
  viewModeTransitionSystem,
  worldMapMovementSystem,
} from './systems';
import { createEnemy, createPlayer } from './entities';

import { DataLoader } from './data/dataLoader';
import ECS from './ecs';
import { ItemComponent } from './components/item';
import { ViewMode } from './components/viewMode';
import { ViewModeComponent } from './components';
import World from './world';
import WorldMap from './worldMap';
import { dropItemAtPosition } from './systems/lootSystem';

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

  // Debug display toggles (runtime toggleable)
  private showCollisionOverlay = false;
  private showDebugText = true; // Default to true

  // Turn-based timing
  private turnTimer = 0;
  private readonly turnDelay = 0.15; // Seconds per turn (150ms)

  // Core systems
  private readonly ecs: ECS;
  private readonly world: World;
  private readonly worldMap: WorldMap;

  // Game state
  private playerId: number;
  private currentWorldPos: LJS.Vector2;
  private initialized = false;

  /**
   * Private constructor for singleton pattern
   * @param worldSize - Size of the world grid (default: 50x30 locations)
   * @param locationSize - Size of each location (default: 70x40 tiles)
   */
  private constructor(
    worldSize: LJS.Vector2 = LJS.vec2(50, 30),
    locationSize: LJS.Vector2 = LJS.vec2(70, 40)
  ) {
    this.ecs = new ECS();
    this.world = new World(
      worldSize.x,
      worldSize.y,
      locationSize.x,
      locationSize.y
    );
    this.worldMap = new WorldMap(this.world);
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
  async init(): Promise<void> {
    if (this.initialized) {
      console.warn('Game already initialized');
      return;
    }

    // Load all game data first
    console.log('[Game] Loading game data...');
    const dataLoader = DataLoader.getInstance();
    await dataLoader.loadAllData();
    console.log('[Game] Game data loaded');

    // Set up initial location (WILDERNESS for open world exploration)
    this.world.setCurrentLocation(
      this.currentWorldPos.x,
      this.currentWorldPos.y,
      LocationType.WILDERNESS,
      BiomeType.FOREST
    );
    const startLocation = this.world.getCurrentLocation();

    if (startLocation) {
      // Generate the starting location
      startLocation.generate();

      // Find walkable spawn position (search from center outward)
      let spawnX = Math.floor(startLocation.width / 2);
      let spawnY = Math.floor(startLocation.height / 2);

      // Search for first walkable tile from center outward
      let found = startLocation.isWalkable(spawnX, spawnY);
      if (!found) {
        for (let radius = 1; radius < 20 && !found; radius++) {
          for (let dx = -radius; dx <= radius && !found; dx++) {
            for (let dy = -radius; dy <= radius && !found; dy++) {
              if (Math.abs(dx) === radius || Math.abs(dy) === radius) {
                const testX = spawnX + dx;
                const testY = spawnY + dy;
                if (startLocation.isWalkable(testX, testY)) {
                  spawnX = testX;
                  spawnY = testY;
                  found = true;
                }
              }
            }
          }
        }
      }

      // Create player entity at walkable position
      this.playerId = createPlayer(
        this.ecs,
        spawnX,
        spawnY,
        this.currentWorldPos.x,
        this.currentWorldPos.y
      );

      // Set camera to player position
      LJS.setCameraPos(LJS.vec2(spawnX, spawnY));

      // Discover starting location and surrounding tiles on world map
      this.worldMap.visitTile(this.currentWorldPos.x, this.currentWorldPos.y);
      this.worldMap.discoverRadius(
        this.currentWorldPos.x,
        this.currentWorldPos.y,
        2
      );

      if (Game.isDebug) {
        console.log(`Player spawned at (${spawnX}, ${spawnY})`);
      }
    }

    // Initialize relations between all entities
    this.world.initializeRelations(this.ecs);

    // Spawn test items for development
    if (Game.isDebug) {
      this.spawnTestItems();
    }

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
   * Spawn test items for development/testing
   * @private
   */
  private spawnTestItems(): void {
    const location = this.world.getCurrentLocation();
    const playerPos = this.ecs.getComponent<{ x: number; y: number }>(
      this.playerId,
      'position'
    );

    if (!location || !playerPos) return;

    // Spawn a test enemy nearby with loot
    const enemyX = Math.floor(playerPos.x + 5);
    const enemyY = Math.floor(playerPos.y);

    if (location.isWalkable(enemyX, enemyY)) {
      const enemyId = createEnemy(
        this.ecs,
        enemyX,
        enemyY,
        this.currentWorldPos.x,
        this.currentWorldPos.y
      );
      console.log(
        `[Debug] Spawned test enemy at (${enemyX}, ${enemyY}) - ID: ${enemyId}`
      );
    }

    // Spawn test items on the ground near player using data system
    const itemX = Math.floor(playerPos.x + 2);
    const itemY = Math.floor(playerPos.y);

    // Generate items from data templates
    const itemsToSpawn = [
      { id: 'health_potion', offsetX: 0 },
      { id: 'bread', offsetX: 1 },
      { id: 'scroll_fireball', offsetX: 2 },
      { id: 'iron_sword', offsetX: 3 },
    ];

    for (const itemDef of itemsToSpawn) {
      const itemId = generateItem(this.ecs, itemDef.id);

      if (this.ecs.hasComponent(itemId, 'item')) {
        dropItemAtPosition(
          this.ecs,
          itemId,
          itemX + itemDef.offsetX,
          itemY,
          this.currentWorldPos.x,
          this.currentWorldPos.y
        );

        const item = this.ecs.getComponent<ItemComponent>(itemId, 'item');
        console.log(
          `[Debug] Spawned ${item?.name || itemDef.id} at (${itemX + itemDef.offsetX}, ${itemY})`
        );
      }
    }

    console.log(
      `[Debug] Spawned ${itemsToSpawn.length} test items near player`
    );
  }

  /**
   * Main update loop - processes all game systems
   */
  update(): void {
    if (!this.initialized) return;

    // Accumulate turn timer
    this.turnTimer += LJS.timeDelta;

    // Only process turn-based actions when timer exceeds delay
    const shouldProcessTurn = this.turnTimer >= this.turnDelay;

    // Always process input (captures key states)
    inputSystem(this.ecs); // Capture player input
    itemUsageInputSystem(this.ecs); // Handle U key press for using items

    // Handle debug toggles from player input
    this.handleDebugToggles();

    // Handle view mode transitions (must be outside turn-based block to respond immediately)
    viewModeTransitionSystem(this.ecs);

    // Handle camera system (outside of turn-based block for immediate response)
    cameraSystem(this.ecs); // Update camera (follow player + zoom)

    // Process turn-based actions only when timer allows
    if (shouldProcessTurn) {
      // Reset turn timer
      this.turnTimer = 0;

      // Check player view mode
      const viewModeComp = this.ecs.getComponent<ViewModeComponent>(
        this.playerId,
        'viewMode'
      );
      const currentViewMode = viewModeComp?.mode || ViewMode.LOCATION;

      // Route to appropriate systems based on view mode
      if (currentViewMode === ViewMode.WORLD_MAP) {
        // World map movement (cursor navigation)
        worldMapMovementSystem(this.ecs);
      } else if (currentViewMode === ViewMode.EXAMINE) {
        // Examine mode (cursor-based inspection)
        examineCursorMovementSystem(this.ecs);
      } else {
        // Location movement and exploration
        pickupSystem(this.ecs); // Handle item pickup
        playerMovementSystem(this.ecs); // Move player based on input
        locationTransitionSystem(this.ecs); // Handle location transitions at edges

        // Item systems
        chargesSystem(this.ecs); // Passive charge regeneration for rods/wands
        identificationSystem(this.ecs); // Auto-identify items based on intelligence

        // Combat (simple collision-based for testing)
        collisionDamageSystem(this.ecs); // Apply damage when entities collide

        aiSystem(this.ecs, this.playerId); // AI behaviors for NPCs/enemies
        deathSystem(this.ecs); // Handle entity death and loot drops
      }
    }
  } /**
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

    // TileLayer and TileCollisionLayer are automatically rendered by LittleJS
    // in this phase (renderOrder 0 and 1)

    // Render collision overlay if enabled (runtime toggle)
    if (this.showCollisionOverlay) {
      const location = this.world.getCurrentLocation();
      if (location) {
        location.renderDebug(); // Shows collision overlay
      }
    }

    // NOTE: Entity rendering moved to renderPost() to ensure
    // entities render AFTER tile layers (which render between render and renderPost)
  }

  /**
   * Post-render logic (overlay rendering)
   *
   * Entities and UI are rendered here to ensure they appear ABOVE tile layers.
   * LittleJS render pipeline: render() → TileLayers → renderPost()
   */
  renderPost(): void {
    if (!this.initialized) return;

    // Render all entities (AFTER tile layers, so they appear on top)
    renderSystem(this.ecs);

    // Check player view mode for examine rendering
    const viewModeComp = this.ecs.getComponent<ViewModeComponent>(
      this.playerId,
      'viewMode'
    );
    const currentViewMode = viewModeComp?.mode || ViewMode.LOCATION;

    // Render examine mode UI overlays
    if (currentViewMode === ViewMode.EXAMINE && viewModeComp) {
      const examineData = examineSystem(
        this.ecs,
        viewModeComp.examineCursorX,
        viewModeComp.examineCursorY
      );
      examineRenderSystem(
        viewModeComp.examineCursorX,
        viewModeComp.examineCursorY,
        examineData
      );
    }

    // Render inventory UI (if in INVENTORY mode)
    if (currentViewMode === ViewMode.INVENTORY) {
      inventoryUISystem(this.ecs, this.playerId);
    }

    // Render debug info if enabled (runtime toggle)
    if (this.showDebugText) {
      this.renderDebugInfo();
    }
  }

  /**
   * Handle debug toggle inputs
   * @private
   */
  private handleDebugToggles(): void {
    const playerEntities = this.ecs.query('player', 'input');

    for (const entityId of playerEntities) {
      const input = this.ecs.getComponent<{
        debugToggleCollision: boolean;
        debugToggleText: boolean;
      }>(entityId, 'input');

      if (!input) continue;

      // Toggle collision overlay
      if (input.debugToggleCollision) {
        this.showCollisionOverlay = !this.showCollisionOverlay;
        console.log(
          `Collision overlay: ${this.showCollisionOverlay ? 'ON' : 'OFF'}`
        );
      }

      // Toggle debug text
      if (input.debugToggleText) {
        this.showDebugText = !this.showDebugText;
        console.log(`Debug text: ${this.showDebugText ? 'ON' : 'OFF'}`);
      }
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
    const viewMode = this.ecs.getComponent<ViewModeComponent>(
      this.playerId,
      'viewMode'
    );

    // Determine current view mode
    const viewModeText =
      viewMode?.mode === ViewMode.WORLD_MAP ? 'WORLD_MAP' : 'LOCATION';

    const debugInfo = [
      `Game v${Game.version}`,
      `FPS: ${LJS.frame}`,
      `View: ${viewModeText}`,
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
   * Get the WorldMap instance
   */
  getWorldMap(): WorldMap {
    return this.worldMap;
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
