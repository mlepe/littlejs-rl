/*
 * File: tileSpriteResolver.ts
 * Project: littlejs-rl
 * File Created: Thursday, 20th November 2025 12:00:00 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 20th November 2025 12:00:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

import { TilesetConfig } from './types/dataSchemas';
import { AutoTileSprite } from './tileConfig';

/**
 * TileSpriteResolver - Singleton manager for tileset configurations
 *
 * Manages multiple tileset configurations and resolves symbolic tile sprite names
 * to actual indices based on the active configuration. Similar to ColorPaletteManager
 * but for sprite mappings.
 *
 * Features:
 * - Multiple tileset configurations with different sprite mappings
 * - Runtime configuration switching
 * - Fallback to AutoTileSprite values when no mapping exists
 * - Manages tileset image paths and grid dimensions
 *
 * @example
 * ```typescript
 * // Register configurations
 * const resolver = TileSpriteResolver.getInstance();
 * resolver.registerConfiguration(defaultConfig);
 * resolver.registerConfiguration(pixelArtConfig);
 *
 * // Set active configuration
 * resolver.setConfiguration('default');
 *
 * // Resolve sprite indices
 * const index = resolver.resolve('PLAYER_WARRIOR'); // Returns mapped index
 * const coords = resolver.resolveToCoords('PLAYER_WARRIOR'); // Returns {x, y}
 *
 * // Get tileset info
 * const imagePath = resolver.getTilesetImage(); // 'tileset.png'
 * const tileSize = resolver.getTileSize(); // 16
 * ```
 */
export class TileSpriteResolver {
  private static instance: TileSpriteResolver;

  /** All registered tileset configurations */
  private configurations: Map<string, TilesetConfig> = new Map();

  /** Currently active configuration */
  private activeConfig: TilesetConfig | null = null;

  /** ID of the active configuration */
  private activeConfigId: string | null = null;

  /**
   * Private constructor - use getInstance() instead
   */
  private constructor() {
    // Initialize with empty state
    // Configurations will be loaded from JSON via DataLoader
  }

  /**
   * Get the singleton instance
   *
   * @returns The TileSpriteResolver instance
   */
  public static getInstance(): TileSpriteResolver {
    if (!TileSpriteResolver.instance) {
      TileSpriteResolver.instance = new TileSpriteResolver();
    }
    return TileSpriteResolver.instance;
  }

  /**
   * Register a tileset configuration
   *
   * @param config - The tileset configuration to register
   * @throws Error if configuration ID already exists
   */
  public registerConfiguration(config: TilesetConfig): void {
    if (this.configurations.has(config.id)) {
      console.warn(
        `Tileset configuration '${config.id}' already registered. Overwriting.`
      );
    }

    this.configurations.set(config.id, config);

    // If this is the first configuration, set it as active
    if (!this.activeConfig) {
      this.setConfiguration(config.id);
    }
  }

  /**
   * Set the active tileset configuration
   *
   * @param configId - ID of the configuration to activate
   * @throws Error if configuration doesn't exist
   */
  public setConfiguration(configId: string): void {
    const config = this.configurations.get(configId);

    if (!config) {
      throw new Error(
        `Tileset configuration '${configId}' not found. Available: ${Array.from(this.configurations.keys()).join(', ')}`
      );
    }

    this.activeConfig = config;
    this.activeConfigId = configId;

    console.log(
      `Tileset configuration changed to: ${config.name} (${configId})`
    );
  }

  /**
   * Get the currently active configuration ID
   *
   * @returns The active configuration ID, or null if none set
   */
  public getActiveConfigurationId(): string | null {
    return this.activeConfigId;
  }

  /**
   * Get the currently active configuration
   *
   * @returns The active configuration, or null if none set
   */
  public getActiveConfiguration(): TilesetConfig | null {
    return this.activeConfig;
  }

  /**
   * Get all available configuration IDs
   *
   * @returns Array of configuration IDs
   */
  public getAvailableConfigurations(): string[] {
    return Array.from(this.configurations.keys());
  }

  /**
   * Resolve a sprite name to its index in the active tileset
   *
   * Falls back to AutoTileSprite value if:
   * - No active configuration
   * - Sprite name not in configuration mappings
   * - AutoTileSprite enum has this value
   *
   * @param spriteName - Name of the sprite (e.g., 'PLAYER_WARRIOR')
   * @returns The sprite index in the active tileset
   * @throws Error if sprite name not found in any source
   */
  public resolve(spriteName: string): number {
    // Try active configuration first
    if (this.activeConfig && spriteName in this.activeConfig.mappings) {
      return this.activeConfig.mappings[spriteName];
    }

    // Fall back to AutoTileSprite enum
    if (spriteName in AutoTileSprite) {
      const fallbackValue =
        AutoTileSprite[spriteName as keyof typeof AutoTileSprite];
      if (typeof fallbackValue === 'number') {
        return fallbackValue;
      }
    }

    throw new Error(
      `Sprite '${spriteName}' not found in active tileset configuration or AutoTileSprite enum`
    );
  }

  /**
   * Resolve a sprite name to grid coordinates in the active tileset
   *
   * @param spriteName - Name of the sprite
   * @returns Object with x and y coordinates in the tileset grid
   */
  public resolveToCoords(spriteName: string): { x: number; y: number } {
    const index = this.resolve(spriteName);
    const gridWidth = this.activeConfig?.gridWidth ?? 48; // Default to 48 if no config

    return {
      x: index % gridWidth,
      y: Math.floor(index / gridWidth),
    };
  }

  /**
   * Resolve a sprite name to a LittleJS TileInfo object
   *
   * @param spriteName - Name of the sprite
   * @returns LittleJS TileInfo ready for rendering
   */
  public resolveToTileInfo(spriteName: string): LJS.TileInfo {
    const coords = this.resolveToCoords(spriteName);
    const tileSize = this.getTileSize();

    return new LJS.TileInfo(
      LJS.vec2(coords.x * tileSize, coords.y * tileSize),
      LJS.vec2(tileSize, tileSize)
    );
  }

  /**
   * Get the tileset image path for the active configuration
   *
   * @returns Path to tileset image, or null if no active configuration
   */
  public getTilesetImage(): string | null {
    return this.activeConfig?.image ?? null;
  }

  /**
   * Get the tile size for the active configuration
   *
   * @returns Tile size in pixels (default: 16)
   */
  public getTileSize(): number {
    return this.activeConfig?.tileSize ?? 16;
  }

  /**
   * Get the grid width for the active configuration
   *
   * @returns Grid width in tiles (default: 48)
   */
  public getGridWidth(): number {
    return this.activeConfig?.gridWidth ?? 48;
  }

  /**
   * Get the grid height for the active configuration
   *
   * @returns Grid height in tiles, or null if not specified
   */
  public getGridHeight(): number | null {
    return this.activeConfig?.gridHeight ?? null;
  }

  /**
   * Check if a sprite name exists in the active configuration or AutoTileSprite
   *
   * @param spriteName - Name of the sprite to check
   * @returns True if sprite can be resolved
   */
  public hasSprite(spriteName: string): boolean {
    // Check active configuration
    if (this.activeConfig && spriteName in this.activeConfig.mappings) {
      return true;
    }

    // Check AutoTileSprite enum
    if (spriteName in AutoTileSprite) {
      const value = AutoTileSprite[spriteName as keyof typeof AutoTileSprite];
      return typeof value === 'number';
    }

    return false;
  }

  /**
   * Get all sprite names available in the active configuration
   *
   * @returns Array of sprite names, or empty array if no active configuration
   */
  public getAvailableSprites(): string[] {
    if (!this.activeConfig) {
      return [];
    }

    return Object.keys(this.activeConfig.mappings);
  }

  /**
   * Reset to default state (for testing)
   *
   * @internal
   */
  public reset(): void {
    this.configurations.clear();
    this.activeConfig = null;
    this.activeConfigId = null;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the singleton TileSpriteResolver instance
 *
 * Convenience function for shorter access.
 *
 * @returns The TileSpriteResolver instance
 */
export function getTileSpriteResolver(): TileSpriteResolver {
  return TileSpriteResolver.getInstance();
}

/**
 * Resolve a sprite name to its index using the active tileset configuration
 *
 * Convenience function for quick sprite resolution.
 *
 * @param spriteName - Name of the sprite (e.g., 'PLAYER_WARRIOR')
 * @returns The sprite index
 *
 * @example
 * ```typescript
 * const index = resolveTileSprite('PLAYER_WARRIOR'); // Returns mapped index
 * ```
 */
export function resolveTileSprite(spriteName: string): number {
  return TileSpriteResolver.getInstance().resolve(spriteName);
}

/**
 * Resolve a sprite name to grid coordinates
 *
 * @param spriteName - Name of the sprite
 * @returns Object with x and y coordinates
 *
 * @example
 * ```typescript
 * const coords = resolveTileSpriteCoords('PLAYER_WARRIOR'); // { x: 24, y: 0 }
 * ```
 */
export function resolveTileSpriteCoords(spriteName: string): {
  x: number;
  y: number;
} {
  return TileSpriteResolver.getInstance().resolveToCoords(spriteName);
}

/**
 * Resolve a sprite name to a LittleJS TileInfo object
 *
 * @param spriteName - Name of the sprite
 * @returns LittleJS TileInfo
 *
 * @example
 * ```typescript
 * const tileInfo = resolveTileInfo('PLAYER_WARRIOR');
 * LJS.drawTile(pos, size, tileInfo, color);
 * ```
 */
export function resolveTileInfo(spriteName: string): LJS.TileInfo {
  return TileSpriteResolver.getInstance().resolveToTileInfo(spriteName);
}

/**
 * Set the active tileset configuration
 *
 * Convenience function for configuration switching.
 *
 * @param configId - ID of the configuration to activate
 *
 * @example
 * ```typescript
 * setTilesetConfiguration('pixel-art'); // Switch to pixel art tileset
 * ```
 */
export function setTilesetConfiguration(configId: string): void {
  TileSpriteResolver.getInstance().setConfiguration(configId);
}
