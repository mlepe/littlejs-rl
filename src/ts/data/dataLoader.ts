/*
 * File: dataLoader.ts
 * Project: littlejs-rl
 * File Created: 2025-11-14 16:00:00
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: November 14, 2025
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { FileLoadError, ParseError, logError } from './errors';

import { AITemplateRegistry } from './aiTemplateRegistry';
import { ClassRegistry } from './classRegistry';
import { EntityRegistry } from './entityRegistry';
import { HealthTemplateRegistry } from './healthTemplateRegistry';
import { RaceRegistry } from './raceRegistry';
import { RenderTemplateRegistry } from './renderTemplateRegistry';
import { StatsTemplateRegistry } from './statsTemplateRegistry';

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
      logError(error as Error, 'DataLoader.loadAllData');
      this.loaded = false;
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
    const raceRegistry = RaceRegistry.getInstance();
    const classRegistry = ClassRegistry.getInstance();

    const errors: Error[] = [];

    // Load component templates first (entities may reference them)
    try {
      await this.loadComponentTemplates();
    } catch (error) {
      errors.push(error as Error);
      logError(error as Error, 'Loading Component Templates');
    }

    // Load races and classes (entities depend on them)
    try {
      await this.loadRaces(raceRegistry);
    } catch (error) {
      errors.push(error as Error);
      logError(error as Error, 'Loading Races');
    }

    try {
      await this.loadClasses(classRegistry);
    } catch (error) {
      errors.push(error as Error);
      logError(error as Error, 'Loading Classes');
    }

    // If critical dependencies failed, stop here
    if (errors.length > 0) {
      throw new Error(
        `Failed to load critical data dependencies (${errors.length} errors). Check logs above.`
      );
    }

    // Load entity definitions
    const entityFiles = [
      'src/data/base/entities/characters.json',
      'src/data/base/entities/template_mixed.json',
    ];

    for (const file of entityFiles) {
      try {
        await entityRegistry.loadFromFile(file);
      } catch (error) {
        logError(error as Error, `Loading ${file}`);
        // Continue loading other files - entity files are not critical
      }
    }

    // Load items
    console.log('[DataLoader] Loading items...');
    try {
      const { ItemRegistry } = await import('./itemRegistry');
      await ItemRegistry.getInstance().loadFromFiles(
        'src/data/base/items/base_items.json',
        'src/data/base/items/item_properties.json'
      );
    } catch (error) {
      logError(error as Error, 'Loading items');
      // Items are critical - rethrow
      throw error;
    }

    // Future: Load other registries
    // await TileRegistry.getInstance().loadFromFile('src/data/base/tiles/tile-definitions.json');
  }

  /**
   * Load component templates for template-mixing
   */
  private async loadComponentTemplates(): Promise<void> {
    console.log('[DataLoader] Loading component templates...');

    const renderRegistry = RenderTemplateRegistry.getInstance();
    const statsRegistry = StatsTemplateRegistry.getInstance();
    const aiRegistry = AITemplateRegistry.getInstance();
    const healthRegistry = HealthTemplateRegistry.getInstance();

    const templateFiles = [
      {
        path: 'src/data/base/templates/render.json',
        registry: renderRegistry,
        name: 'Render',
      },
      {
        path: 'src/data/base/templates/stats.json',
        registry: statsRegistry,
        name: 'Stats',
      },
      {
        path: 'src/data/base/templates/ai.json',
        registry: aiRegistry,
        name: 'AI',
      },
      {
        path: 'src/data/base/templates/health.json',
        registry: healthRegistry,
        name: 'Health',
      },
    ];

    for (const { path, registry, name } of templateFiles) {
      try {
        await registry.loadFromFile(path);
      } catch (error) {
        // Template files are optional - log but continue
        console.warn(
          `[DataLoader] Failed to load ${name} templates from ${path}`
        );
        logError(error as Error, `Loading ${name} Templates`);
      }
    }

    console.log('[DataLoader] Component templates loaded');
  }

  /**
   * Load race definitions
   */
  private async loadRaces(registry: RaceRegistry): Promise<void> {
    console.log('[DataLoader] Loading races...');

    const path = 'src/data/base/races.json';

    try {
      const response = await fetch(path);

      if (!response.ok) {
        throw new FileLoadError(path, response.status);
      }

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (parseError) {
        throw new ParseError(path, parseError as Error);
      }

      if (!data.races || !Array.isArray(data.races)) {
        throw new Error(
          `Invalid data format in ${path}: expected 'races' array`
        );
      }

      registry.registerMultiple(data.races);
      console.log(`[DataLoader] Loaded ${registry.count()} races successfully`);
    } catch (error) {
      if (error instanceof FileLoadError || error instanceof ParseError) {
        throw error;
      }
      throw new Error(`Failed to load races from ${path}: ${error}`);
    }
  }

  /**
   * Load class definitions
   */
  private async loadClasses(registry: ClassRegistry): Promise<void> {
    console.log('[DataLoader] Loading classes...');

    const path = 'src/data/base/classes.json';

    try {
      const response = await fetch(path);

      if (!response.ok) {
        throw new FileLoadError(path, response.status);
      }

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (parseError) {
        throw new ParseError(path, parseError as Error);
      }

      if (!data.classes || !Array.isArray(data.classes)) {
        throw new Error(
          `Invalid data format in ${path}: expected 'classes' array`
        );
      }

      registry.registerMultiple(data.classes);
      console.log(
        `[DataLoader] Loaded ${registry.count()} classes successfully`
      );
    } catch (error) {
      if (error instanceof FileLoadError || error instanceof ParseError) {
        throw error;
      }
      throw new Error(`Failed to load classes from ${path}: ${error}`);
    }
  }

  /**
   * Reload all data (useful for development)
   */
  async reload(): Promise<void> {
    console.log('[DataLoader] Reloading all data...');

    // Clear existing data
    EntityRegistry.getInstance().clear();
    RaceRegistry.getInstance().clear();
    ClassRegistry.getInstance().clear();

    // Clear template registries
    RenderTemplateRegistry.getInstance().clear();
    StatsTemplateRegistry.getInstance().clear();
    AITemplateRegistry.getInstance().clear();
    HealthTemplateRegistry.getInstance().clear();

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
