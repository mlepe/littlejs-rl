/*
 * File: world.ts
 * Project: littlejs-rl
 * File Created: Tuesday, 11th November 2025 3:49:50 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Monday, 11th November 2025 11:00:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

import ECS from './ecs';
import Location from './location';
import { RelationComponent } from './components';

/**
 * World - Manages a grid of locations (map areas)
 *
 * The world consists of a grid of locations, each representing a distinct map area.
 * Supports lazy loading/unloading of locations to manage memory efficiently.
 *
 * @example
 * ```typescript
 * const world = new World(10, 10, 50, 50); // 10x10 world, each location is 50x50 tiles
 * world.setCurrentLocation(5, 5);
 * const location = world.getCurrentLocation();
 * ```
 */
export default class World {
  /** Width of the world grid in locations */
  readonly width: number;
  /** Height of the world grid in locations */
  readonly height: number;
  /** Width of each location in tiles */
  readonly locationWidth: number;
  /** Height of each location in tiles */
  readonly locationHeight: number;

  private readonly locations: Map<string, Location>;
  private currentLocation: Location | null;

  /**
   * Create a new world
   * @param width - Width of world grid in locations (default: 10)
   * @param height - Height of world grid in locations (default: 10)
   * @param locationWidth - Width of each location in tiles (default: 50)
   * @param locationHeight - Height of each location in tiles (default: 50)
   */
  constructor(
    width: number = 10,
    height: number = 10,
    locationWidth: number = 50,
    locationHeight: number = 50
  ) {
    this.width = width;
    this.height = height;
    this.locationWidth = locationWidth;
    this.locationHeight = locationHeight;
    this.locations = new Map();
    this.currentLocation = null;
  }

  /**
   * Generate a unique key for location coordinates
   * @private
   */
  private getKey(x: number, y: number): string {
    return `${x},${y}`;
  }

  /**
   * Check if world coordinates are within bounds
   * @param x - World X coordinate
   * @param y - World Y coordinate
   * @returns True if coordinates are valid
   */
  isInBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  /**
   * Get or create a location at the specified world position
   * @param worldX - World X coordinate
   * @param worldY - World Y coordinate
   * @returns The location at the specified position
   * @throws Error if coordinates are out of bounds
   */
  getOrCreateLocation(worldX: number, worldY: number): Location {
    if (!this.isInBounds(worldX, worldY)) {
      throw new Error(`World position out of bounds: ${worldX}, ${worldY}`);
    }

    const key = this.getKey(worldX, worldY);
    let location = this.locations.get(key);

    if (!location) {
      location = new Location(
        LJS.vec2(worldX, worldY),
        this.locationWidth,
        this.locationHeight,
        `Location_${worldX}_${worldY}`
      );
      location.generate();
      this.locations.set(key, location);
    }

    return location;
  }

  /**
   * Get an existing location (does not create if missing)
   * @param worldX - World X coordinate
   * @param worldY - World Y coordinate
   * @returns The location, or undefined if not loaded
   */
  getLocation(worldX: number, worldY: number): Location | undefined {
    return this.locations.get(this.getKey(worldX, worldY));
  }

  /**
   * Set the current active location
   * @param worldX - World X coordinate
   * @param worldY - World Y coordinate
   */
  setCurrentLocation(worldX: number, worldY: number): void {
    this.currentLocation = this.getOrCreateLocation(worldX, worldY);
  }

  /**
   * Get the current active location
   * @returns The current location, or null if none set
   */
  getCurrentLocation(): Location | null {
    return this.currentLocation;
  }

  /**
   * Get all currently loaded locations
   * @returns Array of loaded locations
   */
  getLoadedLocations(): Location[] {
    return Array.from(this.locations.values());
  }

  /**
   * Unload a location to save memory
   * Will not unload the current location
   * @param worldX - World X coordinate
   * @param worldY - World Y coordinate
   */
  unloadLocation(worldX: number, worldY: number): void {
    const key = this.getKey(worldX, worldY);
    const location = this.locations.get(key);

    // Don't unload the current location
    if (location === this.currentLocation) {
      return;
    }

    this.locations.delete(key);
  }

  /**
   * Unload all locations except the current one
   * Useful for memory management when traveling far
   */
  unloadAllExceptCurrent(): void {
    if (!this.currentLocation) return;

    const currentKey = this.getKey(
      this.currentLocation.worldPosition.x,
      this.currentLocation.worldPosition.y
    );

    const keysToDelete: string[] = [];
    for (const key of this.locations.keys()) {
      if (key !== currentKey) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.locations.delete(key);
    }
  }

  /**
   * Render the current location
   */
  render(): void {
    if (this.currentLocation) {
      this.currentLocation.render();
    }
  }

  /**
   * Get the number of currently loaded locations
   * @returns Count of loaded locations
   */
  getLoadedLocationCount(): number {
    return this.locations.size;
  }

  /**
   * Initialize relation components for all entities in the world
   *
   * Creates relation components for each entity targeting every other entity
   * with a base score of 0. Should be called once after world generation
   * and entity creation.
   *
   * @param ecs - The ECS instance containing all entities
   * @param minScore - Minimum relation score (default: -100)
   * @param maxScore - Maximum relation score (default: 100)
   *
   * @example
   * ```typescript
   * // After creating all entities in the world
   * world.initializeRelations(ecs);
   * ```
   */
  initializeRelations(
    ecs: ECS,
    minScore: number = -100,
    maxScore: number = 100
  ): void {
    // Get all entities that can have relations (entities with position component)
    const entities = ecs.query('position');

    // Initialize relation component for each entity
    for (const entityId of entities) {
      // Create empty relation component
      const relationComponent: RelationComponent = {
        relations: new Map(),
      };

      // Add relations to all other entities
      for (const targetId of entities) {
        // Skip self-relations
        if (entityId === targetId) continue;

        // Add relation data for this target
        relationComponent.relations.set(targetId, {
          relationScore: 0,
          minRelationScore: minScore,
          maxRelationScore: maxScore,
        });
      }

      // Add the component to the entity
      ecs.addComponent<RelationComponent>(
        entityId,
        'relation',
        relationComponent
      );
    }
  }
}
