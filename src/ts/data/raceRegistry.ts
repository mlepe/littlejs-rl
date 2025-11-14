/*
 * File: raceRegistry.ts
 * Project: littlejs-rl
 * File Created: Thursday, 14th November 2025 11:50:00 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 14th November 2025 11:50:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { RaceTemplate } from '../types/dataSchemas';

/**
 * Registry for race templates
 *
 * Manages all race definitions loaded from JSON data files.
 * Provides lookup and querying capabilities for race data.
 *
 * Singleton pattern ensures only one registry exists.
 */
export class RaceRegistry {
  private static instance: RaceRegistry;
  private races: Map<string, RaceTemplate> = new Map();

  private constructor() {}

  /**
   * Get the singleton instance
   */
  public static getInstance(): RaceRegistry {
    if (!RaceRegistry.instance) {
      RaceRegistry.instance = new RaceRegistry();
    }
    return RaceRegistry.instance;
  }

  /**
   * Register a race template
   */
  public register(race: RaceTemplate): void {
    if (this.races.has(race.id)) {
      console.warn(`Race "${race.id}" is already registered. Overwriting...`);
    }
    this.races.set(race.id, race);
  }

  /**
   * Register multiple race templates
   */
  public registerMultiple(races: RaceTemplate[]): void {
    for (const race of races) {
      this.register(race);
    }
  }

  /**
   * Get a race template by ID
   */
  public get(id: string): RaceTemplate | undefined {
    return this.races.get(id);
  }

  /**
   * Check if a race exists
   */
  public has(id: string): boolean {
    return this.races.has(id);
  }

  /**
   * Get all race IDs
   */
  public getAllIds(): string[] {
    return Array.from(this.races.keys());
  }

  /**
   * Get all race templates
   */
  public getAll(): RaceTemplate[] {
    return Array.from(this.races.values());
  }

  /**
   * Get races by type
   */
  public getByType(type: string): RaceTemplate[] {
    return this.getAll().filter((race) => race.type === type);
  }

  /**
   * Clear all registered races
   */
  public clear(): void {
    this.races.clear();
  }

  /**
   * Get the number of registered races
   */
  public count(): number {
    return this.races.size;
  }
}
