/*
 * File: raceRegistry.ts
 * Project: littlejs-rl
 * File Created: Thursday, 14th November 2025 11:50:00 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: November 14, 2025
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { DEFAULT_VALUES, validateRaceTemplate } from './validation';
import { MissingDataError, ValidationError, logWarnings } from './errors';

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
   * Register a race template with validation
   */
  public register(race: RaceTemplate | any): void {
    // Validate the race template
    const validation = validateRaceTemplate(race);

    // Log warnings if any
    if (validation.warnings.length > 0) {
      logWarnings(
        validation.warnings,
        `Race Registration: ${validation.data.id}`
      );
    }

    // Throw error if validation failed critically
    if (!validation.isValid) {
      throw new ValidationError(
        `Failed to register race '${validation.data.id}'`,
        validation.errors,
        validation.warnings
      );
    }

    // Check for overwrites
    if (this.races.has(validation.data.id)) {
      console.warn(
        `Race "${validation.data.id}" is already registered. Overwriting...`
      );
    }

    this.races.set(validation.data.id, validation.data);
  }

  /**
   * Register multiple race templates with validation
   */
  public registerMultiple(races: (RaceTemplate | any)[]): void {
    const errors: string[] = [];

    for (const race of races) {
      try {
        this.register(race);
      } catch (error) {
        if (error instanceof ValidationError) {
          errors.push(error.message);
          console.error(error.toString());
        } else {
          errors.push(`Unexpected error registering race: ${error}`);
          console.error(error);
        }
      }
    }

    if (errors.length > 0) {
      console.warn(
        `\nRace registration completed with ${errors.length} error(s). ${this.count()} races registered successfully.`
      );
    }
  }

  /**
   * Get a race template by ID, with optional fallback to default
   */
  public get(
    id: string,
    useFallback: boolean = false
  ): RaceTemplate | undefined {
    const race = this.races.get(id);

    if (!race && useFallback) {
      console.warn(
        `Race '${id}' not found, returning default race template. This should be fixed in your data files.`
      );
      return DEFAULT_VALUES.RACE;
    }

    return race;
  }

  /**
   * Get a race template by ID, throwing error if not found
   */
  public getOrThrow(id: string): RaceTemplate {
    const race = this.races.get(id);
    if (!race) {
      throw new MissingDataError('race', id);
    }
    return race;
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
