/*
 * File: dataLoader.ts
 * Project: littlejs-rl
 * File Created: 2025-11-14 16:00:00
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: 2025-11-14 16:00:00
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { EntityRegistry } from './entityRegistry';

/**
 * Central data loading system
 * Loads base game data and manages the loading pipeline
 */
export class DataLoader {
  private static instance: DataLoader;
  private loaded = false;
  private loading = false;

  private constructor() {}

  static getInstance(): DataLoader {
    if (!DataLoader.instance) {
      DataLoader.instance = new DataLoader();
    }
    return DataLoader.instance;
  }

  /**
   * Load all game data
   * Call this once during game initialization
   */
  async loadAllData(): Promise<void> {
    if (this.loaded) {
      console.log('[DataLoader] Data already loaded, skipping');
      return;
    }

    if (this.loading) {
      console.warn('[DataLoader] Data loading already in progress');
      return;
    }

    this.loading = true;
    console.log('[DataLoader] Starting data load...');

    try {
      // Load base data
      await this.loadBaseData();

      // Future: Load mods
      // await this.loadMods();

      this.loaded = true;
      console.log('[DataLoader] All data loaded successfully');
    } catch (error) {
      console.error('[DataLoader] Failed to load data:', error);
      throw error;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Load base game data from src/data/base/
   */
  private async loadBaseData(): Promise<void> {
    console.log('[DataLoader] Loading base game data...');

    const entityRegistry = EntityRegistry.getInstance();

    // Load entity definitions
    const entityFiles = ['src/data/base/entities/characters.json'];

    for (const file of entityFiles) {
      try {
        await entityRegistry.loadFromFile(file);
      } catch (error) {
        console.error(`[DataLoader] Failed to load ${file}:`, error);
        // Continue loading other files
      }
    }

    // Future: Load other registries
    // await ItemRegistry.getInstance().loadFromFile('src/data/base/items/weapons.json');
    // await TileRegistry.getInstance().loadFromFile('src/data/base/tiles/tile-definitions.json');
  }

  /**
   * Reload all data (useful for development)
   */
  async reload(): Promise<void> {
    console.log('[DataLoader] Reloading all data...');

    // Clear existing data
    EntityRegistry.getInstance().clear();
    // Future: Clear other registries

    this.loaded = false;
    await this.loadAllData();
  }

  /**
   * Check if data is loaded
   */
  isLoaded(): boolean {
    return this.loaded;
  }

  /**
   * Check if data is currently loading
   */
  isLoading(): boolean {
    return this.loading;
  }
}
